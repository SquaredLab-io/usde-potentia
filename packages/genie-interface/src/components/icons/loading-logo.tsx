"use client";

import animationData from "@components/icons/loading-logo-lottie.json";
import Lottie from "react-lottie";

export default function LoadingLogo({ size = 120 }: { size?: number }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return <Lottie options={defaultOptions} height={size} width={size} />;
}
