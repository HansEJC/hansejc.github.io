function startup() {
  funkyValues();
  fireBase();
  getModDates();
  fireAuth();
}

function getModDates() {
  const dbObj = firebase.database().ref("equip");
  dbObj.on("value", snap => {
    const dates = snap.val();
    const { lastmod } = dates;
    document.getElementById("p").textContent = `Last Updated:  ${new Date(lastmod)}`;
    const refreshOP = new Date(lastmod) > new Date(getSavedValue("lastmod"));
    localStorage.setItem("refreshOP", refreshOP);
    localStorage.setItem("lastmod", lastmod);
    delivery();
  });
}

function waitForAll() {
  return Promise.all([fireFetch("equip/equip-Materials.csv")]);
}

async function delivery() {
  // await code here
  await waitForAll();
  // code below here will only execute when await fetch() finished loading
  ifsy();
  listeners();
}

function listeners() {
  document.addEventListener('keyup', ifsy);
  document.addEventListener('change', ifsy);
}

function splicer(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][5] === "" || /quant|undefined/iu.test(arr[i][5])) {
      arr.splice(i, 1);
      i--;
    }
  }
}

function ifsy() {
  const file = "equip/equip-Materials.csv";
  let data = getSavedValue(file);
  data = Papa.parse(data).data
  splicer(data);
  search(data);
}

function search(arrheh) {
  let pn = document.getElementById("SEAR").value;
  pn = pn.toLowerCase().split(" ");
  let myArray = arrheh;
  myArray = myArray.map(e => e.join(','));//remove undefined row
  let sArray = [];


  //fix the headaches when creating a new RegExp
  RegExp.quote = function (str) {
    return str.replace(/[.*+\-?^${}()[\]\\]/gu, "\\$1");
  };

  sArray = myArray.filter(s => pn.every(v => s.toLowerCase().includes(v)))
    .map(e => {
      if (pn[0].length > 0) e = e.replace(new RegExp(RegExp.quote(pn.join('|')), 'giu'), x => `<mark>${x}</mark>`);
      return e.split(',');
    });

  let myTable = searchEquip(sArray);

  myTable += "</table>";
  document.getElementById('tab').innerHTML = myTable;
}

function searchEquip(sArray) {
  let myTable = `<table class="orionPark">
    <tr><th>Description</th>
    <th>Model</th>
    <th>Code</th>
    <th>Vendor</th>
    <th>Serial Number</th>
    <th>#</th>
    <th>Owner</th>
    <th>Location</th>
    <th>Notes</th>
    <th>User</th></tr>`;
  for (let i = 0; i < Math.min(200, sArray.length); i++) {
    myTable += `<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][2]}</td>
      <td>${sArray[i][3]}</td>
      <td>${sArray[i][4]}</td>
      <td>${sArray[i][5]}</td>
      <td>${sArray[i][6]}</td>
      <td>${sArray[i][7]}</td>
      <td>${sArray[i][8]}</td>
      <td>${sArray[i][9]}</td></tr>`;
  }
  return myTable;
}

async function fireFetch(file) {
  const refreshOP = getSavedValue("refreshOP") === "true";
  gaOP(file, refreshOP);
  let data = localStorage.getItem(file);
  if (!refreshOP && data !== null) return;

  const storage = firebase.storage();
  const pathReference = storage.ref(file);
  data = await pathReference.getDownloadURL()
    .then(async (url) => {
      return await fetch(url).then(result => result.text());
    });
  localStorage.setItem(file, data);
  return;
}

function gaOP(file, refreshOP) {
  try {
    dataLayer.push({
      'event': 'op_fetch',
      file,
      firebase: refreshOP
    });
  } catch (err) { logError(err); }
}

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

function fireAuth() {
  document.querySelector("#Logout").addEventListener("click", () => firebase.auth().signOut());
  document.querySelector("#Login").addEventListener("click", doLogin);
  document.querySelector("#PASS").addEventListener("keydown", enterLogin);
  firebase.auth().onAuthStateChanged(loginState);
}

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