import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaBookmark } from "react-icons/fa";
import Category from "./Category";

interface ItemProps {
  type: "my" | "saved";
}

const QuestionItem = ({ type }: ItemProps) => {
  const navigate = useNavigate();

  const deleteHandler = () => {};

  return (
    <div
      className="flex items-center w-full h-32 p-4 border-custom-s border-gray-200 rounded-custom-m cursor-pointer"
      onClick={() => {
        navigate("/questions/1");
      }}
    >
      <div className="relative flex flex-col w-full gap-1">
        <div className="relative">
          <div className="flex flex-row gap-1 mb-2">
            <Category text="네트워크" />
            <Category text="운영체제" />
          </div>
          <div className="px-1">
            <p className="text-gray-black text-semibold-m">
              프론트엔드프론트엔드프론트엔드프론트엔드
            </p>
            <div className="absolute top-0 right-0 text-gray-400 flex flex-row gap-1">
              {type === "my" ? (
                <>
                  <button
                    className="w-5 h-5"
                    onClick={() => navigate("/")} // TODO: 질문지 수정 페이지로 이동
                  >
                    <MdEdit className="w-5 h-5 mt-1" />
                  </button>
                  <button className="w-5 h-5" onClick={deleteHandler}>
                    <RiDeleteBin6Fill className="w-5 h-5 mt-1" />
                  </button>
                </>
              ) : (
                <button className="w-5 h-5">
                  <FaBookmark className="w-5 h-5 mt-1" />
                </button>
              )}
            </div>
            <span className="text-gray-600 text-medium-m">
              작성자 눈드뮴눈드뮴눈드뮴눈드뮴눈드뮴눈드뮴눈드
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
