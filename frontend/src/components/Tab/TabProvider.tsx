import { useState } from "react";
import { TabContext } from "./TabContext";
import { ProviderProps } from "./type";

const TabProvider = ({
  children,
  defaultTab,
  className = ""
}: ProviderProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const contextValue = {
    activeTab,
    setActiveTab
  };

  return (
    <TabContext.Provider value={contextValue}>
      <div className={className}>
        {children}
      </div>
    </TabContext.Provider>
  )
}

export default TabProvider;