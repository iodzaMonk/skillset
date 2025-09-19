import { createClient } from "@/app/utils/supabase/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        email: body.email,
        password: hashedPassword,
        name: body.name,
        country: body.country,
        birthday: body.birthday,
      })
      .eq("id", body.id);

    return Response.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json(
      { message: "Internal server error" },
      {
        status: 500,
      },
    );
  }
}
