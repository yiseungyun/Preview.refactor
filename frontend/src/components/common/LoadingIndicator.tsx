import { DotLottiePlayer } from "@dotlottie/react-player";

interface LoadingIndicator {
  loadingState: boolean;
}

const LoadingIndicator = ({ loadingState }: LoadingIndicator) => {
  return (
    loadingState && (
      <div className={"w-full flex justify-center"}>
        <DotLottiePlayer
          src={"@src/../public/assets/loadingIndicator.lottie"}
          autoplay={true}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    )
  );
};

export default LoadingIndicator;
