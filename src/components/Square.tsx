import classNames from "classnames";
import Piece from "./Piece";
import { ReactElement } from "react";
import { getPieceAttributes } from "../utils";

type Props = {
  onClick: () => void;
  piece: Nullable<Piece>;
  isWhite: boolean;
  isSelected: boolean;
  canMoveTo: boolean;
};

const Square = ({
  onClick,
  piece,
  isWhite,
  canMoveTo,
  isSelected,
}: Props): ReactElement => {
  const [color, type] = piece ? getPieceAttributes(piece) : [];

  return (
    <div
      onClick={onClick}
      className={classNames("w-square aspect-square relative", {
        "bg-light": !isSelected && isWhite,
        "bg-dark": !isSelected && !isWhite,
        "bg-highlight-light": isSelected && isWhite,
        "bg-highlight-dark": isSelected && !isWhite,
      })}
    >
      <>
        {piece && <Piece color={color as Color} type={type as Type} />}
        {canMoveTo &&
          (piece ? (
            <div
              className={classNames(
                "absolute inset-0 rounded-full border-8 opacity-50",
                isWhite ? "border-highlight-light" : "border-highlight-dark"
              )}
            ></div>
          ) : (
            <div
              className={classNames(
                "absolute w-1/3 m-auto transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 aspect-square opacity-50s",
                isWhite ? "bg-highlight-light" : "bg-highlight-dark"
              )}
            ></div>
          ))}
      </>
    </div>
  );
};

export default Square;
