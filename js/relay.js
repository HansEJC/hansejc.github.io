/**
 * Shows and hides advanced tab
 */
function checkit() {
  const x = document.getElementById("Sec").checked || document.querySelector("#advanced").checked;
  const y = document.getElementById("hide");
  y.style.display = x ? "block" : "none";
  vtRatio();
  ctRatio();
}

/**
 * Saves csv file and saves headers
 * @param data data to be saved
 */
function saveCSV(data) {
  if (typeof data[1][0] === "string") {
    data.pop(); //remove last empty line
    data.forEach(x => {
      x.shift();
      x[0] = Number(x[0].split(":").pop()); //extracts seconds from timestamp
    });
  }
  const headers = JSON.stringify(data.shift());
  localStorage.setItem("headers", headers);
  localStorage.setItem("isDAT", false);
  saveIndexedDB(data);
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
  getIndex();
  const transaction = db.transaction(["plots"], "readwrite");
  const objectStore = transaction.objectStore("plots");
  objectStore.put({ id: 1, data });
  plotProtection(data);
}

/**
 * Reads fault data from storage and sends for plotting
 */
function read() {
  const transaction = db.transaction(["plots"], "readonly");
  const objectStore = transaction.objectStore("plots");
  objectStore.openCursor(null, "prev").onsuccess = async function (event) {
    const cursor = event.target.result;
    try {
      plotProtection(cursor.value.data);
    } catch (err) { }
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
        localStorage.setItem("filename", file.name.substring(0, file.name.length - 4));
        if (/csv/i.test(file.name)) saveCSV(DR);
        if (/cfg/i.test(file.name)) localStorage.setItem("CFGdata", JSON.stringify(DR));
        if (/dat/i.test(file.name)) saveDAT(DR, filecontent);
        if (/xrio/i.test(file.name)) xrio(filecontent);
        if (/\.rio/i.test(file.name)) rio(filecontent);
      };
    });
  };
  if (idbSupported) {
    const openRequest = indexedDB.open("graph", 1);
    openRequest.onupgradeneeded = dbUpgrade(db);
    openRequest.onsuccess = function (e) {
      db = e.target.result;
      const transaction = db.transaction(["plots"]);
      const objectStore = transaction.objectStore("plots");
      const request = objectStore.get("2");
      request.onerror = function (event) {
      };
      request.onsuccess = function (event) {
        try { read(); } catch (e) { logError(e); }
      };
    }
  }
}

/**
 * Startup function
 */
function startup() {
  fireBase();
  getIndex();
  funkyValues();
  document.querySelector("#Import").addEventListener("click", importFault);
  document.querySelector("#Export").addEventListener("click", exportFault);
  document.querySelector("#VTR").addEventListener("keyup", vtRatio);
  document.querySelector("#CTR").addEventListener("keyup", ctRatio);
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = (getSavedValue(box.id) === "true");
  });
  javaread();
  // await code here
  const DR = [];
  plotProtection(DR);
  document.onkeyup = () => {
    try { read(); } catch (e) { logError(e); }
  };
  document.querySelectorAll('input[type=radio]').forEach(inp => {
    inp.onchange = function () { read(); checkit(); };
    inp.checked = getSavedValue(inp.id) === "true" || getSavedValue(inp.id) === "";
  });
  checkit();
}

/**
 * Toggles visibility of data in first plot
 */
function change(el) {
  g3.setVisibility(el.id, el.checked);
  if (Number(el.id) > 2) return;
  const zoomer = Math.round(document.querySelector('#Zone2RH').value);
  g3.updateOptions({
    dateWindow: [-zoomer, zoomer],
    valueRange: [-zoomer * 470 / 850, zoomer * 470 / 850]
  });
}

/**
 * // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * @param point point to check
 * @param vs polygon to check
 * @returns boolean if inside
 */
