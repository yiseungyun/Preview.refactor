import useModalStore from "@stores/useModalStore";
import { MdEdit } from "react-icons/md";

const Profile = ({ nickname }: { nickname: string }) => {
  const { openModal } = useModalStore();

  return (
    <div className="flex flex-row gap-8">
      <div className="relative bg-gray-50 rounded-full w-32 h-32 border-2 border-gray-100 overflow-hidden">
        <div className="absolute rounded-full w-12 h-12 bg-gray-500 top-5 left-1/2 -translate-x-1/2"></div>
        <div className="absolute rounded-custom-3xl w-32 h-32 bg-gray-500 top-[4.75rem]"></div>
      </div>
      <div className="flex flex-col my-2">
        <div className="flex flex-row mb-2 items-center gap-2">
          <p className="text-gray-black text-semibold-xl">회원 정보</p>
          <button onClick={openModal}>
            <MdEdit className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <p className="text-gray-black text-medium-xl">{nickname}</p>
      </div>
    </div>
  );
};

export default Profile;
