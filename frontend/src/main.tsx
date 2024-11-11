import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import ToastProvider from "./components/common/ToastProvider.tsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider
      toasts={[
        { id: 1, message: "토스트 메시지", type: "success" },
        { id: 2, message: "토스트 메시지", type: "error" },
      ]}
    />
    <RouterProvider router={router} />
  </StrictMode>
);
