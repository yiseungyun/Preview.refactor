import { sectionWithSidebar } from "@/constants/LayoutConstant.ts";
import Sidebar from "@components/common/Sidebar.tsx";

interface SidebarPageLayoutProps {
  children: React.ReactNode;
}

const SidebarPageLayout = ({ children }: SidebarPageLayoutProps) => {
  return (
    <section className={sectionWithSidebar}>
      <Sidebar />
      {children}
    </section>
  );
};

export default SidebarPageLayout;
