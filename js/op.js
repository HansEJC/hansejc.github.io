/**
 * Startup function
 */
function startup() {
  funkyValues();
  fireBase();
  getModDates();
  fireAuth();
  document.addEventListener('keyup', ifsy);
  document.addEventListener('change', ifsy);
}

/**
 * See when file was last modified
 */
function getModDates() {
  const dbObj = firebase.database().ref("op");
  dbObj.on("value", snap => {
    const dates = snap.val();
    const { lastmod, lastmodassets } = dates;
    document.getElementById("p").textContent = `Asset Reg Last Updated:  ${new Date(lastmodassets)}`;
    document.getElementById("pp").textContent = `Warehouse Last Updated:  ${new Date(lastmod)}`;
    const refreshOP = new Date(lastmod) > new Date(getSavedValue("lastmod"));
    localStorage.setItem("refreshOP", refreshOP);
    localStorage.setItem("lastmod", lastmod);
    delivery();
  });
}

/**
 * Wait for files from firebase
 */
async function waitForAll() {
  return Promise.all([
    fireFetch("op/assets-Asset List.csv"),
    fireFetch("op/op-Warehouse Stock .csv"),
    fireFetch("op/op-DELIVERIES.csv")
  ]);
}

/**
 * Wait for files from firebase and run code
 */
async function delivery() {
  // await code here
  await Promise.all([fireFetch("equip/equip-Materials.csv")]);
  // code below here will only execute when await fetch() finished loading
  ifsy();
}

/**
 * Remove bloat
 * @param arr Input data
 * @param file Which file
 */
function splicer(arr, file) {
  const str = file.includes("set") ? "asset"
    : file.includes("Ware") ? "location" : "date";
  const col = file.includes("Ware") ? 7 : 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][col] === "" || new RegExp(str, "iu").test(arr[i][col]) || new RegExp("undefined", "iu").test(arr[i][col])) {
      arr.splice(i, 1);
      i--;
    }
  }
}

/**
 * Run splicer and search functions after changing search text
 */
function ifsy() {
  const file = document.querySelector('input[name]:checked').className;
  let data = getSavedValue(file);
  data = file.includes("Ware") ? Papa.parse(data).data : Papa.parse(data).data.reverse();
  splicer(data, file);
  search(data);
}

/**
 * Creates new array with search text
 * @param arrheh Input array
 */
function search(arrheh) {
  let pn = document.getElementById("SEAR").value;
  pn = pn.toLowerCase().split(" ");
  let myArray = arrheh;
  myArray = myArray.map(e => e.join(','));//remove undefined row
  const npr = myArray.length; //number of rows
  let sArray = [];
  for (let i = 0; i < npr; i++) {
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

/**
 * Create table using searched term
 * @param sArray Search text
 * @returns Table
 */
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

/**
 * Create table using searched term
 * @param sArray Search text
 * @returns Table
 */
function searchDel(sArray) {
  let myTable = `<table class="orionPark">
    <tr><th>Date</th>
    <th>Time</th>
    <th>Supplier</th>
    <th>Comments</th>
    <th>Project</th>
    <th>PO #</th></tr>`;
  for (let i = 0; i < Math.min(50, sArray.length); i++) {
    const len = sArray[i][8].includes("</") ? 16 : 3;
    const shifty = sArray[i][8].length > len;
    const comm = shifty ? `${sArray[i][7]} ${sArray[i][8]}` : sArray[i][7];
    const proj = shifty ? "" : sArray[i][8].substring(0, len);
    myTable += `<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][4]}</td>
      <td>${comm}</td>
      <td>${proj}</td>
      <td>${sArray[i][9]}</td></tr>`;
  }
  return myTable;
}

/**
 * Create table using searched term
 * @param sArray Search text
 * @returns Table
 */
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

/**
 * Get file from firebase storage
 * @param file File to get
 * @returns file
 */
async function fireFetch(file) {
  const refreshOP = getSavedValue("refreshOP") === "true";
  gaOP(file, refreshOP);
  let data = localStorage.getItem(file);
  if (!refreshOP && data !== null) return;

  const storage = firebase.storage();
  const pathReference = storage.ref(file);
  data = await pathReference.getDownloadURL()
    .then(async (url) => {
      return fetch(url).then(result => result.text());
    });
  localStorage.setItem(file, data);
  return;
}

/**
 * Check if file has changed since last fetch
 * @param file File to check
 * @param refreshOP boolean
 */
function gaOP(file, refreshOP) {
  try {
    dataLayer.push({
      'event': 'op_fetch',
      file,
      firebase: refreshOP
    });
  } catch (err) { logError(err); }
}

/**
 * Sign in if enter is pressed
 * @param e target
 */
function enterLogin(e) {
  const keyCode = e.which || e.keyCode;
  let handled = false;
  if (keyCode === 13) { //enter
    e.preventDefault();
    handled = true;
    doLogin();
  }
  return !handled; //return false if the event was handled  
}

/**
 * Event listeners for logging in and out
 */
function fireAuth() {
  document.querySelector("#Logout").addEventListener("click", () => firebase.auth().signOut());
  document.querySelector("#Login").addEventListener("click", doLogin);
  document.querySelector("#PASS").addEventListener("keydown", enterLogin);
  firebase.auth().onAuthStateChanged(loginState);
}

/**
 * Shown and hide elements if logged in
 * @param user user logged in
 */
function loginState(user) {
  const logout = document.querySelector("#Logout");
  const login = document.querySelector("#Login");
  const pass = document.querySelector("#PASS");
  if (user) {
    login.style = "display: none";
    pass.style = "display: none";
    logout.style = "display: block";
    document.querySelector("#logInfo").innerHTML = "";
    delivery();
  }
  else {
    login.style = "display: block";
    pass.style = "display: block";
    logout.style = "display: none";
  }
}

/**
 * Firebase login
 */
function doLogin() {
  const auth = firebase.auth();
  const user = "a@b.com";
  const pass = document.querySelector("input[type=password]").value;
  const promise = auth.signInWithEmailAndPassword(user, pass);
  promise.catch(e => {
    document.querySelector("#logInfo").innerHTML = e;
  });
}

//startup
startup();