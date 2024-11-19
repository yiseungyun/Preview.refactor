import useSessionFormStore from "@/stores/useSessionFormStore";
import SelectTitle from "../../../../common/SelectTitle";

const NameSection = () => {
  const { setSessionName } = useSessionFormStore();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(event.target.value);
  };

  return (
    <div>
      <SelectTitle title="스터디 세션" />
      <input
        className="text-medium-m w-full h-11 p-4 border-custom-s border-gray-100 rounded-custom-m"
        placeholder="예) 프론트엔드 면접 스터디"
        onChange={changeHandler}
        minLength={5}
        maxLength={20}
      />
    </div>
  );
};

export default NameSection;
