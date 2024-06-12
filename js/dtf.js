/**
 * Startup function
 */
function startup() {
  fireBase();
  funkyValues();
  document.querySelector("#Export").addEventListener("click", exportFault);
  document.querySelector("#Clear").addEventListener("click", clearFaults);
  javaread();
  // await code here
  document.onkeyup = () => {
    try { read(); } catch (e) { logError(e); }
  };
  document.querySelectorAll('input').forEach(inp => {
    if (inp.type === "checkbox" || inp.type === "radio") inp.onchange = function () { read(); };
  });
}

/**
 * Saves dat file and checks if it is binary that needs converting
 * @param data data to be saved
 * @param filecontent data before being parsed by papaparse
 */
function saveDAT(data, filecontent) {
  data.pop(); //remove last empty line
  data = typeof data[0][0] !== "number" ? binary2ASCII(filecontent) : data;
  localStorage.setItem("isDAT", true);
  saveIndexedDB(data);
}

/**
 * Saves data in the local object store
 * @param data data to be saved
 */
function saveIndexedDB(data) {
  const transaction = db.transaction(["plots"], "readwrite");
  const objectStore = transaction.objectStore("plots");
  objectStore.put({ data });
  read();
}

/**
 * Reads fault data from storage and sends for plotting
 */
function read() {
  const transaction = db.transaction(["plots"], "readonly");
  const objectStore = transaction.objectStore("plots");
  objectStore.getAll().onsuccess = (event) => {
    const cursor = event.target.result;
    plotProtection(cursor);
  }
}

/**
 * Reads the input file(s) and sends them for processing and storage
 */
function javaread() {
  document.querySelector("#rel_upload").onchange = function (evt) {
    if (!window.FileReader) return; // Browser is not compatible
    Array.from(evt.target.files).forEach(file => {
      const reader = new FileReader();
      reader.readAsBinaryString(file)

      reader.onload = function (evt) {
        if (evt.target.readyState !== 2) return;
        if (evt.target.error) {
          logError('Error while reading file');
          return;
        }
        const filecontent = evt.target.result;
        const DR = Papa.parse(filecontent, { dynamicTyping: true }).data;
        const cfgdata = JSON.parse(localStorage.getItem("CFGdatas")) || [];
        localStorage.setItem("filename", file.name.substring(0, file.name.length - 4));
        if (/cfg/i.test(file.name)) localStorage.setItem("CFGdatas", JSON.stringify([...cfgdata, DR]));
        if (/dat/i.test(file.name)) saveDAT(DR, filecontent);
      };
    });
  };
  if (idbSupported) {
    const openRequest = indexedDB.open("dtf", 1);
    openRequest.onupgradeneeded = dbUpgrade(db);
    openRequest.onsuccess = (e) => {
      db = e.target.result;
      const transaction = db.transaction(["plots"]);
      const objectStore = transaction.objectStore("plots");
      const request = objectStore.get("2");
      request.onsuccess = () => {
        try { read(); } catch (e) { logError(e); }
      };
    }
  }
}

/**
 * Plots the protection to the dygraphs and checks what protection is selected
 * @param records distrubance records
 */
function plotProtection(records) {
  let [totvolarray, totZarray] = [[], []];
  records.forEach((rec, ind) => {
    const { volarray, Zarray } = addDATtoArray(rec.data, ind);
    const shifted = synchronizeSineWaves(totvolarray, volarray);
    totvolarray = [...totvolarray, [volarray[0][0], , , , ,], ...shifted];
    totZarray = [...totZarray, ...Zarray];
  });
  if (totvolarray.length > 1) {
    summaryTable(totvolarray, totZarray);
    dygPlot2(totvolarray, 'graphdiv2');
    dygPlot2(totvolarray, 'graphdiv3');
    Dygraph.synchronize(graphdiv2, graphdiv3, {
      range: false //syncs only x axis
    });
  }
}

/**
 * Process dat file to array
 * @param DR disturbance record
 * @param ind index to get correct config
 * @returns returns fault array in impedance and voltages, currents, and and zone trip, CB open array
 */
