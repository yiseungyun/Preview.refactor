import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import ToastProvider from "./components/common/ToastProvider.tsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <>
    <ToastProvider />
    <RouterProvider router={router} />
  </>
);
