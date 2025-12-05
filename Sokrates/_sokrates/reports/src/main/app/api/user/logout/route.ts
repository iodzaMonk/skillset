import { deleteSession } from "@/app/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 500 });
  }
}
