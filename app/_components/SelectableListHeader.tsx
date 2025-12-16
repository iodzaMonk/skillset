"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface SelectableListHeaderProps {
  totalSelected: number;
  masterChecked: boolean | "indeterminate";
  onSelectAll: () => void;
  onClearSelection: () => void;
  children?: ReactNode;
}

export function SelectableListHeader({
  totalSelected,
  masterChecked,
  onSelectAll,
  onClearSelection,
  children,
}: SelectableListHeaderProps) {
  return (
    <div className="border-border bg-surface/80 mb-4 flex flex-col gap-4 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Checkbox
          id="select-all"
          checked={masterChecked}
          onCheckedChange={(checked) => {
            if (checked === true) {
              onSelectAll();
            } else if (checked === false) {
              onClearSelection();
            }
          }}
        />
        <label htmlFor="select-all" className="text-text text-sm font-medium">
          {totalSelected > 0
            ? `${totalSelected} selected`
            : "Select items to manage them"}
        </label>
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">{children}</div>
    </div>
  );
}
