import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TOPPINGS = ["Kinder","Spéculos","Snickers","M&M's","Oreo","Fraise","Framboise","Mangue"];
const NAPPAGES = ["Coulis de framboise","Coulis de mangue","Crème spéculos","Crème pistache","Nutella","Caramel beurre salé","Crème pâtissière","Crème diplomate"];
const COULEURS_LISSAGE = [
  {name:"Jaune pastel",hex:"#f9e4a0"},
  {name:"Rose pastel",hex:"#f7b8d0"},
  {name:"Lilas",hex:"#d4b8f7"},
  {name:"Bleu pastel",hex:"#b8d8f7"},
  {name:"Vert pastel",hex:"#b8f0c8"},
  {name:"Gris perle",hex:"#d8d8d8"},
  {name:"Blanc",hex:"#ffffff"},
  {name:"Noir (+2€)",hex:"#1a1a1a",supplement:2},
  {name:"Rouge (+2€)",hex:"#e03030",supplement:2},
];
const COULEURS_DESSIN = [
  {name:"Noir",hex:"#1a1a1a"},{name:"Rouge",hex:"#e03030"},{name:"Bleu",hex:"#3060e0"},
  {name:"Vert",hex:"#20a040"},{name:"Blanc",hex:"#f5f5f5"},{name:"Gris",hex:"#909090"},
  {name:"Jaune",hex:"#f0c020"},{name:"Rose",hex:"#f060a0"},{name:"Lilas",hex:"#a060d0"},
  {name:"Bleu ciel",hex:"#60b0f0"},{name:"Vert anis",hex:"#90d040"},
];

const LAYER_CAKE_SIZES = [
  {id:"s", name:"Layercake S", tagline:"12 parts · en hauteur", basePrice:50, emoji:"✨"},
  {id:"m", name:"Layercake M", tagline:"18 parts · en largeur", basePrice:70, emoji:"👑", decoSurDevis:true},
  {id:"l", name:"Layercake L", tagline:"30 parts", basePrice:90, emoji:"🌸", decoSurDevis:true},
];

const CATALOG = [
  {
    id:"bentocake",
    name:"Bentocake",
    tagline:"2 parts · boîte burger · 11cm",
    price:"à partir de 15€",
    basePrice:15,
    forms:["Cercle","Cœur","Carré"],
    hasDecoration:true,
    hasLissage:true,
    hasDessinColor:true,
    decorations:[
      {id:"ecritures",label:"Écritures & motifs simples",price:0,desc:"15€"},
      {id:"dessins",label:"Dessins simples",price:2,desc:"17€"},
      {id:"vintage",label:"Pochage effet vintage",price:5,desc:"20€"},
    ],
    emoji:"🎂",
  },
  {
    id:"maxibentocake",
    name:"Maxi Bentocake",
    tagline:"4 parts · boîte blanche & transparente",
    price:"à partir de 22€",
    basePrice:22,
    forms:["Cercle","Cœur"],
    hasDecoration:false,
    hasLissage:true,
    hasDessinColor:true,
    emoji:"🍰",
  },
  {
    id:"minicake",
    name:"Minicake",
    tagline:"8 parts · boîte blanche & transparente",
    price:"à partir de 30€",
    basePrice:30,
    forms:["Cercle","Cœur"],
    hasDecoration:false,
    hasLissage:true,
    hasDessinColor:true,
    emoji:"🎀",
  },
  {
    id:"layercake",
    name:"Layer Cake",
    tagline:"12 à 30 parts · plusieurs tailles disponibles",
    price:"à partir de 50€",
    basePrice:null,
    isLayerCake:true,
    emoji:"✨",
  },
  {
    id:"box",
    name:"Box Gourmande",
    tagline:"1 Maxi Bentocake + 5 Cupcakes",
    price:"à partir de 40€",
    basePrice:40,
    isBox:true,
    emoji:"🎁",
  },
];

const emptyOrder = () => ({
  form:"",
  layerSize:"",
  decoration:"",
  toppings:[],
  nappage:"",
  couleurLissage:"",
  couleurDessin:"",
  message:"",
  decoSupp:false,
  date:"",
  pickup:"retrait",
  photo:null,
  photoName:"",
  name:"",
  email:"",
  phone:"",
  instagram:"",
  // Box specific
  boxForm:"",
  boxToppings:[],
  boxNappage:"",
  boxCouleurLissage:"",
  boxCouleurDessin:"",
  cupcakeNappages:[],
  cupcakeToppings:[],
});

// ─── LOGO COMPONENT ───────────────────────────────────────────────────────────

function Logo({large}){
  const size = large ? 120 : 44;
  const fontSize = large ? 28 : 12;
  const subSize = large ? 12 : 8;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:large?8:3}}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* Plate */}
        <ellipse cx="60" cy="95" rx="46" ry="10" fill="#f0e8e0" stroke="#d4b8a8" strokeWidth="1.5"/>
        {/* Cake body */}
        <rect x="22" y="52" width="76" height="40" rx="4" fill="#fff9f5" stroke="#e8d5c8" strokeWidth="1.5"/>
        {/* Cream layer */}
        <rect x="22" y="68" width="76" height="6" rx="0" fill="#fde8d8" opacity="0.8"/>
        {/* Top frosting wavy */}
        <path d="M22 54 Q30 48 38 54 Q46 60 54 54 Q62 48 70 54 Q78 60 86 54 Q94 48 98 54 L98 52 Q94 46 86 52 Q78 58 70 52 Q62 46 54 52 Q46 58 38 52 Q30 46 22 52 Z" fill="#fff0e8"/>
        {/* Bow */}
        <path d="M48 78 C44 72 38 74 40 78 C42 82 48 80 54 78 C60 76 66 82 68 78 C70 74 64 72 60 78 C58 80 54 80 48 78Z" fill="#1a1a1a"/>
        <circle cx="54" cy="78" r="3" fill="#1a1a1a"/>
        {/* Stars */}
        <text x="15" y="45" fontSize="10" fill="#c9736a" opacity="0.8">✦</text>
        <text x="92" y="40" fontSize="8" fill="#c9736a" opacity="0.6">✦</text>
        <text x="55" y="25" fontSize="6" fill="#c9736a" opacity="0.5">✦</text>
      </svg>
      <div style={{fontFamily:"'Palatino Linotype','Book Antiqua',serif",fontSize,color:large?"#1a0f0f":"#f5ede8",letterSpacing:"0.15em",fontWeight:400,textAlign:"center",lineHeight:1.1}}>
        MON JOLI DESSERT
      </div>
      {large && <div style={{fontSize:subSize,color:"#c9736a",letterSpacing:"0.3em",textTransform:"uppercase"}}>Artisan Pâtissier</div>}
    </div>
  );
}

