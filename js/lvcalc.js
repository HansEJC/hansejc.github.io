function startup() {
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  cables();
  document.querySelectorAll('select').forEach(inp => inp.value = getSavedValue(inp.id) || inp.value);
  protection();
  document.querySelectorAll('select').forEach(inp => inp.value = getSavedValue(inp.id) || inp.value);
  cableDets();
  protectionDets();
}
function cables() { //cables from table 4E4A page 417
  addCable([1.5, 27, 23, 29, 25, 25, 21, 31, 27]);
  addCable([2.5, 36, 31, 39, 33, 33, 28, 19, 16]);
  addCable([4, 49, 42, 52, 44, 43, 36, 12, 10]);
  addCable([6, 62, 53, 66, 56, 53, 44, 7.9, 6.8]);
  addCable([10, 85, 73, 90, 78, 71, 58, 4.7, 4]);
  addCable([16, 110, 94, 115, 99, 91, 75, 2.9, 2.5]);
  addCable([25, 146, 124, 152, 131, 116, 96, 1.9, 1.65]);
  addCable([35, 180, 154, 188, 162, 139, 115, 1.35, 1.15]);
  addCable([50, 219, 187, 228, 197, 164, 135, 1, 0.87]);
  addCable([70, 279, 238, 291, 251, 203, 167, 0.69, 0.6]);
  addCable([95, 338, 289, 354, 304, 239, 197, 0.52, 0.45]);
  addCable([120, 392, 335, 410, 353, 271, 223, 0.42, 0.37]);
  addCable([400, 787, 673, 847, 728, 0, 0, 0.19, 0.165]);
  cableSizes();
}

function addCable(cable) {
  let cables = JSON.parse(localStorage.getItem(`LVCableData`)) || {};
  cables[cable[0]] = {//current carrying capacity below
    c: {
      two: cable[1],
      three: cable[2]
    },
    e: {
      two: cable[3],
      three: cable[4]
    },
    d: {
      two: cable[5],
      three: cable[6]
    },//voltage drops below
    two: cable[7],
    three: cable[8]
  }
  localStorage.setItem(`LVCableData`, JSON.stringify(cables));
}

function cableSizes() {
  const cables = JSON.parse(localStorage.getItem(`LVCableData`));
  const phasesize = document.querySelector(`#PhaseSize`);
  const cpcsize = document.querySelector(`#CPCSize`);
  for (const size in cables) {
    let opt = document.createElement(`option`);
    opt.value = size;
    opt.innerHTML = `${size} mm<sup>2</sup>`;
    phasesize.appendChild(opt.cloneNode(true));
    cpcsize.appendChild(opt);
  }
}

function cableDets() {
  const ref = document.querySelector(`#ReferenceMethod`).value;
  const phasesize = document.querySelector(`#PhaseSize`).value;
  const phasecores = document.querySelector(`#PhaseCores`).value;
  const phaserating = document.querySelector(`#PhaseRating`);
  const phasedrop = document.querySelector(`#PhaseDrop`);
  const cpcsize = document.querySelector(`#CPCSize`).value;
  const cpccores = document.querySelector(`#CPCCores`).value;
  const cpcrating = document.querySelector(`#CPCRating`);
  const cpcdrop = document.querySelector(`#CPCDrop`);
  const cables = JSON.parse(localStorage.getItem(`LVCableData`));

  phaserating.textContent = `${cables[phasesize][ref][phasecores]} A`;
  phasedrop.textContent = `${cables[phasesize][phasecores]} mV/A/m`;
  cpcrating.textContent = `${cables[cpcsize][ref][cpccores]} A`;
  cpcdrop.textContent = `${cables[cpcsize][cpccores]} mV/A/m`;
  mainCalcs();
}

//table 41.3 page 62
function protection() {
  addMCB(3);
  addMCB(6);
  addMCB(10);
  addMCB(16);
  addMCB(20);
  addMCB(25);
  addMCB(32);
  addMCB(40);
  addMCB(52);
  addMCB(63);
  addMCB(80);
  addMCB(100);
  addMCB(125);
  addFuse([63, 0.78, 0.68, 280, 320]);
  addFuse([80, 0.55, 0.51, 400, 430]);
  addFuse([100, 0.42, 0.38, 520, 580]);
  protectionSelect();
}

function protectionSelect() {
  const protection = JSON.parse(localStorage.getItem(`LVProtection`));
  const protectiontype = document.querySelector(`#Protection`);
  protectiontype.innerHTML = null;
  for (const rating in protection) {
    let opt = document.createElement(`option`);
    opt.value = rating;
    opt.innerHTML = rating;
    let fuse = (document.querySelector("#ProtectionType").value.includes(`F`));
    if (fuse && protection[rating].Fe) protectiontype.appendChild(opt);
    else if (!fuse && !protection[rating].Fe) protectiontype.appendChild(opt);
  }
}

