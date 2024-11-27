import { DotLottiePlayer } from "@dotlottie/react-player";

interface LoadingIndicator {
  loadingState: boolean;
  type?: "threeDots" | "spinner";
  text?: string;
}

const LoadingIndicator = ({
  type = "threeDots",
  loadingState,
  text,
}: LoadingIndicator) => {
  const render = () => {
    switch (type) {
      case "threeDots":
        return (
          <DotLottiePlayer
            src={"/assets/loadingIndicator.lottie"}
            autoplay={true}
            loop={true}
            style={{ width: 200, height: 200 }}
          />
        );
      case "spinner":
        return (
          <DotLottiePlayer
            src={"/assets/spinner.lottie"}
            autoplay={true}
            loop={true}
            speed={1.5}
            style={{ width: 120, height: 120 }}
          />
        );
    }
  };
  return (
    loadingState && (
      <div className={"w-full flex flex-col items-center "}>
        {render()}
        {text && (
          <p className={"animate-pulse text-xl text-gray-400"}>{text}</p>
        )}
      </div>
    )
  );
};

export default LoadingIndicator;
