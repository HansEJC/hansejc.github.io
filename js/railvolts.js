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

const smoothdec = (a,b=6) => +(parseFloat(a).toFixed(b)); //fix broken decimals
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
  let doublrr = document.querySelector("#DRR").checked;
  if (!doublrr) document.querySelector("#SRR").checked = true;
  return doublrr;
}

function calculations(){
  const doublrr = inits();
  let fc = +(getSavedValue("LoadC"))/1000 || 6;
  let ci = +(getSavedValue("CI"))|| 0.43;
  let cw = +(getSavedValue("CW")) || 0.15;
  let ri = +(getSavedValue("RI")) || 0.2;
  let aew = +(getSavedValue("AEW")) || Number.MAX_SAFE_INTEGER;
  let rsc = +(getSavedValue("RSC")) || Number.MAX_SAFE_INTEGER;
  let crbd = +(getSavedValue("CRBD"));
  let erimp = +(getSavedValue("ERIMP")) || 0.18;
  let mimp = (+(getSavedValue("MIMP")) || 20)+erimp;
  let masd = +(getSavedValue("MASD"))/1000 || 40/1000;
  crbd = crbd == 0 ? Number.MAX_SAFE_INTEGER : Math.max(+(crbd)/1000,0.1); //convert to km and set to minimum of 100m
  let railR = doublrr ? 2 : 1;
  let earray = [] , subarray = [], voltage;
  let vol = 25; //25kV
  let imp = vol/fc; //fault limit impedance
  let ole = 1/(1/ci+1/cw);
  let faultimp = ole/2+1/(2/ri+1/aew+1/rsc); //in ohm/km
  let oleimp = 0, returnimp = 0;
  let totlc = 0, previmp = 0, prevole = 0, previmpneg = 0, prevoleneg = 0, textlc = 0, totmimp = Number.MAX_SAFE_INTEGER; //total length, previous impedance, prev OLE
  let res = 1000; //resolution
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
      let stuff = {ole,lcc,lc,trnu,lch,lxb,aew,ri,railR,nxbnd,rsc};
      oleimp = oleFun(stuff);
      returnimp = normalCalc(stuff);
      oleimp = ind == 0 ? 0 : oleimp; //set FS impedance to 0
      returnimp = ind == 0 ? 0 : returnimp; //set FS impedance to 0
      faultimp = oleimp+returnimp;
      let masdcom = lcd(lc/res,masd); //make the mast distance have a common multiple with the res
      let masts = smoothdec(lcc % masdcom) === 0;
      //totmimp = mimp/Math.floor(lch/masd);
      //totmimp = parall([totmimp,mimp/Math.floor(lch/masd)])
      /*
      
      The mast impedance is actually only connected to the AEW. This is then only connected to the rails 
      at each cross bond. This needs to somehow be taken into account.
      
      */
      totmimp = masts 
      ? parall([totmimp,mimp/Math.floor(lch/masdcom)])
      : totmimp;
      current = 1000*vol/(faultimp+imp+previmp+prevole);
      voltage = current*(parall([returnimp+previmp,erimp]));
      voltage2 = current*(parall([returnimp+previmp,erimp+totmimp]));
      voltage3 = current*(parall([returnimp+previmp,erimp,totmimp]));

      earray.push([lch, voltage,voltage2,voltage3,null]);
      if ((lxb >= nxbnd || lcc >= lc) && nxbnd > 0) previmp += returnimp; //previous impedance
      if (lcc >= lc) prevole += oleimp; //previous impedance
      textlc = totlc;
      prevoleneg = previmpneg = 0;
        
      if (once && lch >= insert) {
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
  });
  let limit = fc > 0.999 ? 645 : 60;
  earray.push([0-totlc*0.1, null, null, null, limit]);
  earray.push([totlc*1.1, null, null, null, limit]);
  dygPlot(earray,subarray);
  return earray;
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
  let {trnu,lxb,aew,ri,railR,nxbnd,rsc} = stuff;
  return 1/(1/(ri*lxb)+1/(1/(railR*trnu/(ri*nxbnd)+1/(aew*nxbnd)+1/(rsc*nxbnd))+ri*(nxbnd-lxb))); //bonds at cross bond location
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
      ylabel: "Railway Voltages (V)",
      //labels:  ["Distance (km)", "Rail Voltage (V)", "Rail Voltage (V)."],
      labels:  ["Distance (km)", "Rail Voltage (V)","Masts in series",  "Masts in parallel", "BS EN 50122 Limit"],
      //colors: ["blue"],
      connectSeparatedPoints: true,
      labelsSeparateLines: true,
      pointSize: 0.1,
      axes: {
        x: {
          axisLabelFormatter: function(y) {
            return  y + ' km';
          },
        },
        y: {
          axisLabelFormatter: function(y) {
            return  smoothdec(y) + ' V';
          },
        },
      }
    }          // options
  );
  g3.ready(function() {
    const colors = g3.getColors();
    colors.pop();
    colors.push(`red`);
    setTimeout(function(){
      window.dispatchEvent(new Event('resize'));
    }, 500);
    g3.setAnnotations(subarray);
    g3.updateOptions({
      colors: colors
    });
    findExtremes();
  });
}

function findExtremes(){
  let extremeArr = [];
  let file = g3.rolledSeries_;
  let labls = g3.getLabels();

  for (let i=1; i<file.length-1; i++) {
    let max = 0, av = 0;
    for (let j=0; j<file[1].length; j++) {
      max = Math.max(max,file[i][j][1]);
      av += +file[i][j][1];
    }
    av = av/file[1].length;
    extremeArr.push([labls[i],smoothdec(av,2),smoothdec(max,2)])
  }
  table(extremeArr);
}

function table(rows){
  const tabdiv = document.querySelector(`#FaultTable`);
  const myTable = document.createElement(`table`);
  myTable.classList.add(`scores`);
  let row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = `<th>Series</th>`;
  row.insertCell(1).outerHTML = `<th>Average</th>`;
  row.insertCell(2).outerHTML = `<th>Max</th>`;

  try{
    rows.forEach(arr => {
      let row = myTable.insertRow(-1);
      row.insertCell(0).innerHTML = arr[0];
      row.insertCell(1).innerHTML = arr[1];
      row.insertCell(2).innerHTML = arr[2];
    });
  }catch(err){console.log(err)}

  tabdiv.innerHTML = ``;
  tabdiv.appendChild(myTable);
}

//startup
quantities();
calculations();
document.onkeyup = () => calculations();