function addDATtoArray(DR, ind) {
  const { vmul, cmul, stime, Z1, Z2, Z3, CBo, trdr, vtrdr, v, c } = getCFG(ind);
  const [volarray, Zarray] = [[], []];
  if (DR.length === 0) return { volarray, Zarray };
  const freq = 50;
  const sample = DR[1][1] > 1 ? DR[1][1] / 1_000_000 : DR[1][1] / 1_000;
  const period = Math.round((1 / freq) / sample);
  const omega = 2 * Math.PI * freq;

  function FFTcalc(periodSamples, DR, ind, isSin) {
    const CosOrSin = isSin ? Math.sin : Math.cos;
    return (2 / period) * periodSamples.reduce((sum, val, idx) => sum + val[ind] * CosOrSin(omega * DR[idx][1] / 1_000_000), 0);
  }

  for (let i = 1; i < DR.length - period; i++) { //add data to array
    const periodSamples = DR.slice(i, i + period);
    const vr = FFTcalc(periodSamples, DR, v, false); // Cosine for vr
    const vi = FFTcalc(periodSamples, DR, v, true);  // Sine for vi
    const cr = FFTcalc(periodSamples, DR, c, false); // Cosine for cr
    const ci = FFTcalc(periodSamples, DR, c, true);  // Sine for ci
    const vmag = Math.sqrt(vr * vr + vi * vi) / Math.SQRT2 * vmul * vtrdr;
    const cmag = Math.sqrt(cr * cr + ci * ci) / Math.SQRT2 * cmul * vtrdr * trdr;
    const vlog = DR[i][v] * vmul * vtrdr;
    const clog = DR[i][c] * cmul * vtrdr * trdr;
    const time = stime + (DR[i][1] / 1_000_000);

    volarray.push([time, vmag, cmag, vlog, clog]);
    Zarray.push([time, DR[i][Z1], DR[i][Z2], DR[i][Z3], DR[i][CBo]]);
  }
  if (volarray.length === 0) return { faultarray, volarray, Zarray };
  return { volarray, Zarray };
}

/**
 * Process the cfg file to get all necessary info and column numbers
 * @param ind index to get correct config
 * @returns cfg object with all the saved parameters
 */
function getCFG(ind = 0) {
  const data = JSON.parse(localStorage.getItem("CFGdatas"))[ind] || false;
  if (!data) return { title: localStorage.getItem("filename"), sdate: "" };
  const cfg = { vmul: 1, cmul: 1, stime: 0 };
  const ar = [];
  data.forEach((x, ind) => {
    cfg.Z1 = /Zone 1 Trip|Trip Z1|Trip signal Z1/i.test(x[1]) ? ind : cfg.Z1;
    cfg.Z2 = /Zone 2 Trip|Trip Z2|Trip signal Z2\/t2S/i.test(x[1]) ? ind : cfg.Z2;
    cfg.Z3 = /Zone 3 Trip|Trip Z3|Trip signal Z3\/t3S/i.test(x[1]) ? ind : cfg.Z3;
    cfg.CBo = /CB Closed|Brk Aux NO/i.test(x[1]) ? ind : cfg.CBo;
    if (typeof x[1] === "string" && x[1].split(":").length > 2) ar.push(x);
  });
  [, cfg.ana, cfg.dig] = data[1];
  cfg.ana = Number(cfg.ana.replace(/\D/g, ''));
  cfg.dig = Number(cfg.dig.replace(/\D/g, ''));
  for (let i = cfg.ana + 2; i >= 2; i--) {
    cfg.v = /V/i.test(data[i][4]) ? i : cfg.v;
    cfg.c = /A/i.test(data[i][4]) ? i : cfg.c;
  }
  cfg.vtrdr = data[cfg.v][10] / data[cfg.v][11];
  cfg.trdr = data[cfg.c][10] / data[cfg.c][11] / cfg.vtrdr;
  cfg.vmul = Number(data[cfg.v][5]);
  cfg.cmul = Number(data[cfg.c][5]);
  cfg.sdate = ar[0][1] || "";
  const circuit = data[0][0] === null ? localStorage.getItem("filename") : data[0][0];
  cfg.title = `${circuit.replace(/\,/g, " ")},${ar[0]}`;
  cfg.stime = Number(cfg.sdate.split(":").pop()) || 0;
  return cfg;
}

/**
 * Plot analog rms magnitude voltages and currents
 * @param data voltages and currents
 * @param graph what graph to use
 */
