"use client";

import { User } from "@/types/User";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AuthContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthClientProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

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
