function startup() {
  fireBase();
  funkyValues();
  const measurements = 11;    // set the value to this input
  const cb = [], cb2 = [], cb3 = [];
  const cbh = document.getElementById("Dist"), cbh2 = document.getElementById("Stan"), cbh3 = document.getElementById("Stiv");

  buttonFun(0, "soil", soil);
  buttonFun(1, "fop", fop);

  for (let i = 0; i < measurements; i++) {
    cb[i] = document.createElement("span"); cb2[i] = document.createElement("input"); cb3[i] = document.createElement("span");
    cb2[i].type = "number"; cb2[i].step = "0.01";
    cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]); cbh3.appendChild(cb3[i]);
    cb[i].id = `dis${i}`; cb2[i].id = `stan${i}`; cb3[i].id = `stiv${i}`;
    cb[i].className = "label"; cb3[i].className = "label";
    cb2[i].value = getSavedValue(cb2[i].id);
    cb2[i].addEventListener('keyup', saveValue);
  }
  def2();
  def();
  soil();
  fop();
  fetchResults();
  document.addEventListener('keyup', () => {
    soil();
    fop();
  });
  document.addEventListener('change', () => {
    soil();
    fop();
  });
}

function buttonFun(but, str, fun) {
  document.querySelectorAll("button")[but].addEventListener("click", function () {
    localStorage.setItem("test", str);
    const filename = `${document.getElementById("TLOC").value}_${str}.csv`;
    exportToCsv(filename, fun());
    saveResults(fun());
  });
}

function def2() {
  document.getElementById("FOPDis").value = getSavedValue("FOPDis");    // set the value to this input 
  const cb = [], cb2 = [];
  const cbh = document.getElementById("Dist2"), cbh2 = document.getElementById("Meas");
  for (let i = 0; i < 10; i++) {
    cb[i] = document.createElement("span"); cb2[i] = document.createElement("input");
    cb[i].className = "label"; cb2[i].type = "number"; cb2[i].step = "0.01";
    cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]);
    cb[i].id = `fopdis${i}`; cb2[i].id = `fopmeas${i}`;
    cb2[i].value = getSavedValue(cb2[i].id);
    cb2[i].addEventListener('keyup', saveValue);
  }
}

function soil() {
  def();
  document.getElementById("TLOC").value = getSavedValue("TLOC");    // set the value to this input
  const measurements = 11;
  let stiv = 0;
  let dis, stan;
  const soilarr = [];
  for (let i = 0; i < measurements; i++) {
    dis = Number(document.getElementById(`dis${i}`).innerText);
    stan = Number(document.getElementById(`stan${i}`).value);
    stiv = dis * stan * 2 * Math.PI;
    document.getElementById(`stiv${i}`).textContent = `${Number(stiv.toFixed(2))} Ωm`;
    if (stan !== 0) soilarr.push([dis, stan, stiv]);
    document.getElementById(`dis${i}`).innerText = `${dis}m (${dis / 2} - ${(dis + dis / 2).toFixed(1)})`;
  }
  //console.table(soilarr);
  return soilarr;
}

function def() {
  document.getElementById("dis0").innerText = 0.2;
  document.getElementById("dis1").innerText = 0.4;
  document.getElementById("dis2").innerText = 0.8;
  document.getElementById("dis3").innerText = 1.6;
  document.getElementById("dis4").innerText = 3;
  document.getElementById("dis5").innerText = 5;
  document.getElementById("dis6").innerText = 10;
  document.getElementById("dis7").innerText = 15;
  document.getElementById("dis8").innerText = 20;
  document.getElementById("dis9").innerText = 25;
  document.getElementById("dis10").innerText = 30;
}