async function dygPlot2(data, graph) {
  try {
    if (typeof window[graph] !== 'undefined') window[graph].destroy();
  } catch (e) { logError(e); }
  const { title } = getCFG();
  window[graph] = new Dygraph(
    document.getElementById(graph),
    data,
    {
      labels: ['a', 'Voltage (V)', 'Current (A)', 'Voltage (V) ', 'Current (A) '],
      xlabel: "Time (s.ms)",
      ylabel: "Voltage (kV)",
      title,
      y2label: "Current (kA)",
      legend: 'always',
      colors: ["blue", "red", "blue", "red"],
      includeZero: true,
      series: {
        'Current (A)': {
          axis: 'y2'
        },
        'Current (A) ': {
          axis: 'y2'
        },
      },
      axes: {
        x: {
          axisLabelFormatter: (y) => `${smoothdec(y % 1 * 1000, 3)} ms`
        },
        y: {
          axisLabelFormatter: (y) => `${smoothdec(y / 1000)} kV`,
          axisLabelWidth: 60
        },
        y2: {
          axisLabelFormatter: (y) => `${smoothdec(y / 1000)} kA`,
          axisLabelWidth: 60
        }
      },
    }          // options
  );
  const bool = graph === 'graphdiv2';
  window[graph].setVisibility(0, bool);
  window[graph].setVisibility(1, bool);
  window[graph].setVisibility(2, !bool);
  window[graph].setVisibility(3, !bool);
  window[graph].ready(function () {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  });
}

/**
 * Creates summary table
 * @param data Voltage and current array
 * @param Zarray Zone array timers
 */
function summaryTable(data, Zarray) {
  let maxfault = 0;
  let voltage = 0;
  const [Z1times, Z2times, Z3times, CBotimes] = [[], [], [], []];
  const multi = smoothdec((data[1][0] - data[0][0]) * 1000) < 1 ? 1.3 : 2; //bigger multiplier for 1ms interval
  const column = ["Fault Level", "Fault Duration", "Fault Start", "Fault Finish", "Zone 1", "Zone 2", "Zone 3"];
  const timers = JSON.parse(localStorage.getItem("ZoneTimers")) || ["", "", ""];
  let duration = Number(data[0][0]);
  let endflag = true;
  timers.unshift(`${smoothdec(data[0], 3)} s`);
  data.forEach(x => {
    if (maxfault > x[2] * multi && voltage < x[1] && endflag) {
      duration = x[0] - duration;
      timers.splice(1, 0, `${smoothdec(x[0], 3)} s`);
      endflag = false;
    }
    maxfault = Math.max(maxfault, x[2]);
    voltage = Math.min(voltage, x[1]);
  });
  Zarray.forEach(x => {
    if (x[1] === 1) Z1times.push(` at ${smoothdec(x[0], 3)}s`);
    if (x[2] === 1) Z2times.push(` at ${smoothdec(x[0], 3)}s`);
    if (x[3] === 1) Z3times.push(` at ${smoothdec(x[0], 3)}s`);
    if (x[4] === 0) CBotimes.push(`${smoothdec(x[0], 3)}s`);
  });
  timers[2] += Z1times[0] || "";
  timers[3] += Z2times[0] || "";
  timers[4] += Z3times[0] || "";
  timers[1] = CBotimes[0] || timers[1];
  duration = duration === 0 ? "???" : smoothdec(duration * 1000, 0);
  if (endflag) timers.unshift("Error", "Error");
  const column2 = [`${smoothdec(maxfault / 1000)} kA`, `${duration} ms`, ...timers];
  const summaryArr = column.map((x, i) => [x, column2[i]]);
  table(summaryArr);
}

/**
 * Inserts summary table
 * @param rows array with summary info
 */
function table(rows) {
  const tabdiv = document.querySelector("#SummaryTable");
  const myTable = document.createElement("table");
  myTable.classList.add("scores");
  const row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = "<th>Item</th>";
  row.insertCell(1).outerHTML = "<th>Result</th>";
  insertRow(rows, myTable);
  while (tabdiv.childElementCount > 1) tabdiv.removeChild(tabdiv.lastChild);
  tabdiv.appendChild(myTable);
}

/**
 * Opens import fault page
 */
function importFault() {
  window.open("faultimport.html", "_self");
}

/**
 * Export fault to csv
 */
function exportFault() {

}

/**
 * Clear database faults
 */
function clearFaults() {
  const transaction = db.transaction(["plots"], "readwrite");
  const objectStore = transaction.objectStore("plots");
  objectStore.clear();
  window.graphdiv2.destroy();
  window.graphdiv3.destroy();
  localStorage.removeItem("CFGdatas");
  table();
}

