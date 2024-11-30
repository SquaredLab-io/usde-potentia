import { memo } from "react";
import { Info } from "lucide-react";
import { cn } from "@lib/utils";

const InfoBox = ({
  isError = false,
  message = "The tokens in your wallet are being converted automatically by Genie for a small fee."
}: {
  isError?: boolean;
  message?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between mt-3 py-4 px-6 gap-4 rounded-[4px] border w-full",
        isError
          ? "border-error-red bg-[#6D070014]/10"
          : "border-[#01A1FF] bg-[#00456D14]/10"
      )}
    >
      <Info size={22} color={!isError ? "#01A1FF" : "#FF0000"} />
      <p className="font-normal text-left w-full text-sm/[18px] max-w-72">{message}</p>
    </div>
  );
};

export default memo(InfoBox);
