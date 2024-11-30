import TitleInput from "@components/common/TitleInput";
import { IoMdClose } from "react-icons/io";
import ButtonSection from "@components/mypage/ButtonSection";
import useAuth from "@hooks/useAuth";

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ProfileEditModal = ({
  modal: { dialogRef, isOpen, closeModal },
}: {
  modal: UseModalReturn;
}) => {
  const { nickname } = useAuth();

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  const closeHandler = () => {
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="w-42.5 rounded-custom-l shadow-8 pb-5"
      onMouseDown={handleMouseDown}
    >
      <div className="flex p-8">
        <h3 className="text-bold-m text-gray-black mr-6">회원 정보 수정</h3>
        <button className="ml-auto" onClick={closeHandler}>
          <IoMdClose className="text-gray-black w-7 h-7" />
        </button>
      </div>
      <div className="flex flex-col px-8 gap-4 pb-4">
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">아바타</p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">닉네임</p>
          <TitleInput
            placeholder="닉네임을 입력해주세요"
            initValue={nickname}
            onChange={() => {}}
            minLength={2}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">비밀번호 변경</p>
          <input
            className={
              "text-medium-m w-full h-11 p-4 pr-20 border-custom-s rounded-custom-m"
            }
            placeholder={""}
            minLength={8}
            maxLength={20}
          />
        </div>
      </div>
      <ButtonSection closeModal={closeModal} />
    </dialog>
  );
};

export default ProfileEditModal;
