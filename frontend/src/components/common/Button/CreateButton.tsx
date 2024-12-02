import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface ButtonProps {
  path: string;
  text: string;
  onClick?: () => void;
  icon?: IconType;
}

const CreateButton = ({ path, text, icon: Icon }: ButtonProps) => {
  return (
    <Link
      className={
        "inline-flex text-nowrap justify-center items-center text-semibold-r gap-1 text-gray-white fill-current px-2 bg-green-200 hover:bg-green-200/90 rounded-custom-m box-border"
      }
      to={path}
      aria-label={`${text} 만들기`}
    >
      {text} {Icon && <Icon className={"text-xl"} />}
    </Link>
  );
};
export default CreateButton;
