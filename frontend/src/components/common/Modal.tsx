import { useEffect, useRef } from "react";
import useModalStore from "../../stores/useModalStore";

interface ModalProps {
  title: string;
  subtitle: string;
  leftButton: string;
  rightButton: string;
  type: "red" | "green";
  onLeftClick: () => void;
  onRightClick: () => void;
}

const Modal = ({
  title,
  subtitle,
  leftButton,
  rightButton,
  type,
  onLeftClick,
  onRightClick,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isOpen, closeModal } = useModalStore();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick();
    }
    closeModal();
  };

  const handleRightClick = () => {
    if (onRightClick) {
      onRightClick();
    }
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="flex flex-col w-27.5 rounded-custom-l shadow-8 p-8 gap-4"
    >
      <div className="text-gray-black flex flex-col">
        {title.split("\\n").map((text, index) => {
          return (
            <p key={index}
              className="text-semibold-m flex justify-center"
            >{text}</p>
          )
        })}
        <span className="text-medium-l flex justify-center mt-1">{subtitle}</span>
      </div>
      <div className="flex w-full gap-2">
        <button
          className="bg-gray-50 h-12 w-full rounded-custom-m border-2 border-gray-100 text-semibold-r text-gray-600"
          onClick={handleLeftClick}
        >
          {leftButton}
        </button>
        <button
          className={`w-full h-12 rounded-custom-m border-2 border-gray-100 text-semibold-r text-gray-white
            ${type === "red" ? "bg-point-1" : "bg-green-500"}`}
          onClick={handleRightClick}
        >
          {rightButton}
        </button>
      </div>
    </dialog>
  );
};

export default Modal;
