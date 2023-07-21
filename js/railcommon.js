function quantities() {
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) === "true");
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = (getSavedValue(box.id) === "true");
  });
  const myNode = document.getElementById("Substation");
  myNode.innerHTML = '';
  const myNode2 = document.getElementById("Location");
  myNode2.innerHTML = '';
  const myNode3 = document.getElementById("Tracks");
  myNode3.innerHTML = '';

  let NumLocs = Number(getSavedValue("NumLocs"));     // set the value to this input
  NumLocs = NumLocs < 2 ? 2 : NumLocs;
  const cb = [], cb2 = [], cb3 = [];
  if (NumLocs < 20) {
    for (let i = 0; i < NumLocs; i++) {
      cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('input');
      cb[i].type = 'text'; cb2[i].type = 'number'; cb3[i].type = 'number';
      cb[i].onkeyup = function () { saveValue(this); }; cb2[i].onkeyup = function () { saveValue(this); }; cb3[i].onkeyup = function () { saveValue(this); };
      myNode.appendChild(cb[i]); myNode2.appendChild(cb2[i]); if (i < NumLocs - 1) myNode3.appendChild(cb3[i]);
      cb[i].id = i + 200; cb2[i].id = i + 100; cb3[i].id = i + 300;
      cb2[i].classList.add("loc"); cb3[i].classList.add("trac");
    }
  }
  else {
    cb[0] = document.createElement('input'); cb2[0] = document.createElement('input');
    cb[0].type = 'text'; cb2[0].type = 'text';
    cb[0].value = 'bad human!'; cb2[0].value = 'bad human!';
    myNode.appendChild(cb[0]); myNode2.appendChild(cb2[0]);
  }
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) === "true");
  });
}

const lcd = (a, b) => smoothdec(a * Math.round(b / a), 10) || 0; //lowest commom multiplier

function oleFun(stuff) {
  const { ole, lcc, lc, trnu } = stuff;
  return 1 / (1 / (ole * lcc) + 1 / ((ole * lc) / trnu + ole * (lc - lcc)));
}

function normalCalc(stuff, volt) {
  const { trnu, lxb, aew, ri, railR, nxbnd, rsc, totmimp } = stuff;
  const returnimp = 1 / (1 / (ri * lxb) + 1 / (1 / (railR * trnu / (ri * nxbnd) + 1 / (aew * nxbnd) + 1 / (rsc * nxbnd)) + ri * (nxbnd - lxb))); //bonds at cross bond location
  const returnimp2 = 1 / (1 / (ri * lxb) + 1 / (1 / (railR * trnu / (ri * nxbnd) + 1 / parall([aew * nxbnd, totmimp]) + 1 / (rsc * nxbnd)) + ri * (nxbnd - lxb))); //bonds at cross bond location
  const returnaew = returnimp2 + aew * lxb;
  if (volt) return { returnimp, returnimp2, returnaew };
  return returnimp;
}

const parall = (array) => {
  let par = 0;
  array.forEach(num => par += 1 / num);
  return 1 / par;
}

function negTrack(subarray) { //this is for locations that don't parallel
  const tracks = document.querySelectorAll(".trac");
  let extra = 0, index, insert;
  let totlc = 0;
  tracks.forEach((trac, ind) => {
    let posID = trac.id;
    let locs = document.getElementById(posID - 199);
    while (locs.value < 0) { //find the last positive direction location
      posID--;
      locs = document.getElementById(posID - 199);
    }
    locs.classList.toggle(`loc`, !(trac.value < 0));
    const sub = getSavedValue(posID - 99);
    totlc += Number(locs.value);
    if (trac.value < 0) {
      const lblStuff = { totlc, subarray, sub };
      subLabels(lblStuff);
      insert = totlc;
      extra = Number(locs.value);
      index = ind + 1;
    };
  });
  return { extra, index, insert };
}

function insertRow(rows, myTable) {
  try {
    rows.forEach(arr => {
      const row = myTable.insertRow(-1);
      [row.insertCell(0).innerHTML, row.insertCell(1).innerHTML] = arr;
    });
  } catch (err) { logError(err); }
}