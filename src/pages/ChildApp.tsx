import { useParams, Navigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import MockContent from "../components/MockContent";
import { apps } from "../data/apps";
import { childAppContent } from "../data/childAppContent";
import OrgChartBuilder from "./hr/OrgChartBuilder";

export default function ChildApp() {
  const { appId } = useParams<{ appId: string }>();
  const app = apps.find((a) => a.id === appId);

  if (!app) return <Navigate to="/launcher" replace />;

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
