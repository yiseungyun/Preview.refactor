import App from "./App.tsx";
import CreateQuestionPage from "./pages/CreateQuestionPage.tsx";
import CreateSessionPage from "./pages/CreateSessionPage.tsx";
import SessionListPage from "./pages/SessionListPage.tsx";
import SessionPage from "./pages/SessionPage";
import ErrorPage from "@/pages/ErrorPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";

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
    element: <LoginPage />,
    path: "/login",
  },
  {
    element: <CreateSessionPage />,
    path: "/sessions/create",
  },
  {
    element: <CreateQuestionPage />,
    path: "/questions/create"
  },
  {
    element: <ErrorPage />,
    path: "/*",
  },
];
