import useToast from "@hooks/useToast.ts";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import useValidate from "@/pages/Login/hooks/useValidate.ts";
import { BiHide } from "react-icons/bi";
import { useState } from "react";
import { MdOutlineVisibility } from "react-icons/md";

interface DefaultAuthFormContainerProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
}

const INPUT_CLASSNAME =
  "w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

const DefaultAuthFormContainer = ({
  isSignUp,
  setIsSignUp,
}: DefaultAuthFormContainerProps) => {
  const toast = useToast();
  const {
    handleSignUp,
    handleLogin,
    loading,
    setNickname,
    setUsername,
    setPassword,
    setPasswordCheck,
    errors,
    emptyErrors,
  } = useValidate({ setIsSignUp });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleDefaultLogin = (e: React.MouseEvent) => {
    try {
      e.preventDefault();

      if (isSignUp) handleSignUp();
      else handleLogin();
    } catch (err) {
      console.error("로그인 도중 에러", err);
    }
  };

  return (
    <>
      <div>
        <input
          type="id"
          id="id"
          className={INPUT_CLASSNAME}
          placeholder="아이디를 입력하세요"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className={"relative"}>
        <input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          className={INPUT_CLASSNAME}
          placeholder="비밀번호를 입력하세요"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className={
            "cursor-pointer absolute top-1/2 right-4 -translate-y-1/2 opacity-80"
          }
          aria-label={"비밀번호 보기"}
          title={"비밀번호 보기 / 숨기기"}
        >
          {isPasswordVisible ? <MdOutlineVisibility /> : <BiHide />}
        </div>
      </div>

      {isSignUp && (
        <>
          <div>
            <input
              type={"password"}
              id="passwordCheck"
              className={INPUT_CLASSNAME}
              placeholder="비밀번호를 한번 더 입력하세요"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              id="nickname"
              className={INPUT_CLASSNAME}
              placeholder="닉네임을 입력하세요"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </>
      )}

      {errors && errors.length > 0 && (
        <span className={"text-red-500 text-medium-xs"}>{errors.at(0)}</span>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          handleDefaultLogin(e);
        }}
        className="w-full bg-green-200 dark:bg-emerald-600 text-white py-3 rounded-md hover:bg-green-100 transition-colors font-medium text-lg shadow-16"
      >
        <LoadingIndicator
          loadingState={loading}
          type={"spinner"}
          style={{ width: 28, height: 28 }}
        />
        {!loading && (!isSignUp ? "로그인" : "회원가입")}
      </button>

      <div className="flex items-center justify-between text-base">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            emptyErrors();
          }}
          type="button"
          className="inline-flex items-center justify-center hover:text-green-300 transition-colors"
        >
          {isSignUp ? "로그인" : "회원가입"}
        </button>
        <button
          onClick={() => toast.error("비밀번호 찾기는 아직 지원하지 않습니다.")}
          type="button"
          className="hover:text-green-300 transition-colors"
        >
          비밀번호 찾기
        </button>
      </div>
    </>
  );
};

export default DefaultAuthFormContainer;
