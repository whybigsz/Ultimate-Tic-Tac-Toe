import React from 'react';
import './board.css';

const Board = ({ board, activeBoardIndex, handleCellClick, calculateWinner, boardIndex,currentSymbol}) => {
  const renderCell = (cellValue, cellIndex) => {
    const cellClassName = `cell ${activeBoardIndex === boardIndex ? `active-${currentSymbol}` : ''}`;
    const xClassName = cellValue === 'X' ? 'x-cell' : '';
    const oClassName = cellValue === 'O' ? 'o-cell' : '';

     // Determine if the current board is a winning board
     const winningPlayer = calculateWinner(board);
     const isWinningBoard = winningPlayer !== null;
 
     // Apply different background colors based on the winning player
     let winningClassName = '';
     if (isWinningBoard) {
       if (winningPlayer === 'X') {
         winningClassName = 'winning-cell-x';
       } else if (winningPlayer === 'O') {
         winningClassName = 'winning-cell-o';
       }
     }

    return (
      <button
        className={`${cellClassName} ${xClassName} ${oClassName} ${winningClassName}`}
        onClick={() => handleCellClick(cellIndex)}
      >
        {cellValue}
      </button>
    );
  };

  return (
    <div className="board-container">
      {board.map((cellValue, cellIndex) => (
        <div key={cellIndex} className="cell-container">
          {renderCell(cellValue, cellIndex)}
        </div>
      ))}
    </div>
  );
};

export default Board;