import TitleInput from "@components/common/TitleInput";
import { IoMdClose } from "react-icons/io";
import ButtonSection from "@components/mypage/ButtonSection";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";
import useToast from "@/hooks/useToast";
import { useUserStore } from "@/stores/useUserStore";

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

interface EditForm {
  avatarUrl: string;
  nickname: string;
  password: {
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
  const { user, editMyInfo } = useUserStore();

  const [formData, setFormData] = useState<EditForm>({
    avatarUrl: user?.avatarUrl || "",
    nickname: user?.nickname || "",
    password: {
      original: "",
      newPassword: "",
    },
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  const handleClose = () => {
    closeModal();
  };

  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      nickname: e.target.value,
    }));
  };

  const handlePasswordChange = (
    field: "original" | "newPassword",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      password: {
        ...prev.password!,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    // TODO: 추후 분리 필요

    // 비밀번호 변경하는 경우
    if (
      user?.loginType === "native" &&
      formData.password.newPassword &&
      formData.password.original
    ) {
      if (
        formData.nickname.trim().length < 2 ||
        formData.password.newPassword.trim().length < 7 ||
        formData.password.original.trim().length < 7
      ) {
        toast.error("올바른 값을 입력해주세요.");
        return;
      } else if (formData.password.newPassword === formData.password.original) {
        toast.error("기존 비밀번호와 같은 값을 입력했습니다.");
        return;
      } else if (
        !/[a-z]/.test(formData.password.newPassword) ||
        !/[0-9]/.test(formData.password.newPassword)
      ) {
        toast.error("비밀번호에 최소 하나의 숫자와 소문자를 넣어야합니다.");
        return;
      }
    } else if (
      user?.loginType === "native" &&
      ((formData.password.newPassword && !formData.password.original) ||
        (!formData.password.newPassword && formData.password.original))
    ) {
      toast.error("비밀번호 변경을 위해 둘 다 입력해주세요.");
      return;
    } else {
      if (formData.nickname === user?.nickname) {
        toast.error("변경사항이 없습니다.");
        return;
      }
    }

    try {
      await editMyInfo(formData);
      toast.success("회원 정보가 변경되었습니다.");
      closeModal();
    } catch (error) {
      toast.error("회원 정보 변경에 실패하였습니다.");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="w-42.5 rounded-custom-l shadow-8 pb-5"
      onMouseDown={handleMouseDown}
    >
      <div className="flex p-8">
        <h3 className="text-bold-m text-gray-black mr-6">회원 정보 수정</h3>
        <button className="ml-auto" onClick={handleClose}>
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
            initValue={user?.nickname}
            onChange={handleChangeNickname}
            minLength={2}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">비밀번호 변경</p>
          {user?.loginType === "native" ? (
            <>
              <div className="relative w-full">
                <input
                  className={
                    "text-medium-m w-full h-11 p-4 pr-20 border-custom-s rounded-custom-m"
                  }
                  type={showOriginalPassword ? "text" : "password"}
                  placeholder={"기존 비밀번호를 입력하세요"}
                  onChange={(e) =>
                    handlePasswordChange("original", e.target.value)
                  }
                  minLength={7}
                  maxLength={20}
                />
                <button
                  className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowOriginalPassword(!showOriginalPassword)}
                >
                  {showOriginalPassword ? (
                    <IoEyeOutline />
                  ) : (
                    <IoEyeOffOutline />
                  )}
                </button>
              </div>
              <div className="relative w-full">
                <input
                  className={
                    "text-medium-m w-full h-11 p-4 pr-20 border-custom-s rounded-custom-m"
                  }
                  type={showNewPassword ? "text" : "password"}
                  placeholder={"변경할 비밀번호를 입력하세요"}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  minLength={7}
                  maxLength={20}
                />
                <button
                  className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </button>
              </div>
            </>
          ) : (
            <p className="text-medium-l text-gray-600">
              일반 로그인 외에는 비밀번호를 변경할 수 없습니다.
            </p>
          )}
        </div>
      </div>
      <ButtonSection closeModal={closeModal} onSubmit={handleSubmit} />
    </dialog>
  );
};

export default ProfileEditModal;
