import React from "react";
import { convertToRem } from "./convertToRem.ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const GrUp = ({ size = 4, className = "", ...props }: IconProps) => {
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
<polyline fill="none" strokeWidth="2" points="7.086 1.174 17.086 11.174 7.086 21.174" transform="rotate(-89 12.086 11.174)" stroke="currentColor"></polyline>
    </svg>
  );
};
