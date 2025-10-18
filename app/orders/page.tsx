"use client";
import { Modal } from "./_components/Modal";
import { OrderList } from "./_components/OrderList";
import { useOrderManager } from "./_hooks/orderStates";

export default function ProductsPage() {
  const { orders, isModalOpen, toggleModal, modalRef } = useOrderManager();

  return (
    <div className="space-y-6">
      <Modal toggle={isModalOpen} ref={modalRef} />
      <OrderList orders={orders} toggleModal={toggleModal} />
    </div>
  );
}
