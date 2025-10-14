import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/user";
import { SettingsForm } from "./SettingsForm";
import type { User } from "../../types/User";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const safeUser: User = {
    name: user.name,
    id: user.id,
    email: user.email,
    country: user.country,
    birthday: user.birthday
      ? new Date(user.birthday).toISOString().split("T")[0]
      : null,
  };

  return <SettingsForm user={safeUser} />;
}
