import Tab from "./Tab";

interface CategoryTabProps {
  currentTab: 0 | 1;
  setCurrentTab: React.Dispatch<React.SetStateAction<0 | 1>>;
}

const TabContainer = ({ currentTab, setCurrentTab }: CategoryTabProps) => {
  return (
    <section className="flex items-center gap-2">
      <Tab
        currentTab={currentTab}
        tabStatus={0}
        setCurrentTab={setCurrentTab}
      />
      <Tab
        currentTab={currentTab}
        tabStatus={1}
        setCurrentTab={setCurrentTab}
      />
    </section>
  );
};

export default TabContainer;
