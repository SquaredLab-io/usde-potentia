import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";
import { intervals } from "./configs";

export default function RangeToggle() {
  return (
    <ToggleGroup
      className="absolute -top-9 right-[120px]"
      type="single"
      defaultValue={intervals[intervals.length - 1]}
    >
      {intervals.map((interval) => (
        <ToggleGroupItem
          value={interval}
          key={interval}
          size="default"
          disabled={interval !== "1d"}
        >
          {interval}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}