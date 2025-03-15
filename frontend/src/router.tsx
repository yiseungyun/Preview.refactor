import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRouteLayout from "./components/common/Wrapper/ProtectedRouteLayout";
import App from "./App";
import SidebarLayout from "./components/common/Wrapper/SidebarLayout";
const ErrorPage = lazy(() => import("./pages/error"));
const IntroPage = lazy(() => import("./pages/intro"));
const CreateChannelPage = lazy(() => import("./pages/channels/create"));
const ChannelListPage = lazy(() => import("./pages/channels"));
const ChannelPage = lazy(() => import("./pages/channel"));
const QuestionListPage = lazy(() => import("./pages/questions"));
const CreateQuestionPage = lazy(() => import("./pages/questions/create"));
const QuestionDetailPage = lazy(() => import("./pages/questions/detail"));
const LoginPage = lazy(() => import("./pages/login"));
const AuthCallbackPage = lazy(() => import("./pages/login/callback"));
const MyPage = lazy(() => import("./pages/mypage"));

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
                element: <ChannelListPage />
              },
              {
                path: "create",
                element: <CreateChannelPage />
              },
            ]
          },
          {
            path: "questions",
            children: [
              {
                index: true,
                element: <QuestionListPage />
              },
              {
                path: "create",
                element: (
                  <ProtectedRouteLayout>
                    <CreateQuestionPage />
                  </ProtectedRouteLayout>
                )
              },
              {
                path: ":questionId",
                element: <QuestionDetailPage />
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
                <MyPage />
              </ProtectedRouteLayout>
            )
          }
        ]
      },
      {
        path: "channel/:channelId",
        element: <Suspense fallback={null}><ChannelPage /></Suspense>
      },
    ],
  }
]);