import { useParams, Navigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import MockContent from "../components/MockContent";
import { apps } from "../data/apps";
import { childAppContent } from "../data/childAppContent";

export default function ChildApp() {
  const { appId } = useParams<{ appId: string }>();
  const app = apps.find((a) => a.id === appId);

  if (!app) return <Navigate to="/launcher" replace />;

  return (
    <AppShell app={app}>
      {(activeMenuId) => {
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
