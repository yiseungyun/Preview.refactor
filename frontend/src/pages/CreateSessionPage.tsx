import { IoArrowBackSharp } from "react-icons/io5";
import SessionForm from "../components/sessions/create/SessionForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useSessionFormStore from "../stores/useSessionFormStore";

const CreateSessionPage = () => {
  const navigate = useNavigate();
  const { resetForm } = useSessionFormStore();

  useEffect(() => {
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-20">
      <button
        className="flex items-center gap-4 mb-5 text-gray-black text-medium-l"
        onClick={() => navigate("/sessions")}
      >
        <IoArrowBackSharp className="w-5 h-5" />
        <span>면접 채널로 돌아가기</span>
      </button>
      <h1 className="text-bold-l mb-2">새로운 스터디 세션 만들기</h1>
      <p className="text-medium-l text-gray-400 mb-8">
        면접 스터디를 위한 새로운 세션을 생성합니다.
      </p>
      <SessionForm />
    </div>
  );
};

export default CreateSessionPage;
