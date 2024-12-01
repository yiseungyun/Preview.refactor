interface ToolTipProps {
  children: React.ReactNode;
  text: string;
}

const ToolTip = ({ children, text }: ToolTipProps) => {
  return (
    <div className="relative group inline-flex">
      {children}
      <div
        className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 opacity-0 group-hover:opacity-100
                    transition-opacity duration-200 ease-in-out
                    whitespace-nowrap z-50 bg-gray-50 rounded-custom-s border-custom-s border-gray-100`}
      >
        <span className="text-medium-r text-gray-600 text-center">{text}</span>
      </div>
    </div>
  );
};

export default ToolTip;
