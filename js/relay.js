function hider() {
  var x = document.getElementById("hide");
  if (x.style.display === "none")
    x.style.display = "block";
   else
    x.style.display = "none";
}

function checkit() {
  var x = document.getElementById("advanced");
  x.checked = true;
  var y = document.getElementById("hide");
    y.style.display = "block";
}

var idbSupported = false;
var db;
 if("indexedDB" in window) {
  idbSupported = true;
}


function save(data) {
    var transaction = db.transaction(["plots"], "readwrite");
    var objectStore = transaction.objectStore("plots");
    var request = objectStore.put({id:1,'data':data});
      request.onsuccess = function(event) {
        //console.log(event.target)
      };
}

function read() {
  var transaction = db.transaction(["plots"], "readonly");
  var objectStore = transaction.objectStore("plots");
  objectStore.openCursor(null, "prev").onsuccess = async function(event) {
    var cursor = event.target.result;
    try{
      plotProtection(Papa.parse(cursor.value.data).data);
    }catch(err){
      let DRcsv = await fetch('uploads/fault.csv').then(result => result.text());
      // code below here will only execute when await fetch() finished loading
      DR = Papa.parse(DRcsv).data;
      plotProtection(DR);
    }
  }
  //plotexp(objectStore.get('data'));
}

function javaread(){
  document.forms['myForm'].elements["rel_upload"].onchange = function(evt) {
    if(!window.FileReader) return; // Browser is not compatible
    var reader = new FileReader();
    reader.onload = function(evt) {
      if(evt.target.readyState != 2) return;
      if(evt.target.error) {
        console.log('Error while reading file');
        return;
      }
      var filecontent = evt.target.result;
      plotProtection(Papa.parse(filecontent).data);
      save(filecontent);
    };
    reader.readAsText(evt.target.files[0]);
  };
  if(idbSupported) {
    var openRequest = indexedDB.open("graph",1);

    openRequest.onupgradeneeded = function(e) {
      console.log("Upgrading...");
      db = e.target.result;

      if(!db.objectStoreNames.contains("plots")) {
        db.createObjectStore("plots", { keyPath: "id",autoIncrement:true});
      }
    }
    openRequest.onsuccess = function(e) {
      db = e.target.result;
      var transaction = db.transaction(["plots"]);
      var objectStore = transaction.objectStore("plots");
      var request = objectStore.get("2");
      request.onerror = function(event) {
      };
      request.onsuccess = function(event) {
        read();
      };
    }
    openRequest.onerror = function(e) {
      console.log("Error");
      console.dir(e);
    }
  }
}

async function startup() {
  javaread();
  // await code here
  var DR = [];
  plotProtection(DR);
  document.onkeyup = function() {
    read();
  };
  document.getElementById("Prim").onchange = function(){read();};
  document.getElementById("Sec").onchange = function(){checkit();read();};
  document.getElementById("PrimDR").onchange = function(){read();};
  document.getElementById("SecDR").onchange = function(){read();};
}

function change(el) {
  g3.setVisibility(el.id, el.checked);
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function Zone1(tr){
  //%Zone 1 setting
  var Z1 = +(document.getElementById("Zone1").value);
  var Z1A = (+(document.getElementById("Zone1A").value)* Math.PI / 180);
  var Z1t = (-3* Math.PI / 180);
  var R1R = +(document.getElementById("Zone1RH").value);
  var R1L = +(document.getElementById("Zone1LH").value);
  var Z1s = (87* Math.PI / 180);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z1=Z1/tr;R1R=R1R/tr;R1L=R1L/tr;
  }
  //%Zone 1 plot
  const xmul1 = Math.sin(Z1A);
  const xmul2 = Math.sin((180* Math.PI / 180)-Z1A+Z1t);
  const pmul1 = R1R*xmul1/Math.sin((90* Math.PI / 180)+Z1s-Z1A);
  const pmul2 = (-90* Math.PI / 180)+Z1s;
  var x1 = xmul1*R1L/xmul2;
  var xx1 = xmul1*R1R/xmul2;
  var pkx1 = -x1*Math.sin(Z1t)+Z1*xmul1;
  if (-R1L*Math.sin(pmul2) > pkx1){
    var pgx1 = pkx1;}
  else{
    pgx1 = -R1L*Math.sin(pmul2);
  }
  var pcx1 = xx1*Math.sin(Z1t)+Z1*xmul1;
  var prx1 = pmul1*Math.sin(pmul2);
  var pgr1 = -pgx1*Math.sin(Z1s)/Math.sin((90* Math.PI / 180)-Z1s);
  if (pgx1 == pkx1) {
    var pkr1 = pgr1;}
  else{
    pkr1 = -x1*Math.cos(Z1t)+Z1*Math.cos(Z1A);
  }
  var pcr1 = xx1*Math.cos(Z1t)+Z1*Math.cos(Z1A);
  var prr1 = pmul1*Math.cos(pmul2);
  let Z1pol = [[pgr1,pgx1],[pkr1,pkx1],[pcr1,pcx1],[prr1,prx1],[pgr1,pgx1]]; //Z1 polygon
  let Z1el = [[pgr1,,pgx1],[pkr1,,pkx1],[pcr1,,pcx1],[prr1,,prx1],[pgr1,,pgx1]];
  return [Z1pol,Z1el];
}

