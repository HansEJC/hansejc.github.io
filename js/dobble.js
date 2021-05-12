const scoreBoard = document.querySelector('.score');
const scoreBoard2 = document.querySelector('.score2');
const cardsLeft = document.querySelector('.cardsLeft');
const timeLeft = document.querySelector('.timeLeft');
const P1Deck = document.querySelectorAll('.P1');
const HouseDeck = document.querySelectorAll('.House');
const P2Deck = document.querySelectorAll('.P2');
const PlayerLabels = document.querySelectorAll('.Player');
let interval = 0;
let deck = [];
let gamesStarted = false;
let noHighScore = false;
let score = 0, score2 = 0;
let lastP1Card = [], lastP2Card = [];
const radios = document.querySelectorAll("input[name=players]");
radios.forEach(rad => rad.addEventListener('change',numPlayers));

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
  PlayerLabels.forEach(lab => lab.innerHTML="");
}

function createDeck(){
//The number of symbols on a card has to be a prime number + 1
  const numberOfSymbolsOnCard = 8;   //(7 + 1);
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
  if (deck.length == 0) emptyDeck(P1Deck,'P1');
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
  if (deck.length == 0) emptyDeck(P2Deck,'P2');
  else {
    lastP2Card = deck.shift();
    P2Deck.forEach((symb,ind) => {
      symb.classList.remove(...symb.classList);
      symb.classList.add('P2','Player2',lastP2Card[ind]);
      symb.addEventListener('click',clicked);
      symb.style.transform = 'rotate(' + spin() + 'deg)';
    });
  }
}

function emptyDeck(dk,pl){
  dk.forEach((symb,ind) => {
    symb.classList.remove(...symb.classList);
    symb.classList.add(pl);
    symb.removeEventListener('click',clicked);
  });
  cardsGone();
}

function newHouseCard(){
  newCard = deck.shift();
  HouseDecky();
}
function moveToHouse(oldCard){
  newCard = oldCard;
  HouseDecky();
}

function HouseDecky(){
  HouseDeck.forEach((symb,ind) => {
    symb.classList.remove(...symb.classList);
    symb.classList.add('House',newCard[ind]);
    symb.style.transform = 'rotate(' + spin() + 'deg)';
  });
}

function cardsGone() {
  gamesStarted = false;
  document.getElementById("TempScore").innerHTML = "No more cards left! Press Start to continue.";
    _('#TempScore').fade('in', 100);
    setTimeout(function(){
      _('#TempScore').fade('out', 500);
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
  PlayerLabels[0].innerHTML = "Player 1";
  PlayerLabels[1].innerHTML = "Reference";
  PlayerLabels[2].innerHTML = "Player 2";
  if (noHighScore) return; //don't records if P2 has played
  setTimeout(() => {saveScores(score)}, 1000);
}


var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;
if (AudioContext) {var a = new AudioContext();}

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

function numPlayers(){
  this.checked = true;
  let x = document.getElementById("Player2"), y = document.getElementById("Score2"), z = document.getElementById("GameTimer");
  if (this.id == 'SingleP') x.style.display = "none", y.style.display = "none", z.style.display = "block";
  else x.style.display = "flex", y.style.display = "block", z.style.display = "none";
}


//startup
localStorage.setItem(`game`,`dobble`);
document.getElementById("userName").value = getSavedValue("userName");
try {
  getScores();
}catch(err){logError(e);}