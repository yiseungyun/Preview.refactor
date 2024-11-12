import { FaClipboardList } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

interface Props {
  question: string;
  participants: string[];
}

const SessionSidebar = ({ question, participants }: Props) => {
  return (
    <div className={"flex flex-col justify-between w-[440px] px-6"}>
      <div className={"flex flex-col gap-4"}>
        <div className={"flex flex-col gap-2"}>
          <h2 className={"inline-flex gap-1 items-center text-semibold-s"}>
            <FaClipboardList />
            질문
          </h2>
          <p
            className={
              "border border-accent-gray p-2 bg-transparent rounded-xl"
            }
          >
            {question}
          </p>
        </div>
        <div className={"flex flex-col gap-2"}>
          <h2 className={"inline-flex gap-1 items-center text-semibold-s"}>
            <FaUserGroup />
            참가자
          </h2>
          <ul>
            {participants.map((participant, index) => (
              <li key={index} className={"flex items-center gap-2"}>
                <span className={"w-4 h-4 bg-accent-gray rounded-full"} />
                <span>{participant}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={"h-16 items-center flex w-full"}>
        <button className={"w-full bg-red-500 text-white rounded-md py-2"}>
          종료하기
        </button>
      </div>
    </div>
  );
};

export default SessionSidebar;
