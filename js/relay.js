function checkit() {
  const x = document.getElementById(`Sec`).checked || document.querySelector(`#advanced`).checked;
  const y = document.getElementById("hide");
  y.style.display = x ? `block` : `none`;
  vtRatio();
  ctRatio();
}

function save(data) {
  if (typeof data[1][0] === `string`) {
    data.pop(); //remove last empty line
    data.forEach(x => {
      x.shift();
      x[0] = Number(x[0].split(`:`).pop()); //extracts seconds from timestamp
    });
  }
  const headers = JSON.stringify(data.shift());
  localStorage.setItem(`headers`, headers);
  saveIndexedDB(data);
}

function saveIndexedDB(data) {
  getIndex();
  const transaction = db.transaction(["plots"], "readwrite");
  const objectStore = transaction.objectStore("plots");
  objectStore.put({ id: 1, data });
  plotProtection(data);
}

function importFault() {
  const dbObj = firebase.database().ref(`relay`);
  dbObj.once(`value`, snap => {
    const data = snap.val();
    localStorage.setItem(`headers`, data.headers);
    saveIndexedDB(data.data);
  });
}

function exportFault() {
  const headers = localStorage.getItem(`headers`);
  const dbObj = firebase.database().ref(`relay`);
  db.transaction(["plots"]).objectStore("plots").openCursor(null, "prev").onsuccess = async (e) => {
    const data = e.target.result.value.data;
    dbObj.set({ data, headers });
  }
}

function read() {
  const transaction = db.transaction(["plots"], "readonly");
  const objectStore = transaction.objectStore("plots");
  objectStore.openCursor(null, "prev").onsuccess = async function (event) {
    const cursor = event.target.result;
    try {
      plotProtection(cursor.value.data);
    } catch (err) {
      importFault();
    }
  }
}

function javaread() {
  document.querySelector(`#rel_upload`).onchange = function (evt) {
    if (!window.FileReader) return; // Browser is not compatible
    const reader = new FileReader();
    reader.onload = function (evt) {
      if (evt.target.readyState !== 2) return;
      if (evt.target.error) {
        logError('Error while reading file');
        return;
      }
      let filecontent = evt.target.result;
      const DR = Papa.parse(filecontent, { dynamicTyping: true }).data;
      save(DR);
    };
    reader.readAsText(evt.target.files[0]);
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

function startup() {
  fireBase();
  getIndex();
  funkyRadio();
  document.querySelector(`#Import`).addEventListener(`click`, importFault);
  document.querySelector(`#Export`).addEventListener(`click`, exportFault);
  document.querySelector("#VTR").addEventListener(`keyup`, vtRatio);
  document.querySelector("#CTR").addEventListener(`keyup`, ctRatio);
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = (getSavedValue(box.id) === "true");
  });
  for (let i = 0; i < 6; i++) document.getElementById(i).checked = true;
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  const select = document.querySelector(`select`);
  select.value = getSavedValue(select.id) || `P438`;
  javaread();
  // await code here
  let DR = [];
  plotProtection(DR);
  document.onkeyup = function () {
    try { read(); } catch (e) { logError(e); }
  };
  const prim = document.getElementById("Prim");
  prim.onchange = function () { read(); checkit(); };
  prim.checked = getSavedValue(prim.id) === "true" || getSavedValue(prim.id) === "";
  document.getElementById("Sec").onchange = function () { checkit(); read(); };
  const primDR = document.getElementById("PrimDR");
  primDR.onchange = function () { read(); };
  primDR.checked = getSavedValue(primDR.id) === "true" || getSavedValue(primDR.id) === "";
  document.getElementById("SecDR").onchange = function () { read(); };
  checkit();
}

function change(el) {
  g3.setVisibility(el.id, el.checked);
}

