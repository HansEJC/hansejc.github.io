var ipString = "removeMe?";
function saveScores(scr) {
	if (!window.location.hostname.includes("github")) {
		$.post("./savesettings.php?=v1.0",
		{
			name: $("#userName").val(),
			ip: ipString,
			score: scr,
			date: new Date().toLocaleString("en-GB", {timeZone: "Europe/London"}),
		},
		function(data,status){
			document.getElementById("TempScore").innerHTML = data;
			$( "#TempScore" ).fadeIn(100);
			setTimeout(function(){
				$( "#TempScore" ).fadeOut(500);	
				document.location="?"+(new Date).getTime();
			}, 1000);
		});
	}
	else {
		let scoreID = "jumpScores";
		scoreID = document.cookie.includes('game=mole') ? "moleScores" : scoreID; 
		scoreID = document.cookie.includes('game=simon') ? "simonScores" : scoreID; 
		scoreID = document.cookie.includes('game=dobble') ? "dobbleScores" : scoreID; 
		let scoreArr = [];
		const name = document.getElementById("userName");
		let exists = false;

		try{
			scoreArr = JSON.parse(localStorage.getItem(scoreID));
			scoreArr.forEach(val => {
				if (val[0] == name.value) {
					val[1] = scr > val[1] ? scr : val[1];
					exists = true;
				}
			});
		}catch(err){
			console.log("no highscores yet");
			scoreArr = [];
		}
		
		if (!exists) scoreArr.push([name.value,scr]);
		
		localStorage.setItem(scoreID,JSON.stringify(scoreArr));
		setTimeout(function(){
			document.location="?"+(new Date).getTime();
		}, 1000);
	}
}

async function getScores(file,storage){	
	const serverScore = await fetch(file)
		.then(result => result.json());
	const localScore = JSON.parse(localStorage.getItem(storage));
	const allScore = (!localScore) ? serverScore : [...serverScore,...localScore];
	allScore.sort((a,b) => b[1] - a[1]);
	const table = document.getElementById('board');
	allScore.forEach(val => {
		let row = table.insertRow(-1);
		row.insertCell(0).innerHTML = val[0];
		row.insertCell(1).innerHTML = val[1];
	});			
}

//Speach recognition commands
function speech() {
	try{
		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		let recognition = new SpeechRecognition();
		recognition.interimResults = true;
		recognition.continuous = true;
		//recognition.onresult = e => {
		recognition.onsoundstart = e => {
			//let transcript = [...e.results].map(res => res[0].transcript).join('');
			console.log("now");
			/*if (transcript.includes('jump'))*/ Rexy.tRex.startJump();
			recognition.abort();
			//recognition.start();
			recognition.onend = () => recognition.start();
		};	
		recognition.start();
	} catch(err) {console.log(err+" speech recognition not supported")}
}

//Scores redirect
function fullscores(){				
	document.location="fullscores.php?"+(new Date).getTime();			
}

// gain, frequency, duration
function k(w,x,y){
	try {
		v=a.createOscillator()
		u=a.createGain()
		v.connect(u)
		v.frequency.value=x
		v.type="square"
		u.connect(a.destination)
		u.gain.value=w*0.01
		v.start(a.currentTime)
		v.stop(a.currentTime+y*0.001)
	}catch(err){console.log(err+"not supported")}
}

function ip(){
	// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
	var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	
	if (RTCPeerConnection) (function () {
		var rtc = new RTCPeerConnection({iceServers:[]});
		if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
			try{
				rtc.createDataChannel('', {reliable:false});
			}
			catch(err) {console.log("IP doesn't work! "+err);}
		};
		
		rtc.onicecandidate = function (evt) {
			// convert the candidate to SDP so we can run it through our general parser
			// see https://twitter.com/lancestout/status/525796175425720320 for details
			if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
		};
		rtc.createOffer(function (offerDesc) {
			grepSDP(offerDesc.sdp);
			rtc.setLocalDescription(offerDesc);
		}, function (e) { console.warn("offer failed", e); });
		
		ipString = "Edge sucks";
		var addrs = Object.create(null);
		addrs["0.0.0.0"] = false;
		function updateDisplay(newAddr) {
			if (newAddr in addrs) return;
			else addrs[newAddr] = true;
			var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
			//document.getElementById('IEX').textContent = "High scores coming soon. You're local IP is: "+displayAddrs.join(" or perhaps ") || "n/a"
			ipString = displayAddrs.join(" or perhaps ") || "n/a";
		}
		
		function grepSDP(sdp) {
			var hosts = [], parts, addr, type;
			sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
				if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
					parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
						addr = parts[4],
						type = parts[7];
					if (type === 'host') updateDisplay(addr);
				} else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
					parts = line.split(' '),
						addr = parts[2];
					updateDisplay(addr);
				}
			});
		}
	})(); 
}