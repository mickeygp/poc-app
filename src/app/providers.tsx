"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { DirectoryProvider } from "@/context/DirectoryContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DirectoryProvider>{children}</DirectoryProvider>
    </AuthProvider>
  );
}
