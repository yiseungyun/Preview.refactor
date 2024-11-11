import { useState } from "react";
import ParticipantButton from "../ParticpantButton";
import AccessButton from "./AccessSection/AccessSection";
import SelectTitle from "../SelectTitle";
import CategorySection from "./CategorySection/CategorySection";
import ParticipantSection from "./ParticipantSection/ParticipantSection";
import NameSection from "./NameSection/NameSection";
import QuestionListSection from "./QuestionListSection/QuestListSection";

const SessionForm = () => {
  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-white shadow-8 w-47.5 rounded-custom-l">
      <CategorySection />
      <NameSection />
      <QuestionListSection />
      <ParticipantSection />
      <AccessButton />
      <button className="w-full h-12 bg-green-200 rounded-custom-m text-semibold-m text-gray-white">
        세션 생성하기
      </button>
    </div>
  );
};

export default SessionForm;
