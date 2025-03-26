import { FaUserGroup, MdArrowForwardIos, TbCrown } from "@/components/Icons";
import { useState } from "react";
import { useSessionStore } from "./stores/useSessionStore";

const ChannelSidebar = () => {
  const participants = useSessionStore(state => state.participants);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex h-full">
      <div className={`transition-all duration-300 bg-white flex gap-2 ${isOpen ? "w-[22rem]" : "w-0 overflow-hidden"}`}>
        <div className="flex flex-grow px-4 gap-2 items-stretch w-[22rem] bg-white shrink-0">
          <div className="flex flex-col gap-4 flex-grow justify-between">
            <div className="flex flex-col gap-3 mt-8">
              <h2 className="inline-flex gap-1 items-center text-semibold-m">
                <FaUserGroup />참가자
              </h2>
              <ul>
                {participants.map((participant, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-point-2 rounded-full" />
                    <span>{participant.nickname}</span>
                    <span className="text-yellow-400">
                      {participant.isHost && <TbCrown />}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1 right-0 flex items-center justify-center h-16 w-14 transition-all duration-200 text-gray-500"
        aria-label={isOpen ? "사이드바 닫기" : "사이드바 열기"}
      >
        <MdArrowForwardIos size={5} className={isOpen ? "" : "rotate-180"} />
      </button>
    </div>
  );
};

export default ChannelSidebar;
