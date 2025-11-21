import { createOrderResponse, listOrdersResponse } from "../orders/orderHandlers";

export async function POST(request: Request) {
  return createOrderResponse(request);
}

export async function GET() {
  return listOrdersResponse();
}
