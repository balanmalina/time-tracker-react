import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from "recharts";
import { INITIAL_ENTRIES } from "../data/mockData";
import { ro } from "../locales/ro";
import { en } from "../locales/en";
import ExportPDF from "../components/ExportPDF";

const COLORS = ["#667eea", "#f093fb", "#48bb78", "#ed8936", "#e53e3e", "#38b2ac"];

function History({ user, lang, onRefresh, isMobile }) {
  const t = lang === "ro" ? ro.history : en.history;
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const allEntries = getAllEntries().filter(e => e.userId === user.id);

  const filtered = allEntries.filter(e => {
    const byProject = filterProject === "all" || e.project === filterProject;
    const byStatus = filterStatus === "all" || e.status === filterStatus;
    return byProject && byStatus;
  });

  const barData = filtered.map(e => ({
    data: e.date,
    ore: e.hours,
  })).sort((a, b) => a.data.localeCompare(b.data));

  const pieMap = {};
  filtered.forEach(e => {
    pieMap[e.project] = (pieMap[e.project] || 0) + e.hours;
  });
  const pieData = Object.entries(pieMap).map(([name, value]) => ({ name, value }));

  let cumulative = 0;
  const lineData = [...filtered]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => {
      cumulative += e.hours;
      return { data: e.date, total: cumulative };
    });

  const totalOre = filtered.reduce((sum, e) => sum + e.hours, 0);
  const projects = [...new Set(allEntries.map(e => e.project))];

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
    if (onRefresh) onRefresh();
  };

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: isMobile ? "16px" : "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  };

  return (
    <div style={{ padding: isMobile ? "16px 12px" : "32px", paddingBottom: isMobile ? "100px" : "32px" }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <h2 style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "700" }}>
          📊 {t.title}
        </h2>
        <ExportPDF targetId="history-content" fileName="pontaj-istoric" isMobile={isMobile} />
      </div>

      <div id="history-content">

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(160px, 1fr))",
          gap: isMobile ? "10px" : "16px",
          marginBottom: "24px",
        }}>
          {[
            { label: t.totalHours, value: totalOre + "h", color: "#667eea", icon: "⏱" },
            { label: t.daysWorked, value: filtered.length, color: "#f093fb", icon: "📅" },
            { label: t.approved, value: filtered.filter(e => e.status === "approved").length, color: "#48bb78", icon: "✅" },
            { label: t.pending, value: filtered.filter(e => e.status === "pending").length, color: "#ed8936", icon: "⏳" },
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

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}>

          <div style={cardStyle}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              📊 {t.chartDaily}
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="data" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#f093fb" />
                  </linearGradient>
                </defs>
                <Bar dataKey="ore" fill="url(#gradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              🥧 {t.chartProjects}
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 35 : 50}
                  outerRadius={isMobile ? 60 : 80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
            📈 {t.chartEvolution}
          </h3>
          <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="data" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#667eea"
                strokeWidth={3}
                dot={{ fill: "#f093fb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...cardStyle, display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>🔍 {t.filters}:</span>
          <select
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
            style={{
              padding: "8px 14px", borderRadius: "10px",
              border: "2px solid #eee", fontSize: "14px", outline: "none",
              flex: isMobile ? "1" : "unset",
            }}
          >
            <option value="all">{t.allProjects}</option>
            {projects.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: "8px 14px", borderRadius: "10px",
              border: "2px solid #eee", fontSize: "14px", outline: "none",
              flex: isMobile ? "1" : "unset",
            }}
          >
            <option value="all">{t.allStatuses}</option>
            <option value="approved">{t.approved}</option>
            <option value="pending">{t.pending}</option>
            <option value="rejected">{t.rejected}</option>
          </select>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
            📋 {t.details}
          </h3>

          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.length === 0 ? (
                <p style={{ color: "#aaa", textAlign: "center", padding: "24px" }}>{t.noEntries}</p>
              ) : (
                filtered.map(entry => (
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
                        {entry.status === "approved" ? t.approved : entry.status === "pending" ? t.pending : t.rejected}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>{entry.project}</p>
                    <p style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>{entry.date}</p>
                    <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>{entry.description}</p>
                    <button
                      onClick={() => handleDelete(entry)}
                      style={{
                        background: "#fff5f5", color: "#e53e3e",
                        border: "none", borderRadius: "8px",
                        padding: "5px 12px", cursor: "pointer",
                        fontWeight: "600", fontSize: "12px",
                      }}
                    >
                      🗑 {t.delete}
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8f8ff" }}>
                  {[t.date, t.hours, t.project, t.description, t.status, ""].map((h, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#aaa" }}>
                      {t.noEntries}
                    </td>
                  </tr>
                ) : (
                  filtered.map(entry => (
                    <tr key={entry.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", textAlign: "left" }}>{entry.date}</td>
                      <td style={{ padding: "12px 16px", textAlign: "left", fontWeight: "700" }}>{entry.hours}h</td>
                      <td style={{ padding: "12px 16px", textAlign: "left" }}>{entry.project}</td>
                      <td style={{ padding: "12px 16px", textAlign: "left", color: "#888" }}>{entry.description}</td>
                      <td style={{ padding: "12px 16px", textAlign: "left" }}>
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                          background: entry.status === "approved" ? "#f0fff4" : entry.status === "pending" ? "#fffaf0" : "#fff5f5",
                          color: entry.status === "approved" ? "#48bb78" : entry.status === "pending" ? "#ed8936" : "#e53e3e",
                        }}>
                          {entry.status === "approved" ? t.approved : entry.status === "pending" ? t.pending : t.rejected}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => handleDelete(entry)}
                          style={{
                            background: "#fff5f5", color: "#e53e3e",
                            border: "none", borderRadius: "8px",
                            padding: "6px 12px", cursor: "pointer",
                            fontWeight: "600", fontSize: "13px",
                          }}
                        >
                          🗑 {t.delete}
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
    </div>
  );
}

export default History;