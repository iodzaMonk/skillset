"use client";
import { Modal } from "./_components/Modal";
import { OrderList } from "./_components/OrderList";
import { useOrderManager } from "./_hooks/orderStates";
import { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "@/types/Order";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
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
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/cart/user");
        console.log("Full API response:", response.data);

        const ordersData = response.data.data || [];
        setFetchedOrders(Array.isArray(ordersData) ? ordersData : []);

        console.log("Processed orders:", ordersData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setFetchedOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (!user) {
    return null;
  }

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
