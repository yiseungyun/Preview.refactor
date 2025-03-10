import DefaultAuthFormContainer from "@/pages/login/DefaultAuthFormContainer";
import Divider from "@components/common/Divider.tsx";
import OAuthContainer from "@/pages/login/OAuthContainer";

interface LoginFormProps {
  signUp: boolean;
  isSignUp: (value: ((prevState: boolean) => boolean) | boolean) => void;
}
const LoginForm = ({ signUp, isSignUp }: LoginFormProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <form className="space-y-4">
        <DefaultAuthFormContainer isSignUp={signUp} setIsSignUp={isSignUp} />
        <Divider />
        <OAuthContainer />
      </form>
    </div>
  );
};

export default LoginForm;
