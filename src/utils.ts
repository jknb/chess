import { initialBoard } from "./constants";
import { PieceMoves, pieceMoves } from "./piece-moves";

export const isWhite = (row: number, col: number): boolean =>
  (row + col) % 2 === 1;

export const isPieceBelongsToCurrentPlayer = (
  piece: Piece,
  currentPlayer: Color
): boolean => piece?.startsWith(currentPlayer);

export const getValidMoves = ({
  piece,
  from,
  board,
}: {
  piece: Nullable<Piece>;
  from: Position;
  board: Board;
}): number[][] => {
  if (!piece) {
    return [];
  }

  const { row, col } = from;

  return getValidMovesWithoutCheck({
    piece,
    row,
    col,
    board,
    moves: pieceMoves,
  });
};

const getValidMovesWithoutCheck = ({
  piece,
  row,
  col,
  board,
  moves,
}: {
  piece: Piece;
  row: number;
  col: number;
  board: Board;
  moves: PieceMoves;
}): [number, number][] => {
  const [color, type] = getPieceAttributes(piece);
  const isWhite = color === "white";
  const potentialMoves = moves[type]({
    row,
    col,
    board,
    isWhite,
  });

  const validMoves: [number, number][] = [];

  for (const [targetRow, targetCol] of potentialMoves) {
    const boardCopy = copyBoard(board);

    boardCopy[targetRow][targetCol] = piece;
    boardCopy[row][col] = null;

    if (!isKingInCheck(boardCopy, isWhite)) {
      validMoves.push([targetRow, targetCol]);
    }
  }

  return validMoves;
};

const findKing = (board: Board, isWhite: boolean): number[] => {
  const kingCoords = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece) {
        const [color, type] = getPieceAttributes(piece);
        if (color === (isWhite ? "white" : "black") && type === "king") {
          kingCoords.push(row, col);
        }
      }
    }
  }

  return kingCoords;
};

const isKingInCheck = (board: Board, isWhite: boolean): boolean => {
  const opponentPrefix = isWhite ? "black" : "white";

  const [kingRow, kingCol] = findKing(board, isWhite);

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const oponnentPiece = board[row][col];

      if (!oponnentPiece || !oponnentPiece.startsWith(opponentPrefix)) {
        continue;
      }

      const [, type] = getPieceAttributes(oponnentPiece);

      const opponentPiecePotentialMoves = pieceMoves[type]({
        row,
        col,
        board,
        isWhite: !isWhite,
      });

      for (const [moveRow, moveCol] of opponentPiecePotentialMoves) {
        if (moveRow === kingRow && moveCol === kingCol) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isMoveValid = ({
  piece,
  from,
  to,
  board,
}: {
  piece: Piece;
  from: Position;
  to: Position;
  board: Board;
}): boolean =>
  getValidMoves({ piece, from, board }).some(
    ([validRow, validCol]) => validRow === to.row && validCol === to.col
  );

export const getPieceAttributes = (piece: Piece): [Color, Type] => {
  return piece.split("_") as [Color, Type];
};

export const checkGameStatus = (
  board: Board,
  nextPlayer: "white" | "black"
): GameStatus => {
  const isWhite = nextPlayer === "white";
  const kingInCheck = isKingInCheck(board, isWhite);
  let hasValidMove = false;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];

      if (!piece || !piece.startsWith(nextPlayer)) {
        continue;
      }

      const validMoves = getValidMovesWithoutCheck({
        piece,
        row,
        col,
        board,
        moves: pieceMoves,
      });

      if (validMoves.length > 0) {
        hasValidMove = true;
        break;
      }
    }

    if (hasValidMove) {
      break;
    }
  }

  if (kingInCheck) {
    return hasValidMove ? "check" : "checkmate";
  } else {
    return hasValidMove ? "playing" : "draw";
  }
};

export const getMessage = (
  gameStatus: GameStatus,
  currentPlayer: "white" | "black"
): string => {
  let message = "";
  if (gameStatus === "checkmate") {
    message = `${currentPlayer} won`;
  } else if (gameStatus === "draw") {
    message = "Draw";
  }

  return message;
};

export const getNewBoard = (): Board => copyBoard(initialBoard);
export const copyBoard = (board: Board): Board => board.map((row) => [...row]);
