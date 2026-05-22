import { useState, useEffect, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const TOPPINGS = ["Kinder","Spéculos","Snickers","M&M's","Oreo","Fraise","Framboise","Mangue"];
const NAPPAGES = ["Coulis de framboise","Coulis de mangue","Crème spéculos","Crème pistache","Nutella","Caramel beurre salé","Crème pâtissière","Crème diplomate"];
const COULEURS_LISSAGE = [
  {name:"Jaune pastel",hex:"#f9e4a0"},{name:"Rose pastel",hex:"#f7b8d0"},
  {name:"Lilas",hex:"#d4b8f7"},{name:"Bleu pastel",hex:"#b8d8f7"},
  {name:"Vert pastel",hex:"#b8f0c8"},{name:"Gris perle",hex:"#d8d8d8"},
  {name:"Blanc",hex:"#ffffff"},{name:"Noir (+2€)",hex:"#1a1a1a",supplement:2},
  {name:"Rouge (+2€)",hex:"#e03030",supplement:2},
];
const COULEURS_DESSIN = [
  {name:"Noir",hex:"#1a1a1a"},{name:"Rouge",hex:"#e03030"},{name:"Bleu",hex:"#3060e0"},
  {name:"Vert",hex:"#20a040"},{name:"Blanc",hex:"#f5f5f5"},{name:"Gris",hex:"#909090"},
  {name:"Jaune",hex:"#f0c020"},{name:"Rose",hex:"#f060a0"},{name:"Lilas",hex:"#a060d0"},
  {name:"Bleu ciel",hex:"#60b0f0"},{name:"Vert anis",hex:"#90d040"},
];
const LAYER_CAKE_SIZES = [
  {id:"s",name:"Layercake S",tagline:"12 parts · en hauteur",basePrice:50,emoji:"✨"},
  {id:"m",name:"Layercake M",tagline:"18 parts · en largeur",basePrice:70,emoji:"👑",decoSurDevis:true},
  {id:"l",name:"Layercake L",tagline:"30 parts",basePrice:90,emoji:"🌸",decoSurDevis:true},
];
const CATALOG = [
  {id:"bentocake",name:"Bentocake",tagline:"2 parts · boîte burger · 11cm",price:"à partir de 15€",basePrice:15,forms:["Cercle","Cœur","Carré"],hasDecoration:true,hasLissage:true,hasDessinColor:true,decorations:[{id:"ecritures",label:"Écritures & motifs simples",price:0,desc:"15€"},{id:"dessins",label:"Dessins simples",price:2,desc:"17€"},{id:"vintage",label:"Pochage effet vintage",price:5,desc:"20€"}],emoji:"🎂"},
  {id:"maxibentocake",name:"Maxi Bentocake",tagline:"4 parts · boîte blanche & transparente",price:"à partir de 22€",basePrice:22,forms:["Cercle","Cœur"],hasDecoration:false,hasLissage:true,hasDessinColor:true,emoji:"🍰"},
  {id:"minicake",name:"Minicake",tagline:"8 parts · boîte blanche & transparente",price:"à partir de 30€",basePrice:30,forms:["Cercle","Cœur"],hasDecoration:false,hasLissage:true,hasDessinColor:true,emoji:"🎀"},
  {id:"layercake",name:"Layer Cake",tagline:"12 à 30 parts · plusieurs tailles",price:"à partir de 50€",basePrice:null,isLayerCake:true,emoji:"✨"},
  {id:"box",name:"Box Gourmande",tagline:"1 Maxi Bentocake + 5 Cupcakes",price:"à partir de 40€",basePrice:40,isBox:true,emoji:"🎁"},
];
const emptyOrder = () => ({form:"",layerSize:"",decoration:"",toppings:[],nappage:"",couleurLissage:"",couleurDessin:"",message:"",decoSupp:false,date:"",pickup:"retrait",photo:null,photoName:"",name:"",email:"",phone:"",instagram:"",boxForm:"",boxToppings:[],boxNappage:"",boxCouleurLissage:"",boxCouleurDessin:"",cupcakeNappages:[],cupcakeToppings:[]});
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

// ─── SESSION ID ───────────────────────────────────────────────────────────────
function getSessionId() {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem("mjd_session");
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now(); sessionStorage.setItem("mjd_session", id); }
  return id;
}

