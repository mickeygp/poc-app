import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleTeamsLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
      navigate("/launcher");
    }, 900);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="portal-logo">🟦</div>
          <h1>Enterprise Portal</h1>
          <p>Single sign-on for all your workplace apps</p>
        </div>

        <button
          className="teams-login-btn"
          onClick={handleTeamsLogin}
          disabled={loading}
        >
          <span className="teams-icon">👥</span>
          {loading ? "Signing in with Microsoft Teams…" : "Sign in with Microsoft Teams"}
        </button>

        <div className="login-divider">
          <span>Mock SSO Provider</span>
        </div>

        <p className="login-footnote">
          This is a mockup login. Clicking the button simulates an MS Teams
          OAuth sign-in and redirects you to the App Launcher.
        </p>
      </div>
    </div>
  );
}
