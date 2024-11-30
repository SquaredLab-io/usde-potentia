import React from "react";
import { IconProps } from "./type";

const SpinnerIcon = (props: IconProps) => {
  const { stroke = "#FFFFFF" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="129"
      height="129"
      style={{ shapeRendering: "auto", display: "block", background: "transparent" }}
      {...props}
    >
      <g>
        <circle
          strokeDasharray="188.49555921538757 64.83185307179586"
          r="40"
          strokeWidth="9"
          stroke={stroke}
          fill="none"
          cy="50"
          cx="50"
        >
          <animateTransform
            keyTimes="0;1"
            values="0 50 50;360 50 50"
            dur="1.3888888888888888s"
            repeatCount="indefinite"
            type="rotate"
            attributeName="transform"
          />
        </circle>
        <g />
      </g>
    </svg>
  );
};

export default SpinnerIcon;
