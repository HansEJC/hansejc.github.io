const scoreBoard = document.querySelector('.score');
const mode = document.querySelector("#Mode");
const board = document.querySelector('.memory');
const radius = board.offsetHeight/2;
const toDeg = (rad) =>  rad * 180/Math.PI;
const Deg = (x,y) => toDeg(Math.atan(y/x));
let colArr = [], clickArr = [], colClick;
let gamesStarted = false;
let score = 0;
let time = 0;
let oldnum, oldernum;

const classes = ['red','green','blue','orange'];

function color(x,y) {
	const deg = Deg(x,y);
	let col;
	if (deg < 45 && deg > -45 && x > 0) col = 'green', k(10,150,200);
	if (Math.abs(deg) > 45 && y > 0) col = 'blue', k(10,200,200);
	if (deg < 45 && deg > -45 && x < 0) col = 'orange', k(10,100,200);
	if (Math.abs(deg) > 45 && y < 0) col = 'red', k(10,50,200);
	clickArr.push(col);
	return col;
}

function clicked(e) {
	if(!e.isTrusted) return; // cheater!
	colClick = color(e.offsetX, e.offsetY);
	board.classList.add(colClick);
	for(let i=0;i<clickArr.length;i++){
		if (clickArr[i] != colArr[i]) return gameOver();
	}	
	setTimeout(() => {
		board.classList.remove(colClick);
	}, 200);
	
	if (JSON.stringify(clickArr) == JSON.stringify(colArr) && clickArr.length == colArr.length) {
		setTimeout(() => {
			score++,
			scoreBoard.textContent = score;
			repeatArr();
		}, 200);
	}
}

function gameOver(){
	board.classList.add(...classes);
	setTimeout(() => {k(10,40,300);board.classList.remove('blue', 'red');}, 300);
	setTimeout(() => {k(10,30,300);board.classList.add('blue', 'red');board.classList.remove('green', 'orange');}, 600);
	setTimeout(() => {k(10,20,300);board.classList.remove(...classes);}, 900);
	board.removeEventListener('click', clicked);
	colArr = [], clickArr = [];
	gamesStarted = false;	
	board.classList.add('waiting');
	saveScores(score);
}

function repeatArr(){
	board.removeEventListener('click', clicked);
	let freq, ind = 0;
	
	(function myLoop(i) {
		setTimeout(function() {
			let cl = colArr[ind++];
			board.classList.add(cl);
			if (cl == 'red') freq = 50;
			if (cl == 'green') freq = 150;
			if (cl == 'blue') freq = 200;
			if (cl == 'orange') freq = 100;
			k(10,freq,200);
			setTimeout(() => {
				board.classList.remove(...classes);
			}, 800);                
			if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
			else setTimeout(() => {nextColor();}, 1000);
		}, 1000)
	})(colArr.length);  //  pass the number of iterations as an argument
}

function randomColor() {
	let num = Math.floor(Math.random() * 4);
	if (num == oldernum) oldernum=null,randomColor(); //only two colors in a row
	else innerRandom();
	function innerRandom(){
		let colo;
		if (num == 0) colo = 'red', k(10,50,200);
		if (num == 1) colo = 'green', k(10,150,200);
		if (num == 2) colo = 'blue', k(10,200,200);
		if (num == 3) colo = 'orange', k(10,100,200);
		colArr.push(colo);
		board.classList.add(colo);
		oldernum = oldnum;
		oldnum = num;
	}
}

function nextColor() {
	board.removeEventListener('click', clicked);
	mode.textContent = "Easy";
	setTimeout(() => {randomColor();}, 200);
	setTimeout(() => {board.classList.remove(...classes);}, 1000);
	setTimeout(() => {
		board.addEventListener('click', clicked), clickArr = [];
	}, 1200);
}

function startGame() {
	if (gamesStarted) return;
	board.classList.remove('waiting');
	gamesStarted = true;
	colArr = [], clickArr = [];
	scoreBoard.textContent = 0;
	score = 0;
	nextColor();
}

var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false; 
if (AudioContext) {var a = new AudioContext();}
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

try {
	(async () => {
		const serverScore = await fetch('./uploads/simonscores.json')
			.then(result => result.json());	
		const localScore = JSON.parse(localStorage.getItem("simonScores"));
		const allScore = (!localScore) ? serverScore : [...serverScore,...localScore];
		allScore.sort((a,b) => b[1] - a[1]);			
		const table = document.getElementById('board');
		allScore.forEach(val => {
			let row = table.insertRow(-1);
			row.insertCell(0).innerHTML = val[0];
			row.insertCell(1).innerHTML = val[1];
		});
	})();
}catch(err){}

board.classList.add('waiting');

//startup
document.cookie="game=simon";
document.getElementById("userName").value = getSavedValue("userName");
ip();