import useSessionFormStore from "@/pages/channels/create/stores/useSessionFormStore";
import SelectTitle from "@/components/Text/SelectTitle";
import { MdOutlineArrowForwardIos } from "@/components/Icons";

interface ListSectionProps {
  openModal: () => void;
}

const QuestionListSection = ({ openModal }: ListSectionProps) => {
  const questionTitle = useSessionFormStore((state) => state.questionTitle);

  return (
    <div>
      <SelectTitle title="질문 리스트" />
      <button
        className="flex justify-between items-center p-4 text-medium-m w-full h-11 border-custom-s border-gray-100 text-gray-400 rounded-custom-m"
        onClick={openModal}
      >
        {questionTitle.length === 0 ? (
          <span>질문 리스트를 선택해주세요</span>
        ) : (
          <span className="text-gray-black">{questionTitle}</span>
        )}
        <MdOutlineArrowForwardIos className="text-gray-400" />
      </button>
    </div>
  );
};

export default QuestionListSection;
