import { useState } from "react";
import { ro } from "../locales/ro";
import { en } from "../locales/en";
import { INITIAL_ENTRIES } from "../data/mockData";
import AddHours from "./AddHours";
import History from "./History";
import AdminPanel from "./AdminPanel";
import useWindowSize from "../hooks/useWindowSize";

function Dashboard({ user, onLogout }) {
  const [lang, setLang] = useState("ro");
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const width = useWindowSize();
  const isMobile = width < 768;
  const t = lang === "ro" ? ro : en;

  const getAllEntries = () => {
    const saved = localStorage.getItem("pontaj_entries");
    const localEntries = saved ? JSON.parse(saved) : [];
    const blacklist = localStorage.getItem("pontaj_deleted");
    const deleted = blacklist ? JSON.parse(blacklist) : [];
    const overrides = localStorage.getItem("pontaj_overrides");
    const overrideList = overrides ? JSON.parse(overrides) : {};
    const mockWithSource = INITIAL_ENTRIES.map(e => ({ ...e, source: "mock" }));
    const localWithSource = localEntries.map(e => ({ ...e, source: "local" }));
    return [...mockWithSource, ...localWithSource]
      .filter(e => !deleted.includes(e.id))
      .map(e => overrideList[e.id] ? { ...e, status: overrideList[e.id] } : e);
  };

  const handleDelete = (entry) => {
    if (entry.source === "local") {
      const saved = localStorage.getItem("pontaj_entries");
      const entries = saved ? JSON.parse(saved) : [];
      const updated = entries.filter((e) => e.id !== entry.id);
      localStorage.setItem("pontaj_entries", JSON.stringify(updated));
    } else {
      const blacklist = localStorage.getItem("pontaj_deleted");
      const deleted = blacklist ? JSON.parse(blacklist) : [];
      deleted.push(entry.id);
      localStorage.setItem("pontaj_deleted", JSON.stringify(deleted));
    }
    setRefresh(r => r + 1);
  };

  const allEntries = getAllEntries();
  const myEntries = allEntries.filter((e) => e.userId === user.id);
  const totalOre = myEntries.reduce((sum, e) => sum + e.hours, 0);
  const zileLucrate = myEntries.length;
  const aprobate = myEntries.filter((e) => e.status === "approved").length;
  const inAsteptare = myEntries.filter((e) => e.status === "pending").length;

  const navItems = [
    { id: "dashboard", icon: "🏠", label: t.nav.dashboard },
    { id: "addHours", icon: "➕", label: t.nav.addHours },
    { id: "history", icon: "📋", label: t.nav.history },
    ...(user.role === "admin" ? [{ id: "admin", icon: "👑", label: t.nav.admin }] : []),
  ];

  const renderPage = () => {
    if (activePage === "addHours") return <AddHours key={lang} user={user} lang={lang} onSaved={() => setRefresh(r => r + 1)} isMobile={isMobile} />;
    if (activePage === "history") return <History key={lang} user={user} lang={lang} onRefresh={() => setRefresh(r => r + 1)} isMobile={isMobile} />;
    if (activePage === "admin") return <AdminPanel key={lang} user={user} lang={lang} onRefresh={() => setRefresh(r => r + 1)} isMobile={isMobile} />;

    return (
      <div style={{ padding: isMobile ? "16px 12px" : "32px" }}>
        <h2 style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "700", marginBottom: "24px" }}>
          {t.dashboard.welcome}, {user.name}! 👋
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
          gap: isMobile ? "10px" : "16px",
          marginBottom: "24px",
        }}>
          {[
            { label: t.dashboard.totalHours, value: totalOre + "h", color: "#667eea", icon: "⏱" },
            { label: t.dashboard.totalDays, value: zileLucrate, color: "#f093fb", icon: "📅" },
            { label: t.dashboard.approved, value: aprobate, color: "#48bb78", icon: "✅" },
            { label: t.dashboard.pending, value: inAsteptare, color: "#ed8936", icon: "⏳" },
          ].map((card, i) => (
            <div key={i} style={{
              background: "white",
              borderRadius: "16px",
              padding: isMobile ? "16px" : "24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              borderLeft: `4px solid ${card.color}`,
            }}>
              <p style={{ fontSize: "20px", marginBottom: "4px" }}>{card.icon}</p>
              <p style={{ fontSize: isMobile ? "22px" : "32px", fontWeight: "800", color: card.color }}>{card.value}</p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{card.label}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: isMobile ? "16px" : "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: isMobile ? "80px" : "0",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
            📋 {t.history.title}
          </h3>

          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {myEntries.length === 0 ? (
                <p style={{ color: "#aaa", textAlign: "center", padding: "24px" }}>
                  {lang === "ro" ? "Nu există înregistrări." : "No entries yet."}
                </p>
              ) : (
                myEntries.map(entry => (
                  <div key={entry.id} style={{
                    border: "1px solid #f0f0f0",
                    borderRadius: "12px",
                    padding: "14px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "700", color: "#667eea" }}>{entry.hours}h</span>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                        background: entry.status === "approved" ? "#f0fff4" : entry.status === "pending" ? "#fffaf0" : "#fff5f5",
                        color: entry.status === "approved" ? "#48bb78" : entry.status === "pending" ? "#ed8936" : "#e53e3e",
                      }}>
                        {entry.status === "approved" ? t.history.approved : entry.status === "pending" ? t.history.pending : t.history.rejected}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>{entry.project}</p>
                    <p style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>{entry.date}</p>
                    <button
                      onClick={() => handleDelete(entry)}
                      style={{
                        background: "#fff5f5", color: "#e53e3e",
                        border: "none", borderRadius: "8px",
                        padding: "5px 12px", cursor: "pointer",
                        fontWeight: "600", fontSize: "12px",
                      }}
                    >
                      🗑 {lang === "ro" ? "Șterge" : "Delete"}
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8f8ff" }}>
                  {[t.history.date, t.history.hours, t.history.project, t.history.status, ""].map((h, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#aaa" }}>
                      {lang === "ro" ? "Nu există înregistrări." : "No entries yet."}
                    </td>
                  </tr>
                ) : (
                  myEntries.map((entry) => (
                    <tr key={entry.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", textAlign: "left" }}>{entry.date}</td>
                      <td style={{ padding: "12px 16px", textAlign: "left", fontWeight: "700" }}>{entry.hours}h</td>
                      <td style={{ padding: "12px 16px", textAlign: "left" }}>{entry.project}</td>
                      <td style={{ padding: "12px 16px", textAlign: "left" }}>
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                          background: entry.status === "approved" ? "#f0fff4" : entry.status === "pending" ? "#fffaf0" : "#fff5f5",
                          color: entry.status === "approved" ? "#48bb78" : entry.status === "pending" ? "#ed8936" : "#e53e3e",
                        }}>
                          {entry.status === "approved" ? t.history.approved : entry.status === "pending" ? t.history.pending : t.history.rejected}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "left" }}>
                        <button
                          onClick={() => handleDelete(entry)}
                          style={{
                            background: "#fff5f5", color: "#e53e3e",
                            border: "none", borderRadius: "8px",
                            padding: "6px 12px", cursor: "pointer",
                            fontWeight: "600", fontSize: "13px",
                          }}
                        >
                          🗑 {lang === "ro" ? "Șterge" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>

      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
        padding: isMobile ? "12px 16px" : "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none", borderRadius: "8px",
              padding: "8px 12px", cursor: "pointer",
              color: "white", fontSize: "18px", lineHeight: 1,
            }}
          >
            ☰
          </button>
          <h1 style={{ fontSize: isMobile ? "16px" : "22px", fontWeight: "800" }}>⏱ Pontaj</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px" }}>
          <button
            onClick={() => setLang(lang === "ro" ? "en" : "ro")}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: "8px", padding: "6px 10px",
              cursor: "pointer", color: "white", fontWeight: "600", fontSize: "12px",
            }}
          >
            🌐 {t.login.langBtn}
          </button>
          {!isMobile && <span style={{ fontSize: "14px" }}>👋 {user.name}</span>}
          <span style={{
            background: user.role === "admin" ? "#ffd700" : "rgba(255,255,255,0.2)",
            color: user.role === "admin" ? "#333" : "white",
            padding: "4px 10px", borderRadius: "20px",
            fontSize: "11px", fontWeight: "700",
          }}>
            {user.role === "admin" ? "👑" : "👤"}{!isMobile && (user.role === "admin" ? " Admin" : " User")}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: "8px", padding: "8px 12px",
              cursor: "pointer", color: "white", fontWeight: "600", fontSize: "12px",
            }}
          >
            {isMobile ? "↩" : t.nav.logout}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, position: "relative" }}>

        {/* OVERLAY PE MOBIL */}
        {sidebarOpen && isMobile && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 99,
            }}
          />
        )}

        {sidebarOpen && (
          <div style={{
            width: isMobile ? "240px" : "220px",
            background: "white",
            boxShadow: isMobile ? "0 4px 20px rgba(0,0,0,0.1)" : "2px 0 12px rgba(0,0,0,0.06)",
            padding: "16px",
            position: isMobile ? "absolute" : "relative",
            top: 0, left: 0, zIndex: 100,
          }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: activePage === item.id
                    ? "linear-gradient(135deg, #667eea, #f093fb)"
                    : "transparent",
                  color: activePage === item.id ? "white" : "#555",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
          {renderPage()}
        </div>

      </div>

      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "white",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
          display: "flex",
          zIndex: 200,
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setSidebarOpen(false);
              }}
              style={{
                flex: 1,
                padding: "12px 4px",
                border: "none",
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                borderTop: activePage === item.id ? "3px solid #667eea" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span style={{
                fontSize: "10px", fontWeight: "600",
                color: activePage === item.id ? "#667eea" : "#aaa",
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

export default Dashboard;