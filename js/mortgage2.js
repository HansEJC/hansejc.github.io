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

function calculations(){
	document.getElementById("HPI").value = getSavedValue("HPI");    // set the value to this input
	document.getElementById("OP").value = getSavedValue("OP");
	var hpi = Number(getSavedValue("HPI"));    // set the value to this input
	var today = new Date();
	var monthd = (today-new Date(2020,7,1))/1000/60/60/24/365.25*12; //difference in month
	
	var il = 176225; //initial loan	
	if (hpi < 100000) hpi = il + 9275;
	var sd = new Date(2017,04,01); //start of mortgage
	var iir = 4.09/12/100; //initial interest rate
	var nir = 1.84/12/100; //remortgage rate
	var mortgage = [];
	var intr,eqp, rl, pn, teq, ltv, tpa; //interest, equity payment,remaining loan, payment number, total equity, total payed
	rl = il; pn  = tpa = 0;
	teq = hpi - il; //initial deposit plus HPI
	
	var i;
	for (i = 0; i < 13; i++) { //first year
		intr = rl*iir;
		eqp = 1000-intr;
		teq = teq + eqp;
		mortgage.push([new Date(2017,sd.getMonth()+i,sd.getDay()), intr, eqp, intr+eqp]);
		rl = rl-eqp;
		tpa = tpa +1000;
	}
	
	for (i = 0; i < 11; i++) { // changed overpayment to £1100
		intr = rl*iir;
		eqp = 1100-intr;
		teq = teq + eqp;
		mortgage.push([new Date(2018,5+i,1), intr, eqp, intr+eqp]);
		rl = rl-eqp;
		tpa = tpa +1100;
	}
	
	intr = rl*nir;
	eqp = 1100-intr-995; //the 995 was te remortgage fee
	teq = teq + eqp;
	mortgage.push([new Date(2019,4,1), intr, eqp, intr+eqp]);
	rl = rl-eqp;
	tpa = tpa + 1100;
	
	for (i = 0; i < 14; i++) { // changed overpayment to £1200
		intr = rl*nir;
		eqp = 1200-intr;
		teq = teq + eqp;
		mortgage.push([new Date(2019,5+i,1), intr, eqp, intr+eqp]);
		rl = rl-eqp;	
		tpa = tpa +1200;	
	}
	
	for (i = 0; i < monthd; i++) { // changed overpayment to £1500
		intr = rl*nir;
		eqp = 1500-intr;
		teq = teq + eqp;
		mortgage.push([new Date(2020,7+i,1), intr, eqp, intr+eqp]);
		rl = rl-eqp;	
		tpa = tpa +1500;	
	}
	
	ltv = 100 - teq / (teq + rl) * 100;
	
	var op = Number(getSavedValue("OP"));
	var mpc = 555.07;	//current mortgage payment
	var tp = op+mpc; // total payment
	document.getElementById("TPA").textContent = tpa.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	document.getElementById("TEQ").textContent = teq.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	document.getElementById("LTV").textContent = ltv.toFixed(0)+" %";
	document.getElementById("MPN").textContent = mpc.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	document.getElementById("TP").textContent = tp.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	
	document.getElementById("RD").textContent = rl.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	document.getElementById("MOP").textContent = (rl/120).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";
	
	if ((rl/120)<op) document.getElementById("MOP").className = 'label danger';
	else document.getElementById("MOP").className = 'label safe';
	
	var start = 0; var max = 10000;
	for (i = 0; rl > 0; i++) { 
		intr = rl*nir;
		eqp = tp-intr;
		mortgage.push([new Date(2020,8+i+monthd,1), intr, eqp, intr+eqp]);
		rl = rl-eqp;
		pn++;		
		start+=1;if(start>max)break;
	}	
	
	document.getElementById("RT").textContent = Math.floor((pn)/12)+" y " + (12*((pn)/12-Math.floor(pn/12))).toFixed(0)+" m";

	try {
		if (g3) g3.destroy();
	}catch(e){}
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
			connectSeparatedPoints: true,
			axes: {/*
              x: {
				axisLabelFormatter: function(y) {
                  return  y + ' Ω';
                },
               // axisLabelWidth: 100 
              },*/
              y: {
                axisLabelFormatter: function(y) {
                  return  y + ' £';
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
