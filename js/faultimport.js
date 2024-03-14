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
  const dbObj = firebase.database().ref(`relay/${fault.target.innerHTML},${fault.target.parentElement.children[1].innerHTML.replace(/\//g, `-`)},${fault.target.parentElement.children[2].innerHTML.replace(/\./g, `-`)}`);
  dbObj.once(`value`, snap => {
    const data = snap.val();
    localStorage.setItem(`filename`, fault.target.innerHTML.split(`,`)[0]);
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
  if (document.querySelector(`table`)) document.querySelector(`table`).remove();
  const table = document.createElement(`table`);
  table.classList.add(`orionPark`, `sortable`);
  const header = table.insertRow(-1);
  header.insertCell(0).outerHTML = `<th>Fault</th>`;
  header.insertCell(1).outerHTML = `<th>Date</th>`;
  header.insertCell(2).outerHTML = `<th>Time</th>`;
  header.insertCell(3).outerHTML = `<th>Notes</th>`;
  faults = Object.entries(faults);
  faults.forEach(val => {
    try {
      const row = table.insertRow(-1);
      const titstuff = val[0].split(`,`);
      const faultrow = row.insertCell(0);
      const daterow = row.insertCell(1);
      const timerow = row.insertCell(2);
      const noterow = row.insertCell(3);
      faultrow.innerHTML = titstuff[0];
      faultrow.addEventListener(`click`, importFault);
      daterow.innerHTML = titstuff[1].replace(/-/g, `/`);
      timerow.innerHTML = titstuff[2].replace(/-/g, `.`);
      noterow.innerHTML = val[1].notes;
      noterow.contentEditable = true;
      noterow.addEventListener(`focusout`, updateNotes);
    }
    catch (e) { return e }
  });
  document.querySelector(`#tab`).appendChild(table);
  addsortable();
}

function updateNotes(content) {
  const faultname = `${content.target.parentElement.firstChild.innerHTML},${content.target.parentElement.children[1].innerHTML.replace(/\//g, `-`)},${content.target.parentElement.children[2].innerHTML.replace(/\./g, `-`)}`;
  const dbObj = firebase.database().ref(`relay/${faultname}`);
  const dbObj2 = firebase.database().ref(`faults/${faultname}`);
  const notes = content.target.innerText;
  if (notes === `delete`) {
    dbObj.remove();
    dbObj2.remove();
  }
  else dbObj2.update({ notes });
}

function addsortable() {
  let imported = document.createElement('script');
  imported.src = 'js/ext/sorttable.js';
  if (document.querySelector(`script[src="js/ext/sorttable.js"]`)) document.querySelector(`script[src="js/ext/sorttable.js"]`).remove();
  document.head.appendChild(imported);
}
window.addEventListener("load", getFaults);