import React from "react";
import { convertToRem } from "./convertToRem.ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const MdLink = ({ size = 4, className = "", ...props }: IconProps) => {
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
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
    </svg>
  );
};
