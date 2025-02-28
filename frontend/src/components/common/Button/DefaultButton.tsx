import { IconType } from "react-icons";

interface ButtonProps {
  text: string;
  type: "gray" | "green";
  icon?: IconType;
  onClick: () => void;
  disabled?: boolean;
}

const DefaultButton = ({
  text,
  type,
  icon: Icon,
  onClick,
  disabled,
}: ButtonProps) => {
  const buttonColor =
    type === "gray"
      ? "bg-gray-200 text-gray-black"
      : "bg-green-200 text-gray-white";

  return (
    <button
      disabled={disabled}
      className={`w-full h-12 flex flex-row items-center justify-center gap-2 rounded-custom-m text-semibold-r ${buttonColor} hover:opacity-80 disabled:opacity-50`}
      onClick={onClick}
    >
      {Icon ? <Icon /> : null}
      {text}
    </button>
  );
};

export default DefaultButton;
