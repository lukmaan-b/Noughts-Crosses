let board;

let player = 'X';
let ai = 'O';

let scores;

function init() {
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const objects = document.querySelectorAll('img');
  objects.forEach((e) => e.remove());

  if (player === 'X') {
    playersTurn = true;
    scores = {
      X: -1,
      O: 1,
      tie: 0,
    };
    return;
  } else {
    playersTurn = false;
    scores = {
      X: 1,
      O: -1,
      tie: 0,
    };
    bestMove();
  }
}

function getSpacesLeft() {
  let moves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === 0) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
}

function equals(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  //Horizontal
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (equals(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
      }
    }
  }

  //Vertical
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (equals(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
      }
    }
  }

  // Diagonal
  if (equals(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  if ((winner == null) & (getSpacesLeft() == 0)) {
    return 'tie';
  } else {
    return winner;
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === 0) {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        board[i][j] = 0;
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  if (move) makeMove(ai, null, move);
}

function minimax(board, depth, isMaximising) {
  let winner = checkWinner();
  if (winner !== null) {
    return scores[winner];
  }
  if (isMaximising) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == 0) {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = 0;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == 0) {
          board[i][j] = player;
          let score = minimax(board, depth + 1, true);
          board[i][j] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

const table = document.querySelector('table');
table.addEventListener('click', (e) => {
  if (playersTurn) {
    const j = e.target.id.replace(/\w+-/g, '');
    const i = e.target.parentElement.id.replace(/\w+-/g, '');
    makeMove(player, e.target, { i, j });
    playersTurn = false;
    bestMove();
    const winner = checkWinner();
    if (winner != null) {
      alert(`${winner === 'tie' ? `It was a tie` : `${winner} won!`}`);
    }
  }
});

function makeMove(_player, target, { i, j }) {
  if (_player === player) {
    if (board[i][j] === 0) {
      const img = document.createElement('img');
      img.classList.add(`svg-${_player}`);
      img.src = `./assets/${_player}.svg`;
      target.append(img);
      board[i][j] = _player;
    }
  } else if (_player === ai) {
    target = document.querySelector(`#row-${i} > #box-${j}`);
    const img = document.createElement('img');
    img.classList.add(`svg-${_player}`);
    img.src = `./assets/${_player}.svg`;
    target.append(img);
    board[i][j] = _player;
    playersTurn = true;
  }
}

document.getElementById('reset').addEventListener('click', () => {
  init();
});

const playerOptionBtn = document.querySelectorAll('.player-option');
playerOptionBtn.forEach((btn) => {
  btn.addEventListener('click', selectPlayer);
});

function selectPlayer({ target }) {
  if (target.dataset.player === 'O') {
    const active = document.getElementsByClassName('active')[0];
    if (active) active.classList.remove('active');
    player = 'O';
    ai = 'X';
    target.classList.add('active');
    init();
  } else {
    const active = document.getElementsByClassName('active')[0];
    if (active) active.classList.remove('active');
    player = 'X';
    ai = 'O';
    target.classList.add('active');
    init();
  }
}

init();
