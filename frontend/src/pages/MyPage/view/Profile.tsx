import { MdEdit } from "react-icons/md";
import ProfileIcon from "@components/MyPage/ProfileIcon";

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const Profile = ({
  nickname,
  modal,
}: {
  nickname: string;
  modal: UseModalReturn;
}) => {
  return (
    <div className="flex flex-row gap-8">
      <ProfileIcon />
      <div className="flex flex-col my-2">
        <div className="flex flex-row mb-2 items-center gap-2">
          <p className="text-gray-black text-semibold-xl">회원 정보</p>
          <button onClick={modal.openModal}>
            <MdEdit className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <p className="text-gray-black text-medium-xl">{nickname}</p>
      </div>
    </div>
  );
};

export default Profile;
