function startup() {
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelector(`#addKick`).addEventListener(`click`, addKick);
  document.querySelector(`#undo`).addEventListener(`click`, undoKick);
  document.querySelector(`#Share`).addEventListener(`click`, share);
  document.querySelector(`#CloudForm`).addEventListener(`keydown`, enterLogin);
  const user = document.querySelector(`#email`);
  fireBase();
  kicker();
  if (user.value.length > 25 && !user.value.includes(`@`)) {
    getData(user.value);
  }
  fireAuth();
}

function kicker(func) {
  let datePick = document.querySelector(`#pastkick`);
  let date = new Date(datePick.value || new Date());
  let kicks = getKicks() || [];
  try {
    if (func === `add`) {
      kicks.push([date, 1]);
      datePick.value = ``;
      gaData(func);
    }
    else if (func === `undo`) kicks.pop();
  } catch (e) {  }
  localStorage.setItem(`kicks`, JSON.stringify(kicks));
  if (kicks.length < 1) return;
  daily(kicks);
  liveKicks(kicks);
  pattern(kicks);
  averageTable();
  if (firebase.auth().currentUser) sendData();
}

const addKick = () => kicker(`add`);
const undoKick = (e) => {
  kicker(`undo`);
  gaData(`undo`);
  e.target.style = "display:none";
  setTimeout(function () {
    e.target.style = "display:block";
  }, 1000);
};

function getKicks() {
  let kicks = localStorage.getItem(`kicks`);
  return JSON.parse(kicks);
}

function daily(kicks) {
  let dailyObj = {}, count;
  kicks.forEach(kick => {
    let date = new Date(kick[0]);
    let day = smoothDate(date);
    count = dailyObj[day] + 1 || 1;
    dailyObj[day] = count;
  });
  try {
    g1.destroy();
  } catch (e) { }
  let dailyKicks = Object.keys(dailyObj).map((key) => [new Date(key), dailyObj[key]]);
  dygPlot(dailyKicks, `graphdiv1`, `g1`);
  window[`days`] = dailyKicks.length;
  let kickCount = dailyKicks.map(arr => arr[1]);
  let kickAverage = Math.round(kickCount.reduce((acc, val) => (acc + val)) / dailyKicks.length);
  localStorage.setItem(`kickAverage`, kickAverage);
}

function liveKicks(kicks) {
  try {
    g2.destroy();
  } catch (e) { }
  kicks = kicks.map(kick => [new Date(kick[0]), kick[1]]);
  dygPlot(kicks, `graphdiv2`, `g2`);
  let kickTime = kicks.map(arr => arr[0]);
  kickTime.sort((a, b) => new Date(a) - new Date(b));
  let totAv = 0, fiveAv = 0;
  let length = kicks.length;
  for (let i = 1; i < kicks.length; i++) {
    let timeDiff = Math.abs(kickTime[i] - kickTime[i - 1]);
    if (timeDiff <= 1000 * 60 * 60 * 4) fiveAv += timeDiff; //ignore if over 4 hours
    else length--;
    totAv += timeDiff;
  }
  fiveAv = fiveAv / length;
  totAv = totAv / kicks.length;
  let averageTime = JSON.stringify({ totAv: timeString(totAv), fiveAv: timeString(fiveAv) });
  localStorage.setItem(`averageTime`, averageTime);
}

function pattern(kicks) {
  let dailyObj = {}, count;
  kicks.forEach(kick => {
    let date = new Date(kick[0]);
    let time = date.getHours();
    count = dailyObj[time] + 1 || 1;
    dailyObj[time] = count;
  });
  try {
    g3.destroy();
  } catch (e) { }
  let dailyKicks = Object.keys(dailyObj).map((key) => [Number(key), dailyObj[key] / days]);
  dygPlot(dailyKicks, `graphdiv3`, `g3`);
}

