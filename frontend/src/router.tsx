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

// TODO: 코드 분할을 통해 라우트 로딩 최적화
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <IntroPage /> },
      {
        path: "channels",
        children: [
          { index: true, element: <ChannelListPage /> },
          { path: "create", element: <CreateChannelPage /> },
        ]
      },
      {
        path: "channel/:channelId",
        element: <ChannelPage />
      },
      {
        path: "questions",
        children: [
          { index: true, element: <QuestionListPage /> },
          {
            path: "create",
            element: (
              <ProtectedRouteLayout>
                <CreateQuestionPage />
              </ProtectedRouteLayout>
            )
          },
          { path: ":questionId", element: <QuestionDetailPage /> }
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
  }
]);