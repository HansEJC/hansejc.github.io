const keys = document.querySelectorAll('.key');
keys.forEach(sq => sq.addEventListener('click', bonk));


function bonk(e) {
  if(!e.isTrusted) return; // cheater!
  console.log(e.target.dataset.key);
  k(10,+e.target.dataset.key,200);
  e.target.classList.add('pressed');
  setTimeout(() => e.target.classList.remove('pressed'),300);
}

function keyPress(e) {
  if(!e.isTrusted) return; // cheater!
  console.log(e.keyCode);
  try{
    k(10,+e.keyCode,200);
    let div = document.querySelector(`[data-key="${e.keyCode}"]`);
    div.classList.add('pressed');
    setTimeout(() => div.classList.remove('pressed'),300);
  }catch(err){k(10,+e.keyCode,200);}
}

// gain, frequency, duration
const a=new AudioContext()
function k(w,x,y){
  v=a.createOscillator()
  u=a.createGain()
  v.connect(u)
  v.frequency.value=x
  v.type="square"
  u.connect(a.destination)
  u.gain.value=w*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+y*0.001)
}

window.addEventListener('keydown', keyPress);