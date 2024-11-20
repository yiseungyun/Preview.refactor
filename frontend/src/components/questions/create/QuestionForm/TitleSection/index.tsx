import SelectTitle from "@/components/common/SelectTitle";
import TitleInput from "@/components/common/TitleInput";
import useQuestionFormStore from "@/stores/useQuestionFormStore";

const TitleSection = () => {
  const { setQuestionTitle } = useQuestionFormStore();

  return (
    <div>
      <SelectTitle title="질문지 제목" />
      <TitleInput
        placeholder="예) 프론트엔드 면접 질문 리스트"
        onChange={setQuestionTitle}
      />
    </div>
  );
};

export default TitleSection;
