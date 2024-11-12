import { IoIosClose } from "react-icons/io";
import ProgressBar from "./ProgressBar.tsx";

interface ToastProps {
  message: string;
  type: "success" | "error";
  removeToast: () => void;
}

const Toast = ({ message, type, removeToast }: ToastProps) => {
  return (
    <div
      className={`relative flex items-center text-medium-s ${type === "error" ? "bg-red-400" : "bg-green-100"} overflow-hidden text-white w-80 h-16 shadow-xl  p-2 z-50`}
    >
      <div className={"flex"}>
        <p className={"flex-grow"}>{message}</p>
        <button
          onClick={removeToast}
          className={"text-2xl absolute right-1 top-1"}
        >
          <IoIosClose />
        </button>
      </div>
      <ProgressBar duration={5000} />
    </div>
  );
};

export default Toast;
