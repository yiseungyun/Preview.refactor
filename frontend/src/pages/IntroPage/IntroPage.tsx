import SidebarPageLayout from "@components/layout/SidebarPageLayout";
import { FaArrowRight } from "react-icons/fa6";
import questionList from "/introduce/questionList.png";
import createSession from "/introduce/createSession.png";
import inSession from "/introduce/inSession.png";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <SidebarPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="relative h-screen flex items-center">
          <img
            src="/"
            alt="면접 준비"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            <p className="text-green-100 mb-4">면접 스터디 가이드</p>
            <h1 className="font-raleway text-7xl font-bold text-white mb-6 tracking-tight">
              더 나은 면접을 위한 준비가
              <br />
              지금 시작됩니다
            </h1>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-12 mt-8 px-6 py-3 text-white  duration-1000 animate-pulse ease-in-out rounded-custom-m hover:bg-green-200 transition-colors">
            스크롤로 자세히 보기
          </div>
        </div>

        <div className="py-32 px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[200px] font-bold text-gray-800">01</div>
              <h2 className="text-4xl font-bold text-white mb-6">
                나만의 맞춤형
                <br />
                질문 리스트 만들기
              </h2>
              <p className="text-gray-200 mb-6">
                막연한 면접 준비는 이제 그만! <br />
                면접관이 자주 묻는 핵심 질문들을 모아 나만의 리스트를
                만들어보세요.
              </p>
              <button
                onClick={() => navigate("/questions/create")}
                className="flex items-center text-green-100 hover:text-green-200 transition-colors"
              >
                <span className="mr-2">질문 리스트 만들기</span>
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div>
              <img
                src={questionList}
                alt="질문 리스트 만들기"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="py-32 px-8 bg-gray-900/50">
          <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={createSession}
                alt="스터디 세션 만들기"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <div className="text-[200px] font-bold text-gray-800">02</div>
              <h2 className="text-4xl font-bold text-white mb-6">
                함께할 스터디원과
                <br />
                스터디 채널 개설하기
              </h2>
              <p className="text-gray-200 mb-6">
                준비한 질문들로 스터디 채널을 만들고 함께 성장할 동료를
                찾아보세요. 공개 스터디로 다양한 인사이트를 얻거나, 비공개
                스터디로 친구들과 함께 연습할 수 있습니다.
              </p>
              <button
                onClick={() => navigate("/sessions/create")}
                className="flex items-center text-green-100 hover:text-green-200 transition-colors"
              >
                <span className="mr-2">스터디룸 만들기</span>
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="py-32 px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[200px] font-bold text-gray-800">03</div>
              <h2 className="text-4xl font-bold text-white mb-6">
                실전 같은 환경에서
                <br />
                면접 연습하기
              </h2>
              <p className="text-gray-200 mb-6">
                실시간 화상 면접으로 실제 면접의 긴장감을 경험해보세요. 면접관과
                지원자 역할을 번갈아가며 연습하고, 서로의 피드백으로 더 나은
                답변을 준비할 수 있습니다.
              </p>
              <button
                onClick={() => navigate("/sessions")}
                className="flex items-center text-green-100 hover:text-green-200 transition-colors"
              >
                <span className="mr-2">면접 연습 시작하기</span>
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div>
              <img
                src={inSession}
                alt="면접 연습하기"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="py-32 px-8 bg-gray-900/50 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            지금 바로 시작하세요
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-green-100 text-white rounded-custom-m hover:bg-green-200 transition-colors font-medium text-lg"
          >
            스터디 시작하기
          </button>
        </div>
      </div>
    </SidebarPageLayout>
  );
};

export default IntroPage;
