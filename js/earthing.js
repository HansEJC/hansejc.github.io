function volts(v) {
	return v > 1000 ? +(v/1000).toFixed(2)+" kV" : +v.toFixed(2)+" V";
}

function earthing() {
	(new URL(document.location)).searchParams.forEach((x, y) => {
		localStorage.setItem(y,x);
	});
	document.getElementById("ER").value = getSavedValue("ER");    // set the value to this input
	document.getElementById("RR").value = getSavedValue("RR");
	document.getElementById("FC").value = getSavedValue("FC");
	var er = Number(getSavedValue("ER"));    // set the value to this input
	var rr = Number(getSavedValue("RR"));
	var fc = Number(getSavedValue("FC"));
	var pr = er*rr/(er+rr);
	var epr = 1000*pr*fc;
	var ir = epr/rr/1000;
	var ig = epr/er/1000;
	var irp = 100*ir/fc;
	var igp = 100*ig/fc;										
	
	document.getElementById("PR").textContent = +pr.toFixed(2)+" Ω";
	document.getElementById("EPR").textContent = volts(epr);
	document.getElementById("IR").textContent = +ir.toFixed(2)+" kA";
	document.getElementById("IG").textContent = +ig.toFixed(2)+" kA";
	document.getElementById("IRp").textContent = +irp.toFixed(0)+"%";
	document.getElementById("IGp").textContent = +igp.toFixed(0)+"%";
	
	if (epr>645) document.getElementById("EPR").className = 'label danger';
	else document.getElementById("EPR").className = 'label safe';
	
	document.getElementById("P").value = getSavedValue("P");
	document.getElementById("AREA").value = getSavedValue("AREA");
	document.getElementById("H").value = getSavedValue("H")
	document.getElementById("L").value = getSavedValue("L");
	document.getElementById("NR").value = getSavedValue("NR");
	document.getElementById("LR").value = getSavedValue("LR");
	var p = Number(getSavedValue("P"));    // set the value to this input
	var area = Number(getSavedValue("AREA"));
	var h = Number(getSavedValue("H"));
	var l = Number(getSavedValue("L"));
	var nr = Number(getSavedValue("NR"));
	var lr = Number(getSavedValue("LR"));
	var r = Math.sqrt(area/Math.PI);
	var kr = 1+nr*lr*lr/(10*r*r);
	var re = p/(4*r)+p/(l+nr*lr);
	var rg = p*((1+r/(r+2.5*h))/(8*r*kr)+1/l);
	
	document.getElementById("R").textContent = +r.toFixed(2)+" m";
	document.getElementById("KR").textContent = +kr.toFixed(2);
	document.getElementById("RE").textContent = +re.toFixed(2)+" Ω";
	document.getElementById("RG").textContent = +rg.toFixed(2)+" Ω";
	
	document.getElementById("ERA").value = getSavedValue("ERA");
	var era = Number(getSavedValue("ERA"));
	var pa = era*p/rg;
	document.getElementById("PA").textContent = +pa.toFixed(2)+" Ωm";
}

//startup
window.addEventListener("load", function() {
	earthing();
	document.onkeyup = function() {							
		earthing();										
	};
	MathJax.Hub.Config({
		tex2jax: {
		  inlineMath: [["$","$"],["\\(","\\)"]]
		}
	});
	MathJax.Hub.Queue(
	function () {
		document.querySelectorAll(".Math").forEach(math => math.style.visibility = "");
		document.querySelectorAll(".Math").forEach(math => math.style.display = "inline-block");
	});
});