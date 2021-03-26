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

const smoothdec = (a) => +(parseFloat(a).toFixed(6)); //fix broken decimals
const lcd = (a,b) => smoothdec(a*Math.round(b/a)) || 0; //lowest commom multiplier

function oleFun(stuff){
  let {ole,lcc,lc,trnu} = stuff;
  return 1/(1/(ole*lcc)+1/((ole*lc)/trnu + ole*(lc-lcc)));
}

function inits() {
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) == "true");
  });
  let boost = document.querySelector("#BOOST").checked;
  let atfeed = document.querySelector("#ATFEED").checked;
  let doublrr = document.querySelector("#DRR").checked;
  if (!doublrr) document.querySelector("#SRR").checked = true;
  document.querySelector("#Bstuff").style.display = boost ? "block" : "none";
  document.querySelector("#ATFstuff").style.display = atfeed ? "block" : "none";
  return {boost,atfeed,doublrr};
}

function calculations(){
  const {boost,atfeed,doublrr} = inits();
  let fc = +(getSavedValue("FC")) || 6;
  let ci = +(getSavedValue("CI"))|| 0.43;
  let cw = +(getSavedValue("CW")) || 0.15;
  let ri = +(getSavedValue("RI")) || 0.2;
  let bimp = +(getSavedValue("BIMP"))/2 || 0.21/2; //booster impedance diveded by two for OLE and RSC
  let atf = +(getSavedValue("ATF")) || 0.07;
  let aew = +(getSavedValue("AEW")) || Number.MAX_SAFE_INTEGER;
  let rsc = +(getSavedValue("RSC")) || Number.MAX_SAFE_INTEGER; 
  rsc = boost && rsc>1 ? 0.11 : rsc; //if booster, RSC is required
  let crbd = +(getSavedValue("CRBD")); 
  crbd = crbd == 0 ? Number.MAX_SAFE_INTEGER : Math.max(+(crbd)/1000,0.1); //convert to km and set to minimum of 100m
  let railR = doublrr ? 2 : 1;
  let earray = [] , subarray = [], faultarray = [], subfault;
  let vol = 25; //25kV
  let imp = vol/fc; //fault limit impedance
  let ole = 1/(1/ci+1/cw);
  let faultimp = ole/2+1/(2/ri+1/aew+1/rsc); //in ohm/km
  let oleimp = 0, returnimp = 0;
  let totlc = 0, previmp = 0, prevole = 0, previmpneg = 0, prevoleneg = 0, textlc = 0; //total length, previous impedance, prev OLE
  let res = 1000; //resolution
  let bdist = 3; //booster distance of 3km
  let once = true; 

  let {extra,index,insert} = negTrack(subarray);
  document.querySelectorAll(".loc").forEach((loc,ind) => {
    let trnu = +(getSavedValue(+loc.id+199)) || 2; 
    trnu = trnu == 1 ? 1/Number.MAX_SAFE_INTEGER : trnu-1;
    let dist = getSavedValue(loc.id);
    loc.value = dist;
    let lc = ind === index ? +dist + extra : dist; //add extra for non parallel subs
    lc = lc == "" ? 5 : Math.abs(lc); //set to 5km if it's empty to avoid lag
    
    for (let i=1;i<=res;i++){
      i = ind == 0 ? res : i; //shift the first sub to its km point
      let lcc = smoothdec(lc*i/res); //current location
      let lch = dist < 0 ? totlc-lcc : totlc+lcc; //current total location
      let nxbnd = lcd(lc/res,crbd); //next bond location
      nxbnd = nxbnd > lc ? lc : nxbnd; //if cross bonding is greater than sub distance, set to sub distance
      let lxb = smoothdec(lcc % nxbnd) == 0 ? nxbnd : smoothdec(lcc % nxbnd) || 0;//location after last xbond
      let stuff = {ole,lcc,lc,trnu,bimp,lch,bdist,lxb,aew,ri,railR,nxbnd,rsc,atf};
      oleimp = oleFun(stuff);
      if (boost) ({oleimp,returnimp} = boosterCalc({oleimp,...stuff}));
      else returnimp = (atfeed) ? atCalc(stuff): normalCalc(stuff);
      oleimp = ind == 0 ? 0 : oleimp; //set FS impedance to 0
      returnimp = ind == 0 ? 0 : returnimp; //set FS impedance to 0
      faultimp = oleimp+returnimp;
      subfault = vol/(faultimp+imp+previmp+prevole);

      if (dist < 0) { //negative sub locs
        subfault = vol/(faultimp+imp+previmp+prevole+previmpneg+prevoleneg);
        earray.push([textlc-lcc,null, subfault]);
        if ((lxb >= nxbnd || lcc >= lc) && nxbnd > 0) previmpneg += returnimp; //previous impedance
        if (lcc >= lc) prevoleneg += oleimp; //previous impedance
      }
      else { //positive sub locs
        earray.push([lch, subfault,null]);
        if ((lxb >= nxbnd || lcc >= lc) && nxbnd > 0) previmp += returnimp; //previous impedance
        if (lcc >= lc) prevole += oleimp; //previous impedance
        textlc = totlc;
        prevoleneg = previmpneg = 0;
      }
      if (once && lch >= insert) {
        faultarray.push([getSavedValue(99+(+loc.id)),smoothdec(subfault.toFixed(2))]); //insert non parallel sub
        once = false;
        subarray.sort((a,b) => a.x - b.x); //makes it easier to find the non parallel location in the index
        subarray[ind].x = lch;
      }
    }
    totlc += +dist < 0 ? 0 : lc; //total length
    textlc += +dist; //total length
    let sub = getSavedValue(100+(+loc.id));
    let lblStuff = {dist,textlc,totlc,subarray,sub};
    subLabels(lblStuff);
    faultarray.push([sub,smoothdec(subfault.toFixed(2))]);
  });
  table(faultarray);
  dygPlot(earray,subarray);
  return earray;
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
      let lblStuff = {dist,textlc,totlc,subarray,sub};
      subLabels(lblStuff);
      insert = totlc;
      extra = +locs.value;
      index = ind+1;
    };    
  });
  return {extra,index,insert};
}

