"use strict";
//Toggle Dark Mode
(function () {
  //Add toggle to page
  const switchLabel = document.createElement('label');
  const toggLabel = document.createElement('label');
  const checkBox = document.createElement('input');
  const spanny = document.createElement('span');
  switchLabel.classList.add('switch');
  checkBox.id = "DarkToggle";
  checkBox.type = "checkbox";
  spanny.classList.add('slider', 'round');
  toggLabel.innerText = "Dark Mode";
  toggLabel.classList.add('toggLabel');
  toggLabel.htmlFor = "DarkToggle";
  switchLabel.appendChild(checkBox);
  switchLabel.appendChild(spanny);
  document.querySelector("#header").appendChild(switchLabel);
  document.querySelector("#header").appendChild(toggLabel);

  // Use matchMedia to check the user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const darkToggle = document.querySelector("#DarkToggle");

  //Toggle to change mode manually
  darkToggle.addEventListener('change', function() {toggleDarkTheme(darkToggle.checked); saveCheckbox(this);});

  toggleDarkTheme(prefersDark.matches && (getSavedValue(darkToggle.id) != "false"));
  if (getSavedValue(darkToggle.id) == "true") toggleDarkTheme(true); //iif statement as it would turn off if false
  //if ((prefersDark.matches || (getSavedValue(darkToggle.id) == "true")) && !darkToggle.checked) darkToggle.click();

  // Listen for changes to the prefers-color-scheme media query
  prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

  // Add or remove the "dark" class based on if the media query matches
  function toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark', shouldAdd);
    darkToggle.checked = shouldAdd;
  }

})();

function toggleNav(e) {
  const x = document.getElementById("myTopnav");
  try{
    if (e.target.parentElement.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }catch(err) {x.className = "topnav"}
}
document.addEventListener('click',toggleNav);

function navBar(){
  const navbar = document.querySelector('#myTopnav');
    navbar.innerHTML =`
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
          <a href='csv.html'>CSV Plotter</a>
          <a href='relay.html'>Distance Protection Fault Plotter</a>
          <a href='earth.html'>Earthing Calculation Tools</a>
          <a href='soil.html'>Earthing Surveys</a>
          <a href='tools.html'>Electrical Engineering Tools</a>
          <a href='emc.html'>EMC Calculations</a>
          <a href='mortgage.html'>Loan Calculator</a>
          <a href='fault.html'>Railway Faults</a>
        </div>
      </div>
      <a href='op.html'>Orion Park</a>
      <a href='javascript:helpPage()'>Help</a>
    `;
  document.querySelectorAll('.heh').forEach(function(item) {return item.addEventListener('click',randomPage)});
}

function helpPage(){
  let hashy = location.pathname.split(".")[0].split("/");
  hashy=hashy[hashy.length-1];
  location = `help.html#${hashy}`;
}

navBar();
let test;
const navs = ['Games','Tools'];
const randomChild = function(len) {return Math.floor(Math.random()*len)};
function randomPage(e) {
  test = e;
  if (navs.some(function(nav) {return e.target.innerHTML.includes(nav)})){
    let nodeLen = randomChild(e.target.parentElement.children[1].querySelectorAll('a').length)
    e.target.parentElement.children[1].querySelectorAll('a')[nodeLen].click();
  }
  else return;
}

if ("serviceWorker" in navigator) {
  //Adds manifest and stuff
  let head = document.head;
  let mani = document.createElement("link"), apple = document.createElement("link"), theme = document.createElement("meta");
  mani.rel = "manifest"; apple.rel = "apple-touch-icon"; theme.name = "theme-color";
  mani.href = "manifest.json"; apple.href = "images/apple-icon-180.png"; theme.content = "#800080";
  head.appendChild(mani); head.appendChild(apple); head.appendChild(theme);

  //Makes website available offline
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("sw.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));

    let deferredPrompt;
    let body = document.querySelector("#main");
    let btn = document.createElement("button");
    btn.classList.add("add-button","button");
    btn.innerText = "Add to home screen";
    body.appendChild(btn);
    const addBtn = document.querySelector('.add-button');
    addBtn.style.display = 'none';

    //Enable Progressive Web Apps on supported desktop browsers
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI to notify the user they can add to home screen
      addBtn.style.display = 'block';

      addBtn.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
        });
      });
    });
  })
}

