import { useEffect } from "react";

const useModal = ({
  dialogRef,
  isOpen,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
}) => {
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
  }, [isOpen, dialogRef]);
};

export default useModal;
