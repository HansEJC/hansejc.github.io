"use strict";
(new URL(document.location)).searchParams.forEach((x, y) => {
  localStorage.setItem(y, x);
});
//Toggle Dark Mode
(function () {
  //Add toggle to page
  const switchLabel = document.createElement('label');
  const toggLabel = document.createElement('div');
  const checkBox = document.createElement('input');
  const spanny = document.createElement('span');
  switchLabel.classList.add('switch');
  checkBox.id = "DarkToggle";
  checkBox.type = "checkbox";
  spanny.classList.add('slider', 'round');
  toggLabel.innerText = "Dark Mode";
  toggLabel.classList.add('toggLabel');
  switchLabel.htmlFor = "DarkToggle";
  switchLabel.appendChild(checkBox);
  switchLabel.appendChild(spanny);
  document.querySelector("#header").appendChild(switchLabel);
  document.querySelector("#header").appendChild(toggLabel);

  // Use matchMedia to check the user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const darkToggle = document.querySelector("#DarkToggle");

  //Toggle to change mode manually
  darkToggle.addEventListener('change', function () { toggleDarkTheme(darkToggle.checked); saveCheckbox(this); });

  toggleDarkTheme(prefersDark.matches && (getSavedValue(darkToggle.id) !== "false"));
  if (getSavedValue(darkToggle.id) === "true") toggleDarkTheme(true); //iif statement as it would turn off if false
  //if ((prefersDark.matches || (getSavedValue(darkToggle.id) === "true")) && !darkToggle.checked) darkToggle.click();

  // Listen for changes to the prefers-color-scheme media query
  prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

  // Add or remove the "dark" class based on if the media query matches
  function toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark', shouldAdd);
    darkToggle.checked = shouldAdd;
  }
}());

function toggleNav(e) {
  const x = document.getElementById("myTopnav");
  try {
    if (e.target.parentElement.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  } catch (err) { x.className = "topnav" }
}
document.addEventListener('click', toggleNav);

function navBar() {
  const navbar = document.querySelector('#myTopnav');
  navbar.innerHTML = `
      <a href="#" style="font-size:15px;" class="icon">&#9776;</a>
      <div class="dropdown">
        <a href='#' class="dropbtn heh">Games</a>
        <div class="dropdown-content">
          <a href='dobble.html'>Dobble</a>
          <a href='memory.html'>Simon</a>
          <a href='index.html'>TRex</a>
          <a href='tictactoe.html'>TicTacToe</a>
          <a href='mole.html'>Whack a Mole</a>
        </div>
      </div>
      <div class="dropdown">
        <a href='#' class="dropbtn heh">Tools</a>
        <div class="dropdown-content">
          <a href='circuit.html'>Circuit Simulator</a>
          <a href='csv.html'>CSV Plotter</a>
          <a href='earth.html'>Earthing Calculation Tools</a>
          <a href='soil.html'>Earthing Surveys</a>
          <a href='tools.html'>Electrical Engineering Tools</a>
          <a href='emc.html'>EMC Calculations</a>
          <a href='hvcalc.html'>HV Cable Calculations</a>
          <a href='lvcalc.html'>LV Cable Calculations</a>
          <a href='mortgage.html'>Loan Calculator</a>
        </div>
      </div>
      <div class="dropdown">
        <a href='#' class="dropbtn heh">Railway</a>
        <div class="dropdown-content">
          <a href='relay.html'>Distance Protection Fault Plotter</a>
          <a href='fault.html'>Railway Faults</a>
          <a href='railvolts.html'>Railway Voltages</a>
        </div>
      </div>
      <a href='op.html'>Orion Park</a>
      <a href='javascript:helpPage()'>Help</a>
    `;
  document.querySelectorAll('.heh').forEach(function (item) { return item.addEventListener('click', randomPage) });
}

function helpPage() {
  let hashy = location.pathname.split(".")[0].split("/");
  hashy = hashy[hashy.length - 1];
  location = `help.html#${hashy}`;
}

navBar();
let test;
const navs = ['Games', 'Tools', 'Railway'];
const randomChild = function (len) { return Math.floor(Math.random() * len) };
function randomPage(e) {
  test = e;
  if (navs.some(function (nav) { return e.target.innerHTML.includes(nav) })) {
    const nodeLen = randomChild(e.target.parentElement.children[1].querySelectorAll('a').length)
    e.target.parentElement.children[1].querySelectorAll('a')[nodeLen].click();
  }
  else return;
}

if ("serviceWorker" in navigator) {
  //Adds manifest and stuff
  const { head } = document;
  const mani = document.createElement("link"), apple = document.createElement("link"), theme = document.createElement("meta");
  mani.rel = "manifest"; apple.rel = "apple-touch-icon"; theme.name = "theme-color";
  mani.href = "manifest.json"; apple.href = "images/apple-icon-180.png"; theme.content = "#800080";
  head.appendChild(mani); head.appendChild(apple); head.appendChild(theme);

  //Makes website available offline
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js");
  });
}

