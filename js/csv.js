function addLoader(html,err){
	let div = document.createElement('div'); 
	let graphdiv = document.getElementById("graphdiv3");
	let errdiv = document.getElementById("err");
	if (err) {
		document.querySelectorAll("#error").forEach(x => x.parentNode.removeChild(x));
		errdiv.insertBefore(div,errdiv.firstChild); 
		div.innerHTML="<center>"+html+"</center>";
		div.id="error";
		_('#error').fade('in', 300);
        setTimeout(() => {
			_('#error').fade('out', 500);
		}, 3000);
	}
	if (!err) {
		graphdiv.innerHTML="<center>"+html+"</center>";
		div.classList.add("loader");
		graphdiv.appendChild(div); 
	}
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

function chooseOptions(){
	//options		
	const options = document.getElementById("options"); options.innerHTML='<b>Options</b>';
	addOption('fillGraph', 'Fill Graph');
	addOption('plotter', 'Smooth Plotter',false,'smoothPlotter');
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
}

function addOption(opt, desc, bool, plotter) {
	const newopt = document.createElement('input');newopt.id=opt;newopt.type='checkbox';newopt.checked=bool;
	const label = document.createElement("Label");label.setAttribute("for",opt);label.innerHTML = desc;
	options.appendChild(label);	label.appendChild(newopt);
	function updateOps (e){
		eval('g3.updateOptions({'+e.target.id+':'+e.target.checked+'});');		
	}
	function updatePlotter (e){
		if (e.target.checked) eval('g3.updateOptions({'+e.target.id+':'+plotter+'});');		
		else eval('g3.updateOptions({'+e.target.id+': Dygraph.Plotters.linePlotter});');
	}		
	if (plotter != undefined) newopt.addEventListener('change', updatePlotter);
	else newopt.addEventListener('change', updateOps);
}

function inputsNfunc(db){
	document.getElementById("99").checked = (getSavedValue("99") == "true"); //remember if start date is checked
	document.getElementById("99").onchange = function(){saveRadio(this);read(db);};
	document.getElementById("dat").onblur = function(){saveValue(this);read(db);};
	document.getElementById("datR").onblur = function(){saveValue(this);read(db);};
	document.getElementById("eqcheck").onchange = function(){saveRadio(this);read(db);};
	document.getElementById("LabR").value = getSavedValue("Labr");	
	document.getElementById("dat").value = getSavedValue("dat");	
	document.getElementById("datR").value = getSavedValue("datR");
	localStorage.setItem(document.getElementById("eqcheck").id,false); //uncheck equations with new file
	const radios = document.querySelectorAll("input[name=ArrayOrCSV]");
	radios.forEach(rad => rad.addEventListener('change',checkit));	
}

function startup(bool){
	var idbSupported = ("indexedDB" in window);
	var db;
	
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
				uploadcsv(db);
				if (bool) return;
				inputsNfunc(db);
				read(db);
			};
		}
		openRequest.onerror = function(e) {
			console.log("Error");
			console.dir(e);
		}
	}		
}

function uploadcsv(db){
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
			plotcalcs(filecontent,db);
		};
		reader.readAsText(evt.target.files[0]);	
		
		//put filename in span
		let fullPath = document.getElementById('my_upload').value;
		if (fullPath) {
			let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
			let filename = fullPath.substring(startIndex);
			if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				filename = filename.substring(1);
			}
			localStorage.setItem('Filename', filename);
		}
	};
}

function read(db) {
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
				var csv = await fetch('uploads/graph.csv').then(result => result.text());
				plotcalcs(csv,db);
			}
		}
	}
}
function plotcalcs(file,db) {
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
	csv = csv.map(i => i.map(j =>{
			return j == "null" ? null : +j;
		})); //loop through 2D array and map individual items
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
	document.getElementById("69").checked = true; //checkbox "Show" with new file

	save(csv,db);
	//setTimeout(dyg,1,(csv));
	plotexp(csv);
}
	//save to database
