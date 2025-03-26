import TitleInput from "@components/Input/TitleInput";
import ButtonSection from "./components/ButtonSection";
import { useEffect, useState } from "react";
import useToast from "@hooks/useToast";
import PasswordInput from "./components/PasswordInput";
import { useGetUserData } from "./hooks/useGetUserData";
import { useEditUserData } from "./hooks/useEditUserData";
import { IoMdClose } from "@/components/Icons";

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
  const [originalPassword, setOriginalPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const { data: user } = useGetUserData();
  const editUserMutation = useEditUserData();

  const [formData, setFormData] = useState<EditForm>({
    avatarUrl: user?.avatarUrl || "",
    nickname: user?.nickname || "",
    password: {
      original: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    const handleDialogClose = () => {
      setShowOriginalPassword(false);
      setShowNewPassword(false);
      setOriginalPassword("");
      setNewPassword("");
      setNickname(user ? user.nickname : "");
    };

    const dialogElement = dialogRef.current;
    dialogElement?.addEventListener("close", handleDialogClose);
    setNickname(user ? user.nickname : "");

    return () => {
      dialogElement?.removeEventListener("close", handleDialogClose);
    };
  }, [dialogRef, user]);

  const resetModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    closeModal();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      resetModal();
    }
  };

  const handleClose = () => { resetModal(); };

  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      nickname: e.target.value,
    }));

    setNickname(e.target.value);
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

    editUserMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("회원 정보가 변경되었습니다.");
        resetModal();
      },
      onError: () => {
        toast.error("회원 정보 변경에 실패했습니다.");
      }
    });
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
          <IoMdClose className="text-gray-black" size={7} />
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
            onChange={handleChangeNickname}
            minLength={2}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-semibold-l text-gray-black">비밀번호 변경</p>
          {user?.loginType === "native" ? (
            <>
              <PasswordInput
                placeholder="기존 비밀번호를 입력하세요"
                password={originalPassword}
                showPassword={showOriginalPassword}
                setShowPassword={setShowOriginalPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handlePasswordChange("original", e.target.value);
                  setOriginalPassword(e.target.value);
                }}
              />
              <PasswordInput
                placeholder="변경할 비밀번호를 입력하세요"
                password={newPassword}
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handlePasswordChange("newPassword", e.target.value);
                  setNewPassword(e.target.value);
                }}
              />
            </>
          ) : (
            <p className="text-medium-l text-gray-600">
              일반 로그인 외에는 비밀번호를 변경할 수 없습니다.
            </p>
          )}
        </div>
      </div>
      <ButtonSection closeModal={resetModal} onSubmit={handleSubmit} />
    </dialog>
  );
};

export default ProfileEditModal;
