import { useTabContext } from "./TabContext";
import { PanelProps } from "./type";

const TabPanel = ({
  id,
  children,
  className = ""
}: PanelProps) => {
  const { activeTab } = useTabContext();
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  )
}

export default TabPanel;