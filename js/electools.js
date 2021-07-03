function startup() {
  loadcalc();
  createInps();
  parallel();
  polrec();
  poladd();
  consum();
  document.onkeyup = function() {
    parallel();
    poladd();
    consum();
    polrec();
    loadcalc();
  };

}

function createInps() {
  remParallel();  
  let npr = Number(getSavedValue(`NumPar`));    // set the value to this input
  if (npr<2) npr = 2;
  let cb = [], cb2 = [], cb3 = [];
  let cbh = document.getElementById('Parallel'), cbh2 = document.getElementById('Nums'), cbh3 = document.getElementById('Angs');
  if (npr < 100){
    for(let i = 0; i < npr; i++){
      cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('input');
      cb[i].type = 'Number'; cb2[i].type = 'Number'; cb3[i].type = 'Number';
      cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]); cbh3.appendChild(cb3[i]);
      cb[i].id = `res${i}`; cb2[i].id = `pnum${i}`; cb3[i].id = `pang${i}`;
    }
  }
  else{
    cb[0] = document.createElement('input'); cb2[0] = document.createElement('input'); cb3[0] = document.createElement('input');
    cb[0].type = 'text'; cb2[0].type = 'text'; cb3[0].type = 'text';
    cb[0].value = 'bad human!'; cb2[0].value = 'bad human!'; cb3[0].value = 'bad human!';
    cbh.appendChild(cb[0]); cbh2.appendChild(cb2[0]); cbh3.appendChild(cb3[0]);
  }
}

function parallel() {
  document.querySelectorAll('input[type=Number]').forEach((inp) => {
    inp.value = getSavedValue(inp.id);
    inp.onkeyup = function(){saveValue(this);};
    if (inp.id === `NumPar`) inp.addEventListener('keyup',createInps);
  });
  let npr = Number(document.getElementById(`NumPar`).value);    // set the value to this input
  if (npr<2) npr = 2;
  let pr = 0, res;
  for (let i = 0; i < npr; i++){
    res = Number(getSavedValue(`res${i}`)) || Number.MAX_SAFE_INTEGER;
    pr += 1/res;
  }
  pr = 1/pr;
  document.querySelector("#PR").textContent = `${Number(pr.toFixed(2))} Ω`;
}

function polrec() {
  let pn = Number(getSavedValue("PN"));
  let pa = Number(getSavedValue("PA"));
  let rr = Number(getSavedValue("RR"));
  let ir = Number(getSavedValue("IR"));
  let ptrr = pn*Math.cos(pa*Math.PI/180);
  let ptir = pn*Math.sin(pa*Math.PI/180);
  let rtpn = Math.sqrt(rr*rr+ir*ir);
  let rtpa = 180*Math.atan(ir/rr)/Math.PI;
  if (rr<0) rtpa = 180+180*Math.atan(ir/rr)/Math.PI;
  if (rr<0 && ir<0) rtpa = -180+180*Math.atan(ir/rr)/Math.PI;

  document.querySelector("#PTR").textContent = `${Number(ptrr.toFixed(2))} + j${Number(ptir.toFixed(2))}`;
  document.querySelector("#RTP").textContent = `${Number(rtpn.toFixed(2))} + ∠${Number(rtpa.toFixed(2))}°`;
}

function poladd() {
  let npr = Number(document.getElementById(`NumPar`).value);
  if (npr<2) npr = 2;
  let num = 0; let ang = 0;
  let nums, angs, real, imag;
  let reals = 0, imags = 0;
  for(let i = 0; i < npr; i++){
      nums = Number(getSavedValue(`pnum${i}`));
      angs = Number(getSavedValue(`pang${i}`));
      real = nums*Math.cos(angs*Math.PI/180);
      imag = nums*Math.sin(angs*Math.PI/180);
      reals = reals+real;
      imags = imags+imag;
  }
  num = Math.sqrt(reals*reals+imags*imags);
  ang = 180*Math.atan(imags/reals)/Math.PI;
  if (reals<0) ang = 180+180*Math.atan(imags/reals)/Math.PI;
  if (reals<0 && imags<0) ang = -180+180*Math.atan(imags/reals)/Math.PI;
  document.querySelector("#PSUM").textContent = `${Number(num.toFixed(2))} + ∠${Number(ang.toFixed(2))}°`;
}

function loadcalc() {
  let ilv = Number(getSavedValue("ILV"));
  let l1l = Number(getSavedValue("L1L"));
  let l2l = Number(getSavedValue("L2L"));
  let l3l = Number(getSavedValue("L3L"));
  let l12l = Number(getSavedValue("L12L"));
  let l13l = Number(getSavedValue("L13L"));
  let l23l = Number(getSavedValue("L23L"));

  let l1t = l1l+((l12l+l13l)/2)*Math.sqrt(3);
  let l2t = l2l+((l12l+l23l)/2)*Math.sqrt(3);
  let l3t = l3l+((l23l+l13l)/2)*Math.sqrt(3);
  let nl = Math.sqrt(l1l*l1l+l2l*l2l+l3l*l3l-l1l*l2l-l2l*l3l-l1l*l3l);
  let tpow = (l1t+l2t+l3t)*ilv/Math.sqrt(3);

  document.querySelector("#L1T").textContent = `${Number(l1t.toFixed(2))} A`;
  document.querySelector("#L2T").textContent = `${Number(l2t.toFixed(2))} A`;
  document.querySelector("#L3T").textContent = `${Number(l3t.toFixed(2))} A`;
  document.querySelector("#NL").textContent = `${Number(nl.toFixed(2))} A`;

  if (tpow > 1000000) document.querySelector("#TPOW").textContent = `${Number((tpow/1000000).toFixed(2))} MVA`;
  else if (tpow > 1000) document.querySelector("#TPOW").textContent = `${Number((tpow/1000).toFixed(2))} kVA`;
  else document.querySelector("#TPOW").textContent = `${Number(tpow.toFixed(2))} VA`;
}

function consum() {
  let conl = Number(getSavedValue("CONL"));
  let conr = Number(getSavedValue("CONR"));
  let conh = Number(getSavedValue("CONH"));

  let cond = Math.floor(conh/24);
  let conm = conh%24;
  let conk = conl*conh/1000;
  let conc = conk*conr;

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