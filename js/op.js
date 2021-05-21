function startup() {
  fireBase();
  getModDates();
  document.getElementById("SEAR").value = getSavedValue("SEAR");    // set the value to this input
  document.getElementById("PASS").value = getSavedValue("PASS");    // set the value to this input
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) == "true");
  });
  const radios = document.querySelector('input[name]:checked');
  if (!radios) document.querySelector(`#Del`).checked = true;
  fireAuth();
}

function getModDates() {
  let dbObj = firebase.database().ref(`op`);
  dbObj.on(`value`, snap => {
    let dates = snap.val();
    let { lastmod, lastmodassets } = dates;
    document.getElementById("p").textContent = `Asset Reg Last Updated:  ${new Date(lastmodassets)}`;
    document.getElementById("pp").textContent = `Warehouse Last Updated:  ${new Date(lastmod)}`;
    let refreshOP = new Date(lastmod) > new Date(getSavedValue(`lastmod`));
    localStorage.setItem(`refreshOP`, refreshOP);
    localStorage.setItem(`lastmod`, lastmod);
    delivery();
  });
}

function waitForAll() {
  return Promise.all([
    fireFetch(`op/assets-Asset List.csv`),
    fireFetch(`op/op-Project Stock.csv`),
    fireFetch(`op/op-Warehouse Stock .csv`),
    fireFetch(`op/op-Delivery.csv`)
  ]);
}

async function delivery() {
  // await code here
  await waitForAll();
  // code below here will only execute when await fetch() finished loading
  ifsy();
  listeners();
}

function listeners() {
  document.onkeyup = function () {
    ifsy();
  };
  document.onchange = function () {
    ifsy();
  };
}

function splicer(arr, file) {
  let str = file.includes(`set`) ? `asset`
    : file.includes(`Ware`) ? `location` : `date`;
  let col = file.includes(`Proj`) ? 5
    : file.includes(`Ware`) ? 7 : 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][col] == "" || new RegExp(str, "iu").test(arr[i][col]) || new RegExp("undefined", "iu").test(arr[i][col])) {
      arr.splice(i, 1);
      i--;
    }
  }
}

function ifsy() {
  let file = document.querySelector('input[name]:checked').className;
  let data = getSavedValue(file);
  data = file.includes(`Ware`) ? Papa.parse(data).data : Papa.parse(data).data.reverse();
  splicer(data, file);
  search(data);
}

function search(arrheh) {
  var pn = document.getElementById("SEAR").value;
  pn = pn.toLowerCase().split(" ");
  var myArray = arrheh;
  myArray = myArray.map(e => e.join(','));//remove undefined row
  var npr = myArray.length; //number of rows
  var sArray = [];
  for (var i = 0; i < npr; i++) {
    if (typeof myArray[i][8] === "undefined") {
      myArray[i][8] = "";
    }//search
  }

  //fix the headaches when creating a new RegExp
  RegExp.quote = function (str) {
    return str.replace(/[.*+\-?^${}()[\]\\]/gu, "\\$1");
  };

  sArray = myArray.filter(s => pn.every(v => s.toLowerCase().includes(v)))
    .map(e => {
      if (pn[0].length > 0) e = e.replace(new RegExp(RegExp.quote(pn.join('|')), 'giu'), x => `<mark>${x}</mark>`);
      return e.split(',');
    });

  let myTable = document.getElementById("Del").checked
    ? searchDel(sArray)
    : document.getElementById("AReg").checked
      ? searchAsset(sArray)
      : searchOther(sArray);

  myTable += "</table>";
  document.getElementById('tab').innerHTML = myTable;
}

function searchAsset(sArray) {
  let myTable = `<table class="orionPark">
    <tr><th>Description</th>
    <th>ID</th>
    <th>Purchase Date</th>
    <th>Price</th>
    <th>Supplier</th>
    <th>Comment</th></tr>`;
  for (let i = 0; i < Math.min(50, sArray.length); i++) {
    myTable += `<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][3]}</td>
      <td>${sArray[i][4]}</td>
      <td>${sArray[i][5]}</td>
      <td>${sArray[i][6]}</td></tr>`;
  }
  return myTable;
}

function searchDel(sArray) {
  let myTable = `<table class="orionPark">
    <tr><th>Date</th>
    <th>Time</th>
    <th>Supplier</th>
    <th>Comments</th>
    <th>Project</th>
    <th>PO #</th></tr>`;
  for (let i = 0; i < Math.min(50, sArray.length); i++) {
    let len = sArray[i][8].includes(`</`) ? 16 : 3;
    let shifty = sArray[i][8].length > len;
    let comm = shifty ? `${sArray[i][7]} ${sArray[i][8]}` : sArray[i][7];
    let proj = shifty ? `` : sArray[i][8].substring(0, len);
    myTable += `<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][4]}</td>
      <td>${comm}</td>
      <td>${proj}</td>
      <td>${sArray[i][9]}</td></tr>`;
  }
  return myTable;
}

function searchOther(sArray) {
  let myTable = `<table class="orionPark">
    <tr><th>Part #</th>
    <th>Description</th>
    <th>Quantity</th>
    <th>Date</th>
    <th>Location</th>
    <th>Comment</th></tr>`;
  for (let i = 0; i < Math.min(200, sArray.length); i++) {
    myTable += `<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][2]}</td>
      <td>${sArray[i][5]}</td>
      <td>${sArray[i][7]}</td>
      <td>${sArray[i][8]}</td></tr>`;
  }
  return myTable;
}

async function fireFetch(file) {
  let refreshOP = getSavedValue(`refreshOP`) === `true`;
  let data = localStorage.getItem(file);
  if (!refreshOP && data !== null) return;

  const storage = firebase.storage();
  let pathReference = storage.ref(file);
  data = await pathReference.getDownloadURL()
    .then(async (url) => {
      return await fetch(url).then(result => result.text());
    });
  localStorage.setItem(file, data);
  return;
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

function fireAuth() {
  document.querySelector(`#Logout`).addEventListener(`click`, () => firebase.auth().signOut());
  document.querySelector(`#Login`).addEventListener(`click`, doLogin);
  document.querySelector(`#PASS`).addEventListener(`keydown`, enterLogin);
  firebase.auth().onAuthStateChanged(loginState);
}

function loginState(user) {
  const logout = document.querySelector(`#Logout`);
  const login = document.querySelector(`#Login`);
  const pass = document.querySelector(`#PASS`);
  if (user) {
    login.style = `display: none`;
    pass.style = `display: none`;
    logout.style = `display: block`;
    document.querySelector(`#logInfo`).innerHTML = ``;
    delivery();
  }
  else {
    login.style = `display: block`;
    pass.style = `display: block`;
    logout.style = `display: none`;
  }
}

function doLogin() {
  const auth = firebase.auth();
  const user = `a@b.com`;
  const pass = document.querySelector(`input[type=password]`).value;
  const promise = auth.signInWithEmailAndPassword(user, pass);
  promise.catch(e => {
    document.querySelector(`#logInfo`).innerHTML = e;
  });
}

//startup
startup();