//function to resize plot and copy to clipboard
function clippy(x, y, div = `#graphdiv3`) {
  document.querySelector(div).setAttribute(`style`, `height:${y}px !important; width:${x}px !important; max-height:${y}px; max-width:${x}px;`);
  window.dispatchEvent(new Event('resize'));
  const extra = div === `#graphdiv3` ? 10 : 15;
  html2canvas(document.querySelector(div), {
    x: -extra,
    height: y + 10,
    width: x + extra,
  }).then(canvas => {
    if (typeof (navigator.clipboard) !== 'undefined') {
      canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
    }
    else {
      document.querySelector(div).innerHTML = '';
      document.querySelector(div).appendChild(canvas);
    }
  });
}
if (typeof (navigator.clipboard) === 'undefined') {
  const htmltext = (navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes("Edg")) ? "<br><br><a href=chrome://flags/#unsafely-treat-insecure-origin-as-secure>Auto copy to clipboard not supported in http. Copy this link and open in new tab to add this site as trusted to enable.</a>" : "<br><br><a>Auto copy to clipboard not supported. Right click plot and copy as image.</a>";
  const article = document.querySelector('article');
  if (article.lastChild.nodeName !== "A") article.innerHTML += htmltext;
}


//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e) {
  const { id, value } = e;  // get the sender's id to save it .
  localStorage.setItem(id, value);// Every time user writing something, the localStorage's value will override .
  saveParameter();
}

function saveParameter() {
  let url = '';
  const params = {};
  document.querySelectorAll('input').forEach((el) => {
    if (el.value.length > 0) params[el.id] = el.value;
    if (el.type === `checkbox` || el.type === `radio`) params[el.id] = el.checked;
  });
  document.querySelectorAll('select').forEach((select) => params[select.id] = select.value);
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
  url += `?${query}`;
  const newurl = `${window.location.protocol}//${window.location.host + window.location.pathname + url}`;
  window.history.pushState({ path: newurl }, '', newurl);
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveRadio(e) {
  e.checkbox = true;
  document.querySelectorAll('input[type="radio"]').forEach(rad => localStorage.setItem(rad.id, rad.checked));
  document.querySelectorAll('input[type="checkbox"]').forEach(rad => localStorage.setItem(rad.id, rad.checked));
  saveParameter();
}
function saveCheckbox(e) {
  e.checkbox = true;
  document.querySelectorAll('input[type="checkbox"]').forEach(rad => localStorage.setItem(rad.id, rad.checked));
  saveParameter();
}

function funkyRadio() {
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) === "true");
    rad.addEventListener('change', saveRadio);
  });
}

//get the saved value function - return the value of "v" from localStorage.
function getSavedValue(v) {
  if (!localStorage.getItem(v)) {
    return "";// You can change this to your defualt value.
  }
  return localStorage.getItem(v);
}

function change(el) {
  g3.setVisibility(el.id, el.checked);
}

function exportToCsv(filename, rows) {
  const processRow = function (row) {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      let result = innerValue.replace(/"/gu, '""');
      if (result.search(/("|,|\n)/gu) >= 0)
        result = `"${result}"`;
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return `${finalVal}\n`;
  };
  let csvFile = '';
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }
  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (typeof link.download !== `undefined`) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function dbUpgrade(db) {
  const onupgradeneeded = function (e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains("plots")) {
      db.createObjectStore("plots", { keyPath: "id", autoIncrement: true });
    }
  }
  return onupgradeneeded;
}

const post = function (url, data, sucPost) {
  return fetch(url, { method: "POST", body: JSON.stringify(data) })
    .then(response => response.text())
    .then(sucPost)
    .catch((error) => {
      logError(error);
    });
};

//fade in and fadeout
function _(el) {
  if (!(this instanceof _)) {
    return new _(el);
  }
  this.el = document.querySelector(el);
}

_.prototype.fade = function fade(type, ms) {
  const isIn = type === 'in',
    interval = 50,
    duration = ms,
    self = this,
    gap = interval / duration;
  let opacity = isIn ? 0 : 1;

  if (isIn) {
    self.el.style.display = 'inline';
    self.el.style.opacity = opacity;
  }

  function func() {
    opacity = isIn ? opacity + gap : opacity - gap;
    self.el.style.opacity = opacity;

    if (opacity <= 0) self.el.style.display = 'none'
    if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
  }
  const fading = window.setInterval(func, interval);
};

//Firebase
function fireBase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDCkBJF86uahqeTdIiy_zotYBD5-1aJ1TE",
    authDomain: "hansejc-fff7f.firebaseapp.com",
    databaseURL: "https://hansejc-fff7f-default-rtdb.firebaseio.com",
    projectId: "hansejc-fff7f",
    storageBucket: "hansejc-fff7f.appspot.com",
    messagingSenderId: "204800601174",
    appId: "1:204800601174:web:1b9f5d4804a94171471ff7",
    measurementId: "G-7DCTFGC4YP"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
};

function logError(err) {
  const div = document.createElement('div');
  const errdiv = document.getElementById("copyright");
  document.querySelectorAll("#error").forEach(x => x.parentNode.removeChild(x));
  errdiv.insertBefore(div, errdiv.lastChild);
  div.innerHTML = `<center>${err}</center>`;
  div.id = "error";
  _('#error').fade('in', 300);
  setTimeout(() => {
    _('#error').fade('out', 1000);
  }, 3000);
}

const smoothdec = (a, b = 2) => Number(parseFloat(a).toFixed(b)); //fix broken decimals
//const readCookie = (name) => (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''); //changed to use localstorage instead

document.documentElement.setAttribute('lang', navigator.language); //add language to html