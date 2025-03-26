import React from "react";
import { convertToRem } from "./convertToRem.ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const IoMdClose = ({ size = 4, className = "", ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={convertToRem(size)}
      height={convertToRem(size)}
      viewBox="0 0 512 512"
      className={className}
      fill="currentColor"
      {...props}
    >
<path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
    </svg>
  );
};
