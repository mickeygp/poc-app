interface MenuContent {
  description: string;
  stats?: { label: string; value: string }[];
  columns?: string[];
  rows?: Record<string, string>[];
}

type AppContentMap = Record<string, Record<string, MenuContent>>;

export const childAppContent: AppContentMap = {
  itsm: {
    dashboard: {
      description: "Overview of IT service health and ticket volume.",
      stats: [
        { label: "Open Incidents", value: "23" },
        { label: "SLA Breaches", value: "2" },
        { label: "Avg Resolution", value: "4.2h" },
        { label: "Open Requests", value: "57" },
      ],
    },
    incidents: {
      description: "Track and resolve reported IT incidents.",
      columns: ["ID", "Title", "Priority", "Status", "Assigned To"],
      rows: [
        { ID: "INC-1042", Title: "VPN connectivity issue", Priority: "High", Status: "In Progress", "Assigned To": "S. Lee" },
        { ID: "INC-1041", Title: "Email delivery delayed", Priority: "Medium", Status: "Open", "Assigned To": "Unassigned" },
        { ID: "INC-1039", Title: "Printer offline - 4F", Priority: "Low", Status: "Resolved", "Assigned To": "J. Tan" },
      ],
    },
    "service-requests": {
      description: "Employee requests for IT services and equipment.",
      columns: ["ID", "Request", "Requester", "Status"],
      rows: [
        { ID: "SR-501", Request: "New laptop", Requester: "A. Wong", Status: "Pending Approval" },
        { ID: "SR-498", Request: "Software license", Requester: "P. Kim", Status: "Fulfilled" },
      ],
    },
    "change-management": {
      description: "Review and approve infrastructure change requests.",
      columns: ["ID", "Change", "Risk", "Scheduled"],
      rows: [
        { ID: "CHG-220", Change: "Firewall rule update", Risk: "Medium", Scheduled: "2026-06-22" },
        { ID: "CHG-219", Change: "Server OS patching", Risk: "Low", Scheduled: "2026-06-20" },
      ],
    },
    "knowledge-base": {
      description: "Self-service articles and troubleshooting guides.",
      columns: ["Article", "Category", "Views"],
      rows: [
        { Article: "How to reset your VPN password", Category: "Network", Views: "1,204" },
        { Article: "Setting up email on mobile", Category: "Email", Views: "892" },
      ],
    },
    assets: {
      description: "Inventory of managed IT hardware and software assets.",
      columns: ["Asset Tag", "Type", "Owner", "Status"],
      rows: [
        { "Asset Tag": "LT-3321", Type: "Laptop", Owner: "S. Lee", Status: "Active" },
        { "Asset Tag": "MN-1187", Type: "Monitor", Owner: "Unassigned", Status: "In Storage" },
      ],
    },
  },

  "hr-tools": {
    dashboard: {
      description: "Key HR metrics across the organization.",
      stats: [
        { label: "Headcount", value: "1,284" },
        { label: "Open Positions", value: "14" },
        { label: "Pending Leave", value: "9" },
        { label: "Reviews Due", value: "31" },
      ],
    },
    "employee-directory": {
      description: "Search and browse employee records.",
      columns: ["Name", "Department", "Title", "Location"],
      rows: [
        { Name: "Nattapong S.", Department: "Engineering", Title: "Software Engineer", Location: "Bangkok" },
        { Name: "Wipa T.", Department: "Finance", Title: "Financial Analyst", Location: "Bangkok" },
      ],
    },
    "leave-management": {
      description: "Employee leave requests and balances.",
      columns: ["Employee", "Type", "Dates", "Status"],
      rows: [
        { Employee: "Nattapong S.", Type: "Annual Leave", Dates: "Jun 25-27", Status: "Pending" },
        { Employee: "Wipa T.", Type: "Sick Leave", Dates: "Jun 18", Status: "Approved" },
      ],
    },
    payroll: {
      description: "Payroll runs and compensation summaries.",
      columns: ["Period", "Employees", "Total Payout", "Status"],
      rows: [
        { Period: "May 2026", Employees: "1,284", "Total Payout": "฿38.2M", Status: "Completed" },
        { Period: "Jun 2026", Employees: "1,284", "Total Payout": "฿38.5M", Status: "Processing" },
      ],
    },
    performance: {
      description: "Performance review cycles and ratings.",
      columns: ["Employee", "Cycle", "Rating", "Status"],
      rows: [
        { Employee: "Nattapong S.", Cycle: "H1 2026", Rating: "Exceeds", Status: "Completed" },
        { Employee: "Wipa T.", Cycle: "H1 2026", Rating: "-", Status: "In Progress" },
      ],
    },
    onboarding: {
      description: "New hire onboarding checklists and progress.",
      columns: ["New Hire", "Start Date", "Progress"],
      rows: [
        { "New Hire": "Kanya P.", "Start Date": "2026-06-23", Progress: "60%" },
        { "New Hire": "Teerapat M.", "Start Date": "2026-07-01", Progress: "10%" },
      ],
    },
  },

  procureapp: {
    dashboard: {
      description: "Procurement spend and request overview.",
      stats: [
        { label: "Open POs", value: "46" },
        { label: "Pending Requests", value: "18" },
        { label: "Active Vendors", value: "92" },
        { label: "Monthly Spend", value: "฿12.4M" },
      ],
    },
    "purchase-requests": {
      description: "Requests for procurement of goods and services.",
      columns: ["ID", "Item", "Requester", "Amount", "Status"],
      rows: [
        { ID: "PR-3301", Item: "Office laptops (10x)", Requester: "S. Lee", Amount: "฿450,000", Status: "Pending Approval" },
        { ID: "PR-3298", Item: "Cloud hosting renewal", Requester: "J. Tan", Amount: "฿120,000", Status: "Approved" },
      ],
    },
    "purchase-orders": {
      description: "Issued purchase orders to vendors.",
      columns: ["PO Number", "Vendor", "Total", "Status"],
      rows: [
        { "PO Number": "PO-9921", Vendor: "Tech Supplies Co.", Total: "฿450,000", Status: "In Transit" },
        { "PO Number": "PO-9918", Vendor: "CloudHost Ltd.", Total: "฿120,000", Status: "Delivered" },
      ],
    },
    vendors: {
      description: "Registered vendor and supplier directory.",
      columns: ["Vendor", "Category", "Rating", "Status"],
      rows: [
        { Vendor: "Tech Supplies Co.", Category: "Hardware", Rating: "4.5", Status: "Active" },
        { Vendor: "CloudHost Ltd.", Category: "Cloud Services", Rating: "4.8", Status: "Active" },
      ],
    },
    contracts: {
      description: "Vendor contracts and renewal tracking.",
      columns: ["Contract", "Vendor", "Expires", "Status"],
      rows: [
        { Contract: "CT-2024-118", Vendor: "CloudHost Ltd.", Expires: "2026-12-31", Status: "Active" },
        { Contract: "CT-2023-092", Vendor: "Tech Supplies Co.", Expires: "2026-07-15", Status: "Renewal Due" },
      ],
    },
    budget: {
      description: "Departmental procurement budget tracking.",
      columns: ["Department", "Budget", "Spent", "Remaining"],
      rows: [
        { Department: "IT", Budget: "฿5.0M", Spent: "฿3.2M", Remaining: "฿1.8M" },
        { Department: "Operations", Budget: "฿3.5M", Spent: "฿2.9M", Remaining: "฿0.6M" },
      ],
    },
  },

  "e-approval": {
    dashboard: {
      description: "Approval workflow activity overview.",
      stats: [
        { label: "Pending Approvals", value: "12" },
        { label: "My Requests", value: "5" },
        { label: "Avg Approval Time", value: "1.4d" },
        { label: "Active Workflows", value: "8" },
      ],
    },
    "pending-approvals": {
      description: "Items awaiting your approval.",
      columns: ["ID", "Type", "Submitted By", "Amount", "Status"],
      rows: [
        { ID: "APR-771", Type: "Purchase Request", "Submitted By": "S. Lee", Amount: "฿450,000", Status: "Awaiting You" },
        { ID: "APR-768", Type: "Leave Request", "Submitted By": "Wipa T.", Amount: "-", Status: "Awaiting You" },
      ],
    },
    "my-requests": {
      description: "Requests you have submitted for approval.",
      columns: ["ID", "Type", "Submitted", "Status"],
      rows: [
        { ID: "APR-760", Type: "Expense Claim", Submitted: "2026-06-15", Status: "Approved" },
        { ID: "APR-755", Type: "Travel Request", Submitted: "2026-06-10", Status: "Rejected" },
      ],
    },
    "approval-history": {
      description: "Historical record of completed approvals.",
      columns: ["ID", "Type", "Decision", "Date"],
      rows: [
        { ID: "APR-740", Type: "Purchase Order", Decision: "Approved", Date: "2026-06-01" },
        { ID: "APR-732", Type: "Contract Renewal", Decision: "Approved", Date: "2026-05-28" },
      ],
    },
    "workflow-templates": {
      description: "Reusable approval workflow definitions.",
      columns: ["Template", "Steps", "Used By"],
      rows: [
        { Template: "Purchase > 100K", Steps: "3", "Used By": "ProcureApp" },
        { Template: "Leave Request", Steps: "1", "Used By": "HR Tools" },
      ],
    },
    delegation: {
      description: "Delegate your approval authority while away.",
      columns: ["Delegate To", "From", "To", "Status"],
      rows: [
        { "Delegate To": "P. Kim", From: "2026-06-25", To: "2026-06-30", Status: "Scheduled" },
      ],
    },
  },
};
