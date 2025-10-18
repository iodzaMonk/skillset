"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order } from "@/types/Order";

type OrderListProps = {
  orders: Order[];
  toggleModal: (e: React.MouseEvent<Element, MouseEvent>) => void;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function OrderList({ orders, toggleModal }: OrderListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedOrders = useMemo(
    () => orders.filter((order) => order.id && selectedIds.includes(order.id)),
    [orders, selectedIds],
  );

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => orders.some((order) => order.id === id)),
    );
  }, [orders]);

  const toggleSelection = (orderId: string | undefined) => {
    if (!orderId) {
      return;
    }

    setSelectedIds((current) => {
      if (current.includes(orderId)) {
        return current.filter((id) => id !== orderId);
      }
      return [...current, orderId];
    });
  };

  const clearSelection = () => setSelectedIds([]);

  const selectAll = () => {
    setSelectedIds(orders.map((order) => order.id).filter(Boolean) as string[]);
  };

  const totalSelected = selectedOrders.length;
  const totalPosts = orders.length;

  const masterCheckboxState =
    totalSelected === 0
      ? false
      : totalSelected === totalPosts
        ? true
        : "indeterminate";

  if (orders.length === 0) {
    return (
      <section className="border-border bg-surface/60 mx-auto mt-10 flex w-full flex-col items-center gap-4 rounded-xl border p-10 text-center md:w-4/5 lg:w-3/4">
        <p className="text-text-muted text-sm">
          Once you accept an order it will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      <div className="border-border bg-surface/80 mb-4 flex flex-col gap-4 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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
      </div>

      <ScrollArea className="border-border/40 bg-surface/70 mb-10 h-[28rem] rounded-xl border pr-1 sm:h-[34rem]">
        <ul className="space-y-4 p-3 sm:p-4">
          {orders.map((order) => {
            if (!order.id) {
              return null;
            }

            const orderId = order.id;
            const isSelected = selectedIds.includes(orderId);

            return (
              <li
                key={orderId}
                className={`border-border/70 bg-surface/95 relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg ${
                  isSelected ? "ring-accent shadow-xl ring-2" : "shadow-sm"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelection(orderId)}
                  aria-label={`Select ${order.description}`}
                  className="border-border bg-surface absolute top-4 left-4 z-10 size-5 rounded-full border-2"
                />
                <button
                  type="button"
                  onClick={() => toggleSelection(orderId)}
                  className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-start sm:gap-6 sm:p-6"
                >
                  <div className="flex w-full justify-between">
                    <div className="ml-10 flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-text text-lg font-semibold sm:text-xl">
                            {order.post.title}
                          </h2>
                          {order.description && (
                            <p className="text-text-muted flex gap-2 px-2 text-sm leading-6">
                              <label className="font-bold">
                                Order details:
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
                      {currencyFormatter.format(order.post.price)}
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
