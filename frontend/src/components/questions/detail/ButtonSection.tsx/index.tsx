import Button from "@components/common/Button";
import { FaBookmark } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";

const ButtonSection = () => {
  return (
    <div className="flex w-full gap-4 mt-4">
      <Button text="공유하기" type="gray" icon={IoMdShare} onClick={() => {}} />
      <Button
        text="스크랩하기"
        type="green"
        icon={FaBookmark}
        onClick={() => {}}
      />
    </div>
  );
};

export default ButtonSection;
