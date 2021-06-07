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
let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let currPlayer = 'Xplay';
mode.textContent = "Hard";
let squareClass;
let gamesStarted = false;
let firstMove = false, secondMove = false, thirdMove = false, fourthMove = false;
let firstMid = false, firstCor = false, firstEd = false;
const classInc = (sqr, cls) => squares[sqr].firstChild.classList.value.includes(cls);

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

function checker(three, type, row) {
  if (three.every(ev => ev.includes('X')) || three.every(ev => ev.includes('O'))) {
    row.forEach(el => el.classList.add(type));
    return true;
  }
  return false;
}

//available spots
function avail() {
  squareClass = [...squares].map(sq => sq.firstChild.classList.value);
  squareClass.forEach((s, ind) => {
    if (s.includes('X')) board[ind] = 'X';
    if (s.includes('O')) board[ind] = 'O';
  });
  return board.filter(s => s != "X" && s != "O");
}

function checkWin() {
  squareClass = [...squares].map(sq => sq.firstChild.classList.value);

  let r1 = [squareClass[0], squareClass[1], squareClass[2]];
  let r2 = [squareClass[3], squareClass[4], squareClass[5]];
  let r3 = [squareClass[6], squareClass[7], squareClass[8]];
  let c1 = [squareClass[0], squareClass[3], squareClass[6]];
  let c2 = [squareClass[1], squareClass[4], squareClass[7]];
  let c3 = [squareClass[2], squareClass[5], squareClass[8]];
  let d1 = [squareClass[0], squareClass[4], squareClass[8]];
  let d2 = [squareClass[2], squareClass[4], squareClass[6]];

  if (
    checker(r1, 'hwin', row1) ||
    checker(r2, 'hwin', row2) ||
    checker(r3, 'hwin', row3) ||
    checker(c1, 'vwin', col1) ||
    checker(c2, 'vwin', col2) ||
    checker(c3, 'vwin', col3) ||
    checker(d1, 'dlwin', diag1) ||
    checker(d2, 'drwin', diag2) ||
    squareClass.every(ev => ev.includes('play'))
  ) {
    gameOver();
    return true;
  }
  return false;
}
let iter = 0;
function minimax(reboard, player) {
  iter++;
  let array = avail();
  if (array.length == 9) return { index: 7 };
  if (winning(reboard, 'X')) {
    return { score: -10 };
  }
  else if (winning(reboard, 'O')) {
    return { score: 10 };
  }
  else if (array.length === 0) {
    return { score: 0 };
  }

  let moves = [], g;
  for (let i = 0; i < array.length; i++) {
    var move = {};
    move.index = reboard[array[i]];
    reboard[array[i]] = player;

    if (player == 'O') {
      g = minimax(reboard, 'X');
      move.score = g.score;
    } else {
      g = minimax(reboard, 'O');
      move.score = g.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  let bestMove, bestScore;
  if (player === 'O') {
    bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

// winning combinations
function winning(board, player) {
  return (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player) ? true : false;
}

const toggleMode = () => mode.textContent = mode.textContent === "Hard" ? 'Easy' : 'Hard';

function gameOver() {
  squares.forEach(sq => sq.addEventListener('click', bonk));
  setTimeout(() => {
    squares.forEach(sq => {
      sq.firstChild.classList.remove('Xplay', 'Oplay', 'dlwin', 'drwin');
      sq.classList.remove('hwin', 'vwin');
      gamesStarted = false;
    });
  }, 400);
  firstMove = false, secondMove = false, thirdMove = false, fourthMove = false;
  firstMid = false, firstCor = false, firstEd = false;
  gamesStarted = false;
  toggleMode();
}

function nextMove() {
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  if (checkWin()) return;
  let square;
  square = mode.textContent === "Hard" ? squares[minimax(board, 'O').index].firstChild : getMove();
  logError(`Scenarios assessed: ${iter}`); //check how many moves where simulated
  setTimeout(() => {
    square.classList.add('Oplay');
    checkWin();
    squares.forEach(sq => sq.addEventListener('click', bonk));
  }, 300);
}

function startGame() {
  if (gamesStarted) return;
  gamesStarted = true;
  toggleMode();
  setTimeout(() => { nextMove(); }, 1);
}

const Players = () => document.querySelector('#SingleP').checked ? 'Xplay' : togglePlayer();
const togglePlayer = () => currPlayer = currPlayer === 'Xplay' ? 'Oplay' : 'Xplay';

function bonk(e) {
  iter = 0;
  if (!e.isTrusted) return; // cheater!
  try {
    if (['Xplay', 'Oplay'].some(ev => this.firstChild.classList.value.includes(ev))) return;
    this.firstChild.classList.add(Players());
  } catch (err) {
    logError('no children exist yet');
    return;
  }
  if (document.querySelector('#SingleP').checked) {
    squares.forEach(sq => sq.removeEventListener('click', bonk));
    setTimeout(() => { nextMove(); }, 1);
  }
  else checkWin();
}

function twoSimp(sq1, sq2, sq3) {
  if (classInc(sq1 - 1, 'X') && classInc(sq2 - 1, 'X') && !classInc(sq3 - 1, 'play')) return squares[sq3 - 1].firstChild;
}

function checkTwo() {
  if (twoSimp(1, 2, 3)) return twoSimp(1, 2, 3);
  if (twoSimp(1, 3, 2)) return twoSimp(1, 3, 2);
  if (twoSimp(3, 2, 1)) return twoSimp(3, 2, 1);
  if (twoSimp(4, 5, 6)) return twoSimp(4, 5, 6);
  if (twoSimp(4, 6, 5)) return twoSimp(4, 6, 5);
  if (twoSimp(6, 5, 4)) return twoSimp(6, 5, 4);
  if (twoSimp(7, 8, 9)) return twoSimp(7, 8, 9);
  if (twoSimp(7, 9, 8)) return twoSimp(7, 9, 8);
  if (twoSimp(9, 8, 7)) return twoSimp(9, 8, 7);

  if (twoSimp(1, 4, 7)) return twoSimp(1, 4, 7);
  if (twoSimp(1, 7, 4)) return twoSimp(1, 7, 4);
  if (twoSimp(7, 4, 1)) return twoSimp(7, 4, 1);
  if (twoSimp(2, 5, 8)) return twoSimp(2, 5, 8);
  if (twoSimp(2, 8, 5)) return twoSimp(2, 8, 5);
  if (twoSimp(8, 5, 2)) return twoSimp(8, 5, 2);
  if (twoSimp(3, 6, 9)) return twoSimp(3, 6, 9);
  if (twoSimp(3, 9, 6)) return twoSimp(3, 9, 6);
  if (twoSimp(9, 6, 3)) return twoSimp(9, 6, 3);

  if (twoSimp(1, 5, 9)) return twoSimp(1, 5, 9);
  if (twoSimp(1, 9, 5)) return twoSimp(1, 9, 5);
  if (twoSimp(9, 5, 1)) return twoSimp(9, 5, 1);
  if (twoSimp(3, 5, 7)) return twoSimp(3, 5, 7);
  if (twoSimp(3, 7, 5)) return twoSimp(3, 7, 5);
  if (twoSimp(7, 5, 3)) return twoSimp(7, 5, 3);
}

function getMove() {
  let move = checkTwo();
  if (move) return move;
  if (!firstMove) {
    firstMove = true;
    return firstPlay();
  }
  if (!secondMove) {
    secondMove = true;
    return secondPlay();
  }
  if (!thirdMove) {
    thirdMove = true;
    return thirdPlay();
  }
  if (!fourthMove) {
    fourthMove = true;
    return fourthPlay();
  }
  return randomSquare();
}

function firstPlay() {
  if (classInc(4, 'X')) { //X in the middle
    firstMid = true;
    let idx = Math.floor(Math.random() * 4);
    idx = idx == 1 ? 6 : idx; idx = idx == 3 ? 8 : idx;  //random corner
    return squares[idx].firstChild;
  }
  if (squareClass.some(ev => ev.includes('X'))) return squares[4].firstChild;
  return squares[1].firstChild; //ideal starter move
}

function secondPlay() {
  if (firstMid) {
    if (classInc(0, 'O')) {
      if (classInc(2, 'X')) return squares[6].firstChild;
      if (classInc(8, 'X')) return squares[2].firstChild;
      if (classInc(6, 'X')) return squares[2].firstChild;
    }
    if (classInc(2, 'O')) {
      if (classInc(0, 'X')) return squares[8].firstChild;
      if (classInc(8, 'X')) return squares[0].firstChild;
      if (classInc(6, 'X')) return squares[8].firstChild;
    }
    if (classInc(6, 'O')) {
      if (classInc(0, 'X')) return squares[8].firstChild;
      if (classInc(2, 'X')) return squares[0].firstChild;
      if (classInc(8, 'X')) return squares[0].firstChild;
    }
    if (classInc(8, 'O')) {
      if (classInc(0, 'X')) return squares[6].firstChild;
      if (classInc(2, 'X')) return squares[6].firstChild;
      if (classInc(6, 'X')) return squares[2].firstChild;
    }
    if (classInc(1, 'X')) return squares[7].firstChild;
    if (classInc(5, 'X')) return squares[3].firstChild;
    if (classInc(7, 'X')) return squares[1].firstChild;
    if (classInc(3, 'X')) return squares[5].firstChild;
  }
  //ideal second move
  if (!classInc(0, 'X')) return squares[0].firstChild;
  if (!classInc(2, 'X')) return squares[2].firstChild;
  return randomSquare();
}

function thirdPlay() {
  //ideal third move
  if (!classInc(0, 'play')) return squares[0].firstChild;
  if (!classInc(2, 'play')) return squares[2].firstChild;
  if (!classInc(4, 'play')) return squares[4].firstChild;
  if (!classInc(6, 'play') && classInc(0, 'O')) return squares[6].firstChild;
  if (!classInc(8, 'play')) return squares[8].firstChild;
  return randomSquare();
}

function fourthPlay() {
  //ideal fourth move
  if (!classInc(3, 'play')) return squares[3].firstChild;
  if (!classInc(5, 'play')) return squares[5].firstChild;
  return randomSquare();
}