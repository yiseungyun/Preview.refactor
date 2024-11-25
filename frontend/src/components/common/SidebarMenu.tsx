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
    ? "bg-green-100 dark:text-gray-black text-white text-semibold-m"
    : "bg-transparent dark:text-white text-gray-black text-medium-l transition-color duration-300 hover:bg-gray-200/30";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <li
      className={`${activeClass} flex items-center flex-nowrap text-nowrap px-4 p-2 w-full rounded-lg cursor-pointer`}
      aria-label={label + "(으)로 이동하는 버튼"}
    >
      <Link className={"inline-flex gap-3 items-center w-full"} to={path} onClick={handleClick}>
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default SidebarMenu;