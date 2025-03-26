import HostOnlyTools from "./components/HostOnlyTools";
import CommonTools from "./components/CommonTools";
import { Socket } from "socket.io-client";

interface ToolbarProps {
  socket: Socket;
  disconnect: () => void;
}

const ChannelToolbar = ({ socket, disconnect }: ToolbarProps) => {
  return (
    <div className="h-16 inline-flex w-full justify-center items-center border-t px-6 shrink-0">
      <CommonTools socket={socket} disconnect={disconnect} />
      <HostOnlyTools socket={socket} disconnect={disconnect} />
    </div>
  );
};

export default ChannelToolbar;