function inside(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
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

function peakLoad() {
  const load = Number(document.querySelector("#PeakLoad").value) || 1000;
  const Z = 25000 / load;
  let loadarray = [];
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

function plotProtection(csvarr) {
  const select = document.querySelector(`select`);
  const secdr = document.getElementById("SecDR");

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

  const [Z1pol, Z1el] = eval(`Zone1${select.value}(tr)`);
  const [Z2pol, Z2el] = eval(`Zone2${select.value}(tr)`);
  const [Z3pol, Z3el] = eval(`Zone3${select.value}(tr)`);
  const elements2 = [...peakLoad(), ...Z3el, ...Z2el, ...Z1el]; //All Zone polygons and the char angle
  let polnums = [...Z1pol.flat(), ...Z2pol.flat(), ...Z3pol.flat()];
  polnums = { max: Math.max(...polnums) * 1.2, min: Math.min(...polnums) * 1.2 };
  const polmax = (num) => Math.max(polnums.max, num);
  const polmin = (num) => Math.min(polnums.min, num);
  const xaxis = [polmin(-40), polmax(50)];
  const yaxis = [polmin(-20), polmax(70)];
  let DR = []; DR = csvarr;
  const calcStuff = { DR, trdr, vtrdr };
  let faultarray = addCSVtoArray(calcStuff);
  const stuff = { DR, faultarray, Z1pol, Z2pol, Z3pol, z2del, z3del };
  FaultZone(stuff);

  let total = elements2.slice();
  for (let i = 0; i < faultarray.length; i++) {
    total.push(faultarray[i]);
  }
  dygPlot(total, xaxis, yaxis);
  if (DR.length > 0) dygPlot2(DR);
}

function addCSVtoArray(stuff) {
  const { DR, trdr, vtrdr } = stuff;
  let faultarray = [], gap = false;
  if (DR.length === 0) return faultarray;
  const [v, va, c, ca] = JSON.parse(localStorage.getItem(`indices`));
  for (let i = 1; i < DR.length; i++) { //add csv to array
    const DRdiv = (DR[i][v] / DR[i][c]) / trdr;
    const DRmult = (DR[i][va] - DR[i][ca]) * Math.PI / 180;
    const res = DRdiv * Math.cos(DRmult);
    const react = DRdiv * Math.sin(DRmult);
    const isfault = res < 90 && react < 90 && DR[i][v] * vtrdr > 1000;
    if (isfault) {
      faultarray.push([res, react]);
      gap = true;
    }
    else if (gap) {
      faultarray.push([]); //inserts only one gap
      gap = false;
    }
  }
  return faultarray;
}

function getIndex() {
  const data = JSON.parse(localStorage.getItem(`headers`)) || [];
  let [v, va, c, ca] = [0, 1, 2, 3];
  data.forEach((x, ind) => {
    if (/check|frost|def|max/i.test(x)) return;
    v = /v.*rms/i.test(x) ? ind : v;
    va = /v.*a/i.test(x) ? ind : va;
    c = /i.*rms|cur.*rms/i.test(x) ? ind : c;
    ca = /i.*a|cur.*a/i.test(x) ? ind : ca;
  });
  localStorage.setItem(`indices`, `[${v},${va},${c},${ca}]`)
}

function FaultZone(stuff) {
  let { DR, faultarray, Z1pol, Z2pol, Z3pol, z2del, z3del } = stuff;
  if (DR.length === 0) return;
  const fst = smoothdec((DR[1][0] - DR[0][0]) * 1000, 3);
  let Z3time = 0;
  let Z2time = 0;
  let Z1 = ``;
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
      Z1 = `Trip`;
      break;
    }
    else document.getElementById("FaultLoc").textContent = "No trip!";
  }
  const Z2 = Z2time > z2del ? `Trip` : `${smoothdec(Z2time, 0)} ms`;
  const Z3 = Z3time > z3del ? `Trip` : `${smoothdec(Z3time, 0)} ms`;
  const timers = [Z1, Z2, Z3];
  localStorage.setItem(`ZoneTimers`, JSON.stringify(timers));
}

async function dygPlot(total, xaxis, yaxis) {
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  } catch (e) { logError(e); }
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    total,
    {
      dateWindow: xaxis,
      valueRange: yaxis,
      labels: ['a', 'Fault', 'Zone 1', 'Zone 2', 'Zone 3', 'Characteristic Angle', `Peak Load`],
      xlabel: "Resistance (Ω)",
      ylabel: "Reactance (Ω)",
      legend: 'always',
      drawAxesAtZero: true,
      labelsSeparateLines: true,
      colors: ["red", "blue", "purple", "green", "#cccc2b", `orange`],
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
      }
    }          // options
  );
  g3.ready(function () {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 500);

  });
}

function processNeeded(data) {
  let newdata = [];
  const secdr = document.getElementById("SecDR");
  const vtr = secdr.checked ? document.getElementById("VTR").value || 1 : 1;
  const ctr = secdr.checked ? document.getElementById("CTR").value || 1 : 1;
  const [v, , c,] = JSON.parse(localStorage.getItem(`indices`));
  data.forEach(x => {
    newdata.push([x[0], x[v] * vtr, x[c] * ctr]);
  });
  summaryTable(newdata);
  return newdata;
}

