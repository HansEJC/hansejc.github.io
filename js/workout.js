"use strict";
function startup() {
  document.querySelectorAll('input').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelector(`#Save`).addEventListener(`click`, save);
  document.querySelector(`#Edit`).addEventListener(`click`, edit);
  document.querySelector(`#Start`).addEventListener(`click`, start);
  document.querySelector(`#Pause`).addEventListener(`click`, pause);
  document.querySelector(`#Reset`).addEventListener(`click`, reset);
  const num = document.querySelector(`#NumIntervals`);
  num.addEventListener(`keyup`, () => addInputs(num));
  addInputs(num);
  getSavedValue(`savedInterval`) === `true` ? save() : edit();
  table();
  window['workcounter'] = 0;
  fireBase();
  fireAuth();
}

function addInputs(e) {
  saveValue(e);
  const intForm = document.querySelector(`#IntervalTimers`);
  const labForm = document.querySelector(`#IntervalLabels`);
  intForm.innerHTML = ``;
  labForm.innerHTML = ``;
  const num = Number(e.value) || 1;
  for (let i = 0; i < num; i++) {
    let inp = document.createElement(`input`);
    let lab = document.createElement(`input`);
    inp.type = `time`;
    lab.type = `text`;
    inp.id = `interval${i}`;
    lab.id = `intervalLab${i}`;
    inp.value = getSavedValue(`interval${i}`) || `00:00`;
    lab.value = getSavedValue(`intervalLab${i}`);
    intForm.appendChild(inp);
    labForm.appendChild(lab);
  }
}

function save() {
  document.querySelectorAll('input').forEach(inp => saveValue(inp));
  document.querySelector(`#InputSelection`).style = `display:none`;
  document.querySelector(`#Intervals`).style = `display:block`;
  localStorage.setItem(`savedInterval`, true);
}

function edit() {
  document.querySelector(`#InputSelection`).style = `display:block`;
  document.querySelector(`#Intervals`).style = `display:none`;
  localStorage.setItem(`savedInterval`, false);
}

const toSecs = (text) => {
  let split = text.split(`:`);
  return Number(split[0]) * 60 + Number(split[1]);
}

const secs2Text = (time) => time >= 60 ? `${Math.floor(time / 60)}:${secDec(time)}` : `${secDec(time)}`;
const secDec = (time) => time % 60 < 10 && time > 0 ? `0${time % 60}` : time % 60;

function start() {
  initAudio();
  document.querySelector(`#Start`).style = `display:none`;
  document.querySelector(`#Pause`).style = `display:block`;
  const num = Number(getSavedValue(`NumIntervals`));
  window[`interArr`] = [];
  let timeStamp = Number(new Date());
  for (let i = 0; i < num; i++) {
    let int = toSecs(getSavedValue(`interval${i}`))
    timeStamp += int * 1000;
    interArr[i] = { label: getSavedValue(`intervalLab${i}`), time: timeStamp, int: int }
  }
  let ind = 0, time;
  window[`paused`] = false;
  window[`x`] = setInterval(() => {
    time = paused ? time : (interArr[ind].time - new Date()) / 1000;
    let label = interArr[ind].label;
    document.querySelector(`#Timer`).innerText = secs2Text(smoothdec(time, 0));
    document.querySelector(`#IntervalLabel`).innerText = label;
    progress(time / interArr[ind].int);
    if (time < 0) {
      ind++;
      intervalSounds();
      if (ind === num) return reset();
    }
  }, 10);
}

const progress = (percent) => document.querySelector(`progress`).value = 1 - percent;

function pause() {
  let pause = document.querySelector(`#Pause`);
  paused = paused ? false : true;
  pause.innerText = paused ? `Resume` : `Pause`;
  window[`pauseTime`] = paused ? new Date() : Number(new Date()) - pauseTime; //Save the time interval when paused
  if (!paused) interArr.forEach(t => t.time += pauseTime); //Add the paused time to the timestamps
}

function reset() {
  document.querySelector(`#Start`).style = `display:block`;
  document.querySelector(`#Pause`).style = `display:none`;
  document.querySelector(`#Timer`).innerText = `0`;
  document.querySelector(`#IntervalLabel`).innerText = `Press Start`;

  nextRow();
  workcounter++;
  clearInterval(x);
}

