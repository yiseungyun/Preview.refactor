import SidebarPageLayout from "@components/layout/SidebarPageLayout";
import questionList from "/introduce/questionList.png";
import createSession from "/introduce/createSession.png";
import inSession from "/introduce/inSession.png";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "lodash";
import IntroCard from "@/pages/IntroPage/view/IntroCard.tsx";
import useObserver from "@/pages/IntroPage/hooks/useObserver.ts";

const IntroPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const cards = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const { observer } = useObserver();
  const contentRef = useRef<HTMLDivElement>(null);

  const throttledHandleScroll = useCallback(
    throttle(() => {
      if (!contentRef.current) return;
      const scrollTop = (contentRef.current.parentNode as HTMLDivElement)
        .scrollTop;
      if (scrollTop && scrollTop > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, 16),
    []
  );

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.parentNode?.addEventListener(
        "scroll",
        throttledHandleScroll
      );
    }
  }, []);

  useEffect(() => {
    if (observer.current) {
      cards.forEach((card) => {
        if (card.current) {
          observer.current!.observe(card.current);
        }
      });
    }
  }, []);

  return (
    <SidebarPageLayout>
      <div
        ref={contentRef}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 scroll-smooth"
      >
        <div className="relative h-screen flex items-center">
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            <p className="text-green-100 mb-4">면접 스터디 가이드</p>
            <h1 className="font-raleway text-6xl xl:text-7xl font-bold text-white mb-6 tracking-tight">
              더 나은 면접을 위한 준비가
              <br />
              지금 시작됩니다
            </h1>
          </div>
          {!isScrolled && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-12 mt-8 px-6 py-3 text-white  duration-1000 animate-pulse ease-in-out rounded-custom-m transition-colors ">
              스크롤로 자세히 보기
            </div>
          )}
        </div>

        <div className="py-32 px-8 opacity-0" ref={cards[0]}>
          <IntroCard
            index={"01"}
            title={
              <>
                나만의 맞춤형
                <br />
                질문 리스트 만들기
              </>
            }
            description={
              <>
                막연한 면접 준비는 이제 그만! <br />
                면접관이 자주 묻는 핵심 질문들을 모아 나만의 리스트를
                만들어보세요.
              </>
            }
            image={questionList}
            buttonText={"질문 리스트 만들기"}
            onClick={() => navigate("/questions/create")}
            imagePosition={"right"}
          />
        </div>

        <div className="py-32 px-8 bg-gray-900/50 opacity-0" ref={cards[1]}>
          <IntroCard
            index={"02"}
            title={
              <>
                함께할 스터디원과
                <br />
                스터디 채널 개설하기
              </>
            }
            description={
              <>
                준비한 질문들로 스터디 채널을 만들고 함께 성장할 동료를
                찾아보세요. 공개 스터디로 다양한 인사이트를 얻거나, 비공개
                스터디로 친구들과 함께 연습할 수 있습니다.
              </>
            }
            image={createSession}
            buttonText={"스터디 세션 만들기"}
            onClick={() => navigate("/sessions/create")}
            imagePosition={"left"}
          />
        </div>

        <div className="py-32 px-8 opacity-0" ref={cards[2]}>
          <IntroCard
            index={"03"}
            title={
              <>
                실전 같은 환경에서
                <br />
                면접 연습하기
              </>
            }
            description={
              <>
                실시간 화상 면접으로 실제 면접의 긴장감을 경험해보세요. 면접관과
                지원자 역할을 번갈아가며 연습하고, 서로의 피드백으로 더 나은
                답변을 준비할 수 있습니다.
              </>
            }
            image={inSession}
            buttonText={"면접 연습하기"}
            onClick={() => navigate("/sessions")}
            imagePosition={"right"}
          />
        </div>

        <div className="py-32 px-8 bg-gray-900/50 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            지금 바로 시작하세요
          </h2>
          <button
            onClick={() => navigate("/sessions")}
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
