import { useState } from "react";
import SelectTitle from "../../SelectTitle";

const AccessSection = () => {
  const [access, setAccess] = useState("public");

  return (
    <div className="w-full">
      <SelectTitle title="공개 여부" />
      <div className="flex w-full h-11">
        <button
          className={`flex-grow rounded-l-custom-m border 
          ${
            access === "public"
              ? "text-semibold-r text-green-700 border-2 border-green-200 bg-green-50"
              : "text-medium-m text-gray-400 border-r-0"
          }`}
          onClick={() => setAccess("public")}
        >
          공개
        </button>
        <button
          className={`flex-grow rounded-r-custom-m border
          ${
            access === "private"
              ? "text-semibold-r text-green-700 border-2 border-green-200 bg-green-50"
              : "text-medium-m text-gray-400 border-l-0"
          }`}
          onClick={() => setAccess("private")}
        >
          비공개
        </button>
      </div>
    </div>
  );
};

export default AccessSection;
