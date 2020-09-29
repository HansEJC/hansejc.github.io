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

function quantities() {
	const myNode = document.getElementById("Substation");
	myNode.innerHTML = '';
	const myNode2 = document.getElementById("Location");
	myNode2.innerHTML = '';

	var npr = +(getSavedValue("NPR"));     // set the value to this input	
	var cb = []; var cb2 = []; var cb3 = [];	
	var cbh = document.getElementById('Substation'); var cbh2 = document.getElementById('Location'); 
	if (npr < 20){
		for(var i = 0; i < npr; i++){
				cb[i] = document.createElement('input'); cb2[i] = document.createElement('input');
				cb[i].type = 'text'; cb2[i].type = 'number'; 
				cb[i].onkeyup = function(){saveValue(this);}; cb2[i].onkeyup = function(){saveValue(this);};
				cbh.appendChild(cb[i]); cbh2.appendChild(cb2[i]); 
				cb[i].id = i+200; cb2[i].id = i+100;		
				cb[i].classList.add("sub"); cb2[i].classList.add("loc");		
		}
	}
	else{
		cb[0] = document.createElement('input'); cb2[0] = document.createElement('input');
		cb[0].type = 'text'; cb2[0].type = 'text'; 
		cb[0].value = 'bad human!'; cb2[0].value = 'bad human!'; 
		cbh.appendChild(cb[0]); cbh2.appendChild(cb2[0]); 
	}
}

function calculations(){
	
	document.getElementById("NPR").value = getSavedValue("NPR");    // set the value to this input
	document.getElementById("FC").value = getSavedValue("FC");
	document.getElementById("CI").value = getSavedValue("CI");
	document.getElementById("CW").value = getSavedValue("CW");
	document.getElementById("RI").value = getSavedValue("RI");
	document.getElementById("AEW").value = getSavedValue("AEW");
	document.getElementById("RSC").value = getSavedValue("RSC");
	document.getElementById("TRNU").value = getSavedValue("TRNU");
	document.getElementById("CRBD").value = getSavedValue("CRBD");
		
	let fc = +(getSavedValue("FC")) || 6;
	let ci = +(getSavedValue("CI"))|| 0.43;
	let cw = +(getSavedValue("CW")) || 0.15;
	let ri = +(getSavedValue("RI")) || 0.2;
	let aew = +(getSavedValue("AEW")) || Number.MAX_SAFE_INTEGER;
	let rsc = +(getSavedValue("RSC")) || Number.MAX_SAFE_INTEGER;
	let trnu = +(getSavedValue("TRNU")) || 2; trnu = trnu == 1 ? 1/Number.MAX_SAFE_INTEGER : trnu-1;
	let crbd = +(getSavedValue("CRBD")); crbd = Math.max(+(crbd)/1000,crbd == 0 ? 0 : 0.1); //convert to km
	let track = 2;
	let earray = [] ,infoarray = [], subarray = [];
	let vol = 25; //25kV
	let imp = vol/fc;
	let ole = 1/(1/ci+1/cw);
	let faultimp = ole/2+1/(2/ri+1/aew+1/rsc); //in ohm/km
	let oleimp = 0, returnimp = 0;
	let totlc = 0, previmp = 0, prevole = 0; //total length, previous impedance, prev OLE
	let res = 1000; //resolution
	
	const smoothdec = (a) => +(parseFloat(a).toFixed(6)); //fix broken decimals
	const lcd = (a,b) => smoothdec(a*Math.round(b/a)) || 0; //lowest commom multiplier
	
	document.querySelectorAll(".sub").forEach(sub => sub.value = getSavedValue(sub.id));
	document.querySelectorAll(".loc").forEach((loc,ind) => {
		loc.value = getSavedValue(loc.id);
		let lc = +(getSavedValue(loc.id)) || 0;
		let nextlc = +(getSavedValue(1+(+loc.id)))*0.1;
		let sub = getSavedValue(100+(+loc.id));
		
		for (i=1;i<=res;i++){
			let lcc = smoothdec(lc*i/res); //current location
			let lch = totlc+lcc; //current total location
			let nxbnd = lcd(lc/res,crbd); //next bond location , min xbond of 50m 
			nxbnd = nxbnd > lc ? lc : nxbnd; //if cross bonding is greater than sub distance, set to sub distance
			nxbnd = crbd < 1/1000 ? lc : nxbnd;
			let lxb = smoothdec(lcc % nxbnd) == 0 ? nxbnd : smoothdec(lcc % nxbnd) || 0;//location after last xbond
			oleimp = 1/(1/(ole*lcc)+1/((ole*lc)/trnu + ole*(lc-lcc)));
			returnimp = + 1/(1/(ri*lxb)+1/(1/(trnu/(ri*nxbnd)+1/(aew*nxbnd)+1/(rsc*nxbnd))+ri*(nxbnd-lxb))); //bonds at cross bond location
			faultimp = oleimp+returnimp; 
			let subfault = vol/(faultimp+imp+previmp+prevole);
			earray.push([lch, subfault]);
			if ((lxb >= nxbnd || lcc >= lc) && nxbnd > 0) previmp += returnimp; //previous impedance	
		}
		/*
		for (i=0;i<=10;i++){
			let lcc = lc*i*0.1; //current location
			let lch = totlc+lcc; //current total location
			oleimp = ole*1/(1/(2*lc-lcc)+1/lcc);
			returnimp = 1/(1/(ri*lcc)+1/(1/(trnu/(ri*lc)+1/(aew*lc)+1/(rsc*lc))+ri*(lc-lcc))); //bonds at subs only
			faultimp = oleimp+returnimp; 
			let subfault = vol/(faultimp+imp+previmp);
			earray.push([lch, subfault]);
		}previmp += faultimp; //previous impedance	
		*/
		totlc += lc; //total length
		prevole += oleimp; //previous impedance	
		subarray[ind] = {
		  series: "Fault Current (kA)",
		  x: totlc == 0 ? nextlc : totlc,
		  width: sub.length*8,
		  height: 24,
		  //tickHeight: 10,
		  cssClass: totlc == 0 ? "dygraph-first-annotation" : "",
		  tickColor: "white",
		  shortText: sub
		};
	});

	try {
		if (g3) g3.destroy();
	}catch(e){}
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),												
		earray,
		{		
			xlabel: "Location (km)",
			ylabel: "Fault Current (kA)",
			labels:	["Distance (km)", "Fault Current (kA)"],	
			colors: ["red"],			
			//fillGraph: true,	
			//includeZero: true,
			//legend: 'always',
			connectSeparatedPoints: true,
			axes: {
              x: {
				axisLabelFormatter: function(y) {
                  return  y + ' km';
                },
              },
              y: {
				axisLabelFormatter: function(y) {
                  return  smoothdec(y) + ' kA';
                },
              },
			}
		}          // options
	);
	
	g3.ready(function() {
		
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 500); 
		g3.setAnnotations(subarray);
	});
}
