fireBase();

function getFaults() {
  const dbObj = firebase.database().ref(`relay`);
  dbObj.on(`value`, snap => {
    const faults = snap.val();
    faultTable(faults);
  });
  const openRequest = indexedDB.open("graph", 1);
  openRequest.onsuccess = function (e) {
    db = e.target.result;
  }
}

function importFault(fault) {
  const dbObj = firebase.database().ref(`relay/${fault.target.innerHTML}`);
  dbObj.once(`value`, snap => {
    const data = snap.val();
    localStorage.setItem(`headers`, data.headers);
    localStorage.setItem(`CFGdata`, data.cfg);
    localStorage.setItem(`isDAT`, data.isDAT);
    const transaction = db.transaction(["plots"], "readwrite");
    const objectStore = transaction.objectStore("plots");
    objectStore.put({ id: 1, data: data.data });
    window.open(`relay.html${data.params || ``}`, `_self`);
  });
}

function faultTable(faults) {
  const table = document.getElementById('board');
  while (table.firstElementChild.childElementCount > 1) { //don't remove the firstborn children
    table.firstElementChild.removeChild(table.firstElementChild.lastChild);
  }
  faults = Object.entries(faults);
  faults.forEach(val => {
    try {
      const row = table.insertRow(-1);
      const titstuff = val[0].split(`,`);
      const date = new Date(`${titstuff[1].split(`-`)[2]}-${titstuff[1].split(`-`)[1]}-${titstuff[1].split(`-`)[0]}T${titstuff[2].split(`-`)[0]}`);
      const faultrow = row.insertCell(0);
      const daterow = row.insertCell(1);
      faultrow.innerHTML = val[0];
      faultrow.addEventListener(`click`, importFault);
      daterow.innerHTML = date;
    }
    catch (e) { return e }
  });
  const imported = document.createElement('script');
  imported.src = 'js/ext/sorttable.js';
  document.head.appendChild(imported);
}


