import { DotLottiePlayer } from "@dotlottie/react-player";
import NotFoundAnimation from "/assets/notfound.lottie";

interface NotFoundProps {
  message?: string;
  className?: string;
}
const NotFound = ({ message, className }: NotFoundProps) => {
  return (
    <div className={className + "flex flex-col items-center"}>
      <DotLottiePlayer
        src={NotFoundAnimation}
        autoplay={true}
        loop={true}
        style={{ width: 200 }}
      />
      <p className={"text-medium-m font-light"}>{message}</p>
    </div>
  );
};

export default NotFound;
