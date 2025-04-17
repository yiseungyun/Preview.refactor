import HostOnlyTool from "./components/HostOnlyTool";
import CommonTool from "./components/CommonTool";
import { Socket } from "socket.io-client";

interface ToolbarProps {
  socket: Socket;
  disconnect: () => void;
}

const ChannelToolbar = ({ socket, disconnect }: ToolbarProps) => {
  return (
    <div className="h-16 inline-flex w-full justify-center items-center border-t px-6 shrink-0">
      <CommonTool socket={socket} disconnect={disconnect} />
      <HostOnlyTool />
    </div>
  );
};

export default ChannelToolbar;
