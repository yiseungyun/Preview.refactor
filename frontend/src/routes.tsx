import App from "./App.tsx";
import CreateSessionPage from "./pages/CreateSessionPage.tsx";
import SessionListPage from "./pages/SessionListPage.tsx";
import SessionPage from "./pages/SessionPage";

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
    element: <>로그인 페이지</>,
    path: "/login",
  },
  {
    element: <CreateSessionPage />,
    path: "/sessions/create",
  },
  {
    element: <>에러 페이지</>,
    path: "/*",
  },
];
