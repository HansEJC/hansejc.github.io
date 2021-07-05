function initiate() {
  localStorage.setItem(`game`, `rex`);
  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.addEventListener('change', saveRadio);
    rad.checked = (getSavedValue(rad.id) === "true");
  });
  if (!document.querySelector("#Jon").checked && !document.querySelector("#Maple").checked) document.querySelector("#Jon").click(); //if none checked, make Jon default
  gameMode();
  document.getElementById("userName").value = getSavedValue("userName");
  window.Rexy = new Runner('.interstitial-wrapper');
  try {
    getScores();
  } catch (e) { logError(e); }
  document.onkeydown = keys;
}

//Speach recognition commands
function speech() {
  try {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    //recognition.onresult = e => {
    recognition.onsoundstart = e => {
      //const transcript = [...e.results].map(res => res[0].transcript).join('');
      /*if (transcript.includes('jump'))*/ Rexy.tRex.startJump();
      recognition.abort();
      //recognition.start();
      recognition.onend = () => recognition.start();
    };
    recognition.start();
  } catch (err) { logError(`${err} speech recognition not supported`) }
}

function keys(e) {
  const keyCode = e.which || e.keyCode;
  let handled = false;
  if (keyCode === 38 || keyCode === 40 || keyCode === 32) { //up or down or spacebar
    e.preventDefault();
    handled = true;
  }
  return !handled; //return false if the event was handled  
}

function gameMode() {
  const mode = document.querySelector("#Jon").checked;
  const folder = mode ? `` : `Backup/`;
  document.querySelector("#Desc").innerText = mode ? "Help Jon make it safely through the day. Press spacebar to start." : "Help the noob survive. Press spacebar to start.";
  document.querySelector(`label[for="0"]`).innerText = mode ? "Ignore Mark" : "God Mode";
  document.querySelector(`label[for="1"]`).innerText = mode ? "Infinite jump away from work" : "Triple Jump";
  const imgs1 =
    `<img id='1x-obstacle-large' src='images/${folder}1x-large-obstacle.png' jstcache='0'>
      <img id='1x-obstacle-small' src='images/${folder}1x-small-obstacle.png' jstcache='0'>
      <img id='1x-trex' src='images/${folder}1x-trex.png' jstcache='0'>`;
  const imgs2 =
    `<img id='2x-obstacle-large' src='images/${folder}2x-large-obstacle.png' jstcache='0'>
      <img id='2x-obstacle-small' src='images/${folder}2x-small-obstacle.png' jstcache='0'>
      <img id='2x-trex' src='images/${folder}2x-trex.png' jstcache='0'>`;
  return trekt(imgs1, imgs2);
}

//startup
initiate();