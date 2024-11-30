import useToast from "@hooks/useToast.ts";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import useValidate from "@/pages/Login/hooks/useValidate.ts";

interface DefaultAuthFormContainerProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
}

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
  } = useValidate({ setIsSignUp });

  const handleDefaultLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
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
          type="email"
          id="email"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="이메일을 입력하세요"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="비밀번호를 입력하세요"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {isSignUp && (
        <>
          <div>
            <input
              type="password"
              id="passwordCheck"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="비밀번호를 한번 더 입력하세요"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              id="nickname"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </>
      )}

      <button
        onClick={(e) => handleDefaultLogin(e)}
        className="w-full bg-green-200 dark:bg-emerald-600 text-white py-3 rounded-md hover:bg-green-100 transition-colors font-medium text-lg shadow-16"
      >
        {!isSignUp ? "로그인" : "회원가입"}
      </button>

      <div className="flex items-center justify-between text-base">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          type="button"
          className="hover:text-green-300 transition-colors"
        >
          {loading ? (
            <LoadingIndicator loadingState={loading} type={"spinner"} />
          ) : isSignUp ? (
            "로그인"
          ) : (
            "회원가입"
          )}
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
