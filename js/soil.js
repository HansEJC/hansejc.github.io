function calculations() {
	document.getElementById("NPR").value = getSavedValue("NPR");    // set the value to this input

	var npr = Number(getSavedValue("NPR"));    // set the value to this input	
	if (npr=="") npr = 11;
	var cb = []; var cb2 = []; var cb3 = [];	
	var cbh = document.getElementById('Dist'); var cbh2 = document.getElementById('Stan'); var cbh3 = document.getElementById('Stiv');
	if (npr < 100){
		for(var i = 0; i < npr; i++){
			cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('span');
			cb[i].type = 'number'; cb2[i].type = 'number';
			cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]); cbh3.appendChild(cb3[i]);
			cb[i].id = i; cb2[i].id = i+npr; cb3[i].id = i+2*npr;	cb3[i].className = "label";
		}
	}
	else{
		cb[0] = document.createElement('input'); cb2[0] = document.createElement('input'); cb3[0] = document.createElement('input');
		cb[0].type = 'text'; cb2[0].type = 'text'; cb3[0].type = 'text';
		cb[0].value = 'bad human!'; cb2[0].value = 'bad human!'; cb3[0].value = 'bad human!';
		cbh.appendChild(cb[0]); cbh2.appendChild(cb2[0]); cbh3.appendChild(cb3[0]);
	}
}

function soil() {
	document.getElementById("NPR").value = getSavedValue("NPR");    // set the value to this input
	document.getElementById("TLOC").value = getSavedValue("TLOC");    // set the value to this input
	var npr = Number(document.getElementById("NPR").value);    // set the value to this input 
	if (npr=="") {
		npr = 11;
		document.getElementById("NPR").value = 11;
	}
	var stiv = 0;
	var dis,stan;
	var soilarr = [];
	for(var i = 0; i < npr; i++){
		dis = Number(document.getElementById(i).value);
		stan = Number(document.getElementById(i+npr).value);
		stiv = dis*stan*2*Math.PI;
		document.getElementById(i+npr*2).textContent = +stiv.toFixed(2)+" Ωm";
		soilarr.push([dis,stan,stiv]);
	}
	//console.table(soilarr);
	return soilarr;
}

function table(){
	var myArray = soil();
    var myTable= "<table><col width='100'><col width='100'><col width='100'><tr><th>Distance (m)</th>";
    myTable+= "<th>Resistance (Ω)</th>";
    myTable+="<th>Resistivity (Ωm)</th></tr>";
	
	var npr = Number(document.getElementById("NPR").value);
	if (npr=="") npr = 11;
	if (npr < 100){
		for(var i = 0; i < npr; i++){
			myTable+="<tr><td>" + myArray[i][0] + "</td>";
			myTable+="<td>" + myArray[i][1] + "</td>";
			myTable+="<td>" + +myArray[i][2].toFixed(2) + "</td></tr>";
		}
	}
	myTable+="</table>";
	if (document.getElementById("showTable").checked) document.getElementById('tab').innerHTML = myTable;
	else document.getElementById('tab').innerHTML = "";
}

function def() {
	document.getElementById("NPR").value = getSavedValue("NPR");    // set the value to this input
	var npr = Number(document.getElementById("NPR").value);    // set the value to this input 
	if (npr<2) npr = 11;
	try{
		document.getElementById(0).value = 0.2;
		document.getElementById(1).value = 0.4;
		document.getElementById(2).value = 0.8;
		document.getElementById(3).value = 1.6;
		document.getElementById(4).value = 3;
		document.getElementById(5).value = 5;
		document.getElementById(6).value = 10;
		document.getElementById(7).value = 15;
		document.getElementById(8).value = 20;
		document.getElementById(9).value = 25;
		document.getElementById(10).value = 30;	
	}catch(err) {console.log("the num of measurements is below 11 "+err);}
}

