import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { AppDef } from "../data/apps";
import "./AppShell.css";

interface AppShellProps {
  app: AppDef;
  children: (activeMenuId: string) => ReactNode;
}

export default function AppShell({ app, children }: AppShellProps) {
  const [activeMenuId, setActiveMenuId] = useState(app.menu[0]?.id ?? "");
  const navigate = useNavigate();

  return (
    <div className="app-shell" style={{ "--accent": app.color } as React.CSSProperties}>
      <aside className="app-shell-sidebar">
        <div className="app-shell-brand">
          <button className="back-btn" onClick={() => navigate("/launcher")} title="Back to Launcher">
            ←
          </button>
          <span className="app-shell-icon">{app.icon}</span>
          <span className="app-shell-name">{app.name}</span>
        </div>
        <nav className="app-shell-menu">
          {app.menu.map((item) => (
            <button
              key={item.id}
              className={`app-shell-menu-item ${activeMenuId === item.id ? "active" : ""}`}
              onClick={() => setActiveMenuId(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="app-shell-content">{children(activeMenuId)}</main>
    </div>
  );
}
