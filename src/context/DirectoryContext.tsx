"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  nextId,
  seedAssignments,
  seedCompanies,
  seedDepartments,
  seedUsers,
  type Assignment,
  type Company,
  type Department,
  type DirectoryUser,
  type OrgInfo,
} from "../data/directory";

export interface NewUserInput {
  name: string;
  email: string;
  role: string;
}

interface DirectoryContextValue {
  users: DirectoryUser[];
  companies: Company[];
  departments: Department[];
  assignments: Assignment[];

  // User management (Name / Email / Role only)
  createUser: (input: NewUserInput) => DirectoryUser;
  updateUser: (id: string, input: NewUserInput) => void;
  softDeleteUser: (id: string) => void;
  restoreUser: (id: string) => void;
  importUsers: (rows: NewUserInput[]) => { created: number; updated: number };

  // Org chart — company / department CRUD
  addCompany: (name: string) => Company;
  renameCompany: (id: string, name: string) => void;
  deleteCompany: (id: string) => void;
  addDepartment: (companyId: string, parentId: string | null, name: string) => Department;
  renameDepartment: (id: string, name: string) => void;
  deleteDepartment: (id: string) => void;

  // Org chart — user placement
  assignUser: (userId: string, departmentId: string, position?: string) => void;
  updatePosition: (userId: string, position: string) => void;
  unassignUser: (userId: string) => void;

  // Derived, real-time org info for a user
  getOrgInfo: (userId: string) => OrgInfo;
}

const DirectoryContext = createContext<DirectoryContextValue | undefined>(undefined);

export function DirectoryProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<DirectoryUser[]>(seedUsers);
  const [companies, setCompanies] = useState<Company[]>(seedCompanies);
  const [departments, setDepartments] = useState<Department[]>(seedDepartments);
  const [assignments, setAssignments] = useState<Assignment[]>(seedAssignments);

  const value = useMemo<DirectoryContextValue>(() => {
    const findDept = (id: string) => departments.find((d) => d.id === id);
    const findCompany = (id: string) => companies.find((c) => c.id === id);

    const createUser: DirectoryContextValue["createUser"] = (input) => {
      const user: DirectoryUser = {
        id: nextId("u"),
        name: input.name.trim(),
        email: input.email.trim(),
        role: input.role.trim(),
        deleted: false,
      };
      setUsers((prev) => [...prev, user]);
      return user;
    };

    const updateUser: DirectoryContextValue["updateUser"] = (id, input) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, name: input.name.trim(), email: input.email.trim(), role: input.role.trim() }
            : u
        )
      );
    };

    const softDeleteUser: DirectoryContextValue["softDeleteUser"] = (id) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, deleted: true } : u)));
      // A deleted user leaves the org chart.
      setAssignments((prev) => prev.filter((a) => a.userId !== id));
    };

    const restoreUser: DirectoryContextValue["restoreUser"] = (id) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, deleted: false } : u)));
    };

    const importUsers: DirectoryContextValue["importUsers"] = (rows) => {
      let created = 0;
      let updated = 0;
      setUsers((prev) => {
        const next = [...prev];
        for (const row of rows) {
          const email = row.email.trim().toLowerCase();
          if (!email) continue;
          const idx = next.findIndex((u) => u.email.trim().toLowerCase() === email);
          if (idx >= 0) {
            next[idx] = {
              ...next[idx],
              name: row.name.trim() || next[idx].name,
              role: row.role.trim() || next[idx].role,
              deleted: false,
            };
            updated++;
          } else {
            next.push({
              id: nextId("u"),
              name: row.name.trim(),
              email: row.email.trim(),
              role: row.role.trim(),
              deleted: false,
            });
            created++;
          }
        }
        return next;
      });
      return { created, updated };
    };

    const addCompany: DirectoryContextValue["addCompany"] = (name) => {
      const company: Company = { id: nextId("co"), name: name.trim() || "Untitled Company" };
      setCompanies((prev) => [...prev, company]);
      return company;
    };

    const renameCompany: DirectoryContextValue["renameCompany"] = (id, name) => {
      setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, name: name.trim() } : c)));
    };

    const deleteCompany: DirectoryContextValue["deleteCompany"] = (id) => {
      const deptIds = departments.filter((d) => d.companyId === id).map((d) => d.id);
      setAssignments((prev) => prev.filter((a) => !deptIds.includes(a.departmentId)));
      setDepartments((prev) => prev.filter((d) => d.companyId !== id));
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    };

    const addDepartment: DirectoryContextValue["addDepartment"] = (companyId, parentId, name) => {
      const dept: Department = {
        id: nextId("dep"),
        companyId,
        parentId,
        name: name.trim() || "Untitled Department",
      };
      setDepartments((prev) => [...prev, dept]);
      return dept;
    };

    const renameDepartment: DirectoryContextValue["renameDepartment"] = (id, name) => {
      setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, name: name.trim() } : d)));
    };

    const deleteDepartment: DirectoryContextValue["deleteDepartment"] = (id) => {
      // Collect this department and all descendants.
      const toRemove = new Set<string>([id]);
      let grew = true;
      while (grew) {
        grew = false;
        for (const d of departments) {
          if (d.parentId && toRemove.has(d.parentId) && !toRemove.has(d.id)) {
            toRemove.add(d.id);
            grew = true;
          }
        }
      }
      setAssignments((prev) => prev.filter((a) => !toRemove.has(a.departmentId)));
      setDepartments((prev) => prev.filter((d) => !toRemove.has(d.id)));
    };

    const assignUser: DirectoryContextValue["assignUser"] = (userId, departmentId, position = "") => {
      setAssignments((prev) => {
        const existing = prev.find((a) => a.userId === userId);
        if (existing) {
          return prev.map((a) =>
            a.userId === userId
              ? { ...a, departmentId, position: position || a.position }
              : a
          );
        }
        return [...prev, { userId, departmentId, position }];
      });
    };

    const updatePosition: DirectoryContextValue["updatePosition"] = (userId, position) => {
      setAssignments((prev) => prev.map((a) => (a.userId === userId ? { ...a, position } : a)));
    };

    const unassignUser: DirectoryContextValue["unassignUser"] = (userId) => {
      setAssignments((prev) => prev.filter((a) => a.userId !== userId));
    };

    const getOrgInfo: DirectoryContextValue["getOrgInfo"] = (userId) => {
      const assignment = assignments.find((a) => a.userId === userId);
      if (!assignment) return { company: "—", department: "—", position: "—" };
      const dept = findDept(assignment.departmentId);
      const company = dept ? findCompany(dept.companyId) : undefined;
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
      createUser,
      updateUser,
      softDeleteUser,
      restoreUser,
      importUsers,
      addCompany,
      renameCompany,
      deleteCompany,
      addDepartment,
      renameDepartment,
      deleteDepartment,
      assignUser,
      updatePosition,
      unassignUser,
      getOrgInfo,
    };
  }, [users, companies, departments, assignments]);

  return <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>;
}

export function useDirectory() {
  const ctx = useContext(DirectoryContext);
  if (!ctx) throw new Error("useDirectory must be used within DirectoryProvider");
  return ctx;
}
