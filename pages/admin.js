import { useState, useEffect } from "react";

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, onLogout }) {
  const [open, setOpen] = useState(true);
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: "📊" },
    { id: "calendar", label: "Calendrier", icon: "📅" },
    { id: "orders", label: "Prochaines commandes", icon: "🎂" },
    { id: "divider" },
    { id: "settings", label: "Paramètres de la page", icon: "⚙️" },
    { id: "catalog", label: "Carte des desserts", icon: "🍰" },
    { id: "loyalty", label: "Avantage fidélité", icon: "💝" },
    { id: "reviews", label: "Retour client", icon: "⭐" },
    { id: "social", label: "Nos réseaux sociaux", icon: "📸" },
    { id: "faq", label: "Foire aux informations", icon: "❓" },
  ];

  return (
    <div style={{
      width: open ? 220 : 56, minHeight: "100vh", background: "#b8ac9e",
      display: "flex", flexDirection: "column", transition: "width 0.25s",
      flexShrink: 0, position: "relative", zIndex: 10,
    }}>
      <div style={{ padding: "18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {open && <span style={{ fontSize: 13, fontWeight: 600, color: "#3a2e28", letterSpacing: "0.1em" }}>Paramètre</span>}
        <button onClick={() => setOpen(!open)} style={{
          background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#3a2e28", padding: 0
        }}>☰</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {menuItems.map((item, i) => {
          if (item.id === "divider") return <div key={i} style={{ height: 1, background: "rgba(0,0,0,0.1)", margin: "8px 0" }} />;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: open ? "9px 16px" : "9px 0", justifyContent: open ? "flex-start" : "center",
              background: page === item.id ? "rgba(0,0,0,0.15)" : "none",
              border: "none", cursor: "pointer", color: "#3a2e28",
              fontSize: 13, fontFamily: "Georgia, serif", textAlign: "left",
              borderLeft: page === item.id ? "3px solid #3a2e28" : "3px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {open && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      <button onClick={onLogout} style={{
        background: "none", border: "none", cursor: "pointer", color: "#3a2e28",
        padding: "12px 16px", fontSize: 12, fontFamily: "Georgia, serif",
        display: "flex", alignItems: "center", gap: 8,
        borderTop: "1px solid rgba(0,0,0,0.1)",
      }}>
        {open ? "← Déconnexion" : "←"}
      </button>
    </div>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────────
function Header({ subtitle }) {
  return (
    <div style={{
      background: "#b8ac9e", padding: "24px 32px 20px",
      display: "flex", alignItems: "center", gap: 24,
    }}>
      <div style={{
        width: 120, height: 120, background: "#d4c8bc",
        borderRadius: 4, overflow: "hidden", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 48,
      }}>🎂</div>
      <div>
        <div style={{
          fontFamily: "'Palatino Linotype', serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          color: "#fff", fontWeight: 400, letterSpacing: "0.05em",
          lineHeight: 1, marginBottom: 6,
          textShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>Mon Joli Dessert</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", letterSpacing: "0.05em" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({ orders }) {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthOrders = orders.filter(o => {
    const d = new Date(o.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const revenue = monthOrders.reduce((sum, o) => sum + (parseInt(o.price) || 0), 0);
  const pending = orders.filter(o => !o.treated).length;

  return (
    <div style={S.content}>
      <div style={S.pageTitle}>Tableau de bord</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Commandes ce mois", value: monthOrders.length, icon: "🎂", color: "#c9736a" },
          { label: "Chiffre du mois", value: `${revenue}€`, icon: "💰", color: "#2a8040" },
          { label: "Non traitées", value: pending, icon: "⏳", color: "#b07020" },
          { label: "Avis en attente", value: 0, icon: "⭐", color: "#6060c0" },
        ].map(stat => (
          <div key={stat.label} style={S.statCard}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#9a8880" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>📋 Commandes non traitées</div>
        {orders.filter(o => !o.treated).length === 0
          ? <p style={S.hint}>Aucune commande en attente 🎉</p>
          : orders.filter(o => !o.treated).map((o, i) => (
            <div key={i} style={S.orderRow}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{o.name} — {o.product}</div>
                <div style={{ fontSize: 12, color: "#9a8880" }}>{o.date} · {o.pickup}</div>
              </div>
              <div style={{ color: "#c9736a", fontWeight: 700 }}>{o.price}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── Calendar ───────────────────────────────────────────────────────────────────
function CalendarPage({ password }) {
  const [datesConfig, setDatesConfig] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDays, setSelectedDays] = useState([]);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [slotCount, setSlotCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { loadDates(); }, []);

  const loadDates = async () => {
    const res = await fetch("/api/blocked-dates");
    const data = await res.json();
    const config = {};
    (data.dates || []).forEach(d => { config[d.date] = { slots: d.slots ?? 0, reason: d.reason }; });
    setDatesConfig(config);
  };

  const applyToSelected = async () => {
    if (!selectedDays.length) return;
    setLoading(true);
    for (const date of selectedDays) {
      if (slotCount === -1) {
        await fetch("/api/admin-dates", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", password },
          body: JSON.stringify({ date }),
        });
      } else {
        await fetch("/api/admin-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json", password },
          body: JSON.stringify({ date, slots: slotCount, reason: slotCount === 0 ? "Bloqué" : `${slotCount} commandes max` }),
        });
      }
    }
    await loadDates();
    setSelectedDays([]);
    setShowSlotPicker(false);
    setLoading(false);
    setMsg(`✓ ${selectedDays.length} jour${selectedDays.length > 1 ? "s" : ""} mis à jour`);
    setTimeout(() => setMsg(""), 3000);
  };

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };
  const fmt = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const toggle = (ds, past) => {
    if (past) return;
    setSelectedDays(p => p.includes(ds) ? p.filter(x => x !== ds) : [...p, ds]);
  };

  const selectAll = () => {
    const days = [];
    for (let d = 1; d <= getDaysInMonth(currentMonth, currentYear); d++) {
      const ds = fmt(currentYear, currentMonth, d);
      if (new Date(currentYear, currentMonth, d) >= today) days.push(ds);
    }
    setSelectedDays(days);
  };

  const getDayStyle = (ds, past, selected) => {
    if (selected) return { bg: "#3a2e28", color: "#fff", border: "#3a2e28" };
    if (past) return { bg: "#ece8e4", color: "#c0b8b0", border: "#e0d8d0" };
    const cfg = datesConfig[ds];
    if (!cfg) return { bg: "#fff", color: "#2a1810", border: "#ddd" };
    if (cfg.slots === 0) return { bg: "#fde8e8", color: "#c03030", border: "#f0b0b0" };
    return { bg: "#fef9e7", color: "#b07020", border: "#f0d070" };
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDay(currentMonth, currentYear);

  return (
    <div style={S.content}>
      <div style={S.pageTitle}>Calendrier des disponibilités</div>
      <p style={S.pageDesc}>
        Sélectionne un ou plusieurs jours puis définis le nombre de commandes autorisées. Les dates bloquées apparaissent grisées côté clients.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button style={S.quickBtn} onClick={selectAll}>Tout sélectionner ce mois</button>
        {selectedDays.length > 0 && <button style={S.quickBtn} onClick={() => setSelectedDays([])}>Désélectionner ({selectedDays.length})</button>}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button style={S.navBtn} onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }}>←</button>
          <div style={{ fontFamily: "'Palatino Linotype', serif", fontSize: 20, color: "#2a1810" }}>{MONTHS[currentMonth]} {currentYear}</div>
          <button style={S.navBtn} onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }}>→</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#9a8880", fontWeight: 600, padding: "4px 0" }}>{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const ds = fmt(currentYear, currentMonth, day);
            const past = new Date(currentYear, currentMonth, day) < today;
            const sel = selectedDays.includes(ds);
            const colors = getDayStyle(ds, past, sel);
            const cfg = datesConfig[ds];

            return (
              <div key={day} onClick={() => toggle(ds, past)} style={{
                borderRadius: 6, padding: "6px 4px", textAlign: "center",
                background: colors.bg, border: `1.5px solid ${colors.border}`,
                color: colors.color, cursor: past ? "default" : "pointer",
                opacity: past ? 0.5 : 1, minHeight: 48,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                transition: "all 0.12s", transform: sel ? "scale(0.94)" : "scale(1)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{day}</div>
                {!past && cfg && cfg.slots > 0 && !sel && <div style={{ fontSize: 9, color: "#b07020" }}>{cfg.slots}max</div>}
                {!past && cfg && cfg.slots === 0 && !sel && <div style={{ fontSize: 9 }}>✕</div>}
                {sel && <div style={{ fontSize: 9, color: "#c9736a" }}>✓</div>}
              </div>
            );
          })}
        </div>

        {selectedDays.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, padding: "12px 16px", background: "#fdf0ee", border: "1px solid #f0c8b8", borderRadius: 6 }}>
            <div style={{ fontSize: 13, color: "#6a5f5a" }}><strong>{selectedDays.length}</strong> jour{selectedDays.length > 1 ? "s" : ""} sélectionné{selectedDays.length > 1 ? "s" : ""}</div>
            <button onClick={() => setShowSlotPicker(true)} style={{ background: "#c9736a", color: "#fff", border: "none", borderRadius: 4, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
              Définir les dispo →
            </button>
          </div>
        )}

        {msg && <div style={{ ...S.success, marginTop: 12 }}>{msg}</div>}
      </div>

      {/* Légende */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
        {[
          { color: "#fff", border: "#ddd", label: "Disponible" },
          { color: "#fef9e7", border: "#f0d070", label: "Limité" },
          { color: "#fde8e8", border: "#f0b0b0", label: "Bloqué" },
          { color: "#ece8e4", border: "#e0d8d0", label: "Passé" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6a5f5a" }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: l.color, border: `1.5px solid ${l.border}` }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Slot picker popup */}
      {showSlotPicker && (
        <div style={S.overlay}>
          <div style={S.popup}>
            <div style={S.popupTitle}>Disponibilités pour {selectedDays.length} jour{selectedDays.length > 1 ? "s" : ""}</div>
            <div style={{ fontSize: 13, color: "#9a8880", marginBottom: 20 }}>Combien de commandes max par jour ?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <button key={n} onClick={() => setSlotCount(n)} style={{
                  padding: "10px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13,
                  fontFamily: "Georgia, serif", textAlign: "center", transition: "all 0.15s",
                  background: slotCount === n ? "#3a2e28" : "#faf8f5",
                  color: slotCount === n ? "#fff" : "#2a1810",
                  border: slotCount === n ? "1.5px solid #3a2e28" : "1.5px solid #ede5de",
                }}>
                  {n === 0 ? "🚫 Bloqué" : `${n} commande${n > 1 ? "s" : ""}`}
                </button>
              ))}
              <button onClick={() => setSlotCount(-1)} style={{
                padding: "10px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13,
                fontFamily: "Georgia, serif", textAlign: "center", gridColumn: "1 / -1",
                background: slotCount === -1 ? "#20a060" : "#faf8f5",
                color: slotCount === -1 ? "#fff" : "#20a060",
                border: slotCount === -1 ? "1.5px solid #20a060" : "1.5px solid #b0e0c0",
              }}>
                ✓ Remettre disponible (sans limite)
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={S.btnSec} onClick={() => setShowSlotPicker(false)}>Annuler</button>
              <button style={{ ...S.btn, flex: 1 }} onClick={applyToSelected} disabled={loading}>
                {loading ? "En cours..." : `Appliquer aux ${selectedDays.length} jours`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Orders ─────────────────────────────────────────────────────────────────────
function OrdersPage({ orders }) {
  const upcoming = orders.filter(o => new Date(o.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={S.content}>
      <div style={S.pageTitle}>Prochaines commandes</div>
      {upcoming.length === 0
        ? <div style={S.card}><p style={S.hint}>Aucune commande à venir.</p></div>
        : upcoming.map((o, i) => (
          <div key={i} style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#2a1810", marginBottom: 4 }}>{o.name}</div>
                <div style={{ fontSize: 13, color: "#6a5f5a" }}>{o.product} {o.form ? `· ${o.form}` : ""}</div>
                <div style={{ fontSize: 12, color: "#9a8880", marginTop: 4 }}>{o.date} · {o.pickup === "retrait" ? "🏪 Retrait" : "🚗 Livraison"}</div>
                {o.message && <div style={{ fontSize: 12, color: "#c9736a", marginTop: 4, fontStyle: "italic" }}>"{o.message}"</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#c9736a" }}>{o.price}</div>
                <div style={{ fontSize: 11, color: "#9a8880", marginTop: 4 }}>{o.email}</div>
                {o.phone && <div style={{ fontSize: 11, color: "#9a8880" }}>{o.phone}</div>}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────────
function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Mon Joli Dessert",
    tagline: "Parce que chaque dessert est unique",
    instagram: "@monjolidessert",
    phone: "",
    address: "",
    about: "",
  });
  const [msg, setMsg] = useState("");

  const save = () => {
    localStorage.setItem("siteSettings", JSON.stringify(settings));
    setMsg("✓ Paramètres sauvegardés");
    setTimeout(() => setMsg(""), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem("siteSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  return (
    <div style={S.content}>
      <div style={S.pageTitle}>Paramètres de la page</div>
      <div style={S.card}>
        <div style={S.cardTitle}>✏️ Informations générales</div>
        {[
          { key: "siteName", label: "Nom du site" },
          { key: "tagline", label: "Slogan" },
          { key: "instagram", label: "Instagram" },
          { key: "phone", label: "Téléphone" },
          { key: "address", label: "Adresse" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <div style={S.label}>{f.label}</div>
            <input style={S.input} value={settings[f.key]} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <div style={S.label}>À propos</div>
          <textarea style={{ ...S.input, minHeight: 80, resize: "vertical" }} value={settings.about}
            onChange={e => setSettings(p => ({ ...p, about: e.target.value }))} />
        </div>
        <button style={S.btn} onClick={save}>Sauvegarder</button>
        {msg && <div style={{ ...S.success, marginTop: 10 }}>{msg}</div>}
      </div>
    </div>
  );
}

// ── Coming Soon ────────────────────────────────────────────────────────────────
function ComingSoon({ title }) {
  return (
    <div style={S.content}>
      <div style={S.pageTitle}>{title}</div>
      <div style={{ ...S.card, textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
        <div style={{ fontSize: 18, color: "#9a8880", fontFamily: "'Palatino Linotype', serif" }}>
          Cette section arrive bientôt !
        </div>
      </div>
    </div>
  );
}

// ── Main Admin ─────────────────────────────────────────────────────────────────
export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState("dashboard");
  const [orders] = useState([]);
  const [showPwd, setShowPwd] = useState(false);

  const login = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); setError(""); }
    else setError("Mot de passe incorrect ❌");
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#c8bfb4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: "48px 40px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 4px 32px rgba(0,0,0,0.12)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎂</div>
          <div style={{ fontFamily: "'Palatino Linotype', serif", fontSize: 26, color: "#2a1810", marginBottom: 4 }}>Mon Joli Dessert</div>
          <div style={{ fontSize: 13, color: "#9a8880", marginBottom: 28 }}>Espace Administrateur</div>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...S.input, paddingRight: 40 }}
              type={showPwd ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
            />
            <button onClick={() => setShowPwd(!showPwd)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-60%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9a8880",
            }}>{showPwd ? "🙈" : "👁"}</button>
          </div>
          {error && <div style={S.error}>{error}</div>}
          <button style={S.btn} onClick={login}>Connexion →</button>
        </div>
      </div>
    );
  }

  const subtitles = {
    dashboard: "côté administrateur", calendar: "côté administrateur",
    orders: "côté administrateur", settings: "côté administrateur",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0eb", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
      <Header subtitle="côté administrateur" />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar page={page} setPage={setPage} onLogout={() => setAuthed(false)} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {page === "dashboard" && <Dashboard orders={orders} />}
          {page === "calendar" && <CalendarPage password={password} />}
          {page === "orders" && <OrdersPage orders={orders} />}
          {page === "settings" && <SettingsPage />}
          {page === "catalog" && <ComingSoon title="Carte des desserts" />}
          {page === "loyalty" && <ComingSoon title="Avantage fidélité" />}
          {page === "reviews" && <ComingSoon title="Retour client" />}
          {page === "social" && <ComingSoon title="Nos réseaux sociaux" />}
          {page === "faq" && <ComingSoon title="Foire aux informations" />}
        </div>
      </div>
    </div>
  );
}

const S = {
  content: { padding: "28px 32px", maxWidth: 900 },
  pageTitle: { fontFamily: "'Palatino Linotype', serif", fontSize: 26, color: "#2a1810", marginBottom: 6, fontWeight: 400 },
  pageDesc: { fontSize: 14, color: "#6a5f5a", marginBottom: 20, lineHeight: 1.6 },
  card: { background: "#fff", border: "1px solid #e8e0d8", borderRadius: 8, padding: "22px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#2a1810", marginBottom: 14 },
  statCard: { background: "#fff", border: "1px solid #e8e0d8", borderRadius: 8, padding: "20px", textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  hint: { fontSize: 13, color: "#9a8880", margin: 0 },
  label: { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a8880", fontWeight: 600, marginBottom: 6 },
  input: { width: "100%", border: "1.5px solid #e8e0d8", borderRadius: 4, padding: "10px 13px", fontSize: 14, fontFamily: "Georgia, serif", background: "#faf8f5", color: "#2a2020", outline: "none", boxSizing: "border-box", marginBottom: 0 },
  btn: { background: "#3a2e28", color: "#fff", border: "none", borderRadius: 4, padding: "12px 24px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer", width: "100%" },
  btnSec: { background: "transparent", color: "#6a5f5a", border: "1.5px solid #e0d8d0", borderRadius: 4, padding: "12px 20px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" },
  quickBtn: { background: "#faf8f5", border: "1.5px solid #e8e0d8", borderRadius: 4, padding: "7px 14px", cursor: "pointer", fontSize: 12, color: "#6a5f5a", fontFamily: "inherit" },
  navBtn: { background: "none", border: "1.5px solid #e8e0d8", borderRadius: 4, padding: "6px 14px", cursor: "pointer", fontSize: 16, color: "#c9736a", fontFamily: "inherit" },
  error: { color: "#c9376a", fontSize: 13, marginBottom: 12, marginTop: 8 },
  success: { color: "#2a8040", fontSize: 13, padding: "8px 12px", background: "#f0fdf4", borderRadius: 4, border: "1px solid #b0e0c0" },
  orderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0ebe4", gap: 12 },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  popup: { background: "#fff", borderRadius: 8, padding: "32px", maxWidth: 400, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" },
  popupTitle: { fontFamily: "'Palatino Linotype', serif", fontSize: 18, color: "#2a1810", marginBottom: 6 },
};
