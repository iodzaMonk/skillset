"use client";

import { ReactNode } from "react";
import { SelectableListHeader } from "@/app/_components/SelectableListHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

interface SelectableListProps<T> {
  items: T[];
  selectedIds: string[];
  totalSelected: number;
  masterCheckboxState: boolean | "indeterminate";
  onSelectAll: () => void;
  onClearSelection: () => void;
  onModify?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  getItemId: (item: T) => string;
  canModify?: boolean;
  canDelete?: boolean;
}

export function SelectableList<T>({
  items,
  selectedIds,
  totalSelected,
  masterCheckboxState,
  onSelectAll,
  onClearSelection,
  onModify,
  onDelete,
  onCreate,
  renderItem,
  getItemId,
  canModify = false,
  canDelete = false,
}: SelectableListProps<T>) {
  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      <SelectableListHeader
        totalSelected={totalSelected}
        masterChecked={masterCheckboxState}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      >
        {totalSelected > 0 && (
          <>
            <Button
              type="button"
              variant="update"
              size="sm"
              onClick={onModify}
              disabled={!canModify || !onModify}
            >
              <PencilIcon className="size-4" />
              Modify
            </Button>
            <Button
              type="button"
              variant="delete"
              size="sm"
              onClick={onDelete}
              disabled={!canDelete || !onDelete}
            >
              <PencilIcon className="size-4" />
              Delete
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="success"
          size="sm"
          className="w-full sm:w-auto"
          onClick={onCreate}
          disabled={!onCreate || totalSelected >= 1}
        >
          Create
        </Button>
      </SelectableListHeader>

      <ScrollArea className="border-border/40 bg-surface/70 mb-10 h-[28rem] rounded-xl border pr-1 sm:h-[34rem]">
        <ul className="space-y-4 p-3 sm:p-4">
          {items.map((item) => {
            const id = getItemId(item);
            if (!id) return null;
            const isSelected = selectedIds.includes(id);
            return renderItem(item, isSelected);
          })}
        </ul>
      </ScrollArea>
    </section>
  );
}
