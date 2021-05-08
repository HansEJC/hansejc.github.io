function startup() {
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('select').forEach(inp => inp.value = getSavedValue(inp.id));
  cables();
  protection();
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
}

//table 41.3 page 62
function protection() {
  let rating = 10; //fuse rating
  let type = 5; //fuse type
  let Zs = 230 * 0.95 / (type * rating);
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
  protectionSelect();
}

function protectionSelect() {
  const protection = JSON.parse(localStorage.getItem(`LVProtection`));
  const protectiontype = document.querySelector(`#Protection`);
  for (const rating in protection) {
    let opt = document.createElement(`option`);
    opt.value = rating;
    opt.innerHTML = rating;
    protectiontype.appendChild(opt);
  }
}

function addMCB(rating) {
  let protection = JSON.parse(localStorage.getItem(`LVProtection`)) || {};
  protection[`${rating}A MCB`] = {
    b: zsCalc(5, rating),
    c: zsCalc(10, rating),
    d: zsCalc(20, rating),
  }
  localStorage.setItem(`LVProtection`, JSON.stringify(protection));
}

const zsCalc = (type, rating) => smoothdec(230 * 0.95 / (type * rating));

function protectionDets() {
  const protection = document.querySelector(`#Protection`).value;
  const type = document.querySelector(`#ProtectionType`).value;
  const Zs = document.querySelector(`#ProtectionZs`);
  const protect = JSON.parse(localStorage.getItem(`LVProtection`));

  Zs.textContent = `${protect[protection][type]} Ω`;
}
/*
function induced() {
  const IL = +(getSavedValue("LoadCurrent")) || 500;
  const IF = +(getSavedValue("FaultCurrent")) || 6000;
  const L = +(getSavedValue("CableLength")) || 1;
  const S = +(getSavedValue("AxialSpacing")) || 12;
  const dM = +(getSavedValue("SheathDiameter")) || 10.33;
  const K = +(getSavedValue("CableWires")) || 0.05;
  const loadI = document.querySelector(`#LoadInduced`);
  const faultI = document.querySelector(`#FaultInduced`);

  let LM = K + 0.2 * Math.log(2 * S / dM);
  let Xm = 2 * Math.PI * 50 * LM;
  let UL = Xm * L * IL / 1000;
  let UF = Xm * L * IF / 1000;
  let LL = 1000 * 60 / (Xm * IL);
  let LF = 1000 * 645 / (Xm * IF);

  loadI.textContent = `${smoothdec(UL)} V`;
  faultI.textContent = `${smoothdec(UF)} V`;
  loadI.className = UL < 60 ? `label safe` : `label danger`;
  faultI.className = UF < 645 ? `label safe` : `label danger`;
  document.querySelector(`#InductiveReactance`).textContent = `${smoothdec(Xm)} mΩ/km`;
  document.querySelector(`#CoreInductance`).textContent = `${smoothdec(LM)} mH/km`;
  document.querySelector(`#LoadDistance`).textContent = `${smoothdec(LL)} km`;
  document.querySelector(`#FaultDistance`).textContent = `${smoothdec(LF)} km`;
  document.querySelector(`#WireFactor`).textContent = K;
}
*/
//startup
window.addEventListener("load", function () {
  startup();
  document.onkeyup = function () {
    //induced();
  };
});
