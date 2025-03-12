import React from "react";
import { convertToRem } from "./convertToRem.ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const IoChevronDownSharp = ({ size = 4, className = "", ...props }: IconProps) => {
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
<path fill="none" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="48" d="m112 184 144 144 144-144" stroke="currentColor"></path>
    </svg>
  );
};
