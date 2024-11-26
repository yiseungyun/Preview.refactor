import { useNavigate } from "react-router-dom";

const QuestionItem = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-28 p-4 border-custom-s border-gray-200 rounded-custom-m cursor-pointer"
      onClick={() => {
        navigate("/questions/1");
      }}
    >
      <p className="text-gray-black text-semibold-m">
        프론트엔드 면접 질문 리스트 프론트엔드 면접 질문 리스트
      </p>
      <span className="text-gray-600 text-medium-m">
        작성자 눈드뮴눈드뮴눈드뮴눈드뮴 • 5개의 질문
      </span>
    </div>
  );
};

export default QuestionItem;
