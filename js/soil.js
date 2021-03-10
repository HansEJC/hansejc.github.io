function startup() {
  (new URL(document.location)).searchParams.forEach((x, y) => { //get parameters from URL
    localStorage.setItem(y,x);
  });
  const measurements = 11;    // set the value to this input
  var cb = []; var cb2 = []; var cb3 = [];
  var cbh = document.getElementById('Dist'); var cbh2 = document.getElementById('Stan'); var cbh3 = document.getElementById('Stiv');

  document.querySelectorAll("button")[0].addEventListener('click', function() {
    document.cookie="test=soil";
    let filename = document.getElementById('TLOC').value+'_soil.csv';
    exportToCsv(filename,soil());
    //exportToDB(filename,soil()); MySQL no longer needed!
    saveResults(filename,soil());
  });
  document.querySelectorAll("button")[1].addEventListener('click', function() {
    document.cookie="test=fop";
    let filename = document.getElementById('TLOC').value+'_FOP.csv';
    exportToCsv(filename,plotFop());
    //exportToDB(filename,plotFop());
    saveResults(filename,plotFop());
  });

  for(var i = 0; i < measurements; i++){
    cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('span');
    cb[i].type = 'number'; cb2[i].type = 'number'; cb2[i].step = "0.01";
    cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]); cbh3.appendChild(cb3[i]);
    cb[i].id = "dis"+i; cb2[i].id = "stan"+i; cb3[i].id = "stiv"+i;  cb3[i].className = "label";
    cb2[i].value = getSavedValue(cb2[i].id);
    cb2[i].onkeyup = function(){saveValue(this);};
  }
  def2();
  def();
  soil();
  plotFop();
  fetchResults();
  document.onkeyup = function() {
    soil();
    plotFop();
  };
}

function def2() {
  document.getElementById("FOPDis").value = getSavedValue("FOPDis");    // set the value to this input

  var fopdis = Number(getSavedValue("FOPDis"));    // set the value to this input
  if (fopdis==0) {
    fopdis = 50;
    document.getElementById("FOPDis").value = 50;
  }
  var cb = []; var cb2 = [];
  var cbh = document.getElementById('Dist2'); var cbh2 = document.getElementById('Meas');
  for(var i = 0; i < 10; i++){
    cb[i] = document.createElement('input'); cb2[i] = document.createElement('input');
    cb[i].type = 'number'; cb2[i].type = 'number'; cb2[i].step = "0.01";
    cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]);
    cb[i].id = "fopdis"+i; cb2[i].id = "fopmeas"+i;
    cb2[i].value = getSavedValue(cb2[i].id);
    cb2[i].onkeyup = function(){saveValue(this);};
    document.getElementById("fopdis"+i).value = +(fopdis*((i)/10)).toFixed(1);
  }
  document.getElementById("fopdis6").value = +(fopdis*0.62).toFixed(1);
}

function soil() {
  document.getElementById("TLOC").value = getSavedValue("TLOC");    // set the value to this input
  const measurements = 11;
  var stiv = 0;
  var dis,stan;
  var soilarr = [];
  for(var i = 0; i < measurements; i++){
    dis = Number(document.getElementById("dis"+i).value);
    stan = Number(document.getElementById("stan"+i).value);
    stiv = dis*stan*2*Math.PI;
    document.getElementById("stiv"+i).textContent = +stiv.toFixed(2)+" Ωm";
    if (stan != 0) soilarr.push([dis,stan,stiv]);
  }
  //console.table(soilarr);
  return soilarr;
}

function def() {
  document.getElementById("dis"+0).value = 0.2;
  document.getElementById("dis"+1).value = 0.4;
  document.getElementById("dis"+2).value = 0.8;
  document.getElementById("dis"+3).value = 1.6;
  document.getElementById("dis"+4).value = 3;
  document.getElementById("dis"+5).value = 5;
  document.getElementById("dis"+6).value = 10;
  document.getElementById("dis"+7).value = 15;
  document.getElementById("dis"+8).value = 20;
  document.getElementById("dis"+9).value = 25;
  document.getElementById("dis"+10).value = 30;
}

