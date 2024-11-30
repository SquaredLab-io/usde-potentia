import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";
import { SearchIcon } from "lucide-react";

interface PropsType {
  term: string;
  setTerm: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ term, setTerm, placeholder, className }: PropsType) {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        size="16"
        className="absolute top-0 bottom-0 my-auto left-6 font-normal text-xs/6 text-[#9299AA]"
      />
      <Input
        type="search"
        id="text"
        autoFocus={false}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
        }}
        placeholder={placeholder}
        className="bg-primary-gray pl-8 border border-secondary-gray placeholder:text-white"
      />
    </div>
  );
}