function addMCB(rating) {
  let protection = JSON.parse(localStorage.getItem(`LVProtection`)) || {};
  protection[`${rating}A MCB`] = {
    b: {
      zs: zsCalc(5, rating),
      trip: rating * 5
    },
    c: {
      zs: zsCalc(10, rating),
      trip: rating * 10
    },
    d: {
      zs: zsCalc(20, rating),
      trip: rating * 20
    }
  }
  localStorage.setItem(`LVProtection`, JSON.stringify(protection));
}

function addFuse(fuse) {
  let protection = JSON.parse(localStorage.getItem(`LVProtection`)) || {};
  protection[`${fuse[0]}A Fuse`] = {
    Fe: {
      zs: fuse[1],
      trip: fuse[3]
    },
    Fc: {
      zs: fuse[2],
      trip: fuse[4]
    }
  }
  localStorage.setItem(`LVProtection`, JSON.stringify(protection));
}

const zsCalc = (type, rating) => smoothdec(230 * 0.95 / (type * rating));

function protectionDets() {
  const protection = document.querySelector(`#Protection`).value;
  const type = document.querySelector(`#ProtectionType`).value;
  const Zs = document.querySelector(`#ProtectionZs`);
  const trip = document.querySelector(`#ProtectionTrip`);
  const protect = JSON.parse(localStorage.getItem(`LVProtection`));

  Zs.textContent = `${protect[protection][type].zs} Ω`;
  trip.textContent = `${protect[protection][type].trip} A`;
  mainCalcs();
}

function mainCalcs() {
  const phaserating = document.querySelector(`#PhaseRating`);
  const trip = document.querySelector(`#ProtectionTrip`);
  const protectrating = Number(document.querySelector(`#Protection`).value.split(`A`)[0]);
  const designcurrent = Number(document.querySelector(`#DesignCurrent`).value);
  const phasevoltage = Number(document.querySelector(`#PhaseVoltage`).value);
  const len = Number(document.querySelector(`#CableLength`).value);
  const vdrop = document.querySelector(`#PhaseDrop`);
  const Zs = Number(document.querySelector("#Zs").value);
  const K = Number(document.querySelector(`#K`).value);
  const proZs = document.querySelector("#ProtectionZs");
  const earthfault = document.querySelector(`#EarthFault`);
  const maxfault = document.querySelector(`#MaxFault`);
  const minc = document.querySelector(`#MinCable`);
  const triptime = document.querySelector("#ProtectionType").value.includes(`F`) ? 5 : 0.4;

  let phasesafe = Number(phaserating.textContent.split(` `)[0]) > protectrating && protectrating > designcurrent;
  phaserating.className = phasesafe ? `label safe` : `label danger`;
  trip.className = protectrating > designcurrent ? `label safe` : `label danger`;
  const vdropped = Number(vdrop.textContent.split(` `)[0]) / 1000 * len * designcurrent;
  document.querySelector(`#VoltageDrop`).textContent = `${smoothdec(vdropped)} V`;
  vdrop.className = 100 * vdropped / phasevoltage < 2.5 ? `label safe` : `label danger`;

  const maxv = smoothdec(phasevoltage * 1.1);
  const minv = smoothdec(phasevoltage * 0.9);
  document.querySelector(`#MaxVoltage`).textContent = `${maxv} V`;
  document.querySelector(`#MinVoltage`).textContent = `${minv} V`;

  const Zc = len * Number(vdrop.textContent.split(` `)[0]) / 2 / 1000;
  const Zel = smoothdec(Zc * 2 + Zs, 4);
  const Zt = smoothdec(Zc + Zc / 2 + Zs, 4);
  const mincable = smoothdec(Math.sqrt((maxv / Zt) ** 2 * triptime) / K); //0.4s disconnection time. The time should really be cross checked with the trip curves
  document.querySelector(`#TripTime`).textContent = `${triptime} s`;

  document.querySelector(`#CableImpedance`).textContent = `${smoothdec(Zc, 4)} Ω`;
  document.querySelector(`#ELImpedance`).textContent = `${Zel} Ω`;
  document.querySelector(`#TotalImpedance`).textContent = `${Zt} Ω`;
  proZs.className = Zt < proZs.textContent.split(` `)[0] ? `label safe` : `label danger`;
  earthfault.textContent = `${smoothdec(minv / Zel)} A`;
  maxfault.textContent = `${smoothdec(maxv / Zt)} A`;
  minc.textContent = `${mincable} mm2`;
  earthfault.className = smoothdec(minv / Zel) > Number(trip.textContent.split(` `)[0]) ? `label safe` : `label danger`;
  maxfault.className = smoothdec(maxv / Zt) > Number(trip.textContent.split(` `)[0]) ? `label safe` : `label danger`;
  minc.className = mincable < Number(document.querySelector("#PhaseSize").value) ? `label safe` : `label danger`;
}

//startup
window.addEventListener("load", function () {
  startup();
  document.onkeyup = function () {
    mainCalcs();
  };
});
