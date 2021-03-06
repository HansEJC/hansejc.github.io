function startup() {
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelectorAll('select').forEach(inp => inp.value = getSavedValue(inp.id));
  induced();
}

function induced() {
  const IL = Number(getSavedValue("LoadCurrent")) || 500;
  const IF = Number(getSavedValue("FaultCurrent")) || 6000;
  const L = Number(getSavedValue("CableLength")) || 1;
  const S = Number(getSavedValue("AxialSpacing")) || 12;
  const dM = Number(getSavedValue("SheathDiameter")) || 10.33;
  const K = Number(getSavedValue("CableWires")) || 0.05;
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

//startup
window.addEventListener("load", function () {
  startup();
  document.onkeyup = function () {
    induced();
  };
});
