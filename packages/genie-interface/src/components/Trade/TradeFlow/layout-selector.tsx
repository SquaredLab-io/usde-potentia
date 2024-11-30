import { Dispatch, SetStateAction } from "react";
import { TradeflowLayout } from "@lib/types/enums";
import NextImage from "@components/common/NextImage";
import { cn } from "@lib/utils";

const LayoutSelector = ({
  layout,
  setLayout
}: {
  layout: TradeflowLayout;
  setLayout: Dispatch<SetStateAction<TradeflowLayout>>;
}) => {
  return (
    <div className="inline-flex items-center justify-start gap-1 mb-2">
      {[TradeflowLayout.all, TradeflowLayout.positive, TradeflowLayout.negative].map(
        (tfl) => (
          <button
            key={tfl}
            className={cn(
              tfl == layout && "bg-secondary-gray rounded-sm",
              "hover:bg-secondary-gray"
            )}
            onClick={() => {
              setLayout(tfl);
            }}
          >
            <NextImage
              src={`/icons/trade-flow-${tfl}.svg`}
              altText={`${tfl}-layout`}
              className="size-6 max-w-fit"
            />
          </button>
        )
      )}
    </div>
  );
};

export default LayoutSelector;
