"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { apps, administrationApp } from "../data/apps";
import "./Launcher.css";

export default function Launcher() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="launcher-page">
      <header className="launcher-header">
        <div className="launcher-header-brand">
          <span className="portal-logo-sm">🟦</span>
          <span>Enterprise Portal</span>
        </div>
        {user && (
          <div className="launcher-header-user">
            <div className="avatar">{user.avatarInitials}</div>
            <div className="user-meta">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </header>

      <main className="launcher-main">
        <section className="launcher-section">
          <h2>My Apps</h2>
          <div className="app-grid">
            {apps.map((app) => (
              <button
                key={app.id}
                className="app-tile"
                style={{ "--accent": app.color } as React.CSSProperties}
                onClick={() => router.push(`/app/${app.id}`)}
              >
                <div className="app-tile-icon">{app.icon}</div>
                <div className="app-tile-name">{app.name}</div>
                <div className="app-tile-desc">{app.description}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="launcher-section">
          <h2>Administration</h2>
          <div className="app-grid">
            <button
              className="app-tile admin-tile"
              style={{ "--accent": administrationApp.color } as React.CSSProperties}
              onClick={() => router.push(`/app/${administrationApp.id}`)}
            >
              <div className="app-tile-icon">{administrationApp.icon}</div>
              <div className="app-tile-name">{administrationApp.name}</div>
              <div className="app-tile-desc">{administrationApp.description}</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
