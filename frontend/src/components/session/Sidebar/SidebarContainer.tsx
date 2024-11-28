import { ReactNode, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface SidebarContainerProps {
  children: ReactNode;
}

const SidebarContainer = ({ children }: SidebarContainerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="relative flex h-full">
      <div
        className={`transition-all duration-300 bg-white flex gap-2 ${
          isCollapsed ? "w-0 overflow-hidden" : "w-[440px]"
        }`}
      >
        {children}
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center justify-center
                   h-24 w-12 bg-green-200 hover:bg-green-100 rounded-l-md
                   transition-all duration-200 text-white"
        aria-label={isCollapsed ? "사이드바 열기" : "사이드바 닫기"}
      >
        <FaArrowLeft className={!isCollapsed ? "rotate-180" : ""} />
      </button>
    </div>
  );
};

export default SidebarContainer;
