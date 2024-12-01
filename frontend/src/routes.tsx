import App from "./App.tsx";
import CreateQuestionPage from "./pages/CreateQuestionPage.tsx";
import CreateSessionPage from "./pages/CreateSessionPage.tsx";
import QuestionDetailPage from "./pages/QuestionDetailPage/QuestionDetailPage.tsx";
import SessionListPage from "./pages/SessionListPage/SessionListPage.tsx";
import SessionPage from "./pages/SessionPage/index.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import LoginPage from "@/pages/Login/LoginPage.tsx";
import QuestionListPage from "@/pages/QuestionListPage/QuestionListPage.tsx";
import AuthCallbackPage from "@/pages/Login/AuthCallbackPage.tsx";
import MyPage from "@/pages/MyPage/index.tsx";
import ProtectedRouteLayout from "@components/layout/ProtectedRouteLayout.tsx";

export const routes = [
  {
    element: <App />,
    path: "/",
  },

  {
    element: <SessionPage />,
    path: "/session/:sessionId",
  },
  {
    element: <SessionListPage />,
    path: "/sessions",
  },
  {
    element: <QuestionListPage />,
    path: "/questions",
  },
  {
    element: <QuestionDetailPage />,
    path: "/questions/:questionId",
  },
  {
    element: <LoginPage />,
    path: "/login",
  },
  {
    element: <AuthCallbackPage />,
    path: "/login/callback",
  },
  {
    element: <MyPage />,
    path: "/mypage",
  },
  {
    element: <CreateSessionPage />,
    path: "/sessions/create",
  },
  {
    element: (
      <ProtectedRouteLayout>
        <CreateQuestionPage />
      </ProtectedRouteLayout>
    ),
    path: "/questions/create",
  },
  {
    element: <ErrorPage />,
    path: "/*",
  },
];
