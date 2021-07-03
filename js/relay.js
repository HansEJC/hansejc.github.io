function checkit() {
  const x = document.getElementById(`Sec`).checked || document.querySelector(`#advanced`).checked;
  const y = document.getElementById("hide");
  y.style.display = x ? `block` : `none`;
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
  const dbObj = firebase.database().ref(`relay`);
  dbObj.set({ data, headers });
}

function saveIndexedDB(data) {
  getIndex();
  let transaction = db.transaction(["plots"], "readwrite");
  let objectStore = transaction.objectStore("plots");
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

function read() {
  let transaction = db.transaction(["plots"], "readonly");
  let objectStore = transaction.objectStore("plots");
  objectStore.openCursor(null, "prev").onsuccess = async function (event) {
    let cursor = event.target.result;
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
    let reader = new FileReader();
    reader.onload = function (evt) {
      if (evt.target.readyState != 2) return;
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
    let openRequest = indexedDB.open("graph", 1);
    openRequest.onupgradeneeded = dbUpgrade(db);
    openRequest.onsuccess = function (e) {
      db = e.target.result;
      let transaction = db.transaction(["plots"]);
      let objectStore = transaction.objectStore("plots");
      let request = objectStore.get("2");
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
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = (getSavedValue(box.id) == "true");
  });
  for (let i = 0; i < 6; i++) document.getElementById(i).checked = true;
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  let select = document.querySelector(`select`);
  select.value = getSavedValue(select.id) || `P438`;
  javaread();
  // await code here
  let DR = [];
  plotProtection(DR);
  document.onkeyup = function () {
    try { read(); } catch (e) { logError(e); }
  };
  let prim = document.getElementById("Prim");
  prim.onchange = function () { read(); checkit(); };
  prim.checked = getSavedValue(prim.id) == "true" || getSavedValue(prim.id) == "";
  document.getElementById("Sec").onchange = function () { checkit(); read(); };
  let primDR = document.getElementById("PrimDR");
  primDR.onchange = function () { read(); };
  primDR.checked = getSavedValue(primDR.id) == "true" || getSavedValue(primDR.id) == "";
  document.getElementById("SecDR").onchange = function () { read(); };
  checkit();
}

function change(el) {
  g3.setVisibility(el.id, el.checked);
}

function inside(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  let x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i][0], yi = vs[i][1];
    let xj = vs[j][0], yj = vs[j][1];

    let intersect = ((yi > y) != (yj > y))
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
  for (let i = 0; i < 40; i++) {
    rad = i * Math.PI / 180;
    r = Z * Math.cos(rad) * 0.85; //Resistive reach tolerance of 15%
    x = Z * Math.sin(rad);
    loadarray.push([r, , , , , , x]);
  }
  r = 60 * Math.cos(rad);
  x = 60 * Math.sin(rad);
  loadarray.push([r, , , , , , x]);
  return loadarray;
}

function plotProtection(csvarr) {
  let select = document.querySelector(`select`);
  const secdr = document.getElementById("SecDR");

  //Advanced settings variables
  let z2del = Number(document.getElementById("Z2del").value);
  let z3del = Number(document.getElementById("Z3del").value);
  let fst, vtr, ctr;

  fst = document.getElementById("FST").value == "" ? 1 : Number(document.getElementById("FST").value);
  vtr = document.getElementById("VTR").value == "" ? 1 : Number(document.getElementById("VTR").value);
  ctr = document.getElementById("CTR").value == "" ? 1 : Number(document.getElementById("CTR").value);
  let tr = ctr / vtr; //secondary ratio

  //Primary or Secondary Disturbance record
  let trdr = 1;
  let vtrdr = 1;
  if (secdr.checked) { trdr = tr; vtrdr = vtr; }

  let [Z1pol, Z1el] = eval(`Zone1${select.value}(tr)`);
  let [Z2pol, Z2el] = eval(`Zone2${select.value}(tr)`);
  let [Z3pol, Z3el] = eval(`Zone3${select.value}(tr)`);
  let elements2 = [...peakLoad(), ...Z3el, ...Z2el, ...Z1el]; //All Zone polygons and the char angle
  let polnums = [...Z1pol.flat(), ...Z2pol.flat(), ...Z3pol.flat()];
  polnums = { max: Math.max(...polnums) * 1.2, min: Math.min(...polnums) * 1.2 };
  const polmax = (num) => Math.max(polnums.max, num);
  const polmin = (num) => Math.min(polnums.min, num);
  let xaxis = [polmin(-40), polmax(50)];
  let yaxis = [polmin(-20), polmax(70)];
  let DR = []; DR = csvarr;
  let calcStuff = { DR, trdr, vtrdr };
  let faultarray = addCSVtoArray(calcStuff);
  let stuff = { faultarray, Z1pol, Z2pol, Z3pol, fst, z2del, z3del };
  FaultZone(stuff);

  let total = elements2.slice();
  for (let i = 0; i < faultarray.length; i++) {
    total.push(faultarray[i]);
  }
  dygPlot(total, xaxis, yaxis);
}

function addCSVtoArray(stuff) {
  let { DR, trdr, vtrdr } = stuff;
  let faultarray = [], DRdiv, DRmult, res, react;
  if (DR.length === 0) return faultarray;
  let [v, va, c, ca] = JSON.parse(localStorage.getItem(`indices`));
  for (let i = 1; i < DR.length; i++) { //add csv to array
    DRdiv = (DR[i][v] / DR[i][c]) / trdr;
    DRmult = (DR[i][va] - DR[i][ca]) * Math.PI / 180;
    res = DRdiv * Math.cos(DRmult);
    react = DRdiv * Math.sin(DRmult);
    let isfault = res < 90 && react < 90 && react > 0 && DR[i][v] * vtrdr > 1000;
    if (isfault) {
      faultarray.push([
        DRdiv * Math.cos(DRmult), //resistive values
        DRdiv * Math.sin(DRmult) //reactive values
      ]);
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
  let { faultarray, Z1pol, Z2pol, Z3pol, fst, z2del, z3del } = stuff;
  let Z3time = 0;
  let Z2time = 0;
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
      break;
    }
    else document.getElementById("FaultLoc").textContent = "No trip!";
  }
}

async function dygPlot(total, xaxis, yaxis) {
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  } catch (e) { logError(e); }
  g3 = new Dygraph(
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
          axisLabelFormatter: function (y) {
            return y + ' Ω';
          },
        },
        y: {
          axisLabelFormatter: function (y) {
            return y + ' Ω';
          },
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

function Zone1P44T(tr) {
  //%Zone 1 setting
  let Z1 = Number(document.getElementById("Zone1").value);
  let Z1A = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  let Z1t = (-3 * Math.PI / 180);
  let R1R = Number(document.getElementById("Zone1RH").value);
  let R1L = Number(document.getElementById("Zone1LH").value);
  let Z1s = (87 * Math.PI / 180);
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
  let x1 = xmul1 * R1L / xmul2;
  let xx1 = xmul1 * R1R / xmul2;
  let pkx1 = -x1 * Math.sin(Z1t) + Z1 * xmul1;
  if (-R1L * Math.sin(pmul2) > pkx1) {
    let pgx1 = pkx1;
  }
  else {
    pgx1 = -R1L * Math.sin(pmul2);
  }
  let pcx1 = xx1 * Math.sin(Z1t) + Z1 * xmul1;
  let prx1 = pmul1 * Math.sin(pmul2);
  let pgr1 = -pgx1 * Math.sin(Z1s) / Math.sin((90 * Math.PI / 180) - Z1s);
  if (pgx1 == pkx1) {
    let pkr1 = pgr1;
  }
  else {
    pkr1 = -x1 * Math.cos(Z1t) + Z1 * Math.cos(Z1A);
  }
  let pcr1 = xx1 * Math.cos(Z1t) + Z1 * Math.cos(Z1A);
  let prr1 = pmul1 * Math.cos(pmul2);
  let Z1pol = [[pgr1, pgx1], [pkr1, pkx1], [pcr1, pcx1], [prr1, prx1], [pgr1, pgx1]]; //Z1 polygon
  let Z1el = [[pgr1, , pgx1], [pkr1, , pkx1], [pcr1, , pcx1], [prr1, , prx1], [pgr1, , pgx1]];
  return [Z1pol, Z1el];
}

function Zone2P44T(tr) {
  //%Zone 2 setting
  let Z2 = Number(document.getElementById("Zone2").value);
  let Z2A = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  let Z2t = (-3 * Math.PI / 180);
  let R2R = Number(document.getElementById("Zone2RH").value);
  let R2L = Number(document.getElementById("Zone2LH").value);
  let Z2s = (87 * Math.PI / 180);
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
  let x2 = xmul1 * R2L / Math.sin(xmul2);
  let xx2 = xmul1 * R2R / Math.sin(xmul2);
  let pkx2 = -x2 * Math.sin(Z2t) + Z2 * xmul1;
  if (-R2L * Math.sin(pr22) > pkx2) {
    let pgx2 = pkx2;
  }
  else {
    pgx2 = -R2L * Math.sin(pr22);
  }

  let pcx2 = xx2 * Math.sin(Z2t) + Z2 * xmul1;
  let prx2 = pr21 * Math.sin(pr22);
  let pgr2 = -pgx2 * Math.sin(Z2s) / Math.sin((90 * Math.PI / 180) - Z2s);
  if (pgx2 == pkx2) {
    let pkr2 = pgr2;
  }
  else {
    pkr2 = -x2 * Math.cos(Z2t) + Z2 * Math.cos(Z2A);
  }
  let pcr2 = xx2 * Math.cos(Z2t) + Z2 * Math.cos(Z2A);
  let prr2 = pr21 * Math.cos(pr22);
  let Z2pol = [[pgr2, pgx2], [pkr2, pkx2], [pcr2, pcx2], [prr2, prx2], [pgr2, pgx2]];
  let Z2el = [[pgr2, , , pgx2], [pkr2, , , pkx2], [pcr2, , , pcx2], [prr2, , , prx2], [pgr2, , , pgx2]];
  return [Z2pol, Z2el];
}

function Zone3P44T(tr) {
  //%Zone 3 setting
  let Z3 = Number(document.getElementById("Zone3").value);
  let Z3A = (Number(document.getElementById("Alpha").value) * Math.PI / 180);
  let Z3t = (-3 * Math.PI / 180);
  let R3R = Number(document.getElementById("Zone3RH").value);
  let R3L = Number(document.getElementById("Zone3LH").value);
  let Z3rev = Number(document.getElementById("Zone3rev").value);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z3 = Z3 / tr; R3R = R3R / tr; R3L = R3L / tr;
  }
  //%Zone 3 plot
  const xmul1 = Math.sin(Z3A);
  const xmul2 = (180 * Math.PI / 180) - Z3A + Z3t;
  let x3 = xmul1 * R3L / Math.sin(xmul2);
  let xx3 = xmul1 * R3R / Math.sin(xmul2);
  let ox3 = -Z3rev * xmul1;
  let pgx3 = ox3 - x3 * Math.sin(Z3t);
  let pkx3 = pgx3 + (Z3 + Z3rev) * xmul1;
  let prx3 = ox3 + xx3 * Math.sin(Z3t);
  let pcx3 = prx3 + (Z3 + Z3rev) * xmul1;
  let or3 = -Z3rev * Math.cos(Z3A);
  let pgr3 = or3 - x3 * Math.cos(Z3t);
  let pkr3 = pgr3 + (Z3 + Z3rev) * Math.cos(Z3A);
  let prr3 = or3 + xx3 * Math.cos(Z3t);
  let pcr3 = prr3 + (Z3 + Z3rev) * Math.cos(Z3A);
  let Z3pol = [[pgr3, pgx3], [pkr3, pkx3], [pcr3, pcx3], [prr3, prx3], [pgr3, pgx3]];
  let Z3el = [[-Z3rev * Math.cos(Z3A), , , , , -Z3rev * xmul1], [Z3 * Math.cos(Z3A), , , , , Z3 * xmul1],
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

let idbSupported = ("indexedDB" in window) ? true : false;
let db;
//startup
startup();