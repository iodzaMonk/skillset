import { ReactNode } from "react";
import { getCurrentUser } from "../lib/user";
import { AuthClientProvider } from "./AuthContext";
import { User } from "@/types/User";

export default async function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await getCurrentUser();

  const safeUser: User | null = currentUser
    ? {
        id: currentUser.id,
        name: currentUser.name ?? null,
        email: currentUser.email,
        country: currentUser.country ?? null,
        birthday: currentUser.birthday ?? null,
      }
    : null;

  return (
    <AuthClientProvider initialUser={safeUser}>{children}</AuthClientProvider>
  );
}
