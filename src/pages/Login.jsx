import { useState } from "react";
import { USERS } from "../data/mockData";
import { ro } from "../locales/ro";
import { en } from "../locales/en";

function Login({ onLogin }) {
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>

        <div style={{ textAlign: "right", marginBottom: "16px" }}>
          <button
            onClick={() => setLang(lang === "ro" ? "en" : "ro")}
            style={{
              background: "#f0f0f0",
              border: "none",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            {t.langBtn}
          </button>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "4px" }}>
          {t.title}
        </h1>
        <p style={{ color: "#888", marginBottom: "32px" }}>
          {t.subtitle}
        </p>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>
            {t.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplu@email.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "2px solid #eee",
              marginTop: "6px",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>
            {t.password}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "2px solid #eee",
              marginTop: "6px",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div style={{
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
          }}
        >
          {t.button}
        </button>

        <div style={{
          marginTop: "24px",
          background: "#f8f8ff",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "13px",
          color: "#666",
        }}>
          <p style={{ fontWeight: "700", marginBottom: "8px" }}>🔑 Conturi demo:</p>
          <p>👑 Admin: admin@pontaj.ro / admin123</p>
          <p>👤 User: malina@pontaj.ro / user123</p>
        </div>

      </div>
    </div>
  );
}

export default Login;