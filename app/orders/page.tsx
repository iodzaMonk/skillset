"use client";
import { fetchUserOrder } from "@/app/lib/orders";
import { SharedOrdersPage } from "@/app/Components/SharedOrdersPage";

export default function OrdersPage() {
  return <SharedOrdersPage fetcher={fetchUserOrder} />;
}
