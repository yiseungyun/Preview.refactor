import useSessionFormStore from "@/stores/useSessionFormStore";
import SelectTitle from "@/components/common/Text/SelectTitle";
import AccessButton from "@/components/common/Button/AccessButton";

const AccessSection = () => {
  const { access, setAccess } = useSessionFormStore();

  return (
    <div className="w-full">
      <SelectTitle title="공개 여부" />
      <AccessButton access={access} onClick={setAccess} />
    </div>
  );
};

export default AccessSection;
