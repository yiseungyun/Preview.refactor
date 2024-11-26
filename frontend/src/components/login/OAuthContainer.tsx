import { FaGithub, FaRegUserCircle } from "react-icons/fa";

interface OAuthContainerProps {
  handleOAuthLogin: (provider: "github" | "guest") => void;
}

const OAuthContainer = ({ handleOAuthLogin }: OAuthContainerProps) => {
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