function inside(point, vs) {

  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const [xi, yi] = vs[i];
    const [xj, yj] = vs[j];

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Creates the load characteristic array
 * @returns load array
 */
function peakLoad() {
  const load = Number(document.querySelector("#PeakLoad").value) || 1000;
  const Z = 25000 / load;
  const loadarray = [];
  let rad, r, x;
  for (let i = 0; i <= 40; i++) {
    rad = i * Math.PI / 180;
    r = Z * Math.cos(rad) * 1; //Resistive reach tolerance of 100%
    x = Z * Math.sin(rad);
    loadarray.push([r, , , , , , x]);
  }
  r = 60 * Math.cos(rad);
  x = 60 * Math.sin(rad);
  loadarray.push([r, , , , , , x]);
  return loadarray;
}

/**
 * Plots the protection to the dygraphs and checks what protection is selected
 * @param csvarr distrubance record, though name is misleading as it's not only csv 
 */
function plotProtection(csvarr) {
  const select = document.querySelector("select");
  const secdr = document.getElementById("SecDR");
  const rel = select.value === "P44T";
  const begamma = document.querySelectorAll(".box");
  begamma[3].style.display = rel ? "none" : "block";
  begamma[4].style.display = rel ? "none" : "block";

  //Advanced settings variables
  const z2del = Number(document.getElementById("Z2del").value);
  const z3del = Number(document.getElementById("Z3del").value);

  const vtr = document.getElementById("VTR").value || 1;
  const ctr = document.getElementById("CTR").value || 1;
  const tr = ctr / vtr; //secondary ratio

  //Primary or Secondary Disturbance record
  let trdr = 1;
  let vtrdr = 1;
  if (secdr.checked) { trdr = tr; vtrdr = vtr; }

  // Mapping object for zone functions
  const zoneFunctions = {
    Zone1P438, Zone2P438, Zone3P438,
    Zone1P44T, Zone2P44T, Zone3P44T,
    Zone1S7ST, Zone2S7ST, Zone3S7ST,
  };
  const [Z1pol, Z1el] = zoneFunctions[`Zone1${select.value}`](tr);
  const [Z2pol, Z2el] = zoneFunctions[`Zone2${select.value}`](tr);
  const [Z3pol, Z3el] = zoneFunctions[`Zone3${select.value}`](tr);

  const elements2 = [...peakLoad(), ...Z3el, ...Z2el, ...Z1el]; //All Zone polygons and the char angle
  let polnums = [...Z1pol.flat(), ...Z2pol.flat(), ...Z3pol.flat()];
  polnums = { max: Math.max(...polnums) + 2, min: Math.min(...polnums) - 2 };
  const polmax = (num) => Math.max(polnums.max, num);
  const polmin = (num) => Math.min(polnums.min, num);
  const xaxis = [polmin(-20) * 850 / 470, polmax(70) * 850 / 470];
  const yaxis = [polmin(-20), polmax(70)];
  const DR = [...csvarr];
  const calcStuff = { DR, trdr, vtrdr };
  const { faultarray, volarray, Zarray } = localStorage.getItem("isDAT") === "true" ? addDATtoArray(DR) : addCSVtoArray(calcStuff);
  const stuff = { DR, faultarray, Z1pol, Z2pol, Z3pol, z2del, z3del };
  FaultZone(stuff);
  if (volarray.length > 1) {
    summaryTable(volarray, Zarray);
    dygPlot2(volarray);
  }
  const total = [...elements2, ...faultarray];
  dygPlot(total, xaxis, yaxis);
}

/**
 * Process csv file to array
 * @param stuff disturbance record and ratios
 * @returns returns fault array in impedance and voltages, currents, and and zone trip, CB open array
 */
function addCSVtoArray(stuff) {
  const { DR, trdr, vtrdr } = stuff;
  const [faultarray, volarray, Zarray] = [[], [], []];
  if (DR.length === 0) return { faultarray, volarray, Zarray };
  const [v, va, c, ca] = JSON.parse(localStorage.getItem("indices"));
  for (let i = 1; i < DR.length; i++) { //add csv to array
    let DRdiv = (DR[i][v] / DR[i][c]) / trdr;
    DRdiv = ca > 7 ? -DRdiv : DRdiv; //siprotec temp fix
    const DRmult = (DR[i][va] - DR[i][ca]) * Math.PI / 180;
    const res = DRdiv * Math.cos(DRmult);
    const react = DRdiv * Math.sin(DRmult);
    const vmag = DR[i][v] * vtrdr;
    const cmag = DR[i][c] * vtrdr * trdr;
    const vlog = vmag * Math.cos(DR[i][va] * Math.PI / 180);
    const clog = cmag * Math.cos(DR[i][ca] * Math.PI / 180);
    const isfault = Math.abs(res) < 200 && Math.abs(react) < 1000 && cmag > 100;
    if (isfault || document.querySelector("#FullFault").checked) {
      faultarray.push([res, react]);
      volarray.push([DR[i][0], vmag, cmag, vlog, clog]);
    }
  }
  if (volarray.length === 0) return { faultarray, volarray, Zarray };
  return { faultarray, volarray, Zarray };
}

/**
 * Process dat file to array
 * @param DR disturbance record
 * @returns returns fault array in impedance and voltages, currents, and and zone trip, CB open array
 */
function addDATtoArray(DR) {
  const { vmul, cmul, stime, Z1, Z2, Z3, CBo, trdr, vtrdr, v, c } = getCFG();
  const [faultarray, volarray, Zarray] = [[], [], []];
  if (DR.length === 0) return { faultarray, volarray, Zarray };
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
    const va = Math.atan2(vr, vi);
    const ca = Math.atan2(cr, ci);
    const res = (vmag / cmag) * Math.cos(va - ca);
    const react = (vmag / cmag) * Math.sin(va - ca);
    const vlog = DR[i][v] * vmul * vtrdr;
    const clog = DR[i][c] * cmul * vtrdr * trdr;
    const isfault = Math.abs(res) < 200 && Math.abs(react) < 1000 && cmag > 100;
    const time = stime + (DR[i][1] / 1_000_000);
    if (isfault || document.querySelector("#FullFault").checked) {
      faultarray.push([res, react]);
      volarray.push([time, vmag, cmag, vlog, clog]);
      Zarray.push([time, DR[i][Z1], DR[i][Z2], DR[i][Z3], DR[i][CBo]]);
    }
  }
  if (volarray.length === 0) return { faultarray, volarray, Zarray };
  return { faultarray, volarray, Zarray };
}

