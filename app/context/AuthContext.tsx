"use client";

import axios from "axios";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  id: number;
  name: string | null;
  email: string;
  country: string | null;
  birthday: string | null;
};

export type AuthContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthClientProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const refresh = useCallback(async () => {
    try {
      const res = await axios.get("/api/user/me");
      setUser(res.data?.user ?? null);
    } catch (error) {
      console.error("Failed to refresh user", error);
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/user/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      refresh,
      logout,
    }),
    [user, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthClientProvider");
  }
  return context;
}
