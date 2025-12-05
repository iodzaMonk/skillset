app/myorderslist/page.tsx [47:56]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/orders/page.tsx [20:29]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



