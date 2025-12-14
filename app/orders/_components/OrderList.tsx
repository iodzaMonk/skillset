"use client";
import { SelectableList } from "@/app/_components/SelectableList";
import { SelectableCard } from "@/app/_components/SelectableCard";
import { SelectionResult } from "@/app/hooks/useSelection";
import { Order } from "@/types/Order";
import { cn } from "@/lib/utils";

type OrderListProps = {
  orders: Order[];
  selection: SelectionResult;
  toggleModal: (order: Order) => void;
  isLoading?: boolean;
};

import { currencyFormatter } from "@/app/utils/formatters";

export function OrderList({
  orders,
  selection,
  toggleModal,
  isLoading = false,
}: OrderListProps) {
  const badgeVariants: Record<string, string> = {
    ACCEPT:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
    REVIEW:
      "border border-amber-200 bg-amber-50 text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
    DECLINE:
      "border border-rose-200 bg-rose-50 text-rose-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
    // Add default status
    PENDING:
      "border border-gray-200 bg-gray-50 text-gray-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
  };
  /*
  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );
  */

  const {
    selectedIds,
    toggleSelection,
    clearSelection,
    selectAll,
    count: totalSelected,
    allSelected,
  } = selection;

  const masterCheckboxState =
    totalSelected === 0 ? false : allSelected ? true : "indeterminate";

  const handleModify = () => {
    if (totalSelected !== 1 || !toggleModal) {
      return;
    }
    const selectedOrder = orders.find((order) =>
      selectedIds.includes(order.id),
    );
    if (selectedOrder) {
      toggleModal(selectedOrder);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border-border bg-surface/60 mx-auto mt-10 rounded-xl border p-10 text-center text-sm md:w-3/4">
        No orders found.
      </div>
    );
  }

  return (
    <SelectableList<Order>
      items={orders}
      selectedIds={selectedIds}
      totalSelected={totalSelected}
      masterCheckboxState={masterCheckboxState}
      onSelectAll={selectAll}
      onClearSelection={clearSelection}
      onModify={handleModify}
      getItemId={(order) => order.id}
      canModify={Boolean(toggleModal)}
      renderItem={(order, isSelected) => {
        const orderId = order.id;
        const orderStatus = order.status || "PENDING";
        const statusDisplay = orderStatus.toLowerCase();

        return (
          <SelectableCard
            key={orderId}
            id={orderId}
            isSelected={isSelected}
            onToggle={toggleSelection}
            label={order.description || "order"}
          >
            <div className="flex w-full justify-between">
              <div className="ml-10 flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-text flex gap-5 text-lg font-semibold sm:text-xl">
                      {order.post?.title || "Service Request"}
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] font-semibold tracking-[0.22em] uppercase",
                          badgeVariants[orderStatus] ||
                            badgeVariants["PENDING"],
                        )}
                      >
                        {statusDisplay}
                      </span>
                    </h2>
                    {order.description && (
                      <p className="text-text-muted flex gap-2 px-2 text-sm leading-6">
                        <label className="font-bold">Order details:</label>
                        {order.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <span className="text-accent bg-accent/10 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                    Selected
                  </span>
                )}
              </div>
              <span className="text-2xl font-black">
                {currencyFormatter.format(order.post?.price || 0)}
              </span>
            </div>
          </SelectableCard>
        );
      }}
    />
  );
}
