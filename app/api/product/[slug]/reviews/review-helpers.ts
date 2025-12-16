import { NextResponse } from "next/server";

export * from "./review-shared";

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}