function def2() {
	document.getElementById("NPR2").value = getSavedValue("NPR2");    // set the value to this input

	var npr = Number(getSavedValue("NPR2"));    // set the value to this input	
	if (npr=="") {
		npr = 50;
		document.getElementById("NPR2").value = 50;
	}
	var cb = []; var cb2 = [];	
	var cbh = document.getElementById('Dist2'); var cbh2 = document.getElementById('Meas');
	for(var i = 100; i < 110; i++){
		cb[i] = document.createElement('input'); cb2[i] = document.createElement('input');
		cb[i].type = 'number'; cb2[i].type = 'number'; cb2[i].step = "0.001";
		cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]);
		cb[i].id = i; cb2[i].id = i+10; 
		document.getElementById(i).value = +(npr*((i-100)/10)).toFixed(1);
	}
	document.getElementById(106).value = +(npr*0.62).toFixed(1);
}

function plotFop() {
	var dis,meas;
	var foparr = [];
	for(var i = 100; i < 110; i++){
		dis = Number(document.getElementById(i).value);
		meas = Number(document.getElementById(i+10).value);
		if (meas == 0) meas =NaN;
		foparr.push([dis,meas]);
	}
	var fir = Number(document.getElementById(115).value),
		sec = Number(document.getElementById(116).value),
		thir = Number(document.getElementById(117).value);
	document.getElementById(115).className = 'info';document.getElementById(116).className = 'info';document.getElementById(117).className = 'info';
		
	if ((fir*1.05>=sec&&sec>=fir*0.95)&&(thir*1.05>=sec&&sec>=thir*0.95)) {
		document.getElementById("Meth").className = 'label safe'; 
		document.getElementById("Meth").textContent = 'Valid';
	}
	else {
		document.getElementById("Meth").className = 'label danger'; 
		document.getElementById("Meth").textContent = 'Invalid';
	}
	
	try {
		if (g3) g3.destroy();
	}catch(e){}
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),												
		foparr,
		{	
			labels: [ 'a', 'Resistance (Ω)'],
			xlabel: "Distance (m)",	
			ylabel: "Resistance (Ω)",
			legend: 'never',
			drawAxesAtZero: true,
			includeZero: true,
			axes: {
              x: {
				axisLabelFormatter: function(y) {
                  return  y + ' m';
                },
               // axisLabelWidth: 100 
              },
              y: {
                axisLabelFormatter: function(y) {
                  return  +y.toFixed(3) + ' Ω';
                },
                axisLabelWidth: 70
              }
			}
		}          // options
	  );
	  g3.ready(function() {
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 500); 
		
	});
	
	return foparr;
}

function rem() {
	const myNode = document.getElementById("Dist");
	myNode.innerHTML = '';
	const myNode2 = document.getElementById("Stan");
	myNode2.innerHTML = '';
	const myNode3 = document.getElementById("Stiv");
	myNode3.innerHTML = '';
}

function rem2() {
	const myNode = document.getElementById("Dist2");
	myNode.innerHTML = '';
	const myNode2 = document.getElementById("Meas");
	myNode2.innerHTML = '';
}

function exportToCsv(filename, rows) {
	var processRow = function (row) {
		var finalVal = '';
		for (var j = 0; j < row.length; j++) {
			var innerValue = row[j] === null ? '' : row[j].toString();
			if (row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
			};
			var result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0)
				result = '"' + result + '"';
			if (j > 0)
				finalVal += ',';
			finalVal += result;
		}
		return finalVal + '\n';
	};

	var csvFile = '';
	for (var i = 0; i < rows.length; i++) {
		csvFile += processRow(rows[i]);
	}

	var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, filename);
	} else {
		var link = document.createElement("a");
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
	
	//Export to database
	var db = "soil";
	if (filename.includes("FOP")) db = "fop";
	var tloc = document.getElementById('TLOC').value.split(' ').join('_');
	
    $.post("./soildb.php?=v1.0",
    {	
		datab: db,
		tabl: tloc,
        distance: transpose(rows)[0],
        res: transpose(rows)[1],
    },
    function(data,status){
        if (filename.includes("FOP")) {
			document.getElementById("span2").innerHTML = data;
			$( "#span2" ).fadeIn(200);
			setTimeout(function(){
				$( "#span2" ).fadeOut(500);
			}, 3000);
		}
		else {
			document.getElementById("span1").innerHTML = data;
			$( "#span1" ).fadeIn(200);
			setTimeout(function(){
				$( "#span1" ).fadeOut(500);
			}, 3000);
		}
    });
	
}

//flip array
function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}