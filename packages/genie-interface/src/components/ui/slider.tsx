"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden rounded-full bg-[#373C40]">
      <SliderPrimitive.Range className="absolute h-full bg-primary-blue" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block hover:scale-125 active:scale-105 h-3 w-3 cursor-pointer rounded-full border-[3px] transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-primary-blue bg-white ring-offset-primary-blue focus-visible:ring-off-primary-blue" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
