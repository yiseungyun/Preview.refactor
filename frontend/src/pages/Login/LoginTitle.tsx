interface LoginTitleProps {
  isSignUp: boolean;
}

const LoginTitle = ({ isSignUp }: LoginTitleProps) => {
  return (
    !isSignUp && (
      <h1 className="text-6xl font-raleway font-bold black mb-11 tracking-tight text-center transition-all duration-300 overflow-hidden">
        Preview
      </h1>
    )
  );
};

export default LoginTitle;
