import SelectTitle from "@/components/common/Text/SelectTitle";
import TitleInput from "@/components/common/Input/TitleInput";
import useQuestionFormStore from "@/pages/questions/create/stores/useQuestionFormStore";

const TitleSection = () => {
  const { setQuestionTitle } = useQuestionFormStore();
  const handleTitleChange = (e: React.ChangeEvent<any>) => {
    setQuestionTitle(e.target.value);
  };

  return (
    <div>
      <SelectTitle title="질문지 제목" />
      <TitleInput
        placeholder="예) 프론트엔드 면접 질문 리스트"
        onChange={handleTitleChange}
      />
    </div>
  );
};

export default TitleSection;