// ─── DATE PICKER CALENDAR ─────────────────────────────────────────────────────
function DatePickerCalendar({ onSelect, onBack, productName }) {
  const [dateStatus, setDateStatus] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    fetch("/api/available-dates")
      .then(r => r.json())
      .then(data => { setDateStatus(data.dateStatus || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };
  const fmt = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const getDayInfo = (ds) => {
    const status = dateStatus[ds];
    if (!status) return { available: true, label: "", color: "#fff", border: "#e8e0d8", textColor: "#2a1810" };
    if (!status.available) return { available: false, label: "Indisponible", color: "#f0ece8", border: "#e0d8d0", textColor: "#b0a898" };
    if (status.remaining <= 2) return { available: true, label: `${status.remaining} place${status.remaining > 1 ? "s" : ""}`, color: "#fef9e7", border: "#f0d070", textColor: "#b07020" };
    return { available: true, label: "", color: "#fff", border: "#e8e0d8", textColor: "#2a1810" };
  };

  const handleDayClick = async (ds, past, available) => {
    if (past || !available) return;
    setReserving(true);
    setError("");
    setSelectedDate(ds);

    try {
      const res = await fetch("/api/reserve-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: ds, sessionId: getSessionId() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Date non disponible");
        setSelectedDate(null);
        setReserving(false);
        return;
      }
      // Démarrer le timer de 10 minutes
      const expiry = new Date(data.expiresAt).getTime();
      setTimer(expiry);
      setReserving(false);
      // Passer à la configuration après 1 seconde
      setTimeout(() => onSelect(ds), 800);
    } catch {
      setError("Erreur de connexion, réessayez.");
      setSelectedDate(null);
      setReserving(false);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDay(currentMonth, currentYear);

  return (
    <div style={CS.page}>
      <div style={CS.header}>
        <button style={CS.backBtn} onClick={onBack}>← Retour</button>
        <div>
          <div style={CS.headerTitle}>📅 Choisissez votre date</div>
          <div style={CS.headerSub}>{productName}</div>
        </div>
        <div style={{width:80}}/>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"24px 16px"}}>
        <div style={{background:"#fdf8f4",border:"1px solid #e8e0d8",borderRadius:8,padding:"14px 16px",marginBottom:20,fontSize:13,color:"#6a5060"}}>
          ⏱️ Une fois votre date sélectionnée, vous aurez <strong>10 minutes</strong> pour finaliser votre commande.
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:48,color:"#9a8880"}}>Chargement des disponibilités…</div>
        ) : (
          <div style={CS.card}>
            {/* Nav mois */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <button style={CS.navBtn} onClick={()=>{if(currentMonth===0){setCurrentMonth(11);setCurrentYear(y=>y-1);}else setCurrentMonth(m=>m-1);}}>←</button>
              <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:20,color:"#2a1810"}}>{MONTHS[currentMonth]} {currentYear}</div>
              <button style={CS.navBtn} onClick={()=>{if(currentMonth===11){setCurrentMonth(0);setCurrentYear(y=>y+1);}else setCurrentMonth(m=>m+1);}}>→</button>
            </div>

            {/* Grille */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
              {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:"#9a8880",fontWeight:600,padding:"4px 0"}}>{d}</div>)}
              {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:daysInMonth}).map((_,i)=>{
                const day=i+1;
                const ds=fmt(currentYear,currentMonth,day);
                const past=new Date(currentYear,currentMonth,day)<today;
                const info=getDayInfo(ds);
                const isSelected=selectedDate===ds;

                return (
                  <div key={day} onClick={()=>handleDayClick(ds,past,info.available)} style={{
                    borderRadius:6,padding:"8px 4px",textAlign:"center",
                    background:isSelected?"#3a2e28":past||!info.available?"#f0ece8":info.color,
                    border:`1.5px solid ${isSelected?"#3a2e28":past||!info.available?"#e0d8d0":info.border}`,
                    color:isSelected?"#fff":past||!info.available?"#b0a898":info.textColor,
                    cursor:past||!info.available?"not-allowed":"pointer",
                    opacity:past?0.5:1,
                    minHeight:52,display:"flex",flexDirection:"column",
                    alignItems:"center",justifyContent:"center",gap:2,
                    transition:"all 0.15s",
                    transform:isSelected?"scale(0.95)":"scale(1)",
                  }}>
                    <div style={{fontSize:13,fontWeight:600}}>{day}</div>
                    {!past&&info.label&&!isSelected&&<div style={{fontSize:9,lineHeight:1}}>{info.label}</div>}
                    {isSelected&&<div style={{fontSize:9,color:"#c9736a"}}>✓</div>}
                    {reserving&&isSelected&&<div style={{fontSize:9}}>…</div>}
                  </div>
                );
              })}
            </div>

            {error&&<div style={{marginTop:12,padding:"10px 14px",background:"#fde8e8",border:"1px solid #f0b0b0",borderRadius:6,fontSize:13,color:"#c03030"}}>{error}</div>}

            {/* Légende */}
            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:16}}>
              {[
                {color:"#fff",border:"#e8e0d8",label:"Disponible"},
                {color:"#fef9e7",border:"#f0d070",label:"Dernières places"},
                {color:"#f0ece8",border:"#e0d8d0",label:"Indisponible"},
              ].map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6a5f5a"}}>
                  <div style={{width:14,height:14,borderRadius:3,background:l.color,border:`1.5px solid ${l.border}`}}/>
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TIMER BANNER ─────────────────────────────────────────────────────────────
function TimerBanner({ expiresAt, onExpired }) {
  const [remaining, setRemaining] = useState(600);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) { clearInterval(interval); onExpired(); }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const min = Math.floor(remaining / 60);
  const sec = String(remaining % 60).padStart(2, "0");
  const urgent = remaining < 120;

  return (
    <div style={{
      background:urgent?"#fde8e8":"#fdf8f4",
      border:`1px solid ${urgent?"#f0b0b0":"#e8e0d8"}`,
      borderRadius:6,padding:"10px 16px",
      display:"flex",alignItems:"center",gap:10,
      fontSize:13,color:urgent?"#c03030":"#6a5060",
      margin:"0 16px 8px",
    }}>
      <span>{urgent?"⚠️":"⏱️"}</span>
      <span>Date réservée — il vous reste <strong>{min}:{sec}</strong> pour finaliser votre commande</span>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({onOrder}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open&&<div onClick={()=>setOpen(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:40}}/>}
      <button onClick={()=>setOpen(!open)} style={{position:"fixed",top:16,left:16,zIndex:60,background:"#b8ac9e",border:"none",borderRadius:4,width:36,height:36,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>☰</button>
      <div style={{position:"fixed",top:0,left:open?0:-240,bottom:0,width:220,background:"#b8ac9e",zIndex:50,transition:"left 0.25s",display:"flex",flexDirection:"column",boxShadow:open?"4px 0 20px rgba(0,0,0,0.15)":"none",overflowY:"auto"}}>
        <div style={{padding:"20px 16px 10px",fontSize:13,fontWeight:600,color:"#3a2e28",letterSpacing:"0.1em",marginTop:8}}>Menu</div>
        {[{label:"🏠 Home",action:null},{label:"🎂 Bentocake",id:"bentocake"},{label:"🍰 Maxi Bentocake",id:"maxibentocake"},{label:"🎀 Minicake",id:"minicake"},{label:"✨ Layer Cake",id:"layercake"},{label:"🎁 Box Gourmande",id:"box"},{label:"💝 Fidélité",action:"loyalty"},{label:"⭐ Avis clients",action:"reviews"},{label:"📸 Instagram",action:"social"}].map((item,i)=>(
          <button key={i} onClick={()=>{
            if(item.id){const p=CATALOG.find(c=>c.id===item.id);if(p){onOrder(p);setOpen(false);}}
            else setOpen(false);
          }} style={{display:"block",width:"100%",padding:"10px 16px",background:"none",border:"none",cursor:"pointer",color:"#3a2e28",fontSize:13,fontFamily:"Georgia,serif",textAlign:"left",borderLeft:"3px solid transparent"}}>
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({onOrder}) {
  return (
    <div style={{background:"linear-gradient(135deg,#c8bfb4 0%,#d4ccc4 50%,#c0b8ae 100%)",minHeight:"100vh",display:"flex",alignItems:"center",padding:"40px 32px 40px 80px",gap:48,flexWrap:"wrap",position:"relative",overflow:"hidden"}}>
      <div style={{width:220,height:260,flexShrink:0,background:"rgba(255,255,255,0.3)",borderRadius:8,border:"1px solid rgba(255,255,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:100,boxShadow:"0 8px 32px rgba(0,0,0,0.1)"}}>🎂</div>
      <div style={{flex:1,minWidth:280}}>
        <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:"clamp(40px,8vw,80px)",color:"#fff",fontWeight:400,letterSpacing:"0.03em",lineHeight:1,marginBottom:16,textShadow:"0 2px 12px rgba(0,0,0,0.15)"}}>Mon Joli Dessert</div>
        <p style={{fontSize:16,color:"rgba(255,255,255,0.9)",marginBottom:32,lineHeight:1.6,maxWidth:480}}>Parce que chaque dessert est unique — des créations personnalisées préparées avec amour pour tous vos événements.</p>
        <nav style={{display:"flex",gap:24,marginBottom:24,flexWrap:"wrap"}}>
          {["Home","About Us","Blog","Contact Us"].map(l=><button key={l} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"rgba(255,255,255,0.85)",fontFamily:"Georgia,serif",letterSpacing:"0.05em"}}>{l}</button>)}
        </nav>
        <button onClick={onOrder} style={{padding:"16px 48px",border:"2px solid #3a2e28",background:"transparent",color:"#3a2e28",fontSize:15,fontFamily:"Georgia,serif",borderRadius:40,cursor:"pointer",letterSpacing:"0.08em",fontWeight:500}}>
          Commander un gâteau
        </button>
      </div>
    </div>
  );
}

// ─── CATALOG ──────────────────────────────────────────────────────────────────
function CatalogSection({onSelect}) {
  return (
    <div id="catalog-section" style={{padding:"60px 32px",background:"#faf8f5"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:32,color:"#2a1810",marginBottom:8}}>Nos créations</div>
        <div style={{width:48,height:2,background:"#b8ac9e",margin:"0 auto"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16,maxWidth:1000,margin:"0 auto"}}>
        {CATALOG.map(p=>(
          <div key={p.id} onClick={()=>onSelect(p)} style={{background:"#fff",border:"1.5px solid #e8e0d8",borderRadius:8,padding:"28px 20px",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",gap:6,transition:"all 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:36,marginBottom:4}}>{p.emoji}</div>
            <div style={{fontSize:16,fontWeight:600,color:"#2a1810"}}>{p.name}</div>
            <div style={{fontSize:12,color:"#9a8880",lineHeight:1.5}}>{p.tagline}</div>
            <div style={{fontSize:14,color:"#b8ac9e",fontWeight:600,margin:"4px 0"}}>{p.price}</div>
            <div style={{marginTop:8,fontSize:12,color:"#b8ac9e",letterSpacing:"0.08em"}}>Composer →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function ColorDot({color,selected,onClick,label}){return <button title={label} onClick={onClick} style={{width:32,height:32,borderRadius:"50%",background:color,border:selected?"3px solid #b8ac9e":"2px solid #e0d8d0",cursor:"pointer",boxShadow:selected?"0 0 0 2px #f5f0eb":"none",transition:"all 0.15s",outline:"none"}}/>;}
function Tag({children,active,onClick}){return <button onClick={onClick} style={{padding:"7px 14px",borderRadius:4,border:active?"1.5px solid #b8ac9e":"1.5px solid #e8ddd5",background:active?"#f5f0eb":"#faf8f6",color:active?"#3a2e28":"#6a5f5a",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{children}</button>;}

// ─── LAYER CAKE SELECTOR ──────────────────────────────────────────────────────
function LayerCakeSelector({onSelectSize,onBack}){
  return (
    <div style={CS.page}>
      <div style={CS.header}><button style={CS.backBtn} onClick={onBack}>← Retour</button><div><div style={CS.headerTitle}>✨ Layer Cake</div><div style={CS.headerSub}>Choisissez votre taille</div></div><div style={{width:80}}/></div>
      <div style={{padding:"40px 20px",maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}><div style={{fontFamily:"'Palatino Linotype',serif",fontSize:22,color:"#2a1810",marginBottom:8}}>Quelle taille souhaitez-vous ?</div><div style={{width:40,height:1.5,background:"#b8ac9e",margin:"0 auto"}}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {LAYER_CAKE_SIZES.map(sz=>(
            <button key={sz.id} onClick={()=>onSelectSize(sz)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 24px",border:"1.5px solid #e8e0d8",borderRadius:8,background:"#fff",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}><span style={{fontSize:28}}>{sz.emoji}</span><div style={{textAlign:"left"}}><div style={{fontWeight:600,fontSize:16,color:"#2a1810"}}>{sz.name}</div><div style={{fontSize:12,color:"#9a8880",marginTop:2}}>{sz.tagline}</div></div></div>
              <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:17,color:"#b8ac9e",fontWeight:700}}>{sz.basePrice}€</span><span style={{color:"#b8ac9e",fontSize:18}}>→</span></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONFIGURATOR ─────────────────────────────────────────────────────────────
function Configurator({product,onBack,onSubmit,selectedDate,expiresAt}){
  const [step,setStep]=useState(0);
  const [order,setOrder]=useState({...emptyOrder(),date:selectedDate||""});
  const [dragOver,setDragOver]=useState(false);
  const up=(k,v)=>setOrder(o=>({...o,[k]:v}));
  const toggleTopping=(t)=>setOrder(o=>({...o,toppings:o.toppings.includes(t)?o.toppings.filter(x=>x!==t):[...o.toppings,t]}));
  const steps=["Forme",...(product.hasDecoration?["Décoration"]:[]),"Garniture","Couleurs","Message & Photo","Livraison","Récapitulatif"];
  const actualStep=steps[step];
  const canNext=()=>{if(actualStep==="Forme")return!!order.form;if(actualStep==="Livraison")return!!order.name&&!!order.email;return true;};
  const handleFile=(file)=>{if(file&&file.type.startsWith("image/")){const r=new FileReader();r.onload=e=>up("photo",e.target.result);up("photoName",file.name);r.readAsDataURL(file);}};
  const calcPrice=()=>{if(!product.basePrice)return"Sur devis";let p=product.basePrice;if(product.hasDecoration&&order.decoration){const d=product.decorations?.find(d=>d.id===order.decoration);if(d)p=product.basePrice+d.price;}const l=COULEURS_LISSAGE.find(c=>c.name===order.couleurLissage);if(l?.supplement)p+=l.supplement;if(order.decoSupp)p+=3;return`${p}€`;};

  const handleExpired=()=>{
    alert("⏱️ Le temps est écoulé ! Votre réservation a expiré. Veuillez recommencer.");
    onBack();
  };

  return (
    <div style={CS.page}>
      <div style={CS.header}>
        <button style={CS.backBtn} onClick={()=>{fetch("/api/reserve-date",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:getSessionId()})});onBack();}}>← Retour</button>
        <div><div style={CS.headerTitle}>{product.emoji} {product.name}</div><div style={CS.headerSub}>{product.tagline} · 📅 {selectedDate}</div></div>
        <div style={CS.price}>{calcPrice()}</div>
      </div>

      {expiresAt&&<TimerBanner expiresAt={expiresAt} onExpired={handleExpired}/>}

      <div style={CS.stepsBar}>
        {steps.map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{...CS.stepDot,...(i<=step?CS.stepDotOn:{})}}>{i<step?"✓":i+1}</div>
            {i<steps.length-1&&<div style={{...CS.stepLine,...(i<step?CS.stepLineOn:{})}}/>}
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:13,color:"#b8ac9e",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24}}>{actualStep}</div>
      <div style={CS.card}>
        {actualStep==="Forme"&&<div><p style={CS.hint}>Choisissez la forme de votre {product.name}</p><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{product.forms.map(f=><button key={f} style={{...CS.formBtn,...(order.form===f?CS.formBtnOn:{})}} onClick={()=>up("form",f)}><span style={{fontSize:22}}>{f==="Cercle"?"⭕":f==="Cœur"?"❤️":"⬛"}</span><span style={{fontWeight:500}}>{f}</span></button>)}</div></div>}
        {actualStep==="Décoration"&&<div><p style={CS.hint}>Quel type de décoration ?</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{product.decorations.map(d=><button key={d.id} style={{...CS.decoBtn,...(order.decoration===d.id?CS.decoBtnOn:{})}} onClick={()=>up("decoration",d.id)}><div style={{fontWeight:600,fontSize:15}}>{d.desc} — {d.label}</div></button>)}</div></div>}
        {actualStep==="Garniture"&&<div><div style={{marginBottom:20}}><div style={CS.label}>Topping</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{TOPPINGS.map(t=><Tag key={t} active={order.toppings.includes(t)} onClick={()=>toggleTopping(t)}>{t}</Tag>)}</div></div><div><div style={CS.label}>Nappage (1 choix)</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{NAPPAGES.map(n=><Tag key={n} active={order.nappage===n} onClick={()=>up("nappage",n===order.nappage?"":n)}>{n}</Tag>)}</div></div></div>}
        {actualStep==="Couleurs"&&<div>{product.hasLissage&&<div style={{marginBottom:24}}><div style={CS.label}>Couleur du lissage</div><div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>{COULEURS_LISSAGE.map(c=><ColorDot key={c.name} color={c.hex} label={c.name} selected={order.couleurLissage===c.name} onClick={()=>up("couleurLissage",c.name)}/>)}</div>{order.couleurLissage&&<div style={{marginTop:8,fontSize:12,color:"#b8ac9e"}}>{order.couleurLissage}</div>}</div>}{product.hasDessinColor&&<div style={{marginBottom:24}}><div style={CS.label}>Couleur dessins</div><div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>{COULEURS_DESSIN.map(c=><ColorDot key={c.name} color={c.hex} label={c.name} selected={order.couleurDessin===c.name} onClick={()=>up("couleurDessin",c.name)}/>)}</div></div>}<div><div style={CS.label}>Supplément décoration +3€</div><button style={{...CS.toggleBtn,...(order.decoSupp?CS.toggleBtnOn:{})}} onClick={()=>up("decoSupp",!order.decoSupp)}>{order.decoSupp?"✦ Oui (+3€)":"Non merci"}</button></div></div>}
        {actualStep==="Message & Photo"&&<div><div style={{marginBottom:20}}><div style={CS.label}>Message (optionnel, max 60 car.)</div><div style={{position:"relative",marginTop:8}}><textarea style={CS.textarea} placeholder="Ex : Joyeux anniversaire Léa 🎉" value={order.message} maxLength={60} rows={2} onChange={e=>up("message",e.target.value)}/><span style={{position:"absolute",bottom:8,right:12,fontSize:11,color:"#c0b5ae"}}>{order.message.length}/60</span></div></div><div><div style={CS.label}>Photo de référence (optionnel)</div><div style={{...CS.dropzone,...(dragOver?CS.dropzoneOn:{})}} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}} onClick={()=>document.getElementById("fi").click()}>{order.photo?<img src={order.photo} alt="" style={{maxHeight:110,maxWidth:"100%",objectFit:"contain",borderRadius:4}}/>:<span style={{fontSize:13,color:"#b0a098",fontStyle:"italic"}}>Glissez une image ou cliquez</span>}</div><input id="fi" type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/></div></div>}
        {actualStep==="Livraison"&&<div>
          <div style={{background:"#f0fdf4",border:"1px solid #b0e0c0",borderRadius:6,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#2a6040"}}>📅 Date sélectionnée : <strong>{selectedDate}</strong></div>
          <div style={{marginBottom:16}}><div style={CS.label}>Mode de récupération</div><div style={{display:"flex",gap:8,marginTop:8}}>{["retrait","livraison"].map(opt=><button key={opt} style={{...CS.toggleBtn,...(order.pickup===opt?CS.toggleBtnOn:{})}} onClick={()=>up("pickup",opt)}>{opt==="retrait"?"🏪 Retrait boutique":"🚗 Livraison"}</button>)}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}><div><div style={CS.label}>Nom complet *</div><input style={{...CS.input,marginTop:6}} placeholder="Marie Martin" value={order.name} onChange={e=>up("name",e.target.value)}/></div><div><div style={CS.label}>Email *</div><input type="email" style={{...CS.input,marginTop:6}} placeholder="marie@email.com" value={order.email} onChange={e=>up("email",e.target.value)}/></div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><div style={CS.label}>Téléphone</div><input type="tel" style={{...CS.input,marginTop:6}} placeholder="06 00 00 00 00" value={order.phone} onChange={e=>up("phone",e.target.value)}/></div><div><div style={CS.label}>Instagram ♥</div><input style={{...CS.input,marginTop:6}} placeholder="@moncompte" value={order.instagram} onChange={e=>up("instagram",e.target.value)}/></div></div>
          <div style={{background:"#fdf0f5",border:"1px solid #f0c8d8",borderRadius:6,padding:"12px 14px",marginTop:16,fontSize:12,color:"#9a5070"}}>💝 En renseignant votre Instagram, vous cumulez des points de fidélité !</div>
        </div>}
        {actualStep==="Récapitulatif"&&<div style={CS.recap}>
          {[{l:"Gâteau",v:`${product.name}`},{l:"Forme",v:order.form},...(order.decoration?[{l:"Décoration",v:product.decorations?.find(d=>d.id===order.decoration)?.label}]:[]),{l:"Toppings",v:order.toppings.join(", ")||"Aucun"},{l:"Nappage",v:order.nappage||"Aucun"},{l:"Couleur lissage",v:order.couleurLissage||"—"},...(product.hasDessinColor?[{l:"Couleur dessins",v:order.couleurDessin||"—"}]:[]),{l:"Message",v:order.message||"Aucun"},{l:"Date",v:selectedDate},{l:"Mode",v:order.pickup==="retrait"?"Retrait boutique":"Livraison"},{l:"Nom",v:order.name},{l:"Email",v:order.email},{l:"Téléphone",v:order.phone||"—"},{l:"Instagram",v:order.instagram||"—"}].map(({l,v})=><div key={l} style={CS.recapRow}><span style={CS.recapL}>{l}</span><span style={CS.recapV}>{v}</span></div>)}
          <div style={{...CS.recapRow,background:"#faf8f5",fontWeight:600}}><span style={CS.recapL}>Prix estimé</span><span style={{color:"#b8ac9e",fontSize:16}}>{calcPrice()}</span></div>
        </div>}
        <div style={CS.nav}>
          {step>0&&<button style={CS.btnSec} onClick={()=>setStep(s=>s-1)}>← Retour</button>}
          <div style={{flex:1}}/>
          {step<steps.length-1?<button style={{...CS.btnPri,...(!canNext()?CS.btnDis:{})}} disabled={!canNext()} onClick={()=>setStep(s=>s+1)}>Continuer →</button>:<button style={CS.btnPri} onClick={()=>onSubmit(order,product,calcPrice())}>Confirmer ✦</button>}
        </div>
      </div>
    </div>
  );
}

// ─── SUCCESS ──────────────────────────────────────────────────────────────────
function Success({order,product,price,onNew}){
  return (
    <div style={{minHeight:"100vh",background:"#faf8f5",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",border:"1px solid #e8e0d8",borderRadius:8,padding:"50px 40px",maxWidth:460,width:"90%",textAlign:"center",boxShadow:"0 2px 20px rgba(0,0,0,0.06)"}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <h2 style={{fontFamily:"'Palatino Linotype',serif",fontSize:26,fontWeight:400,marginBottom:12,color:"#2a1810"}}>Commande confirmée !</h2>
        <p style={{fontSize:14,color:"#6a5f5a",lineHeight:1.8,marginBottom:20}}>Merci <strong>{order.name}</strong> ! Votre commande de <strong>{product.name}</strong> a bien été reçue.<br/>Vous recevrez une confirmation à <strong>{order.email}</strong>.</p>
        {order.instagram&&<div style={{background:"#fdf0f5",border:"1px solid #f0c0d0",borderRadius:6,padding:"10px 16px",fontSize:13,color:"#9a5070",marginBottom:20}}>💝 1 point de fidélité ajouté pour <strong>{order.instagram}</strong> !</div>}
        <button style={CS.btnPri} onClick={onNew}>Nouvelle commande</button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [view,setView]=useState("home");
  const [selected,setSelected]=useState(null);
  const [lastOrder,setLastOrder]=useState(null);
  const [lastPrice,setLastPrice]=useState(null);
  const [selectedDate,setSelectedDate]=useState(null);
  const [expiresAt,setExpiresAt]=useState(null);

  const handleSelect=(p)=>{
    setSelected(p);
    if(p.isLayerCake)setView("layersize");
    else setView("datepicker");
  };

  const handleLayerSize=(sz)=>{
    setSelected({...sz,forms:["Cercle"],hasDecoration:false,hasLissage:true,hasDessinColor:false});
    setView("datepicker");
  };

  const handleDateSelect=async(date)=>{
    setSelectedDate(date);
    // Récupérer le temps d'expiration depuis sessionStorage
    const expiry=Date.now()+(10*60*1000);
    setExpiresAt(expiry);
    if(selected?.isBox)setView("box");
    else setView("config");
  };

  const handleSubmit=async(order,product,price)=>{
    // Libérer la réservation temporaire (elle sera remplacée par la vraie commande)
    await fetch("/api/reserve-date",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:getSessionId()})});
    setLastOrder({...order,date:selectedDate});
    setLastPrice(price);
    setSelected(product);
    setView("success");
  };

  const handleNew=()=>{setSelected(null);setLastOrder(null);setView("home");setSelectedDate(null);setExpiresAt(null);};
  const handleBack=()=>{setView("home");setSelectedDate(null);setExpiresAt(null);};

  if(view==="layersize")return<LayerCakeSelector onSelectSize={handleLayerSize} onBack={()=>setView("home")}/>;
  if(view==="datepicker"&&selected)return<DatePickerCalendar onSelect={handleDateSelect} onBack={()=>setView("home")} productName={selected.name}/>;
  if(view==="config"&&selected)return<Configurator product={selected} onBack={()=>setView("datepicker")} onSubmit={handleSubmit} selectedDate={selectedDate} expiresAt={expiresAt}/>;
  if(view==="box"&&selected)return<Configurator product={{...selected,id:"box",name:"Box Gourmande",tagline:"1 Maxi Bentocake + 5 Cupcakes",basePrice:40,forms:["Cercle","Cœur"],hasDecoration:false,hasLissage:true,hasDessinColor:true,emoji:"🎁"}} onBack={()=>setView("datepicker")} onSubmit={handleSubmit} selectedDate={selectedDate} expiresAt={expiresAt}/>;
  if(view==="success")return<Success order={lastOrder} product={selected} price={lastPrice} onNew={handleNew}/>;

  return (
    <div style={{minHeight:"100vh",background:"#faf8f5",fontFamily:"Georgia,serif"}}>
      <Sidebar onOrder={handleSelect}/>
      <Hero onOrder={()=>document.getElementById("catalog-section")?.scrollIntoView({behavior:"smooth"})}/>
      <CatalogSection onSelect={handleSelect}/>
      <div style={{background:"#3a2e28",padding:"60px 32px",textAlign:"center"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{fontSize:36,marginBottom:12}}>💝</div>
          <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:26,color:"#f5ede8",marginBottom:10}}>Programme de fidélité</div>
          <p style={{fontSize:14,color:"#c8b0a8",lineHeight:1.8,marginBottom:32}}>À chaque commande, renseignez votre Instagram et cumulez des points. Des récompenses vous attendent dès la 5ème commande !</p>
          <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
            {["1 commande = 1 point","5 points = réduction","10 points = gâteau offert"].map((s,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flex:"1",minWidth:140}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#b8ac9e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>{i+1}</div>
                <div style={{fontSize:13,color:"#c8b0a8",textAlign:"center"}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{background:"#fdf0f5",padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:13,color:"#9a5070",letterSpacing:"0.08em",marginBottom:6}}>📸 Suivez nos créations</div>
        <a href="https://instagram.com/monjolidessert" style={{fontSize:18,color:"#c9376a",fontWeight:600,fontStyle:"italic",textDecoration:"none"}}>@monjolidessert</a>
      </div>
      <footer style={{padding:"24px",textAlign:"center",fontSize:11,color:"#b0a098",letterSpacing:"0.1em",borderTop:"1px solid #e8e0d8"}}>© 2026 Mon Joli Dessert · Artisan pâtissier</footer>
    </div>
  );
}

const CS={page:{minHeight:"100vh",background:"#faf8f5",fontFamily:"Georgia,serif",color:"#2a2020",display:"flex",flexDirection:"column"},header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",background:"#fff",borderBottom:"1px solid #e8e0d8",gap:12},headerTitle:{fontSize:18,fontWeight:600,color:"#2a1810"},headerSub:{fontSize:12,color:"#9a8880"},price:{fontSize:18,color:"#b8ac9e",fontWeight:700},backBtn:{background:"none",border:"1.5px solid #e8e0d8",borderRadius:4,padding:"8px 16px",cursor:"pointer",fontSize:13,color:"#6a5f5a",fontFamily:"inherit"},navBtn:{background:"none",border:"1.5px solid #e8e0d8",borderRadius:4,padding:"6px 14px",cursor:"pointer",fontSize:16,color:"#b8ac9e",fontFamily:"inherit"},stepsBar:{display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 24px 4px",gap:0},stepDot:{width:28,height:28,borderRadius:"50%",border:"1.5px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#b0a098",background:"#fff",flexShrink:0},stepDotOn:{background:"#b8ac9e",borderColor:"#b8ac9e",color:"#fff"},stepLine:{width:24,height:1.5,background:"#e0d8d0"},stepLineOn:{background:"#b8ac9e"},card:{background:"#fff",borderRadius:6,border:"1px solid #e8e0d8",padding:"32px 28px 24px",margin:"0 16px 16px",boxShadow:"0 2px 16px rgba(0,0,0,0.04)"},hint:{fontSize:14,color:"#8a7f78",marginBottom:18,margin:"0 0 18px"},label:{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#9a8880",fontWeight:600},input:{width:"100%",border:"1.5px solid #e8e0d8",borderRadius:4,padding:"10px 13px",fontSize:14,fontFamily:"Georgia,serif",background:"#faf8f5",color:"#2a2020",outline:"none",boxSizing:"border-box"},textarea:{width:"100%",border:"1.5px solid #e8e0d8",borderRadius:4,padding:"12px 14px",fontSize:14,fontFamily:"Georgia,serif",background:"#faf8f5",resize:"none",outline:"none",color:"#2a2020",boxSizing:"border-box",lineHeight:1.6},formBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"20px 28px",border:"1.5px solid #e8e0d8",borderRadius:6,background:"#faf8f5",cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",minWidth:100},formBtnOn:{border:"1.5px solid #b8ac9e",background:"#f5f0eb"},decoBtn:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",border:"1.5px solid #e8e0d8",borderRadius:6,background:"#faf8f5",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.18s"},decoBtnOn:{border:"1.5px solid #b8ac9e",background:"#f5f0eb"},toggleBtn:{padding:"10px 18px",border:"1.5px solid #e8e0d8",borderRadius:4,background:"#faf8f5",cursor:"pointer",fontSize:13,fontFamily:"inherit",color:"#6a5f5a",transition:"all 0.18s"},toggleBtnOn:{border:"1.5px solid #b8ac9e",background:"#f5f0eb",color:"#3a2e28",fontWeight:600},dropzone:{border:"1.5px dashed #d8c8c0",borderRadius:4,padding:"28px",textAlign:"center",cursor:"pointer",background:"#faf8f5",minHeight:90,display:"flex",alignItems:"center",justifyContent:"center",marginTop:8},dropzoneOn:{border:"1.5px dashed #b8ac9e",background:"#f5f0eb"},recap:{border:"1px solid #e8e0d8",borderRadius:6,overflow:"hidden"},recapRow:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",borderBottom:"1px solid #f5f0eb",gap:12},recapL:{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9a8880",flexShrink:0},recapV:{fontSize:13,color:"#2a2020",textAlign:"right"},nav:{display:"flex",alignItems:"center",gap:10,paddingTop:20,marginTop:8,borderTop:"1px solid #f0ebe4"},btnPri:{background:"#3a2e28",color:"#fff",border:"none",borderRadius:4,padding:"13px 28px",fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer",letterSpacing:"0.05em"},btnSec:{background:"transparent",color:"#6a5f5a",border:"1.5px solid #e0d8d0",borderRadius:4,padding:"11px 20px",fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer"},btnDis:{background:"#c8c0bc",cursor:"not-allowed"}};
