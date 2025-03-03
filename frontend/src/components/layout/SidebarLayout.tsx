import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

const SidebarLayout = () => {
  return (
    <section className="flex w-screen h-screen">
      <Sidebar />
      <main className="overflow-y-scroll w-full">
        <Outlet />
      </main>
    </section>
  );
};

export default SidebarLayout;