"use strict";
function startup() {
  document.querySelectorAll('input').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelector(`#Save`).addEventListener(`click`, save);
  document.querySelector(`#Edit`).addEventListener(`click`, edit);
  document.querySelector(`#Start`).addEventListener(`click`, start);
  document.querySelector(`#Pause`).addEventListener(`click`, pause);
  document.querySelector(`#Reset`).addEventListener(`click`, reset);
  document.querySelector(`#Share`).addEventListener(`click`, share);
  const num = document.querySelector(`#NumIntervals`);
  num.addEventListener(`keyup`, () => addInputs(num));
  addInputs(num);
  getSavedValue(`savedInterval`) === `true` ? save() : edit();
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
  clearInterval(x);
}

async function share() {
  let link = window.location.href;
  const shareData = {
    title: `Intervals`,
    text: `Simple Intervals App`,
    url: link
  };
  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
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

startup();
