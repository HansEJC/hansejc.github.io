function quantities() {
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) == "true");
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = (getSavedValue(box.id) == "true");
  });
  const myNode = document.getElementById("Substation");
  myNode.innerHTML = '';
  const myNode2 = document.getElementById("Location");
  myNode2.innerHTML = '';
  const myNode3 = document.getElementById("Tracks");
  myNode3.innerHTML = '';

  let NumLocs = +(getSavedValue("NumLocs"));     // set the value to this input
  NumLocs = NumLocs < 2 ? 2 : NumLocs;
  var cb = []; var cb2 = []; var cb3 = [];
  if (NumLocs < 20){
    for(let i = 0; i < NumLocs; i++){
      cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('input');
      cb[i].type = 'text'; cb2[i].type = 'number'; cb3[i].type = 'number';
      cb[i].onkeyup = function(){saveValue(this);}; cb2[i].onkeyup = function(){saveValue(this);}; cb3[i].onkeyup = function(){saveValue(this);};
      myNode.appendChild(cb[i]); myNode2.appendChild(cb2[i]); if (i < NumLocs-1) myNode3.appendChild(cb3[i]);
      cb[i].id = i+200; cb2[i].id = i+100; cb3[i].id = i+300;
      cb2[i].classList.add("loc"); cb3[i].classList.add("trac");
    }
  }
  else{
    cb[0] = document.createElement('input'); cb2[0] = document.createElement('input');
    cb[0].type = 'text'; cb2[0].type = 'text';
    cb[0].value = 'bad human!'; cb2[0].value = 'bad human!';
    myNode.appendChild(cb[0]); myNode2.appendChild(cb2[0]);
  }
}

const lcd = (a,b) => smoothdec(a*Math.round(b/a),10) || 0; //lowest commom multiplier

function oleFun(stuff){
  let {ole,lcc,lc,trnu} = stuff;
  return 1/(1/(ole*lcc)+1/((ole*lc)/trnu + ole*(lc-lcc)));
}

const parall = (array) => {
  let par = 0;
  array.forEach(num => par += 1/num);
  return 1/par;
}

function negTrack(subarray) { //this is for locations that don't parallel
  const tracks = document.querySelectorAll(".trac");
  let extra = 0, index, textlc, insert;
  let dist = 0, totlc = 0;
  tracks.forEach((trac,ind) => {
    let posID = trac.id;
    let locs = document.getElementById(posID-199);
    while (locs.value < 0) { //find the last positive direction location
      posID--;
      locs = document.getElementById(posID-199);
    }
    locs.classList.toggle(`loc`,!(trac.value < 0));
    let sub = getSavedValue(posID-99);
    totlc += +locs.value;
    if (trac.value < 0) {
      let lblStuff = {totlc,subarray,sub};
      subLabels(lblStuff);
      insert = totlc;
      extra = +locs.value;
      index = ind+1;
    };
  });
  return {extra,index,insert};
}