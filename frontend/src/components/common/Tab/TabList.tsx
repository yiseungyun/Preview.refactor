import { useEffect, useRef, useState } from "react";
import { useTabContext } from "./TabContext"
import { ListProps } from "./type";

const TabList = ({ children }: ListProps) => {
  const { activeTab } = useTabContext();
  const listRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!listRef.current) return;

    const tabRefs = Array.from(listRef.current.children)
      .filter(child => child.getAttribute("role") === "tab");

    const activeTabElement = tabRefs.find(
      tab => tab.getAttribute("data-tab-id") === activeTab
    ) as HTMLElement;

    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth
      });
    }
  }, [activeTab]);

  return (
    <div className="relative flex gap-6 my-4 ml-2 pb-2" ref={listRef} >
      {children}
      <div
        className="absolute -z-0 pointer-events-none top-0 transition-all duration-200 pt-4 py-2 p-1 border-b-2 border-green-300 h-full"
        style={{
          left: `${indicatorStyle.left - 4}px`,
          width: `${indicatorStyle.width + 8}px`
        }
        }
      />
    </div >
  )
}

export default TabList; 