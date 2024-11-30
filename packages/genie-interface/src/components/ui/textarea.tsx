import * as React from "react";

import { cn } from "@lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-2xl px-6 py-4 text-base/6 focus-visible:outline-none focus:ring-1 ring-secondary-gray disabled:cursor-not-allowed disabled:opacity-50 bg-primary-gray placeholder:text-[#757B80] text-[#e7e7e7] font-normal",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
