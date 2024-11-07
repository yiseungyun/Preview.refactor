import { FaUserGroup } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
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
      className={
        "relative flex rounded-2xl overflow-hidden border border-accent-gray py-3 max-w-3xl"
      }
    >
      <div
        className={`${sessionStatus === "open" ? "bg-accent-gray" : "bg-primary-active"} w-6 h-full absolute left-0 top-0`}
        aria-label={"상태표시등"}
      />
      <div className={"flex-grow px-4 ml-6 flex flex-col gap-1 items-start"}>
        <span
          className={
            "text-medium-xs border border-primary-dark rounded-2xl py-px px-2"
          }
        >
          {category}
        </span>
        <h3 className={"text-semibold-r text-xl"}>{title}</h3>
        <p className={"text-medium-r text-grayscale-400"}>
          질문지인데 누르면 질문 리스트를 볼 수 있임 {questionListId}
        </p>
        <div className={"inline-flex items-center justify-between w-full"}>
          <div className={"text-medium-s inline-flex items-center gap-1"}>
            <span>{host} • </span>
            <span className={"inline-flex items-center gap-1"}>
              <FaUserGroup />{" "}
              <span className={"inline-flex items-center"}>참여자</span>
              {participant}/{maxParticipant}명
            </span>
          </div>
          <button
            className={
              "text-semibold-s text-primary-dark hover:text-primary-dark-hover bg-transparent inline-flex items-center gap-1 hover:gap-0.5 transition-all"
            }
            onClick={onEnter}
          >
            <span>참여하기</span> <FaArrowRight />
          </button>
        </div>
      </div>
    </li>
  );
};

export default SessionCard;