function Zone2(tr){
  //%Zone 2 setting
  var Z2 = +(document.getElementById("Zone2").value);
  var Z2A = (+(document.getElementById("Zone2A").value)* Math.PI / 180);
  var Z2t = (-3* Math.PI / 180);
  var R2R = +(document.getElementById("Zone2RH").value);
  var R2L = +(document.getElementById("Zone2LH").value);
  var Z2s = (87* Math.PI / 180);
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z2=Z2/tr;R2R=R2R/tr;R2L=R2L/tr;
  }
  const xmul1 = Math.sin(Z2A);
  const xmul2 = (180* Math.PI / 180)-Z2A+Z2t;
  const pr21 = R2R*xmul1/Math.sin((90* Math.PI / 180)+Z2s-Z2A);
  const pr22 = (-90* Math.PI / 180)+Z2s;
  //%Zone 2 plot
  var x2 = xmul1*R2L/Math.sin(xmul2);
  var xx2 = xmul1*R2R/Math.sin(xmul2);
  var pkx2 = -x2*Math.sin(Z2t)+Z2*xmul1;
  if (-R2L*Math.sin(pr22) > pkx2){
    var pgx2 = pkx2;}
  else{
    pgx2 = -R2L*Math.sin(pr22);
  }

  var pcx2 = xx2*Math.sin(Z2t)+Z2*xmul1;
  var prx2 = pr21*Math.sin(pr22);
  var pgr2 = -pgx2*Math.sin(Z2s)/Math.sin((90* Math.PI / 180)-Z2s);
  if (pgx2 == pkx2) {
    var pkr2 = pgr2;}
  else{
    pkr2 = -x2*Math.cos(Z2t)+Z2*Math.cos(Z2A);
  }
  var pcr2 = xx2*Math.cos(Z2t)+Z2*Math.cos(Z2A);
  var prr2 = pr21*Math.cos(pr22);
  let Z2pol = [[pgr2,pgx2],[pkr2,pkx2],[pcr2,pcx2],[prr2,prx2],[pgr2,pgx2]];
  let Z2el = [[pgr2,,,pgx2],[pkr2,,,pkx2],[pcr2,,,pcx2],[prr2,,,prx2],[pgr2,,,pgx2]];
  return [Z2pol,Z2el];
}

function Zone3(tr){
  //%Zone 3 setting
  var Z3 = +(document.getElementById("Zone3").value);
  var Z3A = (+(document.getElementById("Zone3A").value)* Math.PI / 180);
  var Z3t = (-3* Math.PI / 180);
  var R3R = +(document.getElementById("Zone3RH").value);
  var R3L = +(document.getElementById("Zone3LH").value);
  var Z3rev = 2;
  //Primary or Secondary Inputs
  const sec = document.getElementById("Sec");
  if (sec.checked) {
    Z3=Z3/tr;R3R=R3R/tr;R3L=R3L/tr;
  }
  //%Zone 3 plot
  const xmul1 = Math.sin(Z3A);
  const xmul2 = (180* Math.PI / 180)-Z3A+Z3t;
  var x3 = xmul1*R3L/Math.sin(xmul2);
  var xx3 = xmul1*R3R/Math.sin(xmul2);
  var ox3 = -Z3rev*xmul1;
  var pgx3 = ox3-x3*Math.sin(Z3t);
  var pkx3 = pgx3+(Z3+Z3rev)*xmul1;
  var prx3 = ox3+xx3*Math.sin(Z3t);
  var pcx3 = prx3+(Z3+Z3rev)*xmul1;
  var or3 = -Z3rev*Math.cos(Z3A);
  var pgr3 = or3-x3*Math.cos(Z3t);
  var pkr3 = pgr3+(Z3+Z3rev)*Math.cos(Z3A);
  var prr3 = or3+xx3*Math.cos(Z3t);
  var pcr3 = prr3+(Z3+Z3rev)*Math.cos(Z3A);
  let Z3pol = [[pgr3,pgx3],[pkr3,pkx3],[pcr3,pcx3],[prr3,prx3],[pgr3,pgx3]];
  let Z3el = [[-Z3rev*Math.cos(Z3A),,,,,-Z3rev*xmul1],[Z3*Math.cos(Z3A),,,,,Z3*xmul1],
        [pgr3,,,,pgx3],[pkr3,,,,pkx3],[pcr3,,,,pcx3],[prr3,,,,prx3],[pgr3,,,,pgx3]];
  let Z3lim = Z3>100 ? Z3 : 100;
  return [Z3pol,Z3el, Z3lim];
}

