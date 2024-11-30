import { FaGithub, FaRegUserCircle } from "react-icons/fa";
import useToast from "@hooks/useToast.ts";
import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.ts";

const OAuthContainer = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { guestLogIn } = useAuth();

  const handleOAuthLogin = (provider: "github" | "guest") => {
    if (provider === "github") {
      // 깃허브 로그인
      window.location.assign(
        `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_OAUTH_GITHUB_ID}&redirect_uri=${import.meta.env.VITE_OAUTH_GITHUB_CALLBACK}`
      );
    } else if (provider === "guest") {
      // 게스트 로그인
      guestLogIn();
      toast.success("게스트로 로그인되었습니다.");
      navigate("/");
    }
  };

  return (
    <>
      <button
        onClick={() => handleOAuthLogin("github")}
        type="button"
        className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium text-lg shadow-16 flex items-center justify-center gap-3"
      >
        <FaGithub className="w-5 h-5" />
        GitHub으로 계속하기
      </button>
      <button
        onClick={() => handleOAuthLogin("guest")}
        type="button"
        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-400 transition-colors font-medium text-lg shadow-16 flex items-center justify-center gap-3"
      >
        <FaRegUserCircle className="w-5 h-5" />
        GUEST로 계속하기
      </button>
    </>
  );
};
export default OAuthContainer;
