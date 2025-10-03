import { ReactNode } from "react";
import { getCurrentUser } from "../lib/helper";
import { AuthClientProvider, AuthUser } from "./AuthContext";

export default async function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await getCurrentUser();

  const safeUser: AuthUser | null = currentUser
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
