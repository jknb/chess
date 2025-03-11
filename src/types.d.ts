type Color = "white" | "black";
type Type = "pawn" | "rook" | "bishop" | "knight" | "queen" | "king";
type Piece = `${Color}_${Type}`;
type Board = (Piece | null)[][];
type Position = { row: number; col: number };
type Nullable<T> = T | null;
type GameStatus = "playing" | "check" | "checkmate" | "draw";