async function dygPlot2(data) {
  try {
    if (typeof g2 !== 'undefined') g2.destroy();
  } catch (e) { logError(e); }
  window.g2 = new Dygraph(
    document.getElementById("graphdiv2"),
    processNeeded(data),
    {
      labels: ['a', 'Voltage (V)', 'Current (A)'],
      xlabel: "Time (s.ms)",
      ylabel: "Voltage (kV)",
      y2label: "Current (kA)",
      colors: ["blue", "red"],
      includeZero: true,
      series: {
        'Current (A)': {
          axis: 'y2'
        },
      },
      axes: {
        x: {
          axisLabelFormatter: (y) => `${smoothdec(y)} s`
        },
        y: {
          axisLabelFormatter: (y) => `${smoothdec(y / 1000)} kV`,
          axisLabelWidth: 60
        },
        y2: {
          axisLabelFormatter: (y) => `${smoothdec(y / 1000)} kA`,
          axisLabelWidth: 60
        }
      }
    }          // options
  );
  g2.ready(function () {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 500);

  });
}

function Zone1P44T(tr) {
  //%Zone 1 setting
  let Z1 = Number(document.getElementById("Zone1").value);
  const Z1A = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  const Z1t = (-3 * Math.PI / 180);
  let R1R = Number(document.getElementById("Zone1RH").value);
  let R1L = Number(document.getElementById("Zone1LH").value);
  const Z1s = (87 * Math.PI / 180);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z1 = Z1 / tr; R1R = R1R / tr; R1L = R1L / tr;
  }
  //%Zone 1 plot
  const xmul1 = Math.sin(Z1A);
  const xmul2 = Math.sin((180 * Math.PI / 180) - Z1A + Z1t);
  const pmul1 = R1R * xmul1 / Math.sin((90 * Math.PI / 180) + Z1s - Z1A);
  const pmul2 = (-90 * Math.PI / 180) + Z1s;
  const x1 = xmul1 * R1L / xmul2;
  const xx1 = xmul1 * R1R / xmul2;
  const pkx1 = -x1 * Math.sin(Z1t) + Z1 * xmul1;
  const pgx1 = Math.min(-R1L * Math.sin(pmul2), pkx1);
  const pcx1 = xx1 * Math.sin(Z1t) + Z1 * xmul1;
  const prx1 = pmul1 * Math.sin(pmul2);
  const pgr1 = -pgx1 * Math.sin(Z1s) / Math.sin((90 * Math.PI / 180) - Z1s);
  const pkr1 = pgx1 === pkx1 ? pgr1 : -x1 * Math.cos(Z1t) + Z1 * Math.cos(Z1A);
  const pcr1 = xx1 * Math.cos(Z1t) + Z1 * Math.cos(Z1A);
  const prr1 = pmul1 * Math.cos(pmul2);
  const Z1pol = [[pgr1, pgx1], [pkr1, pkx1], [pcr1, pcx1], [prr1, prx1], [pgr1, pgx1]]; //Z1 polygon
  const Z1el = [[pgr1, , pgx1], [pkr1, , pkx1], [pcr1, , pcx1], [prr1, , prx1], [pgr1, , pgx1]];
  return [Z1pol, Z1el];
}

function Zone2P44T(tr) {
  //%Zone 2 setting
  let Z2 = Number(document.getElementById("Zone2").value);
  const Z2A = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  const Z2t = (-3 * Math.PI / 180);
  let R2R = Number(document.getElementById("Zone2RH").value);
  let R2L = Number(document.getElementById("Zone2LH").value);
  const Z2s = (87 * Math.PI / 180);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z2 = Z2 / tr; R2R = R2R / tr; R2L = R2L / tr;
  }
  const xmul1 = Math.sin(Z2A);
  const xmul2 = (180 * Math.PI / 180) - Z2A + Z2t;
  const pr21 = R2R * xmul1 / Math.sin((90 * Math.PI / 180) + Z2s - Z2A);
  const pr22 = (-90 * Math.PI / 180) + Z2s;
  //%Zone 2 plot
  const x2 = xmul1 * R2L / Math.sin(xmul2);
  const xx2 = xmul1 * R2R / Math.sin(xmul2);
  const pkx2 = -x2 * Math.sin(Z2t) + Z2 * xmul1;
  const pgx2 = Math.min(pkx2, -R2L * Math.sin(pr22));
  const pcx2 = xx2 * Math.sin(Z2t) + Z2 * xmul1;
  const prx2 = pr21 * Math.sin(pr22);
  const pgr2 = -pgx2 * Math.sin(Z2s) / Math.sin((90 * Math.PI / 180) - Z2s);
  const pkr2 = pgx2 === pkx2 ? pgr2 : -x2 * Math.cos(Z2t) + Z2 * Math.cos(Z2A);
  const pcr2 = xx2 * Math.cos(Z2t) + Z2 * Math.cos(Z2A);
  const prr2 = pr21 * Math.cos(pr22);
  const Z2pol = [[pgr2, pgx2], [pkr2, pkx2], [pcr2, pcx2], [prr2, prx2], [pgr2, pgx2]];
  const Z2el = [[pgr2, , , pgx2], [pkr2, , , pkx2], [pcr2, , , pcx2], [prr2, , , prx2], [pgr2, , , pgx2]];
  return [Z2pol, Z2el];
}

