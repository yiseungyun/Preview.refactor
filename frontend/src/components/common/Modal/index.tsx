import ModalTitle from "./Title";

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export interface ModalProps {
  modal: UseModalReturn;
  title: string;
  subtitle?: string;
  leftButton: string;
  rightButton: string;
  type: "red" | "green";
  onLeftClick?: () => void;
  onRightClick: () => void;
}

const Modal = ({
  modal: { dialogRef, isOpen, closeModal },
  title,
  subtitle,
  leftButton,
  rightButton,
  type,
  onLeftClick = () => { },
  onRightClick,
}: ModalProps) => {
  const handleButtonClick = (callback: () => void) => () => {
    callback();
    closeModal();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="flex flex-col w-27.5 rounded-custom-l shadow-8 p-8 gap-4"
      onMouseDown={handleMouseDown}
    >
      <ModalTitle title={title} subtitle={subtitle} />
      <div className="flex w-full gap-2">
        <button
          className="bg-gray-50 h-12 w-full rounded-custom-m border-2 border-gray-100 text-semibold-r text-gray-600"
          onClick={handleButtonClick(onLeftClick)}
        >
          {leftButton}
        </button>
        <button
          className={`w-full h-12 rounded-custom-m border-2 border-gray-100 text-semibold-r text-gray-white
            ${type === "red" ? "bg-point-1" : "bg-green-500"}`}
          onClick={handleButtonClick(onRightClick)}
        >
          {rightButton}
        </button>
      </div>
    </dialog>
  );
};

export default Modal;
