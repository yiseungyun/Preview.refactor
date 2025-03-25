import { AxiosError } from "axios";
import { IoMdWarning } from "../Icons";
interface ErrorBlockProps {
  error: Error | AxiosError | null;
  message?: string;
}

const ErrorBlock = ({ error, message }: ErrorBlockProps) => {
  return (
    error && (
      <div className="error-block inline-flex items-center rounded-md border border-gray-200 p-2 gap-2">
        <IoMdWarning className="text-yellow-500 text-xl" />
        <h3 className="text-medium-r">
          {message ? message : "예상하지 못한 오류가 발생했어요."}
        </h3>
      </div>
    )
  );
};

export default ErrorBlock;
