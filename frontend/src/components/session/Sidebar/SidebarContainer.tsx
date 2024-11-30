import { ReactNode, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

interface SidebarContainerProps {
  children: ReactNode;
}

const SidebarContainer = ({ children }: SidebarContainerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="relative flex h-full">
      <div
        className={`transition-all duration-300 bg-white flex gap-2 ${
          isCollapsed ? "w-0 overflow-hidden" : "w-[22rem]"
        }`}
      >
        {children}
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1 right-0 flex items-center justify-center
                   h-16 w-14
                   transition-all duration-200 text-gray-500"
        aria-label={isCollapsed ? "사이드바 열기" : "사이드바 닫기"}
      >
        <MdArrowForwardIos
          className={`${!isCollapsed ? "" : "rotate-180"} h-5 w-5`}
        />
      </button>
    </div>
  );
};

export default SidebarContainer;
