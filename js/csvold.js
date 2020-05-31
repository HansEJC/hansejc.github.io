//var d = new Date();
//var time=d.getTime();
function Redirect(){				
	document.location="csv.php?";//+time;				
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e){
	var id = e.id;  // get the sender's id to save it . 
	var val = e.value; // get the value. 
	localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveRadio(e){
	e.checkbox = true;
	var id1 = document.getElementById("Stan").id;  // get the sender's id to save it . 
	var ch1 = document.getElementById("Stan").checked; // get the value. 
	var id2 = document.getElementById("Fan").id;  // get the sender's id to save it . 
	var ch2 = document.getElementById("Fan").checked; // get the value. 
	var id3 = document.getElementById("Exp").id;  // get the sender's id to save it . 
	var ch3 = document.getElementById("Exp").checked; // get the value. 
	localStorage.setItem(id1, ch1);// Every time user writing something, the localStorage's value will override .  
	localStorage.setItem(id2, ch2);// Every time user writing something, the localStorage's value will override .  
	localStorage.setItem(id3, ch3);// Every time user writing something, the localStorage's value will override . 
	
	/*Remove unused checkboxes*/
	const myNode = document.getElementById("MyForm");
	while (myNode.childElementCount>3) { //don't remove the firstborn children
		myNode.removeChild(myNode.lastChild);
	}
	window.location.reload(false); 
}

//get the saved value function - return the value of "v" from localStorage. 
function getSavedValue  (v){
	if (!localStorage.getItem(v)) {
		return "";// You can change this to your defualt value. 
	}
	return localStorage.getItem(v);
}

function change(el) {
	g3.setVisibility(el.id, el.checked);
}
function UncheckAll(elementID){
  var _container = document.getElementById(elementID);
  var _chks = _container.getElementsByTagName("INPUT");
  var _numChks = _chks.length-1;
																								 
  for(var i = 0; i < _numChks; i++){
	//_type = _chks[i].getAttribute("type");
	
	if(_chks[0].checked==false){
		_chks[i+1].checked=false;	
		g3.setVisibility(i);}
	else{ 
		_chks[i+1].checked=true;
		g3.setVisibility(i,true);}
	}												 													 
}

function makeRequest(method, url) {
	var prog = document.getElementById('graphdiv3');
	var progtext = document.createElement('span');
	prog.appendChild(progtext);
	progtext.id = 0;
	var percentComplete;
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
		
		xhr.onprogress = function(event) {
			if (event.lengthComputable) {
				percentComplete = "Downloading: "+ Number((event.loaded/(1024*1024)).toFixed(2))+" MB of "
				+Number((event.total/(1024*1024)).toFixed(2))+" MB - "
				+Number((event.loaded / event.total).toFixed(2))*100+"%";				
				
			} else {
				// Unable to compute progress information since the total size is unknown
				percentComplete = "Downloading: "+ Number((event.loaded/(1024*1024)).toFixed(2))+" MB of "
				+Number((event.target.getResponseHeader('content-length')/(1024*1024)).toFixed(2))+" MB - "
				+Number((event.loaded / event.target.getResponseHeader('content-length')).toFixed(2))*100+"%";
			}
		progtext.textContent = percentComplete;
		}
		
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

function idents(heh,len){
	if (heh.value.length>0) heh.style['width'] = (heh.value.length*8)+'px';
	var labl = [];
	labl.push("boobs");
	
	for (var i=0; i < len;i++){
		labl.push(document.getElementById(i+len).value);
	}
	g3.updateOptions({
		labels: labl
	});
}


function labels(){		
	document.getElementById("xaxis").value = getSavedValue("xaxis");    // set the value to this input
	document.getElementById("yaxis").value = getSavedValue("yaxis");   // set the value to this input
	//document.getElementById("y2axis").value = getSavedValue("y2axis");   // set the value to this input
	/* Here you can add more inputs to set value. if it's saved */	
}

async function plot(){
	var csv = await makeRequest("GET", "uploads/graph.csv");
	g3 = new Dygraph(
	document.getElementById("graphdiv3"),
	//"uploads/graph.csv", // path to CSV file
	csv,
	{		
		xlabel: document.getElementById("xaxis").value,	
		ylabel: document.getElementById("yaxis").value,	
		//y2label: document.getElementById("y2axis").value,	
		legend: 'always',			
		connectSeparatedPoints: true,
		includeZero: true,
		showRoller: true          
	}          // options
	);
	
	g3.ready(function() {
		var lbs = g3.getLabels();
		//lbs.pop();
		lbs.shift();
		var cb = [];	
		var cbh = document.getElementById('MyForm');
		
		for(var i = 0; i < lbs.length; i++){
			cb[i] = document.createElement('input');
			cb[i].type = 'checkbox';
			cbh.appendChild(cb[i]);
			cb[i].id = i;
			cb[i].value = lbs[i];
			cb[i].checked = true;
			cb[i].onchange = function(){change(this);};
			cbh.appendChild(document.createTextNode(lbs[i]));			
		}
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 500); 
	});
	
	var xaxis = document.getElementById('xaxis');
	var yaxis = document.getElementById('yaxis');
	xaxis.onkeyup = function(){ saveValue(this);
		g3.updateOptions({
			xlabel: xaxis.value
		});								
	};
	yaxis.onkeyup = function(){ saveValue(this);
		g3.updateOptions({	
			ylabel: yaxis.value
		});								
	};
}

async function plotexp(){
	
	/*Remove unused checkboxes*/
	const myNode = document.getElementById("MyForm");
	while (myNode.childElementCount>3) { //don't remove the firstborn children
		myNode.removeChild(myNode.lastChild);
	}
	//show hidden options	
	var y = document.getElementById("hide");  
	y.style.display = "block";	
	
	var csv = await makeRequest("GET", "uploads/graph.csv");
	csv = Papa.parse(csv).data;
	csv.splice(csv.length-1,1)// temporary fix
	
	for (let i=0;i<csv.length;i++){		//eliminate not needed data
		if (csv[i].length != csv[csv.length-1].length){
			csv.splice(i,1);
			i--;
		}
	}	
	var labr = Number(document.getElementById("LabR").value);
	var labl = csv.splice(labr,1)// temporary fix
	var tempD = [];
	
	for (var i=0;i<csv.length;i++){		//convert to dates and numbers
		if ((csv[i][0].includes(":") || csv[i][0].includes("/")) && !document.getElementById("99").checked){
			var corrD = csv[i][0].split(/[. :/]/);
			if (corrD.length == 5 && corrD[2].length == 4) csv[i][0] = new Date(corrD[2], corrD[1] - 1, corrD[0], corrD[3], corrD[4]);
			tempD.push(new Date(csv[i].shift()));			
		}
		csv[i] = csv[i].map(Number);
	}
		
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
	
	for (let i=0;i<csv.length;i++){	//add dates column back
		if (csv[i].length != csv[csv.length-1].length){
			csv.splice(i,1);
			i--;
		}
		if (tempD[i] instanceof Date && !isNaN(tempD[i])){
			csv[i].unshift(tempD[i]);		
		}
	}
	
		
	document.getElementById("LabR").value = getSavedValue("Labr");	
	document.getElementById("dat").value = getSavedValue("dat");	
	document.getElementById("datR").value = getSavedValue("datR");
	var dat = new Date();
	var datrate = 1000;	//one second
	if (document.getElementById("dat").value != "") dat = new Date(document.getElementById("dat").value);
	if (document.getElementById("datR").value != "") datrate = Number(document.getElementById("datR").value)*1000;
	if (document.getElementById("99").checked) { //set own start date and increment
		for (let i=0;i<csv.length;i++){	
			csv[i].unshift(new Date(dat.setTime(dat.getTime()+datrate)));
			//dat.setTime(dat.getTime()+1000);
		}
	}
	
	//csv.pop()// temporary fix
	//var csv = Papa.unparse(csv);
	g3 = new Dygraph(
	document.getElementById("graphdiv3"),
	csv,
	{		
		xlabel: document.getElementById("xaxis").value,	
		ylabel: document.getElementById("yaxis").value,	
		//y2label: document.getElementById("y2axis").value,	
		legend: 'always',
		includeZero: true,
		//labels: labl,
		showRoller: true          
	}          // options
	);
	
	g3.ready(function() {
		var lbs = g3.getLabels();
		//lbs.pop();
		lbs.shift();
		var cb = [];var cb2 = [];	
		var cbh = document.getElementById('MyForm');
		
		for(var i = 0; i < lbs.length; i++){
			cb[i] = document.createElement('input');cb2[i] = document.createElement('input');
			cb[i].type = 'checkbox';cb2[i].type = 'text';
			cbh.appendChild(cb[i]);cbh.appendChild(cb2[i]);
			cb[i].id = i;cb2[i].id = i+lbs.length;
			cb2[i].value = lbs[i];
			cb2[i].className = "idents";
			cb[i].checked = true;
			cb[i].onchange = function(){change(this);}; cb2[i].onkeyup = function(){idents(this,lbs.length);};
		}
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 500); 
	});
	
	var xaxis = document.getElementById('xaxis');
	var yaxis = document.getElementById('yaxis');
	xaxis.onkeyup = function(){ saveValue(this);
		g3.updateOptions({
			xlabel: xaxis.value
		});								
	};
	yaxis.onkeyup = function(){ saveValue(this);
		g3.updateOptions({	
			ylabel: yaxis.value
		});								
	};
}

