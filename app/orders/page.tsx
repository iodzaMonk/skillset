"use client";
import { Modal } from "./_components/Modal";
import { OrderList } from "./_components/OrderList";
import { useOrderManager } from "./_hooks/orderStates";

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
      />
    </div>
  );
}
