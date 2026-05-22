import { useState, useEffect } from "react";

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [datesConfig, setDatesConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [slotCount, setSlotCount] = useState(1);
  const [showSlotPicker, setShowSlotPicker] = useState(false);

  const login = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); setError(""); loadDates(); }
    else setError("Mot de passe incorrect");
  };

  const loadDates = async () => {
    const res = await fetch("/api/blocked-dates");
    const data = await res.json();
    const config = {};
    (data.dates || []).forEach(d => {
      config[d.date] = { blocked: d.slots === 0, slots: d.slots ?? 0, reason: d.reason };
    });
    setDatesConfig(config);
  };

  const saveDate = async (date, slots) => {
    setLoading(true);
    await fetch("/api/admin-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json", password },
      body: JSON.stringify({ date, slots, reason: slots === 0 ? "Complet" : "" }),
    });
    await loadDates();
    setLoading(false);
    setMsg("Sauvegardé ✓");
    setTimeout(() => setMsg(""), 2000);
  };

  const unblockDate = async (date) => {
    await fetch("/api/admin-dates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", password },
      body: JSON.stringify({ date }),
    });
    await loadDates();
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const formatDate = (year, month, day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const today = new Date();
  today.setHours(0,0,0,0);

  const handleDayClick = (dateStr, isPast) => {
    if (isPast) return;
    setSelectedDay(dateStr);
    const existing = datesConfig[dateStr];
    setSlotCount(existing ? existing.slots : 3);
    setShowSlotPicker(true);
  };

  const handleSaveSlots = async () => {
    if (!selectedDay) return;
    if (slotCount === 0) {
      await saveDate(selectedDay, 0);
    } else {
      const existing = datesConfig[selectedDay];
      if (existing) {
        await saveDate(selectedDay, slotCount);
      } else {
        await saveDate(selectedDay, slotCount);
      }
    }
    setShowSlotPicker(false);
    setSelectedDay(null);
  };

  const handleUnblock = async () => {
    if (!selectedDay) return;
    await unblockDate(selectedDay);
    setShowSlotPicker(false);
    setSelectedDay(null);
  };

  const getDayStatus = (dateStr) => {
    const cfg = datesConfig[dateStr];
    if (!cfg) return "available";
    if (cfg.slots === 0) return "blocked";
    return "limited";
  };

  const getDayColor = (dateStr, isPast) => {
    if (isPast) return { bg: "#f0ece8", color: "#c0b8b0", border: "#e8e0d8" };
    const status = getDayStatus(dateStr);
    if (status === "blocked") return { bg: "#fde8e8", color: "#c03030", border: "#f0b0b0" };
    if (status === "limited") return { bg: "#fef9e7", color: "#b07020", border: "#f0d070" };
    return { bg: "#fff", color: "#2a1810", border: "#ede5de" };
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const blockedList = Object.entries(datesConfig)
    .filter(([,v]) => v.slots === 0)
    .sort(([a],[b]) => a.localeCompare(b));

  const limitedList = Object.entries(datesConfig)
    .filter(([,v]) => v.slots > 0)
    .sort(([a],[b]) => a.localeCompare(b));

  if (!authed) {
    return (
      <div style={S.page}>
        <div style={S.loginCard}>
          <div style={S.logo}>🎂</div>
          <div style={S.title}>Espace Admin</div>
          <div style={S.sub}>Mon Joli Dessert</div>
          <input style={S.input} type="password" placeholder="Mot de passe"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()} />
          {error && <div style={S.error}>{error}</div>}
          <button style={S.btn} onClick={login}>Connexion →</button>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.headerTitle}>🎂 Admin — Mon Joli Dessert</div>
        <button style={S.logoutBtn} onClick={() => setAuthed(false)}>Déconnexion</button>
      </div>

      <div style={S.container}>

        {/* Légende */}
        <div style={S.legend}>
          <div style={S.legendItem}><div style={{...S.legendDot, background:"#fff", border:"1.5px solid #ede5de"}}/> Disponible</div>
          <div style={S.legendItem}><div style={{...S.legendDot, background:"#fef9e7", border:"1.5px solid #f0d070"}}/> Limité</div>
          <div style={S.legendItem}><div style={{...S.legendDot, background:"#fde8e8", border:"1.5px solid #f0b0b0"}}/> Bloqué</div>
          <div style={S.legendItem}><div style={{...S.legendDot, background:"#f0ece8", border:"1.5px solid #e8e0d8"}}/> Passé</div>
        </div>

        {/* Calendrier */}
        <div style={S.card}>
          {/* Nav mois */}
          <div style={S.calNav}>
            <button style={S.navBtn} onClick={prevMonth}>←</button>
            <div style={S.calTitle}>{MONTHS[currentMonth]} {currentYear}</div>
            <button style={S.navBtn} onClick={nextMonth}>→</button>
          </div>

          {/* Jours de la semaine */}
          <div style={S.calGrid}>
            {DAYS.map(d => (
              <div key={d} style={S.dayHeader}>{d}</div>
            ))}

            {/* Cases vides */}
            {Array.from({length: firstDay}).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Jours */}
            {Array.from({length: daysInMonth}).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(currentYear, currentMonth, day);
              const dateObj = new Date(currentYear, currentMonth, day);
              const isPast = dateObj < today;
              const colors = getDayColor(dateStr, isPast);
              const cfg = datesConfig[dateStr];
              const status = getDayStatus(dateStr);

              return (
                <div key={day} onClick={() => handleDayClick(dateStr, isPast)} style={{
                  ...S.dayCell,
                  background: colors.bg,
                  border: `1.5px solid ${colors.border}`,
                  color: colors.color,
                  cursor: isPast ? "default" : "pointer",
                  opacity: isPast ? 0.6 : 1,
                }}>
                  <div style={{fontSize:14, fontWeight:600}}>{day}</div>
                  {!isPast && status === "limited" && (
                    <div style={{fontSize:10, color:"#b07020"}}>
                      {cfg.slots} dispo
                    </div>
                  )}
                  {!isPast && status === "blocked" && (
                    <div style={{fontSize:10, color:"#c03030"}}>Bloqué</div>
                  )}
                </div>
              );
            })}
          </div>

          {msg && <div style={S.success}>{msg}</div>}
        </div>

        {/* Popup sélection slots */}
        {showSlotPicker && selectedDay && (
          <div style={S.overlay}>
            <div style={S.popup}>
              <div style={S.popupTitle}>
                {new Date(selectedDay + "T12:00:00").toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"})}
              </div>
              <div style={S.popupSub}>Combien de commandes acceptes-tu ce jour ?</div>

              <div style={S.slotBtns}>
                {[0,1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setSlotCount(n)} style={{
                    ...S.slotBtn,
                    background: slotCount === n ? "#2a1810" : "#faf8f5",
                    color: slotCount === n ? "#fff" : "#2a1810",
                    border: slotCount === n ? "1.5px solid #2a1810" : "1.5px solid #ede5de",
                  }}>
                    {n === 0 ? "🚫 Bloqué" : `${n} commande${n > 1 ? "s" : ""}`}
                  </button>
                ))}
              </div>

              <div style={{display:"flex", gap:10, marginTop:20}}>
                <button style={S.btnSec} onClick={() => { setShowSlotPicker(false); setSelectedDay(null); }}>
                  Annuler
                </button>
                {datesConfig[selectedDay] && (
                  <button style={S.btnDanger} onClick={handleUnblock}>
                    Remettre dispo
                  </button>
                )}
                <button style={{...S.btn, flex:1}} onClick={handleSaveSlots} disabled={loading}>
                  {loading ? "..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Résumé */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
          <div style={S.card}>
            <div style={S.cardTitle}>🚫 Dates bloquées ({blockedList.length})</div>
            {blockedList.length === 0
              ? <p style={S.hint}>Aucune</p>
              : blockedList.map(([date]) => (
                <div key={date} style={S.dateRow}>
                  <div style={S.dateText}>
                    {new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {day:"numeric", month:"short"})}
                  </div>
                  <button style={S.unblockBtn} onClick={() => unblockDate(date)}>✕</button>
                </div>
              ))
            }
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>⚠️ Dates limitées ({limitedList.length})</div>
            {limitedList.length === 0
              ? <p style={S.hint}>Aucune</p>
              : limitedList.map(([date, cfg]) => (
                <div key={date} style={S.dateRow}>
                  <div style={S.dateText}>
                    {new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {day:"numeric", month:"short"})}
                    <span style={{color:"#b07020", marginLeft:8}}>{cfg.slots} dispo</span>
                  </div>
                  <button style={S.unblockBtn} onClick={() => unblockDate(date)}>✕</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:"100vh", background:"#faf8f5", fontFamily:"Georgia, serif", display:"flex", flexDirection:"column" },
  loginCard: { background:"#fff", border:"1px solid #ede5de", borderRadius:8, padding:"48px 40px", maxWidth:380, width:"100%", margin:"80px auto", textAlign:"center", boxShadow:"0 2px 20px rgba(0,0,0,0.06)" },
  logo: { fontSize:48, marginBottom:16 },
  title: { fontFamily:"'Palatino Linotype', serif", fontSize:24, color:"#2a1810", marginBottom:4 },
  sub: { fontSize:13, color:"#9a8880", marginBottom:24 },
  input: { width:"100%", border:"1.5px solid #ede5de", borderRadius:4, padding:"10px 13px", fontSize:14, fontFamily:"Georgia, serif", background:"#faf8f5", color:"#2a2020", outline:"none", boxSizing:"border-box", marginBottom:12 },
  error: { color:"#c9376a", fontSize:13, marginBottom:12 },
  success: { color:"#2a8040", fontSize:13, marginTop:12, padding:"8px 12px", background:"#f0fdf4", borderRadius:4, border:"1px solid #b0e0c0", textAlign:"center" },
  btn: { background:"#2a1810", color:"#fff", border:"none", borderRadius:4, padding:"12px 24px", fontSize:14, fontFamily:"Georgia, serif", cursor:"pointer", width:"100%" },
  btnSec: { background:"transparent", color:"#6a5f5a", border:"1.5px solid #e0d8d0", borderRadius:4, padding:"12px 20px", fontSize:14, fontFamily:"Georgia, serif", cursor:"pointer" },
  btnDanger: { background:"transparent", color:"#c03030", border:"1.5px solid #f0b0b0", borderRadius:4, padding:"12px 20px", fontSize:14, fontFamily:"Georgia, serif", cursor:"pointer" },
  header: { width:"100%", background:"#2a1810", padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  headerTitle: { color:"#f5ede8", fontSize:16, fontFamily:"'Palatino Linotype', serif" },
  logoutBtn: { background:"transparent", color:"#c9736a", border:"1px solid #c9736a", borderRadius:4, padding:"6px 16px", fontSize:13, cursor:"pointer", fontFamily:"inherit" },
  container: { maxWidth:800, width:"100%", padding:"24px 20px", display:"flex", flexDirection:"column", gap:20, margin:"0 auto" },
  legend: { display:"flex", gap:16, flexWrap:"wrap" },
  legendItem: { display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#6a5f5a" },
  legendDot: { width:16, height:16, borderRadius:4 },
  card: { background:"#fff", border:"1px solid #ede5de", borderRadius:8, padding:"24px", boxShadow:"0 1px 8px rgba(0,0,0,0.04)" },
  calNav: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 },
  calTitle: { fontFamily:"'Palatino Linotype', serif", fontSize:20, color:"#2a1810", fontWeight:400 },
  navBtn: { background:"none", border:"1.5px solid #ede5de", borderRadius:4, padding:"6px 14px", cursor:"pointer", fontSize:16, color:"#c9736a", fontFamily:"inherit" },
  calGrid: { display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:6 },
  dayHeader: { textAlign:"center", fontSize:11, color:"#9a8880", fontWeight:600, letterSpacing:"0.05em", padding:"4px 0" },
  dayCell: { borderRadius:6, padding:"8px 4px", textAlign:"center", cursor:"pointer", transition:"all 0.15s", minHeight:52, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 },
  cardTitle: { fontSize:15, fontWeight:600, color:"#2a1810", marginBottom:12 },
  hint: { fontSize:13, color:"#9a8880" },
  dateRow: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background:"#faf8f5", border:"1px solid #ede5de", borderRadius:6, marginBottom:6 },
  dateText: { fontSize:13, color:"#2a1810" },
  unblockBtn: { background:"transparent", color:"#c03030", border:"none", cursor:"pointer", fontSize:16, padding:"0 4px" },
  overlay: { position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 },
  popup: { background:"#fff", borderRadius:8, padding:"32px", maxWidth:380, width:"90%", boxShadow:"0 8px 40px rgba(0,0,0,0.15)" },
  popupTitle: { fontFamily:"'Palatino Linotype', serif", fontSize:18, color:"#2a1810", marginBottom:6, textTransform:"capitalize" },
  popupSub: { fontSize:13, color:"#9a8880", marginBottom:20 },
  slotBtns: { display:"flex", flexDirection:"column", gap:8 },
  slotBtn: { padding:"10px 16px", borderRadius:6, cursor:"pointer", fontSize:14, fontFamily:"Georgia, serif", textAlign:"left", transition:"all 0.15s" },
};
