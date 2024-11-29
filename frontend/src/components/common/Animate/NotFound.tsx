import { DotLottiePlayer } from "@dotlottie/react-player";
import NotFoundAnimation from "/assets/notfound.lottie";
import { Link } from "react-router-dom";

interface NotFoundProps {
  message?: string;
  className?: string;
  redirect?: {
    path: string;
    buttonText?: string;
  };
}
const NotFound = ({ message, className, redirect }: NotFoundProps) => {
  return (
    <div className={className + "flex flex-col items-center"}>
      <DotLottiePlayer
        src={NotFoundAnimation}
        autoplay={true}
        loop={true}
        style={{ width: 200 }}
      />
      <p className={"text-medium-m font-light"}>{message}</p>
      {redirect && (
        <Link
          className={
            "bg-green-100 hover:bg-green-100/80 text-white text-semibold-r rounded-xl px-4 py-1 mt-2"
          }
          to={redirect.path}
        >
          {redirect.buttonText}
        </Link>
      )}
    </div>
  );
};

export default NotFound;
