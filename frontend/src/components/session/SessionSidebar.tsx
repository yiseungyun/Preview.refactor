import { FaClipboardList } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import useModalStore from "../../stores/useModalStore";
import Modal from "../common/Modal";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useToast from "../../hooks/useToast";

interface Props {
  socket: Socket | null;
  question: string;
  participants: string[];
  roomId: string;
}

const SessionSidebar = ({ socket, question, participants, roomId }: Props) => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();
  const toast = useToast();

  const existHandler = () => {
    socket?.emit("leave_room", { roomId });
    toast.success('메인 화면으로 이동합니다.');
    navigate("/sessions");
  }

  return (
    <div className={"flex flex-col justify-between w-[440px] px-6 bg-white"}>
      <Modal
        title="지금 나가면 다시 들어올 수 없어요!"
        subtitle="정말 종료하시겠어요?"
        leftButton="취소하기"
        rightButton="종료하기"
        type="red"
        onLeftClick={() => { }}
        onRightClick={existHandler}
      />
      <div className={"flex flex-col gap-4"}>
        <div className={"flex flex-col gap-2 pt-6"}>
          <h2 className={"inline-flex gap-1 items-center text-semibold-s"}>
            <FaClipboardList />
            질문
          </h2>
          <p
            className={
              "border border-accent-gray p-2 bg-transparent rounded-xl"
            }
          >
            {question}
          </p>
        </div>
        <div className={"flex flex-col gap-2"}>
          <h2 className={"inline-flex gap-1 items-center text-semibold-s"}>
            <FaUserGroup />
            참가자
          </h2>
          <ul>
            {participants.map((participant, index) => (
              <li key={index} className={"flex items-center gap-2"}>
                <span className={"w-4 h-4 bg-accent-gray rounded-full"} />
                <span>{participant}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={"h-16 items-center flex w-full"}>
        <button
          className={"w-full bg-red-500 text-white rounded-md py-2"}
          onClick={() => { openModal() }}
        >
          종료하기
        </button>
      </div>
    </div>
  );
};

export default SessionSidebar;