function initAudio() {
  const AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;
  window[`a`] = AudioContext ? new AudioContext() : null;
}

// gain, frequency, duration
function k(w, x, y) {
  try {
    let v = a.createOscillator();
    let u = a.createGain();
    v.connect(u);
    v.frequency.value = x;
    v.type = "square";
    u.connect(a.destination);
    u.gain.value = w * 0.01;
    v.start(a.currentTime);
    v.stop(a.currentTime + y * 0.001);
  } catch (err) { console.log(`${err} not supported`); }
}

function intervalSounds() {
  k(10, 3000, 100);
  setTimeout(() => { k(10, 2900, 100) }, 100);
  setTimeout(() => { k(10, 3000, 100) }, 200);
}

function insertRow(rows, myTable) {
  try {
    rows.forEach(arr => {
      const row = myTable.insertRow(-1);
      [row.insertCell(0).innerHTML, row.insertCell(1).innerHTML, row.insertCell(2).innerHTML, row.insertCell(3).innerHTML] = arr;
    });
  } catch (err) { logError(err); }
}

function nextRow() {
  document.querySelector('table').rows[workcounter].className += 'selected';
}

/**
 * Inserts summary table
 * @param rows array with summary info
 */
function table() {
  const rows = [
    [45, 70, 7, 63],
    [55, 85, 10, 76],
    [35, 52, 7, 47],
    [30, 45, 7, 40],
    [60, 90, 10, 80],
    ['-', '-', '-', '-'],
    [26, 40, 5, 35],
    [26, 40, 5, 35],
    [33, 60, 6, 45],
    [33, 60, 6, 45],
    [26, 40, 5, 35],
    [26, 40, 5, 35],
    [22, 33, 4, 30],
    [22, 33, 4, 30],
    [60, 105, 10, 100],
  ]
  const tabdiv = document.querySelector("#SummaryTable");
  const myTable = document.createElement("table");
  myTable.classList.add("scores");
  const row = myTable.insertRow(-1);
  row.insertCell(0).outerHTML = "<th>Pushups</th>";
  row.insertCell(1).outerHTML = "<th>Situps</th>";
  row.insertCell(2).outerHTML = "<th>Pullups</th>";
  row.insertCell(3).outerHTML = "<th>Squats</th>";
  insertRow(rows, myTable);
  while (tabdiv.childElementCount > 1) tabdiv.removeChild(tabdiv.lastChild);
  tabdiv.appendChild(myTable);
}

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

function getData(dbName) {
  let dbObj = firebase.database().ref(`workout/${dbName}`);
  dbObj.on(`value`, snap => {
    let data = JSON.stringify(snap.val());
    localStorage.setItem(`workout`, data);
  });
}

function sendData() {
  dbName = firebase.auth().currentUser.uid;
  let dbObj = firebase.database().ref(`workout/${dbName}`);
  dbObj.set(getKicks());
}

function fireAuth() {
  document.querySelector(`#Logout`).addEventListener(`click`, () => firebase.auth().signOut());
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
  if (user) {
    logout.style = `display: block`;
    getData(user.uid);
  }
  else {
    fireUI();
    logout.style = `display: none`;
  }
  /*
    if (user) {
      // User is signed in.
      const displayName = user.displayName;
      const email = user.email;
      const emailVerified = user.emailVerified;
      const photoURL = user.photoURL;
      const uid = user.uid;
      const phoneNumber = user.phoneNumber;
      const providerData = user.providerData;
      user.getIdToken().then(function (accessToken) {
        document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        document.getElementById('account-details').textContent = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  ');
      });
    } else {
      // User is signed out.
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('account-details').textContent = 'null';
    }
  */
}

function fireUI() {
  const uiConfig = {
    signInSuccessUrl: '/workout.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      {
        // Google provider must be enabled in Firebase Console to support one-tap
        // sign-up.
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // Required to enable ID token credentials for this provider.
        // This can be obtained from the Credentials page of the Google APIs
        // console. Use the same OAuth client ID used for the Google provider
        // configured with GCIP or Firebase Auth.
        clientId: '204800601174-rnoh9kea6im1jd1gi8s2ti6kifht1470.apps.googleusercontent.com'
      },
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Required to enable one-tap sign-up credential helper.
    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
      window.location.assign('');
    }
  };

  // Initialize the FirebaseUI Widget using Firebase.
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);
}

startup();
