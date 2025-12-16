import axios from "axios";

import type { Order } from "../../types/Order";
import { Status } from "../../types/Status";

const api = axios.create({
  withCredentials: true,
});

export async function fetchUserOrder(): Promise<Order[]> {
  try {
    const res = await api.get(`/api/orders/user`);
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch orders", error);
    throw error;
  }
}

export async function fetchUserOrders(): Promise<Order[]> {
  try {
    const res = await api.get(`/api/cart/user`);
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch orders", error);
    throw error;
  }
}

export async function updateUserStatus(status: Status | null, ids: string[]) {
  try {
    if (!status) return;
    await api.patch(`/api/orders/user`, { status, ids });
  } catch (e) {
    console.error("failed to update status", e);
  }
}
