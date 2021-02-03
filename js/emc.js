//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e){
	var id = e.id;  // get the sender's id to save it . 
	var val = e.value; // get the value. 
	localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
	
	let url ='';
	let params = {};
	document.querySelectorAll('input').forEach((element) => {
		if (element.value.length > 0) params[element.id] = element.value;
	});
	let esc = encodeURIComponent;
	let query = Object.keys(params)
		.map(k => esc(k) + '=' + esc(params[k]))
		.join('&');
	url += '?' + query;
		
	let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + url;
	window.history.pushState({ path: newurl }, '', newurl);
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

function killthemeter(num) {
  if (num > 1000) return +(num/1000).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + " km";
  else if (num > 1) return +num.toFixed(2) + " m";
  else if (num > 0.1) return +(num*100).toFixed(2) + " cm";
  else if (num > 0.001) return +(num*1000).toFixed(2) + " mm";
  else if (num > 0.000001) return +(num*1000000).toFixed(2) + " μm";
  else if (num > 0.000000001) return +(num*1000000000).toFixed(2) + " nm";
  else if (num > 0) return +(num*1000000000000).toFixed(2) + " pm";
  else return "-";
}

function kill(num) {
	if (num >= 1000000000000000) return +(num/1000000000000000).toFixed(2)+"P";
	else if (num >= 1000000000000) return +(num/1000000000000).toFixed(2)+"T";
	else if (num >= 1000000000) return +(num/1000000000).toFixed(2)+"G";
	else if (num >= 1000000) return +(num/1000000).toFixed(2)+"M";
	else if (num >= 1000) return +(num/1000).toFixed(2)+"k";
	else if (num >= 1) return +num.toFixed(2);
	else if (num >= 0.001) return +(num*1000).toFixed(2)+"m";
	else if (num >= 0.000001) return +(num*1000000).toFixed(2)+"μ";
	else if (num >= 0.000000001) return +(num*1000000000).toFixed(2)+"n";
	else if (num >= 0.000000000001) return +(num*1000000000000).toFixed(2)+"p";
	else return 0;
}

function labls(num) {
  if (num > 1000000000000000) return "P";
  else if (num > 1000000000000) return "T";
  else if (num > 1000000000) return "G";
  else if (num > 1000000) return "M";
  else if (num > 1000) return "k";
  else if (num > 1) return "";
  else if (num > 0.001) return "m";
  else if (num > 0.000001) return "μ";
  else return "-";
}

function checkit() {
	this.checked = true;
	if (this.id == 'LF') var x = document.getElementById("Lhide"), y = document.getElementById("Hhide");
	else var x = document.getElementById("Hhide"), y = document.getElementById("Lhide");
    x.style.display = "block";
    y.style.display = "none";
	calculations();
}

