import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa6";
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
  const navigate = useNavigate();

  useEffect(() => {
    setSelected("/" + window.location.pathname.split("/")[1]);
  }, [window.location.pathname]);

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
    <nav className="min-w-sidebar w-sidebar h-screen flex flex-col border-r-custom-s justify-between overflow-y-hidden bg-white transition-colors">
      <div>
        <header className="py-7">
          <img className="w-full px-9" src="/preview-logo2.png" alt="Preview 로고" />
        </header>
        <hr className="mx-3" />
        <ul
          className="flex flex-col gap-2 items-center mx-2 pb-4 p-2"
          aria-label="사이드바 링크 리스트"
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
      <div className="pb-4 px-6 inline-flex justify-between">
        <a
          className="text-medium-m text-black hover:text-gray-500"
          href="https://github.com/boostcampwm-2024/web27-Preview"
          aria-label="리포지토리 링크"
          target="_blank"
        >
          <span className="inline-flex items-center gap-1">
            <FaGithub /> BOOSKIT
          </span>
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;
