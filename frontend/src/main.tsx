import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import ToastProvider from "./components/common/Toast/ToastProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./router.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    <ToastProvider />
    <RouterProvider router={router} />
  </QueryClientProvider>
);
