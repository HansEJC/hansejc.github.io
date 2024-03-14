/**
 * Function to add wait loader
 * @param html Text to display
 * @param err If it is an error or message
 * @param val Progress level
 */
function addLoader(html, err, val) {
  const div = document.createElement('div');
  const prog = document.createElement("progress");
  prog.max = 100; prog.value = val || 50;
  const graphdiv = document.getElementById("graphdiv3");
  const errdiv = document.getElementById("err");
  if (err) {
    document.querySelectorAll("#error").forEach(x => x.parentNode.removeChild(x));
    errdiv.insertBefore(div, errdiv.firstChild);
    div.innerHTML = `<center>${html}</center>`;
    div.id = "error";
    _('#error').fade('in', 300);
    setTimeout(() => {
      _('#error').fade('out', 500);
    }, 3000);
  }
  if (!err) {
    graphdiv.innerHTML = `<center>${html}</center>`;
    div.classList.add("loader");
    graphdiv.appendChild(div);
    graphdiv.appendChild(prog);
  }
}

function checkit() {
  const hide = document.getElementById("hide");
  hide.style.display = this.id === 'CSVF' ? "none" : "block";
}

function colorUpdate() {
  const colorNode = document.querySelectorAll("input[type=color]");
  let colArr = [...colorNode];
  colArr = colArr.map(col => col.value);
  g3.updateOptions({
    colors: colArr
  });
}

function chooseOptions() {
  //options
  const options = document.getElementById("options"); options.innerHTML = '<b>Options</b>';
  addOption('fillGraph', 'Fill Graph');
  addOption('plotter', 'Smooth Plotter', false, smoothPlotter);
  addOption('logscale', 'Log Scale');
  addOption('drawGrid', 'Show Grid', true);
  addOption('connectSeparatedPoints', 'Connect Points', true);
  addOption('drawPoints', 'Draw Points');
  addOption('stackedGraph', 'Stacked Graph');
  addOption('stepPlot', 'Step Plot');
  addOption('animatedZooms', 'Animated Zoom');
  addOption('labelsSeparateLines', 'One Line per Label');
  addOption('labelsKMB', 'Label Format');
  addOption('labelsKMB2', 'Label Format2');
}

function addOption(opt, desc, bool, plotter) {
  const newopt = document.createElement('input'); newopt.id = opt; newopt.type = 'checkbox';
  if (bool) localStorage.setItem(opt, bool);
  let checked = (getSavedValue(newopt.id) === "true"); newopt.checked = checked;
  const label = document.createElement("Label"); label.setAttribute("for", opt); label.innerHTML = desc;
  options.appendChild(label); label.appendChild(newopt);
  function updateOps(e) {
    const optionsToUpdate = {};
    optionsToUpdate[e.target.id] = e.target.checked;
    g3.updateOptions(optionsToUpdate);
  }
  function updatePlotter(e) {
    const optionsToUpdate = {};
    optionsToUpdate[e.target.id] = e.target.checked ? plotter : Dygraph.Plotters.linePlotter;
    g3.updateOptions(optionsToUpdate);
  }
  if (typeof plotter === 'function') { newopt.addEventListener('change', updatePlotter); updatePlotter({ target: { checked, id: opt } }); }
  else { newopt.addEventListener('change', updateOps); updateOps({ target: { checked, id: opt } }); }
}

function inputsNfunc(db) {
  document.getElementById("xaxis").value = getSavedValue("xaxis");    // set the value to this input
  document.getElementById("yaxis").value = getSavedValue("yaxis");   // set the value to this input
  document.getElementById("99").checked = getSavedValue("99") === "true"; //remember if start date is checked
  document.getElementById("99").onchange = () => { read(db); };
  document.getElementById("dat").onblur = () => { read(db); };
  document.getElementById("datR").onblur = () => { read(db); };
  document.getElementById("eqcheck").onchange = () => { read(db); };
  document.getElementById("LabR").value = getSavedValue("Labr");
  document.getElementById("dat").value = getSavedValue("dat");
  document.getElementById("datR").value = getSavedValue("datR");
  localStorage.setItem(document.getElementById("eqcheck").id, false); //uncheck equations with new file
  const radios = document.querySelectorAll("input[name=ArrayOrCSV]");
  radios.forEach(rad => rad.addEventListener('change', checkit));
}

