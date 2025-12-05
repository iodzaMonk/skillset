app/myorderslist/_hooks/orderStates.ts [57:71]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return {
    orders,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    modalRef,
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/orders/_hooks/orderStates.ts [122:136]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return {
    orders,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    modalRef,
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



