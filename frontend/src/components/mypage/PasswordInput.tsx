import { IoEyeOffOutline, IoEyeOutline } from "../common/Icons";

interface PasswordInputProps {
  placeholder: string;
  password: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({
  placeholder,
  password,
  showPassword,
  setShowPassword,
  onChange,
}: PasswordInputProps) => {
  return (
    <div className="relative w-full">
      <input
        className="text-medium-m w-full h-11 p-4 pr-20 border-custom-s rounded-custom-m"
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={password}
        onChange={onChange}
        minLength={7}
        maxLength={20}
      />
      <button
        className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
      </button>
    </div>
  );
};

export default PasswordInput;
