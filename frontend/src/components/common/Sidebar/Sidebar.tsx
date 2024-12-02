import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import useTheme from "@hooks/useTheme.ts";
import useAuth from "@/hooks/useAuth";
import {
  authenticatedRoutes,
  Route,
  unauthenticatedRoutes,
} from "./routesConfig";
import SidebarMenu from "./SidebarMenu";

const Sidebar = () => {
  const { isLoggedIn, logOut } = useAuth();
  const [selected, setSelected] = useState<string>("");
  const [currentRoutes, setCurrentRoutes] = useState<Route[]>([]);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setSelected(window.location.pathname);
  }, []);

  const logoutHandler = () => {
    logOut();
    navigate("/");
  };

  useEffect(() => {
    setCurrentRoutes(
      isLoggedIn ? authenticatedRoutes(logoutHandler) : unauthenticatedRoutes
    );
  }, [isLoggedIn]);

  return (
    <nav
      className={
        "min-w-17.5 w-17.5 h-screen flex flex-col border-r-custom-s gap-1.5 justify-between overflow-y-hidden bg-white transition-colors dark:bg-gray-black dark:border-r-gray-400"
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
        <hr className={"mx-4 dark:border-gray-400"} />
        <ul
          className={"flex flex-col gap-2 items-center mx-2 my-2 p-2"}
          aria-label={"사이드바 링크 리스트"}
        >
          {currentRoutes.map((route) => {
            return (
              <SidebarMenu
                key={route.label}
                path={route.path}
                label={route.label}
                icon={route.icon}
                isSelected={selected === route.path}
                onClick={
                  route.path
                    ? () =>
                        navigate(route.path!, {
                          state: { from: route.path ?? "/" },
                        })
                    : route.onClick
                }
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

export default Sidebar;
