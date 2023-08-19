import React, { useState,useEffect } from 'react';
import Board from './components/Board/board.component';
import Cell from './components/Cell/cell.component';
import './App.css';

function App() {

  //StartGame
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Time, setPlayer1Time] = useState(60); // Initial game time for player 1
  const [player2Time, setPlayer2Time] = useState(60); // Initial game time for player 2
  const [gameMode, setGameMode] = useState('PVP');
  const [computerMove, setComputerMove] = useState(false);

  //Jogo
  const [boards, setBoards] = useState(Array(9).fill(Array(9).fill(null)));
  const [activeBoardIndex, setActiveBoardIndex] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const [boardWinners, setBoardWinners] = useState(Array(9).fill(null));
  const [generalBoardWinner, setGeneralBoardWinner] = useState(null); // State variable for the winner of the general board

  const handlePlayerNameChange = (e, playerNumber) => {
    const playerName = e.target.value;
    if (playerNumber === 1) {
      setPlayer1(playerName);
    } else if (playerNumber === 2) {
      setPlayer2(playerName);
    }
  };

  const handleStartGame = () => {
    // Randomly decide the first player and associated symbol
    const players = [player1, player2];
    const symbols = ['X', 'O'];
    const randomIndex = Math.floor(Math.random() * 2);
    const randomPlayer = players[randomIndex];
    const randomSymbol = symbols[randomIndex];

    setCurrentPlayer(randomPlayer);
    setCurrentSymbol(randomSymbol);
    setGameStarted(true);
    setPlayer1Time(60); // Reset player 1's game time to the initial value
    setPlayer2Time(60); // Reset player 2's game time to the initial value

    if (gameMode === 'PVM' && randomPlayer === player2) {
      setComputerMove(true);
    }
  };

  const handleRestartGame = () => {
    setBoards(Array(9).fill(Array(9).fill(null)));
    setActiveBoardIndex(null);
    setWarningMessage(null);
    setBoardWinners(Array(9).fill(null));
    setGeneralBoardWinner(null);
    setPlayer1Time(60); // Reset player 1's game time to the initial value
    setPlayer2Time(60); // Reset player 2's game time to the initial value
  };

  const handleCellClick = (boardIndex, cellIndex) => {
  if (activeBoardIndex !== null && activeBoardIndex !== boardIndex) {
    return; // Player can only play in the active mini-board
  }

  const board = boards[boardIndex];

  if (calculateWinner(board)) {
    setWarningMessage("You hit a finished game. Choose another board.");
    setActiveBoardIndex(null);
    return; // Board is already won
  }

  if (board[cellIndex]) {
    setWarningMessage("Cell is already occupied. Choose another cell.");
    return; // Cell is already occupied
  }


  const newBoards = boards.map((board, index) => {
    if (index === boardIndex) {
      const newBoard = [...board];
      newBoard[cellIndex] = currentSymbol; // Use the current player's symbol
      return newBoard;
    }
    return board;
  });

  if (gameMode === 'PVM' && currentPlayer === player1) {
    setComputerMove(true); // Set computer move to true if it's player vs machine and it's player1's turn
  }
  
  switchPlayers()
  
  
  setBoards(newBoards);
  setActiveBoardIndex(cellIndex); // Set the active mini-board index to the clicked cell index
  setWarningMessage(null); // Clear the warning message

  if (calculateWinner(newBoards[boardIndex])) {
    const updatedWinners = [...boardWinners];
    updatedWinners[boardIndex] = currentSymbol;
    setBoardWinners(updatedWinners);
  }
  
  if (
    calculateWinner(newBoards[boardIndex]) ||
    newBoards[boardIndex].every((cell) => cell !== null) || calculateWinner(newBoards[cellIndex])
  ) {
    setWarningMessage("You hit a finished game. Choose another board.");
    setActiveBoardIndex(null); // Set active mini-board to null if it is completed
  } else if (!newBoards[cellIndex].includes(null)) {
    setWarningMessage("It's a draw! Choose another board.");
    setActiveBoardIndex(null); // Set active mini-board to null for a draw
  } else {
    console.log(boardIndex)
    setActiveBoardIndex(cellIndex); // Set the active mini-board index to the clicked cell index
  }

  console.log(currentPlayer)


};


const switchPlayers = () => {
  setCurrentPlayer(currentPlayer === player1 ? player2 : player1); // Switch players
  setCurrentSymbol(currentSymbol === 'X' ? 'O' : 'X'); // Switch symbols
};

useEffect(() => {
  console.log(currentPlayer)
  if (computerMove && currentPlayer === player2) {
    // PVM mode: Computer's turn
    setTimeout(() => {
      if (activeBoardIndex === null) {
        // Choose a random active mini-board
        const activeBoards = [];
        boards.forEach((board, index) => {
          if (!calculateWinner(board) && !board.every((cell) => cell !== null)) {
            activeBoards.push(index);
          }
        });

        const randomActiveBoardIndex = activeBoards[Math.floor(Math.random() * activeBoards.length)];

        // Choose a random empty cell in the active mini-board
        const emptyCells = [];
        boards[randomActiveBoardIndex].forEach((cell, index) => {
          if (!cell) {
            emptyCells.push(index);
          }
        });

        const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        handleCellClick(randomActiveBoardIndex, randomCellIndex);
      }else{
        // Choose a random empty cell in the active mini-board
        const emptyCells = [];
        boards[activeBoardIndex].forEach((cell, index) => {
          if (!cell) {
            emptyCells.push(index);
          }
        });

        const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        handleCellClick(activeBoardIndex, randomCellIndex);
      }
      setComputerMove(false);
    }, 500); // Delay before the computer's move
  }
}, [computerMove, currentPlayer, boards, activeBoardIndex]);

