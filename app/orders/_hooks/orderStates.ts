"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchUserOrder, updateUserStatus } from "@/app/lib/orders";
import { Order } from "@/types/Order";
import { Status } from "@/types/Status";

export function useOrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  /**
   * Refreshes posts
   * @async
   */
  const refreshPosts = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchUserOrder();
      // Ensure data is always an array
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Unable to load orders", error);
      setOrders([]); // Set empty array on error
    }
  }, []);

  const primaryOrderId = selectedIds[0] ?? null;
  const primarOrder = orders.find((o) => o.id === primaryOrderId) ?? null;
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(() => {
    updateUserStatus(selectedStatus, selectedIds);
  }, [selectedStatus, selectedIds]);

  const closeModal = useCallback(() => {
    updateStatus();
    refreshPosts();
    setIsModalOpen(false);
  }, [updateStatus, refreshPosts]);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, [setIsModalOpen]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!isModalOpen) return;
      if (!modalRef.current?.contains(event.target as Node)) {
        closeModal();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return {
    orders,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    modalRef,
    selectedIds,
    selectedStatus,
    setSelectedIds,
    setSelectedStatus,
    primarOrder,
  };
}
