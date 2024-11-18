import { Link } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import { FaClipboardList, FaHome, FaLayerGroup } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";

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

  useEffect(() => {
    setSelected(window.location.pathname);
  }, []);
  return (
    <nav
      className={
        "min-w-80 w-80 h-screen flex flex-col border-r gap-1.5 justify-between overflow-y-hidden"
      }
    >
      <div>
        <header
          className={"text-green-400 text-5xl text-center py-7 font-bold"}
        >
          Preview
        </header>
        <hr className={"mx-6"} />
        <ul className={"flex flex-col gap-1.5 items-center mx-4 p-2"}>
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
      <a
        className={"pb-4 px-6 text-medium-m hover:text-gray-500"}
        href={"https://github.com/boostcampwm-2024/web27-Preview"}
        aria-label={"리포지토리 링크"}
        target={"_blank"}
      >
        <span>BOOSKIT</span>
      </a>
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
    ? "bg-green-100 text-white"
    : "bg-transparent ";

  return (
    <li
      className={`${activeClass} flex-nowrap text-nowrap text-bold-r px-4 p-2 w-full rounded-lg`}
    >
      <Link
        className={"inline-flex gap-2 items-center"}
        to={path}
        aria-label={label + "(으)로 이동하는 버튼"}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
