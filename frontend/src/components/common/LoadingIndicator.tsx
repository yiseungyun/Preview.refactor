import { DotLottiePlayer } from "@dotlottie/react-player";

interface LoadingIndicator {
  loadingState: boolean;
  text?: string;
}

const LoadingIndicator = ({ loadingState, text }: LoadingIndicator) => {
  return (
    loadingState && (
      <div className={"w-full flex flex-col items-center "}>
        <DotLottiePlayer
          src={"/assets/loadingIndicator.lottie"}
          autoplay={true}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
        {text && (
          <p className={"animate-pulse text-xl text-gray-400"}>{text}</p>
        )}
      </div>
    )
  );
};

export default LoadingIndicator;
