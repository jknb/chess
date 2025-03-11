import { ReactElement } from "react";

type Props = {
  coords: string[] | number[];
};

const Coords = ({ coords }: Props): ReactElement[] => {
  return coords.map((label) => (
    <div key={label} className="text-xs w-1/8 sm:text-base md:text-lg">
      {label}
    </div>
  ));
};

export default Coords;
