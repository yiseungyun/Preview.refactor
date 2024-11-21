import { IconType } from "react-icons";

interface ButtonProps {
  text: string;
  type: "gray" | "green";
  icon: IconType;
}

const Button = ({ text, type, icon: Icon }: ButtonProps) => {
  const buttonColor =
    type === "gray"
      ? "bg-gray-200 text-gray-black"
      : "bg-green-200 text-gray-white";

  return (
    <button
      className={`w-full h-11 flex flex-row items-center justify-center gap-2 rounded-custom-m text-semibold-m ${buttonColor}`}
    >
      <Icon />
      {text}
    </button>
  );
};

export default Button;
