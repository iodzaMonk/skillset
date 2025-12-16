import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function unauthorizedResponse(
  referer: string,
  message: string = "Not authenticated",
) {
  return NextResponse.json(
    { message },
    { status: 401, headers: { "x-referer": referer } },
  );
}

export function handleApiError(error: unknown, referer: string) {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === "P2002" // Unique constraint failed
  ) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 409, headers: { "x-referer": referer } },
    );
  }

  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === "P2025" // Record not found
  ) {
    return NextResponse.json(
      { message: "Record not found" },
      { status: 404, headers: { "x-referer": referer } },
    );
  }

  console.error("API Error:", error);
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500, headers: { "x-referer": referer } },
  );
}
