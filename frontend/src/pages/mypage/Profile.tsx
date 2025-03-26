import ProfileIcon from "./components/ProfileIcon";
import useAuthStore from "@/stores/useAuthStore";
import ProfileEditModal from "./ProfileEditModal";
import { Suspense } from "react";
import { MdEdit } from "@/components/Icons";

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const Profile = ({ modal }: { modal: UseModalReturn }) => {
  const nickname = useAuthStore(state => state.nickname);

  return (
    <div className="w-full flex flex-row gap-8">
      <Suspense fallback={null}>
        <ProfileEditModal modal={modal} />
      </Suspense>
      <ProfileIcon url="" />
      <div className="flex flex-col my-2">
        <div className="flex flex-row mb-2 items-center gap-2">
          <p className="text-gray-black text-semibold-xl">회원 정보</p>
          <button onClick={modal.openModal}>
            <MdEdit size={5} className="text-gray-400" />
          </button>
        </div>
        <p className="text-gray-black text-medium-xl">{nickname}</p>
      </div>
    </div>
  );
};

export default Profile;
