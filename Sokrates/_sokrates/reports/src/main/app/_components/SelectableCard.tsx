"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SelectableCardProps {
  id: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  label: string;
  children: ReactNode;
}

export function SelectableCard({
  id,
  isSelected,
  onToggle,
  label,
  children,
}: SelectableCardProps) {
  return (
    <li
      className={cn(
        "border-border/70 bg-surface/95 relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg",
        isSelected ? "ring-accent shadow-xl ring-2" : "shadow-sm",
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(id)}
        aria-label={`Select ${label}`}
        className="border-border bg-surface absolute top-4 left-4 z-10 size-5 rounded-full border-2"
      />
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-start sm:gap-6 sm:p-6"
      >
        {children}
      </button>
    </li>
  );
}
