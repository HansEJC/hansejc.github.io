function quantities() {
	(new URL(document.location)).searchParams.forEach((x, y) => {
		localStorage.setItem(y,x);
	});
	const myNode = document.getElementById("Substation");
	myNode.innerHTML = '';
	const myNode2 = document.getElementById("Location");
	myNode2.innerHTML = '';
	const myNode3 = document.getElementById("Tracks");
	myNode3.innerHTML = '';

	var npr = +(getSavedValue("NPR"));     // set the value to this input	
	var cb = []; var cb2 = []; var cb3 = [];	
	if (npr < 20){
		for(var i = 0; i < npr; i++){
				cb[i] = document.createElement('input'); cb2[i] = document.createElement('input'); cb3[i] = document.createElement('input');
				cb[i].type = 'text'; cb2[i].type = 'number'; cb3[i].type = 'number';
				cb[i].onkeyup = function(){saveValue(this);}; cb2[i].onkeyup = function(){saveValue(this);}; cb3[i].onkeyup = function(){saveValue(this);};
				myNode.appendChild(cb[i]); myNode2.appendChild(cb2[i]); if (i < npr-1) myNode3.appendChild(cb3[i]); 
				cb[i].id = i+200; cb2[i].id = i+100; cb3[i].id = i+300;		
				cb[i].classList.add("sub"); cb2[i].classList.add("loc"); cb3[i].classList.add("sub");		
		}
	}
	else{
		cb[0] = document.createElement('input'); cb2[0] = document.createElement('input');
		cb[0].type = 'text'; cb2[0].type = 'text'; 
		cb[0].value = 'bad human!'; cb2[0].value = 'bad human!'; 
		myNode.appendChild(cb[0]); myNode2.appendChild(cb2[0]); 
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
	document.getElementById("CRBD").value = getSavedValue("CRBD");
	document.getElementById("BIMP").value = getSavedValue("BIMP");
	document.getElementById("ATF").value = getSavedValue("ATF");
	
	let boost = document.querySelector("#BOOST").checked;
	let atfeed = document.querySelector("#ATFEED").checked;
	document.querySelector("#Bstuff").style.display = boost ? "block" : "none";
	document.querySelector("#ATFstuff").style.display = atfeed ? "block" : "none";
		
	let fc = +(getSavedValue("FC")) || 6;
	let ci = +(getSavedValue("CI"))|| 0.43;
	let cw = +(getSavedValue("CW")) || 0.15;
	let ri = +(getSavedValue("RI")) || 0.2;
	let bimp = +(getSavedValue("BIMP"))/2 || 0.21/2; //booster impedance diveded by two for OLE and RSC
	let atf = +(getSavedValue("ATF")) || 0.07;
	let aew = +(getSavedValue("AEW")) || Number.MAX_SAFE_INTEGER;
	let rsc = +(getSavedValue("RSC")) || Number.MAX_SAFE_INTEGER; rsc = boost && rsc>1 ? 0.11 : rsc; //if booster, RSC is required
	let crbd = +(getSavedValue("CRBD")); crbd = crbd == 0 ? Number.MAX_SAFE_INTEGER : Math.max(+(crbd)/1000,0.1); //convert to km and set to minimum of 100m
	let railR = document.querySelector("#SRR").checked ? 1 : 2;
	let earray = [] ,infoarray = [], subarray = [];
	let vol = 25; //25kV
	let imp = vol/fc; //fault limit impedance
	let ole = 1/(1/ci+1/cw);
	let faultimp = ole/2+1/(2/ri+1/aew+1/rsc); //in ohm/km
	let oleimp = 0, returnimp = 0;
	let totlc = 0, previmp = 0, prevole = 0, previmpneg = 0, prevoleneg = 0, textlc = 0; //total length, previous impedance, prev OLE
	let res = 1000; //resolution
	let bloc = 0; //booster location
	let bdist = 3; //booster distance of 3km
	
	const smoothdec = (a) => +(parseFloat(a).toFixed(6)); //fix broken decimals
	const lcd = (a,b) => smoothdec(a*Math.round(b/a)) || 0; //lowest commom multiplier
	
	document.querySelectorAll(".sub").forEach(sub => sub.value = getSavedValue(sub.id));
	document.querySelectorAll(".loc").forEach((loc,ind) => {
		let trnu = +(getSavedValue(+loc.id+199)) || 2; trnu = trnu == 1 ? 1/Number.MAX_SAFE_INTEGER : trnu-1;
		loc.value = getSavedValue(loc.id);
		let lc = getSavedValue(loc.id);
		lc = lc == "" ? 5 : Math.abs(lc); //set to 5km if it's empty to avoid lag
		
		for (i=1;i<=res;i++){
			i = ind == 0 ? res : i; //shift the first sub to its km point
			let lcc = smoothdec(lc*i/res); //current location
			let lch = getSavedValue(loc.id) < 0 ? totlc-lcc : totlc+lcc; //current total location
			let nxbnd = lcd(lc/res,crbd); //next bond location 
			nxbnd = nxbnd > lc ? lc : nxbnd; //if cross bonding is greater than sub distance, set to sub distance
			let lxb = smoothdec(lcc % nxbnd) == 0 ? nxbnd : smoothdec(lcc % nxbnd) || 0;//location after last xbond
			//if (boost && bloc >= bdist) previmp += bimp;
			//if (boost && bloc >= bdist){
			if (boost){
			//nxbnd = nxbnd > bdist ? bdist : nxbnd; //if booster is greater than sub distance, set to sub distance
			//lxb = smoothdec(lcc % nxbnd) == 0 ? nxbnd : smoothdec(lcc % nxbnd) || 0;//location after last xbond
				oleimp = 1/(1/(ole*lcc)+1/((ole*lc)/trnu + ole*(lc-lcc)));
				if (trnu<1) oleimp = ole*lcc;
				oleimp += 2*bimp*Math.floor(Math.abs(lch)/bdist);
				//returnimp = 1/(1/(ri*lxb)+1/(1/(railR*trnu/(ri*nxbnd)+1/(aew*nxbnd))+ri*(nxbnd-lxb))); //bonds at cross bond location
				returnimp = aew*lxb; //bonds at cross bond location
				//prevole += oleimp;// -1/(1/(ole*lcc)+1/((ole*lc)/trnu + ole*(lc-lcc)));
				//previmp += returnimp;// -1/(1/(ri*lxb)+1/(1/(railR*trnu/(ri*nxbnd)+1/(aew*nxbnd)+1/(rsc*nxbnd))+ri*(nxbnd-lxb)));;
			}
			else if (atfeed){
				oleimp = 1/(1/(ole*lcc)+1/((ole*lc)/trnu + ole*(lc-lcc)));
				if (trnu<1) oleimp = ole*lcc;
				returnimp = 1/(1/(ri*lxb)+1/((atf*nxbnd)+ri*(nxbnd-lxb))); //bonds at cross bond location
			}
			else{
				oleimp = 1/(1/(ole*lcc)+1/((ole*lc)/trnu + ole*(lc-lcc)));
				if (trnu<1) oleimp = ole*lcc;
				returnimp = 1/(1/(ri*lxb)+1/(1/(railR*trnu/(ri*nxbnd)+1/(aew*nxbnd)+1/(rsc*nxbnd))+ri*(nxbnd-lxb))); //bonds at cross bond location
			}
			oleimp = ind == 0 ? 0 : oleimp; //set FS impedance to 0
			returnimp = ind == 0 ? 0 : returnimp; //set FS impedance to 0
			faultimp = oleimp+returnimp; 
			let subfault = vol/(faultimp+imp+previmp+prevole);
			
			if (getSavedValue(loc.id) < 0) { //negative sub locs
				subfault = vol/(faultimp+imp+previmp+prevole+previmpneg+prevoleneg);
				earray.push([textlc-lcc,, subfault]);
				if ((lxb >= nxbnd || lcc >= lc) && nxbnd > 0) previmpneg += returnimp; //previous impedance
				if (lcc >= lc) prevoleneg += oleimp; //previous impedance
			}
			else { //positive sub locs
				earray.push([lch, subfault,undefined]);
				if ((lxb >= nxbnd || lcc >= lc) && nxbnd > 0) previmp += returnimp; //previous impedance
				if (lcc >= lc) prevole += oleimp; //previous impedance	
				textlc = totlc;
				prevoleneg = previmpneg = 0;
			}
			bloc = bloc >= bdist ? 0 : smoothdec(bloc+lc/res); //booster location	
		}
		
		totlc += +getSavedValue(loc.id) < 0 ? 0 : lc; //total length
		textlc += +getSavedValue(loc.id); //total length
		let sub = getSavedValue(100+(+loc.id));
		let nextlc = +(getSavedValue(1+(+loc.id)))*0.1;
		subarray[ind] = {
		  series: getSavedValue(loc.id) < 0 ? "Fault Current (kA)." : "Fault Current (kA)",
		  x: /*textlc == 0 ? nextlc :*/ getSavedValue(loc.id) < 0 ? textlc : totlc,
		  width: sub.length*8,
		  height: 24,
		  //tickHeight: 10,
		  //cssClass: textlc == 0 ? "dygraph-first-annotation" : "",
		  tickColor: "white",
		  shortText: sub
		};
	});
	try {
		if (g3) g3.destroy();
	}catch(e){}
	g3 = new Dygraph(
		document.getElementById("graphdiv3"),												
		earray.join("\r\n"),
		{	
			xlabel: "Location (km)",
			ylabel: "Fault Current (kA)",
			labels:	["Distance (km)", "Fault Current (kA)", "Fault Current (kA)."],	
			colors: ["red"],			
			//fillGraph: true,	
			//includeZero: true,
			//legend: 'always',
			//connectSeparatedPoints: true,
			pointSize: 0.1,
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
		let min = g3.xAxisExtremes()[0];
		let max = g3.xAxisExtremes()[1];
		let adj = Math.abs(max-min)*0.1;
		g3.updateOptions({
			dateWindow: [min-adj,max+adj]
		});
	});
	
	return earray;
}

//startup
quantities();
calculations();
document.onkeyup = () => calculations();									