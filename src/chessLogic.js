export const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];


// Add logic for specific piece movements
const pieceMovements = {
  p: (fromRow, fromCol, toRow, toCol, board) => {
    // Pawn movement logic
    const direction = fromRow < 4 ? 1 : -1; // Determine direction based on color
    if (toCol === fromCol && board[toRow][toCol] === null) {
      return toRow - fromRow === direction;
    }
    if (Math.abs(toCol - fromCol) === 1 && toRow - fromRow === direction) {
      return board[toRow][toCol] && board[toRow][toCol].toLowerCase() !== board[fromRow][fromCol].toLowerCase();
    }
    return false;
  },
  r: (fromRow, fromCol, toRow, toCol) => {
    // Rook movement logic
    return fromRow === toRow || fromCol === toCol;
  },
  n: (fromRow, fromCol, toRow, toCol) => {
    // Knight movement logic
    return (
      (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
      (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)
    );
  },
  b: (fromRow, fromCol, toRow, toCol) => {
    // Bishop movement logic
    return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
  },
  q: (fromRow, fromCol, toRow, toCol, board) => {
    // Queen movement logic (combines rook and bishop)
    return (
      pieceMovements.r(fromRow, fromCol, toRow, toCol, board) ||
      pieceMovements.b(fromRow, fromCol, toRow, toCol)
    );
  },
  k: (fromRow, fromCol, toRow, toCol) => {
    // King movement logic
    return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
  },
  // Add more pieces as needed
  // For example, 
};

export const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return false; // No piece to move
  }
  const moveLogic = pieceMovements[piece.toLowerCase()];
  return moveLogic ? moveLogic(fromRow, fromCol, toRow, toCol, board) : false;
};

export const movePiece = (board, fromRow, fromCol, toRow, toCol) => {
  if (!isValidMove(board, fromRow, fromCol, toRow, toCol)) {
    return board;
  }

  const newBoard = board.map(row => [...row]);
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  return newBoard;
};

// Temporarily suppress unused variable warnings for placeholder functions
/* eslint-disable no-unused-vars */

// Add logic for detecting check, checkmate, and draw
export const isCheck = (board, kingPosition) => {
  // Logic to determine if the king is in check
  return false; // Placeholder
};

export const isCheckmate = (board, kingPosition) => {
  // Logic to determine if the king is in checkmate
  return false; // Placeholder
};

export const isDraw = (board) => {
  // Logic to determine if the game is a draw
  return false; // Placeholder
};
// Re-enable unused variable warnings
/* eslint-enable no-unused-vars */
export const getPieceAt = (board, row, col) => {
  return board[row] && board[row][col];
};
export const getPieceColor = (piece) => {
  if (!piece) return null;
  return piece === piece.toLowerCase() ? 'black' : 'white';
};
export const getPieceType = (piece) => {
  if (!piece) return null;
  return piece.toLowerCase();
};
export const getPieceIcon = (piece) => {
  const pieceIcons = {
    'p': '♟', // Pawn
    'r': '♜', // Rook
    'n': '♞', // Knight
    'b': '♝', // Bishop
    'q': '♛', // Queen
    'k': '♚', // King
  };
  return pieceIcons[piece.toLowerCase()] || '';
};
export const getSquareColor = (row, col) => {
  return (row + col) % 2 === 0 ? 'light' : 'dark';
};
export const getSquareLabel = (row, col) => {
  const file = String.fromCharCode(65 + col); // Convert column index to letter (A-H)
  const rank = 8 - row; // Convert row index to rank (1-8)
  return `${file}${rank}`;
};
export const getSquarePosition = (row, col) => {
  return {
    top: `${(7 - row) * 12.5}%`,
    left: `${col * 12.5}%`,
  };
};
export const getHighlightedMoves = (board, row, col) => {
  const moves = [];
  const piece = board[row][col];
  if (!piece) return moves;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(board, row, col, r, c)) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
};

// Add logic for castling
export const canCastle = (board, kingPosition, rookPosition, hasMoved) => {
  const [kingRow, kingCol] = kingPosition;
  const [rookRow, rookCol] = rookPosition;

  if (hasMoved.king || hasMoved.rook) return false; // King or rook has moved
  if (kingRow !== rookRow) return false; // King and rook must be on the same row

  const direction = rookCol > kingCol ? 1 : -1;
  for (let col = kingCol + direction; col !== rookCol; col += direction) {
    if (board[kingRow][col]) return false; // Path must be clear
  }

  return true;
};

// Add logic for en passant
export const canEnPassant = (board, fromRow, fromCol, toRow, toCol, lastMove) => {
  const piece = board[fromRow][fromCol];
  if (piece.toLowerCase() !== 'p') return false; // Only pawns can perform en passant

  const [lastFromRow, , lastToRow, lastToCol] = lastMove;
  const lastPiece = board[lastToRow][lastToCol];

  if (lastPiece.toLowerCase() !== 'p') return false; // Last move must be a pawn
  if (Math.abs(lastFromRow - lastToRow) !== 2) return false; // Pawn must have moved two squares
  if (lastToRow !== fromRow) return false; // Must be on the same row
  if (Math.abs(lastToCol - fromCol) !== 1) return false; // Must be adjacent column

  return toRow === lastFromRow && toCol === lastToCol;
};

// Add logic for pawn promotion
export const promotePawn = (board, row, col, newPiece) => {
  const piece = board[row][col];
  if (piece.toLowerCase() !== 'p') return board; // Only pawns can be promoted

  const promotionRow = piece === 'P' ? 0 : 7;
  if (row !== promotionRow) return board; // Pawn must be on the promotion row

  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = newPiece;
  return newBoard;
};
export const resetBoard = () => {
  return initialBoard.map(row => [...row]);
};
export const getInitialBoard = () => {
  return initialBoard.map(row => [...row]);
};
export const getBoardState = (board) => {
  return board.map(row => [...row]);
};
export const setBoardState = (board, newBoard) => {
  return newBoard.map(row => [...row]);
};