function save(data,db) {
	heh = [];
	heh = data.map(x => [...x]);
	var transaction = db.transaction(["plots"], "readwrite");
	var objectStore = transaction.objectStore("plots");
	var request = objectStore.put({id:1,'data':data});
	request.onsuccess = function(event) {
	//console.log(event.target)
	};
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
	var equ = [], /*eqw = [],*/ eqb = false;
	for (let i=1;i<csv[0].length;i++){
		equ[i] = document.createElement('input');	
		equ[i].type = 'text';
		equ[i].value = getSavedValue(String.fromCharCode(96+i)) == "" ? String.fromCharCode(96+i) : getSavedValue(String.fromCharCode(96+i));
		//eqw[i-1] = equ[i].value;
		equ[i].id = String.fromCharCode(96+i);
		equ[i].onkeyup = function(){saveValue(this);};
		eqh.appendChild(equ[i]);
	}

	//column equations
	function arrayequations() {
		for (let i=0;i<csv.length;i++){		
			for (let j=1;j<csv[i].length;j++){	
				window[String.fromCharCode(96+j)] = csv[i][j];
				csv[i][j] = eval(document.getElementById(String.fromCharCode(96+j)).value);
			}
		}
	}	
	document.getElementById("eqcheck").checked = (getSavedValue("eqcheck") == "true");
	if (document.getElementById("eqcheck").checked){ eqb = true;
		addLoader("Calculating Equations");
		setTimeout(() => {arrayequations()},1);
	}
	
	setTimeout(() => {dyg(csv)},1);
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
	const smoothdec = (a) => +(parseFloat(a).toFixed(6)); //fix broken decimals
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),
		csv,
		{		
			xlabel: document.getElementById("xaxis").value,	
			ylabel: document.getElementById("yaxis").value,	
			connectSeparatedPoints: document.getElementById("CSVF").checked,
			legend: 'always',
			includeZero: true,
			showRoller: true,
			axes: {
              x: {
				axisLabelFormatter: function(y, gran, opts) {
					return  y instanceof Date ? Dygraph.dateAxisLabelFormatter(y, gran, opts) : smoothdec(y);
                },
              },
              y: {
				axisLabelFormatter: function(y) {
                  return  smoothdec(y);
                },
              },
			}          
		}          // options
	);	
	g3.ready(dygReady);
}
function dygReady(){
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
		cb[i].id = 'csvcheckbox '+i; cb2[i].id = 'csvlabel'+i; col[i].id = 'csvcolor'+i; 
		cb2[i].value = lbs[i]; 
		col[i].value = rgbToHex(colors[i]);		
		cb2[i].className = "idents";
		cb[i].checked = true;
		cb[i].onchange = function(){change(this);}; cb2[i].onblur = function(){saveValue(this); idents(lbs.length);};
	}	
	const colorNode = document.querySelectorAll("input[type=color]");
	colorNode.forEach(col => col.addEventListener('change',colorUpdate));
	idents(lbs.length);
	
	chooseOptions();
	document.getElementById("69").onchange = (() => UncheckAll('MyForm'));
	setTimeout(function(){
		window.dispatchEvent(new Event('resize'));
		document.getElementById("myForm").innerHTML= "<input type='file' accept='.csv' id='my_upload' name='my_upload'/><span id='FullFile'></span></b>"; // Resets input to be able to upload same file.			
		document.querySelector('#FullFile').innerText = localStorage.getItem('Filename');
		startup(true);
	}, 500); 	
}

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
	g3.setVisibility(el.id.split(' ')[1], el.checked);
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
		labd = document.getElementById('csvlabel'+i);
		colors = document.getElementById('csvcolor'+i);
		labd.value = getSavedValue('csvlabel'+i) == "" ? labd.value : getSavedValue('csvlabel'+i);
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


