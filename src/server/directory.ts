import "server-only";
import { prisma } from "@/lib/prisma";
import type {
  Assignment,
  Company,
  Department,
  DirectoryUser,
} from "@/data/directory";

export interface DirectorySnapshot {
  users: DirectoryUser[];
  companies: Company[];
  departments: Department[];
  assignments: Assignment[];
}

export async function getSnapshot(): Promise<DirectorySnapshot> {
  const [users, companies, departments, assignments] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany(),
    prisma.assignment.findMany(),
  ]);

  return {
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      deleted: u.deleted,
    })),
    companies: companies.map((c) => ({ id: c.id, name: c.name })),
    departments: departments.map((d) => ({
      id: d.id,
      companyId: d.companyId,
      parentId: d.parentId,
      name: d.name,
    })),
    assignments: assignments.map((a) => ({
      userId: a.userId,
      departmentId: a.departmentId,
      position: a.position,
    })),
  };
}

// ---- Mutations -------------------------------------------------------------

export interface MutationResult extends DirectorySnapshot {
  created?: number;
  updated?: number;
}

type Payload = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function mutate(action: string, payload: Payload): Promise<MutationResult> {
  let created: number | undefined;
  let updated: number | undefined;

  switch (action) {
    case "createUser": {
      await prisma.user.create({
        data: { name: str(payload.name), email: str(payload.email), role: str(payload.role) },
      });
      break;
    }
    case "updateUser": {
      await prisma.user.update({
        where: { id: str(payload.id) },
        data: { name: str(payload.name), email: str(payload.email), role: str(payload.role) },
      });
      break;
    }
    case "softDeleteUser": {
      const id = str(payload.id);
      await prisma.assignment.deleteMany({ where: { userId: id } });
      await prisma.user.update({ where: { id }, data: { deleted: true } });
      break;
    }
    case "restoreUser": {
      await prisma.user.update({ where: { id: str(payload.id) }, data: { deleted: false } });
      break;
    }
    case "importUsers": {
      const rows = Array.isArray(payload.rows) ? (payload.rows as Payload[]) : [];
      created = 0;
      updated = 0;
      for (const row of rows) {
        const email = str(row.email);
        if (!email) continue;
        const existing = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (existing) {
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              name: str(row.name) || existing.name,
              role: str(row.role) || existing.role,
              deleted: false,
            },
          });
          updated++;
        } else {
          await prisma.user.create({
            data: { name: str(row.name), email, role: str(row.role) },
          });
          created++;
        }
      }
      break;
    }
    case "addCompany": {
      await prisma.company.create({ data: { name: str(payload.name) || "Untitled Company" } });
      break;
    }
    case "renameCompany": {
      await prisma.company.update({ where: { id: str(payload.id) }, data: { name: str(payload.name) } });
      break;
    }
    case "deleteCompany": {
      // Departments + assignments cascade via FK onDelete.
      await prisma.company.delete({ where: { id: str(payload.id) } });
      break;
    }
    case "addDepartment": {
      const parentId = payload.parentId ? str(payload.parentId) : null;
      await prisma.department.create({
        data: {
          companyId: str(payload.companyId),
          parentId,
          name: str(payload.name) || "Untitled Department",
        },
      });
      break;
    }
    case "renameDepartment": {
      await prisma.department.update({ where: { id: str(payload.id) }, data: { name: str(payload.name) } });
      break;
    }
    case "deleteDepartment": {
      // Child departments + assignments cascade via FK onDelete.
      await prisma.department.delete({ where: { id: str(payload.id) } });
      break;
    }
    case "assignUser": {
      const userId = str(payload.userId);
      const departmentId = str(payload.departmentId);
      const position = str(payload.position);
      await prisma.assignment.upsert({
        where: { userId },
        create: { userId, departmentId, position },
        update: { departmentId, ...(position ? { position } : {}) },
      });
      break;
    }
    case "updatePosition": {
      await prisma.assignment.update({
        where: { userId: str(payload.userId) },
        data: { position: str(payload.position) },
      });
      break;
    }
    case "unassignUser": {
      await prisma.assignment.deleteMany({ where: { userId: str(payload.userId) } });
      break;
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }

  const snapshot = await getSnapshot();
  return { ...snapshot, created, updated };
}
