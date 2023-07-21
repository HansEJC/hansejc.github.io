function volts(v) {
  return v > 1000 ? `${Number((v / 1000).toFixed(2))} kV` : `${Number(v.toFixed(2))} V`;
}

function earthing() {
  eprCalc();
  earthGrid();
}

function eprCalc() {
  const er = Number(getSavedValue("ER"));    // set the value to this input
  const rr = Number(getSavedValue("RR"));
  const fc = Number(getSavedValue("FC"));
  const pr = er * rr / (er + rr);
  const epr = 1000 * pr * fc;
  const ir = epr / rr / 1000;
  const ig = epr / er / 1000;
  const irp = 100 * ir / fc;
  const igp = 100 * ig / fc;

  document.getElementById("EPR").textContent = volts(epr);
  document.getElementById("EPR").className = epr > 645 ? 'label danger' : 'label safe';
  texty(`PR`, pr, `Ω`);
  texty(`IR`, ir, `kA`);
  texty(`IG`, ig, `kA`);
  texty(`IRp`, irp, `%`, 0);
  texty(`IGp`, igp, `%`, 0);
}

function earthGrid() {
  const p = Number(getSavedValue("P"));    // set the value to this input
  const area = Number(getSavedValue("AREA"));
  const h = Number(getSavedValue("H"));
  const l = Number(getSavedValue("L"));
  const nr = Number(getSavedValue("NR"));
  const lr = Number(getSavedValue("LR"));
  const r = Math.sqrt(area / Math.PI);
  const kr = 1 + nr * lr * lr / (10 * r * r);
  const re = p / (4 * r) + p / (l + nr * lr);
  const rg = p * ((1 + r / (r + 2.5 * h)) / (8 * r * kr) + 1 / l);
  const era = Number(getSavedValue("ERA"));
  const pa = era * p / rg;

  texty(`R`, r, `m`);
  texty(`KR`, kr, ``);
  texty(`RE`, re, `Ω`);
  texty(`RG`, rg, `Ω`);
  texty(`PA`, pa, `Ωm`);
}

const texty = (id, num, sym, dec = 2) => {
  document.querySelector(`#${id}`).textContent = `${Number(num.toFixed(dec))} ${sym}`;
}

//startup
window.addEventListener("load", function () {
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  earthing();
  document.onkeyup = function () {
    earthing();
  };
});