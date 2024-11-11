import SelectTitle from "../../SelectTitle";

const NameSection = () => {
  return (
    <div>
      <SelectTitle title="스터디 세션" />
      <input
        className="text-medium-l"
        placeholder="예) 프론트엔드 면접 스터디"
      />
    </div>
  );
};

export default NameSection;
