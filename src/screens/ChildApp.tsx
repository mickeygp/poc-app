"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import MockContent from "../components/MockContent";
import { apps } from "../data/apps";
import { childAppContent } from "../data/childAppContent";
import OrgChartBuilder from "./hr/OrgChartBuilder";

export default function ChildApp() {
  const params = useParams<{ appId: string }>();
  const router = useRouter();
  const app = apps.find((a) => a.id === params?.appId);

  useEffect(() => {
    if (!app) router.replace("/launcher");
  }, [app, router]);

  if (!app) return null;

  return (
    <AppShell app={app}>
      {(activeMenuId) => {
        if (app.id === "hr-tools" && activeMenuId === "org-chart") {
          return <OrgChartBuilder />;
        }

        const content = childAppContent[app.id]?.[activeMenuId];
        const menuItem = app.menu.find((m) => m.id === activeMenuId);
        return (
          <MockContent
            title={menuItem?.label ?? ""}
            description={content?.description ?? `Mock view for ${menuItem?.label}.`}
            stats={content?.stats}
            rows={content?.rows}
            columns={content?.columns}
          />
        );
      }}
    </AppShell>
  );
}
