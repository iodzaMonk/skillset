app/hooks/useOrderManager.ts [56:76]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/orders/_hooks/orderStates.ts [48:68]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



