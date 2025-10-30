"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order } from "@/types/Order";
import { cn } from "@/lib/utils";

type OrderListProps = {
  orders: Order[];
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  toggleModal: (e: React.MouseEvent<Element, MouseEvent>) => void;
  isLoading?: boolean;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

// Loading skeleton component
const OrderSkeleton = () => (
  <li className="border-border/70 bg-surface/95 relative overflow-hidden rounded-2xl border shadow-sm">
    <div className="flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
      <div className="flex w-full justify-between">
        <div className="ml-10 flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-5">
                <div className="bg-border h-6 w-48 animate-pulse rounded"></div>
                <div className="bg-border h-6 w-16 animate-pulse rounded-full"></div>
              </div>
              <div className="bg-border h-4 w-64 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-border h-8 w-20 animate-pulse rounded"></div>
      </div>
    </div>
  </li>
);

export function OrderList({
  orders,
  selectedIds,
  setSelectedIds,
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

  // Ensure orders is always an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Memoize the valid order IDs to prevent unnecessary re-renders
  const validOrderIds = useMemo(
    () => safeOrders.map((order) => order.id).filter(Boolean) as string[],
    [safeOrders],
  );

  const selectedOrders = useMemo(
    () =>
      safeOrders.filter((order) => order.id && selectedIds.includes(order.id)),
    [safeOrders, selectedIds],
  );

  // Clean up selectedIds when orders change - use useCallback to prevent infinite loops
  useEffect(() => {
    setSelectedIds((current) => {
      const validIds = current.filter((id) => validOrderIds.includes(id));
      // Only update if the arrays are actually different
      if (
        validIds.length !== current.length ||
        validIds.some((id, index) => id !== current[index])
      ) {
        return validIds;
      }
      return current;
    });
  }, [validOrderIds, setSelectedIds]);

  const toggleSelection = useCallback(
    (orderId: string | undefined) => {
      if (!orderId) {
        return;
      }

      setSelectedIds((current) => {
        if (current.includes(orderId)) {
          return current.filter((id) => id !== orderId);
        }
        return [...current, orderId];
      });
    },
    [setSelectedIds],
  );

  const clearSelection = useCallback(
    () => setSelectedIds([]),
    [setSelectedIds],
  );

  const selectAll = useCallback(() => {
    setSelectedIds(validOrderIds);
  }, [validOrderIds, setSelectedIds]);

  const totalSelected = selectedOrders.length;
  const totalPosts = safeOrders.length;

  const masterCheckboxState =
    totalSelected === 0
      ? false
      : totalSelected === totalPosts
        ? true
        : "indeterminate";

  // Show loading state
  if (isLoading) {
    return (
      <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
        <div className="border-border bg-surface/80 mb-4 flex flex-col gap-4 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-border h-4 w-4 animate-pulse rounded"></div>
            <div className="bg-border h-4 w-48 animate-pulse rounded"></div>
          </div>
        </div>

        <ScrollArea className="border-border/40 bg-surface/70 mb-10 h-[28rem] rounded-xl border pr-1 sm:h-[34rem]">
          <ul className="space-y-4 p-3 sm:p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <OrderSkeleton key={index} />
            ))}
          </ul>
        </ScrollArea>
      </section>
    );
  }

  // Show empty state
  if (safeOrders.length === 0) {
    return (
      <section className="border-border bg-surface/60 mx-auto mt-10 flex w-full flex-col items-center gap-4 rounded-xl border p-10 text-center md:w-4/5 lg:w-3/4">
        <p className="text-text-muted text-sm">
          Once the professional accepts the order it will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      {/* <div className="border-border bg-surface/80 mb-4 flex flex-col gap-4 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            id="select-all"
            checked={masterCheckboxState}
            onCheckedChange={(checked) => {
              if (checked === true) {
                selectAll();
              } else if (checked === false) {
                clearSelection();
              }
            }}
          />
          <label htmlFor="select-all" className="text-text text-sm font-medium">
            {totalSelected > 0
              ? `${totalSelected} selected`
              : "Select items to manage them"}
          </label>
        </div>

        {totalSelected > 0 && (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              type="button"
              variant="update"
              size="sm"
              onClick={(e) => toggleModal(e)}
            >
              <PencilIcon className="size-4" />
              Update Status
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        )}
      </div> */}

      <ScrollArea className="border-border/40 bg-surface/70 mb-10 h-[28rem] rounded-xl border pr-1 sm:h-[34rem]">
        <ul className="space-y-4 p-3 sm:p-4">
          {safeOrders.map((order) => {
            if (!order.id) {
              return null;
            }

            const orderId = order.id;
            const isSelected = selectedIds.includes(orderId);

            // Safely handle the status - provide a default if undefined
            const orderStatus = order.status || "PENDING";
            const statusDisplay = orderStatus.toLowerCase();

            return (
              <li
                key={orderId}
                className={`border-border/70 bg-surface/95 relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg ${
                  isSelected ? "ring-accent shadow-xl ring-2" : "shadow-sm"
                }`}
              >
                {/* <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelection(orderId)}
                  aria-label={`Select ${order.description || "order"}`}
                  className="border-border bg-surface absolute top-4 left-4 z-10 size-5 rounded-full border-2"
                /> */}
                <button
                  // type="button"
                  // onClick={() => toggleSelection(orderId)}
                  className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-start sm:gap-6 sm:p-6"
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
                                  badgeVariants.PENDING,
                              )}
                            >
                              {statusDisplay}
                            </span>
                          </h2>
                          {order.description && (
                            <p className="text-text-muted flex gap-2 px-2 text-sm leading-6">
                              <label className="font-bold">
                                Your order details:
                              </label>
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
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </section>
  );
}
