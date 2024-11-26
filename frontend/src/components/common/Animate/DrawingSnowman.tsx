import { DotLottiePlayer } from "@dotlottie/react-player";
import mainSnowman from "/assets/noondeumyum.lottie";

const DrawingSnowman = () => {
  return (
    <div className="max-w-2xl min-w-2xl flex flex-col justify-center">
      <DotLottiePlayer
        src={mainSnowman}
        autoplay
        loop
        speed={0.7}
        style={{ height: 500 }}
      />
    </div>
  );
};

export default DrawingSnowman;
