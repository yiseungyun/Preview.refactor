import { FaUserGroup } from "react-icons/fa6";
import { IoArrowForwardSharp } from "react-icons/io5";
interface Props {
  category: string;
  title: string;
  host: string;
  participant: number;
  maxParticipant: number;
  sessionStatus: "open" | "close";
  questionListId: number;
  onEnter: () => void;
}

const SessionCard = ({
  category,
  title,
  host,
  participant,
  maxParticipant,
  sessionStatus,
  questionListId,
  onEnter,
}: Props) => {
  return (
    <li
      className={`relative flex rounded-custom-l border-l-[1.625rem] ${sessionStatus === "open" ? "border-l-point-2" : "border-l-green-200"} bg-gray-white shadow-8 overflow-hidden py-3 max-w-[47.5rem] h-[8.75rem]`}
    >
      <div className={"flex-grow px-[0.75rem] flex flex-col items-start"}>
        <span
          className={
            "text-medium-xs border-[0.0875rem] border-green-600 rounded-2xl py-px px-2"
          }
        >
          {category}
        </span>
        <h3 className={"text-semibold-m mt-[0.5rem]"}>{title}</h3>
        <p className={"text-medium-r text-gray-400"}>
          질문지인데 누르면 질문 리스트를 볼 수 있음 {questionListId}
        </p>
        <div
          className={
            "absolute bottom-[0.75rem] left-0 px-[0.75rem] inline-flex items-center justify-between w-full"
          }
        >
          <div className={"text-medium-s inline-flex items-center gap-1"}>
            <span>{host} • </span>
            <span className={"inline-flex items-center gap-1"}>
              <FaUserGroup className="text-green-400" />{" "}
              <span className={"inline-flex items-center"}>참여자</span>
              {participant}/{maxParticipant}명
            </span>
          </div>
          {sessionStatus === "open" ? (
            <button
              className={
                "text-semibold-r text-green-500 inline-flex items-center gap-[0.5rem] hover:gap-[0.375rem] transition-all"
              }
              onClick={onEnter}
            >
              <span>참여하기</span>{" "}
              <IoArrowForwardSharp className="w-[1.25rem] h-[1.25rem] text-green-500" />
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
};

export default SessionCard;
