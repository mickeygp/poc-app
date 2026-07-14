export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

export interface AppDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  menu: MenuItem[];
}

export const apps: AppDef[] = [
  {
    id: "itsm",
    name: "ITSM",
    icon: "🛠️",
    color: "#2563eb",
    description: "IT Service Management",
    menu: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "incidents", label: "Incidents", icon: "🚨" },
      { id: "service-requests", label: "Service Requests", icon: "📝" },
      { id: "change-management", label: "Change Management", icon: "🔄" },
      { id: "knowledge-base", label: "Knowledge Base", icon: "📚" },
      { id: "assets", label: "Asset Inventory", icon: "💻" },
    ],
  },
  {
    id: "hr-tools",
    name: "HR Tools",
    icon: "🧑‍💼",
    color: "#16a34a",
    description: "Human Resources Management",
    menu: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "org-chart", label: "Org Chart Builder", icon: "🏢" },
      { id: "employee-directory", label: "Employee Directory", icon: "👥" },
      { id: "leave-management", label: "Leave Management", icon: "🏖️" },
      { id: "payroll", label: "Payroll", icon: "💰" },
      { id: "performance", label: "Performance Reviews", icon: "🎯" },
      { id: "onboarding", label: "Onboarding", icon: "🚀" },
    ],
  },
  {
    id: "procureapp",
    name: "ProcureApp",
    icon: "🛒",
    color: "#d97706",
    description: "Procurement Management",
    menu: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "purchase-requests", label: "Purchase Requests", icon: "🧾" },
      { id: "purchase-orders", label: "Purchase Orders", icon: "📦" },
      { id: "vendors", label: "Vendor Management", icon: "🏢" },
      { id: "contracts", label: "Contracts", icon: "📄" },
      { id: "budget", label: "Budget Tracking", icon: "📈" },
    ],
  },
  {
    id: "e-approval",
    name: "E-Approval",
    icon: "✅",
    color: "#9333ea",
    description: "Electronic Approval Workflow",
    menu: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "pending-approvals", label: "Pending Approvals", icon: "⏳" },
      { id: "my-requests", label: "My Requests", icon: "📋" },
      { id: "approval-history", label: "Approval History", icon: "🗂️" },
      { id: "workflow-templates", label: "Workflow Templates", icon: "🧩" },
      { id: "delegation", label: "Delegation Settings", icon: "🔁" },
    ],
  },
];

export const administrationApp: AppDef = {
  id: "administration",
  name: "Administration",
  icon: "⚙️",
  color: "#475569",
  description: "Portal & Child Application Administration",
  menu: [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "app-management", label: "App Management", icon: "🧰" },
    { id: "user-management", label: "User Management", icon: "👤" },
    { id: "user-access", label: "User & Role Access", icon: "🔐" },
    { id: "audit-log", label: "Audit Log", icon: "🧾" },
    { id: "system-settings", label: "System Settings", icon: "🛠️" },
  ],
};

export function findApp(appId: string): AppDef | undefined {
  if (appId === administrationApp.id) return administrationApp;
  return apps.find((a) => a.id === appId);
}