async function plotfancy(){
	var csv = await makeRequest("GET", "uploads/graph.csv");
	csv = Papa.parse(csv).data;
	
	var labl = csv.shift()// temporary fix
	var tempD = [];
	
	for (let i=0;i<csv.length;i++){		
		if (csv[i][0].includes(":")){
			//var corrD = csv[i][0].split("/|:");
			//csv[i][0] = new Date(corrD[2], corrD[1] - 1, corrD[0]);
			tempD.push(new Date(csv[i].shift()));			
		}
		csv[i] = csv[i].map(Number);
	}
	
	for (let i=0;i<csv.length;i++){	
		if (tempD[i] instanceof Date){
			csv[i].unshift(tempD[i]);		
		}
	}
	csv.pop()// temporary fix
	//var csv = Papa.unparse(csv);
	g3 = new Dygraph(
	document.getElementById("graphdiv3"),
	//"uploads/graph.csv", // path to CSV file
	[csv[0],csv[1]],
	{		
		xlabel: document.getElementById("xaxis").value,	
		ylabel: document.getElementById("yaxis").value,	
		//y2label: document.getElementById("y2axis").value,	
		legend: 'always',
		includeZero: true,
		labels: labl,
		showRoller: true          
	}          // options
	);
	var testy = [];
	
	var i=0;
	var lengthy = csv.length;
	if (csv.length > 100000) length = 100000; //length here should actually be lengthy, ohh well.
	(function myLoop (n) {          
	   setTimeout(function () { 
			i++;
			testy.push(csv[i]);
			g3.updateOptions( { 'file': testy } );          //  your code here                
		  if (--n) myLoop(n);      //  decrement i and call myLoop again if i > 0
	   }, 1)
	})(lengthy);  
	
	g3.ready(function() {
		var lbs = g3.getLabels();
		//lbs.pop();
		lbs.shift();
		var cb = [];	
		var cbh = document.getElementById('MyForm');
		
		for(var i = 0; i < lbs.length; i++){
			cb[i] = document.createElement('input');
			cb[i].type = 'checkbox';
			cbh.appendChild(cb[i]);
			cb[i].id = i;
			cb[i].value = lbs[i];
			cb[i].checked = true;
			cb[i].onchange = function(){change(this);};
			cbh.appendChild(document.createTextNode(lbs[i]));			
		}
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 500); 
	});
	
	var xaxis = document.getElementById('xaxis');
	var yaxis = document.getElementById('yaxis');
	xaxis.onkeyup = function(){ saveValue(this);
		g3.updateOptions({
			xlabel: xaxis.value
		});								
	};
	yaxis.onkeyup = function(){ saveValue(this);
		g3.updateOptions({	
			ylabel: yaxis.value
		});								
	};
}

