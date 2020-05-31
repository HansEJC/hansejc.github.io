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

function hider() {
  var x = document.getElementById("hide");
  if (x.style.display === "none") 
    x.style.display = "block";
   else 
    x.style.display = "none"; 
}

function checkit() {
	var x = document.getElementById("advanced");
	x.checked = true;
	var y = document.getElementById("hide");
    y.style.display = "block";
}

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
	result = xmlhttp.responseText;
  }
  return result;
}

function change(el) {
	g3.setVisibility(el.id, el.checked);
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function plotIE(){
	document.getElementById("Zone1").value = getSavedValue("Zone1");    // set the value to this input
	document.getElementById("Zone1A").value = getSavedValue("Zone1A");
	document.getElementById("Zone1RH").value = getSavedValue("Zone1RH");
	document.getElementById("Zone1LH").value = getSavedValue("Zone1LH");
	document.getElementById("Zone2").value = getSavedValue("Zone2");   // set the value to this input
	document.getElementById("Zone2A").value = getSavedValue("Zone2A");
	document.getElementById("Zone2RH").value = getSavedValue("Zone2RH");
	document.getElementById("Zone2LH").value = getSavedValue("Zone2LH");
	document.getElementById("Zone3").value = getSavedValue("Zone3");   // set the value to this input
	document.getElementById("Zone3A").value = getSavedValue("Zone3A");
	document.getElementById("Zone3RH").value = getSavedValue("Zone3RH");
	document.getElementById("Zone3LH").value = getSavedValue("Zone3LH");
	document.getElementById("Z2del").value = getSavedValue("Z2del");
	document.getElementById("Z3del").value = getSavedValue("Z3del");
	document.getElementById("FST").value = getSavedValue("FST");
	document.getElementById("VTR").value = getSavedValue("VTR");
	document.getElementById("CTR").value = getSavedValue("CTR");
	/* Here you can add more inputs to set value. if it's saved */
	
	var prim = document.getElementById("Prim");
	var sec = document.getElementById("Sec");
	var primdr = document.getElementById("PrimDR");
	var secdr = document.getElementById("SecDR");
	
	//Advances settings variables
	var z2del = Number(document.getElementById("Z2del").value);
	var z3del = Number(document.getElementById("Z3del").value);
	var fst, vtr, ctr;
	
	if (document.getElementById("FST").value=="") fst = 1;
	else fst = Number(document.getElementById("FST").value);
	
	if (document.getElementById("VTR").value=="") vtr = 1;
	else vtr = Number(document.getElementById("VTR").value);
	
	if (document.getElementById("CTR").value=="") ctr = 1;
	else var ctr = Number(document.getElementById("CTR").value);
	
	var tr =ctr/vtr; //secondary ratio
	
	//%Zone 1 setting   

	var Z1 = Number(document.getElementById("Zone1").value);
	var Z1A = (Number(document.getElementById("Zone1A").value)* Math.PI / 180);
	var Z1t = (-3* Math.PI / 180);
	var R1R = Number(document.getElementById("Zone1RH").value);
	var R1L = Number(document.getElementById("Zone1LH").value);
	var Z1s = (87* Math.PI / 180);

	//%Zone 2 setting   

	var Z2 = Number(document.getElementById("Zone2").value);
	var Z2A = (Number(document.getElementById("Zone2A").value)* Math.PI / 180);
	var Z2t = (-3* Math.PI / 180);
	var R2R = Number(document.getElementById("Zone2RH").value);
	var R2L = Number(document.getElementById("Zone2LH").value);
	var Z2s = (87* Math.PI / 180);

	//%Zone 3 setting   

	var Z3 = Number(document.getElementById("Zone3").value);
	var Z3A = (Number(document.getElementById("Zone3A").value)* Math.PI / 180);
	var Z3t = (-3* Math.PI / 180);
	var R3R = Number(document.getElementById("Zone3RH").value);
	var R3L = Number(document.getElementById("Zone3LH").value);
	var Z3s = (70* Math.PI / 180);
	var Z3rev = 2;
	
	//Primary or Secondary Inputs
	
	if (sec.checked) {
		Z1=Z1/tr;R1R=R1R/tr;R1L=R1L/tr;
		Z2=Z2/tr;R2R=R2R/tr;R2L=R2L/tr;
		Z3=Z3/tr;R3R=R3R/tr;R3L=R3L/tr;
	}
	
	//Primary or Secondary Disturbance record
	
	var trdr = 1;
	var vtrdr = 1;
	if (secdr.checked) {trdr = tr; vtrdr = vtr;}
	
	//%Zone 1 plot

	var x1 = Math.sin(Z1A)*R1L/Math.sin((180* Math.PI / 180)-Z1A+Z1t);
	var xx1 = Math.sin(Z1A)*R1R/Math.sin((180* Math.PI / 180)-Z1A+Z1t);

	var pkx1 = -x1*Math.sin(Z1t)+Z1*Math.sin(Z1A);
	if (-R1L*Math.sin((-90* Math.PI / 180)+Z1s) > pkx1){ 
		var pgx1 = pkx1;}
	else{
		pgx1 = -R1L*Math.sin((-90* Math.PI / 180)+Z1s);
	}

	var pcx1 = xx1*Math.sin(Z1t)+Z1*Math.sin(Z1A);
	var prx1 = R1R*Math.sin(Z1A)/Math.sin((90* Math.PI / 180)+Z1s-Z1A)*Math.sin((-90* Math.PI / 180)+Z1s);

	var pgr1 = -pgx1*Math.sin(Z1s)/Math.sin((90* Math.PI / 180)-Z1s);
	if (pgx1 == pkx1) {
		var pkr1 = pgr1;}
	else{
		pkr1 = -x1*Math.cos(Z1t)+Z1*Math.cos(Z1A);
	}

	var pcr1 = xx1*Math.cos(Z1t)+Z1*Math.cos(Z1A);
	var prr1 = R1R*Math.sin(Z1A)/Math.sin((90* Math.PI / 180)+Z1s-Z1A)*Math.cos((-90* Math.PI / 180)+Z1s);

	//%Zone 2 plot

	var x2 = Math.sin(Z2A)*R2L/Math.sin((180* Math.PI / 180)-Z2A+Z2t);
	var xx2 = Math.sin(Z2A)*R2R/Math.sin((180* Math.PI / 180)-Z2A+Z2t);

	var pkx2 = -x2*Math.sin(Z2t)+Z2*Math.sin(Z2A);

	if (-R2L*Math.sin((-90* Math.PI / 180)+Z2s) > pkx2){
		var pgx2 = pkx2;}
	else{
		pgx2 = -R2L*Math.sin((-90* Math.PI / 180)+Z2s);
	}

	var pcx2 = xx2*Math.sin(Z2t)+Z2*Math.sin(Z2A);
	var prx2 = R2R*Math.sin(Z2A)/Math.sin((90* Math.PI / 180)+Z2s-Z2A)*Math.sin((-90* Math.PI / 180)+Z2s);

	var pgr2 = -pgx2*Math.sin(Z2s)/Math.sin((90* Math.PI / 180)-Z2s);
	if (pgx2 == pkx2) {
		var pkr2 = pgr2;}
	else{
		pkr2 = -x2*Math.cos(Z2t)+Z2*Math.cos(Z2A);
	}

	var pcr2 = xx2*Math.cos(Z2t)+Z2*Math.cos(Z2A);
	var prr2 = R2R*Math.sin(Z2A)/Math.sin((90* Math.PI / 180)+Z2s-Z2A)*Math.cos((-90* Math.PI / 180)+Z2s);

	//%Zone 3 plot

	var x3 = Math.sin(Z3A)*R3L/Math.sin((180* Math.PI / 180)-Z3A+Z3t);
	var xx3 = Math.sin(Z3A)*R3R/Math.sin((180* Math.PI / 180)-Z3A+Z3t);

	var ox3 = -Z3rev*Math.sin(Z3A);
	var pgx3 = ox3-x3*Math.sin(Z3t);
	var pkx3 = pgx3+(Z3+Z3rev)*Math.sin(Z3A);
	var prx3 = ox3+xx3*Math.sin(Z3t);
	var pcx3 = prx3+(Z3+Z3rev)*Math.sin(Z3A);

	var or3 = -Z3rev*Math.cos(Z3A);
	var pgr3 = or3-x3*Math.cos(Z3t);
	var pkr3 = pgr3+(Z3+Z3rev)*Math.cos(Z3A);
	var prr3 = or3+xx3*Math.cos(Z3t);
	var pcr3 = prr3+(Z3+Z3rev)*Math.cos(Z3A);
	
	var Z1pol = [[pgr1,pgx1],[pkr1,pkx1],[pcr1,pcx1],[prr1,prx1],[pgr1,pgx1]]; //Z1 polygon
	var Z2pol = [[pgr2,pgx2],[pkr2,pkx2],[pcr2,pcx2],[prr2,prx2],[pgr2,pgx2]];
	var Z3pol = [[pgr3,pgx3],[pkr3,pkx3],[pcr3,pcx3],[prr3,prx3],[pgr3,pgx3]];

	elements2 = [[-Z3rev*Math.cos(Z3A),,,,,-Z3rev*Math.sin(Z3A)],[Z3*Math.cos(Z3A),,,,,Z3*Math.sin(Z3A)], //All Zone polygons and the char angle
	[pgr3,,,,pgx3],[pkr3,,,,pkx3],[pcr3,,,,pcx3],[prr3,,,,prx3],[pgr3,,,,pgx3],
	[pgr2,,,pgx2],[pkr2,,,pkx2],[pcr2,,,pcx2],[prr2,,,prx2],[pgr2,,,pgx2],
	[pgr1,,pgx1],[pkr1,,pkx1],[pcr1,,pcx1],[prr1,,prx1],[pgr1,,pgx1]];
	
	
	var i;
	for (i = 0; i < DR.length; i++) {
		DR[i] = DR[i].map(Number);											
	}
	var faultarray = []; 
	for (i = 0; i < DR.length; i++) { //add csv to array
		faultarray[i] = [];
		if ((DR[i][0]/DR[i][2])/trdr*Math.cos((DR[i][1]-DR[i][3])* Math.PI / 180)<90 && 
			(DR[i][0]/DR[i][2])/trdr*Math.sin((DR[i][1]-DR[i][3])* Math.PI / 180)<90 && 
			DR[i][0]*vtrdr>1000){
			faultarray[i][0] = (DR[i][0]/DR[i][2])/trdr*Math.cos((DR[i][1]-DR[i][3])* Math.PI / 180); //resistive values
			faultarray[i][1] = (DR[i][0]/DR[i][2])/trdr*Math.sin((DR[i][1]-DR[i][3])* Math.PI / 180);//reactive values
		}
	}
	
	var Z3time = 0;
	var Z2time = 0;
	var Z1trip,Z2trip,Z3trip; //In zone booleans
	for (i = 0; i < faultarray.length; i++) { //check through fault if in zone
	
		if (inside(faultarray[i],Z3pol)){
			Z3time = Z3time + 1*fst;
			if (Z3time > z3del){
				Z3trip = true;
				document.getElementById("FaultLoc").textContent = "Zone 3 trip";
				break;
			}
		}
		if (inside(faultarray[i],Z2pol)){
			Z2time = Z2time + 1*fst;
			if (Z2time > z2del){
				Z2trip = true;
				document.getElementById("FaultLoc").textContent = "Zone 2 trip";
				break;
			}
		}
		if (inside(faultarray[i],Z1pol)){
			Z1trip = true;
			document.getElementById("FaultLoc").textContent = "Zone 1 trip";
			break;
		}
		
		
		else document.getElementById("FaultLoc").textContent = "No trip!";
	}	

	var total = elements2.slice();
	for (i = 0; i < DR.length; i++) {
		total.push(faultarray[i]);											
	}
	
	var Z3lim;
	if (Z3>100) Z3lim = Z3;
	else Z3lim = 100;
	
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),												
		total,
		{		
			dateWindow : [-50,80],
			valueRange : [-20,Z3lim],
			labels: [ 'a', 'Fault','Zone 1', 'Zone 2', 'Zone 3','Characteristic Angle' ],
			xlabel: "Resistance (Ω)",	
			ylabel: "Reactance (Ω)",
			legend: 'always',
			drawAxesAtZero: true,
			labelsSeparateLines: true,
			colors: ["red","blue","purple","green","#cccc2b"],			
			connectSeparatedPoints: true,
			includeZero: true,
			axes: {
              x: {
				axisLabelFormatter: function(y) {
                  return  y + ' Ω';
                },
               // axisLabelWidth: 100 
              },
              y: {
                axisLabelFormatter: function(y) {
                  return  y + ' Ω';
                },
                axisLabelWidth: 60
              }
			}
		}          // options
	  );												
}