function plotFop() {
  var dis,meas;
  var foparr = [];
  for(var i = 0; i < 10; i++){
    dis = Number(document.getElementById("fopdis"+i).value);
    meas = Number(document.getElementById("fopmeas"+i).value);
    if (meas != 0) foparr.push([dis,meas]);
  }
  var fir = Number(document.getElementById("fopmeas5").value),
    sec = Number(document.getElementById("fopmeas6").value),
    thir = Number(document.getElementById("fopmeas7").value);
  document.getElementById("fopmeas5").className = 'info';document.getElementById("fopmeas6").className = 'info';document.getElementById("fopmeas7").className = 'info';

  if ((fir*1.05>=sec&&sec>=fir*0.95)&&(thir*1.05>=sec&&sec>=thir*0.95)) {
    document.getElementById("Meth").className = 'label safe';
    document.getElementById("Meth").textContent = 'Valid';
  }
  else {
    document.getElementById("Meth").className = 'label danger';
    document.getElementById("Meth").textContent = 'Invalid';
  }

  try {
    if (g3) g3.destroy();
  }catch(e){console.log(e);}
  if (foparr.length == 0) return;
  g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    foparr,
    {
      labels: [ 'a', 'Resistance (Ω)'],
      xlabel: "Distance (m)",
      ylabel: "Resistance (Ω)",
      legend: 'never',
      drawAxesAtZero: true,
      includeZero: true,
      axes: {
              x: {
        axisLabelFormatter: function(y) {
                  return  y + ' m';
                },
               // axisLabelWidth: 100
              },
              y: {
                axisLabelFormatter: function(y) {
                  return  +y.toFixed(3) + ' Ω';
                },
                axisLabelWidth: 70
              }
      }
    }          // options
    );
    g3.ready(function() {
    setTimeout(function(){
      window.dispatchEvent(new Event('resize'));
    }, 500);

  });

  return foparr;
}

function rem2() {
  const myNode = document.getElementById("Dist2");
  myNode.innerHTML = '';
  const myNode2 = document.getElementById("Meas");
  myNode2.innerHTML = '';
}

//Export to database
function exportToDB(filename,rows) {
  let db =(filename.includes("FOP")) ? "fop" :  "soil";
  let tloc = document.getElementById('TLOC').value.split(' ').join('_');

    post("./soildb.php",
    {
    datab: db,
    tabl: tloc,
        distance: transpose(rows)[0],
        res: transpose(rows)[1],
    },sucPost);
  function sucPost(data){
        if (filename.includes("FOP")) {
      document.getElementById("span2").innerHTML = data;
      _('#span2').fade('in', 200);
      setTimeout(function(){
        _('#span2').fade('out', 500);
      }, 3000);
    }
    else {
      document.getElementById("span1").innerHTML = data;
      _('#span1').fade('in', 200);
      setTimeout(function(){
        _('#span1').fade('out', 500);
      }, 3000);
    }
  }
}

//Save to json
function saveResults(filename,rows){
  let tloc = document.getElementById('TLOC').value;

  post("./saveSoil.php",
  {
    site: tloc,
    results: rows,
    delete: (document.querySelector("#FOPDis").value == "69"),
   },sucPost);
  function sucPost(data){
        if (filename.includes("FOP")) {
      document.getElementById("span2").innerHTML = data;
      _('#span2').fade('in', 200);
      setTimeout(function(){
        _('#span2').fade('out', 500);
        location.reload();
        return false;
      }, 3000);
    }
    else {
      document.getElementById("span1").innerHTML = data;
      _('#span1').fade('in', 200);
      setTimeout(function(){
        _('#span1').fade('out', 500);
        location.reload();
        return false;
      }, 3000);
    }
    }
}

function fetchResults(){
  try {
    (async () => {
      const soilResults = await fetch('uploads/soil.json')
        .then(result => result.json());
      soilResults.sort((a,b) => b[1] - a[1]);
      const soilTable = document.getElementById('soilResults');
      resultsTable(soilResults,soilTable);
      const fopResults = await fetch('uploads/fop.json')
        .then(result => result.json());
      fopResults.sort((a,b) => b[1] - a[1]);
      const fopTable = document.getElementById('fopResults');
      resultsTable(fopResults,fopTable);
    })();
  }catch(err){console.log(e);}
}

function resultsTable(results,tbl){
  results.forEach(val => {
    let row = tbl.insertRow(-1);
    let check = document.createElement('input');
    check.type = "checkbox";
    check.onchange = function(){table(val,this);}
    row.insertCell(0).innerHTML = val.site;
    row.insertCell(1).appendChild(check);
  });
}

function table(rows,target){
  const myTable = document.createElement('table');
  myTable.classList.add("scores");
  let row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = "<th>Distance (m)</th>";
  row.insertCell(1).outerHTML = "<th>Resistance (Ω)</th>";
  if (rows.results[0].length > 2) row.insertCell(2).outerHTML = "<th>Resistivity (Ωm)</th>";

  try{
    rows.results.forEach(arr => {
      let row = myTable.insertRow(-1);
      row.insertCell(0).innerHTML = arr[0];
      row.insertCell(1).innerHTML = arr[1];
      if (arr.length > 2) row.insertCell(2).innerHTML = parseFloat(arr[2]).toFixed(2);
    })
  }catch(err){console.log(err)}

  if (target.checked) document.querySelector("#tab").appendChild(myTable);
  else document.querySelector("#tab").removeChild(document.querySelector("#tab").lastChild)
}

//flip array
function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

//startup
startup();