function startup(bool) {
  funkyValues();
  document.getElementById("69").checked = getSavedValue("69") === "true" || getSavedValue("69") === ""; //checkbox "Show" with new file
  const idbSupported = ("indexedDB" in window);
  let db;

  if (idbSupported) {
    const openRequest = indexedDB.open("graph", 1);
    openRequest.onupgradeneeded = dbUpgrade(db);
    openRequest.onsuccess = function (e) {
      db = e.target.result;
      const transaction = db.transaction(["plots"]);
      const objectStore = transaction.objectStore("plots");
      const request = objectStore.get("2");
      request.onsuccess = function (event) {
        uploadcsv(db);
        if (bool) return;
        inputsNfunc(db);
        read(db);
      };
    }
  }
}

function uploadcsv(db) {
  document.querySelector("#my_upload").onchange = function (evt) {
    addLoader("Uploading csv", false, 33);
    if (!window.FileReader) return; // Browser is not compatible

    const reader = new FileReader();

    reader.onload = function (evt) {
      if (evt.target.readyState !== 2) return;
      if (evt.target.error) {
        addLoader('Error while reading file', true);
        return;
      }
      const filecontent = evt.target.result;
      if (document.getElementById("CSVF").checked) {
        try {//the for loop removes saved labels
          const len = filecontent.split("\n")[0].split(",").length;
          for (let i = 0; i < len; i++) localStorage.removeItem(`csvlabel${i}`);
          return dyg(filecontent);
        } catch (err) { addLoader("CSV Formatting Error, Attempting to Process Upload.", true); }
      }
      document.getElementById("PrUp").checked = true;
      plotcalcs(filecontent, db);
    };
    reader.readAsText(evt.target.files[0]);

    //put filename in span
    const fullPath = document.getElementById('my_upload').value;
    if (fullPath) {
      const startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      let filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
      localStorage.setItem('Filename', filename);
    }
  };
}

function read(db) {
  const prog = ((getSavedValue("99") === "true") || (getSavedValue("eqcheck") === "true")) ? 33 : 66;
  try {
    addLoader("Reading Data from Variable", false, prog);
    const arr = heh.map(x => [...x]);
    plotexp(arr, db);
  }
  catch (err) {
    addLoader("Reading and Loading Data from IndexDB", false, prog);
    const transaction = db.transaction(["plots"], "readonly");
    const objectStore = transaction.objectStore("plots");
    objectStore.openCursor(null, "prev").onsuccess = async function (event) {
      try {
        const cursor = event.target.result.value.data;
        heh = [];
        heh = cursor.map(x => [...x]);
        plotexp(cursor);
      } catch (err) {
        addLoader(err, true);
        defaultPlot(db);
      }
    }
  }
}

async function defaultPlot(db) {
  addLoader("Calculations or Data Error. Uploading Default Graph.", true);
  const csv = await fetch('uploads/graph.csv').then(result => result.text());
  plotcalcs(csv, db);
}

function plotcalcs(csv, db) {
  addLoader("Formatting Data", false, 66);
  localStorage.setItem(document.getElementById("eqcheck").id, false); //uncheck equations with new file
  csv = parseCSV(csv);
  save(csv, db);
  plotexp(csv);
}

/**
 * Function to parse CSV
 * @param csv Original csv file
 * @returns The csv converted to a 2D array
 */
