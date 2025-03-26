import React from "react";
import { convertToRem } from "./convertToRem.ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const MdArrowBackIosNew = ({ size = 4, className = "", ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={convertToRem(size)}
      height={convertToRem(size)}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      {...props}
    >
<path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"></path>
    </svg>
  );
};
