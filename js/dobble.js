const scoreBoard = document.querySelector('.score');
const scoreBoard2 = document.querySelector('.score2');
const cardsLeft = document.querySelector('.cardsLeft');
const timeLeft = document.querySelector('.timeLeft');
const P1Deck = document.querySelectorAll('.P1');
const HouseDeck = document.querySelectorAll('.House');
const P2Deck = document.querySelectorAll('.P2');
let interval = 0;
let deck = [];
let gamesStarted = false;
let noHighScore = false;
let score = 0, score2 = 0;
let lastP1Card = [], lastP2Card = [];

const symbols = ['hotdog','taco','corn','orange','lemon','banana','tomato',
'apple','bread','fries','cake','shroom','pom','eggplant','grapes','melon','watermelon',
'pear','plum','cherries','strawberry','burger','pizza','rib','leg','cone','icecream','balls',
'donut','slice','mouse','bull','oxe','cow','tiger','leopard','rabbit','cat','sheep','monkey',
'chicken','hen','dog','doge','pig','boar','elefant','octopus','fish','puffer','turtle','chick',
'whale','horse','ape','woof','oink'];
  
const toSymbol = (ind) => symbols[ind-1];

function startGame() {
	if (gamesStarted) return;
	gamesStarted = true;
	noHighScore = false;
	scoreBoard.textContent = 0;
	scoreBoard2.textContent = 0;
	score = 0, score2 = 0;
	deck = createDeck();
	newP1Card();
	newHouseCard();
	newP2Card();
	startTimer(60); //countdown 1 min
	cardsLeft.textContent = deck.length;
}

function createDeck(){	
//The number of symbols on a card has to be a prime number + 1
	const numberOfSymbolsOnCard = 8;   //(7 + 1);
	let shuffleSymbolsOnCard = false;
	let cards = [];

	//Work out the prime number
	const n = numberOfSymbolsOnCard - 1;

	//Total number of cards that can be generated following the Dobble rules
	numberOfCards = n**2 + n + 1;  //e.g. 7^2 + 7 + 1 = 57;

	//Add first set of n+1 cards (e.g. 8 cards)
	for (let i = 0; i < n+1; i++){
		//Add new card with first symbol
		cards.push([1]);
		//Add n+1 symbols on the card (e.g. 8 symbols)
		for (let j = 0; j < n; j++){
			cards[i].push((j+1)+(i*n)+1);
		}
	}
	//Add n sets of n cards 
	for (let i = 0; i < n; i++){
		for (let j = 0; j < n; j++){
		//Append a new card with 1 symbol
			cards.push([i+2]);
			//Add n symbols on the card (e.g. 7 symbols)
			for (let k = 0; k < n; k++){
				let val = (n+1 + n*k + (i*k+j)%n)+1;
				cards[cards.length-1].push(val);
			}		
		}
	}
	shuffleArray(cards);
	cards.map(arr => shuffleArray(arr)); //shuffle deck
	cards = cards.map(i => i.map(j => toSymbol(j))); //convert to symbols
	return cards;
}
//console.table(createDeck());
const spin = () => Math.round(Math.random() * (360));

function newP1Card(){
	if (deck.length == 0) {
		P1Deck.forEach((symb,ind) => {
			symb.classList.remove(...symb.classList);
			symb.classList.add('P1');
			symb.removeEventListener('click',clicked);
		});	
		cardsGone();
	}
	else {
		lastP1Card = deck.shift();
		P1Deck.forEach((symb,ind) => {
			//symb.innerHTML = lastP1Card[ind];
			symb.classList.remove(...symb.classList);
			symb.classList.add('P1',lastP1Card[ind]);
			symb.addEventListener('click',clicked);
			symb.style.transform = 'rotate(' + spin() + 'deg)';
		});
	}
}
function newP2Card(){
	if (deck.length == 0) {
		P2Deck.forEach((symb,ind) => {
			symb.classList.remove(...symb.classList);
			symb.classList.add('P2');
			symb.removeEventListener('click',clicked);
		});	
		cardsGone();
	}
	else {
		lastP2Card = deck.shift();
		P2Deck.forEach((symb,ind) => {
			symb.classList.remove(...symb.classList);
			symb.classList.add('P2',lastP2Card[ind]);
			symb.addEventListener('click',clicked);
			symb.style.transform = 'rotate(' + spin() + 'deg)';
		});	
	}
}
function newHouseCard(){
	newCard = deck.shift();
	HouseDeck.forEach((symb,ind) => {
		symb.classList.remove(...symb.classList);
		symb.classList.add('House',newCard[ind]);
		symb.style.transform = 'rotate(' + spin() + 'deg)';
	});
}
function moveToHouse(oldCard){
	newCard = oldCard;
	HouseDeck.forEach((symb,ind) => {
		symb.classList.remove(...symb.classList);
		symb.classList.add('House',newCard[ind]);
		symb.style.transform = 'rotate(' + spin() + 'deg)';
	});
}

function cardsGone() {
	gamesStarted = false;	
	document.getElementById("TempScore").innerHTML = "No more cards left! Press Start to continue.";
		$( "#TempScore" ).fadeIn(100);
		setTimeout(function(){
			$( "#TempScore" ).fadeOut(500);	
		}, 3000);
	return;	
}

function clicked(e) {
	if(!e.isTrusted) return; // cheater!
	let classy = e.target.classList;
	let scored = false;
	HouseDeck.forEach(card => {
		if (classy[classy.length-1] == card.classList[card.classList.length-1]) {
			k(10,500,50);
			if (classy.value.includes('P1')){
				score++;
				moveToHouse(lastP1Card);
				newP1Card();				
			}
			else {
				score2++;
				moveToHouse(lastP2Card);
				newP2Card();	
				clearInterval(interval);	
				noHighScore = true;
			}
			cardsLeft.textContent = deck.length;
			scored = true;
			scoreBoard.textContent = score;
			scoreBoard2.textContent = score2;
		}
	});
	if (scored) return;
	k(10,30,200);
	if (classy.value.includes('P1')){
		score = score == 0 ? 0 : score-1;
	}
	else score2 = score2 == 0 ? 0 : score2-1;
	scoreBoard.textContent = score;
	scoreBoard2.textContent = score2;
}

function gameOver(){
	setTimeout(() => {k(10,40,300);}, 300);
	setTimeout(() => {k(10,30,300);}, 600);
	setTimeout(() => {k(10,20,300);}, 900);
	gamesStarted = false;	
	if (noHighScore) return; //don't records if P2 has played
	setTimeout(() => {saveScores(score)}, 1000);;
}

// gain, frequency, duration
const a=new AudioContext();
function k(w,x,y){
  v=a.createOscillator()
  u=a.createGain()
  v.connect(u)
  v.frequency.value=x
  v.type="square"
  u.connect(a.destination)
  u.gain.value=w*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+y*0.001)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timeLeft.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
			clearInterval(interval);
			gameOver();			
        }
    }, 1000);
}

try {
	(async () => {
		const serverScore = await fetch('./uploads/dobblescores.json')
			.then(result => result.json());	
		const localScore = JSON.parse(localStorage.getItem("dobbleScores"));
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


//startup
document.cookie="game=dobble";
document.getElementById("userName").value = getSavedValue("userName");
ip();