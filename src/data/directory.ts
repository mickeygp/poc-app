// Shared directory data model for the portal POC.
//
// The Org Chart is the single source of truth for a user's Company /
// Department / Position. User Management can edit Name / Email / Role, but the
// org fields are derived from where the user sits in the hierarchy, so they are
// read-only in User Management and "sync" in real time from the Org Chart.

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

// A user's placement in the org chart. One primary placement per user for the POC.
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

let seq = 1000;
export const nextId = (prefix: string) => `${prefix}-${++seq}`;

export const seedCompanies: Company[] = [
  { id: "co-1", name: "Contoso Group" },
];

export const seedDepartments: Department[] = [
  { id: "dep-1", companyId: "co-1", parentId: null, name: "Technology" },
  { id: "dep-2", companyId: "co-1", parentId: "dep-1", name: "IT Operations" },
  { id: "dep-3", companyId: "co-1", parentId: "dep-1", name: "Software Engineering" },
  { id: "dep-4", companyId: "co-1", parentId: null, name: "Human Resources" },
  { id: "dep-5", companyId: "co-1", parentId: null, name: "Finance" },
];

export const seedUsers: DirectoryUser[] = [
  { id: "u-1", name: "Micky Amornpat", email: "micky.amornpat@contoso.com", role: "Portal Admin", deleted: false },
  { id: "u-2", name: "Sarah Lee", email: "sarah.lee@contoso.com", role: "IT Admin", deleted: false },
  { id: "u-3", name: "Wipa Thongdee", email: "wipa.t@contoso.com", role: "HR Manager", deleted: false },
  { id: "u-4", name: "James Tan", email: "james.tan@contoso.com", role: "Procurement Officer", deleted: false },
  { id: "u-5", name: "Anong Wong", email: "anong.wong@contoso.com", role: "Engineer", deleted: false },
  { id: "u-6", name: "Peter Kim", email: "peter.kim@contoso.com", role: "Finance Analyst", deleted: false },
];

export const seedAssignments: Assignment[] = [
  { userId: "u-2", departmentId: "dep-2", position: "IT Operations Lead" },
  { userId: "u-3", departmentId: "dep-4", position: "HR Manager" },
  { userId: "u-5", departmentId: "dep-3", position: "Software Engineer" },
  { userId: "u-6", departmentId: "dep-5", position: "Financial Analyst" },
];
