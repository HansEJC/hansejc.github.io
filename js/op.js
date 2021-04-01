async function delivery() {
  document.getElementById("SEAR").value = getSavedValue("SEAR");    // set the value to this input
  document.getElementById("PASS").value = getSavedValue("PASS");    // set the value to this input

  document.querySelectorAll('input[type="radio"]').forEach(rad => {
    rad.checked = (getSavedValue(rad.id) == "true");
  });

  // await code here
  let ARegcsv =  await fetch("Orion Park/assets-Asset List.csv").then(result => result.text());
  let DRpcsv =  await fetch("Orion Park/op-Project Stock.csv").then(result => result.text());
  let DRwcsv = await fetch("Orion Park/op-Warehouse Stock .csv").then(result => result.text());
  let DRcsv = await fetch("Orion Park/op-Delivery.csv").then(result => result.text());
  let lastmod = new Date(await fetch("Orion Park/mod.txt").then(result => result.text()));
  let lastfetch = await fetch("Orion Park/op-Delivery.csv").then(result => result.headers.get('Last-Modified'));
  // code below here will only execute when await fetch() finished loading
  document.getElementById("p").textContent =`Last Updated: ${new Date (lastmod)}`;
  document.getElementById("pp").textContent =`Last Checked: ${new Date(lastfetch)}`;
  AReg = Papa.parse(ARegcsv).data.reverse();
  DRp = Papa.parse(DRpcsv).data.reverse();
  DRw = Papa.parse(DRwcsv).data;
  DR = Papa.parse(DRcsv).data.reverse();
  for(let i = 0; i < AReg.length; i++){
    if(AReg[i][0] == "" || new RegExp("asset","i").test(AReg[i][0]) || new RegExp("undefined","i").test(AReg[i][0])){
      AReg.splice(i,1);
      i--;
    }
  }
  for(let i = 0; i < DRp.length; i++){
    if(DRp[i][5] == "" || new RegExp("date","i").test(DRp[i][5]) || new RegExp("undefined","i").test(DRp[i][5])){
      DRp.splice(i,1);
      i--;
    }
  }
  for(let i = 0; i < DRw.length; i++){
    if(DRw[i][7] == ""|| new RegExp("location","i").test(DRw[i][7]) || new RegExp("undefined","i").test(DRw[i][7])){
      DRw.splice(i,1);
      i--;
    }
  }
  for(let i = 0; i < DR.length; i++){
    if(DR[i][0] == ""|| new RegExp("date","i").test(DR[i][0]) || new RegExp("workshop","i").test(DR[i][0])){
      DR.splice(i,1);
      i--;
    }
  }
  ifsy(AReg,DRp,DRw,DR);
  return {AReg,DRp,DRw,DR};
}

function ifsy(AReg,DRp,DRw,DR){
  if (document.getElementById("AReg").checked) search(AReg);
  else if (document.getElementById("PStock").checked) search(DRp);
  else if (document.getElementById("WStock").checked) search(DRw);
  else {search(DR); document.getElementById("Del").checked = true;}
}

function search(arrheh){
  var pn = document.getElementById("SEAR").value;
  var pw = document.getElementById("PASS").value;
  pn = pn.toLowerCase().split(" ");
  var myArray = arrheh;
  myArray = myArray.map(e => e.join(','));//remove undefined row
  var npr = myArray.length; //number of rows
  var sArray = [];
  for(var i = 0; i < npr; i++){
    if(typeof myArray[i][8] === "undefined"){
      myArray[i][8] = "";
    }//search
  }

  //fix the headaches when creating a new RegExp
  RegExp.quote = function(str) {
    return str.replace(/[.*+\-?^${}()[\]\\]/g, "\\$1");
  };

  sArray = myArray.filter(s => pn.every(v => s.toLowerCase().includes(v)))
    .map(e => {
      if(pn[0].length>0) e = e.replace(new RegExp(RegExp.quote(pn.join('|')),'gi'), x => `<mark>${x}</mark>`);
      return e.split(',');
    });
  
  let myTable = document.getElementById("Del").checked
  ? searchDel(sArray)
  : document.getElementById("AReg").checked
  ? searchAsset(sArray)
  : searchOther(sArray);

  myTable+="</table>";
  if(pw == "asdfasdf") document.getElementById('tab').innerHTML = myTable;
  else document.getElementById('tab').innerHTML = "";
}

function searchAsset(sArray) {
  let myTable= `<table class="orionPark">
    <tr><th>Description</th>
    <th>ID</th>
    <th>Purchase Date</th>
    <th>Price</th>
    <th>Supplier</th>
    <th>Comment</th></tr>`;
  for(let i = 0; i < Math.min(50,sArray.length); i++){
    myTable+=`<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][3]}</td>
      <td>${sArray[i][4]}</td>
      <td>${sArray[i][5]}</td>
      <td>${sArray[i][6]}</td></tr>`;
  }
  return myTable;
}

function searchDel(sArray) {
  let myTable= `<table class="orionPark">
    <tr><th>Date</th>
    <th>Time</th>
    <th>Supplier</th>
    <th>Comments</th>
    <th>Project</th>
    <th>PO #</th></tr>`;
  for(let i = 0; i < Math.min(50,sArray.length); i++){
    let len = sArray[i][8].includes(`</`) ? 16 : 3;
    let shifty = sArray[i][8].length > len;
    let comm = shifty ? `${sArray[i][7]} ${sArray[i][8]}` : sArray[i][7];
    let proj = shifty ? `` : sArray[i][8].substring(0,len);
    myTable+=`<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][4]}</td>
      <td>${comm}</td>
      <td>${proj}</td>
      <td>${sArray[i][9]}</td></tr>`;
  }
  return myTable;
}

function searchOther(sArray) {
  let myTable= `<table class="orionPark">
    <tr><th>Part #</th>
    <th>Description</th>
    <th>Quantity</th>
    <th>Date</th>
    <th>Location</th>
    <th>Comment</th></tr>`;
  for(let i = 0; i < Math.min(200,sArray.length); i++){
    myTable+=`<tr><td>${sArray[i][0]}</td>
      <td>${sArray[i][1]}</td>
      <td>${sArray[i][2]}</td>
      <td>${sArray[i][5]}</td>
      <td>${sArray[i][7]}</td>
      <td>${sArray[i][8]}</td></tr>`;
  }
  return myTable;
}

//startup
let AReg,DRp,DRw,DR;
(async function() {({DRp,DRw,DR} = await delivery())})();
document.onkeyup = function() {
  ifsy(AReg,DRp,DRw,DR);
};
document.onchange = function() {
  ifsy(AReg,DRp,DRw,DR);
};