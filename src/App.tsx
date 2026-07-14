import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Launcher from "./pages/Launcher";
import ChildApp from "./pages/ChildApp";
import Administration from "./pages/Administration";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/launcher"
        element={
          <RequireAuth>
            <Launcher />
          </RequireAuth>
        }
      />
      <Route
        path="/app/administration"
        element={
          <RequireAuth>
            <Administration />
          </RequireAuth>
        }
      />
      <Route
        path="/app/:appId"
        element={
          <RequireAuth>
            <ChildApp />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