function parseCSV(csv) {
  csv = Papa.parse(csv).data;
  try {
    while (csv[csv.length - 1].length !== csv[csv.length - 5].length) {
      csv.splice(csv.length - 1, 1);// remove empty ends
    }
  } catch (e) { addLoader(e, true); }

  for (let i = 0; i < csv.length; i++) {    //make all rows have equal numbers to bottom row
    if (csv[i].length !== csv[csv.length - 1].length) {
      csv.splice(i, 1);
      i--;
    }
  }
  csv = csv.map(i => i.map(j => {
    return j === "null" ? null : Number(j);
  })); //loop through 2D array and map individual items
  for (let i = 0; i < csv.length; i++) {    //eliminate not numbers
    for (let j = 0; j < csv[i].length; j++) {    //eliminate not numbers
      if (isNaN(csv[i][j])) {
        csv[i].splice(j, 1);
        j--;
      }
    }
    if (typeof csv[i] === "undefined" || csv[i].length === 0) {
      csv.splice(i, 1);
      i--;
    }
  }
  return csv;
}

//save to database
function save(data, db) {
  heh = [];
  heh = data.map(x => [...x]);
  const transaction = db.transaction(["plots"], "readwrite");
  const objectStore = transaction.objectStore("plots");
  objectStore.put({ id: 1, data });
}

function plotexp(csv, db) {
  //show hidden options
  const y = document.getElementById("hide");
  y.style.display = "block";

  let dat = new Date()/*, datb = false*/;
  let datrate = 1000;  //one second
  if (document.getElementById("dat").value !== "") dat = new Date(document.getElementById("dat").value);
  if (document.getElementById("datR").value !== "") datrate = Number(document.getElementById("datR").value) * 1000;
  if (document.getElementById("99").checked && !(csv[0][0] instanceof Date)) { //set own start date and increment
    addLoader("Adding Custom Dates", false, 80);
    for (let i = 0; i < csv.length; i++) {
      csv[i].unshift(new Date(dat.setTime(dat.getTime() + datrate)));
      //dat.setTime(dat.getTime()+1000
    }
  }

  equationInputs(csv[0].length);
  const eqychecky = document.getElementById("eqcheck").checked = (getSavedValue("eqcheck") === "true");
  if (eqychecky) { //eqb = true;
    addLoader("Calculating Equations", false, 90);
    setTimeout(() => { csv = arrayequations(csv, db) }, 1);
  }
  setTimeout(() => { dyg(csv) }, 1);
}

function equationInputs(len, res) {//add equation inputs
  const eqh = document.getElementById('equa');
  let reset = false;
  try {
    while (eqh.childElementCount > 2) { //don't remove the firstborn children
      eqh.removeChild(eqh.lastChild);
    }
  } catch (err) { addLoader(e, true); }
  const equ = []/*, eqw = [], eqb = false*/;
  for (let i = 1; i < len; i++) {
    equ[i] = document.createElement('input');
    equ[i].type = 'text';
    const ch = String.fromCharCode(96 + i);
    if (getSavedValue(ch) === "0" && res) localStorage.setItem(ch, ch);
    reset = getSavedValue(ch) === "";
    equ[i].value = reset ? ch : getSavedValue(ch);
    //eqw[i-1] = equ[i].value;
    equ[i].id = ch;
    equ[i].addEventListener('keyup', saveValue);
    eqh.appendChild(equ[i]);
  }
}

function arrayequations(csv, db) {//column equations
  let mod = false;
  try {
    for (let i = 1; i < csv[0].length; i++) {
      const ch = String.fromCharCode(96 + i);
      const eq = document.getElementById(ch).value;
      if (ch === eq) continue; //only eval if there is an equation
      for (let j = 0; j < csv.length; j++) {
        if (eq === "0") {
          csv[j].splice(i, 1);
          mod = true;
        }
        else {
          window[ch] = csv[j][i];
          csv[j][i] = Function(`return ${eq}`)();
        }
      }
    }
    if (mod) {
      equationInputs(csv[0].length, true);
      save(csv, db);
    }
    return csv;
  } catch (err) { defaultPlot(db); }
}

