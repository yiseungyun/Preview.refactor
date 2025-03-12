import { MdArrowForwardIos } from "@/components/common/Icons/MdArrowForwardIos";
import { ReactNode, useState } from "react";

interface SidebarContainerProps {
  children: ReactNode;
}

const SidebarContainer = ({ children }: SidebarContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex h-full">
      <div className={`transition-all duration-300 bg-white flex gap-2 ${isOpen ? "w-[22rem]" : "w-0 overflow-hidden"}`}>
        {children}
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

export default SidebarContainer;
