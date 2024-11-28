import { FaClipboardList, FaFolder } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import useModalStore from "@stores/useModalStore.ts";
import Modal from "../../common/Modal";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useToast from "@hooks/useToast.ts";
import { TbCrown } from "react-icons/tb";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent.ts";
import { Question } from "@hooks/type/session";

interface ParticipantsData {
  nickname: string;
  isHost: boolean;
}

interface Props {
  socket: Socket | null;
  questionList: Question[];
  currentIndex: number;
  participants: ParticipantsData[];
  roomId: string | undefined; // TODO: sessionId가 입력되지 않았을 때(undefined) 처리 필요
  isHost: boolean;
}

const SessionSidebar = ({
  socket,
  questionList,
  currentIndex,
  participants,
  roomId,
  isHost,
}: Props) => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();
  const toast = useToast();

  const existHandler = () => {
    socket?.emit(SESSION_EMIT_EVENT.LEAVE, { roomId });
    toast.success("메인 화면으로 이동합니다.");
    navigate("/sessions");
  };

  const destroyAndExitHandler = () => {
    socket?.off(SESSION_EMIT_EVENT.FINISH);
    socket?.emit(SESSION_EMIT_EVENT.FINISH, { roomId });
    toast.success("메인 화면으로 이동합니다.");
    navigate("/sessions");
  };

  const HostModalData = {
    title: "세션을 종료할까요?",
    subtitle: "세션을 종료하면 참가자들이 모두 나가게 됩니다.",
    leftButton: "방장 양도 후 종료",
    rightButton: "세션 종료",
    type: "red",
    onLeftClick: existHandler,
    onRightClick: destroyAndExitHandler,
  };

  const ParticipantModalData = {
    title: "지금 나가면 다시 들어올 수 없어요!",
    subtitle: "정말 종료하시겠어요?",
    leftButton: "취소하기",
    rightButton: "종료하기",
    type: "red",
    onLeftClick: () => {},
    onRightClick: existHandler,
  };

  return (
    <div
      className={
        "flex flex-grow px-4 gap-2 items-stretch w-[440px]  bg-white shrink-0"
      }
    >
      <div className={"flex flex-col gap-4 flex-grow justify-between "}>
        <div className={"flex flex-col gap-4  "}>
          <div className={"flex flex-col gap-2 pt-6"}>
            <h2 className={"inline-flex gap-1 items-center text-semibold-m"}>
              <FaClipboardList />
              현재 질문
            </h2>
            <div
              className={
                "border border-accent-gray p-2 bg-transparent rounded-xl "
              }
            >
              {currentIndex >= 0 ? (
                <p>
                  <span className={"text-bold-s"}>
                    Q{questionList[currentIndex].index + 1}.{" "}
                  </span>
                  {questionList[currentIndex].content}
                </p>
              ) : (
                <p>질문 로딩 중...</p>
              )}
            </div>
          </div>
          <div className={"flex flex-col gap-2 mt-4"}>
            <h2 className={"inline-flex gap-1 items-center text-semibold-m"}>
              <FaUserGroup />
              참가자
            </h2>
            <ul>
              {participants.map((participant, index) => (
                <li key={index} className={"flex items-center gap-2"}>
                  <span className={"w-4 h-4 bg-point-2 rounded-full"} />
                  <span>{participant.nickname}</span>
                  <span className={"text-yellow-400"}>
                    {participant.isHost && <TbCrown />}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={"flex flex-col gap-2 mt-4"}>
            <h2 className={"inline-flex gap-1 items-center text-semibold-m"}>
              <FaFolder />
              이전 질문
            </h2>
            <ul>
              {currentIndex <= 0 && (
                <li className={"text-medium-s"}>
                  여기에 이전 질문이 기록됩니다.
                </li>
              )}
              {questionList.map((question, index) => {
                if (index < currentIndex)
                  return (
                    <li key={question.id}>
                      Q{index + 1}. {question.content}
                    </li>
                  );
              })}
            </ul>
          </div>
        </div>
        <div className={"h-16 items-center flex w-full"}>
          <button
            className={"w-full bg-red-500 text-white rounded-md py-2"}
            onClick={() => {
              openModal();
            }}
          >
            종료하기
          </button>
        </div>
      </div>

      <Modal
        title={isHost ? HostModalData.title : ParticipantModalData.title}
        subtitle={
          isHost ? HostModalData.subtitle : ParticipantModalData.subtitle
        }
        leftButton={
          isHost ? HostModalData.leftButton : ParticipantModalData.leftButton
        }
        rightButton={
          isHost ? HostModalData.rightButton : ParticipantModalData.rightButton
        }
        type={"red"}
        onLeftClick={
          isHost ? HostModalData.onLeftClick : ParticipantModalData.onLeftClick
        }
        onRightClick={
          isHost
            ? HostModalData.onRightClick
            : ParticipantModalData.onRightClick
        }
      />
    </div>
  );
};

export default SessionSidebar;
