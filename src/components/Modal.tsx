import { ReactElement } from "react";

type Props = {
  isOpen?: boolean;
  onClick: () => void;
  btnTitle: string;
  message: string;
};

const GameOverModal = ({
  isOpen,
  onClick,
  btnTitle,
  message,
}: Props): Nullable<ReactElement> => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-4/5 max-w-md p-6 rounded-lg bg-menu"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-center text-white capitalize">
          {message}
        </h2>
        <div className="flex justify-evenly">
          <button
            onClick={onClick}
            className="px-16 py-3 text-center text-white transition duration-200 rounded-md bg-btn-primary hover:bg-btn-primary-hover"
          >
            {btnTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
