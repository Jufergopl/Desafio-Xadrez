const boardElement = document.getElementById('board');

let state = {
    board: [],
    turn: 'white',
    selected: null
};

const unicodePieces = {
    'P': '♙','R': '♖','N': '♘','B': '♗','Q': '♕','K': '♔',
    'p': '♟','r': '♜','n': '♞','b': '♝','q': '♛','k': '♚'
};

function initBoard() {
    const initial = [
        'r','n','b','q','k','b','n','r',
        'p','p','p','p','p','p','p','p',
        '','','','','','','','',
        '','','','','','','','',
        '','','','','','','','',
        '','','','','','','','',
        'P','P','P','P','P','P','P','P',
        'R','N','B','Q','K','B','N','R'
    ];
    state.board = [];
    for (let i = 0; i < 8; i++) {
        state.board.push(initial.slice(i*8, i*8+8));
    }
}

function render() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i+j)%2 === 0 ? 'light' : 'dark');
            square.dataset.row = i;
            square.dataset.col = j;
            const piece = state.board[i][j];
            if (piece) square.textContent = unicodePieces[piece];
            if (state.selected && state.selected.row == i && state.selected.col == j) {
                square.classList.add('selected');
            }
            square.addEventListener('click', onSquareClick);
            boardElement.appendChild(square);
        }
    }
}

function onSquareClick(e) {
    const row = +e.currentTarget.dataset.row;
    const col = +e.currentTarget.dataset.col;
    const piece = state.board[row][col];

    if (state.selected) {
        // Attempt move
        const from = state.selected;
        if (isValidMove(from, {row, col})) {
            movePiece(from, {row, col});
            state.turn = (state.turn === 'white' ? 'black' : 'white');
        }
        state.selected = null;
    } else {
        // Select a piece
        if (piece && ((state.turn === 'white' && piece === piece.toUpperCase()) ||
            (state.turn === 'black' && piece === piece.toLowerCase()))) {
            state.selected = {row, col};
        }
    }
    render();
    if (isInCheck(opponent(state.turn))) {
        setTimeout(() => alert('Xeque em ' + opponent(state.turn)));
    }
}

function opponent(color) {
    return color === 'white' ? 'black' : 'white';
}

function isValidMove(from, to) {
    const piece = state.board[from.row][from.col];
    if (!piece) return false;
    // Basic: no capture of same color
    const target = state.board[to.row][to.col];
    if (target && ((piece === piece.toUpperCase() && target === target.toUpperCase()) ||
        (piece === piece.toLowerCase() && target === target.toLowerCase()))) {
        return false;
    }
    // TODO: Regex-based or switch by piece type for each movement
    // For brevity, allow any move (improper), but require from != to
    if (from.row === to.row && from.col === to.col) return false;
    return true;
}

function movePiece(from, to) {
    state.board[to.row][to.col] = state.board[from.row][from.col];
    state.board[from.row][from.col] = '';
}

function isInCheck(color) {
    // Simplified: check if opponent can capture the king in next move
    let kingPos = null;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const p = state.board[i][j];
            if (p === (color === 'white' ? 'K' : 'k')) {
                kingPos = {row: i, col: j};
            }
        }
    }
    if (!kingPos) return false;
    // Check all opponent pieces
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const p = state.board[i][j];
            if (p && ((color === 'white' && p === p.toLowerCase()) ||
                (color === 'black' && p === p.toUpperCase()))) {
                if (isValidMove({row:i,col:j}, kingPos)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Initialize and render
initBoard();
render();
