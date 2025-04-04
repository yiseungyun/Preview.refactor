import SelectTitle from "@/components/Text/SelectTitle";
import AccessButton from "@/components/Button/AccessButton";
import useQuestionFormStore from "@/pages/questions/create/stores/useQuestionFormStore";

const AccessSection = () => {
  const { access, setAccess } = useQuestionFormStore();

  return (
    <div className="w-full">
      <SelectTitle title="공개 여부" />
      <AccessButton access={access} onClick={setAccess} />
    </div>
  );
};

export default AccessSection;