function Zone3P44T(tr) {
  //%Zone 3 setting
  let Z3 = Number(document.getElementById("Zone3").value);
  const alpha = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  const Z3A = alpha > 80 * Math.PI / 180 ? 7 * Math.PI / 18 : alpha;
  const Z3t = (-3 * Math.PI / 180);
  let R3R = Number(document.getElementById("Zone3RH").value);
  let R3L = Number(document.getElementById("Zone3LH").value);
  const Z3rev = Number(document.getElementById("Zone3rev").value);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z3 = Z3 / tr; R3R = R3R / tr; R3L = R3L / tr;
  }
  //%Zone 3 plot
  const xmul1 = Math.sin(Z3A);
  const xmul2 = (180 * Math.PI / 180) - Z3A + Z3t;
  const x3 = xmul1 * R3L / Math.sin(xmul2);
  const xx3 = xmul1 * R3R / Math.sin(xmul2);
  const ox3 = -Z3rev * xmul1;
  const pgx3 = ox3 - x3 * Math.sin(Z3t);
  const pkx3 = pgx3 + (Z3 + Z3rev) * xmul1;
  const prx3 = ox3 + xx3 * Math.sin(Z3t);
  const pcx3 = prx3 + (Z3 + Z3rev) * xmul1;
  const or3 = -Z3rev * Math.cos(Z3A);
  const pgr3 = or3 - x3 * Math.cos(Z3t);
  const pkr3 = pgr3 + (Z3 + Z3rev) * Math.cos(Z3A);
  const prr3 = or3 + xx3 * Math.cos(Z3t);
  const pcr3 = prr3 + (Z3 + Z3rev) * Math.cos(Z3A);
  const Z3pol = [[pgr3, pgx3], [pkr3, pkx3], [pcr3, pcx3], [prr3, prx3], [pgr3, pgx3]];
  const Z3el = [[-Z3rev * Math.cos(Z3A), , , , , -Z3rev * xmul1], [Z3 * Math.cos(Z3A), , , , , Z3 * xmul1],
  [pgr3, , , , pgx3], [pkr3, , , , pkx3], [pcr3, , , , pcx3], [prr3, , , , prx3], [pgr3, , , , pgx3]];
  return [Z3pol, Z3el];
}

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
  let Zpol = [[0, 0], [r1, x1], [r2, x2], [r3, x3], [r4, x4], [r5, x5], [0, 0]]; //Z1 polygon
  let Zel = [[0, ...empty, 0], [r1, ...empty, x1], [r2, ...empty, x2], [r3, ...empty, x3], [r4, ...empty, x4], [r5, ...empty, x5], [0, ...empty, 0]];
  let stuff = { a, b, g, Z, LH };
  return [Zpol, Zel, stuff];
}

function Zone1P438(tr) {
  return P438(tr, `1`, [,]);
}

function Zone2P438(tr) {
  return P438(tr, `2`, [, ,]);
}

function Zone3P438(tr) {
  let Zr = Number(document.getElementById(`Zone3rev`).value);
  Zr = document.getElementById("Sec").checked ? Zr / tr : Zr;
  let [Zpol, Zel, stuff] = P438(tr, `3`, [, , ,]);
  let { a, b, g, Z, LH } = stuff;
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
  let Zpol = [[0, 0]];
  let Zel = [[0, ...empty, 0]];
  for (let i = 0; i <= 100; i++) {
    const rad = i / 100 * b + (1 - i / 100) * g;
    const maxres = Z < 25000 / load ? Z : 25000 / load * Math.cos(40 * Math.PI / 180);
    const res = rad > a
      ? Z * Math.cos(rad)
      : Math.min(Z * Math.cos(rad), maxres);
    const rea = rad > a || Z * Math.cos(rad) < maxres
      ? Z * Math.sin(rad)
      : maxres * Math.tan(rad);
    Zpol.push([res, rea]);
    Zel.push([res, ...empty, rea]);
  }
  Zpol.push([0, 0]);
  Zel.push([0, ...empty, 0]);
  let stuff = { a, b, g, Z };
  return [Zpol, Zel, stuff];
}

