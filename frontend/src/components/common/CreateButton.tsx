import { IconType } from "react-icons";

interface ButtonProps {
  onClick: () => void;
  text: string;
  icon?: IconType;
}

const CreateButton = ({ onClick, text, icon: Icon }: ButtonProps) => {
  return (
    <button
      className={
        "inline-flex text-nowrap justify-center items-center text-semibold-r gap-1 text-gray-white fill-current px-2 bg-green-200 hover:bg-green-200/90 rounded-custom-m box-border"
      }
      onClick={onClick}
      aria-label={`${text} 만들기`}
    >
      {text} {Icon && <Icon className={"text-xl"} />}
    </button>
  );
};
export default CreateButton;
