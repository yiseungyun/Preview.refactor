interface AccessProps {
  access: string;
  onClick: (access: "PUBLIC" | "PRIVATE") => void;
}

const AccessButton = ({ access, onClick }: AccessProps) => {
  return (
    <div className="flex w-full h-11">
      <button
        className={`flex-grow rounded-l-custom-m border 
          ${
            access === "PUBLIC"
              ? "text-semibold-r text-green-700 border-2 border-green-200 bg-green-50"
              : "text-medium-m text-gray-400 border-r-0"
          }`}
        onClick={() => onClick("PUBLIC")}
      >
        공개
      </button>
      <button
        className={`flex-grow rounded-r-custom-m border
          ${
            access === "PRIVATE"
              ? "text-semibold-r text-green-700 border-2 border-green-200 bg-green-50"
              : "text-medium-m text-gray-400 border-l-0"
          }`}
        onClick={() => onClick("PRIVATE")}
      >
        비공개
      </button>
    </div>
  );
};

export default AccessButton;