//below code was taken from <script src="https://dygraphs.com/src/extras/smooth-plotter.js"></script>
function getControlPoints(p0, p1, p2, opt_alpha, opt_allowFalseExtrema) {
  var alpha = (opt_alpha !== undefined) ? opt_alpha : 1/3;  // 0=no smoothing, 1=crazy smoothing
  var allowFalseExtrema = opt_allowFalseExtrema || false;

  if (!p2) {
    return [p1.x, p1.y, null, null];
  }

  // Step 1: Position the control points along each line segment.
  var l1x = (1 - alpha) * p1.x + alpha * p0.x,
      l1y = (1 - alpha) * p1.y + alpha * p0.y,
      r1x = (1 - alpha) * p1.x + alpha * p2.x,
      r1y = (1 - alpha) * p1.y + alpha * p2.y;

  // Step 2: shift the points up so that p1 is on the l1–r1 line.
  if (l1x != r1x) {
    // This can be derived w/ some basic algebra.
    var deltaY = p1.y - r1y - (p1.x - r1x) * (l1y - r1y) / (l1x - r1x);
    l1y += deltaY;
    r1y += deltaY;
  }

  // Step 3: correct to avoid false extrema.
  if (!allowFalseExtrema) {
    if (l1y > p0.y && l1y > p1.y) {
      l1y = Math.max(p0.y, p1.y);
      r1y = 2 * p1.y - l1y;
    } else if (l1y < p0.y && l1y < p1.y) {
      l1y = Math.min(p0.y, p1.y);
      r1y = 2 * p1.y - l1y;
    }

    if (r1y > p1.y && r1y > p2.y) {
      r1y = Math.max(p1.y, p2.y);
      l1y = 2 * p1.y - r1y;
    } else if (r1y < p1.y && r1y < p2.y) {
      r1y = Math.min(p1.y, p2.y);
      l1y = 2 * p1.y - r1y;
    }
  }

  return [l1x, l1y, r1x, r1y];
}

// i.e. is none of (null, undefined, NaN)
function isOK(x) {
  return !!x && !isNaN(x);
}

// A plotter which uses splines to create a smooth curve.
// Can be controlled via smoothPlotter.smoothing
function smoothPlotter(e) {
  var ctx = e.drawingContext,
      points = e.points;

  ctx.beginPath();
  ctx.moveTo(points[0].canvasx, points[0].canvasy);

  // right control point for previous point
  var lastRightX = points[0].canvasx, lastRightY = points[0].canvasy;

  for (var i = 1; i < points.length; i++) {
    var p0 = points[i - 1],
        p1 = points[i],
        p2 = points[i + 1];
    p0 = p0 && isOK(p0.canvasy) ? p0 : null;
    p1 = p1 && isOK(p1.canvasy) ? p1 : null;
    p2 = p2 && isOK(p2.canvasy) ? p2 : null;
    if (p0 && p1) {
      var controls = getControlPoints({x: p0.canvasx, y: p0.canvasy},
                                      {x: p1.canvasx, y: p1.canvasy},
                                      p2 && {x: p2.canvasx, y: p2.canvasy},
                                      smoothPlotter.smoothing);
      lastRightX = (lastRightX !== null) ? lastRightX : p0.canvasx;
      lastRightY = (lastRightY !== null) ? lastRightY : p0.canvasy;
      ctx.bezierCurveTo(lastRightX, lastRightY,
                        controls[0], controls[1],
                        p1.canvasx, p1.canvasy);
      lastRightX = controls[2];
      lastRightY = controls[3];
    } else if (p1) {
      // We're starting again after a missing point.
      ctx.moveTo(p1.canvasx, p1.canvasy);
      lastRightX = p1.canvasx;
      lastRightY = p1.canvasy;
    } else {
      lastRightX = lastRightY = null;
    }
  }

  ctx.stroke();
}
smoothPlotter.smoothing = 1/3;
smoothPlotter._getControlPoints = getControlPoints;  // for testing
window.smoothPlotter = smoothPlotter;
Dygraph.smoothPlotter = smoothPlotter;

//startup
labels();									
startup();