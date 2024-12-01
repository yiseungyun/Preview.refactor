import TitleInput from "@components/common/TitleInput";
import { IoMdClose } from "react-icons/io";
import ButtonSection from "@components/mypage/ButtonSection";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";
import useToast from "@/hooks/useToast";

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

interface EditForm {
  avatarUrl?: string;
  nickname?: string;
  password?: {
    original: string;
    newPassword: string;
  };
}

const ProfileEditModal = ({
  modal: { dialogRef, closeModal },
}: {
  modal: UseModalReturn;
}) => {
  const toast = useToast();
  const [showOriginalPassword, setShowOriginalPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  /*const { user, editMyInfo } = useUserStore();
  const [formData, setFormData] = useState<EditForm>({
    avatarUrl: user?.avatarUrl,
    nickname: user?.nickname,
    password: {
      original: "",
      newPassword: "",
    },
  });*/

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
          <p className="text-semibold-l text-gray-black">아바타</p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">닉네임</p>
          <TitleInput
            placeholder="닉네임을 입력해주세요"
            initValue={""}
            onChange={() => {}}
            minLength={2}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">비밀번호 변경</p>
          <div className="w-full relative">
            <input
              className={
                "text-medium-m w-full h-11 p-4 pr-20 border-custom-s rounded-custom-m"
              }
              type={showOriginalPassword ? "text" : "password"}
              placeholder={"기존 비밀번호를 입력하세요"}
              onChange={() => {}}
              minLength={8}
              maxLength={20}
            />
            <button
              className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowOriginalPassword(!showOriginalPassword)}
            >
              {showOriginalPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
          <div className="relative w-full">
            <input
              className={
                "text-medium-m w-full h-11 p-4 pr-20 border-custom-s rounded-custom-m"
              }
              type={showNewPassword ? "text" : "password"}
              placeholder={"변경할 비밀번호를 입력하세요"}
              onChange={() => {}}
              minLength={8}
              maxLength={20}
            />
            <button
              className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
        </div>
      </div>
      <ButtonSection closeModal={closeModal} onSubmit={() => {}} />
    </dialog>
  );
};

export default ProfileEditModal;
