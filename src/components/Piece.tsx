import { pieces } from "../assets";

type Props = {
  color: Color;
  type: Type;
};

const Piece = ({ color, type }: Props) => {
  const pieceSrc = pieces[color][type];
  if (!pieceSrc) return null;

  return <img src={pieceSrc} alt={`${color} ${type}`} />;
};

export default Piece;