async function plotProtection(csvarr){
  (new URL(document.location)).searchParams.forEach((x, y) => {
    localStorage.setItem(y,x);
  });

  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  const secdr = document.getElementById("SecDR");

  //Advanced settings variables
  var z2del = +(document.getElementById("Z2del").value);
  var z3del = +(document.getElementById("Z3del").value);
  var fst, vtr, ctr;

  fst = document.getElementById("FST").value=="" ? 1 : +(document.getElementById("FST").value);
  vtr = document.getElementById("VTR").value=="" ? 1 : +(document.getElementById("VTR").value);
  ctr = document.getElementById("CTR").value=="" ? 1 : +(document.getElementById("CTR").value);
  var tr =ctr/vtr; //secondary ratio

  //Primary or Secondary Disturbance record
  var trdr = 1;
  var vtrdr = 1;
  if (secdr.checked) {trdr = tr; vtrdr = vtr;}

  let [Z1pol, Z1el] = Zone1(tr);
  let [Z2pol, Z2el] = Zone2(tr);
  let [Z3pol, Z3el, Z3lim] = Zone3(tr);
  elements2 = [...Z3el, ...Z2el, ...Z1el]; //All Zone polygons and the char angle

  var DR = []; DR = csvarr;
  let calcStuff = {DR,trdr,vtrdr};
  let faultarray = addCSVtoArray(calcStuff);
  let stuff = {faultarray,Z1pol,Z2pol,Z3pol,fst,z2del,z3del};
  FaultZone(stuff);

  var total = elements2.slice();
  for (let i = 0; i < DR.length; i++) {
    total.push(faultarray[i]);
  }
  dygPlot(total,Z3lim)
}

function addCSVtoArray(stuff){
  let {DR,trdr,vtrdr} = stuff;
  let faultarray = [], DRdiv, DRmult;
  for (let i = 0; i < DR.length; i++) { //add csv to array
    faultarray[i] = [];
    DRdiv = (DR[i][0]/DR[i][2])/trdr;
    DRmult = (DR[i][1]-DR[i][3])* Math.PI / 180;
    if (DRdiv*Math.cos(DRmult)<90 &&
      DRdiv*Math.sin(DRmult)<90 &&
      DR[i][0]*vtrdr>1000){
      faultarray[i][0] = DRdiv*Math.cos(DRmult); //resistive values
      faultarray[i][1] = DRdiv*Math.sin(DRmult);//reactive values
    }
  }
  return faultarray;
}

function FaultZone(stuff){
  let {faultarray,Z1pol,Z2pol,Z3pol,fst,z2del,z3del} = stuff;
  var Z3time = 0;
  var Z2time = 0;
  var Z1trip,Z2trip,Z3trip; //In zone booleans
  for (let i = 0; i < faultarray.length; i++) { //check through fault if in zone
    if (inside(faultarray[i],Z3pol)){
      Z3time = Z3time + 1*fst;
      if (Z3time > z3del){
        Z3trip = true;
        document.getElementById("FaultLoc").textContent = "Zone 3 trip";
        break;
      }
    }
    if (inside(faultarray[i],Z2pol)){
      Z2time = Z2time + 1*fst;
      if (Z2time > z2del){
        Z2trip = true;
        document.getElementById("FaultLoc").textContent = "Zone 2 trip";
        break;
      }
    }
    if (inside(faultarray[i],Z1pol)){
      Z1trip = true;
      document.getElementById("FaultLoc").textContent = "Zone 1 trip";
      break;
    }
    else document.getElementById("FaultLoc").textContent = "No trip!";
  }
}

async function dygPlot(total,Z3lim)
  {try {
    if (g3) g3.destroy();
  }catch(e){console.log(e);}
  g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    total,
    {
      dateWindow : [-50,80],
      valueRange : [-20,Z3lim],
      labels: [ 'a', 'Fault','Zone 1', 'Zone 2', 'Zone 3','Characteristic Angle' ],
      xlabel: "Resistance (Ω)",
      ylabel: "Reactance (Ω)",
      legend: 'always',
      drawAxesAtZero: true,
      labelsSeparateLines: true,
      colors: ["red","blue","purple","green","#cccc2b"],
      connectSeparatedPoints: true,
      includeZero: true,
      axes: {
              x: {
        axisLabelFormatter: function(y) {
                  return  y + ' Ω';
                },
              },
              y: {
                axisLabelFormatter: function(y) {
                  return  y + ' Ω';
                },
                axisLabelWidth: 60
              }
      }
    }          // options
    );
    g3.ready(function() {
    setTimeout(function(){
      window.dispatchEvent(new Event('resize'));
    }, 500);

  });
}
//startup
startup();