import { useTabContext } from "./TabContext";
import { ItemProps } from "./type";

const TabItem = ({ id, children }: ItemProps) => {
  const { activeTab, setActiveTab } = useTabContext();
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      data-tab-id={id}
      aria-selected={isActive}
      className={`flex flex-row gap-1 
        ${isActive
          ? "text-bold-s text-green-500"
          : "text-medium-l text-gray-400"
        }`}
      onClick={() => setActiveTab(id)}
    >
      <span className="px-1 pb-1">
        {children}
      </span>
    </button>
  )
}

export default TabItem;