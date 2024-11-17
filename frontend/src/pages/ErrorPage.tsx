import Lottie from "react-lottie";
import snowmanAnimate from "../../public/assets/snowman.json";

const ErrorPage = () => {
  return (
    <section className={"w-full text-center py-20"}>
      <div className={""}>
        <h1 className={"text-5xl pt-20 font-bold"}>404 Error</h1>
        <p className={"font-light text-xl"}>
          이런! 요청하신 데이터를 찾을 수 없었어요!
        </p>
        <div
          className={"w-1/2 mx-auto aspect-video scale-150"}
          aria-label={"눈사람"}
        >
          <Lottie
            options={{
              animationData: snowmanAnimate,
              loop: true,
              autoplay: true,
            }}
            ariaRole={undefined}
            isClickToPauseDisabled={true}
          />
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
