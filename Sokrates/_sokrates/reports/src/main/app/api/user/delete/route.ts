import { getCurrentUser } from "@/app/lib/helper";
import { deleteSession } from "@/app/lib/session";
import { createClient } from "@/app/utils/supabase/server";

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("users").delete().eq("id", user.id);

    if (error) {
      return Response.json({ message: error.message }, { status: 400 });
    }
    await deleteSession();
    return Response.json({ message: "Account delete" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
