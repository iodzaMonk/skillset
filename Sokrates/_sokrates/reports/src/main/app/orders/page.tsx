import { fetchUserOrder } from "@/app/lib/orders";
import { SharedOrdersPage } from "@/app/components/SharedOrdersPage";

export default function OrdersPage() {
  return <SharedOrdersPage fetcher={fetchUserOrder} />;
}
