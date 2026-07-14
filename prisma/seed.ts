import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Idempotent reset so the seed can be re-run.
  await prisma.assignment.deleteMany();
  await prisma.department.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  await prisma.company.create({ data: { id: "co-1", name: "Contoso Group" } });

  await prisma.department.createMany({
    data: [
      { id: "dep-1", companyId: "co-1", parentId: null, name: "Technology" },
      { id: "dep-2", companyId: "co-1", parentId: "dep-1", name: "IT Operations" },
      { id: "dep-3", companyId: "co-1", parentId: "dep-1", name: "Software Engineering" },
      { id: "dep-4", companyId: "co-1", parentId: null, name: "Human Resources" },
      { id: "dep-5", companyId: "co-1", parentId: null, name: "Finance" },
    ],
  });

  await prisma.user.createMany({
    data: [
      { id: "u-1", name: "Micky Amornpat", email: "micky.amornpat@contoso.com", role: "Portal Admin" },
      { id: "u-2", name: "Sarah Lee", email: "sarah.lee@contoso.com", role: "IT Admin" },
      { id: "u-3", name: "Wipa Thongdee", email: "wipa.t@contoso.com", role: "HR Manager" },
      { id: "u-4", name: "James Tan", email: "james.tan@contoso.com", role: "Procurement Officer" },
      { id: "u-5", name: "Anong Wong", email: "anong.wong@contoso.com", role: "Engineer" },
      { id: "u-6", name: "Peter Kim", email: "peter.kim@contoso.com", role: "Finance Analyst" },
    ],
  });

  await prisma.assignment.createMany({
    data: [
      { userId: "u-2", departmentId: "dep-2", position: "IT Operations Lead" },
      { userId: "u-3", departmentId: "dep-4", position: "HR Manager" },
      { userId: "u-5", departmentId: "dep-3", position: "Software Engineer" },
      { userId: "u-6", departmentId: "dep-5", position: "Financial Analyst" },
    ],
  });

  console.log("Seeded poc_app: 6 users, 1 company, 5 departments, 4 assignments.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
