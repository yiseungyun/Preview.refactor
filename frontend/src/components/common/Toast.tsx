import { IoIosClose } from "react-icons/io";

interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Toast = ({ message, type }: ToastProps) => {
  return (
    <div
      className={`relative flex items-center text-medium-s ${type === "error" ? "bg-red-400" : "bg-green-100"} overflow-hidden rounded-md text-white w-80 h-16 shadow-xl  p-2 z-50`}
    >
      <div className={"flex"}>
        <p className={"flex-grow"}>{message}</p>
        <button className={"text-2xl absolute right-1 top-1"}>
          <IoIosClose />
        </button>
      </div>
      <div className={"absolute left-0 bottom-0 h-1 z-50  progressBar w-full"}>
        <div
          className={"w-1/2 bg-gray-50 h-full"}
          aria-label={"프로그레스바 진행"}
        ></div>
      </div>
    </div>
  );
};

export default Toast;
