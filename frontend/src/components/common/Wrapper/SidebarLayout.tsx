import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const SidebarLayout = () => {
  return (
    <section className="flex h-screen">
      <Sidebar />
      <main className="w-full overflow-y-scroll">
        <Outlet />
      </main>
    </section>
  );
};

export default SidebarLayout;