// ─── LAYER CAKE SELECTOR ──────────────────────────────────────────────────────

function LayerCakeSelector({onSelectSize, onBack}){
  const [hovered, setHovered] = useState(null);
  return (
    <div style={S.page}>
      <div style={S.configHeader}>
        <button style={S.backBtn} onClick={onBack}>← Retour</button>
        <div>
          <div style={S.configTitle}>✨ Layer Cake</div>
          <div style={S.configSub}>Choisissez votre taille</div>
        </div>
        <div style={S.priceTag}>à partir de 50€</div>
      </div>
      <div style={{padding:"40px 20px",maxWidth:700,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:22,color:"#2a1810",marginBottom:8}}>Quelle taille souhaitez-vous ?</div>
          <div style={{width:40,height:1.5,background:"#c9736a",margin:"0 auto"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {LAYER_CAKE_SIZES.map(sz => (
            <button
              key={sz.id}
              onMouseEnter={()=>setHovered(sz.id)}
              onMouseLeave={()=>setHovered(null)}
              onClick={()=>onSelectSize(sz)}
              style={{
                display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"22px 24px",border:hovered===sz.id?"1.5px solid #c9736a":"1.5px solid #ede5de",
                borderRadius:8,background:hovered===sz.id?"#fdf0ee":"#fff",
                cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",
                boxShadow:hovered===sz.id?"0 4px 20px rgba(201,115,106,0.12)":"0 1px 4px rgba(0,0,0,0.04)"
              }}
            >
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:28}}>{sz.emoji}</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:600,fontSize:16,color:"#2a1810"}}>{sz.name}</div>
                  <div style={{fontSize:12,color:"#9a8880",marginTop:2}}>{sz.tagline}</div>
                  {sz.decoSurDevis && <div style={{fontSize:11,color:"#b0908a",fontStyle:"italic",marginTop:2}}>Décoration personnalisée sur devis</div>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:17,color:"#c9736a",fontWeight:700}}>{sz.basePrice}€</span>
                <span style={{color:"#c9736a",fontSize:18}}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ColorDot({color, selected, onClick, label}){
  return (
    <button title={label} onClick={onClick} style={{
      width:32, height:32, borderRadius:"50%", background:color,
      border: selected ? "3px solid #c9736a" : "2px solid #e0d8d0",
      cursor:"pointer", boxShadow: selected ? "0 0 0 2px #fdf0ee" : "none",
      transition:"all 0.15s", outline:"none",
    }}/>
  );
}

function Tag({children, active, onClick}){
  return (
    <button onClick={onClick} style={{
      padding:"7px 14px", borderRadius:4,
      border: active ? "1.5px solid #c9736a" : "1.5px solid #e8ddd5",
      background: active ? "#fdf0ee" : "#faf8f6",
      color: active ? "#c9736a" : "#6a5f5a",
      fontSize:12, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
    }}>{children}</button>
  );
}

// ─── BOX CONFIGURATOR ─────────────────────────────────────────────────────────

function BoxConfigurator({onBack, onSubmit}){
  const [phase, setPhase] = useState(0); // 0=maxi bentocake, 1=cupcakes, 2=livraison, 3=recap
  const [order, setOrder] = useState(emptyOrder());
  const [dragOver, setDragOver] = useState(false);

  const up = (k,v) => setOrder(o=>({...o,[k]:v}));
  const toggleArr = (key, val) => setOrder(o=>({
    ...o, [key]: o[key].includes(val) ? o[key].filter(x=>x!==val) : [...o[key], val]
  }));

  const phases = ["Maxi Bentocake","Cupcakes","Livraison","Récapitulatif"];

  const calcPrice = () => {
    let p = 40;
    const lissage = COULEURS_LISSAGE.find(c=>c.name===order.boxCouleurLissage);
    if(lissage?.supplement) p += lissage.supplement;
    return `${p}€`;
  };

  const canNext = () => {
    if(phase===0) return !!order.boxForm;
    if(phase===2) return !!order.date && !!order.name && !!order.email;
    return true;
  };

  const handleFile = (file) => {
    if(file && file.type.startsWith("image/")){
      const r = new FileReader();
      r.onload = e => up("photo", e.target.result);
      up("photoName", file.name);
      r.readAsDataURL(file);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.configHeader}>
        <button style={S.backBtn} onClick={onBack}>← Retour</button>
        <div>
          <div style={S.configTitle}>🎁 Box Gourmande</div>
          <div style={S.configSub}>1 Maxi Bentocake + 5 Cupcakes</div>
        </div>
        <div style={S.priceTag}>{calcPrice()}</div>
      </div>

      {/* Steps bar */}
      <div style={S.stepsBar}>
        {phases.map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:0}}>
            <div style={{...S.stepDot,...(i<=phase?S.stepDotOn:{})}}>{i<phase?"✓":i+1}</div>
            {i<phases.length-1&&<div style={{...S.stepLine,...(i<phase?S.stepLineOn:{})}}/>}
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:13,color:"#c9736a",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24}}>
        {phases[phase]}
      </div>

      <div style={S.card}>

        {/* PHASE 0 — Maxi Bentocake */}
        {phase===0 && (
          <div>
            <div style={{background:"#fdf8f4",border:"1px solid #ede5de",borderRadius:6,padding:"14px 16px",marginBottom:20,fontSize:13,color:"#6a5060"}}>
              🎂 Commençons par configurer votre <strong>Maxi Bentocake</strong> (4 parts)
            </div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Forme *</div>
              <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
                {["Cercle","Cœur"].map(f=>(
                  <button key={f} style={{...S.formBtn,...(order.boxForm===f?S.formBtnOn:{})}} onClick={()=>up("boxForm",f)}>
                    <span style={{fontSize:20}}>{f==="Cercle"?"⭕":"❤️"}</span>
                    <span style={{fontWeight:500,fontSize:13}}>{f}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Topping (plusieurs choix)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                {TOPPINGS.map(t=>(
                  <Tag key={t} active={order.boxToppings.includes(t)} onClick={()=>toggleArr("boxToppings",t)}>{t}</Tag>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Nappage (1 choix)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                {NAPPAGES.map(n=>(
                  <Tag key={n} active={order.boxNappage===n} onClick={()=>up("boxNappage",n===order.boxNappage?"":n)}>{n}</Tag>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Couleur du lissage</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>
                {COULEURS_LISSAGE.map(c=>(
                  <ColorDot key={c.name} color={c.hex} label={c.name} selected={order.boxCouleurLissage===c.name} onClick={()=>up("boxCouleurLissage",c.name)}/>
                ))}
              </div>
              {order.boxCouleurLissage&&<div style={{marginTop:8,fontSize:12,color:"#c9736a"}}>{order.boxCouleurLissage}</div>}
            </div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Couleur des dessins & écritures</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>
                {COULEURS_DESSIN.map(c=>(
                  <ColorDot key={c.name} color={c.hex} label={c.name} selected={order.boxCouleurDessin===c.name} onClick={()=>up("boxCouleurDessin",c.name)}/>
                ))}
              </div>
              {order.boxCouleurDessin&&<div style={{marginTop:8,fontSize:12,color:"#c9736a"}}>{order.boxCouleurDessin}</div>}
            </div>
            <div>
              <div style={S.sectionLabel}>Message sur le gâteau <span style={{color:"#b0a098",fontWeight:400}}>(optionnel)</span></div>
              <div style={{position:"relative",marginTop:8}}>
                <textarea style={S.textarea} placeholder="Ex : Joyeux anniversaire 🎉" value={order.message} maxLength={60} rows={2} onChange={e=>up("message",e.target.value)}/>
                <span style={{position:"absolute",bottom:8,right:12,fontSize:11,color:"#c0b5ae"}}>{order.message.length}/60</span>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 1 — Cupcakes */}
        {phase===1 && (
          <div>
            <div style={{background:"#fdf0f8",border:"1px solid #f0c8d8",borderRadius:6,padding:"14px 16px",marginBottom:20,fontSize:13,color:"#7a3060"}}>
              🧁 Maintenant, personnalisez vos <strong>5 Cupcakes</strong>
            </div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Topping des cupcakes (plusieurs choix)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                {TOPPINGS.map(t=>(
                  <Tag key={t} active={order.cupcakeToppings.includes(t)} onClick={()=>toggleArr("cupcakeToppings",t)}>{t}</Tag>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Nappage des cupcakes <span style={{color:"#b0a098",fontWeight:400}}>(1 ou 2 choix max)</span></div>
              <p style={{fontSize:12,color:"#9a8880",margin:"4px 0 10px"}}>Vous pouvez choisir jusqu'à 2 nappages différents pour varier les saveurs.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                {NAPPAGES.map(n=>{
                  const selected = order.cupcakeNappages.includes(n);
                  const maxReached = order.cupcakeNappages.length>=2 && !selected;
                  return (
                    <button key={n} disabled={maxReached} onClick={()=>{
                      if(selected){
                        setOrder(o=>({...o,cupcakeNappages:o.cupcakeNappages.filter(x=>x!==n)}));
                      } else if(!maxReached){
                        setOrder(o=>({...o,cupcakeNappages:[...o.cupcakeNappages,n]}));
                      }
                    }} style={{
                      padding:"7px 14px",borderRadius:4,
                      border:selected?"1.5px solid #c9736a":"1.5px solid #e8ddd5",
                      background:selected?"#fdf0ee":maxReached?"#f5f3f0":"#faf8f6",
                      color:selected?"#c9736a":maxReached?"#c0b8b0":"#6a5f5a",
                      fontSize:12,cursor:maxReached?"default":"pointer",fontFamily:"inherit",transition:"all 0.15s",
                    }}>{n}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={S.sectionLabel}>Photo de référence <span style={{color:"#b0a098",fontWeight:400}}>(optionnel)</span></div>
              <div
                style={{...S.dropzone,...(dragOver?S.dropzoneOn:{})}}
                onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}}
                onClick={()=>document.getElementById("fi2").click()}
              >
                {order.photo
                  ?<img src={order.photo} alt="" style={{maxHeight:110,maxWidth:"100%",objectFit:"contain",borderRadius:4}}/>
                  :<span style={{fontSize:13,color:"#b0a098",fontStyle:"italic"}}>Glissez une image ou cliquez</span>
                }
              </div>
              <input id="fi2" type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
            </div>
          </div>
        )}

        {/* PHASE 2 — Livraison */}
        {phase===2 && (
          <div>
            <div style={{marginBottom:16}}>
              <div style={S.sectionLabel}>Mode de récupération</div>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                {["retrait","livraison"].map(opt=>(
                  <button key={opt} style={{...S.toggleBtn2,...(order.pickup===opt?S.toggleBtn2On:{})}} onClick={()=>up("pickup",opt)}>
                    {opt==="retrait"?"🏪 Retrait boutique":"🚗 Livraison"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={S.sectionLabel}>Date souhaitée *</div>
              <input type="date" style={{...S.input,marginTop:6}} value={order.date} min={new Date().toISOString().split("T")[0]} onChange={e=>up("date",e.target.value)}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <div style={S.sectionLabel}>Nom complet *</div>
                <input style={{...S.input,marginTop:6}} placeholder="Marie Martin" value={order.name} onChange={e=>up("name",e.target.value)}/>
              </div>
              <div>
                <div style={S.sectionLabel}>Email *</div>
                <input type="email" style={{...S.input,marginTop:6}} placeholder="marie@email.com" value={order.email} onChange={e=>up("email",e.target.value)}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={S.sectionLabel}>Téléphone</div>
                <input type="tel" style={{...S.input,marginTop:6}} placeholder="06 00 00 00 00" value={order.phone} onChange={e=>up("phone",e.target.value)}/>
              </div>
              <div>
                <div style={S.sectionLabel}>Instagram <span style={{color:"#e8609a"}}>♥ fidélité</span></div>
                <input style={{...S.input,marginTop:6}} placeholder="@moncompte" value={order.instagram} onChange={e=>up("instagram",e.target.value)}/>
              </div>
            </div>
            <div style={{background:"#fdf0f5",border:"1px solid #f0c8d8",borderRadius:6,padding:"12px 14px",marginTop:16,fontSize:12,color:"#9a5070"}}>
              💝 En renseignant votre Instagram, vous cumulez des points de fidélité à chaque commande !
            </div>
          </div>
        )}

        {/* PHASE 3 — Récap */}
        {phase===3 && (
          <div>
            <div style={S.recap}>
              <div style={{padding:"10px 16px",background:"#fdf8f4",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#c9736a",fontWeight:600,borderBottom:"1px solid #f5f0eb"}}>
                🎂 Maxi Bentocake
              </div>
              {[
                {l:"Forme",v:order.boxForm},
                {l:"Toppings",v:order.boxToppings.join(", ")||"Aucun"},
                {l:"Nappage",v:order.boxNappage||"Aucun"},
                {l:"Couleur lissage",v:order.boxCouleurLissage||"—"},
                {l:"Couleur dessins",v:order.boxCouleurDessin||"—"},
                {l:"Message",v:order.message||"Aucun"},
              ].map(({l,v})=>(
                <div key={l} style={S.recapRow}>
                  <span style={S.recapL}>{l}</span>
                  <span style={S.recapV}>{v}</span>
                </div>
              ))}
              <div style={{padding:"10px 16px",background:"#fdf0f8",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#c9376a",fontWeight:600,borderBottom:"1px solid #f5f0eb",borderTop:"1px solid #f5f0eb"}}>
                🧁 5 Cupcakes
              </div>
              {[
                {l:"Toppings",v:order.cupcakeToppings.join(", ")||"Aucun"},
                {l:"Nappages",v:order.cupcakeNappages.join(", ")||"Aucun"},
              ].map(({l,v})=>(
                <div key={l} style={S.recapRow}>
                  <span style={S.recapL}>{l}</span>
                  <span style={S.recapV}>{v}</span>
                </div>
              ))}
              <div style={{padding:"10px 16px",background:"#fdf8f4",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#9a8880",fontWeight:600,borderBottom:"1px solid #f5f0eb",borderTop:"1px solid #f5f0eb"}}>
                📦 Livraison
              </div>
              {[
                {l:"Date",v:order.date},
                {l:"Mode",v:order.pickup==="retrait"?"Retrait en boutique":"Livraison"},
                {l:"Nom",v:order.name},
                {l:"Email",v:order.email},
                {l:"Téléphone",v:order.phone||"—"},
                {l:"Instagram",v:order.instagram||"—"},
              ].map(({l,v})=>(
                <div key={l} style={S.recapRow}>
                  <span style={S.recapL}>{l}</span>
                  <span style={S.recapV}>{v}</span>
                </div>
              ))}
              <div style={{...S.recapRow,background:"#fdf8f4",fontWeight:600}}>
                <span style={S.recapL}>Prix estimé</span>
                <span style={{color:"#c9736a",fontSize:16}}>{calcPrice()}</span>
              </div>
            </div>
          </div>
        )}

        <div style={S.nav}>
          {phase>0&&<button style={S.btnSec} onClick={()=>setPhase(p=>p-1)}>← Retour</button>}
          <div style={{flex:1}}/>
          {phase<phases.length-1
            ?<button style={{...S.btnPri,...(!canNext()?S.btnDis:{})}} disabled={!canNext()} onClick={()=>setPhase(p=>p+1)}>
              {phase===0?"Passer aux Cupcakes 🧁 →":"Continuer →"}
            </button>
            :<button style={S.btnPri} onClick={()=>onSubmit(order,{name:"Box Gourmande",tagline:"1 Maxi Bentocake + 5 Cupcakes"},calcPrice())}>
              Confirmer ✦
            </button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── CONFIGURATOR PAGE ────────────────────────────────────────────────────────

function Configurator({product, onBack, onSubmit}){
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState(emptyOrder());
  const [dragOver, setDragOver] = useState(false);

  const up = (k,v) => setOrder(o=>({...o,[k]:v}));
  const toggleTopping = (t) => setOrder(o=>({
    ...o, toppings: o.toppings.includes(t) ? o.toppings.filter(x=>x!==t) : [...o.toppings,t]
  }));

  const steps = [
    "Forme",
    ...(product.hasDecoration ? ["Décoration"] : []),
    "Garniture",
    "Couleurs",
    "Message & Photo",
    "Livraison",
    "Récapitulatif",
  ];

  const actualStep = steps[step];

  const canNext = () => {
    if(actualStep==="Forme") return !!order.form;
    if(actualStep==="Livraison") return !!order.date && !!order.name && !!order.email;
    return true;
  };

  const handleFile = (file) => {
    if(file && file.type.startsWith("image/")){
      const r = new FileReader();
      r.onload = e => up("photo", e.target.result);
      up("photoName", file.name);
      r.readAsDataURL(file);
    }
  };

  const calcPrice = () => {
    if(!product.basePrice) return "Sur devis";
    let p = product.basePrice;
    if(product.hasDecoration && order.decoration){
      const d = product.decorations?.find(d=>d.id===order.decoration);
      if(d) p = product.basePrice + d.price;
    }
    const lissage = COULEURS_LISSAGE.find(c=>c.name===order.couleurLissage);
    if(lissage?.supplement) p += lissage.supplement;
    if(order.decoSupp) p += 3;
    return `${p}€`;
  };

  return (
    <div style={S.page}>
      <div style={S.configHeader}>
        <button style={S.backBtn} onClick={onBack}>← Retour</button>
        <div>
          <div style={S.configTitle}>{product.emoji} {product.name}</div>
          <div style={S.configSub}>{product.tagline}</div>
        </div>
        <div style={S.priceTag}>{calcPrice()}</div>
      </div>

      <div style={S.stepsBar}>
        {steps.map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:0}}>
            <div style={{...S.stepDot,...(i<=step?S.stepDotOn:{})}}>{i<step?"✓":i+1}</div>
            {i<steps.length-1&&<div style={{...S.stepLine,...(i<step?S.stepLineOn:{})}}/>}
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:13,color:"#c9736a",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24}}>
        {actualStep}
      </div>

      <div style={S.card}>

        {actualStep==="Forme" && (
          <div>
            <p style={S.hint}>Choisissez la forme de votre {product.name}</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {product.forms.map(f=>(
                <button key={f} style={{...S.formBtn,...(order.form===f?S.formBtnOn:{})}} onClick={()=>up("form",f)}>
                  <span style={{fontSize:22}}>{f==="Cercle"?"⭕":f==="Cœur"?"❤️":"⬛"}</span>
                  <span style={{fontWeight:500}}>{f}</span>
                  {order.form===f&&<span style={{color:"#c9736a",fontSize:12}}>✦</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {actualStep==="Décoration" && (
          <div>
            <p style={S.hint}>Quel type de décoration souhaitez-vous ?</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {product.decorations.map(d=>(
                <button key={d.id} style={{...S.decoBtn,...(order.decoration===d.id?S.decoBtnOn:{})}} onClick={()=>up("decoration",d.id)}>
                  <div style={{fontWeight:600,fontSize:15}}>{d.desc} — {d.label}</div>
                  {order.decoration===d.id&&<span style={{color:"#c9736a"}}>✦</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {actualStep==="Garniture" && (
          <div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Topping (plusieurs choix possibles)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                {TOPPINGS.map(t=>(
                  <Tag key={t} active={order.toppings.includes(t)} onClick={()=>toggleTopping(t)}>{t}</Tag>
                ))}
              </div>
            </div>
            <div>
              <div style={S.sectionLabel}>Nappage (1 choix)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                {NAPPAGES.map(n=>(
                  <Tag key={n} active={order.nappage===n} onClick={()=>up("nappage",n===order.nappage?"":n)}>{n}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}

        {actualStep==="Couleurs" && (
          <div>
            {product.hasLissage && (
              <div style={{marginBottom:24}}>
                <div style={S.sectionLabel}>Couleur du lissage <span style={{color:"#b0a098",fontWeight:400}}>(noir & rouge +2€)</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>
                  {COULEURS_LISSAGE.map(c=>(
                    <ColorDot key={c.name} color={c.hex} label={c.name} selected={order.couleurLissage===c.name} onClick={()=>up("couleurLissage",c.name)}/>
                  ))}
                </div>
                {order.couleurLissage&&<div style={{marginTop:8,fontSize:12,color:"#c9736a"}}>{order.couleurLissage}</div>}
              </div>
            )}
            {product.hasDessinColor && (
              <div style={{marginBottom:24}}>
                <div style={S.sectionLabel}>Couleur des dessins & écritures</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>
                  {COULEURS_DESSIN.map(c=>(
                    <ColorDot key={c.name} color={c.hex} label={c.name} selected={order.couleurDessin===c.name} onClick={()=>up("couleurDessin",c.name)}/>
                  ))}
                </div>
                {order.couleurDessin&&<div style={{marginTop:8,fontSize:12,color:"#c9736a"}}>{order.couleurDessin}</div>}
              </div>
            )}
            <div>
              <div style={S.sectionLabel}>Supplément décoration <span style={{color:"#b0a098",fontWeight:400}}>+3€</span></div>
              <p style={{fontSize:12,color:"#9a8f88",margin:"4px 0 10px"}}>Perle (blanche/dorée), feuille d'or, ruban…</p>
              <button style={{...S.toggleBtn2,...(order.decoSupp?S.toggleBtn2On:{})}} onClick={()=>up("decoSupp",!order.decoSupp)}>
                {order.decoSupp?"✦ Oui, je veux la décoration (+3€)":"Non merci"}
              </button>
            </div>
          </div>
        )}

        {actualStep==="Message & Photo" && (
          <div>
            <div style={{marginBottom:20}}>
              <div style={S.sectionLabel}>Message sur le gâteau <span style={{color:"#b0a098",fontWeight:400}}>(optionnel, max 60 car.)</span></div>
              <div style={{position:"relative",marginTop:8}}>
                <textarea style={S.textarea} placeholder="Ex : Joyeux anniversaire Léa 🎉" value={order.message} maxLength={60} rows={2} onChange={e=>up("message",e.target.value)}/>
                <span style={{position:"absolute",bottom:8,right:12,fontSize:11,color:"#c0b5ae"}}>{order.message.length}/60</span>
              </div>
              {order.message&&<div style={{...S.previewBox,marginTop:8}}>
                <span style={{fontSize:10,letterSpacing:"0.12em",color:"#c9736a",textTransform:"uppercase"}}>Aperçu</span>
                <span style={{fontStyle:"italic",fontSize:16,color:"#4a3f3a"}}>{order.message}</span>
              </div>}
            </div>
            <div>
              <div style={S.sectionLabel}>Photo de référence <span style={{color:"#b0a098",fontWeight:400}}>(optionnel)</span></div>
              <div
                style={{...S.dropzone,...(dragOver?S.dropzoneOn:{})}}
                onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}}
                onClick={()=>document.getElementById("fi").click()}
              >
                {order.photo
                  ?<img src={order.photo} alt="" style={{maxHeight:110,maxWidth:"100%",objectFit:"contain",borderRadius:4}}/>
                  :<span style={{fontSize:13,color:"#b0a098",fontStyle:"italic"}}>Glissez une image ou cliquez</span>
                }
              </div>
              <input id="fi" type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              {order.photoName&&<div style={{fontSize:11,color:"#c9736a",marginTop:6}}>{order.photoName}</div>}
            </div>
          </div>
        )}

        {actualStep==="Livraison" && (
          <div>
            <div style={{marginBottom:16}}>
              <div style={S.sectionLabel}>Mode de récupération</div>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                {["retrait","livraison"].map(opt=>(
                  <button key={opt} style={{...S.toggleBtn2,...(order.pickup===opt?S.toggleBtn2On:{})}} onClick={()=>up("pickup",opt)}>
                    {opt==="retrait"?"🏪 Retrait boutique":"🚗 Livraison"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={S.sectionLabel}>Date souhaitée *</div>
              <input type="date" style={{...S.input,marginTop:6}} value={order.date} min={new Date().toISOString().split("T")[0]} onChange={e=>up("date",e.target.value)}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <div style={S.sectionLabel}>Nom complet *</div>
                <input style={{...S.input,marginTop:6}} placeholder="Marie Martin" value={order.name} onChange={e=>up("name",e.target.value)}/>
              </div>
              <div>
                <div style={S.sectionLabel}>Email *</div>
                <input type="email" style={{...S.input,marginTop:6}} placeholder="marie@email.com" value={order.email} onChange={e=>up("email",e.target.value)}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={S.sectionLabel}>Téléphone</div>
                <input type="tel" style={{...S.input,marginTop:6}} placeholder="06 00 00 00 00" value={order.phone} onChange={e=>up("phone",e.target.value)}/>
              </div>
              <div>
                <div style={S.sectionLabel}>Instagram <span style={{color:"#e8609a"}}>♥ fidélité</span></div>
                <input style={{...S.input,marginTop:6}} placeholder="@moncompte" value={order.instagram} onChange={e=>up("instagram",e.target.value)}/>
              </div>
            </div>
            <div style={{background:"#fdf0f5",border:"1px solid #f0c8d8",borderRadius:6,padding:"12px 14px",marginTop:16,fontSize:12,color:"#9a5070"}}>
              💝 En renseignant votre Instagram, vous cumulez des points de fidélité à chaque commande !
            </div>
          </div>
        )}

        {actualStep==="Récapitulatif" && (
          <div>
            <div style={S.recap}>
              {[
                {l:"Gâteau",v:`${product.name} — ${product.tagline}`},
                {l:"Forme",v:order.form},
                ...(order.decoration?[{l:"Décoration",v:product.decorations?.find(d=>d.id===order.decoration)?.label}]:[]),
                {l:"Toppings",v:order.toppings.join(", ")||"Aucun"},
                {l:"Nappage",v:order.nappage||"Aucun"},
                {l:"Couleur lissage",v:order.couleurLissage||"—"},
                ...(product.hasDessinColor?[{l:"Couleur dessins",v:order.couleurDessin||"—"}]:[]),
                {l:"Décoration supp.",v:order.decoSupp?"Oui (+3€)":"Non"},
                {l:"Message",v:order.message||"Aucun"},
                {l:"Date",v:order.date},
                {l:"Mode",v:order.pickup==="retrait"?"Retrait en boutique":"Livraison"},
                {l:"Nom",v:order.name},
                {l:"Email",v:order.email},
                {l:"Téléphone",v:order.phone||"—"},
                {l:"Instagram",v:order.instagram||"—"},
              ].map(({l,v})=>(
                <div key={l} style={S.recapRow}>
                  <span style={S.recapL}>{l}</span>
                  <span style={S.recapV}>{v}</span>
                </div>
              ))}
              {order.photo&&(
                <div style={S.recapRow}>
                  <span style={S.recapL}>Photo réf.</span>
                  <img src={order.photo} alt="" style={{maxHeight:60,maxWidth:100,objectFit:"contain",borderRadius:3}}/>
                </div>
              )}
              <div style={{...S.recapRow,background:"#fdf8f4",fontWeight:600}}>
                <span style={S.recapL}>Prix estimé</span>
                <span style={{color:"#c9736a",fontSize:16}}>{calcPrice()}</span>
              </div>
            </div>
          </div>
        )}

        <div style={S.nav}>
          {step>0&&<button style={S.btnSec} onClick={()=>setStep(s=>s-1)}>← Retour</button>}
          <div style={{flex:1}}/>
          {step<steps.length-1
            ?<button style={{...S.btnPri,...(!canNext()?S.btnDis:{})}} disabled={!canNext()} onClick={()=>setStep(s=>s+1)}>Continuer →</button>
            :<button style={S.btnPri} onClick={()=>onSubmit(order,product,calcPrice())}>Confirmer ✦</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function Home({onSelect}){
  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        {/* Decorative circles */}
        <div style={{position:"absolute",top:-80,right:-80,width:320,height:320,borderRadius:"50%",border:"1px solid rgba(201,115,106,0.15)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",border:"1px solid rgba(201,115,106,0.1)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:260,height:260,borderRadius:"50%",border:"1px solid rgba(201,115,106,0.12)",pointerEvents:"none"}}/>

        <div style={S.heroInner}>
          {/* LOGO */}
          <div style={{marginBottom:28}}>
            <Logo large/>
          </div>

          <p style={S.heroSub}>
            Des gâteaux personnalisés & gourmands pour tous vos événements.<br/>
            Chaque création est unique, préparée avec amour.
          </p>

          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
            {["✦ Fait maison","✦ 100% personnalisé","✦ Livraison disponible"].map(t=>(
              <span key={t} style={{fontSize:11,color:"#c9736a",letterSpacing:"0.12em",opacity:0.8}}>{t}</span>
            ))}
          </div>

          <div style={S.heroCta} onClick={()=>document.getElementById("catalog").scrollIntoView({behavior:"smooth"})}>
            Composer mon gâteau ↓
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div id="catalog" style={S.section}>
        <div style={S.sectionTitle}>Nos créations</div>
        <div style={S.sectionLine}/>
        <div style={S.grid}>
          {CATALOG.map(p=>(
            <div key={p.id} style={S.productCard} onClick={()=>onSelect(p)}>
              <div style={S.productEmoji}>{p.emoji}</div>
              <div style={S.productName}>{p.name}</div>
              <div style={S.productTag}>{p.tagline}</div>
              <div style={S.productPrice}>{p.price}</div>
              {p.isLayerCake && <div style={S.devisNote}>S · M · L — taille au choix</div>}
              {p.decoSurDevis&&<div style={S.devisNote}>Déco personnalisée sur devis</div>}
              <div style={S.productBtn}>Composer →</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fidélité */}
      <div style={S.loyaltySection}>
        <div style={S.loyaltyInner}>
          <div style={S.loyaltyIcon}>💝</div>
          <div style={S.loyaltyTitle}>Programme de fidélité</div>
          <p style={S.loyaltyText}>
            À chaque commande, renseignez votre compte Instagram et cumulez des points.<br/>
            Des récompenses vous attendent dès la 5ème commande !
          </p>
          <div style={S.loyaltySteps}>
            {["1 commande = 1 point","5 points = réduction","10 points = gâteau offert"].map((s,i)=>(
              <div key={i} style={S.loyaltyStep}>
                <div style={S.loyaltyStepNum}>{i+1}</div>
                <div style={S.loyaltyStepText}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instagram */}
      <div style={S.instaSection}>
        <div style={S.instaText}>📸 Suivez nos créations</div>
        <a href="https://instagram.com/monjolidessert" style={S.instaLink}>@monjolidessert</a>
      </div>

      <footer style={S.footer}>© 2026 Mon Joli Dessert · Artisan pâtissier</footer>
    </div>
  );
}

// ─── SUCCESS PAGE ─────────────────────────────────────────────────────────────

function Success({order, product, price, onNew}){
  return (
    <div style={{...S.page,alignItems:"center",justifyContent:"center",minHeight:"80vh"}}>
      <div style={S.successCard}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <h2 style={S.successTitle}>Commande confirmée !</h2>
        <p style={S.successText}>
          Merci <strong>{order.name}</strong> ! Votre commande de <strong>{product.name}</strong> a bien été reçue.<br/>
          Vous recevrez une confirmation à <strong>{order.email}</strong>.
        </p>
        {order.instagram&&(
          <div style={{background:"#fdf0f5",border:"1px solid #f0c0d0",borderRadius:6,padding:"10px 16px",fontSize:13,color:"#9a5070",marginBottom:20}}>
            💝 1 point de fidélité ajouté pour <strong>{order.instagram}</strong> !
          </div>
        )}
        <div style={S.successDetails}>
          <span>{product.name}</span><span>·</span>
          {order.form&&<><span>{order.form}</span><span>·</span></>}
          <span>{order.date}</span><span>·</span>
          <span style={{color:"#c9736a",fontWeight:600}}>{price}</span>
        </div>
        <button style={S.btnPri} onClick={onNew}>Nouvelle commande</button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App(){
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);

  const handleSelect = (p) => {
    setSelected(p);
    if(p.isLayerCake) setView("layersize");
    else if(p.isBox) setView("box");
    else setView("config");
  };

  const handleLayerSize = (sz) => {
    setSelected({
      ...sz,
      forms:["Cercle"],
      hasDecoration:false,
      hasLissage:true,
      hasDessinColor:false,
      decoSurDevis:sz.decoSurDevis,
    });
    setView("config");
  };

  const handleSubmit = (order, product, price) => {
    setLastOrder(order); setLastPrice(price);
    setSelected(product);
    setView("success");
  };

  const handleNew = () => { setSelected(null); setLastOrder(null); setView("home"); };

  if(view==="layersize") return <LayerCakeSelector onSelectSize={handleLayerSize} onBack={()=>setView("home")}/>;
  if(view==="config" && selected) return <Configurator product={selected} onBack={()=>setView("home")} onSubmit={handleSubmit}/>;
  if(view==="box") return <BoxConfigurator onBack={()=>setView("home")} onSubmit={handleSubmit}/>;
  if(view==="success") return <Success order={lastOrder} product={selected} price={lastPrice} onNew={handleNew}/>;
  return <Home onSelect={handleSelect}/>;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  page:{minHeight:"100vh",background:"#faf8f5",fontFamily:"'Georgia','Times New Roman',serif",color:"#2a2020",display:"flex",flexDirection:"column",alignItems:"stretch"},

  hero:{background:"linear-gradient(160deg,#1a0f0f 0%,#2e1412 40%,#1a0f0f 100%)",padding:"70px 24px 60px",textAlign:"center",position:"relative",overflow:"hidden"},
  heroInner:{position:"relative",zIndex:1,maxWidth:600,margin:"0 auto"},
  heroSub:{fontSize:15,color:"#c8b0a8",lineHeight:1.8,margin:"0 0 20px"},
  heroCta:{display:"inline-block",padding:"14px 36px",border:"1.5px solid #c9736a",color:"#c9736a",borderRadius:40,fontSize:13,letterSpacing:"0.1em",cursor:"pointer",transition:"all 0.2s"},

  section:{padding:"60px 24px",maxWidth:960,margin:"0 auto",width:"100%",boxSizing:"border-box"},
  sectionTitle:{fontFamily:"'Palatino Linotype',serif",fontSize:28,fontWeight:400,textAlign:"center",letterSpacing:"0.06em",color:"#2a1810",marginBottom:10},
  sectionLine:{width:48,height:2,background:"#c9736a",margin:"0 auto 40px"},

  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16},
  productCard:{background:"#fff",border:"1.5px solid #ede5de",borderRadius:8,padding:"28px 22px",cursor:"pointer",transition:"all 0.2s",textAlign:"center",display:"flex",flexDirection:"column",gap:6},
  productEmoji:{fontSize:32,marginBottom:4},
  productName:{fontSize:17,fontWeight:600,color:"#2a1810",letterSpacing:"0.03em"},
  productTag:{fontSize:12,color:"#9a8880",lineHeight:1.5},
  productPrice:{fontSize:15,color:"#c9736a",fontWeight:600,margin:"4px 0"},
  devisNote:{fontSize:11,color:"#b0908a",fontStyle:"italic"},
  productBtn:{marginTop:10,fontSize:12,color:"#c9736a",letterSpacing:"0.08em",fontWeight:600},

  loyaltySection:{background:"#2a1810",padding:"60px 24px",textAlign:"center"},
  loyaltyInner:{maxWidth:640,margin:"0 auto"},
  loyaltyIcon:{fontSize:36,marginBottom:12},
  loyaltyTitle:{fontFamily:"'Palatino Linotype',serif",fontSize:24,color:"#f5ede8",fontWeight:400,marginBottom:10},
  loyaltyText:{fontSize:14,color:"#c8b0a8",lineHeight:1.8,marginBottom:30},
  loyaltySteps:{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"},
  loyaltyStep:{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flex:"1",minWidth:140},
  loyaltyStepNum:{width:36,height:36,borderRadius:"50%",background:"#c9736a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600},
  loyaltyStepText:{fontSize:13,color:"#c8b0a8",textAlign:"center"},

  instaSection:{background:"#fdf0f5",padding:"32px 24px",textAlign:"center",display:"flex",flexDirection:"column",gap:6,alignItems:"center"},
  instaText:{fontSize:13,color:"#9a5070",letterSpacing:"0.08em"},
  instaLink:{fontSize:18,color:"#c9376a",fontWeight:600,fontStyle:"italic",textDecoration:"none"},

  footer:{padding:"24px",textAlign:"center",fontSize:11,color:"#b0a098",letterSpacing:"0.1em",borderTop:"1px solid #ede5de"},

  configHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",background:"#fff",borderBottom:"1px solid #ede5de",gap:12},
  backBtn:{background:"none",border:"1.5px solid #ede5de",borderRadius:4,padding:"8px 16px",cursor:"pointer",fontSize:13,color:"#6a5f5a",fontFamily:"inherit"},
  configTitle:{fontSize:18,fontWeight:600,color:"#2a1810"},
  configSub:{fontSize:12,color:"#9a8880"},
  priceTag:{fontSize:18,color:"#c9736a",fontWeight:700},

  stepsBar:{display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 24px 4px",gap:0},
  stepDot:{width:28,height:28,borderRadius:"50%",border:"1.5px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#b0a098",background:"#fff",flexShrink:0},
  stepDotOn:{background:"#c9736a",borderColor:"#c9736a",color:"#fff"},
  stepLine:{width:24,height:1.5,background:"#e0d8d0"},
  stepLineOn:{background:"#c9736a"},

  card:{background:"#fff",borderRadius:6,border:"1px solid #ede5de",padding:"32px 28px 24px",margin:"0 16px 16px",boxShadow:"0 2px 16px rgba(0,0,0,0.04)"},
  hint:{fontSize:14,color:"#8a7f78",marginBottom:18,margin:"0 0 18px"},
  sectionLabel:{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#9a8880",fontWeight:600},
  formBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"20px 28px",border:"1.5px solid #ede5de",borderRadius:6,background:"#faf8f5",cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",minWidth:100},
  formBtnOn:{border:"1.5px solid #c9736a",background:"#fdf0ee"},
  decoBtn:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",border:"1.5px solid #ede5de",borderRadius:6,background:"#faf8f5",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.18s"},
  decoBtnOn:{border:"1.5px solid #c9736a",background:"#fdf0ee"},
  toggleBtn2:{padding:"10px 18px",border:"1.5px solid #ede5de",borderRadius:4,background:"#faf8f5",cursor:"pointer",fontSize:13,fontFamily:"inherit",color:"#6a5f5a",transition:"all 0.18s"},
  toggleBtn2On:{border:"1.5px solid #c9736a",background:"#fdf0ee",color:"#c9736a",fontWeight:600},
  textarea:{width:"100%",border:"1.5px solid #ede5de",borderRadius:4,padding:"12px 14px",fontSize:14,fontFamily:"Georgia,serif",background:"#faf8f5",resize:"none",outline:"none",color:"#2a2020",boxSizing:"border-box",lineHeight:1.6},
  previewBox:{border:"1px dashed #d8c8c0",borderRadius:4,padding:"14px 16px",display:"flex",flexDirection:"column",gap:4,background:"#fdf8f4"},
  dropzone:{border:"1.5px dashed #d8c8c0",borderRadius:4,padding:"28px",textAlign:"center",cursor:"pointer",background:"#faf8f5",minHeight:90,display:"flex",alignItems:"center",justifyContent:"center",marginTop:8},
  dropzoneOn:{border:"1.5px dashed #c9736a",background:"#fdf0ee"},
  input:{width:"100%",border:"1.5px solid #ede5de",borderRadius:4,padding:"10px 13px",fontSize:14,fontFamily:"Georgia,serif",background:"#faf8f5",color:"#2a2020",outline:"none",boxSizing:"border-box"},
  recap:{border:"1px solid #ede5de",borderRadius:6,overflow:"hidden"},
  recapRow:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",borderBottom:"1px solid #f5f0eb",gap:12},
  recapL:{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9a8880",flexShrink:0},
  recapV:{fontSize:13,color:"#2a2020",textAlign:"right"},
  nav:{display:"flex",alignItems:"center",gap:10,paddingTop:20,marginTop:8,borderTop:"1px solid #f0ebe4"},
  btnPri:{background:"#2a1810",color:"#fff",border:"none",borderRadius:4,padding:"13px 28px",fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer",letterSpacing:"0.05em"},
  btnSec:{background:"transparent",color:"#6a5f5a",border:"1.5px solid #e0d8d0",borderRadius:4,padding:"11px 20px",fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer"},
  btnDis:{background:"#c8c0bc",cursor:"not-allowed"},

  successCard:{background:"#fff",border:"1px solid #ede5de",borderRadius:6,padding:"50px 40px",maxWidth:460,width:"100%",textAlign:"center",margin:"40px auto",boxShadow:"0 2px 20px rgba(0,0,0,0.04)"},
  successTitle:{fontFamily:"'Palatino Linotype',serif",fontSize:26,fontWeight:400,marginBottom:12},
  successText:{fontSize:14,color:"#6a5f5a",lineHeight:1.8,marginBottom:20},
  successDetails:{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",fontSize:13,color:"#9a8880",marginBottom:28,fontStyle:"italic"},
};
