import React from "react";
import { convertToRem } from "./convertToRem.ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const IoEyeOutline = ({ size = 4, className = "", ...props }: IconProps) => {
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
<path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z" stroke="currentColor"></path>
      <circle cx="256" cy="256" r="80" fill="none" strokeMiterlimit="10" strokeWidth="32" stroke="currentColor"></circle>
    </svg>
  );
};