function dygPlot(kicks, div, g) {
  if (kicks.length < 1) return;
  Dygraph.defaultInteractionModel.touchend = Dygraph.defaultInteractionModel.touchmove = Dygraph.defaultInteractionModel.touchstart = function () { };
  window[g] = new Dygraph(
    document.getElementById(div),
    kicks.sort((a, b) => new Date(a) - new Date(b)),
    {
      xlabel: "Time",
      ylabel: "Kicks",
      labels: ['a', 'Kicks'],
      includeZero: true,
      plotter: barChartPlotter,
      axes: {
        x: {
          axisLabelFormatter: function (y, gran, opts) {
            return y instanceof Date ? Dygraph.dateAxisLabelFormatter(y, gran, opts) : `${smoothdec(y, 0)}:00`;
          },
        },
        y: {
          axisLabelFormatter: function (y) {
            return smoothdec(y);
          },
        },
      }
    }          // options
  );
  window[g].ready(dygReady);
}

function dygReady() {
  try {
    if (typeof g2 !== 'undefined') zoom(86400);
  } catch (e) {  }
  setTimeout(function () {
    window.dispatchEvent(new Event('resize'));
  }, 500);
}

// This function draws bars for a single series. See
// multiColumnBarPlotter below for a plotter which can draw multi-series
// bar charts.
function barChartPlotter(e) {
  var ctx = e.drawingContext;
  var points = e.points;
  var y_bottom = e.dygraph.toDomYCoord(0);

  ctx.fillStyle = darkenColor(e.color);

  // Find the minimum separation between x-values.
  // This determines the bar width.
  var min_sep = Infinity;
  for (var i = 1; i < points.length; i++) {
    var sep = points[i].canvasx - points[i - 1].canvasx;
    if (sep < min_sep) min_sep = sep;
  }
  var bar_width = Math.floor(2.0 / 3 * min_sep);

  // Do the actual plotting2.
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var center_x = p.canvasx;

    ctx.fillRect(center_x - bar_width / 2, p.canvasy,
      bar_width, y_bottom - p.canvasy);

    ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
      bar_width, y_bottom - p.canvasy);
  }
}

// Darken a color
function darkenColor(colorStr) {
  // Defined in dygraph-utils.js
  var color = Dygraph.toRGB_(colorStr);
  color.r = Math.floor((255 + color.r) / 2);
  color.g = Math.floor((255 + color.g) / 2);
  color.b = Math.floor((255 + color.b) / 2);
  return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}

var desired_range = null;
function approach_range() {
  if (!desired_range) return;
  // go halfway there

  try {
    var range = g2.xAxisRange();
    if (Math.abs(desired_range[0] - range[0]) < 60 &&
      Math.abs(desired_range[1] - range[1]) < 60) {
      g2.updateOptions({ dateWindow: desired_range });
      // (do not set another timeout.)
    } else {
      var new_range;
      new_range = [0.5 * (desired_range[0] + range[0]),
      0.5 * (desired_range[1] + range[1])];
      g2.updateOptions({ dateWindow: new_range });
      animate();
    }
  } catch (e) {  }
}

const animate = function () {
  setTimeout(approach_range, 50);
};

const zoom = function (res) {
  var w = g2.xAxisRange();
  let ran = smoothDate(new Date(w[1])).getTime();
  desired_range = [ran, ran + res * 1000];
  animate();
};

const smoothDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const pan = function (dir) {
  var w = g2.xAxisRange();
  var scale = w[1] - w[0];
  var amount = scale * dir;
  desired_range = [w[0] + amount, w[1] + amount];
  animate();
};

function reset() {
  g2.updateOptions({
    dateWindow: null,
    valueRange: null
  });
}

async function share() {
  let dbName = firebase.auth().currentUser.uid;
  let link = `${window.location.protocol}//${window.location.host + window.location.pathname}?email=${dbName}`;
  const shareData = {
    title: `BabyKicks`,
    text: `Check out the baby's routine!`,
    url: link
  };
  sendData();
  try {
    await navigator.share(shareData);
  } catch (err) {
    
  }
}

