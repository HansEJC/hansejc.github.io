const squares = document.querySelectorAll('.square');
squares.forEach(sq => sq.addEventListener('click', bonk));
const row1 = document.querySelectorAll('.row1');
const row2 = document.querySelectorAll('.row2');
const row3 = document.querySelectorAll('.row3');
const col1 = document.querySelectorAll('.col1');
const col2 = document.querySelectorAll('.col2');
const col3 = document.querySelectorAll('.col3');
const diag1 = document.querySelectorAll('.diag1');
const diag2 = document.querySelectorAll('.diag2');
const mode = document.querySelector("#Mode");
let squareClass;
let gamesStarted = false;
let firstMove = false, secondMove = false, thirdMove = false, fourthMove = false;
let firstMid = false, firstCor = false, firstEd = false;

function randomTime(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function randomSquare() {
	const idx = Math.floor(Math.random() * squares.length);
	const square = squares[idx].firstChild;
	if (square.classList.value.includes('play')) {
		return randomSquare();
	}
	return square;
}

function checkStatus(){
	squareClass = [...squares]
		.map(sq => sq.firstChild.classList.value);
	
	let r1 = [squareClass[0],squareClass[1],squareClass[2]];
	let r2 = [squareClass[3],squareClass[4],squareClass[5]];
	let r3 = [squareClass[6],squareClass[7],squareClass[8]];
	let c1 = [squareClass[0],squareClass[3],squareClass[6]];
	let c2 = [squareClass[1],squareClass[4],squareClass[7]];
	let c3 = [squareClass[2],squareClass[5],squareClass[8]];
	let d1 = [squareClass[0],squareClass[4],squareClass[8]];
	let d2 = [squareClass[2],squareClass[4],squareClass[6]];
	
	if (r1.every(ev => ev.includes('X')) || r1.every(ev => ev.includes('O'))) row1.forEach(el => el.classList.add('hwin')), gameOver();
	if (r2.every(ev => ev.includes('X')) || r2.every(ev => ev.includes('O'))) row2.forEach(el => el.classList.add('hwin')), gameOver();
	if (r3.every(ev => ev.includes('X')) || r3.every(ev => ev.includes('O'))) row3.forEach(el => el.classList.add('hwin')), gameOver();
	if (c1.every(ev => ev.includes('X')) || c1.every(ev => ev.includes('O'))) col1.forEach(el => el.classList.add('vwin')), gameOver();
	if (c2.every(ev => ev.includes('X')) || c2.every(ev => ev.includes('O'))) col2.forEach(el => el.classList.add('vwin')), gameOver();
	if (c3.every(ev => ev.includes('X')) || c3.every(ev => ev.includes('O'))) col3.forEach(el => el.classList.add('vwin')), gameOver();
	if (d1.every(ev => ev.includes('X')) || d1.every(ev => ev.includes('O'))) diag1.forEach(el => el.classList.add('dlwin')), gameOver();
	if (d2.every(ev => ev.includes('X')) || d2.every(ev => ev.includes('O'))) diag2.forEach(el => el.classList.add('drwin')), gameOver();
	
	if (squareClass.every(ev => ev.includes('play'))){
		gameOver();
	}
	function gameOver(){
		squares.forEach(sq => sq.addEventListener('click', bonk));
		setTimeout(() => {
			squares.forEach(sq => {
				sq.firstChild.classList.remove('Xplay','Oplay','dlwin','drwin');
				sq.classList.remove('hwin','vwin');
				gamesStarted = false;
			});
		}, 400);
		firstMove = false, secondMove = false, thirdMove = false, fourthMove = false;
		firstMid = false, firstCor = false, firstEd = false;
		gamesStarted = false;
	}
}

function nextMove() {
	checkStatus();
	mode.textContent = "Easy";
	//const square = randomSquare();
	const square = hardMode();
	setTimeout(() => {
		square.classList.add('Oplay');
		checkStatus();
		squares.forEach(sq => sq.addEventListener('click', bonk));
	}, 300);
}

function startGame() {
	if (gamesStarted) return;
	gamesStarted = true;
	nextMove();
}

function bonk(e) {
	if(!e.isTrusted) return; // cheater!
	try{
		if (['Xplay','Oplay'].some(ev => this.firstChild.classList.value.includes(ev))) return;
		this.firstChild.classList.add('Xplay');
	}catch(err){
		console.log(err,'no children exist yet');
		return;
	}
	squares.forEach(sq => sq.removeEventListener('click', bonk));
	nextMove();
}

function hardMode() {
	if (!firstMove) {
		firstMove = true;
		if (squares[4].firstChild.classList.value.includes('X')) { //X in the middle
			firstMid = true;
			let idx = Math.floor(Math.random() * 4);
			idx = idx==1 ? 6 : idx; idx = idx==3 ? 8 : idx;	//random corner	
			return squares[idx].firstChild;
		}	
		if (squareClass.some(ev => ev.includes('X'))) return squares[4].firstChild;
		return squares[1].firstChild; //ideal starter move
	}
	if (!secondMove) {
		secondMove = true;
		if (firstMid) {
			if (squares[0].firstChild.classList.value.includes('O')) {
				if (squares[2].firstChild.classList.value.includes('X')) return squares[6].firstChild;
				if (squares[8].firstChild.classList.value.includes('X')) return squares[2].firstChild;
				if (squares[6].firstChild.classList.value.includes('X')) return squares[2].firstChild;
			}
			if (squares[2].firstChild.classList.value.includes('O')) {
				if (squares[0].firstChild.classList.value.includes('X')) return squares[8].firstChild;
				if (squares[8].firstChild.classList.value.includes('X')) return squares[0].firstChild;
				if (squares[6].firstChild.classList.value.includes('X')) return squares[8].firstChild;
			}
			if (squares[6].firstChild.classList.value.includes('O')) {
				if (squares[0].firstChild.classList.value.includes('X')) return squares[8].firstChild;
				if (squares[2].firstChild.classList.value.includes('X')) return squares[0].firstChild;
				if (squares[8].firstChild.classList.value.includes('X')) return squares[0].firstChild;
			}
			if (squares[8].firstChild.classList.value.includes('O')) {
				if (squares[0].firstChild.classList.value.includes('X')) return squares[6].firstChild;
				if (squares[2].firstChild.classList.value.includes('X')) return squares[6].firstChild;
				if (squares[6].firstChild.classList.value.includes('X')) return squares[2].firstChild;
			}
			if (squares[1].firstChild.classList.value.includes('X')) return squares[7].firstChild;
			if (squares[5].firstChild.classList.value.includes('X')) return squares[3].firstChild;
			if (squares[7].firstChild.classList.value.includes('X')) return squares[1].firstChild;
			if (squares[3].firstChild.classList.value.includes('X')) return squares[5].firstChild;
		}
		//ideal second move
		if (!squares[0].firstChild.classList.value.includes('X')) return squares[0].firstChild;
		if (!squares[2].firstChild.classList.value.includes('X')) return squares[2].firstChild;
	}
	if (!thirdMove) {
		thirdMove = true;
		
		//ideal third move
		if (!squares[0].firstChild.classList.value.includes('play')) return squares[0].firstChild;
		if (!squares[2].firstChild.classList.value.includes('play')) return squares[2].firstChild;
		if (!squares[4].firstChild.classList.value.includes('play')) return squares[4].firstChild;
		if (!squares[6].firstChild.classList.value.includes('play') && squares[0].firstChild.classList.value.includes('O')) return squares[6].firstChild;
		if (!squares[8].firstChild.classList.value.includes('play')) return squares[8].firstChild;
	}
	if (!fourthMove) {
		fourthMove = true;
		
		//ideal third move
		if (!squares[3].firstChild.classList.value.includes('play')) return squares[3].firstChild;
		if (!squares[5].firstChild.classList.value.includes('play')) return squares[5].firstChild;
	}
	return randomSquare();
}