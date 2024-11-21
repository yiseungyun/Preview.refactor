interface QuestionItemProps {
  index: number;
  content: string;
}

const QuestionItem = ({ index, content }: QuestionItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-custom-s border-gray-200 rounded-custom-m p-3">
      <h3 className="text-semibold-m text-gray-black">Q{index + 1}</h3>
      <p className="text-medium-l">{content}</p>
    </div>
  );
};

export default QuestionItem;
