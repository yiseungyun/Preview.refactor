import { Link } from "react-router-dom";

interface ButtonProps {
  path: string;
  text: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const CreateButton = ({ path, text, icon = null }: ButtonProps) => {
  return (
    <Link
      className="inline-flex text-nowrap justify-center items-center text-semibold-r gap-1 text-gray-white fill-current px-2 bg-green-200 hover:bg-green-200/90 rounded-custom-m box-border"
      to={path}
      aria-label={`${text} 만들기`}
    >
      {text} {icon}
    </Link>
  );
};
export default CreateButton;
