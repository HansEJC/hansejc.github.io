async function delivery() {
	document.getElementById("SEAR").value = getSavedValue("SEAR");    // set the value to this input
	document.getElementById("PASS").value = getSavedValue("PASS");    // set the value to this input
		
	document.querySelectorAll('input[type="radio"]').forEach(rad => {
		rad.checked = (getSavedValue(rad.id) == "true");
	});
	
	// await code here
	DRp = [];	
	DRw = [];	
	DR = [];	
	let DRpcsv = await makeRequest("GET", "Orion Park/op-Project Stock.csv");
	let DRwcsv = await makeRequest("GET", "Orion Park/op-Warehouse Stock .csv");
	let DRcsv = await makeRequest("GET", "Orion Park/op-Delivery.csv");
	let lastmod = await fetchHeader("Orion Park/op.xlsx", 'Last-Modified');
	let lastfetch = await fetchHeader("Orion Park/op-Delivery.csv", 'Last-Modified');
	// code below here will only execute when await makeRequest() finished loading
	document.getElementById("p").textContent ="Last Updated: "+ new Date (lastmod);
	document.getElementById("pp").textContent ="Last Checked: "+ new Date(lastfetch);
	DRp = Papa.parse(DRpcsv).data.reverse();
	//for(let i = 0; i<3; i++) DRp.shift(); //remove first rows
	DRw = Papa.parse(DRwcsv).data;
	//for(let i = 0; i<5; i++) DRw.shift(); //remove first rows
	DR = Papa.parse(DRcsv).data.reverse();
	//console.table(DR);
	//for(let i = 0; i<5; i++) DR.shift(); //remove first rows
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
	ifsy();
}

function ifsy(){
	if (document.getElementById("PStock").checked) search(DRp);
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
						 if(pn[0].length>0) e = e.replace(new RegExp(RegExp.quote(pn.join('|')),'gi'), x => '<mark>'+x+'</mark>');
						 return e.split(',');
					});
	//console.table(sArray);	
	
	if(document.getElementById("Del").checked){
		//create table
		var myTable= "<table><col width='10'><col width='10'><col width='10'><col width='10'><col width='10'><col width='10'><tr><th>Date</th>";
		myTable+= "<th>Time</th>";
		//myTable+= "<th>Courier</th>";
		//myTable+= "<th>Tracking #</th>";
		myTable+= "<th>Supplier</th>";
	   // myTable+= "<th># of Boxes</th>";
	   // myTable+= "<th>Pallets</th>";
		myTable+= "<th>Comments</th>";
		myTable+= "<th>Project</th>";
		myTable+="<th>PO #</th></tr>";
		
		for(var i = 0; i < sArray.length; i++){
			myTable+="<tr><td>" + sArray[i][0] + "</td>";
			myTable+="<td>" + sArray[i][1] + "</td>";
			//myTable+="<td>" + sArray[i][2] + "</td>";
			//myTable+="<td>" + sArray[i][3] + "</td>";
			myTable+="<td>" + sArray[i][4] + "</td>";
			//myTable+="<td>" + sArray[i][5] + "</td>";
			//myTable+="<td>" + sArray[i][6] + "</td>";
			myTable+="<td>" + sArray[i][7] + "</td>";
			myTable+="<td>" + sArray[i][8] + "</td>";
			myTable+="<td>" + sArray[i][9] + "</td></tr>";
		}
	}
	
	else{
			//create table
		var myTable= "<table><col width='10'><col width='10'><col width='10'><col width='10'><col width='10'><tr><th>Part #</th>";
		myTable+= "<th>Description</th>";
		myTable+= "<th>Quantity</th>";
		myTable+= "<th>Date</th>";
		myTable+= "<th>Location</th>";
		myTable+="<th>PO #</th></tr>";
		
		for(var i = 0; i < sArray.length; i++){
			myTable+="<tr><td>" + sArray[i][0] + "</td>";
			myTable+="<td>" + sArray[i][1] + "</td>";
			myTable+="<td>" + sArray[i][2] + "</td>";
			myTable+="<td>" + sArray[i][5] + "</td>";
			myTable+="<td>" + sArray[i][7] + "</td>";
			myTable+="<td>" + sArray[i][8] + "</td></tr>";
		}
	}

	myTable+="</table>";
	if(pw == "asdfasdf") document.getElementById('tab').innerHTML = myTable;
	else document.getElementById('tab').innerHTML = "";
}

function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
				
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function fetchHeader(url, wch) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("HEAD", url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.getResponseHeader(wch));
            } else {
                resolve("June 28 1998");
            }
        };
        xhr.onerror = function () {
            resolve("June 28 1998");
        };
        xhr.send();
    });
}

//startup
delivery();
document.onkeyup = function() {							
	ifsy();								
};