function dyg(csv) {
  /*Remove unused checkboxes*/
  try {
    const myNode = document.getElementById("MyForm");
    while (myNode.childElementCount > 3) { //don't remove the firstborn children
      myNode.removeChild(myNode.lastChild);
      while (document.getElementById("ColorForm").childElementCount > 1) { //don't remove the firstborn children
        document.getElementById("ColorForm").removeChild(document.getElementById("ColorForm").lastChild);
        document.getElementById("LineStyles").removeChild(document.getElementById("LineStyles").lastChild);
      }
    }
  } catch (err) { addLoader(err, true); }
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  } catch (e) { addLoader(e, true); }
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    csv,
    {
      xlabel: document.getElementById("xaxis").value,
      ylabel: document.getElementById("yaxis").value,
      connectSeparatedPoints: document.getElementById("CSVF").checked,
      legend: 'always',
      includeZero: true,
      showRoller: true,
      axes: {
        x: {
          axisLabelFormatter(y, gran, opts) {
            return y instanceof Date ? Dygraph.dateAxisLabelFormatter(y, gran, opts) : smoothdec(y);
          },
        },
        y: {
          axisLabelFormatter(y) { return smoothdec(y) },
        },
      }
    }          // options
  );
  g3.ready(dygReady);
}
function dygReady() {
  findExtremes();
  const lbs = g3.getLabels();
  const colors = g3.getColors();
  lbs.shift();
  const cb = [], cb2 = [], col = [], sty = [];
  const cbh = document.getElementById('MyForm'), colF = document.getElementById('ColorForm');

  for (let i = 0; i < lbs.length; i++) {
    cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); col[i] = document.createElement('input');
    cb[i].type = 'checkbox'; cb2[i].type = 'text'; col[i].type = 'color';
    cbh.appendChild(cb[i]); cbh.appendChild(cb2[i]); colF.appendChild(col[i]);
    cb[i].id = `csvcheckbox ${i}`; cb2[i].id = `csvlabel${i}`; col[i].id = `csvcolor${i}`;
    cb2[i].value = getSavedValue(`csvlabel${i}`) === "" ? lbs[i] : getSavedValue(`csvlabel${i}`);
    col[i].value = rgbToHex(colors[i]);
    cb2[i].className = "idents";
    cb[i].checked = getSavedValue(cb[i].id) === "" || getSavedValue(cb[i].id) === "true";
    lineStyles(sty, i);
    cb[i].onchange = function () { change(this); }; cb2[i].onblur = () => { idents(lbs.length); };
  }
  const colorNode = document.querySelectorAll("input[type=color]");
  colorNode.forEach(col => col.addEventListener('change', colorUpdate));
  idents(lbs.length);
  chooseOptions();
  document.getElementById("69").onchange = (() => UncheckAll('MyForm'));
  setTimeout(function () {
    window.dispatchEvent(new Event('resize'));
    document.getElementById("myForm").innerHTML = "<input type='file' accept='.csv' id='my_upload' name='my_upload'/><span id='FullFile'></span></b>"; // Resets input to be able to upload same file.
    document.querySelector('#FullFile').innerText = localStorage.getItem('Filename');
    startup(true);
  }, 500);
}

function lineStyles(sty, i) {
  const lineS = document.getElementById('LineStyles');
  const opt1 = document.createElement("option"), opt2 = document.createElement("option"), opt3 = document.createElement("option"), opt4 = document.createElement("option");
  sty[i] = document.createElement('select');
  opt1.text = "Solid"; opt2.text = "Dotted"; opt3.text = "Dashed"; opt4.text = "Dotdash";
  opt1.value = "null"; opt2.value = "[2,2]"; opt3.value = JSON.stringify(Dygraph.DASHED_LINE); opt4.value = JSON.stringify(Dygraph.DOT_DASH_LINE);
  sty[i].appendChild(opt1); sty[i].appendChild(opt2); sty[i].appendChild(opt3); sty[i].appendChild(opt4);
  sty[i].id = `csvlines${i}`;
  lineS.appendChild(sty[i]);
  sty[i].onchange = function () { styleMe(this, i + 1); };
}

