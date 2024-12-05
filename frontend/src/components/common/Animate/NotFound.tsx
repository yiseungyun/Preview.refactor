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
        className={"dark:invert"}
      />
      <div
        className={
          "text-medium-m text-gray-500 text-center flex flex-col gap-0.5"
        }
      >
        {message?.split("\n").map((text) => <p key={text}>{text}</p>)}
      </div>
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
