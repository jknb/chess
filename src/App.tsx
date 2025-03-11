import { ReactElement, useState } from "react";
import Square from "./components/Square";
import {
  checkGameStatus,
  copyBoard,
  getMessage,
  getNewBoard,
  getValidMoves,
  isMoveValid,
  isPieceBelongsToCurrentPlayer,
  isWhite,
} from "./utils";
import Coords from "./components/Coords";
import GameOverModal from "./components/Modal";

type SelectedPiece = {
  piece: Piece;
  position: { row: number; col: number };
};

const App = (): ReactElement => {
  const [board, setBoard] = useState(getNewBoard());
  const [selectedPiece, setSelectedPiece] =
    useState<Nullable<SelectedPiece>>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Color>("white");
  const [validMoves, setValidMoves] = useState<number[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

  const selectPiece = (piece: Piece, row: number, col: number): void => {
    setSelectedPiece({ piece, position: { row, col } });
    setValidMoves(getValidMoves({ piece, from: { row, col }, board }));
  };

  const deselectPiece = (): void => {
    setSelectedPiece(null);
    setValidMoves([]);
  };

  const handleSquareClick = (row: number, col: number): void => {
    const piece = board[row][col];

    // No piece selected yet
    if (!selectedPiece) {
      if (piece && isPieceBelongsToCurrentPlayer(piece, currentPlayer)) {
        selectPiece(piece, row, col);
      }

      return;
    }

    const { piece: selected, position } = selectedPiece;

    // when clicking on the same square, deselect
    if (position.row === row && position.col === col) {
      deselectPiece();
      return;
    }

    // when clicking on a new piece owned by the same player, select that one
    if (piece && isPieceBelongsToCurrentPlayer(piece, currentPlayer)) {
      selectPiece(piece, row, col);
      return;
    }

    // when clicking on a valid square, move
    if (
      isMoveValid({
        piece: selected,
        from: position,
        to: { row, col },
        board,
      })
    ) {
      movePiece(position, { row, col });
      deselectPiece();
      return;
    }

    // when move is invalid, deselect
    deselectPiece();
  };

  const movePiece = (from: Position, to: Position): void => {
    const newBoard = copyBoard(board);
    newBoard[to.row][to.col] = board[from.row][from.col];
    newBoard[from.row][from.col] = null;

    setBoard(newBoard);

    const nextPlayer = currentPlayer === "white" ? "black" : "white";
    const status = checkGameStatus(newBoard, nextPlayer);

    setGameStatus(checkGameStatus(newBoard, nextPlayer));

    if (status !== "checkmate") {
      setCurrentPlayer(nextPlayer);
    }
  };

  const resetGame = (): void => {
    setBoard(getNewBoard());
    setSelectedPiece(null);
    setCurrentPlayer("white");
    setValidMoves([]);
    setGameStatus("playing");
  };

  return (
    <>
      <div className="w-screen h-screen">
        player: {currentPlayer}
        <div className="max-w-3xl m-auto my-20 aspect-square bg-board-bg">
          <div className="relative w-11/12 mx-auto transform translate-y-[4.1%] aspect-square">
            <div className="absolute left-0 flex justify-around w-full -bottom-[4%] text-coords">
              <Coords coords={["a", "b", "c", "d", "e", "f", "g", "h"]} />
            </div>
            <div className="flex flex-wrap">
              {board.map((row, i) =>
                row.map((piece, j) => (
                  <Square
                    onClick={() => handleSquareClick(i, j)}
                    piece={piece}
                    key={j}
                    isWhite={isWhite(i, j)}
                    isSelected={
                      selectedPiece?.position.row === i &&
                      selectedPiece.position.col === j
                    }
                    canMoveTo={validMoves.some(
                      ([validRow, validCol]) => validRow === i && validCol === j
                    )}
                  />
                ))
              )}
            </div>
            <div className="absolute top-0 -left-[3%] flex flex-col justify-around h-full text-coords">
              <Coords coords={[8, 7, 6, 5, 4, 3, 2, 1]} />
            </div>
          </div>
        </div>
      </div>

      <GameOverModal
        isOpen={gameStatus === "checkmate" || gameStatus === "draw"}
        onClick={resetGame}
        btnTitle="Rematch"
        message={getMessage(gameStatus, currentPlayer)}
      />
    </>
  );
};

export default App;
