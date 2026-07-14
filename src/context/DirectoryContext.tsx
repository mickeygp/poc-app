"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Assignment,
  Company,
  Department,
  DirectoryUser,
  OrgInfo,
} from "../data/directory";

export interface NewUserInput {
  name: string;
  email: string;
  role: string;
}

interface Snapshot {
  users: DirectoryUser[];
  companies: Company[];
  departments: Department[];
  assignments: Assignment[];
}

interface DirectoryContextValue extends Snapshot {
  loading: boolean;
  error: string | null;

  // User management (Name / Email / Role only)
  createUser: (input: NewUserInput) => Promise<void>;
  updateUser: (id: string, input: NewUserInput) => Promise<void>;
  softDeleteUser: (id: string) => Promise<void>;
  restoreUser: (id: string) => Promise<void>;
  importUsers: (rows: NewUserInput[]) => Promise<{ created: number; updated: number }>;

  // Org chart — company / department CRUD
  addCompany: (name: string) => Promise<void>;
  renameCompany: (id: string, name: string) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  addDepartment: (companyId: string, parentId: string | null, name: string) => Promise<void>;
  renameDepartment: (id: string, name: string) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;

  // Org chart — user placement
  assignUser: (userId: string, departmentId: string, position?: string) => Promise<void>;
  updatePosition: (userId: string, position: string) => Promise<void>;
  unassignUser: (userId: string) => Promise<void>;

  // Derived, real-time org info for a user
  getOrgInfo: (userId: string) => OrgInfo;
}

const DirectoryContext = createContext<DirectoryContextValue | undefined>(undefined);

const EMPTY: Snapshot = { users: [], companies: [], departments: [], assignments: [] };

export function DirectoryProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applySnapshot = useCallback((data: Snapshot) => {
    setSnapshot({
      users: data.users ?? [],
      companies: data.companies ?? [],
      departments: data.departments ?? [],
      assignments: data.assignments ?? [],
    });
  }, []);

  // Initial load from the database.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/directory");
        if (!res.ok) throw new Error("Failed to load directory");
        const data = (await res.json()) as Snapshot;
        if (!cancelled) applySnapshot(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applySnapshot]);

  const post = useCallback(
    async (action: string, payload: Record<string, unknown>) => {
      const res = await fetch("/api/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Request failed");
        throw new Error(data?.error ?? "Request failed");
      }
      applySnapshot(data as Snapshot);
      return data as Snapshot & { created?: number; updated?: number };
    },
    [applySnapshot]
  );

  const value = useMemo<DirectoryContextValue>(() => {
    const { users, companies, departments, assignments } = snapshot;

    const getOrgInfo: DirectoryContextValue["getOrgInfo"] = (userId) => {
      const assignment = assignments.find((a) => a.userId === userId);
      if (!assignment) return { company: "—", department: "—", position: "—" };
      const dept = departments.find((d) => d.id === assignment.departmentId);
      const company = dept ? companies.find((c) => c.id === dept.companyId) : undefined;
      return {
        company: company?.name ?? "—",
        department: dept?.name ?? "—",
        position: assignment.position || "—",
      };
    };

    return {
      users,
      companies,
      departments,
      assignments,
      loading,
      error,
      createUser: async (input) => void (await post("createUser", { ...input })),
      updateUser: async (id, input) => void (await post("updateUser", { id, ...input })),
      softDeleteUser: async (id) => void (await post("softDeleteUser", { id })),
      restoreUser: async (id) => void (await post("restoreUser", { id })),
      importUsers: async (rows) => {
        const data = await post("importUsers", { rows });
        return { created: data.created ?? 0, updated: data.updated ?? 0 };
      },
      addCompany: async (name) => void (await post("addCompany", { name })),
      renameCompany: async (id, name) => void (await post("renameCompany", { id, name })),
      deleteCompany: async (id) => void (await post("deleteCompany", { id })),
      addDepartment: async (companyId, parentId, name) =>
        void (await post("addDepartment", { companyId, parentId, name })),
      renameDepartment: async (id, name) => void (await post("renameDepartment", { id, name })),
      deleteDepartment: async (id) => void (await post("deleteDepartment", { id })),
      assignUser: async (userId, departmentId, position) =>
        void (await post("assignUser", { userId, departmentId, position })),
      updatePosition: async (userId, position) =>
        void (await post("updatePosition", { userId, position })),
      unassignUser: async (userId) => void (await post("unassignUser", { userId })),
      getOrgInfo,
    };
  }, [snapshot, loading, error, post]);

  return <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>;
}

export function useDirectory() {
  const ctx = useContext(DirectoryContext);
  if (!ctx) throw new Error("useDirectory must be used within DirectoryProvider");
  return ctx;
}
