import { useCallback, useEffect, useMemo, useState } from "react";

export function useSelection(itemIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Memoize valid IDs to avoid unnecessary re-renders
  const validIds = useMemo(() => itemIds, [itemIds]);

  // Clean up selectedIds when items change
  useEffect(() => {
    setSelectedIds((current) => {
      const newSelected = current.filter((id) => validIds.includes(id));
      if (
        newSelected.length !== current.length ||
        newSelected.some((id, index) => id !== current[index])
      ) {
        return newSelected;
      }
      return current;
    });
  }, [validIds]);

  const toggleSelection = useCallback((id: string | undefined) => {
    if (!id) return;

    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((currentId) => currentId !== id);
      }
      return [...current, id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(validIds);
  }, [validIds]);

  return {
    selectedIds,
    setSelectedIds,
    toggleSelection,
    clearSelection,
    selectAll,
    count: selectedIds.length,
    allSelected: validIds.length > 0 && selectedIds.length === validIds.length,
    hasSelection: selectedIds.length > 0,
  };
}

export type SelectionResult = ReturnType<typeof useSelection>;
