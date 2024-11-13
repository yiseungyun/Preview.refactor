import AccessButton from "./AccessSection";
import CategorySection from "./CategorySection";
import ParticipantSection from "./ParticipantSection";
import NameSection from "./NameSection";
import QuestionListSection from "./QuestionListSection";
import ListSelectModal from "./ListSelectModal";
import useSessionFormStore from "../../../../stores/useSessionFormStore";

const SessionForm = () => {
  const isValid = useSessionFormStore((state) => state.isFormValid());

  const submitHandler = () => {
    if (!isValid) {
      return;
    }
    // 폼 제출
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-white shadow-8 w-47.5 rounded-custom-l">
      <ListSelectModal />
      <CategorySection />
      <NameSection />
      <QuestionListSection />
      <ParticipantSection />
      <AccessButton />
      <button
        className={`w-full h-12 rounded-custom-m text-semibold-r text-gray-white
        ${isValid ? "bg-green-200" : "bg-gray-200"}
          `}
        onClick={submitHandler}
        disabled={!isValid}
      >
        세션 생성하기
      </button>
    </div>
  );
};

export default SessionForm;
