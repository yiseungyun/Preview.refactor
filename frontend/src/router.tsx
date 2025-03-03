import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/error";
import CreateChannelPage from "./pages/channels/create";
import ChannelListPage from "./pages/channels";
import ChannelPage from "./pages/channel";
import QuestionListPage from "./pages/questions";
import ProtectedRouteLayout from "./components/layout/ProtectedRouteLayout";
import CreateQuestionPage from "./pages/questions/create";
import QuestionDetailPage from "./pages/questions/detail";
import LoginPage from "./pages/login";
import AuthCallbackPage from "./pages/login/callback";
import MyPage from "./pages/mypage";
import App from "./App";
import IntroPage from "./pages/intro";
import { Suspense } from "react";
import SidebarLayout from "./components/layout/SidebarLayout";

// TODO: 코드 분할을 통해 라우트 로딩 최적화
// TODO: 페이지 별 로딩 페이지를 스켈레톤 UI로 적용
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <SidebarLayout />,
        children: [
          { index: true, element: <IntroPage /> },
          {
            path: "channels",
            children: [
              {
                index: true,
                element:
                  <Suspense fallback={<div>Suspense로 로딩 중 표시</div>}>
                    <ChannelListPage />
                  </Suspense>
              },
              {
                path: "create",
                element:
                  <Suspense fallback={<div>Suspense로 로딩 중 표시</div>}>
                    <CreateChannelPage />
                  </Suspense>
              },
            ]
          },
          {
            path: "questions",
            children: [
              {
                index: true,
                element:
                  <Suspense fallback={<div>Suspense로 로딩 중 표시</div>}>
                    <QuestionListPage />
                  </Suspense>
              },
              {
                path: "create",
                element: (
                  <ProtectedRouteLayout>
                    <Suspense fallback={<div>Suspense로 로딩 중 표시</div>}>
                      <CreateQuestionPage />
                    </Suspense>
                  </ProtectedRouteLayout>
                )
              },
              {
                path: ":questionId",
                element:
                  <Suspense fallback={<div>Suspense로 로딩 중 표시</div>}>
                    <QuestionDetailPage />
                  </Suspense>
              }
            ]
          },
          {
            path: "login",
            children: [
              { index: true, element: <LoginPage /> },
              { path: "callback", element: <AuthCallbackPage /> }
            ]
          },
          {
            path: "mypage",
            element: (
              <ProtectedRouteLayout>
                <Suspense fallback={<div>Suspense로 로딩 중 표시</div>}>
                  <MyPage />
                </Suspense>
              </ProtectedRouteLayout>
            )
          }
        ]
      },
      {
        path: "channel/:channelId",
        element:
          <Suspense fallback={<div>Suspense로 로딩 중 표시</div>}>
            <ChannelPage />
          </Suspense>
      },
    ],
  }
]);