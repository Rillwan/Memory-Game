import { useEffect, useMemo, useRef } from "react";
import "./App.css";
import { useState } from "react";
import Confetti from "react-confetti";

const gameIcons = ["☂️", " 🧵","🚑","😀","🐵","🐄","👭","🎁","💚"];

function App() {
  const [pieces, setPieces] = useState([]);
  let timeout = useRef();

  const isGameCompleted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.solved)) {
      return true;
    }
    return false;
  }, [pieces]);

  // console.log(gameIcons);

  const startGame = () => {
    const duplicateGameIcons = gameIcons.concat(gameIcons);

    const newGameIcons = [];
    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }
    setPieces(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleActive = (data) => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) return;

    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPieces(newPieces);
  };

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter((data) => data.flipped & !data.solved);
    // console.log(flippedData);

    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        setPieces(
          pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                piece.solved = true;
              } else {
                piece.flipped = false;
              }
            }
            return piece;
          })
        );
      }, 800);
    }
  };

  // const CheckIFGameFinished = () => {
  //   if (pieces.every((piece) => piece.solved)) {
  //     alert("!!!Solved");
  //   }
  // };

  useEffect(() => {
    gameLogicForFlipped();
    // if (pieces.length > 0) {
    //   CheckIFGameFinished();
    // }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [pieces]);

  // console.log(isGameCompleted);

  return (
    <>
      <main className="Home-Page">
        <h2>Memory Game in React</h2>
        <div className="container">
          {pieces.map((data, index) => (
            <div
              className={`flip-card ${
                data.flipped || data.solved ? "active" : ""
              }`}
              key={index}
              onClick={() => handleActive(data)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front"></div>
                <div className="flip-card-back">{data.emoji}</div>
              </div>
            </div>
          ))}
        </div>

        {isGameCompleted && (
          <div className="game-completed">
            <h1>YOU WIN !!!</h1>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
