import AccessButton from "./AccessSection";
import CategorySection from "./CategorySection";
import ParticipantSection from "./ParticipantSection";
import NameSection from "./NameSection";
import QuestionListSection from "./QuestionListSection";
import ListSelectModal from "./ListSelectModal";
import { useState } from "react";

const SessionForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-white shadow-8 w-47.5 rounded-custom-l">
      <ListSelectModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <CategorySection />
      <NameSection />
      <QuestionListSection setIsModalOpen={setIsModalOpen} />
      <ParticipantSection />
      <AccessButton />
      <button className="w-full h-12 bg-green-200 rounded-custom-m text-semibold-r text-gray-white">
        세션 생성하기
      </button>
    </div>
  );
};

export default SessionForm;
