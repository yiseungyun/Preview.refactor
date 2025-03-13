import { ReactElement } from "react";
import { Link } from "react-router-dom";
interface SidebarMenuProps {
  path?: string;
  label: string;
  icon?: ReactElement;
  isSelected?: boolean;
  onClick?: () => void;
}

const SidebarMenu = ({
  path = "",
  label,
  icon,
  isSelected = false,
  onClick,
}: SidebarMenuProps) => {
  const activeClass = isSelected
    ? "bg-green-100 text-white text-semibold-m"
    : "bg-transparent text-gray-black text-medium-l transition-color duration-300 hover:bg-gray-200/30";

  return (
    <li className={`${activeClass} cursor-pointer w-full rounded-lg`}>
      <Link
        to={path}
        onClick={onClick}
        className="w-full h-full"
        aria-label={label + "(으)로 이동하는 버튼"}
      >
        <div className="flex items-center flex-nowrap gap-3 text-nowrap px-4 p-2">
          {icon}
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarMenu;