/**
 * Process the cfg file to get all necessary info and column numbers
 * @returns cfg object with all the saved parameters
 */
function getCFG() {
  const data = JSON.parse(localStorage.getItem("CFGdata")) || false;
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
  cfg.v = /V/i.test(data[2][4]) ? 2 : 3;
  cfg.c = /A/i.test(data[3][4]) ? 3 : 2;
  cfg.vtrdr = data[cfg.v][10] / data[cfg.v][11];
  cfg.trdr = data[cfg.c][10] / data[cfg.c][11] / cfg.vtrdr;
  cfg.vmul = Number(data[cfg.v][5]);
  cfg.cmul = Number(data[cfg.c][5]);
  cfg.sdate = ar[0][1] || "";
  const circuit = data[0][0] === null ? localStorage.getItem("filename") : data[0][0];
  cfg.title = `${circuit.replace(/\,/g, " ")},${ar[0]}`;
  cfg.stime = Number(cfg.sdate.split(":").pop()) || 0;
  [, cfg.ana, cfg.dig] = data[1];
  return cfg;
}

/**
 * Save indices to localstorage. This is only needed for csv inputs
 */
function getIndex() {
  const data = JSON.parse(localStorage.getItem("headers")) || [];
  let [v, va, c, ca] = [0, 1, 2, 3];
  data.forEach((x, ind) => {
    if (/check|frost|def|max|sitiv|IB|IC |IN|ref|if|ix|uf/i.test(x)) return;
    v = /v.*rms|u.*rms/i.test(x) ? ind : v;
    va = /v.*a|u.*a/i.test(x) ? ind : va;
    c = /i.*rms|cur.*rms/i.test(x) ? ind : c;
    ca = /i.*a|cur.*a/i.test(x) ? ind : ca;
  });
  localStorage.setItem("indices", `[${v},${va},${c},${ca}]`);
}

/**
 * Check if there was a fault in one of the zones
 * @param stuff all the input info
 */
function FaultZone(stuff) {
  const { DR, faultarray, Z1pol, Z2pol, Z3pol, z2del, z3del } = stuff;
  if (DR.length === 0) return;
  const fst = localStorage.getItem("isDAT") === "true" ?
    DR[1][1] > 1 ? DR[1][1] / 1_000 : DR[1][1]
    : smoothdec((DR[1][0] - DR[0][0]) * 1000, 3);
  let Z3time = 0;
  let Z2time = 0;
  let Z1 = "";
  for (let i = 0; i < faultarray.length; i++) { //check through fault if in zone
    if (inside(faultarray[i], Z3pol)) {
      Z3time = Z3time + Number(fst);
      if (Z3time > z3del) {
        document.getElementById("FaultLoc").textContent = "Zone 3 trip";
        break;
      }
    }
    if (inside(faultarray[i], Z2pol)) {
      Z2time = Z2time + Number(fst);
      if (Z2time > z2del) {
        document.getElementById("FaultLoc").textContent = "Zone 2 trip";
        break;
      }
    }
    if (inside(faultarray[i], Z1pol)) {
      document.getElementById("FaultLoc").textContent = "Zone 1 trip";
      Z1 = "Trip";
      break;
    }
    else document.getElementById("FaultLoc").textContent = "No trip!";
  }
  const Z2 = Z2time > z2del ? "Trip" : `${smoothdec(Z2time, 0)} ms`;
  const Z3 = Z3time > z3del ? "Trip" : `${smoothdec(Z3time, 0)} ms`;
  const timers = [Z1, Z2, Z3];
  localStorage.setItem("ZoneTimers", JSON.stringify(timers));
}

/**
 * Plot protection zones and fault
 * @param total protection zones and fault array
 * @param xaxis size xaxis
 * @param yaxis size yaxis
 */
