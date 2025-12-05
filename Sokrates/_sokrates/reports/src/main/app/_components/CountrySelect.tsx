"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countries from "@/lib/countries.json";

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CountrySelect({ value, onValueChange }: CountrySelectProps) {
  return (
    <div id="countries">
      <label
        htmlFor="countries"
        className="text-text mb-2 block text-sm font-medium"
      >
        Country
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-surface w-full">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={6}
          className="border-border bg-surface text-text z-[9999] rounded-md border shadow-xl"
        >
          {countries.map((c) => (
            <SelectItem
              className="data-[highlighted]:!bg-accent/20 data-[highlighted]:!text-text data-[state-checked]:!bg-accent data-[state-checked]:!text-text-onAccent cursor-pointer px-3 py-2 text-sm data-[disabled]:opacity-50"
              key={c.code}
              value={c.code}
            >
              <div className="flex items-center gap-2">
                <span className={`fi fi-${c.code.toLowerCase()}`} />
                {c.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
