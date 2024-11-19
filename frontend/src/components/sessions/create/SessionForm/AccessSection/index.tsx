import useSessionFormStore from "@/stores/useSessionFormStore";
import SelectTitle from "@/components/common/SelectTitle";

const AccessSection = () => {
  const { access, setAccess } = useSessionFormStore();

  return (
    <div className="w-full">
      <SelectTitle title="공개 여부" />
      <div className="flex w-full h-11">
        <button
          className={`flex-grow rounded-l-custom-m border 
          ${
            access === "PUBLIC"
              ? "text-semibold-r text-green-700 border-2 border-green-200 bg-green-50"
              : "text-medium-m text-gray-400 border-r-0"
          }`}
          onClick={() => setAccess("PUBLIC")}
        >
          공개
        </button>
        <button
          className={`flex-grow rounded-r-custom-m border
          ${
            access === "PRIVATE"
              ? "text-semibold-r text-green-700 border-2 border-green-200 bg-green-50"
              : "text-medium-m text-gray-400 border-l-0"
          }`}
          onClick={() => setAccess("PRIVATE")}
        >
          비공개
        </button>
      </div>
    </div>
  );
};

export default AccessSection;