function calculations(){
	(new URL(document.location)).searchParams.forEach((x, y) => {
		localStorage.setItem(y,x);
	});
	//Change multiplier if over 1000
	if (document.getElementById("MUL").value == "H" && getSavedValue("TF") > 999) {
		localStorage.setItem(document.getElementById("TF").id, document.getElementById("TF").value/1000);
		localStorage.setItem(document.getElementById("MUL").id, "K");
	}	
	if (document.getElementById("MUL").value == "K" && getSavedValue("TF") > 999) {
		localStorage.setItem(document.getElementById("TF").id, document.getElementById("TF").value/1000);
		localStorage.setItem(document.getElementById("MUL").id, "M");
	}	
	if (document.getElementById("MUL").value == "M" && getSavedValue("TF") > 999) {
		localStorage.setItem(document.getElementById("TF").id, document.getElementById("TF").value/1000);
		localStorage.setItem(document.getElementById("MUL").id, "G");
	}	
	
	const radios = document.querySelectorAll("input[name=drive]");
	radios.forEach(rad => rad.addEventListener('change',checkit));
	const fields = document.querySelectorAll("input[name=field]");
	fields.forEach(rad => rad.addEventListener('change',calculations));
	
	const smoothdec = (a) => +(parseFloat(a).toFixed(6)); //fix broken decimals

	document.getElementById("TF").value = getSavedValue("TF");    // set the value to this input
	document.getElementById("EIRP").value = getSavedValue("EIRP");
	document.getElementById("VO").value = getSavedValue("VO");
	document.getElementById("CU").value = getSavedValue("CU");
	document.getElementById("CA").value = getSavedValue("CA") || 0.02;
	if (getSavedValue("MUL") != "") document.getElementById("MUL").value = getSavedValue("MUL");
	
	let vo = +(getSavedValue("VO"));
	let cu = +(getSavedValue("CU"));
	let ca = getSavedValue("CA") || 0.02; 
	ca = +ca * Math.pow(10,-9); //from μF/km to F/m 
	const eo = 8.55 * Math.pow(10,-12);
	const uo = 4 * Math.PI * Math.pow(10,-7);
	let q = ca*vo;
	document.getElementById("CH").innerHTML = q.toExponential(2) +' C/m';
	
	let tf = Number(getSavedValue("TF"));    // set the value to this input
	let eirp = Number(getSavedValue("EIRP"));
	const c = 299792458; //speed of light
	let d = 0;
	
	if (document.getElementById("MUL").value == "K") tf=tf*1000;
	if (document.getElementById("MUL").value == "M") tf=tf*1000000;
	if (document.getElementById("MUL").value == "G") tf=tf*1000000000;
	
	let fi = c/(2*Math.PI*tf);
	//document.getElementById("FI").innerHTML = "Field Indication: \\(c/2\\pi f="+killthemeter(fi)+"\\) ";
	document.getElementById("FI").innerHTML = killthemeter(fi);
	
	let earray = [];	
	let range = 0, ran = 0, distrange = 0;
	
	if (radios[1].checked) {
		for (i = 0; i < 5000; i++) { 
			d = i/100;
			if (d < c/(2*Math.PI*tf) && d!=0) {
				if (fields[0].checked) earray.push([d,Math.pow(c,2)*Math.sqrt(eirp)/(7.2*Math.pow(tf,2)*Math.pow(d,3))]);
				else earray.push([d,c*Math.sqrt(eirp)/(434*tf*Math.pow(d,2))]);
			}
			if (d > c/(2*Math.PI*tf)) {
				if (fields[0].checked) earray.push([d,5.48*Math.sqrt(eirp)/d]);
				else earray.push([d,Math.sqrt(eirp)/(68.8*d)]);
			}
		}
		if (0.1 < fi){ 
			range = Math.pow(c,2)*Math.sqrt(eirp)/(7.2*Math.pow(tf,2));
			ran = c*Math.sqrt(eirp)/(434*tf);
		}
		if (0.1 > fi || tf>45000000){ 	
			range = 5.48*Math.sqrt(eirp);
			ran = Math.sqrt(eirp)/(68.8);
		}
	}
	
	else {
		const lowfreqrange = 51000;
		for (i = 0; i < lowfreqrange; i++) { 
			d = i/1000;
			if (fields[0].checked) {
				earray.push([d,q/(2*Math.PI*eo*d),5e3,9e3]);
				distrange = q/(2*Math.PI*eo*d) < 2000 ? q/(2*Math.PI*eo*d) > 1990 ? d : distrange : lowfreqrange/1000;
			}
			else {
				earray.push([d,uo*cu/(2*Math.PI*d),100e-6,360e-6]);
				distrange = uo*cu/(2*Math.PI*d) < 5e-5 ? uo*cu/(2*Math.PI*d) > 4.5e-5 ? d : distrange : lowfreqrange/1000;
			}
		}			
		range = Math.max(q/(2*Math.PI*eo*.3),50e3);
		ran = Math.max(uo*cu/(2*Math.PI*.3),400e-6);
	}
	
	try {
		if (g3) g3.destroy();
	}catch(e){}
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),												
		earray,
		{		
			legend: 'always',
			xlabel: "Distance (m)",		
			//fillGraph: true,			
			legend: 'always',
			connectSeparatedPoints: true,
			axes: {
              x: {
				axisLabelFormatter: function(y) {
                  return  killthemeter(smoothdec(y));
                },
              },
              y: {
                axisLabelFormatter: function(y) {
                  return  kill(smoothdec(y));
                },
              }
			}
		}          // options
	);
	
	g3.ready(function() {
		var lbs = g3.getLabels();
		//lbs.pop();
		lbs.shift();
		var cb = []; 	
		var cbh = document.getElementById('MyForm');
		while (cbh.childElementCount>1) { //don't remove the firstborn children
			cbh.removeChild(cbh.lastChild);
		}
		
		for(var i = 0; i < lbs.length; i++){
			cb[i] = document.createElement('input'); 
			cb[i].type = 'checkbox';
			cbh.appendChild(cb[i]);
			cb[i].id = i;
			cb[i].checked = true;
			cb[i].onchange = function(){change(this);};
		}	
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 500); 
	});
	
	if (radios[1].checked) {
		g3.updateOptions({
			labels: (fields[0].checked) ? [ 'Distance', "Electric Field ("+labls(range)+"V/m)"] : ['Distance', "Magnetic Field ("+labls(ran)+"A/m)"],
			ylabel: (fields[0].checked) ? "Electric Field ("+labls(range)+"V/m)" : "Magnetic Field ("+labls(ran)+"A/m)",
			valueRange : (fields[0].checked) ? [0,range ]: [0,ran],
		});
	}	
	else {
		g3.updateOptions({
			labels: (fields[0].checked) ? [ 'Distance', "Electric Field ("+labls(range)+"V/m)","Public Guidance Limit (5kV/m)","Public Required Limit (9kV/m)"] : [ 'Distance', "Magnetic Field ("+labls(ran)+"T)","Public Guidance Limit (100μT)","Public Required Limit (360μT)"],
			valueRange : (fields[0].checked) ? [0,range ]: [0,ran],
			ylabel: (fields[0].checked) ? "Electric Field ("+labls(range)+"V/m)" : "Magnetic Field ("+labls(ran)+"T)",
			colors: ["rgb(0,128,128)","#cccc2b","red"],
			dateWindow: [0, distrange]
		});		
	}
}
