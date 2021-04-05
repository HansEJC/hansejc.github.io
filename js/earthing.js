function volts(v) {
  return v > 1000 ? `${+(v / 1000).toFixed(2)} kV` : `${+v.toFixed(2)} V`;
}

function earthing() {
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  eprCalc();
  earthGrid();
}

function eprCalc() {
  let er = +(getSavedValue("ER"));    // set the value to this input
  let rr = +(getSavedValue("RR"));
  let fc = +(getSavedValue("FC"));
  let pr = er * rr / (er + rr);
  let epr = 1000 * pr * fc;
  let ir = epr / rr / 1000;
  let ig = epr / er / 1000;
  let irp = 100 * ir / fc;
  let igp = 100 * ig / fc;

  document.getElementById("EPR").textContent = volts(epr);
  document.getElementById("EPR").className = epr > 645 ? 'label danger' : 'label safe';
  texty(`PR`, pr, `Ω`);
  texty(`IR`, ir, `kA`);
  texty(`IG`, ig, `kA`);
  texty(`IRp`, irp, `%`, 0);
  texty(`IGp`, igp, `%`, 0);
}

function earthGrid() {
  let p = +(getSavedValue("P"));    // set the value to this input
  let area = +(getSavedValue("AREA"));
  let h = +(getSavedValue("H"));
  let l = +(getSavedValue("L"));
  let nr = +(getSavedValue("NR"));
  let lr = +(getSavedValue("LR"));
  let r = Math.sqrt(area / Math.PI);
  let kr = 1 + nr * lr * lr / (10 * r * r);
  let re = p / (4 * r) + p / (l + nr * lr);
  let rg = p * ((1 + r / (r + 2.5 * h)) / (8 * r * kr) + 1 / l);
  let era = +(getSavedValue("ERA"));
  let pa = era * p / rg;

  texty(`R`, r, `m`);
  texty(`KR`, kr, ``);
  texty(`RE`, re, `Ω`);
  texty(`RG`, rg, `Ω`);
  texty(`PA`, pa, `Ωm`);
}

const texty = (id, num, sym, dec = 2) => {
  document.querySelector(`#${id}`).textContent = `${+num.toFixed(dec)} ${sym}`;
}

//startup
window.addEventListener("load", function () {
  earthing();
  document.onkeyup = function () {
    earthing();
  };
});