//Firebase
function fireBase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCWxDunokGSB_bw0-jnq2rrEHGqlz79aj0",
    authDomain: "baby-kicks-8012b.firebaseapp.com",
    projectId: "baby-kicks-8012b",
    storageBucket: "baby-kicks-8012b.appspot.com",
    messagingSenderId: "899065769282",
    appId: "1:899065769282:web:4fbf6bc264b93f8e846cdb",
    measurementId: "G-M3B1WLBLVT"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
};

function getData(dbName) {
  let dbObj = firebase.database().ref().child(dbName);
  dbObj.on(`value`, snap => {
    let data = JSON.stringify(snap.val());
    localStorage.setItem(`kicks`, data);
    kicker();
  });
}

function sendData() {
  dbName = firebase.auth().currentUser.uid;
  let dbObj = firebase.database().ref().child(dbName);
  dbObj.set(getKicks());
}

function fireAuth() {
  document.querySelector(`#Logout`).addEventListener(`click`, () => firebase.auth().signOut());
  document.querySelector(`#Login`).addEventListener(`click`, doLogin);
  firebase.auth().onAuthStateChanged(loginState);
}

function resetPass() {
  const auth = firebase.auth();
  const user = document.querySelector(`#email`).value;
  auth.sendPasswordResetEmail(user).then(() => {
    document.querySelector(`#logInfo`).innerHTML = `Email sent`;
    fader();
  }).catch(e => {
    document.querySelector(`#logInfo`).innerHTML = e;
    fader();
  });
}

function loginState(user) {
  const logout = document.querySelector(`#Logout`);
  const login = document.querySelector(`#Login`);
  const form = document.querySelector(`#CloudForm`);
  const share = document.querySelector(`#Share`);
  if (user) {
    login.style = `display: none`;
    logout.style = `display: block`;
    share.style = `display: block`;
    form.style = `visibility: hidden`;
    getData(firebase.auth().currentUser.uid);
  }
  else {
    login.style = `display: block`;
    logout.style = `display: none`;
    share.style = `display: none`;
    form.style = `visibility: visible`;
  }
}

function doLogin() {
  const auth = firebase.auth();
  const user = document.querySelector(`#email`).value;
  const pass = document.querySelector(`input[type=password]`).value;
  const promise = auth.signInWithEmailAndPassword(user, pass);
  promise.catch(e => {
    document.querySelector(`#logInfo`).innerHTML = e;
    fader();
    auth.createUserWithEmailAndPassword(user, pass);
  });
}

function enterLogin(e) {
  var keyCode = e.which || e.keyCode;
  var handled = false;
  if (keyCode === 13) { //enter
    e.preventDefault();
    handled = true;
    doLogin();
  }
  return !handled; //return false if the event was handled  
}

function fader() {
  _(`#logInfo`).fade(`in`, 200);
  setTimeout(function () {
    _(`#logInfo`).fade(`out`, 500);
    return false;
  }, 3000);
}

function timeString(time) {
  let sec = Math.floor(time / 1000);
  let min = Math.floor(sec / 60);
  let h = Math.floor(min / 60);
  let days = Math.floor(h / 24);

  let string = days >= 1 ? `${days} days ${h % 24} h ${min % 60} mins`
    : h >= 1 ? ` ${h} h ${min % 60} mins`
      : min >= 1 ? `${min} mins`
        : `${sec}s`;
  return string;
}

function averageTable() {
  const table = document.querySelector(`table`);
  while (table.firstElementChild.childElementCount > 2) { //don't remove the firstborn children
    table.firstElementChild.removeChild(table.firstElementChild.lastChild);
  }
  let row = table.insertRow(-1);
  let kickAverage = getSavedValue(`kickAverage`);
  let { totAv, fiveAv } = JSON.parse(getSavedValue(`averageTime`));
  row.insertCell(0).innerHTML = `${kickAverage} kicks`;
  row.insertCell(1).innerHTML = totAv;
  row.insertCell(2).innerHTML = fiveAv;
}

function gaData(func) {
  try {
    dataLayer.push({
      'event': 'baby_kick',
      type: func
    });
  } catch (err) { logError(err); }
}

startup();