function Zone1S7ST(tr) {
  return S7ST(tr, `1`, [,]);
}

function Zone2S7ST(tr) {
  return S7ST(tr, `2`, [, ,]);
}

function Zone3S7ST(tr) {
  let Zr = Number(document.getElementById(`Zone3rev`).value);
  Zr = document.getElementById("Sec").checked ? Zr / tr : Zr;
  const load = Number(document.querySelector("#PeakLoad").value) || 1000;
  let [Zpol, Zel, stuff] = S7ST(tr, `3`, [, , ,]);
  let { a, b, g, Z, LH } = stuff;
  for (let i = 0; i <= 100; i++) {
    const rad = i / 100 * (b + Math.PI) + (1 - i / 100) * (g + Math.PI);
    const res = rad > a + Math.PI
      ? Z * Math.cos(rad)
      : Math.max(Z * Math.cos(rad), Zr);
    const rea = rad > a + Math.PI || Z * Math.cos(rad) > Zr
      ? Z * Math.sin(rad)
      : Zr * Math.tan(rad);
    Zpol.push([res, rea]);
    Zel.push([res, , , , rea]);
  }
  Zpol.push([0, 0]);
  Zel.push([0, , , , 0]);
  return [Zpol, Zel];
}

function summaryTable(data) {
  let maxfault = data[9][2]; //remove the risk of any initial fault recording noise
  const multi = smoothdec((data[1][0] - data[0][0]) * 1000) < 1 ? 1.3 : 2; //bigger multiplier for 1ms interval
  const column = [`Fault Level`, `Fault Duration`, `Fault Start`, `Fault Finish`, `Zone 1`, `Zone 2`, `Zone 3`];
  let timers = JSON.parse(localStorage.getItem(`ZoneTimers`));
  let duration = 0;
  let startflag = true;
  let endflag = true;
  let counter = 0; //counter to ignore first initial fault recording noise
  data.forEach(x => {
    if (maxfault * multi < x[2] && startflag && counter > 25) {
      duration = x[0];
      timers.unshift(`${smoothdec(x[0], 3)} s`);
      startflag = false;
    }
    if (maxfault > x[2] * multi && endflag && !startflag) {
      duration = x[0] - duration;
      timers.splice(1, 0, `${smoothdec(x[0], 3)} s`);
      endflag = false;
    }
    maxfault = Math.max(maxfault, x[2]);
    counter++;
  });
  duration = duration === 0 ? `???` : smoothdec(duration * 1000, 0);
  if (endflag) timers.unshift(`Error`, `Error`);
  const column2 = [`${smoothdec(maxfault / 1000)} kA`, `${duration} ms`, ...timers];

  const summaryArr = column.map((x, i) => [x, column2[i]]);
  table(summaryArr);
}

function table(rows) {
  const tabdiv = document.querySelector(`#SummaryTable`);
  const myTable = document.createElement(`table`);
  myTable.classList.add(`scores`);
  const row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = `<th>Item</th>`;
  row.insertCell(1).outerHTML = `<th>Result</th>`;

  try {
    rows.forEach(arr => {
      const row = myTable.insertRow(-1);
      [row.insertCell(0).innerHTML, row.insertCell(1).innerHTML] = arr;
    });
  } catch (err) { logError(err); }

  while (tabdiv.childElementCount > 1) tabdiv.removeChild(tabdiv.lastChild);
  tabdiv.appendChild(myTable);
}

function vtRatio() {
  const label = document.querySelector(`label[for=VTR]`);
  const vtr = document.querySelector("#VTR").value || 240;
  label.innerText = `VT Ratio (26.4/${smoothdec(26.4 / vtr, 2)} kV)`;
}

function ctRatio() {
  const label = document.querySelector(`label[for=CTR]`);
  const ctr = document.querySelector("#CTR").value || 600;
  label.innerText = `CT Ratio (${ctr}/1 A)`;
}

let idbSupported = ("indexedDB" in window) ? true : false;
let db;
//startup
startup();