import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaBookmark } from "react-icons/fa";

interface ItemProps {
  type: "my" | "saved";
}

const QuestionItem = ({ type }: ItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center w-full h-32 p-4 border-custom-s border-gray-200 rounded-custom-m cursor-pointer"
      onClick={() => {
        navigate("/questions/1");
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="relative">
          <p className="text-gray-black text-semibold-m pr-12">프론트엔드</p>
          <div className="absolute top-0 right-0 text-gray-400 flex flex-row gap-1">
            {type === "my" ? (
              <>
                <button
                  className="w-5 h-5"
                  onClick={() => navigate("/")} // TODO: 질문지 수정 페이지로 이동
                >
                  <MdEdit className="w-5 h-5 mt-1" />
                </button>
                <button className="w-5 h-5">
                  <RiDeleteBin6Fill className="w-5 h-5 mt-1" />
                </button>
              </>
            ) : (
              <button className="w-5 h-5">
                <FaBookmark className="w-5 h-5 mt-1" />
              </button>
            )}
          </div>
        </div>
        <span className="text-gray-600 text-medium-m">
          작성자 눈드뮴눈드뮴눈드뮴눈드뮴 • 5개의 질문
        </span>
      </div>
    </div>
  );
};

export default QuestionItem;
