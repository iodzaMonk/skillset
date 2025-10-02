"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, Key, useCallback, useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { MyProductsView, type Product } from "./MyProductsView";
import { PostBody } from "@/types/PostBody";

export default function MyProducts() {
  const router = useRouter();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productPendingDelete, setProductPendingDelete] =
    useState<Product | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<Key | null>(null);

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setPrice("");
    setEditingId(null);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("/api/product/user");
      setProducts(res.data?.data ?? []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFormOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetForm();
      }
      setIsFormOpen(nextOpen);
    },
    [resetForm],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const payload: Omit<PostBody, "id" | "date"> = {
        user_id: user?.id ?? "",
        title: name.trim(),
        description: description.trim(),
        price: parseFloat(price || "0"),
      };

      try {
        if (editingId) {
          await axios.put("/api/product/user", { ...payload, id: editingId });
        } else {
          await axios.post("/api/product/user", payload);
        }

        await fetchProducts();
        handleFormOpenChange(false);
        router.refresh();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    [
      description,
      editingId,
      fetchProducts,
      handleFormOpenChange,
      name,
      price,
      router,
      user?.id,
    ],
  );

  const startEditing = useCallback((product: Product) => {
    setName(product.title);
    setDescription(product.description);
    setPrice(product.price.toString());
    setEditingId(product.id);
    setIsFormOpen(true);
  }, []);

  const requestDelete = useCallback((product: Product) => {
    setProductPendingDelete(product);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setProductPendingDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!productPendingDelete) {
      return;
    }

    try {
      await axios.delete("/api/product", {
        data: { id: productPendingDelete.id },
      });
      await fetchProducts();
      router.refresh();
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      closeDeleteDialog();
    }
  }, [closeDeleteDialog, fetchProducts, productPendingDelete, router]);

  const isEditing = editingId !== null;
  const isDeleteDialogOpen = productPendingDelete !== null;

  return (
    <MyProductsView
      products={products}
      isFormOpen={isFormOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      productPendingDelete={productPendingDelete}
      name={name}
      description={description}
      price={price}
      isEditing={isEditing}
      onFormOpenChange={handleFormOpenChange}
      onSubmit={handleSubmit}
      onNameChange={setName}
      onDescriptionChange={setDescription}
      onPriceChange={setPrice}
      onStartEditing={startEditing}
      onRequestDelete={requestDelete}
      onCancelForm={() => handleFormOpenChange(false)}
      onCreateClick={resetForm}
      onCloseDeleteDialog={closeDeleteDialog}
      onConfirmDelete={confirmDelete}
    />
  );
}
