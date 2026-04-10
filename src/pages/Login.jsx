import { useState } from "react";
import { USERS } from "../data/mockData";
import { ro } from "../locales/ro";
import { en } from "../locales/en";

function Login({ onLogin, theme, toggleTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState("ro");

  const t = lang === "ro" ? ro.login : en.login;

  const handleLogin = () => {
    const user = USERS.find(
      (u) => u.email === email.trim() && u.password === password.trim()
    );
    if (user) {
      onLogin(user);
    } else {
      setError(t.error);
    }
  };

  const isDark = theme === "dark";

  const btnStyle = {
    background: isDark ? "#2a2a4a" : "#f0f0f0",
    border: "none",
    borderRadius: "8px",
    padding: "6px 14px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    color: isDark ? "#e0e0e0" : "#333",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: isDark ? "2px solid #2a2a4a" : "2px solid #eee",
    marginTop: "6px",
    fontSize: "15px",
    outline: "none",
    background: isDark ? "#1e1e35" : "#ffffff",
    color: isDark ? "#e0e0e0" : "#333",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div
        className="animate-scaleIn"
        style={{
          background: isDark ? "#16213e" : "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          margin: "16px",
        }}
      >
        <div className="animate-fadeInDown delay-1" style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
        }}>
          <button onClick={toggleTheme} style={btnStyle}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setLang(lang === "ro" ? "en" : "ro")}
            style={btnStyle}
          >
            🌐 {t.langBtn}
          </button>
        </div>

        <div className="animate-fadeInDown delay-2">
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "4px", color: isDark ? "#e0e0e0" : "#1a1a2e" }}>
            {t.title}
          </h1>
          <p style={{ color: isDark ? "#a0a0b0" : "#888", marginBottom: "32px" }}>
            {t.subtitle}
          </p>
        </div>

        <div className="animate-fadeInUp delay-2" style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: isDark ? "#a0a0b0" : "#555", display: "block" }}>
            {t.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplu@email.com"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#667eea"}
            onBlur={e => e.target.style.borderColor = isDark ? "#2a2a4a" : "#eee"}
          />
        </div>

        <div className="animate-fadeInUp delay-3" style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: isDark ? "#a0a0b0" : "#555", display: "block" }}>
            {t.password}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#667eea"}
            onBlur={e => e.target.style.borderColor = isDark ? "#2a2a4a" : "#eee"}
          />
        </div>

        {error && (
          <div className="animate-fadeIn" style={{
            background: "#fff0f0",
            color: "#e53e3e",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "14px",
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="animate-fadeInUp delay-4">
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #667eea, #f093fb)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
            }}
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(102,126,234,0.5)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(102,126,234,0.4)";
            }}
          >
            {t.button}
          </button>
        </div>

        <div className="animate-fadeIn delay-5" style={{
          marginTop: "24px",
          background: isDark ? "#1e1e35" : "#f8f8ff",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "13px",
          color: isDark ? "#a0a0b0" : "#666",
        }}>
          <p style={{ fontWeight: "700", marginBottom: "8px", color: isDark ? "#e0e0e0" : "#333" }}>
            🔑 Conturi demo:
          </p>
          <p>👑 Admin: admin@pontaj.ro / admin123</p>
          <p style={{ marginTop: "4px" }}>👤 User: malina@pontaj.ro / user123</p>
        </div>

      </div>
    </div>
  );
}

export default Login;