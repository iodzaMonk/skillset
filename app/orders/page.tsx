"use client";
import { Modal } from "./_components/Modal";
import { OrderList } from "./_components/OrderList";
import { useOrderManager } from "./_hooks/orderStates";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
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
    isLoading,
  } = useOrderManager();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
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
        orders={orders}
        toggleModal={toggleModal}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isLoading={isLoading}
      />
    </div>
  );
}
