import Lottie from "react-lottie";
import snowmanAnimate from "../../public/assets/snowman.json";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <section
      className={
        "w-full text-center py-20 h-screen flex items-center justify-center"
      }
    >
      <div className={"relative "}>
        <div
          className={
            "flex text-green-100 w-[1024px] relative -mt-32 mx-auto aspect-video -z-10"
          }
          aria-label={"눈사람"}
        >
          <span
            className={
              "text-9xl [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] absolute left-80 top-1/2  font-bold"
            }
          >
            4
          </span>
          <Lottie
            options={{
              animationData: snowmanAnimate,
              loop: true,
              autoplay: true,
            }}
            ariaRole={undefined}
            isClickToPauseDisabled={true}
          />
          <span
            className={
              "text-9xl [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] absolute right-80 top-1/2 font-bold"
            }
          >
            4
          </span>
        </div>
        <div
          className={
            "absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 pointer-events-nones"
          }
        >
          <p className={"font-light text-xl"}>
            이런! 요청하신 데이터를 찾을 수 없어요!
          </p>
          <button
            className={
              "text-semibold-l text-green-500 hover:text-green-600 p-2 rounded-lg mt-4"
            }
            onClick={() => navigate("/sessions")}
          >
            메인 페이지로 이동하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
