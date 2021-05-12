function startup() {
  (new URL(document.location)).searchParams.forEach((x, y) => { //get parameters from URL
    localStorage.setItem(y, x);
  });
  fireBase();
  const measurements = 11;    // set the value to this input
  let cb = [], cb2 = [], cb3 = [];
  var cbh = document.getElementById(`Dist`), cbh2 = document.getElementById(`Stan`), cbh3 = document.getElementById(`Stiv`);

  buttonFun(0, `soil`, soil);
  buttonFun(1, `fop`, fop);

  for (var i = 0; i < measurements; i++) {
    cb[i] = document.createElement(`span`), cb2[i] = document.createElement(`input`), cb3[i] = document.createElement(`span`);
    cb2[i].type = `number`, cb2[i].step = `0.01`;
    cbh.appendChild(cb[i]), cbh2.appendChild(cb2[i]), cbh3.appendChild(cb3[i]);
    cb[i].id = `dis${i}`, cb2[i].id = `stan${i}`, cb3[i].id = `stiv${i}`;
    cb[i].className = `label`, cb3[i].className = `label`;
    cb2[i].value = getSavedValue(cb2[i].id);
    cb2[i].onkeyup = function () { saveValue(this); };
  }
  def2();
  def();
  soil();
  fop();
  fetchResults();
  document.onkeyup = function () {
    soil();
    fop();
  };
}

function buttonFun(but, str, fun) {
  document.querySelectorAll(`button`)[but].addEventListener(`click`, function () {
    localStorage.setItem(`test`,str);
    let filename = `${document.getElementById("TLOC").value}_${str}.csv`;
    exportToCsv(filename, fun());
    saveResults(fun());
  });
}

function def2() {
  document.getElementById(`FOPDis`).value = getSavedValue(`FOPDis`);    // set the value to this input 
  let cb = [], cb2 = [];
  let cbh = document.getElementById(`Dist2`), cbh2 = document.getElementById(`Meas`);
  for (let i = 0; i < 10; i++) {
    cb[i] = document.createElement(`span`), cb2[i] = document.createElement(`input`);
    cb[i].className = `label`, cb2[i].type = `number`, cb2[i].step = `0.01`;
    cbh.appendChild(cb[i]), cbh2.appendChild(cb2[i]);
    cb[i].id = `fopdis${i}`, cb2[i].id = `fopmeas${i}`;
    cb2[i].value = getSavedValue(cb2[i].id);
    cb2[i].onkeyup = function () { saveValue(this); };
  }
}

function soil() {
  def();
  document.getElementById(`TLOC`).value = getSavedValue(`TLOC`);    // set the value to this input
  const measurements = 11;
  let stiv = 0;
  let dis, stan;
  let soilarr = [];
  for (let i = 0; i < measurements; i++) {
    dis = +(document.getElementById(`dis${i}`).innerText);
    stan = +(document.getElementById(`stan${i}`).value);
    stiv = dis * stan * 2 * Math.PI;
    document.getElementById(`stiv${i}`).textContent = `${+stiv.toFixed(2)} Ωm`;
    if (stan != 0) soilarr.push([dis, stan, stiv]);
    document.getElementById(`dis${i}`).innerText = `${dis}m (${dis / 2} - ${(dis + dis / 2).toFixed(1)})`;
  }
  //console.table(soilarr);
  return soilarr;
}

function def() {
  document.getElementById(`dis0`).innerText = 0.2;
  document.getElementById(`dis1`).innerText = 0.4;
  document.getElementById(`dis2`).innerText = 0.8;
  document.getElementById(`dis3`).innerText = 1.6;
  document.getElementById(`dis4`).innerText = 3;
  document.getElementById(`dis5`).innerText = 5;
  document.getElementById(`dis6`).innerText = 10;
  document.getElementById(`dis7`).innerText = 15;
  document.getElementById(`dis8`).innerText = 20;
  document.getElementById(`dis9`).innerText = 25;
  document.getElementById(`dis10`).innerText = 30;
}

