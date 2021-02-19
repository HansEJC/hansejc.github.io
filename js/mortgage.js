function calculations(){
	(new URL(document.location)).searchParams.forEach((x, y) => {
		localStorage.setItem(y,x);
	});
	document.getElementById("AB").value = getSavedValue("AB");    // set the value to this input
	document.getElementById("IR").value = getSavedValue("IR");
	document.getElementById("MT").value = getSavedValue("MT");
	document.getElementById("OP").value = getSavedValue("OP");
	var ab = Number(getSavedValue("AB"));    // set the value to this input
	var ir = Number(getSavedValue("IR"))/12/100;
	var mt = Number(getSavedValue("MT"))*12;
	var mp = ab*((ir*Math.pow((1+ir),mt))/(Math.pow((1+ir),mt)-1));		
	
	document.getElementById("MP").textContent = mp.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";

	var today = new Date();
	
	var mortgage = [];
	var intr,eqp, pn, i; //interest, equity payment,remaining loan, payment number
	pn = 0;
	
	var op = Number(getSavedValue("OP"));
	var tp = op+mp;
	document.getElementById("TP").textContent = tp.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	
	document.getElementById("MOP").textContent = (ab/120).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	
	if ((ab/120)<op) document.getElementById("MOP").className = 'label danger';
	else document.getElementById("MOP").className = 'label safe';
	
	var start = 0; var max = 10000;
	for (i = 0; ab > 0; i++) { 
		intr = ab*ir;
		eqp = tp-intr;
		mortgage.push([new Date(today.getFullYear(),today.getMonth()+i,today.getDate()), intr, eqp, intr+eqp]);
		ab = ab-eqp;
		pn++;
		start+=1;if(start>max)break;
	}	
	
	document.getElementById("RT").textContent = Math.floor((pn)/12)+" y " + (12*((pn)/12-Math.floor(pn/12))).toFixed(0)+" m";
	document.getElementById("AP").textContent = (pn*tp).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";

	try {
		if (g3) g3.destroy();
	}catch(e){}
	if (mortgage.length < 2) return;
	const smoothdec = (a) => +(parseFloat(a).toFixed(6)); //fix broken decimals
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),												
		mortgage,
		{		
			//dateWindow : [-50,80],
			//valueRange : [-20,100],
			legend: 'always',
			labels: [ 'Date', 'Interest','Equity', 'Payment'],
			xlabel: "Dates",	
			ylabel: "Payments (£)",	
			fillGraph: true,			
			legend: 'always',
			connectSeparatedPoints: true,
			axes: {
              y: {
                axisLabelFormatter: function(y) {
                  return  smoothdec(y) + ' £';
                },
                axisLabelWidth: 60
              }
			}
		}          // options
	);
	setTimeout(function(){
		window.dispatchEvent(new Event('resize'));
	}, 500); 												
}

//startup
calculations();
document.onkeyup = function() {							
	calculations();								
};