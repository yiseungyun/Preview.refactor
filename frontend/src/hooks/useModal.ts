import { useEffect } from "react";

const useModal = ({
  dialogRef,
  isModalOpen,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isModalOpen: boolean;
}) => {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isModalOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isModalOpen, dialogRef]);
};

export default useModal;
