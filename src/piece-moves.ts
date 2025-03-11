type Directions = [number, number][];
type ValidMoves = number[][];
type GetMovesFunction = ({
  row,
  col,
  board,
  isWhite,
}: {
  row: Position["row"];
  col: Position["col"];
  board: Board;
  isWhite: boolean;
}) => number[][];

const isOpponentPiece = (piece: Nullable<Piece>, isWhite: boolean): boolean => {
  if (!piece) {
    return false;
  }

  return isWhite ? piece.startsWith("black") : piece.startsWith("white");
};

const isValidSquare = (square: Piece | null, isWhite: boolean): boolean => {
  return square === null || isOpponentPiece(square, isWhite);
};

const getSlidingPieceMoves =
  (directions: Directions): GetMovesFunction =>
  ({ row, col, board, isWhite }) => {
    const moves: ValidMoves = [];

    directions.forEach(([dx, dy]) => {
      let r = row + dx;
      let c = col + dy;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (isValidSquare(board[r][c], isWhite)) {
          moves.push([r, c]);
          if (board[r][c] !== null) {
            break;
          }
        } else {
          break;
        }

        r += dx;
        c += dy;
      }
    });

    return moves;
  };

const getPawnMoves: GetMovesFunction = ({ row, col, board, isWhite }) => {
  const moves: ValidMoves = [];
  const direction = isWhite ? -1 : 1;

  if (
    row + direction >= 0 &&
    row + direction < 8 &&
    board[row + direction][col] === null
  ) {
    moves.push([row + direction, col]);

    const initialRow = isWhite ? 6 : 1;
    if (row === initialRow && board[row + 2 * direction][col] === null) {
      moves.push([row + 2 * direction, col]);
    }
  }

  if (
    col - 1 >= 0 &&
    row + direction >= 0 &&
    row + direction < 8 &&
    isOpponentPiece(board[row + direction][col - 1], isWhite)
  ) {
    moves.push([row + direction, col - 1]);
  }

  if (
    col + 1 < 8 &&
    row + direction >= 0 &&
    row + direction < 8 &&
    isOpponentPiece(board[row + direction][col + 1], isWhite)
  ) {
    moves.push([row + direction, col + 1]);
  }

  return moves;
};

const getKnightMoves: GetMovesFunction = ({ row, col, board, isWhite }) => {
  const moves: ValidMoves = [];
  const directions = [
    [-2, -1],
    [-2, 1],
    [2, -1],
    [2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
  ];

  directions.forEach(([dx, dy]) => {
    const r = row + dx;
    const c = col + dy;

    if (
      r >= 0 &&
      r < 8 &&
      c >= 0 &&
      c < 8 &&
      isValidSquare(board[r][c], isWhite)
    ) {
      moves.push([r, c]);
    }
  });

  return moves;
};

const getKingMoves: GetMovesFunction = ({ row, col, board, isWhite }) => {
  const moves: ValidMoves = [];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  directions.forEach(([dx, dy]) => {
    const r = row + dx;
    const c = col + dy;

    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (isValidSquare(board[r][c], isWhite)) {
        moves.push([r, c]);
      }
    }
  });

  return moves;
};

const rookDirections: Directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const bishopDirections: Directions = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const queenDirections: Directions = [...rookDirections, ...bishopDirections];

type PieceName<T extends string> = T extends `${string}_${infer U}` ? U : never;

export type PieceMoves = {
  [K in PieceName<Piece>]: GetMovesFunction;
};

const pieceMoves: PieceMoves = {
  pawn: getPawnMoves,
  rook: getSlidingPieceMoves(rookDirections),
  bishop: getSlidingPieceMoves(bishopDirections),
  queen: getSlidingPieceMoves(queenDirections),
  knight: getKnightMoves,
  king: getKingMoves,
};

export { pieceMoves };
