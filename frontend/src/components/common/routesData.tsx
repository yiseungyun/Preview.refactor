import { MdLogout, MdLogin } from "react-icons/md";
import { FaClipboardList, FaLayerGroup } from "react-icons/fa";
import { IoPersonSharp, IoHomeSharp } from "react-icons/io5";
import { ReactElement } from "react";

export interface Route {
  path?: string;
  label: string;
  icon?: ReactElement;
  onClick?: () => void;
}

const commonRoutes = [
  {
    path: "/",
    label: "홈",
    icon: <IoHomeSharp />,
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
];

export const authenticatedRoutes = (logoutHandler: () => void): Route[] => [
  ...commonRoutes,
  {
    path: "/mypage",
    label: "마이페이지",
    icon: <IoPersonSharp />,
  },
  {
    label: "로그아웃",
    icon: <MdLogout />,
    onClick: logoutHandler,
  },
];

export const unauthenticatedRoutes: Route[] = [
  ...commonRoutes,
  {
    path: "/login",
    label: "로그인",
    icon: <MdLogin />,
  },
];
