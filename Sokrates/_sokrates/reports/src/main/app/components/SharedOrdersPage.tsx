"use client";

import { Modal } from "@/app/orders/_components/Modal";
import { OrderList } from "@/app/orders/_components/OrderList";
import { useOrderManager } from "@/app/hooks/useOrderManager";
import { Order } from "@/types/Order";

interface SharedOrdersPageProps {
  fetcher: () => Promise<Order[]>;
}

export function SharedOrdersPage({ fetcher }: SharedOrdersPageProps) {
  const {
    orders,
    isModalOpen,
    toggleModal,
    modalRef,
    setSelectedStatus,
    selectedStatus,
    primaryOrder,
    isLoading,
    selection,
  } = useOrderManager(fetcher);

  return (
    <div className="space-y-6">
      <Modal
        selectedOrder={primaryOrder}
        toggle={isModalOpen}
        ref={modalRef}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <OrderList
        orders={orders}
        toggleModal={toggleModal}
        selection={selection}
        isLoading={isLoading}
      />
    </div>
  );
}
