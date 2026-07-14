// Shared directory types for the portal POC.
//
// The Org Chart is the single source of truth for a user's Company /
// Department / Position. User Management can edit Name / Email / Role, but the
// org fields are derived from where the user sits in the hierarchy, so they are
// read-only in User Management and "sync" in real time from the Org Chart.
//
// Data is persisted in Postgres via Prisma (see prisma/schema.prisma). Seed
// data lives in prisma/seed.ts.

export interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  role: string; // RBAC to be implemented later; free text for now.
  deleted: boolean; // soft delete
}

export interface Company {
  id: string;
  name: string; // free-text label
}

export interface Department {
  id: string;
  companyId: string; // root company this department belongs to
  parentId: string | null; // parent department, or null when directly under the company
  name: string; // free-text label
}

// A user's placement in the org chart. One primary placement per user.
export interface Assignment {
  userId: string;
  departmentId: string;
  position: string; // free-text title within the department
}

export interface OrgInfo {
  company: string;
  department: string;
  position: string;
}
