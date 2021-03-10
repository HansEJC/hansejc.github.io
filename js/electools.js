function calculations() {
  document.getElementById("NPR").value = getSavedValue("NPR");    // set the value to this input

  var npr = Number(getSavedValue("NPR"));    // set the value to this input
  if (npr<2) npr = 2;
  var cb = []; var cb2 = []; var cb3 = [];
  var cbh = document.getElementById('Parallel'); var cbh2 = document.getElementById('Nums'); var cbh3 = document.getElementById('Angs');
  if (npr < 100){
    for(var i = 0; i < npr; i++){
        cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('input');
        cb[i].type = 'number'; cb2[i].type = 'number'; cb3[i].type = 'number';
        cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]); cbh3.appendChild(cb3[i]);
        cb[i].id = i; cb2[i].id = i+npr; cb3[i].id = i+2*npr;
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
  document.getElementById("NPR").value = getSavedValue("NPR");    // set the value to this input
  var npr = Number(document.getElementById("NPR").value);    // set the value to this input
  if (npr<2) npr = 2;
  var pr = 0;
  var res;
  for(var i = 0; i < npr; i++){
      res = Number(document.getElementById(i).value);
      pr = pr+1/res;
  }
  pr = 1/pr;
  document.getElementById("PR").textContent = +pr.toFixed(2)+" Ω";
}

function polrec() {
  document.getElementById("PN").value = getSavedValue("PN");    // set the value to this input
  document.getElementById("PA").value = getSavedValue("PA");    // set the value to this input
  document.getElementById("RR").value = getSavedValue("RR");    // set the value to this input
  document.getElementById("IR").value = getSavedValue("IR");    // set the value to this input
  var pn = Number(getSavedValue("PN"));
  var pa = Number(getSavedValue("PA"));
  var rr = Number(getSavedValue("RR"));
  var ir = Number(getSavedValue("IR"));
  var ptrr = pn*Math.cos(pa*Math.PI/180);
  var ptir = pn*Math.sin(pa*Math.PI/180);
  var rtpn = Math.sqrt(rr*rr+ir*ir);
  var rtpa = 180*Math.atan(ir/rr)/Math.PI;
  if (rr<0) rtpa = 180+180*Math.atan(ir/rr)/Math.PI;
  if (rr<0 && ir<0) rtpa = -180+180*Math.atan(ir/rr)/Math.PI;

  document.getElementById("PTR").textContent = +ptrr.toFixed(2)+" + j"+Number(ptir.toFixed(2));
  document.getElementById("RTP").textContent = +rtpn.toFixed(2)+" + ∠"+Number(rtpa.toFixed(2))+"°";
}

function poladd() {
  var npr = Number(document.getElementById("NPR").value);
  if (npr<2) npr = 2;
  var num = 0; var ang = 0;
  var nums, angs, real, imag;
  var reals = 0; imags = 0;
  for(var i = 0; i < npr; i++){
      nums = Number(document.getElementById(i+npr).value);
      angs = Number(document.getElementById(i+npr*2).value);
      real = nums*Math.cos(angs*Math.PI/180);
      imag = nums*Math.sin(angs*Math.PI/180);
      reals = reals+real;
      imags = imags+imag;
  }
  num = Math.sqrt(reals*reals+imags*imags);
  ang = 180*Math.atan(imags/reals)/Math.PI;
  if (reals<0) ang = 180+180*Math.atan(imags/reals)/Math.PI;
  if (reals<0 && imags<0) ang = -180+180*Math.atan(imags/reals)/Math.PI;
  document.getElementById("PSUM").textContent = +num.toFixed(2)+" + ∠"+Number(ang.toFixed(2))+"°";
}

function loadcalc() {
  (new URL(document.location)).searchParams.forEach((x, y) => {
    localStorage.setItem(y,x);
  });
  document.getElementById("ILV").value = getSavedValue("ILV");    // set the value to this input
  document.getElementById("L1L").value = getSavedValue("L1L");
  document.getElementById("L1L").value = getSavedValue("L1L");    // set the value to this input
  document.getElementById("L1L").value = getSavedValue("L1L");
  document.getElementById("L12L").value = getSavedValue("L12L");
  document.getElementById("L13L").value = getSavedValue("L13L");
  document.getElementById("L23L").value = getSavedValue("L23L");
  var ilv = Number(getSavedValue("ILV"));
  var l1l = Number(getSavedValue("L1L"));
  var l2l = Number(getSavedValue("L2L"));
  var l3l = Number(getSavedValue("L3L"));
  var l12l = Number(getSavedValue("L12L"));
  var l13l = Number(getSavedValue("L13L"));
  var l23l = Number(getSavedValue("L23L"));

  var l1t = l1l+((l12l+l13l)/2)*Math.sqrt(3);
  var l2t = l2l+((l12l+l23l)/2)*Math.sqrt(3);
  var l3t = l3l+((l23l+l13l)/2)*Math.sqrt(3);
  var nl = Math.sqrt(l1l*l1l+l2l*l2l+l3l*l3l-l1l*l2l-l2l*l3l-l1l*l3l);
  var tpow = (l1t+l2t+l3t)*ilv/Math.sqrt(3);

  document.getElementById("L1T").textContent = +l1t.toFixed(2)+" A";
  document.getElementById("L2T").textContent = +l2t.toFixed(2)+" A";
  document.getElementById("L3T").textContent = +l3t.toFixed(2)+" A";
  document.getElementById("NL").textContent = +nl.toFixed(2)+" A";

  if (tpow > 1000000) document.getElementById("TPOW").textContent = +(tpow/1000000).toFixed(2)+" MVA";
  else if (tpow > 1000) document.getElementById("TPOW").textContent = +(tpow/1000).toFixed(2)+" kVA";
  else document.getElementById("TPOW").textContent = +tpow.toFixed(2)+" VA";
}

function consum() {
  document.getElementById("CONL").value = getSavedValue("CONL");    // set the value to this input
  document.getElementById("CONR").value = getSavedValue("CONR");
  document.getElementById("CONH").value = getSavedValue("CONH");
  var conl = Number(getSavedValue("CONL"));
  var conr = Number(getSavedValue("CONR"));
  var conh = Number(getSavedValue("CONH"));

  var cond = Math.floor(conh/24);
  var conm = conh%24;
  var conk = conl*conh/1000;
  var conc = conk*conr;

  document.getElementById("COND").textContent = +cond.toFixed(0)+" days "+conm.toFixed(0)+" hours";
  document.getElementById("CONK").textContent = +conk.toFixed(2)+" kWh";
  document.getElementById("CONC").textContent = +conc.toFixed(2)+" £";

}

function remParallel() {
  const myNode = document.getElementById("Parallel");
  myNode.innerHTML = '';
  const myNode2 = document.getElementById("Nums");
  myNode2.innerHTML = '';
  const myNode3 = document.getElementById("Angs");
  myNode3.innerHTML = '';
}

//startup
calculations();
polrec();
poladd();
loadcalc();
consum();
document.onkeyup = function() {
  parallel();
  poladd();
  consum();
};