function fop() {
  let dis, meas;
  let fopdis = Number(getSavedValue("FOPDis"));    // set the value to this input
  if (fopdis === 0) {
    fopdis = 50;
    document.getElementById("FOPDis").value = 50;
  }
  const foparr = [];
  for (let i = 0; i < 10; i++) {
    dis = Number((fopdis * ((i) / 10)).toFixed(1));
    meas = Number(document.getElementById(`fopmeas${i}`).value);
    if (meas !== 0) foparr.push([dis, meas]);
    document.getElementById(`fopdis${i}`).innerText = `${dis} m`;
  }
  document.getElementById("fopdis6").innerText = `${Number((fopdis * 0.62).toFixed(1))} m`;

  const fir = Number(document.getElementById("fopmeas5").value),
    sec = Number(document.getElementById("fopmeas6").value),
    thir = Number(document.getElementById("fopmeas7").value);
  document.getElementById("fopmeas5").className = "info";
  document.getElementById("fopmeas6").className = "info";
  document.getElementById("fopmeas7").className = "info";

  const meth = document.getElementById("Meth");
  const valid = (fir * 1.05 >= sec && sec >= fir * 0.95) && (thir * 1.05 >= sec && sec >= thir * 0.95);
  meth.className = valid ? "label safe" : "label danger";
  meth.textContent = valid ? "Valid" : "Invalid";

  dygPlot(foparr);
  return foparr;
}

function dygPlot(foparr) {
  try {
    if (typeof g3 !== "undefined") g3.destroy();
  } catch (e) { logError(e); }
  if (foparr.length === 0) return;
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    foparr,
    {
      labels: ["a", "Resistance (Ω)"],
      xlabel: "distance (m)",
      ylabel: "Resistance (Ω)",
      legend: "never",
      drawAxesAtZero: true,
      includeZero: true,
      axes: {
        x: {
          axisLabelFormatter(y) { return `${y} m` },
          // axisLabelWidth: 100
        },
        y: {
          axisLabelFormatter(y) { return `${Number(y.toFixed(3))} Ω` },
          axisLabelWidth: 70
        }
      }
    }          // options
  );
  g3.ready(function () {
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  });
}

function saveResults(rows) {
  const tloc = document.getElementById("TLOC").value;
  const test = getSavedValue("test");
  const removal = (document.querySelector("#FOPDis").value === "69");
  if (tloc === "" || test === "") return;
  const dbObj = firebase.database().ref(`${test}/${tloc}`);
  removal ? dbObj.remove() : dbObj.update(rows);
  const msg = removal ? "Deleting from the database" : "Saving test results to the database";
  sucPost(msg);
}

function sucPost(data) {
  const span = (getSavedValue("test").includes("fop")) ? "#span2" : "#span1";
  document.querySelector(span).innerHTML = data;
  _(span).fade("in", 200);
  setTimeout(function () {
    _(span).fade("out", 500);
    return false;
  }, 3000);
}

function fetchResults() {
  const dbSoil = firebase.database().ref("soil");
  const dbFop = firebase.database().ref("fop");
  dbSoil.on("value", snap => {
    resultsTable(snap.val(), document.getElementById("soilResults"));
  });
  dbFop.on("value", snap => {
    resultsTable(snap.val(), document.getElementById("fopResults"));
  });
}

function resultsTable(results, tbl) {
  const tbody = tbl.firstElementChild.nextSibling;
  while (tbody.childElementCount > 2) { //don't remove the firstborn children
    tbody.removeChild(tbody.lastChild);
  }
  results = Object.entries(results);
  results.forEach(val => {
    const row = tbl.insertRow(-1);
    const check = document.createElement("input");
    check.type = "checkbox";
    check.onchange = function () { table(val, this); }
    row.insertCell(0).innerHTML = val[0];
    row.insertCell(1).appendChild(check);
  });
}

function table(rows, target) {
  const myTable = document.createElement("table");
  myTable.classList.add("scores");
  const row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = "<th>Distance (m)</th>";
  row.insertCell(1).outerHTML = "<th>Resistance (Ω)</th>";
  if (rows[1][0].length > 2) row.insertCell(2).outerHTML = "<th>Resistivity (Ωm)</th>";

  try {
    rows[1].forEach(arr => {
      const row = myTable.insertRow(-1);
      [row.insertCell(0).innerHTML, row.insertCell(1).innerHTML] = arr;
      if (arr.length > 2) row.insertCell(2).innerHTML = parseFloat(arr[2]).toFixed(2);
    })
  } catch (err) { logError(err) }

  if (target.checked) document.querySelector("#tab").appendChild(myTable);
  else document.querySelector("#tab").removeChild(document.querySelector("#tab").lastChild)
}

//startup
startup();