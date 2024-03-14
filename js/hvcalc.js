/**
 * Startup function
 */
function startup() {
  funkyValues();
  document.addEventListener('keyup', induced);
  document.addEventListener('change', induced);
  induced();
}

function induced() {
  const IL = Number(getSavedValue("LoadCurrent")) || 500;
  const IF = Number(getSavedValue("FaultCurrent")) || 6000;
  const L = Number(getSavedValue("CableLength")) || 1;
  const S = Number(getSavedValue("AxialSpacing")) || 12;
  const dM = Number(getSavedValue("SheathDiameter")) || 10.33;
  const K = Number(getSavedValue("CableWires")) || 0.05;
  const loadI = document.querySelector("#LoadInduced");
  const faultI = document.querySelector("#FaultInduced");

  const LM = K + 0.2 * Math.log(2 * S / dM);
  const Xm = 2 * Math.PI * 50 * LM;
  const UL = Xm * L * IL / 1000;
  const UF = Xm * L * IF / 1000;
  const LL = 1000 * 60 / (Xm * IL);
  const LF = 1000 * 645 / (Xm * IF);

  loadI.textContent = `${smoothdec(UL)} V`;
  faultI.textContent = `${smoothdec(UF)} V`;
  loadI.className = UL < 60 ? "label safe" : "label danger";
  faultI.className = UF < 645 ? "label safe" : "label danger";
  document.querySelector("#InductiveReactance").textContent = `${smoothdec(Xm)} mΩ/km`;
  document.querySelector("#CoreInductance").textContent = `${smoothdec(LM)} mH/km`;
  document.querySelector("#LoadDistance").textContent = `${smoothdec(LL)} km`;
  document.querySelector("#FaultDistance").textContent = `${smoothdec(LF)} km`;
  document.querySelector("#WireFactor").textContent = K;
}

//startup
window.addEventListener("load", function () {
  startup();
});