function subLabels(stuff) {
  let {dist,textlc,totlc,subarray,sub} = stuff;
  subarray.push({
    series: dist < 0 ? "Fault Current (kA)." : "Fault Current (kA)",
    x: dist < 0 ? textlc : totlc,
    width: sub.length*8,
    height: 24,
    tickColor: "white",
    shortText: sub
  });
}

function normalCalc(stuff){
  document.querySelector("#CLASS").checked = true;;
  let {trnu,lxb,aew,ri,railR,nxbnd,rsc} = stuff;
  return 1/(1/(ri*lxb)+1/(1/(railR*trnu/(ri*nxbnd)+1/(aew*nxbnd)+1/(rsc*nxbnd))+ri*(nxbnd-lxb))); //bonds at cross bond location
}

function atCalc(stuff){
  let {lxb,ri,nxbnd,atf} = stuff;
  return 1/(1/(ri*lxb)+1/((atf*nxbnd)+ri*(nxbnd-lxb))); //bonds at cross bond location
}

function boosterCalc(stuff){
//nxbnd = nxbnd > bdist ? bdist : nxbnd; //if booster is greater than sub distance, set to sub distance
//lxb = smoothdec(lcc % nxbnd) == 0 ? nxbnd : smoothdec(lcc % nxbnd) || 0;//location after last xbond
  let {oleimp,ole,lcc,trnu,bimp,lch,bdist,lxb,aew} = stuff;
  oleimp += 2*bimp*Math.floor(Math.abs(lch)/bdist);
  if (trnu<1) oleimp = ole*lcc;
  //returnimp = 1/(1/(ri*lxb)+1/(1/(railR*trnu/(ri*nxbnd)+1/(aew*nxbnd))+ri*(nxbnd-lxb))); //bonds at cross bond location
  let returnimp = aew*lxb; //bonds at cross bond location
  //prevole += oleimp;// -oleFun(stuff);
  //previmp += returnimp;// -1/(1/(ri*lxb)+1/(1/(railR*trnu/(ri*nxbnd)+1/(aew*nxbnd)+1/(rsc*nxbnd))+ri*(nxbnd-lxb)));;
  return {oleimp,returnimp}
}

function dygPlot(earray,subarray){
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  }catch(e){console.log(e);}
  if (earray.length == 0) return;
  g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    earray.join("\r\n"),
    {
      xlabel: "Location (km)",
      ylabel: "Fault Current (kA)",
      labels:  ["Distance (km)", "Fault Current (kA)", "Fault Current (kA)."],
      colors: ["red"],
      pointSize: 0.1,
      axes: {
        x: {
          axisLabelFormatter: function(y) {
            return  y + ' km';
          },
        },
        y: {
          axisLabelFormatter: function(y) {
            return  smoothdec(y) + ' kA';
          },
        },
      }
    }          // options
  );

  g3.ready(function() {

    setTimeout(function(){
      window.dispatchEvent(new Event('resize'));
    }, 500);
    g3.setAnnotations(subarray);
    let min = g3.xAxisExtremes()[0];
    let max = g3.xAxisExtremes()[1];
    let adj = Math.abs(max-min)*0.1;
    g3.updateOptions({
      dateWindow: [min-adj,max+adj]
    });
  });
}

function table(rows){
  const tabdiv = document.querySelector(`#FaultTable`);
  const myTable = document.createElement(`table`);
  myTable.classList.add(`scores`);
  let row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = `<th>Location Name</th>`;
  row.insertCell(1).outerHTML = `<th>Fault Current (kA)</th>`;

  try{
    rows.forEach(arr => {
      let row = myTable.insertRow(-1);
      row.insertCell(0).innerHTML = arr[0];
      row.insertCell(1).innerHTML = arr[1];
    });
  }catch(err){console.log(err)}
  
  tabdiv.innerHTML = ``;
  tabdiv.appendChild(myTable);
}

//startup
quantities();
calculations();
document.onkeyup = () => calculations();