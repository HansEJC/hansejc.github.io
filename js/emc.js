function killthemeter(num) {
  if (num > 1000) return `${Number((num / 1000).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/gu, ","))} km`;
  else if (num > 1) return `${Number(num.toFixed(2))} m`;
  else if (num > 0.1) return `${Number((num * 100).toFixed(2))} cm`;
  else if (num > 0.001) return `${Number((num * 1000).toFixed(2))} mm`;
  else if (num > 0.000001) return `${Number((num * 1000000).toFixed(2))} μm`;
  else if (num > 0.000000001) return `${Number((num * 1000000000).toFixed(2))} nm`;
  else if (num > 0) return `${Number((num * 1000000000000).toFixed(2))} pm`;
  return `-`;
}

function kill(num) {
  if (num >= 1000000000000000) return `${Number((num / 1000000000000000).toFixed(2))}P`;
  else if (num >= 1000000000000) return `${Number((num / 1000000000000).toFixed(2))}T`;
  else if (num >= 1000000000) return `${Number((num / 1000000000).toFixed(2))}G`;
  else if (num >= 1000000) return `${Number((num / 1000000).toFixed(2))}M`;
  else if (num >= 1000) return `${Number((num / 1000).toFixed(2))}k`;
  else if (num >= 1) return Number(num.toFixed(2));
  else if (num >= 0.001) return `${Number((num * 1000).toFixed(2))}m`;
  else if (num >= 0.000001) return `${Number((num * 1000000).toFixed(2))}μ`;
  else if (num >= 0.000000001) return `${Number((num * 1000000000).toFixed(2))}n`;
  else if (num >= 0.000000000001) return `${Number((num * 1000000000000).toFixed(2))}p`;
  return 0;
}

function labls(num) {
  if (num > 1000000000000000) return "P";
  else if (num > 1000000000000) return "T";
  else if (num > 1000000000) return "G";
  else if (num > 1000000) return "M";
  else if (num > 1000) return "k";
  else if (num > 1) return "";
  else if (num > 0.001) return "m";
  else if (num > 0.000001) return "μ";
  return "-";
}

function checkit() {
  let x = document.getElementById("Lhide"), y = document.getElementById("Hhide");
  if (document.querySelector('#HF').checked) [x, y] = [y, x];
  x.style.display = "block";
  y.style.display = "none";
  calculations();
}

function multipliers() {
  //Change multiplier if over 1000
  const multy = document.getElementById("MUL");
  const tf = document.getElementById("TF");
  if (multy.value === "H" && getSavedValue("TF") > 999) {
    localStorage.setItem(tf.id, tf.value / 1000);
    localStorage.setItem(multy.id, "K");
  }
  if (multy.value === "K" && getSavedValue("TF") > 999) {
    localStorage.setItem(tf.id, tf.value / 1000);
    localStorage.setItem(multy.id, "M");
  }
  if (multy.value === "M" && getSavedValue("TF") > 999) {
    localStorage.setItem(tf.id, tf.value / 1000);
    localStorage.setItem(multy.id, "G");
  }
}

async function calculations() {
  multipliers();
  const radios = document.querySelectorAll("input[name=drive]");
  const fields = document.querySelectorAll("input[name=field]");
  const HiFreq = radios[1].checked;
  const EField = fields[0].checked = fields[1].checked ? false : true;
  radios[0].checked = !HiFreq;

  document.getElementById("CA").value = getSavedValue("CA") || 0.02;
  if (getSavedValue("MUL") !== "") document.getElementById("MUL").value = getSavedValue("MUL");

  const vo = Number(getSavedValue("VO"));
  const cu = Number(getSavedValue("CU"));
  let ca = getSavedValue("CA") || 0.02;
  ca = Number(ca) * Math.pow(10, -9); //from μF/km to F/m
  const eo = 8.55 * Math.pow(10, -12);
  const uo = 4 * Math.PI * Math.pow(10, -7);
  const q = ca * vo;
  document.getElementById("CH").innerHTML = `${q.toExponential(2)} C/m`;

  let tf = Number(getSavedValue("TF"));    // set the value to this input
  const eirp = Number(getSavedValue("EIRP"));
  const c = 299792458; //speed of light

  if (document.getElementById("MUL").value === "K") tf = tf * 1000;
  if (document.getElementById("MUL").value === "M") tf = tf * 1000000;
  if (document.getElementById("MUL").value === "G") tf = tf * 1000000000;

  const fi = c / (2 * Math.PI * tf);
  document.getElementById("FI").innerHTML = killthemeter(fi);

  let earray = [];
  //let range = 0, ran = 0, distrange = 0;
  const stuff = { radios, fields };
  const freqStuff = { earray, c, tf, EField, eirp, eo, q, uo, cu, fi, ...stuff };

  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  } catch (e) { logError(e); }

  if (HiFreq && tf * eirp === 0) return; //return if plotting nothing
  let freqObj = {};
  freqObj = HiFreq ? HiFreqFun(freqStuff) : LowFreqFun(freqStuff);
  try {
    ({ earray, ran, range, distrange } = freqObj);
  } catch (err) { return; }

  dygPlot(earray);
  dygUpdate({ ...stuff, ...freqObj });
}