//function to resize plot and copy to clipboard
function clippy (x,y) {
  let offset = document.querySelector('#graphdiv3').offsetTop;
  document.querySelector('#graphdiv3').setAttribute(`style`, `height:${y}px !important; width:${x}px !important; max-height:${y}px; max-width:${x}px;`);
  window.dispatchEvent(new Event('resize'));
  for (var j = 0; j < 3; j++) {  //weird way to make it actually work
    html2canvas(document.querySelector("#graphdiv3"), {
      y: offset,
      //scrollY: -window.scrollY,
      scrollX:0,
      scrollY:0,
      height: y+17,
      width: x+10,
    }).then(canvas => {
      if (typeof(navigator.clipboard)!='undefined'){
        canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]));
      }
      else{
        document.querySelector("#graphdiv3").innerHTML='';
        document.querySelector("#graphdiv3").appendChild(canvas);
      }
    });
  }
  if (typeof(navigator.clipboard)=='undefined') {
    let htmltext = (navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes("Edg")) ? "<br><br><a href=chrome://flags/#unsafely-treat-insecure-origin-as-secure>Auto copy to clipboard not supported in http. Copy this link and open in new tab to add this site as trusted to enable.</a>" : "<br><br><a>Auto copy to clipboard not supported. Right click plot and copy as image.</a>";
    let article = document.querySelector('article');
    if (article.lastChild.nodeName != "A") article.innerHTML+=htmltext;
  }
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e){
  var id = e.id;  // get the sender's id to save it .
  var val = e.value; // get the value.
  localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override .

  let url ='';
  let params = {};
  document.querySelectorAll('input').forEach((element) => {
    if (element.value.length > 0) params[element.id] = element.value;
  });
  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  url += '?' + query;

  let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + url;
  window.history.pushState({ path: newurl }, '', newurl);
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveRadio(e){
  e.checkbox = true;
  document.querySelectorAll('input[type="radio"]').forEach(rad => localStorage.setItem(rad.id,rad.checked));
  document.querySelectorAll('input[type="checkbox"]').forEach(rad => localStorage.setItem(rad.id,rad.checked));
}
function saveCheckbox(e){
  e.checkbox = true;
  document.querySelectorAll('input[type="checkbox"]').forEach(rad => localStorage.setItem(rad.id,rad.checked));
}

//get the saved value function - return the value of "v" from localStorage.
function getSavedValue  (v){
  if (!localStorage.getItem(v)) {
    return "";// You can change this to your defualt value.
  }
  return localStorage.getItem(v);
}

function change(el) {
  g3.setVisibility(el.id, el.checked);
}

function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };
  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }
  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

window.post = function(url, data, sucPost) {
  return fetch(url, {method: "POST", body: JSON.stringify(data)})
  .then(response => response.text())
  .then(sucPost)
  .catch((error) => {
    console.log('Error:', data);
  });
}

//fade in and fadeout
function _(el) {
  if (!(this instanceof _)) {
    return new _(el);
  }
  this.el = document.querySelector(el);
}

_.prototype.fade = function fade(type, ms) {
  var isIn = type === 'in',
    opacity = isIn ? 0 : 1,
    interval = 50,
    duration = ms,
    gap = interval / duration,
    self = this;

  if(isIn) {
    self.el.style.display = 'inline';
    self.el.style.opacity = opacity;
  }

  function func() {
    opacity = isIn ? opacity + gap : opacity - gap;
    self.el.style.opacity = opacity;

    if(opacity <= 0) self.el.style.display = 'none'
    if(opacity <= 0 || opacity >= 1) window.clearInterval(fading);
  }
  var fading = window.setInterval(func, interval);
}

document.documentElement.setAttribute('lang', navigator.language); //add language to html