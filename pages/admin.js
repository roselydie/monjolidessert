import { useState, useEffect } from "react";
 
export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
 
  const login = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setError("");
      loadDates();
    } else {
      setError("Mot de passe incorrect");
    }
  };
 
  const loadDates = async () => {
    const res = await fetch("/api/blocked-dates");
    const data = await res.json();
    setBlockedDates(data.dates || []);
  };
 
  const blockDate = async () => {
    if (!selectedDate) return;
    setLoading(true);
    await fetch("/api/admin-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json", password },
      body: JSON.stringify({ date: selectedDate, reason }),
    });
    setMsg("Date bloquée ✓");
    setSelectedDate("");
    setReason("");
    loadDates();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };
 
  const unblockDate = async (date) => {
    await fetch("/api/admin-dates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", password },
      body: JSON.stringify({ date }),
    });
    loadDates();
  };
 
  if (!authed) {
    return (
      <div style={S.page}>
        <div style={S.loginCard}>
          <div style={S.logo}>🎂</div>
          <div style={S.title}>Espace Admin</div>
          <div style={S.sub}>Mon Joli Dessert</div>
          <input
            style={S.input}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          {error && <div style={S.error}>{error}</div>}
          <button style={S.btn} onClick={login}>
            Connexion →
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.headerTitle}>🎂 Admin — Mon Joli Dessert</div>
        <button style={S.logoutBtn} onClick={() => setAuthed(false)}>
          Déconnexion
        </button>
      </div>
 
      <div style={S.container}>
        {/* Bloquer une date */}
        <div style={S.card}>
          <div style={S.cardTitle}>🚫 Bloquer une date</div>
          <p style={S.hint}>
            Les dates bloquées n'apparaîtront pas comme disponibles pour les
            clientes.
          </p>
          <div style={S.row}>
            <input
              type="date"
              style={S.input}
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              style={S.input}
              placeholder="Raison (optionnel)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button style={S.btn} onClick={blockDate} disabled={loading}>
              {loading ? "..." : "Bloquer"}
            </button>
          </div>
          {msg && <div style={S.success}>{msg}</div>}
        </div>
 
        {/* Dates bloquées */}
        <div style={S.card}>
          <div style={S.cardTitle}>
            📅 Dates bloquées ({blockedDates.length})
          </div>
          {blockedDates.length === 0 ? (
            <p style={S.hint}>Aucune date bloquée pour le moment.</p>
          ) : (
            <div style={S.dateList}>
              {blockedDates.map((d) => (
                <div key={d.date} style={S.dateRow}>
                  <div>
                    <div style={S.dateText}>
                      {new Date(d.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {d.reason && (
                      <div style={S.dateReason}>{d.reason}</div>
                    )}
                  </div>
                  <button
                    style={S.unblockBtn}
                    onClick={() => unblockDate(d.date)}
                  >
                    Débloquer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
const S = {
  page: {
    minHeight: "100vh",
    background: "#faf8f5",
    fontFamily: "Georgia, serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  loginCard: {
    background: "#fff",
    border: "1px solid #ede5de",
    borderRadius: 8,
    padding: "48px 40px",
    maxWidth: 380,
    width: "100%",
    margin: "80px auto",
    textAlign: "center",
    boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
  },
  logo: { fontSize: 48, marginBottom: 16 },
  title: {
    fontFamily: "'Palatino Linotype', serif",
    fontSize: 24,
    color: "#2a1810",
    marginBottom: 4,
  },
  sub: { fontSize: 13, color: "#9a8880", marginBottom: 24 },
  input: {
    width: "100%",
    border: "1.5px solid #ede5de",
    borderRadius: 4,
    padding: "10px 13px",
    fontSize: 14,
    fontFamily: "Georgia, serif",
    background: "#faf8f5",
    color: "#2a2020",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 12,
  },
  error: {
    color: "#c9376a",
    fontSize: 13,
    marginBottom: 12,
  },
  success: {
    color: "#2a8040",
    fontSize: 13,
    marginTop: 8,
    padding: "8px 12px",
    background: "#f0fdf4",
    borderRadius: 4,
    border: "1px solid #b0e0c0",
  },
  btn: {
    background: "#2a1810",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "12px 24px",
    fontSize: 14,
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    width: "100%",
  },
  header: {
    width: "100%",
    background: "#2a1810",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#f5ede8",
    fontSize: 16,
    fontFamily: "'Palatino Linotype', serif",
  },
  logoutBtn: {
    background: "transparent",
    color: "#c9736a",
    border: "1px solid #c9736a",
    borderRadius: 4,
    padding: "6px 16px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  container: {
    maxWidth: 700,
    width: "100%",
    padding: "32px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  card: {
    background: "#fff",
    border: "1px solid #ede5de",
    borderRadius: 8,
    padding: "28px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#2a1810",
    marginBottom: 8,
  },
  hint: { fontSize: 13, color: "#9a8880", marginBottom: 16 },
  row: { display: "flex", flexDirection: "column", gap: 10 },
  dateList: { display: "flex", flexDirection: "column", gap: 10 },
  dateRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "#fdf8f4",
    border: "1px solid #ede5de",
    borderRadius: 6,
  },
  dateText: { fontSize: 14, color: "#2a1810", fontWeight: 500 },
  dateReason: { fontSize: 12, color: "#9a8880", marginTop: 2 },
  unblockBtn: {
    background: "transparent",
    color: "#c9736a",
    border: "1px solid #c9736a",
    borderRadius: 4,
    padding: "6px 14px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
};