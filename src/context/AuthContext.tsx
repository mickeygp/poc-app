"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatarInitials: string;
}

interface AuthContextValue {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const MOCK_USER: User = {
  name: "Micky Amornpat",
  email: "micky.amornpat@contoso.com",
  avatarInitials: "MA",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => setUser(MOCK_USER);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
