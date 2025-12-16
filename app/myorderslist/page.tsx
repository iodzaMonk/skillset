"use client";
import { fetchUserOrders } from "@/app/lib/orders";
import { SharedOrdersPage } from "@/app/Components/SharedOrdersPage";

export default function CartPage() {
  return <SharedOrdersPage fetcher={fetchUserOrders} />;
}
