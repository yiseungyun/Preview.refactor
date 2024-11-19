import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CreateQuestionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="m-20">
      <button
        className="flex items-center gap-4 mb-5 text-gray-black text-medium-l"
        onClick={() => navigate("/questions")}
      >
        <IoArrowBackSharp className="w-5 h-5" />
        <span>면접 리스트로 돌아가기</span>
      </button>
      <h1 className="text-bold-l mb-2">새로운 면접 질문 리스트 만들기</h1>
      <p className="text-medium-l text-gray-400 mb-8">
        면접 스터디를 위한 새로운 질문지를 생성합니다.
      </p>
    </div>
  );
};

export default CreateQuestionPage;
