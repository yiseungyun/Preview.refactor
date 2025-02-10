import HostOnlyTools from "@/components/session/HostOnlyTools";
import CommonTools from "@/components/session/CommonTools";

const SessionToolbar = () => {
  return (
    <div className="session-footer h-16 inline-flex w-full justify-center items-center border-t px-6 shrink-0">
      <CommonTools />
      <HostOnlyTools />
    </div>
  );
};

export default SessionToolbar;