useEffect(() => {
  const timer = setInterval(() => {
    if (currentPlayer === player1 && player1Time > 0) {
      setPlayer1Time((prevTime) => prevTime - 1);
    } else if (currentPlayer === player2 && player2Time > 0) {
      setPlayer2Time((prevTime) => prevTime - 1);
    }
  }, 1000);

  const winner = calculateWinner(boardWinners);

  // Check if any player's timer has reached 0
  const player1TimerExpired = currentPlayer === player1 && player1Time === 0;
  const player2TimerExpired = currentPlayer === player2 && player2Time === 0;

  if (!generalBoardWinner && winner !== null) {
    // Delay the update of generalBoardWinner by 1 second
    const delay = 1000; // 1 second
    const timeoutId = setTimeout(() => {
      setGeneralBoardWinner(winner);
    }, delay);

    // Clean up the interval and timeout if the component unmounts or the dependencies change
    return () => {
      clearInterval(timer);
      clearTimeout(timeoutId);
    };
  } else if (!generalBoardWinner && (player1TimerExpired || player2TimerExpired)) {
    // Determine the winner based on the player with the most boards
    const player1Boards = boardWinners.filter((symbol) => symbol === 'X').length;
    const player2Boards = boardWinners.filter((symbol) => symbol === 'O').length;

    let winner;
    if (player1Boards > player2Boards) {
      winner = 'X';
    } else if (player2Boards > player1Boards) {
      winner = 'O';
    } else {
      winner = 'Draw';
    }

    // Delay the update of generalBoardWinner by 1 second
    const delay = 1000; // 1 second
    const timeoutId = setTimeout(() => {
      setGeneralBoardWinner(winner);
      setGameStarted(false)
    }, delay);

    // Clean up the interval and timeout if the component unmounts or the dependencies change
    return () => {
      clearInterval(timer);
      clearTimeout(timeoutId);
    };
  }

  return () => {
    clearInterval(timer);
  };
}, [currentPlayer, currentSymbol, player1Time, player2Time, boardWinners, generalBoardWinner]);

  const calculateWinner = (board) => {
    if (!board) {
      return null;
    }
  
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
  
    return null;
  };

  return (
    <div className="app">
    <div className={`checkboxes-container ${!gameStarted ? '' : 'hidden'}`}>
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={gameMode === 'PVP'}
          onChange={() => {
            setGameMode('PVP')
            setPlayer2('')
          }}
        />
        <label>Jogador vs Jogador</label>
      </div>

      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={gameMode === 'PVM'}
          onChange={() => {
            setGameMode('PVM')
            setPlayer2('PC');
          }}
        />
        <label>Jogador vs PC</label>
      </div>
    </div>
    {!gameStarted && !generalBoardWinner && (
      <div className="player-input-container">
        <h2 className='title'>Insere nome dos Jogadores:</h2>
        <div className="checkbox-container">
          Jogador 1:
          <input type="text" value={player1} onChange={(e) => handlePlayerNameChange(e, 1)} />
        </div>
        {gameMode === 'PVP' && (
          <div className="checkbox-container">
            Jogador 2:
            <input type="text" value={player2} onChange={(e) => handlePlayerNameChange(e, 2)} />
          </div>
        )}
        {gameMode === 'PVM' && (
          <div className="checkbox-container">
            Jogador 2: {player2}
          </div>
        )}
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    )}
  
    {gameStarted && !generalBoardWinner && (
        <div>
          <h2 className="title">{player1} (X) vs {player2} (O) | Jogador a jogar: {currentPlayer} ({currentSymbol})</h2>
          <h2 className="title">{player1} Tempo: {player1Time} segundos | {player2} Tempo: {player2Time} segundos</h2>
          <div className="board">
            {boards.map((board, boardIndex) => (
              <Board
                key={boardIndex}
                board={board}
                activeBoardIndex={activeBoardIndex}
                handleCellClick={(cellIndex) => handleCellClick(boardIndex, cellIndex)}
                calculateWinner={calculateWinner} // Pass the calculateWinner function to the Board component
                boardIndex={boardIndex} // Pass the boardIndex for highlighting the winning cells
                currentSymbol={currentSymbol}
              />
            ))}
          </div>
        </div>
      )}
  
      {!generalBoardWinner && warningMessage && <div className="warning">{warningMessage}</div>}
      <div className="winners">
        {boardWinners.map((winner, index) => (
          <div key={index} className="winner-item">
            {!generalBoardWinner && winner ? `Jogador ${winner} ganhou o tabuleiro ${index + 1}` : ""}
          </div>
        ))}
        {generalBoardWinner && (
        <div className="winner-item">
          {generalBoardWinner === "Draw" ? <h2 className="result">Jogo Empatado</h2> : <h2 className="result">Jogador {generalBoardWinner} ganhou o jogo!</h2>}
        </div>
      )}
      </div>
      {generalBoardWinner && (
        <div className="player-input-container">
          <h2 className='title'>Game Over</h2>
          <button onClick={handleRestartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}


export default App;
