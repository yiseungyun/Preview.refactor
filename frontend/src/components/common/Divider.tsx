interface DividerProps {
  message?: string;
  isText?: boolean;
}

const Divider = ({ message = "또는", isText = true }: DividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      {isText && (
        <div className="relative flex justify-center tsnowmanext-sm">
          <span className="px-2 bg-white text-gray-500">{message}</span>
        </div>
      )}
    </div>
  );
};

export default Divider;
