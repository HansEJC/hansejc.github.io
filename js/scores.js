var ipString = "removeMe?";
function saveScores(scr) {
  if (!window.location.hostname.includes("github")) {
    post("./savesettings.php?=v1.0",
    {
      name: document.querySelector("#userName").value,
      ip: ipString,
      score: scr,
      date: new Date().toLocaleString("en-GB", {timeZone: "Europe/London"}),
    },sucPost);
  }
  else {
    let scoreID = "jumpScores";
    scoreID = document.cookie.includes('game=mole') ? "moleScores" : scoreID;
    scoreID = document.cookie.includes('game=simon') ? "simonScores" : scoreID;
    scoreID = document.cookie.includes('game=dobble') ? "dobbleScores" : scoreID;
    let scoreArr = [];
    const name = document.getElementById("userName");
    let exists = false;

    try{
      scoreArr = JSON.parse(localStorage.getItem(scoreID));
      scoreArr.forEach(val => {
        if (val[0] == name.value) {
          val[1] = scr > val[1] ? scr : val[1];
          exists = true;
        }
      });
    }catch(err){
      console.log("no highscores yet");
      scoreArr = [];
    }

    if (!exists) scoreArr.push([name.value,scr]);

    localStorage.setItem(scoreID,JSON.stringify(scoreArr));
    setTimeout(function(){
      document.location="?"+(new Date).getTime();
    }, 1000);
  }
}

function sucPost(data){
  document.getElementById("TempScore").innerHTML = data;
  _('#TempScore').fade('in', 100);
  setTimeout(function(){
    _('#TempScore').fade('out', 500);
    document.location="?"+(new Date).getTime();
  }, 1000);
}

async function getScores(file,storage){
  const serverScore = await fetch(file)
    .then(result => result.json());
  const localScore = JSON.parse(localStorage.getItem(storage));
  const allScore = (!localScore) ? serverScore : [...serverScore,...localScore];
  allScore.sort((a,b) => b[1] - a[1]);
  const table = document.getElementById('board');
  allScore.forEach(val => {
    let row = table.insertRow(-1);
    row.insertCell(0).innerHTML = val[0];
    row.insertCell(1).innerHTML = val[1];
  });
}

//Speach recognition commands
function speech() {
  try{
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
  } catch(err) {console.log(err+" speech recognition not supported")}
}

//Scores redirect
function fullscores(){
  document.location="fullscores.php?"+(new Date).getTime();
}

// gain, frequency, duration
function k(w,x,y){
  try {
    let v = a.createOscillator();
    let u = a.createGain();
    v.connect(u);
    v.frequency.value = x;
    v.type="square";
    u.connect(a.destination);
    u.gain.value = w*0.01;
    v.start(a.currentTime);
    v.stop(a.currentTime+y*0.001);
  }catch(err){console.log(err+"not supported");}
}

const ip = () => "obsolete";