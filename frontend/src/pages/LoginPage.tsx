import { FaGithub, FaGoogle } from "react-icons/fa";
import { DotLottiePlayer } from "@dotlottie/react-player";

import mainSnowman from "../../public/assets/noondeumyum.lottie";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
      {/* 전체 컨테이너 */}
      <div className="w-full max-w-7xl mx-auto px-8">
        {/* 전체 콘텐츠를 감싸는 프레임 */}
        <div className="h-[640px] bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          {/* 내부 콘텐츠 그리드 */}
          <div className="flex h-full">
            {/* 왼쪽 콘텐츠 영역 - 7칸 차지 */}
            <div className="hidden lg:flex flex-grow flex-col justify-center col-span-7 p-16 bg-gradient-to-br from-emerald-600 to-emerald-700">
              <div className="max-w-2xl min-w-2xl flex flex-col justify-center">
                <DotLottiePlayer
                  src={mainSnowman}
                  autoplay
                  loop
                  speed={0.7}
                  style={{ height: 500 }}
                />
              </div>
            </div>

            {/* 오른쪽 로그인 폼 - 5칸 차지 */}
            <div className="col-span-5 p-16 bg-gray-50 w-full lg:w-5/12">
              <h1 className="text-7xl font-pretendard font-bold black mb-8 tracking-tight text-center">
                Preview
              </h1>
              <div className="w-full max-w-md mx-auto">
                <form className="space-y-4">
                  <div>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="이메일을 입력하세요"
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      id="password"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="비밀번호를 입력하세요"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-500 transition-colors font-medium text-lg shadow-lg"
                  >
                    로그인
                  </button>

                  <div className="flex items-center justify-between text-base text-gray-600">
                    <button
                      type="button"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      회원가입
                    </button>
                    <button
                      type="button"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      비밀번호 찾기
                    </button>
                  </div>
                  {/* 구분선 */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-50 text-gray-500">
                        또는
                      </span>
                    </div>
                  </div>
                  {/* OAuth 로그인 버튼 */}
                  <button
                    type="button"
                    className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium text-lg shadow-lg flex items-center justify-center gap-3"
                  >
                    <FaGithub className="w-5 h-5" />
                    GitHub으로 계속하기
                  </button>
                  <button
                    type="button"
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-400 transition-colors font-medium text-lg shadow-lg flex items-center justify-center gap-3"
                  >
                    <FaGoogle className="w-5 h-5" />
                    Google으로 그만하기
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
