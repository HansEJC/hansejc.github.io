function startup() {
  fireBase();
  getModDates();
  document.getElementById("SEAR").value = getSavedValue("SEAR");    // set the value to this input
  document.getElementById("PASS").value = getSavedValue("PASS");    // set the value to this input
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) == "true");
  });
  fireAuth();
}

function getModDates() {
  let dbObj = firebase.database().ref(`op`);
  dbObj.on(`value`, snap => {
    let dates = snap.val();
    let { lastmod, lastfetch } = dates;
    document.getElementById("p").textContent = `Last Updated: ${new Date(lastmod)}`;
    document.getElementById("pp").textContent = `Last Checked: ${new Date(lastfetch)}`;
    let refreshOP = new Date(lastmod) > new Date(getSavedValue(`lastmod`));
    localStorage.setItem(`refreshOP`, refreshOP);
    localStorage.setItem(`lastmod`, lastmod);
    if (refreshOP) delivery();
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
  let [ARegcsv, DRpcsv, DRwcsv, DRcsv] = await waitForAll();
  // code below here will only execute when await fetch() finished loading
  AReg = Papa.parse(ARegcsv).data.reverse();
  DRp = Papa.parse(DRpcsv).data.reverse();
  DRw = Papa.parse(DRwcsv).data;
  DR = Papa.parse(DRcsv).data.reverse();
  splicer(AReg, `asset`, 0);
  splicer(DRp, `date`, 5);
  splicer(DRw, `location`, 7);
  splicer(DR, `date`, 0);
  ifsy(AReg, DRp, DRw, DR);
  listeners();
}

function listeners() {
  document.onkeyup = function () {
    ifsy(AReg, DRp, DRw, DR);
  };
  document.onchange = function () {
    ifsy(AReg, DRp, DRw, DR);
  };
}

function splicer(arr, str, col) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][col] == "" || new RegExp(str, "i").test(arr[i][col]) || new RegExp("undefined", "i").test(arr[i][col])) {
      arr.splice(i, 1);
      i--;
    }
  }
}

function ifsy(AReg, DRp, DRw, DR) {
  if (document.getElementById("AReg").checked) search(AReg);
  else if (document.getElementById("PStock").checked) search(DRp);
  else if (document.getElementById("WStock").checked) search(DRw);
  else { search(DR); document.getElementById("Del").checked = true; }
}

function search(arrheh) {
  var pn = document.getElementById("SEAR").value;
  var pw = document.getElementById("PASS").value;
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
    return str.replace(/[.*+\-?^${}()[\]\\]/g, "\\$1");
  };

  sArray = myArray.filter(s => pn.every(v => s.toLowerCase().includes(v)))
    .map(e => {
      if (pn[0].length > 0) e = e.replace(new RegExp(RegExp.quote(pn.join('|')), 'gi'), x => `<mark>${x}</mark>`);
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
  if (!refreshOP && data !== null) return data;

  const storage = firebase.storage();
  let pathReference = storage.ref(file);
  data = await pathReference.getDownloadURL()
    .then(async (url) => {
      return await fetch(url).then(result => result.text());
    });
  localStorage.setItem(file, data);
  return data;
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
let AReg, DRp, DRw, DR;
startup();