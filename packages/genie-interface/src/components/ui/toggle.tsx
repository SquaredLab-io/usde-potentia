"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md font-normal text-sm/[22px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-slate-950 text-white/80 hover:bg-slate-800 hover:text-white focus-visible:ring-slate-300 data-[state=on]:bg-secondary-gray data-[state=on]:text-white cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border bg-transparent border-slate-800 hover:bg-slate-800 hover:text-slate-50"
      },
      size: {
        default: "h-fit py-1 px-1.5",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