function fop() {
  let dis, meas;
  let fopdis = +(getSavedValue(`FOPDis`));    // set the value to this input
  if (fopdis == 0) {
    fopdis = 50;
    document.getElementById(`FOPDis`).value = 50;
  }
  let foparr = [];
  for (let i = 0; i < 10; i++) {
    dis = document.getElementById(`fopdis${i}`).innerText = +(fopdis * ((i) / 10)).toFixed(1);
    meas = +(document.getElementById(`fopmeas${i}`).value);
    if (meas != 0) foparr.push([dis, meas]);
  }
  document.getElementById(`fopdis6`).innerText = `${+(fopdis * 0.62).toFixed(1)}m`;

  const fir = +(document.getElementById(`fopmeas5`).value),
    sec = +(document.getElementById(`fopmeas6`).value),
    thir = +(document.getElementById(`fopmeas7`).value);
  document.getElementById(`fopmeas5`).className = `info`;
  document.getElementById(`fopmeas6`).className = `info`;
  document.getElementById(`fopmeas7`).className = `info`;

  const meth = document.getElementById(`Meth`);
  const valid = (fir * 1.05 >= sec && sec >= fir * 0.95) && (thir * 1.05 >= sec && sec >= thir * 0.95);
  meth.className = valid ? `label safe` : `label danger`;
  meth.textContent = valid ? `Valid` : `Invalid`;

  dygPlot(foparr);
  return foparr;
}

function dygPlot(foparr) {
  try {
    if (typeof g3 !== `undefined`) g3.destroy();
  } catch (e) { console.log(e); }
  if (foparr.length == 0) return;
  g3 = new Dygraph(
    document.getElementById(`graphdiv3`),
    foparr,
    {
      labels: [`a`, `Resistance (Ω)`],
      xlabel: `distance (m)`,
      ylabel: `Resistance (Ω)`,
      legend: `never`,
      drawAxesAtZero: true,
      includeZero: true,
      axes: {
        x: {
          axisLabelFormatter: function (y) {
            return `${y} m`;
          },
          // axisLabelWidth: 100
        },
        y: {
          axisLabelFormatter: function (y) {
            return `${+y.toFixed(3)} Ω`;
          },
          axisLabelWidth: 70
        }
      }
    }          // options
  );
  g3.ready(function () {
    setTimeout(function () {
      window.dispatchEvent(new Event(`resize`));
    }, 500);
  });
}

function saveResults(rows) {
  let tloc = document.getElementById(`TLOC`).value;
  let test = getSavedValue("test");
  let removal = (document.querySelector(`#FOPDis`).value == `69`);
  if (tloc === `` || test === ``) return;
  let dbObj = firebase.database().ref(`${test}/${tloc}`);
  removal ? dbObj.remove() : dbObj.update(rows);
  let msg = removal ? `Deleting from the database` : `Saving test results to the database`;
  sucPost(msg);
}

function sucPost(data) {
  let span = (getSavedValue(`test`).includes(`fop`)) ? `#span2` : `#span1`;
  document.querySelector(span).innerHTML = data;
  _(span).fade(`in`, 200);
  setTimeout(function () {
    _(span).fade(`out`, 500);
    return false;
  }, 3000);
}

function fetchResults() {
  let dbSoil = firebase.database().ref(`soil`);
  let dbFop = firebase.database().ref(`fop`);
  dbSoil.on(`value`, snap => {
    resultsTable(snap.val(), document.getElementById(`soilResults`));
  });
  dbFop.on(`value`, snap => {
    resultsTable(snap.val(), document.getElementById(`fopResults`));
  });
}

function resultsTable(results, tbl) {
  let tbody = tbl.firstElementChild.nextSibling;
  while (tbody.childElementCount > 2) { //don't remove the firstborn children
    tbody.removeChild(tbody.lastChild);
  }
  results = Object.entries(results);
  results.forEach(val => {
    let row = tbl.insertRow(-1);
    let check = document.createElement(`input`);
    check.type = `checkbox`;
    check.onchange = function () { table(val, this); }
    row.insertCell(0).innerHTML = val[0];
    row.insertCell(1).appendChild(check);
  });
}

function table(rows, target) {
  const myTable = document.createElement(`table`);
  myTable.classList.add(`scores`);
  let row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = `<th>Distance (m)</th>`;
  row.insertCell(1).outerHTML = `<th>Resistance (Ω)</th>`;
  if (rows[1][0].length > 2) row.insertCell(2).outerHTML = `<th>Resistivity (Ωm)</th>`;

  try {
    rows[1].forEach(arr => {
      let row = myTable.insertRow(-1);
      row.insertCell(0).innerHTML = arr[0];
      row.insertCell(1).innerHTML = arr[1];
      if (arr.length > 2) row.insertCell(2).innerHTML = parseFloat(arr[2]).toFixed(2);
    })
  } catch (err) { console.log(err) }

  if (target.checked) document.querySelector(`#tab`).appendChild(myTable);
  else document.querySelector(`#tab`).removeChild(document.querySelector(`#tab`).lastChild)
}

//startup
startup();