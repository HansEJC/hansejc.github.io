const keys = document.querySelectorAll('.key');
keys.forEach(sq => sq.addEventListener('click', bonk));

function bonk(e) {
  if(!e.isTrusted) return; // cheater!
  logError(e.target.dataset.key);
  k(10,+e.target.dataset.key,200);
  e.target.classList.add('pressed');
  setTimeout(() => e.target.classList.remove('pressed'),300);
}

function keyPress(e) {
  if(!e.isTrusted) return; // cheater!
  logError(e.keyCode);
  try{
    k(10,+e.keyCode,200);
    let div = document.querySelector(`[data-key="${e.keyCode}"]`);
    div.classList.add('pressed');
    setTimeout(() => div.classList.remove('pressed'),300);
  }catch(err){k(10,+e.keyCode,200);}
}

let AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;
if (AudioContext) {let a = new AudioContext();}

window.addEventListener('keydown', keyPress);