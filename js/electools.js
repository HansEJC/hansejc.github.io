function startup() {
  createInps();
  loadcalc();
  parallel();
  polrec();
  pnrEquations();
  consum();
  document.onkeyup = function () {
    parallel();
    pnrEquations();
    consum();
    polrec();
    loadcalc();
  };

}

function createInps() {
  remParallel();
  let npr = Number(getSavedValue(`NumPar`));    // set the value to this input
  if (npr < 2) npr = 2;
  const cb = [], cb2 = [], cb3 = [];
  const cbh = document.getElementById('Parallel'), cbh2 = document.getElementById('Nums'), cbh3 = document.getElementById('Angs');
  if (npr < 100) {
    for (let i = 0; i < npr; i++) {
      cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('input');
      cb[i].type = 'Number'; cb2[i].type = 'Number'; cb3[i].type = 'Number';
      cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]); cbh3.appendChild(cb3[i]);
      cb[i].id = `res${i}`; cb2[i].id = `pnum${i}`; cb3[i].id = `pang${i}`;
    }
  }
  else {
    cb[0] = document.createElement('input'); cb2[0] = document.createElement('input'); cb3[0] = document.createElement('input');
    cb[0].type = 'text'; cb2[0].type = 'text'; cb3[0].type = 'text';
    cb[0].value = 'bad human!'; cb2[0].value = 'bad human!'; cb3[0].value = 'bad human!';
    cbh.appendChild(cb[0]); cbh2.appendChild(cb2[0]); cbh3.appendChild(cb3[0]);
  }
  document.querySelectorAll('input[type=Number]').forEach((inp) => {
    inp.value = getSavedValue(inp.id);
    inp.onkeyup = function () { saveValue(this); };
    if (inp.id === `NumPar`) inp.addEventListener('keyup', createInps);
  });
  funkyRadio();
  document.querySelectorAll('select').forEach(inp => inp.value = getSavedValue(inp.id));
}

function parallel() {
  let npr = Number(document.getElementById(`NumPar`).value);    // set the value to this input
  if (npr < 2) npr = 2;
  let pr = 0, res;
  for (let i = 0; i < npr; i++) {
    res = Number(getSavedValue(`res${i}`)) || Number.MAX_SAFE_INTEGER;
    pr += 1 / res;
  }
  pr = 1 / pr;
  document.querySelector("#PR").textContent = `${Number(pr.toFixed(2))} Ω`;
}

function polrec() {
  const pn = Number(getSavedValue("PN"));
  const pa = Number(getSavedValue("PA"));
  const rr = Number(getSavedValue("RR"));
  const ir = Number(getSavedValue("IR"));
  const { p2re, p2im } = pol2rec(pn, pa);
  const { r2pn, r2pa } = rec2pol(rr, ir);

  document.querySelector("#PTR").textContent = `${Number(p2re.toFixed(2))} + j${Number(p2im.toFixed(2))}`;
  document.querySelector("#RTP").textContent = `${Number(r2pn.toFixed(2))} + ∠${Number(r2pa.toFixed(2))}°`;
}

const pol2rec = (pn, pa) => { return { p2re: pn * Math.cos(pa * Math.PI / 180), p2im: pn * Math.sin(pa * Math.PI / 180) } };
const rec2pol = (rr, ir) => {
  let angle = 180 * Math.atan(ir / rr) / Math.PI || 0;
  angle += rr < 0 ? 180 : ir < 0 ? - 180 : 0;
  return { r2pn: Math.sqrt(rr * rr + ir * ir), r2pa: angle }
};

function pnrEquations() {
  const npr = Math.max(Number(document.getElementById(`NumPar`).value), 2);
  const ispolar = document.querySelector(`#PLR`).checked;
  const isadd = document.querySelector(`#EQU`).value === `A`;
  document.querySelector(`label[for="Nums"]`).textContent = ispolar ? `Numbers` : `Real`;
  document.querySelector(`label[for="Angs"]`).textContent = ispolar ? `Angles` : `Imaginary`;

  const { nums, angs, reals, imags } = isadd ? pnrAdd(npr, ispolar) : pnrParallel(npr, ispolar);
  document.querySelector("#PSUM").textContent = `${Number(nums.toFixed(2))} + ∠${Number(angs.toFixed(2))}°`;
  document.querySelector("#RSUM").textContent = `${Number(reals.toFixed(2))} + j${Number(imags.toFixed(2))}`;
}

