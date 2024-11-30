"use client";

import { Slider } from "@components/ui/slider";
import { cn } from "@lib/utils";
import Stepper from "./stepper";

interface PropsType {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  indices?: number[];
  isPerc?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 *
 * @param value The controlled value of the slider
 * @param setValue Method to update the value
 * @param min The minimum value for the range
 * @param max The maximum value for the range
 * @param step The stepping interval (optional)
 * @param indices Index pointers (optional)
 * @param isPerc If indices are in percentage (optional)
 * @param disabled Condition to disable Slider (optional)
 * @param className (optional)
 */
const SliderBar = ({
  value,
  setValue,
  min,
  max,
  step = 1,
  indices,
  isPerc = false,
  disabled = false,
  className
}: PropsType) => {
  return (
    <div className={cn("relative pb-6 z-0", className)}>
      <Slider
        defaultValue={[value]}
        value={value ? [value] : [0]}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        onValueChange={(e) => setValue(e[0])}
      />
      {indices && (
        <div className="absolute inline-flex justify-between -top-0.5 left-0 right-0 mx-auto w-full text-xs/[18px] text-[#757B80] -z-10">
          {indices.map((i) => (
            <Stepper key={i} index={i} isPerc={isPerc} max={max} value={value} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderBar;
