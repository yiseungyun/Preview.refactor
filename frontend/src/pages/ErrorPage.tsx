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
              "text-9xl [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] absolute right-80 top-1/2  font-bold"
            }
          >
            4
          </span>
        </div>
        <button
          className={
            " bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg mt-4 absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 pointer-events-nones"
          }
          onClick={() => navigate("/sessions")}
        >
          메인 페이지로 이동하기
        </button>
      </div>
    </section>
  );
};

export default ErrorPage;
