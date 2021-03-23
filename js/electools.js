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
  let npr = +(getSavedValue(`NumPar`));    // set the value to this input
  if (npr<2) npr = 2;
  let cb = [], cb2 = [], cb3 = [];
  let cbh = document.getElementById('Parallel'), cbh2 = document.getElementById('Nums'), cbh3 = document.getElementById('Angs');
  if (npr < 100){
    for(var i = 0; i < npr; i++){
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
  let npr = +(document.getElementById(`NumPar`).value);    // set the value to this input
  if (npr<2) npr = 2;
  let pr = 0, res;
  for (let i = 0; i < npr; i++){
    res = +(getSavedValue(`res${i}`)) || Number.MAX_SAFE_INTEGER;
    pr += 1/res;
  }
  pr = 1/pr;
  document.querySelector("#PR").textContent = `${+pr.toFixed(2)} Ω`;
}

function polrec() {
  var pn = +(getSavedValue("PN"));
  var pa = +(getSavedValue("PA"));
  var rr = +(getSavedValue("RR"));
  var ir = +(getSavedValue("IR"));
  var ptrr = pn*Math.cos(pa*Math.PI/180);
  var ptir = pn*Math.sin(pa*Math.PI/180);
  var rtpn = Math.sqrt(rr*rr+ir*ir);
  var rtpa = 180*Math.atan(ir/rr)/Math.PI;
  if (rr<0) rtpa = 180+180*Math.atan(ir/rr)/Math.PI;
  if (rr<0 && ir<0) rtpa = -180+180*Math.atan(ir/rr)/Math.PI;

  document.querySelector("#PTR").textContent = `${+ptrr.toFixed(2)} + j${+(ptir.toFixed(2))}`;
  document.querySelector("#RTP").textContent = `${+rtpn.toFixed(2)} + ∠${+(rtpa.toFixed(2))}°`;
}

function poladd() {
  var npr = +(document.getElementById(`NumPar`).value);
  if (npr<2) npr = 2;
  var num = 0; var ang = 0;
  var nums, angs, real, imag;
  var reals = 0, imags = 0;
  for(var i = 0; i < npr; i++){
      nums = +(getSavedValue(`pnum${i}`));
      angs = +(getSavedValue(`pang${i}`));
      real = nums*Math.cos(angs*Math.PI/180);
      imag = nums*Math.sin(angs*Math.PI/180);
      reals = reals+real;
      imags = imags+imag;
  }
  num = Math.sqrt(reals*reals+imags*imags);
  ang = 180*Math.atan(imags/reals)/Math.PI;
  if (reals<0) ang = 180+180*Math.atan(imags/reals)/Math.PI;
  if (reals<0 && imags<0) ang = -180+180*Math.atan(imags/reals)/Math.PI;
  document.querySelector("#PSUM").textContent = `${+num.toFixed(2)} + ∠${+(ang.toFixed(2))}°`;
}

function loadcalc() {
  var ilv = +(getSavedValue("ILV"));
  var l1l = +(getSavedValue("L1L"));
  var l2l = +(getSavedValue("L2L"));
  var l3l = +(getSavedValue("L3L"));
  var l12l = +(getSavedValue("L12L"));
  var l13l = +(getSavedValue("L13L"));
  var l23l = +(getSavedValue("L23L"));

  var l1t = l1l+((l12l+l13l)/2)*Math.sqrt(3);
  var l2t = l2l+((l12l+l23l)/2)*Math.sqrt(3);
  var l3t = l3l+((l23l+l13l)/2)*Math.sqrt(3);
  var nl = Math.sqrt(l1l*l1l+l2l*l2l+l3l*l3l-l1l*l2l-l2l*l3l-l1l*l3l);
  var tpow = (l1t+l2t+l3t)*ilv/Math.sqrt(3);

  document.querySelector("#L1T").textContent = `${+l1t.toFixed(2)} A`;
  document.querySelector("#L2T").textContent = `${+l2t.toFixed(2)} A`;
  document.querySelector("#L3T").textContent = `${+l3t.toFixed(2)} A`;
  document.querySelector("#NL").textContent = `${+nl.toFixed(2)} A`;

  if (tpow > 1000000) document.querySelector("#TPOW").textContent = `${+(tpow/1000000).toFixed(2)} MVA`;
  else if (tpow > 1000) document.querySelector("#TPOW").textContent = `${+(tpow/1000).toFixed(2)} kVA`;
  else document.querySelector("#TPOW").textContent = `${+tpow.toFixed(2)} VA`;
}

function consum() {
  var conl = +(getSavedValue("CONL"));
  var conr = +(getSavedValue("CONR"));
  var conh = +(getSavedValue("CONH"));

  var cond = Math.floor(conh/24);
  var conm = conh%24;
  var conk = conl*conh/1000;
  var conc = conk*conr;

  document.querySelector("#COND").textContent = `${+cond.toFixed(0)} d, ${+conm.toFixed(0)} h`;
  document.querySelector("#CONK").textContent = `${+conk.toFixed(2)} kWh`;
  document.querySelector("#CONC").textContent = `${+conc.toFixed(2)} £`;

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