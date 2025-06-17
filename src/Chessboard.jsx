import React, { useState } from 'react';
import './Chessboard.css';
import { initialBoard, movePiece, isValidMove } from './chessLogic';

const pieceIcons = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
};

function Chessboard() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [highlightedMoves, setHighlightedMoves] = useState([]);

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      if (isValidMove(board, fromRow, fromCol, row, col)) {
        const newBoard = movePiece(board, fromRow, fromCol, row, col);
        setBoard(newBoard);
      }
      setSelectedSquare(null);
      setHighlightedMoves([]);
    } else {
      setSelectedSquare([row, col]);
      const piece = board[row][col];
      if (piece) {
        const moves = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (isValidMove(board, row, col, r, c)) {
              moves.push([r, c]);
            }
          }
        }
        setHighlightedMoves(moves);
      }
    }
  };

  return (
    <div className="chessboard">
      <div className="labels">
        {[...Array(8)].map((_, i) => (
          <div key={`row-${i}`} className="row-label" style={{ top: `${i * 12.5}%` }}>
            {8 - i}
          </div>
        ))}
        {[...Array(8)].map((_, i) => (
          <div key={`col-${i}`} className="col-label" style={{ left: `${i * 12.5}%` }}>
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((square, colIndex) => (
            <div
              key={colIndex}
              className={`square ${highlightedMoves.some(([r, c]) => r === rowIndex && c === colIndex) ? 'highlight' : ''} ${selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex ? 'selected' : ''}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {square ? pieceIcons[square] : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Chessboard;