function styleMe(e, i) {
  const ser = g3.getLabels()[i];
  g3.updateOptions({ series: { [ser]: { strokePattern: JSON.parse(e.value) } } })
}

let xaxis = document.getElementById('xaxis');
let yaxis = document.getElementById('yaxis');
xaxis.onblur = () => g3.updateOptions({ xlabel: xaxis.value });
yaxis.onblur = () => g3.updateOptions({ ylabel: yaxis.value });

function rgbToHex(rgb) {
  const col = rgb.split(/[,)(]/u);
  const ToHex = (c) => { const hex = c.toString(16); return hex.length === 1 ? `0${hex}` : hex; }
  return `#${ToHex(Number(col[1]))}${ToHex(Number(col[2]))}${ToHex(Number(col[3]))}`;
}

function change(el) {
  g3.setVisibility(el.id.split(' ')[1], el.checked);
}

function UncheckAll(elementID) {
  const _container = document.getElementById(elementID);
  const _chks = _container.getElementsByTagName("INPUT");
  const _numChks = _chks.length - 1;

  for (let i = 0; i < _numChks; i++) {

    if (_chks[0].checked === false) {
      _chks[i + 1].checked = false;
      g3.setVisibility(i);
    }
    else {
      _chks[i + 1].checked = true;
      g3.setVisibility(i, true);
    }
  }
}

function idents(len) {
  const labl = [];
  labl.push("boobs");
  for (let i = 0; i < len; i++) {
    const labd = document.getElementById(`csvlabel${i}`);
    const colors = document.getElementById(`csvcolor${i}`);
    const styles = document.getElementById(`csvlines${i}`);
    labl.push(labd.value);
    if (labd.value.length > 0) {
      labd.style.width = `${labd.value.length + 1}ch`;
      colors.style.width = `${Math.max(5.5, 3.5 + labd.value.length)}ch`;
      styles.style.width = `${Math.max(5.5, 3.5 + labd.value.length)}ch`;
    }
  }
  g3.updateOptions({
    labels: labl
  });
}

//below code was taken from <script src="https://dygraphs.com/src/extras/smooth-plotter.js"></script>
function getControlPoints(p0, p1, p2, opt_alpha, opt_allowFalseExtrema) {
  const alpha = (typeof opt_alpha !== "undefined") ? opt_alpha : 1 / 3;  // 0=no smoothing, 1=crazy smoothing
  const allowFalseExtrema = opt_allowFalseExtrema || false;

  if (!p2) {
    return [p1.x, p1.y, null, null];
  }

  // Step 1: Position the control points along each line segment.
  const l1x = (1 - alpha) * p1.x + alpha * p0.x;
  let l1y = (1 - alpha) * p1.y + alpha * p0.y;
  const r1x = (1 - alpha) * p1.x + alpha * p2.x;
  let r1y = (1 - alpha) * p1.y + alpha * p2.y;

  // Step 2: shift the points up so that p1 is on the l1–r1 line.
  if (l1x !== r1x) {
    // This can be derived w/ some basic algebra.
    const deltaY = p1.y - r1y - (p1.x - r1x) * (l1y - r1y) / (l1x - r1x);
    l1y += deltaY;
    r1y += deltaY;
  }

  // Step 3: correct to avoid false extrema.
  if (!allowFalseExtrema) {
    if (l1y > p0.y && l1y > p1.y) {
      l1y = Math.max(p0.y, p1.y);
      r1y = 2 * p1.y - l1y;
    } else if (l1y < p0.y && l1y < p1.y) {
      l1y = Math.min(p0.y, p1.y);
      r1y = 2 * p1.y - l1y;
    }

    if (r1y > p1.y && r1y > p2.y) {
      r1y = Math.max(p1.y, p2.y);
      l1y = 2 * p1.y - r1y;
    } else if (r1y < p1.y && r1y < p2.y) {
      r1y = Math.min(p1.y, p2.y);
      l1y = 2 * p1.y - r1y;
    }
  }

  return [l1x, l1y, r1x, r1y];
}

