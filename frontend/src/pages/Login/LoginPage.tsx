import useAuth from "@hooks/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import DrawingSnowman from "@components/common/Animate/DrawingSnowman.tsx";
import { useEffect, useState } from "react";
import LoginTitle from "@/pages/Login/view/LoginTitle.tsx";
import LoginForm from "@/pages/Login/view/LoginForm.tsx";
import { IoArrowBackSharp } from "react-icons/io5";

const LoginPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
      <Link
        to={"/"}
        className="absolute top-20 left-20 flex items-center gap-4 mb-5 text-gray-black text-medium-l"
      >
        <IoArrowBackSharp className="w-5 h-5" />
        <span>서비스 소개</span>
      </Link>
      <div className="w-full max-w-7xl mx-auto px-8">
        <div className="h-[640px] bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-24 overflow-hidden">
          <div className="flex h-full">
            <div className="hidden lg:flex flex-grow flex-col justify-center col-span-7 p-16 bg-gradient-to-br from-emerald-600 to-emerald-700">
              <DrawingSnowman />
            </div>
            <div className="relative col-span-5 p-16 bg-gray-white w-full lg:w-5/12">
              <LoginTitle isSignUp={isSignUp} />
              <LoginForm signUp={isSignUp} isSignUp={setIsSignUp} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
