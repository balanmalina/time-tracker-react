import { useState, useMemo } from "react";
import { INITIAL_ENTRIES, USERS } from "../data/mockData";
import { ro } from "../locales/ro";
import { en } from "../locales/en";

function AdminPanel({ user, lang, onRefresh, isMobile }) {
  const t = useMemo(() => lang === "ro" ? ro.admin : en.admin, [lang]);
  const [activeTab, setActiveTab] = useState("entries");
  const [refresh, setRefresh] = useState(0);

  const getAllEntries = () => {
    const saved = localStorage.getItem("pontaj_entries");
    const localEntries = saved ? JSON.parse(saved) : [];
    const blacklist = localStorage.getItem("pontaj_deleted");
    const deleted = blacklist ? JSON.parse(blacklist) : [];
    const mockWithSource = INITIAL_ENTRIES.map(e => ({ ...e, source: "mock" }));
    const localWithSource = localEntries.map(e => ({ ...e, source: "local" }));
    return [...mockWithSource, ...localWithSource].filter(e => !deleted.includes(e.id));
  };

  const allEntries = getAllEntries();

  const handleStatus = (entry, newStatus) => {
    if (entry.source === "local") {
      const saved = localStorage.getItem("pontaj_entries");
      const entries = saved ? JSON.parse(saved) : [];
      const updated = entries.map(e =>
        e.id === entry.id ? { ...e, status: newStatus } : e
      );
      localStorage.setItem("pontaj_entries", JSON.stringify(updated));
    } else {
      const overrides = localStorage.getItem("pontaj_overrides");
      const list = overrides ? JSON.parse(overrides) : {};
      list[entry.id] = newStatus;
      localStorage.setItem("pontaj_overrides", JSON.stringify(list));
    }
    setRefresh(r => r + 1);
    if (onRefresh) onRefresh();
  };

  const handleDelete = (entry) => {
    if (entry.source === "local") {
      const saved = localStorage.getItem("pontaj_entries");
      const entries = saved ? JSON.parse(saved) : [];
      const updated = entries.filter(e => e.id !== entry.id);
      localStorage.setItem("pontaj_entries", JSON.stringify(updated));
    } else {
      const blacklist = localStorage.getItem("pontaj_deleted");
      const deleted = blacklist ? JSON.parse(blacklist) : [];
      deleted.push(entry.id);
      localStorage.setItem("pontaj_deleted", JSON.stringify(deleted));
    }
    setRefresh(r => r + 1);
    if (onRefresh) onRefresh();
  };

  const entriesWithOverrides = allEntries.map(e => {
    const overrides = localStorage.getItem("pontaj_overrides");
    const list = overrides ? JSON.parse(overrides) : {};
    return list[e.id] ? { ...e, status: list[e.id] } : e;
  });

  const totalOre = entriesWithOverrides.reduce((sum, e) => sum + e.hours, 0);
  const totalAprobate = entriesWithOverrides.filter(e => e.status === "approved").length;
  const totalPending = entriesWithOverrides.filter(e => e.status === "pending").length;

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: isMobile ? "16px" : "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginBottom: "24px",
    overflowX: "auto",
  };

  const tabStyle = (active) => ({
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: active ? "linear-gradient(135deg, #667eea, #f093fb)" : "#f0f0f0",
    color: active ? "white" : "#555",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  });

  return (
    <div style={{
      padding: isMobile ? "16px 12px" : "32px",
      paddingBottom: isMobile ? "100px" : "32px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <h2 style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "700", marginBottom: "24px" }}>
        👑 {t.title}
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(160px, 1fr))",
        gap: isMobile ? "10px" : "16px",
        marginBottom: "24px",
      }}>
        {[
          { label: t.totalHours, value: totalOre + "h", color: "#667eea", icon: "⏱" },
          { label: t.totalEntries, value: entriesWithOverrides.length, color: "#f093fb", icon: "📋" },
          { label: t.approved, value: totalAprobate, color: "#48bb78", icon: "✅" },
          { label: t.pending, value: totalPending, color: "#ed8936", icon: "⏳" },
          { label: t.usersCount, value: USERS.length, color: "#38b2ac", icon: "👥" },
        ].map((card, i) => (
          <div key={i} style={{
            background: "white",
            borderRadius: "16px",
            padding: isMobile ? "14px" : "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            borderLeft: `4px solid ${card.color}`,
          }}>
            <p style={{ fontSize: "20px", marginBottom: "4px" }}>{card.icon}</p>
            <p style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: "800", color: card.color }}>{card.value}</p>
            <p style={{ fontSize: "12px", color: "#888" }}>{card.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <button style={tabStyle(activeTab === "entries")} onClick={() => setActiveTab("entries")}>
          📋 {t.allEntries}
        </button>
        <button style={tabStyle(activeTab === "users")} onClick={() => setActiveTab("users")}>
          👥 {t.users}
        </button>
      </div>

      {activeTab === "entries" && (
        <div style={cardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "#f8f8ff" }}>
                {[t.user, t.date, t.hours, t.project, t.status, t.actions].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entriesWithOverrides.map(entry => {
                const entryUser = USERS.find(u => u.id === entry.userId);
                return (
                  <tr key={entry.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "32px", height: "32px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #667eea, #f093fb)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: "11px", fontWeight: "700",
                        }}>
                          {entryUser?.avatar}
                        </div>
                        {entryUser?.name}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>{entry.date}</td>
                    <td style={{ padding: "12px 16px", fontWeight: "700" }}>{entry.hours}h</td>
                    <td style={{ padding: "12px 16px" }}>{entry.project}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                        background: entry.status === "approved" ? "#f0fff4" : entry.status === "pending" ? "#fffaf0" : "#fff5f5",
                        color: entry.status === "approved" ? "#48bb78" : entry.status === "pending" ? "#ed8936" : "#e53e3e",
                      }}>
                        {entry.status === "approved" ? t.statusApproved : entry.status === "pending" ? t.statusPending : t.statusRejected}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {entry.status !== "approved" && (
                          <button
                            onClick={() => handleStatus(entry, "approved")}
                            style={{
                              background: "#f0fff4", color: "#48bb78",
                              border: "none", borderRadius: "8px",
                              padding: "5px 10px", cursor: "pointer",
                              fontWeight: "600", fontSize: "12px",
                            }}
                          >
                            ✅ {t.approve}
                          </button>
                        )}
                        {entry.status !== "rejected" && (
                          <button
                            onClick={() => handleStatus(entry, "rejected")}
                            style={{
                              background: "#fff5f5", color: "#e53e3e",
                              border: "none", borderRadius: "8px",
                              padding: "5px 10px", cursor: "pointer",
                              fontWeight: "600", fontSize: "12px",
                            }}
                          >
                            ❌ {t.reject}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(entry)}
                          style={{
                            background: "#f0f0f0", color: "#888",
                            border: "none", borderRadius: "8px",
                            padding: "5px 10px", cursor: "pointer",
                            fontWeight: "600", fontSize: "12px",
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div style={cardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "500px" }}>
            <thead>
              <tr style={{ background: "#f8f8ff" }}>
                {[t.avatar, t.name, t.email, t.role, t.totalHoursCol].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => {
                const userOre = entriesWithOverrides
                  .filter(e => e.userId === u.id)
                  .reduce((sum, e) => sum + e.hours, 0);
                return (
                  <tr key={u.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea, #f093fb)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: "12px", fontWeight: "700",
                      }}>
                        {u.avatar}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: "600" }}>{u.name}</td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>{u.email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                        background: u.role === "admin" ? "#fffbea" : "#f0f4ff",
                        color: u.role === "admin" ? "#d4a017" : "#667eea",
                      }}>
                        {u.role === "admin" ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: "700", color: "#667eea" }}>
                      {userOre}h
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;