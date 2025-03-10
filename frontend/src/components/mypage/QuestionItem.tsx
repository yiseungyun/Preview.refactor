import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaBookmark } from "react-icons/fa";
import { useDeleteQuesitonList } from "@hooks/api/useDeleteQuestionList";
import Modal from "@components/common/Modal";
import useModal from "@/hooks/useModal";
import { useGetQuestionContent } from "@/hooks/api/useGetQuestionContent";

interface ItemProps {
  questionListId: number;
  type: "my" | "saved";
  page: number;
}

const ITEM_PER_PAGE = 6;

const QuestionItem = ({ questionListId, type, page }: ItemProps) => {
  const navigate = useNavigate();
  const modal = useModal();
  const deleteQuestions = useDeleteQuesitonList({ page, limit: ITEM_PER_PAGE });
  const { data } = useGetQuestionContent(questionListId);

  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    modal.openModal();
  };

  const deleteHandler = () => {
    deleteQuestions(questionListId);
  };

  return (
    <>
      <Modal
        modal={modal}
        title="해당 질문지를 삭제하실건까요?"
        subtitle="삭제하면 복구할 수 없어요!"
        leftButton="취소하기"
        rightButton="삭제하기"
        type="red"
        onLeftClick={() => { }}
        onRightClick={deleteHandler}
      />
      <div
        className="relative h-40 bg-white rounded-custom-m px-5 py-6 transition-all duration-200 ease-in-out hover:-translate-y-1.5 border-custom-s border-gray-200 hover:shadow-16 hover:ring-1 hover:ring-green-200"
        onClick={() => {
          navigate(`/questions/${questionListId}`);
        }}
      >
        <div className="relative flex flex-col w-full gap-1">
          <div className="flex flex-row gap-1 mb-2">
            <span className="text-semibold-s text-green-600 bg-green-50 border-custom-s border-gray-300 rounded-2xl py-px px-2">
              {data?.categoryNames[0]}
            </span>
          </div>
          <p className="text-gray-black text-semibold-m">{data?.title}</p>
          <div className="absolute top-0 right-0 text-gray-400 flex flex-row gap-1">
            {type === "my" ? (
              <>
                <button
                  className="w-5 h-5"
                  onClick={() => navigate("/")} // TODO: 질문지 수정 페이지로 이동
                >
                  <MdEdit className="w-5 h-5" />
                </button>
                <button className="w-5 h-5" onClick={openDeleteModal}>
                  <RiDeleteBin6Fill className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button className="w-5 h-5">
                <FaBookmark className="w-5 h-5 mt-1" />
              </button>
            )}
          </div>
        </div>
        <span className="absolute bottom-4 text-gray-600 text-medium-m">
          작성자 {data?.username}
        </span>
      </div>
    </>
  );
};

export default QuestionItem;