function HiFreqFun(stuff) {
  const { earray, c, tf, EField, eirp, fi } = stuff;
  let d, ran, range, distrange;
  for (let i = 0; i < 5000; i++) {
    d = i / 100;
    if (d < c / (2 * Math.PI * tf) && d !== 0) {
      if (EField) earray.push([d, Math.pow(c, 2) * Math.sqrt(eirp) / (7.2 * Math.pow(tf, 2) * Math.pow(d, 3))]);
      else earray.push([d, c * Math.sqrt(eirp) / (434 * tf * Math.pow(d, 2))]);
    }
    if (d > c / (2 * Math.PI * tf)) {
      if (EField) earray.push([d, 5.48 * Math.sqrt(eirp) / d]);
      else earray.push([d, Math.sqrt(eirp) / (68.8 * d)]);
    }
  }
  if (fi > 0.1) {
    range = Math.pow(c, 2) * Math.sqrt(eirp) / (7.2 * Math.pow(tf, 2));
    ran = c * Math.sqrt(eirp) / (434 * tf);
  }
  if (fi < 0.1 || tf > 45000000) {
    range = 5.48 * Math.sqrt(eirp);
    ran = Math.sqrt(eirp) / (68.8);
  }
  const freqStuff = { earray, ran, range, distrange };
  return freqStuff;
}

function LowFreqFun(stuff) {
  const { EField, fields, earray, eo, q, uo, cu } = stuff;
  let d, distrange;
  if (EField && q === 0) return; //return if plotting nothing
  if (fields[1].checked && cu === 0) return;
  const lowfreqrange = 51000;
  for (let i = 0; i < lowfreqrange; i++) {
    d = i / 1000;
    if (EField) {
      earray.push([d, q / (2 * Math.PI * eo * d), 5e3, 9e3]);
      distrange = q / (2 * Math.PI * eo * d) < 2000 ? q / (2 * Math.PI * eo * d) > 1990 ? d : distrange : lowfreqrange / 1000;
    }
    else {
      earray.push([d, uo * cu / (2 * Math.PI * d), 100e-6, 360e-6]);
      distrange = uo * cu / (2 * Math.PI * d) < 5e-5 ? uo * cu / (2 * Math.PI * d) > 4.5e-5 ? d : distrange : lowfreqrange / 1000;
    }
  }
  const range = Math.max(q / (2 * Math.PI * eo * 0.3), 50e3);
  const ran = Math.max(uo * cu / (2 * Math.PI * 0.3), 400e-6);
  const freqStuff = { earray, ran, range, distrange };
  return freqStuff;
}

function dygPlot(earray) {
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    earray,
    {
      legend: 'always',
      xlabel: "Distance (m)",
      connectSeparatedPoints: true,
      axes: {
        x: {
          axisLabelFormatter(y) { return killthemeter(smoothdec(y, 6)) },
        },
        y: {
          axisLabelFormatter(y) { return kill(smoothdec(y, 6)) },
        }
      }
    }          // options
  );
  g3.ready(dygReady);
}

function dygUpdate(stuff) {
  const { radios, fields, ran, range, distrange } = stuff;
  const HiFreq = radios[1].checked, EField = fields[0].checked;
  if (HiFreq) {
    g3.updateOptions({
      labels: (EField) ? ['Distance', `Electric Field (${labls(range)}V/m)`] : ['Distance', `Magnetic Field (${labls(ran)}A/m)`],
      ylabel: (EField) ? `Electric Field (${labls(range)}V/m)` : `Magnetic Field (${labls(ran)}A/m)`,
      valueRange: (EField) ? [0, range] : [0, ran],
    });
  }
  else {
    g3.updateOptions({
      labels: (EField) ? ['Distance', `Electric Field (${labls(range)}V/m)`, "Public Guidance Limit (5kV/m)", "Public Required Limit (9kV/m)"] : ['Distance', `Magnetic Field (${labls(ran)}T)`, "Public Guidance Limit (100μT)", "Public Required Limit (360μT)"],
      valueRange: (EField) ? [0, range] : [0, ran],
      ylabel: (EField) ? `Electric Field (${labls(range)}V/m)` : `Magnetic Field (${labls(ran)}T)`,
      colors: ["rgb(0,128,128)", "#cccc2b", "red"],
      dateWindow: [0, distrange]
    });
  }
}

function dygReady() {
  setTimeout(function () {
    window.dispatchEvent(new Event('resize'));
  }, 500);
}

//startup
window.addEventListener("load", function () {
  funkyRadio();  
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  const radios = document.querySelectorAll("input[name=drive]");
  const fields = document.querySelectorAll("input[name=field]");
  radios.forEach(rad => rad.addEventListener('change', checkit));
  fields.forEach(rad => rad.addEventListener('change', calculations));
  checkit();
  document.onkeyup = function () {
    calculations();
  };
});