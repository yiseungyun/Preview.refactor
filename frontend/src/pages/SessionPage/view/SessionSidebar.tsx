import { FaClipboardList, FaFolder } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { TbCrown } from "react-icons/tb";
import { useSessionStore } from "../stores/useSessionStore";

const SessionSidebar = () => {
  const roomMetadata = useSessionStore(state => state.roomMetadata);
  const participants = useSessionStore(state => state.participants);

  return (
    <div className="flex flex-grow px-4 gap-2 items-stretch w-[22rem] bg-white shrink-0">
      <div className="flex flex-col gap-4 flex-grow justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 pt-6">
            <h2 className="inline-flex gap-1 items-center text-semibold-m">
              <FaClipboardList />현재 질문
            </h2>
            <div className="border border-accent-gray p-2 bg-transparent rounded-xl">
              {roomMetadata.currentIndex >= 0 ? (
                <p>
                  <span className="text-bold-s">
                    Q{roomMetadata.questionListContents[roomMetadata.currentIndex].index + 1}.{" "}
                  </span>
                  {roomMetadata.questionListContents[roomMetadata.currentIndex].content}
                </p>
              ) : (
                <p>질문 로딩 중</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <h2 className="inline-flex gap-1 items-center text-semibold-m">
              <FaUserGroup />
              참가자
            </h2>
            <ul>
              {participants.map((participant, index) => (
                <li key={index} className={"flex items-center gap-2"}>
                  <span className={"w-4 h-4 bg-point-2 rounded-full"} />
                  <span>{participant.nickname}</span>
                  <span className={"text-yellow-400"}>
                    {participant.isHost && <TbCrown />}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <h2 className="inline-flex gap-1 items-center text-semibold-m">
              <FaFolder />이전 질문
            </h2>
            <ul>
              {roomMetadata.currentIndex <= 0 && (
                <li className="text-medium-s">이전 질문이 기록됩니다.</li>
              )}
              {roomMetadata.questionListContents.map((question, index) => {
                if (index < roomMetadata.currentIndex)
                  return (
                    <li key={question.id}>
                      Q{index + 1}. {question.content}
                    </li>
                  );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSidebar;
