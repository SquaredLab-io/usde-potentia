import { cn } from "@lib/utils";

interface PropsType {
  index: number;
  isPerc: boolean;
  max: number;
  value: number;
}

const Stepper = ({ index, isPerc, max, value }: PropsType) => {
  return (
    <p
      className={cn(
        index === 0 ? "items-start" : index === max ? "items-end" : "items-center",
        "relative flex flex-col"
      )}
    >
      <span
        className={cn(
          "size-[6px] rounded-full",
          value >= index ? "bg-primary-blue" : "bg-[#373C40]"
        )}
      />
      <span className="absolute top-3">
        {index}
        {isPerc && "%"}
      </span>
    </p>
  );
};

export default Stepper;
