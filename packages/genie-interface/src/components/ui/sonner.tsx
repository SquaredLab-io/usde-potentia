"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:shadow-lg group-[.toaster]:bg-primary-gray group-[.toaster]:text-slate-50 group-[.toaster]:border-slate-800 group-[.toaster]:rounded-none",
          description: "group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-slate-50 group-[.toast]:text-slate-900",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400"
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
