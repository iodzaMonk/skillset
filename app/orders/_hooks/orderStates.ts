"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchUserOrder } from "@/app/lib/orders";
import { Order } from "@/types/Order";

export function useOrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  /**
   * Refreshes posts
   * @async
   */
  const refreshPosts = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchUserOrder();
      setOrders(data);
    } catch (error) {
      console.error("Unable to load orders", error);
    }
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, [setIsModalOpen]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!modalRef.current?.contains(event.target as Node)) {
        closeModal();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    refreshPosts();
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [refreshPosts, closeModal]);

  return {
    orders,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    modalRef,
  };
}
