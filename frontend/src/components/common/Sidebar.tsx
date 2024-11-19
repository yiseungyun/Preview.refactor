import { Link } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import { FaClipboardList, FaHome, FaLayerGroup } from "react-icons/fa";
import { MdDarkMode, MdLightMode, MdLogout } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import useTheme from "@hooks/useTheme.ts";
const Sidebar = () => {
  const routes = [
    {
      path: "/",
      label: "홈",
      icon: <FaHome />,
    },
    {
      path: "/questions",
      label: "질문지 리스트",
      icon: <FaClipboardList />,
    },
    {
      path: "/sessions",
      label: "스터디 세션 목록",
      icon: <FaLayerGroup />,
    },
    {
      path: "/login",
      label: "마이페이지",
      icon: <FaRegCircleUser />,
    },
    {
      path: "/logout",
      label: "로그아웃",
      icon: <MdLogout />,
    },
  ];

  const [selected, setSelected] = useState<string>("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSelected(window.location.pathname);
  }, []);
  return (
    <nav
      className={
        "min-w-80 w-80 h-screen flex flex-col border-r gap-1.5 justify-between overflow-y-hidden bg-white transition-colors dark:bg-gray-black dark:border-r-gray-400"
      }
    >
      <div>
        <header
          className={
            "text-green-400 text-5xl text-center py-7 font-bold hover:tracking-widest transition-all duration-700 font-raleway dark:text-green-100"
          }
        >
          Preview
        </header>
        <hr className={"mx-6 dark:border-gray-400"} />
        <ul
          className={"flex flex-col gap-1.5 items-center mx-4 p-2"}
          aria-label={"사이드바 링크 리스트"}
        >
          {routes.map((route) => {
            return (
              <SidebarMenu
                key={route.path}
                path={route.path}
                label={route.label}
                icon={route.icon}
                isSelected={selected === route.path}
              />
            );
          })}
        </ul>
      </div>
      <div className={"pb-4 px-6 inline-flex items-center justify-between"}>
        <a
          className={
            "text-medium-m dark:text-white text-black hover:text-gray-500"
          }
          href={"https://github.com/boostcampwm-2024/web27-Preview"}
          aria-label={"리포지토리 링크"}
          target={"_blank"}
        >
          <span className={"inline-flex items-center gap-1"}>
            <FaGithub /> BOOSKIT
          </span>
        </a>
        <button
          onClick={toggleTheme}
          className={
            "text-xl dark:bg-gray-100 dark:text-gray-black border border-gray-200 rounded-full p-2 dark:border-gray-200 hover:bg-gray-200/80 dark:hover:bg-gray-200/80  transition-colors"
          }
          aria-roledescription={"라이트모드와 다크모드 간 전환 버튼"}
          aria-label={"테마 변경버튼"}
        >
          {theme === "light" ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </div>
    </nav>
  );
};

interface SidebarMenuProps {
  path: string;
  label: string;
  icon?: ReactElement;
  isSelected?: boolean;
}

const SidebarMenu = ({
  path,
  label,
  icon,
  isSelected = false,
}: SidebarMenuProps) => {
  const activeClass = isSelected
    ? "bg-green-100 dark:text-black text-white"
    : "bg-transparent dark:text-white text-black transition-color duration-300 hover:bg-gray-200/30";

  return (
    <li
      className={`${activeClass} flex-nowrap text-nowrap text-bold-r px-4 p-2 w-full rounded-lg cursor-pointer`}
      aria-label={label + "(으)로 이동하는 버튼"}
    >
      <Link className={"inline-flex gap-2 items-center w-full"} to={path}>
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
