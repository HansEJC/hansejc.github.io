function inits() {
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) === "true");
  });
  const doublrr = document.querySelector("#DRR").checked;
  if (!doublrr) document.querySelector("#SRR").checked = true;
  return doublrr;
}

function calculations(){
  const doublrr = inits();
  const fc = Number(getSavedValue("LoadC"))/1000 || 6;
  const ci = Number(getSavedValue("CI"))|| 0.43;
  const cw = Number(getSavedValue("CW")) || 0.15;
  const ri = Number(getSavedValue("RI")) || 0.2;
  const aew = Number(getSavedValue("AEW")) || Number.MAX_SAFE_INTEGER;
  const rsc = Number(getSavedValue("RSC")) || Number.MAX_SAFE_INTEGER;
  let crbd = Number(getSavedValue("CRBD"));
  const erimp = Number(getSavedValue("ERIMP")) || 0.18;
  const mimp = (Number(getSavedValue("MIMP")) || 20)+erimp;
  const masd = Number(getSavedValue("MASD"))/1000 || 40/1000;
  crbd = crbd === 0 ? Number.MAX_SAFE_INTEGER : Math.max(Number(crbd)/1000,0.1); //convert to km and set to minimum of 100m
  const railR = doublrr ? 2 : 1;
  let earray = [] , subarray = [];
  const vol = 25; //25kV
  const imp = vol/fc; //fault limit impedance
  const ole = 1/(1/ci+1/cw);
  let faultimp = ole/2+1/(2/ri+1/aew+1/rsc); //in ohm/km
  let oleimp = 0, returnimp = 0, returnimp2 = 0;
  let totlc = 0, previmp = 0, prevole = 0, previmpneg = 0, prevoleneg = 0, totmimp = Number.MAX_SAFE_INTEGER; //total length, previous impedance, prev OLE
  const res = 1000; //resolution
  let once = true;

  const {extra,index,insert} = negTrack(subarray);
  document.querySelectorAll(".loc").forEach((loc,ind) => {
    let trnu = Number(getSavedValue(Number(loc.id)+199)) || 2;
    trnu = trnu === 1 ? 1/Number.MAX_SAFE_INTEGER : trnu-1;
    const dist = getSavedValue(loc.id);
    loc.value = dist;
    let lc = ind === index ? Number(dist) + extra : dist; //add extra for non parallel subs
    lc = lc === "" ? 5 : Math.abs(lc); //set to 5km if it's empty to avoid lag

    for (let i=1;i<=res;i++){
      i = ind === 0 ? res : i; //shift the first sub to its km point
      const lcc = smoothdec(lc*i/res,6); //current location
      const lch = dist < 0 ? totlc-lcc : totlc+lcc; //current total location
      let nxbnd = lcd(lc/res,crbd); //next bond location
      nxbnd = nxbnd > lc ? lc : nxbnd; //if cross bonding is greater than sub distance, set to sub distance
      const lxb = smoothdec(lcc % nxbnd,6) === 0 ? nxbnd : smoothdec(lcc % nxbnd,6) || 0;//location after last xbond 
      
      const masdcom = lcd(lc/res,masd); //make the mast distance have a common multiple with the res
      const masts = smoothdec(lcc % masdcom,6) === 0;
      totmimp = masts 
      ? parall([totmimp,mimp/Math.floor(lch/masdcom)])
      : totmimp;

      let stuff = {ole,lcc,lc,trnu,lch,lxb,aew,ri,railR,nxbnd,rsc,totmimp};
      oleimp = oleFun(stuff);
      ({returnimp, returnimp2} = normalCalc(stuff,true));
      oleimp = ind === 0 ? 0 : oleimp; //set FS impedance to 0
      returnimp = ind === 0 ? 0 : returnimp; //set FS impedance to 0
      faultimp = oleimp+returnimp;

      const current = 1000*vol/(faultimp+imp+previmp+prevole);
      const current2 = 1000*vol/(oleimp+returnimp2+imp+previmp+prevole);
      const voltage = current*(parall([returnimp+previmp,erimp]));
      const voltage2 = current*(parall([returnimp+previmp,erimp+totmimp]));
      const voltage3 = current2*(parall([returnimp2+previmp,erimp]));

      earray.push([lch, voltage,voltage2,voltage3,null,null]);
      if ((lxb >= nxbnd || lcc >= lc) && nxbnd > 0) previmp += returnimp; //previous impedance
      if (lcc >= lc) prevole += oleimp; //previous impedance
      prevoleneg = previmpneg = 0;
        
      if (once && lch >= insert) {
        once = false;
        subarray.sort((a,b) => a.x - b.x); //makes it easier to find the non parallel location in the index
        subarray[ind].x = lch;
      }
    }
    totlc += Number(dist) < 0 ? 0 : lc; //total length
    const sub = getSavedValue(100+(Number(loc.id)));
    const lblStuff = {dist,totlc,subarray,sub};
    subLabels(lblStuff);
  });
  const limit = fc > 0.999 ? 645 : 60;
  const limit2 = fc > 0.999 ? 650 : 25;
  earray.push([0-totlc*0.1, null, null, null, limit, limit2]);
  earray.push([totlc*1.1, null, null, null, limit, limit2]);
  dygPlot(earray,subarray);
  return earray;
}

function subLabels(stuff) {
  const {totlc,subarray,sub} = stuff;
  subarray.push({
    series: "Rail Voltage (V)",
    x: totlc,
    width: sub.length*9,
    height: 24,
    tickColor: "white",
    shortText: sub
  });
}

function dygPlot(earray,subarray){
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  }catch(e){logError(e);}
  if (earray.length === 0) return;
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    earray.join("\r\n"),
    {
      xlabel: "Location (km)",
      ylabel: "Railway Voltages (V)",
      //labels:  ["Distance (km)", "Rail Voltage (V)", "Rail Voltage (V)."],
      labels:  ["Distance (km)", "Rail Voltage (V)","Masts in series",  "Masts in parallel", "BS EN 50122-1 Limit", "G12/4 Limit"],
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
    colors.pop(), colors.pop();
    colors.push(`orange`,`red`);
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
  const file = g3.rolledSeries_;
  const labls = g3.getLabels();

  for (let i=1; i<file.length-2; i++) {
    let max = 0, av = 0;
    for (let j=0; j<file[1].length; j++) {
      max = Math.max(max,file[i][j][1]);
      av += Number(file[i][j][1]);
    }
    av = av/file[1].length;
    extremeArr.push([labls[i],smoothdec(av),smoothdec(max)])
  }
  table(extremeArr);
}

function table(rows){
  const tabdiv = document.querySelector(`#FaultTable`);
  const myTable = document.createElement(`table`);
  myTable.classList.add(`scores`);
  const row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = `<th>Series</th>`;
  row.insertCell(1).outerHTML = `<th>Average</th>`;
  row.insertCell(2).outerHTML = `<th>Max</th>`;

  try{
    rows.forEach(arr => {
      const row = myTable.insertRow(-1);
      [row.insertCell(0).innerHTML, row.insertCell(1).innerHTML, row.insertCell(2).innerHTML] = arr;
    });
  }catch(err){ logError(err); }

  tabdiv.innerHTML = ``;
  tabdiv.appendChild(myTable);
}

//startup
quantities();
calculations();
document.onkeyup = () => calculations();