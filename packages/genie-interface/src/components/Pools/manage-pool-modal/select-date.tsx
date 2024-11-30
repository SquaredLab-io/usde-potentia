import { Dispatch, SetStateAction } from "react";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import DropDownIcon from "@components/icons/DropDownIcon";

export default function SelectDate({
  date,
  setDate
}: {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
  const fullDate = `${date?.getDate()} / ${(date?.getMonth() ?? 0) + 1} / ${date?.getFullYear()}`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full float-right text-left font-normal border border-secondary-gray px-4 py-3"
          )}
        >
          {date ? <span>{fullDate}</span> : <span>Pick a date</span>}
          <DropDownIcon className="ml-auto h-2.5 w-2.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
