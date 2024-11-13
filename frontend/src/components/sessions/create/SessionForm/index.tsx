import AccessButton from "./AccessSection";
import CategorySection from "./CategorySection";
import ParticipantSection from "./ParticipantSection";
import NameSection from "./NameSection";
import QuestionListSection from "./QuestionListSection";
import ListSelectModal from "./ListSelectModal";
import useSessionFormStore from "../../../../stores/useSessionFormStore";
import useSocketStore from "../../../../stores/useSocketStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SessionForm = () => {
  const { socket, connect } = useSocketStore();
  const { category, sessionName, questionId, participant, access } = useSessionFormStore();
  const isValid = useSessionFormStore((state) => state.isFormValid());
  const navigate = useNavigate();

  const submitHandler = () => {
    if (!isValid) {
      return;
    }

    connect(import.meta.env.VITE_SIGNALING_SERVER_URL);
    const roomData = {
      title: sessionName,
      category,
      questionId,
      maxParticipant: participant,
      isPrivate: access === "private"
    }

    // 현재는 title 데이터만 받음
    socket?.emit("create_room", roomData.title);
  };

  useEffect(() => {
    if (!socket) return;

    const roomCreatedHandler = (response: { roomId: string }) => {
      navigate(`/room/${response.roomId}`);
    }
    socket.on("room_created", roomCreatedHandler);

    return () => {
      socket.off("room_created", roomCreatedHandler)
    }
  }, [socket, navigate]);

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-white shadow-8 w-47.5 rounded-custom-l">
      <ListSelectModal />
      <CategorySection />
      <NameSection />
      <QuestionListSection />
      <ParticipantSection />
      <AccessButton />
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
