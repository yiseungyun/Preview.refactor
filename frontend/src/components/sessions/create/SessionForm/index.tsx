import AccessSection from "./AccessSection";
import CategorySection from "./CategorySection";
import ParticipantSection from "./ParticipantSection";
import TitleSection from "./TitleSection";
import QuestionListSection from "./QuestionListSection";
import ListSelectModal from "./ListSelectModal";
import useSessionFormStore from "@/stores/useSessionFormStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToast from "@/hooks/useToast";
import useSocket from "@/hooks/useSocket";

interface RoomCreatedResponse {
  success?: boolean;
  roomId?: string;
  error?: string;
}

const SessionForm = () => {
  const { socket } = useSocket();
  const { category, sessionName, questionId, participant, access } =
    useSessionFormStore();
  const isValid = useSessionFormStore((state) => state.isFormValid());
  const navigate = useNavigate();
  const toast = useToast();

  const submitHandler = () => {
    if (!isValid || !socket) {
      toast.error("입력값을 확인해주세요.");
      return;
    }

    const roomData = {
      title: sessionName,
      status: access ?? "PUBLIC",
      category,
      questionId,
      maxParticipants: participant,
    };

    socket?.emit("create_room", {
      title: roomData.title,
      maxParticipants: roomData.maxParticipants,
      status: roomData.status,
      category: roomData.category,
    });
  };

  useEffect(() => {
    if (!socket) return;

    const roomCreatedHandler = (response: RoomCreatedResponse) => {
      if (response.roomId) {
        navigate(`/session/${response.roomId}`);
        toast.success(`${sessionName} 세션이 성공적으로 생성되었습니다.`);
      } else {
        toast.error("방 생성에 실패하였습니다.");
        navigate(`/sessions`);
      }
    };
    socket.on("room_created", roomCreatedHandler);

    return () => {
      socket.off("room_created", roomCreatedHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, navigate]);

  return (
    <div className="flex flex-col gap-7 p-8 bg-gray-white shadow-8 w-47.5 rounded-custom-l">
      <ListSelectModal />
      <CategorySection />
      <TitleSection />
      <QuestionListSection />
      <ParticipantSection />
      <AccessSection />
      <button
        className={`w-full h-12 rounded-custom-m text-semibold-r text-gray-white
        ${isValid ? "bg-green-200" : "bg-gray-200"}
          `}
        onClick={submitHandler}
        disabled={!isValid}
      >
        세션 생성하기
      </button>
    </div>
  );
};

export default SessionForm;
