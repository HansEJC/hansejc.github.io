fireBase();
function saveScores(scr) {
  let game = readCookie("game");
  const name = document.querySelector("#userName").value;
  let scores = JSON.parse(localStorage.getItem(game));
  let date = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
  let exists = false;
  try {
    if (scores[name] != undefined) {
      let score = scores[name].score;
      let oldDate = scores[name].date;
      scores[name].date = scr > score ? date : oldDate;
      scores[name].lastdate = date;
      scores[name].score = Math.max(score, scr);
      exists = true;
    }
  } catch (err) {
    console.log(err);
  }

  if (!exists) {
    scores[name] = {
      score: scr,
      date: date,
      lastdate: date,
    }
  }
  sendData(name, scores[name]);
  localStorage.setItem(game, JSON.stringify(scores));
  sucPost(`Updating scores. Using cheats won't get you a high score!`);
}

const readCookie = (name) => (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '');

function sucPost(data) {
  document.getElementById("TempScore").innerHTML = data;
  _('#TempScore').fade('in', 100);
  setTimeout(function () {
    _('#TempScore').fade('out', 500);
  }, 1000);
}

function getScores(full) {
  let game = readCookie("game");
  let dbObj = firebase.database().ref(game);
  dbObj.on(`value`, snap => {
    let scores = snap.val();
    localStorage.setItem(game, JSON.stringify(scores));
    scoreTable(scores, full);
  });
}

function scoreTable(scores, full) {
  const table = document.getElementById('board');
  while (table.firstElementChild.childElementCount > 1) { //don't remove the firstborn children
    table.firstElementChild.removeChild(table.firstElementChild.lastChild);
  }
  scores = Object.entries(scores);
  scores.sort((a, b) => b[1].score - a[1].score);
  scores.forEach(val => {
    let row = table.insertRow(-1);
    row.insertCell(0).innerHTML = val[0] === `empty` ? `` : val[0];
    row.insertCell(1).innerHTML = val[1].score;
    if (full) {
      row.insertCell(2).innerHTML = val[1].date;
      row.insertCell(3).innerHTML = val[1].lastdate;
    }
  });
}

function sendData(name, data) {
  name = name === `` ? `empty` : name;
  let game = readCookie("game");
  let dbObj = firebase.database().ref(`${game}/${name}`);
  dbObj.update(data);
}

//Speach recognition commands
function speech() {
  try {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    //recognition.onresult = e => {
    recognition.onsoundstart = e => {
      //let transcript = [...e.results].map(res => res[0].transcript).join('');
      console.log("now");
      /*if (transcript.includes('jump'))*/ Rexy.tRex.startJump();
      recognition.abort();
      //recognition.start();
      recognition.onend = () => recognition.start();
    };
    recognition.start();
  } catch (err) { console.log(err + " speech recognition not supported") }
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
  } catch (err) { console.log(err + "not supported"); }
}