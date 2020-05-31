//var d = new Date();
//var time=d.getTime();
function Redirect(){				
	document.location="index.php?"+time;				
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e){
	var id = e.id;  // get the sender's id to save it . 
	var val = e.value; // get the value. 
	localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
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

function labels(){
	document.getElementById("xaxis").value = getSavedValue("xaxis");    // set the value to this input
	document.getElementById("yaxis").value = getSavedValue("yaxis");   // set the value to this input
	//document.getElementById("y2axis").value = getSavedValue("y2axis");   // set the value to this input
	/* Here you can add more inputs to set value. if it's saved */
	
}

function plotIE(){
	g3 = new Dygraph(
	document.getElementById("graphdiv3"),
	"uploads/graph.csv", // path to CSV file
	{		
		xlabel: document.getElementById("xaxis").value,	
		ylabel: document.getElementById("yaxis").value,	
		//y2label: document.getElementById("y2axis").value,	
		legend: 'always',
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
