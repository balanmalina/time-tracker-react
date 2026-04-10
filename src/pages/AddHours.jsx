import { useState } from "react";
import { PROJECTS } from "../data/mockData";
import { ro } from "../locales/ro";
import { en } from "../locales/en";

function AddHours({ user, lang, onSaved, isMobile }) {
  const t = lang === "ro" ? ro.addHours : en.addHours;

  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!date || !hours || !project || !description) {
      setError(t.errorFields);
      return;
    }
    if (hours < 1 || hours > 12) {
      setError(t.errorHours);
      return;
    }

    const newEntry = {
      id: Date.now(),
      userId: user.id,
      date,
      hours: Number(hours),
      project,
      description,
      status: "pending",
    };

    const saved = localStorage.getItem("pontaj_entries");
    const entries = saved ? JSON.parse(saved) : [];
    entries.push(newEntry);
    localStorage.setItem("pontaj_entries", JSON.stringify(entries));
    if (onSaved) onSaved();

    setDate("");
    setHours("");
    setProject("");
    setDescription("");
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "2px solid var(--border)",
  marginTop: "6px",
  fontSize: "15px",
  outline: "none",
  fontFamily: "'Segoe UI', sans-serif",
  boxSizing: "border-box",
  background: "var(--input-bg)",
  color: "var(--text-primary)",
};

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
    display: "block",
  };

  return (
    <div style={{
      padding: isMobile ? "16px 12px" : "24px",
      paddingBottom: isMobile ? "100px" : "24px",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f5f6fa",
      minHeight: "100vh",
      boxSizing: "border-box",
    }}>
      <h2 style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "700", marginBottom: "24px" }}>
        ➕ {t.title}
      </h2>

      <div style={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        padding: isMobile ? "20px" : "32px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        boxSizing: "border-box",
      }}>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>{t.date}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>{t.hours}</label>
          <input
            type="number"
            min="1"
            max="12"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder={t.placeholderHours}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>{t.project}</label>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            style={inputStyle}
          >
            <option value="">{t.selectProject}</option>
            {PROJECTS.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>{t.description}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.placeholderDescription}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
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

        {success && (
          <div style={{
            background: "#f0fff4",
            color: "#48bb78",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "14px",
          }}>
            ✅ {t.success}
          </div>
        )}

        <button
          onClick={handleSave}
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

      </div>
    </div>
  );
}

export default AddHours;