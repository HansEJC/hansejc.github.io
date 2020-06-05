//"use strict";

//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e){
	var id = e.id;  // get the sender's id to save it . 
	var val = e.value; // get the value. 
	localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveRadio(e){
	var id = e.id;  // get the sender's id to save it . 
	var val = e.checked; // get the value. 
	localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

//get the saved value function - return the value of "v" from localStorage. 
function getSavedValue  (v){
	if (!localStorage.getItem(v)) {
		return "";// You can change this to your defualt value. 
	}
	return localStorage.getItem(v);
}

function addLoader(html,err){
	let div = document.createElement('div'); 
	let graphdiv = document.getElementById("graphdiv3");
	let errdiv = document.getElementById("err");
	if (err) {
		document.querySelectorAll("#error").forEach(x => x.parentNode.removeChild(x));
		errdiv.insertBefore(div,errdiv.firstChild); 
		div.innerHTML="<center>"+html+"</center>";
		div.id="error";
		$( "#error" ).fadeIn(300);
        setTimeout(() => {
			$( "#error" ).fadeOut(500);
		//div.innerHTML="";
		}, 3000);
	}
	if (!err) {
		graphdiv.innerHTML="<center>"+html+"</center>";
		div.classList.add("loader");
		graphdiv.appendChild(div); 
	}
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

function labels(){		
	document.getElementById("xaxis").value = getSavedValue("xaxis");    // set the value to this input
	document.getElementById("yaxis").value = getSavedValue("yaxis");   // set the value to this input
}

function checkit() {
	this.checked = true;
	if (this.id == 'CSVF') document.getElementById("hide").style.display = "none";
	else document.getElementById("hide").style.display = "block";
}

function colorUpdate() {
	const colorNode = document.querySelectorAll("input[type=color]");
	let colArr = [...colorNode];
	colArr = colArr.map(col => col.value);
	g3.updateOptions({
		colors: colArr
	});
}

function addOption(opt, desc, bool) {
	const newopt = document.createElement('input');newopt.id=opt;newopt.type='checkbox';newopt.checked=bool;newopt.addEventListener('change', updateOps);
	const label = document.createElement("Label");label.setAttribute("for",opt);label.innerHTML = desc;
	options.appendChild(label);	label.appendChild(newopt);
	function updateOps (e){
		eval('g3.updateOptions({'+e.target.id+':'+e.target.checked+'});');		
	}
}

function javaread(bool){
	var idbSupported = false;
	var db;
	 if("indexedDB" in window) {
		idbSupported = true;
	}

	if(idbSupported) {
		var openRequest = indexedDB.open("graph",1);

		openRequest.onupgradeneeded = function(e) {
			console.log("Upgrading...");
			db = e.target.result;

			if(!db.objectStoreNames.contains("plots")) {
				db.createObjectStore("plots", { keyPath: "id",autoIncrement:true});
			}
		}
		openRequest.onsuccess = function(e) {
			db = e.target.result;
			var transaction = db.transaction(["plots"]);
			var objectStore = transaction.objectStore("plots");
			var request = objectStore.get("2");
			request.onerror = function(event) {
			  // Handle errors!
			};
			request.onsuccess = function(event) {
			  //console.log(request);
				uploadcsv();
				if (bool) return;
				read();
			};
		}
		openRequest.onerror = function(e) {
			console.log("Error");
			console.dir(e);
		}
	}
	document.getElementById("99").checked = (getSavedValue("99") == "true"); //remember if start date is checked
	document.getElementById("99").onchange = function(){saveRadio(this);read();};
	document.getElementById("dat").onblur = function(){saveValue(this);read();};
	document.getElementById("datR").onblur = function(){saveValue(this);read();};
	document.getElementById("eqcheck").onchange = function(){saveRadio(this);read();};
	document.getElementById("LabR").value = getSavedValue("Labr");	
	document.getElementById("dat").value = getSavedValue("dat");	
	document.getElementById("datR").value = getSavedValue("datR");
	localStorage.setItem(document.getElementById("eqcheck").id,false); //uncheck equations with new file
	const radios = document.querySelectorAll("input[name=ArrayOrCSV]");
	radios.forEach(rad => rad.addEventListener('change',checkit));
	
	function uploadcsv(){
		document.forms['myForm'].elements['my_upload'].onchange = function(evt) {
			addLoader("Uploading csv");
			if(!window.FileReader) return; // Browser is not compatible
			
			var reader = new FileReader();

			reader.onload = function(evt) {
				if(evt.target.readyState != 2) return;
				if(evt.target.error) {
					console.log('Error while reading file');
					return;
				}
				var filecontent = evt.target.result;
				if (document.getElementById("CSVF").checked) {
					try {//the for loop removes saved labels
						const len = filecontent.split("\n")[0].split(",").length;
						for (let i=len;i<len*2;i++) localStorage.removeItem(i);
						return dyg(filecontent); 
					}catch (err) {console.log(err);addLoader("CSV Formatting Error, Attempting to Process Upload.",true);}
				}
				document.getElementById("PrUp").checked = true;
				plotcalcs(filecontent);
			};
			reader.readAsText(evt.target.files[0]);		
		};
	}
	
	function read() {
		try{
			addLoader("Reading Data from Variable");
			var arr = heh.map(x => [...x]);
			plotexp(arr);
			arr = [];
		}
		catch(err){
			addLoader("Reading and Loading Data from IndexDB");
			var transaction = db.transaction(["plots"], "readonly");
			var objectStore = transaction.objectStore("plots");
			objectStore.openCursor(null, "prev").onsuccess = async function(event) {
				try{
					var cursor = event.target.result.value.data;
					heh =[];
					heh = cursor.map(x => [...x]);
					plotexp(cursor);
				}catch(err){
					console.log(err);
					addLoader("Calculations or Data Error. Uploading Default Graph.",true);
					var csv = await makeRequest("GET", "uploads/graph.csv");
					plotcalcs(csv);
				}
			}
		}
	}
	function plotcalcs(file) {
		var csv = file;
		csv = Papa.parse(csv).data
		addLoader("Formatting Data");
		try{
			while (csv[csv.length-1].length != csv[csv.length-5].length){
			//while (csv[csv.length-1] == ""){
				csv.splice(csv.length-1,1)// remove empty ends
			}
		}catch(e){console.log(e);}
		
		for (let i=0;i<csv.length;i++){		//make all rows have equal numbers to bottom row
			if (csv[i].length != csv[csv.length-1].length){
				csv.splice(i,1);
				i--;
			}
		}	
		csv = csv.map(i => i.map(Number)); //loop through 2D array and map individual items
		for (var i=0;i<csv.length;i++){		//eliminate not numbers	
			for (var j=0;j<csv[i].length;j++){		//eliminate not numbers
				if (isNaN(csv[i][j])){
					csv[i].splice(j,1);
					j--;
				}	
			}
			if (csv[i] === undefined || csv[i].length == 0){
				csv.splice(i,1);
				i--;
			}
		}	
		localStorage.setItem(document.getElementById("eqcheck").id,false); //uncheck equations with new file
	
		save(csv);
		//setTimeout(dyg,1,(csv));
		plotexp(csv);
	}
		//save to database
	function save(data) {
		heh = [];
		heh = data.map(x => [...x]);
		var transaction = db.transaction(["plots"], "readwrite");
		var objectStore = transaction.objectStore("plots");
		var request = objectStore.put({id:1,'data':data});
		request.onsuccess = function(event) {
		//console.log(event.target)
		};
	}
}

function plotexp(file){
	//show hidden options	
	var y = document.getElementById("hide");  
	y.style.display = "block";	
	
	var csv = file;
	
	var dat = new Date(), datb = false;
	var datrate = 1000;	//one second
	if (document.getElementById("dat").value != "") dat = new Date(document.getElementById("dat").value);
	if (document.getElementById("datR").value != "") datrate = Number(document.getElementById("datR").value)*1000;
	if (document.getElementById("99").checked) { //set own start date and increment
		addLoader("Adding Custom Dates");
		for (let i=0;i<csv.length;i++){	
			csv[i].unshift(new Date(dat.setTime(dat.getTime()+datrate)));
			//dat.setTime(dat.getTime()+1000
		}
	}
	
	try{
		while (document.getElementById("equa").childElementCount>2) { //don't remove the firstborn children
			document.getElementById("equa").removeChild(document.getElementById("equa").lastChild);
		}
	}catch(err){}
	
	//add equation inputs
	var eqh = document.getElementById('equa');
	var equ = [], eqw = [], eqb = false;
	for (let i=1;i<csv[0].length;i++){
		equ[i] = document.createElement('input');	
		equ[i].type = 'text';
		equ[i].value = getSavedValue(String.fromCharCode(96+i)) == "" ? String.fromCharCode(96+i) : getSavedValue(String.fromCharCode(96+i));
		eqw[i-1] = equ[i].value;
		equ[i].id = String.fromCharCode(96+i);
		equ[i].onkeyup = function(){saveValue(this);};
		eqh.appendChild(equ[i]);
	}

	//column equations
	let size = 0;
	function arrayequations() {
		for (let i=0;i<csv.length;i++){		
			for (let j=1;j<csv[i].length;j++){	
				//eval("var "+ String.fromCharCode(96+j)+"= csv[i][j]");
				window[String.fromCharCode(96+j)] = csv[i][j];
			}
			for (let j=1;j<csv[i].length;j++){	
				csv[i][j] = eval(document.getElementById(String.fromCharCode(96+j)).value);
				size++;
			}
			/*if ((i/csv.length*100).toFixed(1) % 10 === 0) {
				setTimeout(() => {addLoader("Calculating Equations"+i/csv.length*100);},1);
			} */
		}
	}	
	document.getElementById("eqcheck").checked = (getSavedValue("eqcheck") == "true");
	if (document.getElementById("eqcheck").checked){ eqb = true;
		addLoader("Calculating Equations");
		arrayequations();
	}
	
	setTimeout(dyg,1,(csv));
	//setTimeout(()=> g3.updateOptions({file: csv}),10);
	
	/*if (typeof(worker) != "undefined") worker.terminate();
	worker = new Worker('js/worker.js');
	worker.postMessage([csv,eqw,datb,eqb]);
	worker.onmessage = (mess) => {
		//console.table(e.data);
		dyg(mess.data);
		worker.terminate();
		//worker = undefined;
	};*/
}

function dyg(csv) {
	/*Remove unused checkboxes*/
	try{
		const myNode = document.getElementById("MyForm");
		while (myNode.childElementCount>3) { //don't remove the firstborn children
			myNode.removeChild(myNode.lastChild);
		while (document.getElementById("ColorForm").childElementCount>1) { //don't remove the firstborn children
			document.getElementById("ColorForm").removeChild(document.getElementById("ColorForm").lastChild);
		}
		}
	}catch(err){}
	try {
		if (g3) g3.destroy();
	}catch(e){}
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),
		csv,
		{		
			xlabel: document.getElementById("xaxis").value,	
			ylabel: document.getElementById("yaxis").value,	
			connectSeparatedPoints: document.getElementById("CSVF").checked,
			legend: 'always',
			includeZero: true,
			showRoller: true          
		}          // options
	);
	
	g3.ready(function() {
		const lbs = g3.getLabels();
		const colors = g3.getColors();
		//lbs.pop();
		lbs.shift();
		var cb = [], cb2 = [], col = []; 	
		const cbh = document.getElementById('MyForm'), colF = document.getElementById('ColorForm');
		
		for(var i = 0; i < lbs.length; i++){
			cb[i] = document.createElement('input');cb2[i] = document.createElement('input'); col[i] = document.createElement('input'); 
			cb[i].type = 'checkbox';cb2[i].type = 'text'; col[i].type = 'color'; 
			cbh.appendChild(cb[i]);cbh.appendChild(cb2[i]); colF.appendChild(col[i]); 
			cb[i].id = i;cb2[i].id = i+lbs.length; col[i].id = i+2*lbs.length; 
			cb2[i].value = lbs[i]; 
			col[i].value = rgbToHex(colors[i]);		
			cb2[i].className = "idents";
			cb[i].checked = true;
			cb[i].onchange = function(){change(this);}; cb2[i].onblur = function(){saveValue(this); idents(lbs.length);};
		}	
		const colorNode = document.querySelectorAll("input[type=color]");
		colorNode.forEach(col => col.addEventListener('change',colorUpdate));
		idents(lbs.length);
		
		//options		
		const options = document.getElementById("options"); options.innerHTML='<b>Options</b>';
		addOption('fillGraph', 'Fill Graph');
		addOption('logscale', 'Log Scale');
		addOption('drawGrid', 'Show Grid',true);
		addOption('connectSeparatedPoints', 'Connect Points',true);
		addOption('drawPoints', 'Draw Points');
		addOption('stackedGraph', 'Stacked Graph');
		addOption('stepPlot', 'Step Plot');
		addOption('animatedZooms', 'Animated Zoom');
		addOption('labelsSeparateLines', 'One Line per Label');
		addOption('labelsKMB', 'Label Format');
		addOption('labelsKMB2', 'Label Format2');
		
		document.getElementById("69").onchange = (() => UncheckAll('MyForm'));
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
			document.getElementById("myForm").innerHTML= "<input type='file' accept='.csv' id='my_upload' name='my_upload'/>";
			javaread(true);
		}, 500); 
	});
	
	var xaxis = document.getElementById('xaxis');
	var yaxis = document.getElementById('yaxis');
	xaxis.onblur = () => { saveValue(this);
		g3.updateOptions({xlabel: xaxis.value});								
	};
	yaxis.onblur = () => { saveValue(this);
		g3.updateOptions({ylabel: yaxis.value});								
	};
		
	function rgbToHex(rgb) {
		const col = rgb.split(/[,)(]/);		
		const ToHex = (c) => {const hex = c.toString(16);return hex.length == 1 ? "0" + hex : hex;}
		return "#" + ToHex(+col[1]) + ToHex(+col[2]) + ToHex(+col[3]);
	}
	
	function change(el) {
		g3.setVisibility(el.id, el.checked);
	}
	
	function UncheckAll(elementID){
	  var _container = document.getElementById(elementID);
	  var _chks = _container.getElementsByTagName("INPUT");
	  var _numChks = _chks.length-1;
																									 
	  for(var i = 0; i < _numChks; i++){
		
		if(_chks[0].checked==false){
			_chks[i+1].checked=false;	
			g3.setVisibility(i);}
		else{ 
			_chks[i+1].checked=true;
			g3.setVisibility(i,true);}
		}												 													 
	}
	function idents(len){
		let labl = [], labd, colors;
		labl.push("boobs");
		
		for (var i=0; i < len;i++){
			labd = document.getElementById(i+len);
			colors = document.getElementById(i+len*2);
			labd.value = getSavedValue(i+len) == "" ? labd.value : getSavedValue(i+len);
			labl.push(labd.value);
			if (labd.value.length>0) {
				labd.style['width'] = (labd.value.length*8)+'px';
				colors.style['width'] = (Math.max(40,20+labd.value.length*8))+'px';
			}
		}
		g3.updateOptions({
			labels: labl
		});
	}
}