function pnrAdd(npr, ispolar) {
  let reals = 0, imags = 0;
  for (let i = 0; i < npr; i++) {
    const fir = Number(getSavedValue(`pnum${i}`));
    const sec = Number(getSavedValue(`pang${i}`));
    const { p2re, p2im } = ispolar ? pol2rec(fir, sec) : { p2re: fir, p2im: sec };
    reals += p2re;
    imags += p2im;
  }
  return { nums: rec2pol(reals, imags).r2pn, angs: rec2pol(reals, imags).r2pa, reals, imags }
}

function pnrParallel(npr, ispolar) {
  let reals = 0, imags = 0;
  const max = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < npr; i++) {
    const fir = Number(getSavedValue(`pnum${i}`));
    const sec = Number(getSavedValue(`pang${i}`));
    let { r2pn, r2pa } = ispolar ? { r2pn: fir || max, r2pa: sec } : rec2pol(fir, sec);
    const { p2re, p2im } = pol2rec(1 / (r2pn || max), -r2pa)
    reals += p2re;
    imags += p2im;
  }
  const nums = 1 / rec2pol(reals, imags).r2pn;
  const angs = -rec2pol(reals, imags).r2pa;
  return { nums, angs, reals: pol2rec(nums, angs).p2re, imags: pol2rec(nums, angs).p2im }
}

function loadcalc() {
  const ilv = Number(getSavedValue("ILV"));
  const l1l = Number(getSavedValue("L1L"));
  const l2l = Number(getSavedValue("L2L"));
  const l3l = Number(getSavedValue("L3L"));
  const l12l = Number(getSavedValue("L12L"));
  const l13l = Number(getSavedValue("L13L"));
  const l23l = Number(getSavedValue("L23L"));

  const l1t = l1l + ((l12l + l13l) / 2) * Math.sqrt(3);
  const l2t = l2l + ((l12l + l23l) / 2) * Math.sqrt(3);
  const l3t = l3l + ((l23l + l13l) / 2) * Math.sqrt(3);
  const nl = Math.sqrt(l1l * l1l + l2l * l2l + l3l * l3l - l1l * l2l - l2l * l3l - l1l * l3l);
  const tpow = (l1t + l2t + l3t) * ilv / Math.sqrt(3);

  document.querySelector("#L1T").textContent = `${Number(l1t.toFixed(2))} A`;
  document.querySelector("#L2T").textContent = `${Number(l2t.toFixed(2))} A`;
  document.querySelector("#L3T").textContent = `${Number(l3t.toFixed(2))} A`;
  document.querySelector("#NL").textContent = `${Number(nl.toFixed(2))} A`;

  if (tpow > 1000000) document.querySelector("#TPOW").textContent = `${Number((tpow / 1000000).toFixed(2))} MVA`;
  else if (tpow > 1000) document.querySelector("#TPOW").textContent = `${Number((tpow / 1000).toFixed(2))} kVA`;
  else document.querySelector("#TPOW").textContent = `${Number(tpow.toFixed(2))} VA`;
}

function consum() {
  const conl = Number(getSavedValue("CONL"));
  const conr = Number(getSavedValue("CONR"));
  const conh = Number(getSavedValue("CONH"));

  const cond = Math.floor(conh / 24);
  const conm = conh % 24;
  const conk = conl * conh / 1000;
  const conc = conk * conr;

  document.querySelector("#COND").textContent = `${Number(cond.toFixed(0))} d, ${Number(conm.toFixed(0))} h`;
  document.querySelector("#CONK").textContent = `${Number(conk.toFixed(2))} kWh`;
  document.querySelector("#CONC").textContent = `${Number(conc.toFixed(2))} £`;

}

function remParallel() {
  const myNode = document.querySelector("#Parallel");
  myNode.innerHTML = '';
  const myNode2 = document.querySelector("#Nums");
  myNode2.innerHTML = '';
  const myNode3 = document.querySelector("#Angs");
  myNode3.innerHTML = '';
}

//startup
startup();