fireBase();

function getFaults() {
  const dbObj = firebase.database().ref(`faults`);
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
  while (table.childElementCount > 1) { //don't remove the firstborn children
    table.removeChild(table.lastElementChild);
  }
  while (table.firstElementChild.childElementCount > 1) { //don't remove the firstborn children
    table.firstElementChild.removeChild(table.firstElementChild.lastChild);
  }
  faults = Object.entries(faults);
  faults.forEach(val => {
    try {
      const row = table.insertRow(-1);
      const titstuff = val[0].split(`,`);
      const faultrow = row.insertCell(0);
      const daterow = row.insertCell(1);
      const timerow = row.insertCell(2);
      const noterow = row.insertCell(3);
      faultrow.innerHTML = val[0];
      faultrow.addEventListener(`click`, importFault);
      daterow.innerHTML = titstuff[1].replace(/-/g, `/`);
      timerow.innerHTML = titstuff[2].replace(/-/g, `.`);
      noterow.innerHTML = val[1].notes;
      noterow.contentEditable = true;
      noterow.addEventListener(`focusout`, updateNotes);
    }
    catch (e) { return e }
  });
  addsortable();
}

function updateNotes(content) {
  const dbObj = firebase.database().ref(`relay/${content.target.parentElement.firstChild.innerHTML}`);
  const dbObj2 = firebase.database().ref(`faults/${content.target.parentElement.firstChild.innerHTML}`);
  const notes = content.target.innerText;
  notes === `delete` ? dbObj.remove() & dbObj2.remove() : dbObj2.update({ notes });
}

function addsortable() {
  let imported = document.createElement('script');
  imported.src = 'js/ext/sorttable.js';
  if (document.querySelector(`script[src="js/ext/sorttable.js"]`)) document.querySelector(`script[src="js/ext/sorttable.js"]`).remove();
  document.head.appendChild(imported);
}

