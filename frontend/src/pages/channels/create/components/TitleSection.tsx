import useSessionFormStore from "@/pages/channels/create/stores/useSessionFormStore";
import SelectTitle from "@/components/Text/SelectTitle";
import TitleInput from "@/components/Input/TitleInput";

const TitleSection = () => {
  const { setSessionName } = useSessionFormStore();

  return (
    <div>
      <SelectTitle title="스터디 채널 이름" />
      <TitleInput
        placeholder="예) 프론트엔드 면접 스터디"
        onChange={(e) => setSessionName(e.target.value)}
      />
    </div>
  );
};

export default TitleSection;
