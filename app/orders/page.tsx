"use client";
import { Modal } from "./_components/Modal";
import { OrderList } from "./_components/OrderList";
import { useOrderManager } from "./_hooks/orderStates";
import { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "@/types/Order";

export default function ProductsPage() {
  const {
    orders,
    isModalOpen,
    toggleModal,
    modalRef,
    selectedIds,
    selectedStatus,
    setSelectedIds,
    setSelectedStatus,
    primarOrder,
  } = useOrderManager();

  const [fetchedOrders, setFetchedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/orders/user");
        console.log("Full API response:", response.data);

        // The API returns { data: orders }, so we need to access .data
        const ordersData = response.data.data || [];
        setFetchedOrders(Array.isArray(ordersData) ? ordersData : []);

        console.log("Processed orders:", ordersData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setFetchedOrders([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <Modal
        selectedOrder={primarOrder}
        toggle={isModalOpen}
        ref={modalRef}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <OrderList
        orders={fetchedOrders}
        toggleModal={toggleModal}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isLoading={isLoading}
      />
    </div>
  );
}
