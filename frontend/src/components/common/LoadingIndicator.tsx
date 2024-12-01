import { DotLottiePlayer } from "@dotlottie/react-player";

interface LoadingIndicator {
  loadingState: boolean;
  type?: "threeDots" | "spinner";
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

const LoadingIndicator = ({
  type = "threeDots",
  loadingState,
  text,
  className,
  style,
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
            style={style ?? { width: 120, height: 120, opacity: 0.8 }}
          />
        );
    }
  };
  return (
    loadingState && (
      <div className={`w-full flex flex-col items-center ${className}`}>
        {render()}
        {text && (
          <p className={"animate-pulse text-xl text-gray-400"}>{text}</p>
        )}
      </div>
    )
  );
};

export default LoadingIndicator;
