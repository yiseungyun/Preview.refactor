import SelectTitle from "../../SelectTitle";
import { MdOutlineArrowForwardIos } from "react-icons/md";
const QuestionListSection = () => {
  return (
    <div>
      <SelectTitle title="질문 리스트" />
      <button className="flex justify-between items-center p-4 text-medium-m w-full h-11 border-custom-s border-gray-100 text-gray-400 rounded-custom-m">
        <span>질문 리스트를 선택해주세요</span>
        <MdOutlineArrowForwardIos className="text-gray-400" />
      </button>
    </div>
  );
};

export default QuestionListSection;
