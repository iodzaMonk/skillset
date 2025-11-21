import { createOrderResponse, listOrdersResponse } from "./orderHandlers";

export async function POST(request: Request) {
  return createOrderResponse(request, { sendEmail: true });
}

export async function GET() {
  return listOrdersResponse();
}
