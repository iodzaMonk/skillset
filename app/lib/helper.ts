import { cookies } from "next/headers";
import { decrypt } from "./session";
import { createClient } from "../utils/supabase/server";

export async function getCurrentUser() {
  // get cookies from browser
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  // decrypt hashed session
  const payload = await decrypt(token);
  if (!payload?.userId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, country, birthday")
    .eq("id", payload.userId)
    .single();

  if (error || !data) {
    console.error(error?.message ?? "Unable to fetch current user");
    return null;
  }

  return data;
}

