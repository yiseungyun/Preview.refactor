import Tab from "./Tab";

interface CategoryTabProps {
  currentTab: boolean;
  setCurrentTab: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabContainer = ({ currentTab, setCurrentTab }: CategoryTabProps) => {
  return (
    <section className="relative border-b   flex gap-4  ">
      <Tab
        currentTab={currentTab}
        tabStatus={false}
        setCurrentTab={setCurrentTab}
      />
      <Tab
        currentTab={currentTab}
        tabStatus={true}
        setCurrentTab={setCurrentTab}
      />
      <div
        className={`absolute -z-0 pointer-events-none top-0 ${currentTab ? "left-36" : "left-0"} transition-all duration-200 pt-4 py-2 p-1 border-b border-green-200 h-full w-32`}
      ></div>
    </section>
  );
};

export default TabContainer;