/**
 * Converts binary 2D array to ASCII 2D array
 * @param data Input binary array
 * @returns ASCII array
 */
function binary2ASCII(data) {
  const bin = [...data].map(c => c.charCodeAt(0).toString(16));
  const { ana, dig } = getCFG();
  const diglen = 2 * Math.ceil(dig / 16);
  const bytes = ana * 2 + diglen + 8;
  const ASCII = [];
  for (let i = 0; i <= bin.length / bytes; i++) {
    ASCII.push([]);
  }
  ASCII.pop();
  bin.forEach((x, ind) => {
    x = x.length < 2 ? `0${x}` : x;
    ASCII[Math.floor(ind / bytes)].push(x);
  });
  ASCII.forEach(x => {
    x[0] = hex2dec(x, 0, 4);
    x[1] = hex2dec(x, 4, 8);
    for (let i = 0; i < ana; i++) {
      x[2 + i] = hex2dec(x, 8 + i * 2, 10 + i * 2);
    }
    x.splice(ana + 2, bytes - ana - 2, ...hex2bin(x, ana * 2 + 8, bytes));
  });
  return ASCII;
}

/**
 * Converts hex to dec for analog signals
 * @param x Hex array
 * @param fir Start of hex array
 * @param sec End of hex array
 * @returns Dec array
 */
const hex2dec = (x, fir, sec) => {
  x = parseInt(x.slice(fir, sec).reverse().join(""), 16);
  return sec - fir <= 2 && (x & 0x8000) > 0 ? x - 0x10000 : x; //signed integer so that FFFF is -1
}

/**
 * Converts hex to binary for digital signals
 * @param x Hex array
 * @param fir Start of hex array
 * @param sec End of hex array
 * @returns Binary array
*/
const hex2bin = (x, fir, sec) => {
  x = x.slice(fir, sec).reverse();
  let bin = "";
  x.forEach(a => (bin = `${bin}${parseInt(a, 16).toString(2).padStart(8, "0")}`));
  return [...bin].reverse().map(x => Number(x));
}

/**
 * Adjust phase of wave2 to synchronize with wave1
 * @param wave1 first wave
 * @param wave2 second wave
 * @returns synced wave
*/
function synchronizeSineWaves(wave1, wave2) {
  wave1.shift(); //remove empty 
  if (wave1.length === 0) return wave2;
  // Find the best phase difference that minimizes error across the entire waves
  let minError = Number.MAX_SAFE_INTEGER;
  let bestPhaseDifference = 0;
  const sampleRate = wave2[2][0] - wave2[1][0];
  const sampleRate1 = wave1[2][0] - wave1[1][0];
  const timeTooBig = Math.abs(wave1[1][0] - wave2[1][0]) > 1;
  const sampleDiff = Math.round(Math.max(sampleRate, sampleRate1) / Math.min(sampleRate, sampleRate1));
  const wavemul1 = sampleRate > sampleRate1 ? sampleDiff : 1;
  const wavemul2 = sampleRate < sampleRate1 ? sampleDiff : 1;

  while (wave1[1][0] < (wave2[1][0] - sampleRate1 / 2) && !timeTooBig) wave1.shift();
  while (wave2[1][0] < (wave1[1][0] - sampleRate / 2) && !timeTooBig) wave2.shift();

  const fullcycle = 1 / 50 / Math.max(sampleRate, sampleRate1); //samples for full cycle
  for (let phaseDiff = 0; phaseDiff < fullcycle * 2; phaseDiff++) {
    let error = 0; let error2 = 0;
    for (let i = 0; i < fullcycle * 2; i++) {
      const diff = wave1[i * wavemul1][3] - wave2[i * wavemul2 + phaseDiff][3];
      const diff2 = wave2[i * wavemul2][3] - wave1[i * wavemul1 + phaseDiff][3];
      error += Math.abs(diff);
      error2 += Math.abs(diff2);
    }
    if (error < minError) {
      minError = error;
      bestPhaseDifference = -phaseDiff;
    }
    if (error2 < minError) {
      minError = error2;
      bestPhaseDifference = phaseDiff;
    }
  }
  wave2.forEach(wav => wav[0] = wav[0] + bestPhaseDifference * sampleRate);
  return wave2;
}

let idbSupported = "indexedDB" in window ? true : false;
let db;
//startup
startup();
