import { fetchUserOrders } from "@/app/lib/orders";
import { SharedOrdersPage } from "@/app/components/SharedOrdersPage";

export default function CartPage() {
  return <SharedOrdersPage fetcher={fetchUserOrders} />;
}
