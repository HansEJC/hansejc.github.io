function initiate() {
  localStorage.setItem(`game`, `rex`);
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.addEventListener('change', saveRadio);
    rad.checked = (getSavedValue(rad.id) == "true");
  });
  if (!document.querySelector("#Jon").checked && !document.querySelector("#Maple").checked) document.querySelector("#Jon").click(); //if none checked, make Jon default
  gameMode();
  document.getElementById("userName").value = getSavedValue("userName");
  Rexy = new Runner('.interstitial-wrapper');
  try {
    getScores();
  } catch (e) { console.log(e); }
  document.onkeydown = keys;
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

function keys(e) {
  var keyCode = e.which || e.keyCode;
  var handled = false;
  if (keyCode == 38 || keyCode == 40 || keyCode == 32) { //up or down or spacebar
    e.preventDefault();
    handled = true;
  }
  return !handled; //return false if the event was handled  
}

function gameMode() {
  let imgs1, imgs2;
  if (document.querySelector("#Jon").checked) {
    document.querySelector("#Desc").innerText = "Help Jon make it safely through the day. Press spacebar to start.";
    document.getElementById("0").innerText = "Ignore Mark";
    document.getElementById("1").innerText = "Infinite jump away from work";
    imgs1 =
      "<img id='1x-obstacle-large' src='images/1x-large-obstacle.png' jstcache='0'>" +
      "<img id='1x-obstacle-small' src='images/1x-small-obstacle.png' jstcache='0'>" +
      "<img id='1x-trex' src='images/1x-trex.png' jstcache='0'>";
    imgs2 =
      "<img id='2x-obstacle-large' src='images/2x-large-obstacle.png' jstcache='0'>" +
      "<img id='2x-obstacle-small' src='images/2x-small-obstacle.png' jstcache='0'>" +
      "<img id='2x-trex' src='images/2x-trex.png' jstcache='0'>";
  }
  else {
    document.querySelector("#Desc").innerText = "Help the noob survive. Press spacebar to start.";
    document.getElementById("0").innerText = "God Mode";
    document.getElementById("1").innerText = "Tripe Jump";
    imgs1 =
      "<img id='1x-obstacle-large' src='images/Backup/1x-large-obstacle.png' jstcache='0'>" +
      "<img id='1x-obstacle-small' src='images/Backup/1x-small-obstacle.png' jstcache='0'>" +
      "<img id='1x-trex' src='images/Backup/1x-trex.png' jstcache='0'>";
    imgs2 =
      "<img id='2x-obstacle-large' src='images/Backup/2x-large-obstacle.png' jstcache='0'>" +
      "<img id='2x-obstacle-small' src='images/Backup/2x-small-obstacle.png' jstcache='0'>" +
      "<img id='2x-trex' src='images/Backup/2x-trex.png' jstcache='0'>";
  }
  return trekt(imgs1, imgs2);
}

//startup
initiate();