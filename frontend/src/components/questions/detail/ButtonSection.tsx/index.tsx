import Button from "@/components/common/Button/DefaultButton";
import { FaBookmark } from "@/components/common/Icons/FaBookmark";
import { FaRegBookmark } from "@/components/common/Icons/FaRegBookmark";
import { IoMdShare } from "@/components/common/Icons/IoMdShare";
import useAuth from "@hooks/useAuth.ts";

interface ButtonSectionProps {
  scrapQuestionList: () => void;
  unScrapQuestionList: () => void;
  isScrapped: boolean;
  shareQuestionList: () => void;
}

const ButtonSection = ({
  scrapQuestionList,
  unScrapQuestionList,
  isScrapped,
  shareQuestionList,
}: ButtonSectionProps) => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="flex w-full gap-4 mt-4">
      <Button
        text="공유하기"
        type="gray"
        icon={<IoMdShare />}
        onClick={shareQuestionList}
      />
      <Button
        disabled={!isLoggedIn}
        text={isScrapped ? "스크랩 취소" : "스크랩하기"}
        type={isScrapped ? "gray" : "green"}
        icon={isScrapped ? <FaBookmark /> : <FaRegBookmark />}
        onClick={isScrapped ? unScrapQuestionList : scrapQuestionList}
      />
    </div>
  );
};

export default ButtonSection;
