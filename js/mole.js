const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const mode = document.querySelector("#Mode");
let lastHole;
let timeUpE = false, timeUpN = false, timeUpH = false, gamesStarted = false;
let score = 0;
let time = 0;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    console.log('Ah nah thats the same one bud');
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peepE() {
  mode.textContent = "Easy";
  time = randomTime(500, 1500);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUpE) peepE();
  }, time);
}

function peepN() {
  mode.textContent = "Normal";
  time = randomTime(200, 800);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUpN) peepN();
  }, time);
}

function peepH() {
  mode.textContent = "Hard";
  time = randomTime(100, 500);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUpH) peepH();
  }, time);
}

function startGame() {
  if (gamesStarted) return;
  gamesStarted = true;
  scoreBoard.textContent = 0;
  timeUpE = false;
  score = 0;
  peepE();
  setTimeout(() => {
    timeUpE = true;
    peepN();
    setTimeout(() => {
      timeUpN = true;
      peepH();
      setTimeout(() => {
        timeUpH = true;
        gamesStarted = false;
        saveScores(score);
      }, 8000);
    }, 8000);
  }, 8000);
}

function bonk(e) {
  if(!e.isTrusted) return; // cheater!
  if (!timeUpE) score++;
  else if (!timeUpN) score+=2;
  else score+=5;
  this.removeEventListener('click', bonk);
  //this.parentNode.classList.remove('up');
  this.classList.add('imp');
  scoreBoard.textContent = score;
  setTimeout(() => {
    this.classList.remove('imp');
    this.addEventListener('click', bonk);
  }, time);
}

moles.forEach(mole => mole.addEventListener('click', bonk));

//startup
localStorage.setItem(`game`,`mole`);
document.getElementById("userName").value = getSavedValue("userName");
try {
  getScores();
}catch(err){console.log(err);}