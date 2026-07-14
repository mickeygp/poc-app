"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/");
  }, [user, router]);

  if (!user) return null;
  return <>{children}</>;
}