async function dygPlot(total, xaxis, yaxis) {
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  } catch (e) { logError(e); }
  const { title } = getCFG();
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    total,
    {
      dateWindow: xaxis,
      valueRange: yaxis,
      title,
      labels: ['a', 'Fault', 'Zone 1', 'Zone 2', 'Zone 3', 'Characteristic Angle', "Peak Load"],
      xlabel: "Resistance (Ω)",
      ylabel: "Reactance (Ω)",
      legend: 'always',
      drawAxesAtZero: true,
      labelsSeparateLines: true,
      colors: ["red", "blue", "purple", "green", "#cccc2b", "orange"],
      //connectSeparatedPoints: true,
      includeZero: true,
      axes: {
        x: {
          axisLabelFormatter: (y) => `${smoothdec(y)} Ω`
        },
        y: {
          axisLabelFormatter: (y) => `${smoothdec(y)} Ω`,
          axisLabelWidth: 60
        }
      },
      highlightCallback: (_e, _x, _pts, row) => {
        g2.setSelection(row - window.g3.file_.length + window.g2.file_.length);
      },
      legendFormatter,
    }          // options
  );
  g3.ready(function () {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  });
}

/**
 * Format impedance plot legend
 * @param data dygraph data
 */
function legendFormatter(data) {
  if (!data.series || data.series.length === 0) return "";
  let html = "";
  if (data.x != null) html += `Resistance ${smoothdec(data.xHTML)}Ω<br>`;

  data.series.forEach(function (series) {
    if (!series.isVisible) return;
    const data = series.yHTML === undefined ? "" : `Reactance ${series.yHTML}Ω`;
    let labeledData = `${series.labelHTML}: ${data}`;
    if (series.isHighlighted) labeledData = `<b>${labeledData}</b>`;

    html += `${series.dashHTML} ${labeledData}<br>`;
  });
  return html;
}

/**
 * Plot analog voltages and currents
 * @param data voltages and currents
 */
