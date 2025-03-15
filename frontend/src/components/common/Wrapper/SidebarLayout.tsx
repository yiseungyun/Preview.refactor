import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import { Suspense } from "react";

const SidebarLayout = () => {
  return (
    <section className="flex h-screen">
      <Sidebar />
      <Suspense fallback={null}>
        <main className="w-full overflow-y-scroll">
          <Outlet />
        </main>
      </Suspense>
    </section>
  );
};

export default SidebarLayout;