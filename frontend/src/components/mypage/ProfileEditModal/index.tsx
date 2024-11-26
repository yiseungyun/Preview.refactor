import TitleInput from "@/components/common/TitleInput";
import useModal from "@/hooks/useModal";
import useModalStore from "@/stores/useModalStore";
import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import ButtonSection from "./ButtonSection";
import InterestInput from "./InterestInput";
import useAuth from "@/hooks/useAuth";

const ProfileEditModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isModalOpen, closeModal } = useModalStore();
  const { nickname } = useAuth();

  useModal({ isModalOpen, dialogRef });

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  const closeHandler = () => {
    closeModal();
  };

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
          <p className="text-semibold-l text-gray-black">닉네임</p>
          <TitleInput
            placeholder="닉네임을 입력해주세요"
            initValue={nickname}
            onChange={() => {
              console.log("TitleInput");
            }}
            minLength={2}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">관심분야</p>
          <InterestInput />
        </div>
      </div>
      <ButtonSection />
    </dialog>
  );
};

export default ProfileEditModal;
