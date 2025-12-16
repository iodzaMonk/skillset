app/hooks/useOrderManager.ts [87:134]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const closeModal = useCallback(async () => {
    if (!isModalOpen) {
      return;
    }

    setIsModalOpen(false);

    if (!selectedStatus || selectedIds.length === 0) {
      setSelectedStatus(null);
      return;
    }

    const didUpdate = await updateStatus();

    if (didUpdate) {
      setSelectedIds([]);
    }

    setSelectedStatus(null);
  }, [
    isModalOpen,
    selectedIds,
    selectedStatus,
    setSelectedIds,
    setSelectedStatus,
    updateStatus,
  ]);

  const toggleModal = useCallback(() => {
    if (isModalOpen) {
      void closeModal();
    } else {
      setIsModalOpen(true);
    }
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!isModalOpen) return;
      if (!modalRef.current?.contains(event.target as Node)) {
        void closeModal();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/orders/_hooks/orderStates.ts [79:126]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const closeModal = useCallback(async () => {
    if (!isModalOpen) {
      return;
    }

    setIsModalOpen(false);

    if (!selectedStatus || selectedIds.length === 0) {
      setSelectedStatus(null);
      return;
    }

    const didUpdate = await updateStatus();

    if (didUpdate) {
      setSelectedIds([]);
    }

    setSelectedStatus(null);
  }, [
    isModalOpen,
    selectedIds,
    selectedStatus,
    setSelectedIds,
    setSelectedStatus,
    updateStatus,
  ]);

  const toggleModal = useCallback(() => {
    if (isModalOpen) {
      void closeModal();
    } else {
      setIsModalOpen(true);
    }
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!isModalOpen) return;
      if (!modalRef.current?.contains(event.target as Node)) {
        void closeModal();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



