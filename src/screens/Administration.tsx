"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import MockContent from "../components/MockContent";
import { apps, administrationApp } from "../data/apps";
import UserManagement from "./admin/UserManagement";
import "./Administration.css";

export default function Administration() {
  const [enabledApps, setEnabledApps] = useState<Record<string, boolean>>(
    () => Object.fromEntries(apps.map((a) => [a.id, true]))
  );

  const toggleApp = (id: string) =>
    setEnabledApps((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <AppShell app={administrationApp}>
      {(activeMenuId) => {
        switch (activeMenuId) {
          case "overview":
            return (
              <MockContent
                title="Overview"
                description="Snapshot of all child applications and portal health."
                stats={[
                  { label: "Registered Apps", value: String(apps.length) },
                  { label: "Active Apps", value: String(Object.values(enabledApps).filter(Boolean).length) },
                  { label: "Total Users", value: "1,284" },
                  { label: "Admins", value: "6" },
                ]}
              />
            );

          case "app-management":
            return (
              <div className="mock-content">
                <header className="mock-header">
                  <h1>App Management</h1>
                  <p>Enable, disable, and configure each child application visible in the launcher.</p>
                </header>
                <div className="admin-app-list">
                  {apps.map((app) => (
                    <div className="admin-app-row" key={app.id}>
                      <div className="admin-app-info">
                        <span className="admin-app-icon" style={{ background: app.color }}>
                          {app.icon}
                        </span>
                        <div>
                          <div className="admin-app-name">{app.name}</div>
                          <div className="admin-app-desc">{app.description}</div>
                        </div>
                      </div>
                      <div className="admin-app-actions">
                        <span className={`status-badge ${enabledApps[app.id] ? "on" : "off"}`}>
                          {enabledApps[app.id] ? "Enabled" : "Disabled"}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={enabledApps[app.id]}
                            onChange={() => toggleApp(app.id)}
                          />
                          <span className="slider" />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "user-management":
            return <UserManagement />;

          case "user-access":
            return (
              <MockContent
                title="User & Role Access"
                description="Manage which roles can access each application."
                columns={["User", "Role", "Apps Granted"]}
                rows={[
                  { User: "S. Lee", Role: "IT Admin", "Apps Granted": "ITSM, Administration" },
                  { User: "Wipa T.", Role: "HR Manager", "Apps Granted": "HR Tools, E-Approval" },
                  { User: "J. Tan", Role: "Procurement Officer", "Apps Granted": "ProcureApp, E-Approval" },
                ]}
              />
            );

          case "audit-log":
            return (
              <MockContent
                title="Audit Log"
                description="Recent administrative actions across the portal."
                columns={["Timestamp", "Actor", "Action"]}
                rows={[
                  { Timestamp: "2026-06-19 09:42", Actor: "S. Lee", Action: "Disabled ProcureApp temporarily" },
                  { Timestamp: "2026-06-18 17:10", Actor: "Admin", Action: "Granted HR Tools access to Wipa T." },
                ]}
              />
            );

          case "system-settings":
            return (
              <MockContent
                title="System Settings"
                description="Portal-wide configuration such as branding, SSO, and session timeout."
                stats={[
                  { label: "SSO Provider", value: "MS Teams" },
                  { label: "Session Timeout", value: "30 min" },
                  { label: "Theme", value: "Default" },
                ]}
              />
            );

          default:
            return null;
        }
      }}
    </AppShell>
  );
}
