import SelectTitle from "../../SelectTitle";

const NameSection = () => {
  return (
    <div>
      <SelectTitle title="스터디 세션" />
      <input
        className="text-medium-m w-full h-11 p-4 border-custom-s border-gray-100 rounded-custom-m"
        placeholder="예) 프론트엔드 면접 스터디"
      />
    </div>
  );
};

export default NameSection;
