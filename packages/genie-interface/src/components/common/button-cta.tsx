"use client";

import React, { forwardRef, ReactNode } from "react";
import clsx from "clsx";
import SpinnerIcon from "@components/icons/SpinnerIcon";

interface PropsType {
  children: string | ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

const ButtonCTA = forwardRef<HTMLButtonElement, PropsType>(
  (
    { children, className, disabled = false, isLoading = false, onClick, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center py-3 px-6",
          "font-sans-ibm-plex font-medium text-[14px]/6 text-white text-center uppercase",
          "bg-gradient-to-l from-secondary-blue via-secondary-blue to-primary-cyan",
          "active:from-tertiary-blue active:via-tertiary-blue active:to-primary-cyan",
          "bg-size-200 bg-pos-100 hover:bg-pos-0 active:bg-pos-100",
          "disabled:from-[#373C40] disabled:to-[#373C40] disabled:opacity-70 disabled:cursor-not-allowed",
          "transition-all duration-300 ease-in-out",
          className
        )}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {isLoading ? <SpinnerIcon className="size-[22px]" /> : children}
      </button>
    );
  }
);
ButtonCTA.displayName = "ButtonCTA";

export default ButtonCTA;
