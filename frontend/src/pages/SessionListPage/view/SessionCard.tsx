import { FaUserGroup } from "react-icons/fa6";
import { IoArrowForwardSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { Session } from "@/pages/SessionListPage/types/session";

interface SessionCardProps extends Omit<Session, "host" | "createdAt"> {
  onEnter: () => void;
  host: string;
}

const SessionCard = ({
  category = ["기타"],
  id,
  title,
  host,
  participants,
  maxParticipants,
  inProgress,
  questionListTitle,
  onEnter,
}: SessionCardProps) => {
  return (
    <li
      className={`relative flex rounded-custom-l border-l-[1.625rem] ${inProgress ? "border-l-point-2" : "border-l-green-200"} bg-gray-white shadow-8 overflow-hidden py-3 min-w-96 max-w-[47.5rem] h-[8.75rem] transition-all hover:shadow-lg`}
    >
      <div className={"flex-grow px-[0.75rem] flex flex-col items-start"}>
        <span
          className={
            "text-medium-xs border-[0.0875rem] border-green-600 rounded-2xl py-px px-2"
          }
        >
          {category[0]}
        </span>
        <Link className={""} onClick={onEnter} to={`/session/${id}`}>
          <h3 className={"text-semibold-m mt-[0.5rem]"}>{title}</h3>
        </Link>
        <p className={"text-medium-r text-gray-400 dark:text-gray-300"}>
          {questionListTitle ?? "함께 면접 스터디에 참여해보세요!"}
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
              {participants}/{maxParticipants}명
            </span>
          </div>
          {!inProgress && (
            <Link to={`/session/${id}`}>
              <button
                className={
                  "text-semibold-r text-green-500 inline-flex items-center gap-[0.5rem] hover:gap-[0.375rem] transition-all"
                }
                onClick={onEnter}
              >
                <span>참여하기</span>{" "}
                <IoArrowForwardSharp className="w-[1.25rem] h-[1.25rem] text-green-500" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </li>
  );
};

export default SessionCard;