// i.e. is none of (null, undefined, NaN)
function isOK(x) {
  return Boolean(x) && !isNaN(x);
}

// A plotter which uses splines to create a smooth curve.
// Can be controlled via smoothPlotter.smoothing
function smoothPlotter(e) {
  const { drawingContext, points } = e;

  drawingContext.beginPath();
  drawingContext.moveTo(points[0].canvasx, points[0].canvasy);

  // right control point for previous point
  let lastRightX = points[0].canvasx, lastRightY = points[0].canvasy;

  for (let i = 1; i < points.length; i++) {
    let p0 = points[i - 1],
      p1 = points[i],
      p2 = points[i + 1];
    p0 = p0 && isOK(p0.canvasy) ? p0 : null;
    p1 = p1 && isOK(p1.canvasy) ? p1 : null;
    p2 = p2 && isOK(p2.canvasy) ? p2 : null;
    if (p0 && p1) {
      const controls = getControlPoints(
        { x: p0.canvasx, y: p0.canvasy },
        { x: p1.canvasx, y: p1.canvasy },
        p2 && { x: p2.canvasx, y: p2.canvasy },
        smoothPlotter.smoothing);
      lastRightX = (lastRightX !== null) ? lastRightX : p0.canvasx;
      lastRightY = (lastRightY !== null) ? lastRightY : p0.canvasy;
      drawingContext.bezierCurveTo(lastRightX, lastRightY,
        controls[0], controls[1],
        p1.canvasx, p1.canvasy);
      [, , lastRightX, lastRightY] = controls;
    } else if (p1) {
      // We're starting again after a missing point.
      drawingContext.moveTo(p1.canvasx, p1.canvasy);
      lastRightX = p1.canvasx;
      lastRightY = p1.canvasy;
    } else {
      lastRightX = lastRightY = null;
    }
  }
  drawingContext.stroke();
}

function findExtremes() {
  const extremeArr = []
  const file = g3.rolledSeries_;
  const labls = g3.getLabels();

  for (let i = 1; i < file.length; i++) {
    let max = 0, av = 0, min = Number.MAX_SAFE_INTEGER;
    for (let j = 0; j < file[1].length; j++) {
      max = Math.max(max, file[i][j][1]);
      min = Math.min(min, file[i][j][1]);
      av += Number(file[i][j][1]);
    }
    av = av / file[1].length;
    extremeArr.push([labls[i], smoothdec(min), smoothdec(av), smoothdec(max)])
  }
  table(extremeArr);
}

function table(rows) {
  const tabdiv = document.querySelector("#ExtremesTable");
  const myTable = document.createElement("table");
  myTable.classList.add("scores");
  const row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = "<th>Series</th>";
  row.insertCell(1).outerHTML = "<th>Min</th>";
  row.insertCell(2).outerHTML = "<th>Average</th>";
  row.insertCell(3).outerHTML = "<th>Max</th>";

  try {
    rows.forEach(arr => {
      const row = myTable.insertRow(-1);
      [row.insertCell(0).innerHTML, row.insertCell(1).innerHTML, row.insertCell(2).innerHTML, row.insertCell(3).innerHTML] = arr;
    });
  } catch (err) { addLoader(err, true); }

  while (tabdiv.childElementCount > 1) tabdiv.removeChild(tabdiv.lastChild);
  tabdiv.appendChild(myTable);
}

smoothPlotter.smoothing = 1 / 3;
smoothPlotter._getControlPoints = getControlPoints;  // for testing
window.smoothPlotter = smoothPlotter;
Dygraph.smoothPlotter = smoothPlotter;

//startup
startup();