import axios from "axios";

import type { PostBody } from "../../types/PostBody";

const api = axios.create({
  withCredentials: true,
});

export async function fetchUserProducts(): Promise<PostBody[]> {
  try {
    const res = await api.get("/api/product/user");
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
}

export async function createProduct(payload: PostBody): Promise<PostBody> {
  try {
    const body = {
      user_id: payload.user_id,
      title: payload.title.trim(),
      description: payload.description.trim(),
      price: payload.price,
      image_location: payload.image_location,
      category: payload.category,
    };

    const res = await api.post("/api/product/user", body);
    return res.data?.data as PostBody;
  } catch (error) {
    console.error("Failed to create a product", error);
    throw error;
  }
}

export async function updateProduct(payload: PostBody): Promise<PostBody> {
  try {
    const body = {
      id: payload.id,
      user_id: payload.user_id,
      title: payload.title.trim(),
      description: payload.description.trim(),
      price: payload.price,
      image_location: payload.image_location,
      category: payload.category,
    };

    const res = await api.put("/api/product/user", body);
    return res.data?.data as PostBody;
  } catch (error) {
    console.error("Failed to update a product", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete("/api/product", {
      data: { id },
    });
  } catch (error) {
    console.error("Failed to delete product", error);
    throw error;
  }
}
