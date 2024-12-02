import useSessionFormStore from "@/stores/useSessionFormStore";
import SelectTitle from "@/components/common/Text/SelectTitle";
import TitleInput from "@/components/common/Input/TitleInput";

const TitleSection = () => {
  const { setSessionName } = useSessionFormStore();

  return (
    <div>
      <SelectTitle title="스터디 세션" />
      <TitleInput
        placeholder="예) 프론트엔드 면접 스터디"
        onChange={(e) => setSessionName(e.target.value)}
      />
    </div>
  );
};

export default TitleSection;