async function dygPlot2(data) {
  try {
    if (typeof g2 !== 'undefined') g2.destroy();
  } catch (e) { logError(e); }
  window.g2 = new Dygraph(
    document.getElementById("graphdiv2"),
    data,
    {
      labels: ['a', 'Voltage (V)', 'Current (A)', 'Voltage (V) ', 'Current (A) '],
      xlabel: "Time (s.ms)",
      ylabel: "Voltage (kV)",
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
      highlightCallback: (_e, _x, _pts, row) => {
        g3.setSelection(row + window.g3.file_.length - window.g2.file_.length);
      },
    }          // options
  );
  const x = document.querySelector("#Mag").checked;
  g2.setVisibility(0, x);
  g2.setVisibility(1, x);
  g2.setVisibility(2, !x);
  g2.setVisibility(3, !x);
  g2.ready(function () {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  });
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @param num protection zone
 * @param empty empty array spaces to not clash with previous zones
 * @returns Zone quadrilateral
 */
function P44T(tr, num, empty) {
  //%Zone setting
  let a = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  let Z = Number(document.getElementById(`Zone${num}`).value);
  let LH = Number(document.getElementById(`Zone${num}LH`).value);
  const RHbox = document.getElementById(`Zone${num}RH`);
  let Zr = Number(document.getElementById("Zone3rev").value);
  const LZ = num === "1" ? 22.52 : 25;//Math.max(22.52, 25000 / Number(document.getElementById("PeakLoad").value));
  const Ztilt = -0 * Math.PI / 180;
  const ftd = 40 * Math.PI / 180;
  const btilt = 3 * Math.PI / 180;
  const Zdeg = 30 * Math.PI / 180;
  a = Z <= LZ * (Math.sin(ftd - Ztilt) / Math.sin(a - Ztilt)) ? Math.PI / 2 : a;
  const RHNaN = Math.asin(Z / LZ * Math.sin(a + Ztilt) + Ztilt) || 0;//if Z is >> LZ it throws NaN
  let RH = a === Math.PI / 2
    ? LZ * Math.cos(RHNaN)
    : LZ * Math.cos(ftd) - LZ * Math.sin(ftd) / Math.tan(a);
  RHbox.value = smoothdec(RH);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z = Z / tr; RH = RH / tr; LH = LH / tr; Zr = Zr / tr;
  }
  //%Zone plot
  const Zlef = Z > LH * Math.sin(a) * Math.sin(Zdeg + Ztilt) / Math.sin(Math.PI - Zdeg - a) / Math.sin(a - Ztilt);
  const r1 = Z * Math.cos(a);
  const x1 = Z * Math.sin(a);
  const r2 = r1 + RH * Math.sin(Math.PI - a) / Math.sin(a - Ztilt) * Math.cos(Ztilt);
  const x2 = x1 + RH * Math.sin(Math.PI - a) / Math.sin(a - Ztilt) * Math.sin(Ztilt);
  const r3 = RH;
  const x3 = 0;
  const r4 = num === "3"
    ? RH - (Zr + RH * Math.sin(btilt) / Math.sin(a + btilt)) * Math.cos(a)
    : Math.max(RH - (RH * Math.sin(btilt) / Math.sin(Math.PI - btilt - a) + 0.25 * Z) * Math.cos(a), RH * Math.sin(a) / Math.sin(Math.PI - Zdeg - a) * Math.cos(Zdeg));
  const x4 = num === "3"
    ? - (Zr + RH * Math.sin(btilt) / Math.sin(a + btilt)) * Math.sin(a)
    : Math.max(- (RH * Math.sin(btilt) / Math.sin(Math.PI - btilt - a) + 0.25 * Z) * Math.sin(a), -RH * Math.sin(a) / Math.sin(Math.PI - Zdeg - a) * Math.sin(Zdeg));
  const r5 = num === "3"
    ? -Zr * Math.cos(a)
    : Math.min(0.25 * Z * Math.sin(a + btilt) / Math.sin(Zdeg - btilt) * Math.cos(Zdeg), RH * Math.sin(a) / Math.sin(Math.PI - Zdeg - a) * Math.cos(Zdeg));
  const x5 = num === "3"
    ? -Zr * Math.sin(a)
    : Math.max(-0.25 * Z * Math.sin(a + btilt) / Math.sin(Zdeg - btilt) * Math.sin(Zdeg), -RH * Math.sin(a) / Math.sin(Math.PI - Zdeg - a) * Math.sin(Zdeg));
  const r6 = num === "3"
    ? -LH - (Zr - LH * Math.sin(btilt) / Math.sin(a + btilt)) * Math.cos(a)
    : Zlef
      ? -LH * Math.sin(a) / Math.sin(Math.PI - Zdeg - a) * Math.cos(Zdeg)
      : -Z * Math.sin(a - Ztilt) / Math.sin(Zdeg + Ztilt) * Math.cos(Zdeg);
  const x6 = num === "3"
    ? - (Zr - LH * Math.sin(btilt) / Math.sin(a + btilt)) * Math.sin(a)
    : Zlef
      ? LH * Math.sin(a) / Math.sin(Math.PI - Zdeg - a) * Math.sin(Zdeg)
      : Z * Math.sin(a - Ztilt) / Math.sin(Zdeg + Ztilt) * Math.sin(Zdeg);
  const r7 = num === "3"
    ? r1 - LH * Math.sin(Math.PI - a) / Math.sin(a - Ztilt) * Math.cos(Ztilt)
    : Zlef
      ? Z * Math.cos(a) - LH * Math.sin(Math.PI - a) / Math.sin(a - Ztilt) * Math.cos(Ztilt)
      : -Z * Math.sin(a - Ztilt) / Math.sin(Zdeg + Ztilt) * Math.cos(Zdeg);
  const x7 = num === "3"
    ? x1 - LH * Math.sin(Math.PI - a) / Math.sin(a - Ztilt) * Math.sin(Ztilt)
    : Zlef
      ? Z * Math.sin(a) - LH * Math.sin(Math.PI - a) / Math.sin(a - Ztilt) * Math.sin(Ztilt)
      : Z * Math.sin(a - Ztilt) / Math.sin(Zdeg + Ztilt) * Math.sin(Zdeg);

  const char = num === "3" ? [[0, , , , , 0], [Z * Math.cos(a), , , , , Z * Math.sin(a)]] : []; //adding char angle
  const Zpol = [[r1, x1], [r2, x2], [r3, x3], [r4, x4], [r5, x5], [r6, x6], [r7, x7], [r1, x1]]; //Z polygon
  const Zel = [...char, [r1, ...empty, x1], [r2, ...empty, x2], [r3, ...empty, x3], [r4, ...empty, x4], [r5, ...empty, x5], [r6, ...empty, x6], [r7, ...empty, x7], [r1, ...empty, x1]];
  const stuff = { a, Z, LH };
  return [Zpol, Zel, stuff];
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone1P44T(tr) {
  return P44T(tr, "1", [,]);
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone2P44T(tr) {
  return P44T(tr, "2", [, ,]);
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone3P44T(tr) {
  return P44T(tr, "3", [, , ,]);
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @param num protection zone
 * @param empty empty array spaces to not clash with previous zones
 * @returns Zone quadrilateral
 */
function P438(tr, num, empty) {
  //%Zone 1 setting
  const a = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  const b = (Number(document.getElementById("Beta").value) * Math.PI / 180);
  const g = (Number(document.getElementById("Gamma").value) * Math.PI / 180);
  let Z = Number(document.getElementById(`Zone${num}`).value);
  let RH = Number(document.getElementById(`Zone${num}RH`).value);
  const left = document.getElementById(`Zone${num}LH`);
  const leftcalc = Z * Math.sin(a) * Math.sin(b - 0.5 * Math.PI) / Math.sin(Math.PI - b) + Z * Math.sin(0.5 * Math.PI - a);
  let LH = Math.min(Number(left.value), leftcalc);
  left.value = smoothdec(LH);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z = Z / tr; RH = RH / tr; LH = LH / tr;
  }
  //%Zone plot
  const m1 = RH * Math.sin(a) / Math.sin(Math.PI - a + g);
  const m2 = LH * Math.sin(a) / Math.sin(a - b);
  const r1 = m1 * Math.cos(g);
  const x1 = m1 * Math.sin(g);
  const x2 = Z * Math.sin(a);
  const r2 = RH + Z * Math.cos(a);
  const r3 = 0;
  const x3 = x2;
  const x4 = Math.min(LH * Math.sin(a) / Math.sin(0.5 * Math.PI - a), x2);
  const r5 = m2 * Math.cos(Math.PI - b);
  const x5 = Math.min(-m2 * Math.sin(Math.PI - b), x4);
  const r4 = Math.min((x2 - x5) * Math.sin(0.5 * Math.PI - a) / Math.sin(a) + r5, 0);
  const Zpol = [[0, 0], [r1, x1], [r2, x2], [r3, x3], [r4, x4], [r5, x5], [0, 0]]; //Z polygon
  const Zel = [[0, ...empty, 0], [r1, ...empty, x1], [r2, ...empty, x2], [r3, ...empty, x3], [r4, ...empty, x4], [r5, ...empty, x5], [0, ...empty, 0]];
  const stuff = { a, b, g, Z, LH };
  return [Zpol, Zel, stuff];
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone1P438(tr) {
  return P438(tr, "1", [,]);
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone2P438(tr) {
  return P438(tr, "2", [, ,]);
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone3P438(tr) {
  let Zr = Number(document.getElementById("Zone3rev").value);
  Zr = document.getElementById("Sec").checked ? Zr / tr : Zr;
  let [Zpol, Zel, stuff] = P438(tr, "3", [, , ,]);
  const { a, b, g, Z, LH } = stuff;
  const m1 = LH * Math.sin(a) / Math.sin(Math.PI - a + g);
  const x1 = -Zr * Math.sin(a);
  const r1 = -x1 * Math.sin(b - 0.5 * Math.PI) / Math.sin(Math.PI - b);
  const r2 = -LH - Zr * Math.cos(a);
  const x2 = x1;
  const r3 = -m1 * Math.cos(g);
  const x3 = m1 * Math.sin(-g);
  Zel = [[0, , , , , 0], [Z * Math.cos(a), , , , , Z * Math.sin(a)], ...Zel, [0, , , , 0], [r1, , , , x1], [r2, , , , x2], [r3, , , , x3], [0, , , , 0]];
  Zpol = [...Zpol, [r1, x1], [r2, x2], [r3, x3], [0, 0]];
  return [Zpol, Zel];
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @param num protection zone
 * @param empty empty array spaces to not clash with previous zones
 * @returns Zone quadrilateral
 */
function S7ST(tr, num, empty) {
  //%Zone 1 setting
  const a = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  const b = (Number(document.getElementById("Beta").value) * Math.PI / 180);
  const g = (Number(document.getElementById("Gamma").value) * Math.PI / 180);
  const load = Number(document.querySelector("#PeakLoad").value) || 1000;
  let Z = Number(document.getElementById(`Zone${num}`).value);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z = Z / tr;
  }
  const Zpol = [[0, 0]];
  const Zel = [[0, ...empty, 0]];
  for (let i = 0; i <= 100; i++) {
    const rad = i / 100 * b + (1 - i / 100) * g;
    const maxres = Z < 25000 / load ? Z : 25000 / load * Math.cos(40 * Math.PI / 180);
    const res = rad >= a
      ? Z * Math.cos(rad)
      : Math.min(Z * Math.cos(rad), maxres);
    const rea = rad >= a || Z * Math.cos(rad) < maxres
      ? Z * Math.sin(rad)
      : maxres * Math.tan(rad);
    Zpol.push([res, rea]);
    Zel.push([res, ...empty, rea]);
  }
  Zpol.push([0, 0]);
  Zel.push([0, ...empty, 0]);
  const stuff = { a, b, g, Z };
  return [Zpol, Zel, stuff];
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone1S7ST(tr) {
  return S7ST(tr, "1", [,]);
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone2S7ST(tr) {
  return S7ST(tr, "2", [, ,]);
}

/**
 * Build Relay quadrilateral array
 * @param tr vt and ct ratio
 * @returns Zone quadrilateral
 */
function Zone3S7ST(tr) {
  let Zr = Number(document.getElementById("Zone3rev").value);
  Zr = document.getElementById("Sec").checked ? Zr / tr : Zr;
  const [Zpol, Zel, stuff] = S7ST(tr, "3", [, , ,]);
  const { a, b, g, Z } = stuff;
  for (let i = 0; i <= 100; i++) {
    const rad = i / 100 * (b + Math.PI) + (1 - i / 100) * (g + Math.PI);
    const res = rad >= a + Math.PI
      ? Z * Math.cos(rad)
      : Math.max(Z * Math.cos(rad), Zr);
    const rea = rad >= a + Math.PI || Z * Math.cos(rad) > Zr
      ? Z * Math.sin(rad)
      : Zr * Math.tan(rad);
    Zpol.push([res, rea]);
    Zel.push([res, , , , rea]);
  }
  Zpol.push([0, 0]);
  Zel.push([0, , , , 0]);
  return [Zpol, Zel];
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
 * Updates vt ratio label
 */
function vtRatio() {
  const label = document.querySelector("label[for=VTR]");
  const vtr = document.querySelector("#VTR").value || 240;
  label.innerText = `VT Ratio (26.4/${smoothdec(26.4 / vtr, 2)} kV)`;
}

/**
 * Updates ct ratio label
 */
function ctRatio() {
  const label = document.querySelector("label[for=CTR]");
  const ctr = document.querySelector("#CTR").value || 600;
  label.innerText = `CT Ratio (${ctr}/1 A)`;
}

/**
 * Opens import fault page
 */
function importFault() {
  window.open("faultimport.html", "_self");
}

/**
 * Export fault to firebase database
 */
function exportFault() {
  const headers = localStorage.getItem("headers");
  const cfg = localStorage.getItem("CFGdata");
  const isDAT = localStorage.getItem("isDAT") === "true";
  const params = document.location.search;
  const dbObj = firebase.database().ref(`relay/${getCFG().title.replace(/\/|\./g, '-')}`);
  const dbObj2 = firebase.database().ref(`faults/${getCFG().title.replace(/\/|\./g, '-')}`);
  db.transaction(["plots"]).objectStore("plots").openCursor(null, "prev").onsuccess = async (e) => {
    const data = e.target.result.value.data;
    dbObj.update({ data, headers, cfg, isDAT, params });
    dbObj2.update({ isDAT }); //doesn't really need to send anything, just create the DB entry
  }
}

/**
 * Parse xml into array
 * @param xml Input xrio in xml format
 * @returns xml array
 */
function parseXml(xml) {
  let dom = window.DOMParser ? (new DOMParser()).parseFromString(xml, "text/xml") : null;
  if (window.ActiveXObject) {
    dom = new ActiveXObject('Microsoft.XMLDOM');
    dom.async = false;
    if (!dom.loadXML(xml)) throw new Error(`${dom.parseError.reason} ${dom.parseError.srcText}`);
  }
  function parseNode(xmlNode, result) {
    if (xmlNode.nodeName === "#text") {
      const v = xmlNode.nodeValue;
      if (v.trim()) result["#text"] = v;
      return;
    }
    const jsonNode = {},
      existing = result[xmlNode.nodeName];
    if (existing) {
      if (!Array.isArray(existing)) result[xmlNode.nodeName] = [existing, jsonNode];
      else result[xmlNode.nodeName].push(jsonNode);
    }
    else result[xmlNode.nodeName] = jsonNode;
    if (xmlNode.attributes) for (let attribute of xmlNode.attributes) jsonNode[attribute.nodeName] = attribute.nodeValue;
    for (let node of xmlNode.childNodes) parseNode(node, jsonNode);
  }
  let result = {};
  for (let node of dom.childNodes) parseNode(node, result);
  return result;
}

/**
 * Loads xrio file settings into inputs
 * @param xml Input xrio in xml format
 */
function xrio(xml) {
  const xrio = parseXml(decodeURIComponent(escape(xml))).XRio.CUSTOM;
  const IED = xrio.Name["#text"];
  document.querySelector("select").value = /P44T/i.test(IED) ? "P44T" : /P438/i.test(IED) ? "P438" : "S7ST";
  if (!/P44T/i.test(IED)) return;
  let [config, group, ct, groups] = [{}, {}, {}, []];
  xrio.Block.forEach(x => {
    config = /configuration/i.test(x.Name["#text"]) ? x : config;
    ct = /ct and vt/i.test(x.Name["#text"]) ? x : ct;
    if (/Group /i.test(x.Name["#text"])) groups.push(x);
  });
  config.Parameter.forEach(x => {
    group = /Active Settings/i.test(x.Description["#text"]) ? x : group;
  });
  group.EnumList.EnumValue.forEach(x => {
    group.text = group.Value["#text"] === x.EnumId ? x["#text"] : group.text;
  });
  groups.forEach(x => {
    if (x.Name["#text"] === group.text) {
      x.Block.forEach(y => {
        if (/Dist. Elem/i.test(y.Name["#text"])) groups.distEl = y;
        if (/logic/i.test(y.Name["#text"])) groups.logic = y;
      });
    }
  });
  groups.distEl.Parameter.forEach(x => {
    for (let i = 1; i < 4; i++) {
      if (`Z${i} Gnd. Reach` === x.Name["#text"]) document.querySelector(`#Zone${i}`).value = x.Value["#text"];
      if (`R${i} Gnd RH Res.` === x.Name["#text"]) document.querySelector(`#Zone${i}RH`).value = x.Value["#text"];
      if (`R${i} Gnd LH Res.` === x.Name["#text"]) document.querySelector(`#Zone${i}LH`).value = x.Value["#text"];
    }
    if (/z3' Gnd rev rch/i.test(x.Name["#text"])) document.querySelector("#Zone3rev").value = x.Value["#text"];
    if (/z3 Gnd. angle/i.test(x.Name["#text"])) document.querySelector("#Alpha").value = x.Value["#text"];
  });
  groups.logic.Parameter.forEach(x => {
    if (/Z2 Gnd. Delay/i.test(x.Name["#text"])) document.querySelector("#Z2del").value = Number(x.Value["#text"]) * 1000;
    if (/Z3 Gnd. Delay/i.test(x.Name["#text"])) document.querySelector("#Z3del").value = Number(x.Value["#text"]) * 1000;
  });
  let [vtprim, vtsec, ctprim, ctsec] = [26.4, 0.11, 600, 1];
  ct.Parameter.forEach(x => {
    vtprim = /vt prim/i.test(x.Description["#text"]) ? x.Value["#text"] : vtprim;
    vtsec = /vt sec/i.test(x.Description["#text"]) ? x.Value["#text"] : vtsec;
    ctprim = /ct prim/i.test(x.Description["#text"]) ? x.Value["#text"] : ctprim;
    ctsec = /ct sec/i.test(x.Description["#text"]) ? x.Value["#text"] : ctsec;
  });
  document.querySelector("#VTR").value = vtprim / vtsec;
  document.querySelector("#CTR").value = ctprim / ctsec;
  read();
}

/**
 * Loads rio file settings into inputs
 * @param data Input rio
 */
function rio(data) {
  document.querySelector("select").value = /7ST/i.test(data) ? "S7ST" : "P44T";
  const { trdr } = getCFG();
  let res = [], levels = [res];
  const zones = {};
  for (let line of data.split('\n')) {
    let
      level = line.search(/\S/) >> 2  // (index of first non whitespace char) / 2 --> IF indentation is 2 spaces
      , root = line.replace(/  +/g, ',').trim()
      , content = [];
    if (!root) continue;
    levels[level].push({ root, content });
    levels[++level] = content;
  }
  res.forEach(x => {
    if (x.content.length !== 0) zones[x.content[0].root.split(",").pop()] = x.content[2].content.map(x => x.root.split(",").flatMap(y => y.length === 0 || isNaN(Number(y)) ? [] : Number(y)));
  });
  for (const obj in zones) {
    const zone = document.querySelector(`#Zone${obj.slice(-1)}`);
    if (zone) {
      zone.value = smoothdec(zones[obj][1][0] / trdr);
      document.querySelector(`#Zone${obj.slice(-1)}RH`).value = smoothdec(zones[obj][1][0] / trdr);
      document.querySelector(`#Zone${obj.slice(-1)}LH`).value = "";
    }
  }
  document.querySelector("#Alpha").value = zones.Z1[4][1];
  document.querySelector("#Beta").value = zones.Z1[4][2];
  document.querySelector("#Zone3").value = smoothdec(zones.Z3[3][0] / trdr);
  document.querySelector("#Zone3rev").value = smoothdec(zones.Z3[4][0] / trdr);
  read();
}

/**
 * Converts binary 2D array to ASCII 2D array
 * @param data Input binary array
 * @returns ASCII array
 */
function binary2ASCII(data) {
  const bin = [...data].map(c => c.charCodeAt(0).toString(16));
  let { ana, dig } = getCFG();
  ana = Number(ana.replace(/\D/g, ''));
  dig = Number(dig.replace(/\D/g, ''));
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

let idbSupported = "indexedDB" in window ? true : false;
let db;
//startup
startup();
