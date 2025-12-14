"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchUserOrder, updateUserStatus } from "@/app/lib/orders";
import { Order } from "@/types/Order";
import { Status } from "@/types/Status";
import { useSelection } from "./useSelection";

export function useOrderManager(
  fetcher: () => Promise<Order[]> = fetchUserOrder,
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const orderIds = orders.map((o) => o.id).filter(Boolean) as string[];
  const selection = useSelection(orderIds);
  const { selectedIds, setSelectedIds } = selection;

  /**
   * Refreshes orders
   * @async
   */
  const refreshOrders = useCallback(
    async (options?: { silent?: boolean }): Promise<void> => {
      const showLoader = !options?.silent;

      if (showLoader) {
        setIsLoading(true);
      }

      try {
        const data = await fetcher();
        // Ensure data is always an array
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load orders", error);
        if (showLoader) {
          setOrders([]); // Set empty array on error only when full refresh
        }
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [fetcher],
  );

  const primaryOrderId = selectedIds[0] ?? null;
  const primaryOrder = orders.find((o) => o.id === primaryOrderId) ?? null;

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(async () => {
    if (!selectedStatus || selectedIds.length === 0) {
      return false;
    }

    let previousOrders: Order[] = [];
    setOrders((current) => {
      previousOrders = current;
      return current.map((order) =>
        order.id && selectedIds.includes(order.id)
          ? { ...order, status: selectedStatus }
          : order,
      );
    });

    try {
      await updateUserStatus(selectedStatus, selectedIds);
      void refreshOrders({ silent: true });
      return true;
    } catch (error) {
      console.error("failed to update status", error);
      setOrders(previousOrders);
      await refreshOrders({ silent: true });
      return false;
    }
  }, [selectedIds, selectedStatus, refreshOrders]);

  const closeModal = useCallback(async () => {
    if (!isModalOpen) {
      return;
    }

    setIsModalOpen(false);

    if (!selectedStatus || selectedIds.length === 0) {
      setSelectedStatus(null);
      return;
    }

    const didUpdate = await updateStatus();

    if (didUpdate) {
      setSelectedIds([]);
    }

    setSelectedStatus(null);
  }, [
    isModalOpen,
    selectedIds,
    selectedStatus,
    setSelectedIds,
    setSelectedStatus,
    updateStatus,
  ]);

  const toggleModal = useCallback(() => {
    if (isModalOpen) {
      void closeModal();
    } else {
      setIsModalOpen(true);
    }
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!isModalOpen) return;
      if (!modalRef.current?.contains(event.target as Node)) {
        void closeModal();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  return {
    orders,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    modalRef,
    isLoading,
    selectedIds,
    selectedStatus,
    setSelectedIds,
    setSelectedStatus,
    primaryOrder,
    selection,
    refreshOrders,
  };
}
