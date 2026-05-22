import { useState, useEffect } from "react";

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

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({page, setPage, onOrder}) {
  const [open, setOpen] = useState(false);
  const items = [
    {id:"home", label:"Home", icon:"🏠"},
    {id:"catalog", label:"Carte des desserts", icon:"🍰", children:[
      {id:"bentocake", label:"Bento cake"},
      {id:"maxibentocake", label:"Maxi bentocake"},
      {id:"minicake", label:"Minicake"},
      {id:"layercake", label:"Layer Cake"},
      {id:"box", label:"Box Gourmande"},
    ]},
    {id:"loyalty", label:"Avantage fidélité", icon:"💝"},
    {id:"reviews", label:"Retour Client", icon:"⭐"},
    {id:"social", label:"Nos réseaux sociaux", icon:"📸"},
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:40}}/>}

      {/* Toggle button mobile */}
      <button onClick={()=>setOpen(!open)} style={{
        position:"fixed",top:16,left:16,zIndex:60,
        background:"#b8ac9e",border:"none",borderRadius:4,
        width:36,height:36,cursor:"pointer",fontSize:18,
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
      }}>☰</button>

      <div style={{
        position:"fixed",top:0,left:open?0:-240,bottom:0,
        width:220,background:"#b8ac9e",zIndex:50,
        transition:"left 0.25s",display:"flex",flexDirection:"column",
        boxShadow:open?"4px 0 20px rgba(0,0,0,0.15)":"none",
        overflowY:"auto",
      }}>
        <div style={{padding:"20px 16px 10px",fontSize:13,fontWeight:600,color:"#3a2e28",letterSpacing:"0.1em",marginTop:8}}>
          Paramètre
        </div>
        {items.map(item=>(
          <div key={item.id}>
            <button onClick={()=>{
              if(item.id==="home"){setPage("home");setOpen(false);}
              else if(!item.children){setPage(item.id);setOpen(false);}
            }} style={{
              display:"flex",alignItems:"center",gap:10,width:"100%",
              padding:"9px 16px",background:page===item.id?"rgba(0,0,0,0.15)":"none",
              border:"none",cursor:"pointer",color:"#3a2e28",
              fontSize:13,fontFamily:"Georgia,serif",textAlign:"left",
              borderLeft:page===item.id?"3px solid #3a2e28":"3px solid transparent",
            }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
            {item.children && item.children.map(child=>(
              <button key={child.id} onClick={()=>{
                const p = CATALOG.find(c=>c.id===child.id);
                if(p){onOrder(p);setOpen(false);}
              }} style={{
                display:"block",width:"100%",padding:"7px 16px 7px 42px",
                background:"none",border:"none",cursor:"pointer",
                color:"#5a4e48",fontSize:12,fontFamily:"Georgia,serif",textAlign:"left",
              }}>• {child.label}</button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({page, setPage}) {
  const links = ["Home","About Us","Blog","Contact Us"];
  return (
    <nav style={{
      display:"flex",gap:32,justifyContent:"flex-end",
      padding:"12px 32px",background:"transparent",
    }}>
      {links.map(l=>(
        <button key={l} onClick={()=>setPage(l.toLowerCase().replace(" ",""))} style={{
          background:"none",border:"none",cursor:"pointer",
          fontSize:13,color:"#5a4e48",fontFamily:"Georgia,serif",
          letterSpacing:"0.05em",
          borderBottom:page===l.toLowerCase().replace(" ","")?"1px solid #5a4e48":"1px solid transparent",
          paddingBottom:2,
        }}>{l}</button>
      ))}
    </nav>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function Hero({onOrder}) {
  return (
    <div style={{
      background:"linear-gradient(135deg,#c8bfb4 0%,#d4ccc4 50%,#c0b8ae 100%)",
      minHeight:"calc(100vh - 48px)",
      display:"flex",alignItems:"center",
      padding:"40px 32px 40px 80px",
      gap:48,flexWrap:"wrap",
      position:"relative",overflow:"hidden",
    }}>
      {/* Illustration */}
      <div style={{
        width:220,height:260,flexShrink:0,
        background:"rgba(255,255,255,0.3)",
        borderRadius:8,border:"1px solid rgba(255,255,255,0.5)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:100,backdropFilter:"blur(4px)",
        boxShadow:"0 8px 32px rgba(0,0,0,0.1)",
      }}>🎂</div>

      {/* Content */}
      <div style={{flex:1,minWidth:280}}>
        <div style={{
          fontFamily:"'Palatino Linotype',serif",
          fontSize:"clamp(40px,8vw,80px)",
          color:"#fff",fontWeight:400,
          letterSpacing:"0.03em",lineHeight:1,
          marginBottom:16,
          textShadow:"0 2px 12px rgba(0,0,0,0.15)",
        }}>Mon Joli Dessert</div>

        <p style={{
          fontSize:16,color:"rgba(255,255,255,0.9)",
          marginBottom:32,lineHeight:1.6,
          maxWidth:480,
        }}>
          Parce que chaque dessert est unique — des créations personnalisées préparées avec amour pour tous vos événements.
        </p>

        <Navbar page="home" setPage={()=>{}}/>

        <button onClick={()=>document.getElementById("catalog-section").scrollIntoView({behavior:"smooth"})} style={{
          marginTop:24,
          padding:"16px 48px",
          border:"2px solid #3a2e28",
          background:"transparent",
          color:"#3a2e28",
          fontSize:15,fontFamily:"Georgia,serif",
          borderRadius:40,cursor:"pointer",
          letterSpacing:"0.08em",
          transition:"all 0.2s",
          fontWeight:500,
        }}>
          Commander un gâteau
        </button>
      </div>
    </div>
  );
}

// ─── CATALOG SECTION ──────────────────────────────────────────────────────────
function CatalogSection({onSelect}) {
  return (
    <div id="catalog-section" style={{padding:"60px 32px",background:"#faf8f5"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:32,color:"#2a1810",marginBottom:8}}>Nos créations</div>
        <div style={{width:48,height:2,background:"#b8ac9e",margin:"0 auto"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16,maxWidth:1000,margin:"0 auto"}}>
        {CATALOG.map(p=>(
          <div key={p.id} onClick={()=>onSelect(p)} style={{
            background:"#fff",border:"1.5px solid #e8e0d8",borderRadius:8,
            padding:"28px 20px",cursor:"pointer",textAlign:"center",
            display:"flex",flexDirection:"column",gap:6,
            transition:"all 0.2s",
            boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
          }}>
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

// ─── LOYALTY SECTION ──────────────────────────────────────────────────────────
function LoyaltySection() {
  return (
    <div style={{background:"#3a2e28",padding:"60px 32px",textAlign:"center"}}>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{fontSize:36,marginBottom:12}}>💝</div>
        <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:26,color:"#f5ede8",marginBottom:10}}>Programme de fidélité</div>
        <p style={{fontSize:14,color:"#c8b0a8",lineHeight:1.8,marginBottom:32}}>
          À chaque commande, renseignez votre compte Instagram et cumulez des points. Des récompenses vous attendent dès la 5ème commande !
        </p>
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
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function ColorDot({color,selected,onClick,label}){
  return <button title={label} onClick={onClick} style={{width:32,height:32,borderRadius:"50%",background:color,border:selected?"3px solid #b8ac9e":"2px solid #e0d8d0",cursor:"pointer",boxShadow:selected?"0 0 0 2px #f5f0eb":"none",transition:"all 0.15s",outline:"none"}}/>;
}
function Tag({children,active,onClick}){
  return <button onClick={onClick} style={{padding:"7px 14px",borderRadius:4,border:active?"1.5px solid #b8ac9e":"1.5px solid #e8ddd5",background:active?"#f5f0eb":"#faf8f6",color:active?"#3a2e28":"#6a5f5a",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{children}</button>;
}

// ─── LAYER CAKE SELECTOR ──────────────────────────────────────────────────────
function LayerCakeSelector({onSelectSize,onBack}){
  return (
    <div style={CS.page}>
      <div style={CS.header}>
        <button style={CS.backBtn} onClick={onBack}>← Retour</button>
        <div><div style={CS.headerTitle}>✨ Layer Cake</div><div style={CS.headerSub}>Choisissez votre taille</div></div>
        <div style={CS.price}>à partir de 50€</div>
      </div>
      <div style={{padding:"40px 20px",maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"'Palatino Linotype',serif",fontSize:22,color:"#2a1810",marginBottom:8}}>Quelle taille souhaitez-vous ?</div>
          <div style={{width:40,height:1.5,background:"#b8ac9e",margin:"0 auto"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {LAYER_CAKE_SIZES.map(sz=>(
            <button key={sz.id} onClick={()=>onSelectSize(sz)} style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"22px 24px",border:"1.5px solid #e8e0d8",borderRadius:8,
              background:"#fff",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:28}}>{sz.emoji}</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:600,fontSize:16,color:"#2a1810"}}>{sz.name}</div>
                  <div style={{fontSize:12,color:"#9a8880",marginTop:2}}>{sz.tagline}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:17,color:"#b8ac9e",fontWeight:700}}>{sz.basePrice}€</span>
                <span style={{color:"#b8ac9e",fontSize:18}}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BOX CONFIGURATOR ─────────────────────────────────────────────────────────
function BoxConfigurator({onBack,onSubmit,blockedDates}){
  const [phase,setPhase]=useState(0);
  const [order,setOrder]=useState(emptyOrder());
  const [dragOver,setDragOver]=useState(false);
  const up=(k,v)=>setOrder(o=>({...o,[k]:v}));
  const toggleArr=(key,val)=>setOrder(o=>({...o,[key]:o[key].includes(val)?o[key].filter(x=>x!==val):[...o[key],val]}));
  const phases=["Maxi Bentocake","Cupcakes","Livraison","Récapitulatif"];
  const calcPrice=()=>{let p=40;const l=COULEURS_LISSAGE.find(c=>c.name===order.boxCouleurLissage);if(l?.supplement)p+=l.supplement;return `${p}€`;};
  const canNext=()=>{if(phase===0)return!!order.boxForm;if(phase===2)return!!order.date&&!!order.name&&!!order.email;return true;};
  const handleFile=(file)=>{if(file&&file.type.startsWith("image/")){const r=new FileReader();r.onload=e=>up("photo",e.target.result);up("photoName",file.name);r.readAsDataURL(file);}};

  return (
    <div style={CS.page}>
      <div style={CS.header}>
        <button style={CS.backBtn} onClick={onBack}>← Retour</button>
        <div><div style={CS.headerTitle}>🎁 Box Gourmande</div><div style={CS.headerSub}>1 Maxi Bentocake + 5 Cupcakes</div></div>
        <div style={CS.price}>{calcPrice()}</div>
      </div>
      <div style={CS.stepsBar}>
        {phases.map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{...CS.stepDot,...(i<=phase?CS.stepDotOn:{})}}>{i<phase?"✓":i+1}</div>
            {i<phases.length-1&&<div style={{...CS.stepLine,...(i<phase?CS.stepLineOn:{})}}/>}
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:13,color:"#b8ac9e",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24}}>{phases[phase]}</div>
      <div style={CS.card}>
        {phase===0&&(
          <div>
            <div style={{background:"#faf8f5",border:"1px solid #e8e0d8",borderRadius:6,padding:"14px 16px",marginBottom:20,fontSize:13,color:"#6a5060"}}>🎂 Commençons par configurer votre <strong>Maxi Bentocake</strong></div>
            <div style={{marginBottom:20}}><div style={CS.label}>Forme *</div><div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>{["Cercle","Cœur"].map(f=><button key={f} style={{...CS.formBtn,...(order.boxForm===f?CS.formBtnOn:{})}} onClick={()=>up("boxForm",f)}><span style={{fontSize:20}}>{f==="Cercle"?"⭕":"❤️"}</span><span style={{fontWeight:500,fontSize:13}}>{f}</span></button>)}</div></div>
            <div style={{marginBottom:20}}><div style={CS.label}>Topping</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{TOPPINGS.map(t=><Tag key={t} active={order.boxToppings.includes(t)} onClick={()=>toggleArr("boxToppings",t)}>{t}</Tag>)}</div></div>
            <div style={{marginBottom:20}}><div style={CS.label}>Nappage (1 choix)</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{NAPPAGES.map(n=><Tag key={n} active={order.boxNappage===n} onClick={()=>up("boxNappage",n===order.boxNappage?"":n)}>{n}</Tag>)}</div></div>
            <div style={{marginBottom:20}}><div style={CS.label}>Couleur du lissage</div><div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>{COULEURS_LISSAGE.map(c=><ColorDot key={c.name} color={c.hex} label={c.name} selected={order.boxCouleurLissage===c.name} onClick={()=>up("boxCouleurLissage",c.name)}/>)}</div>{order.boxCouleurLissage&&<div style={{marginTop:8,fontSize:12,color:"#b8ac9e"}}>{order.boxCouleurLissage}</div>}</div>
            <div><div style={CS.label}>Message <span style={{color:"#b0a098",fontWeight:400}}>(optionnel)</span></div><div style={{position:"relative",marginTop:8}}><textarea style={CS.textarea} placeholder="Ex : Joyeux anniversaire 🎉" value={order.message} maxLength={60} rows={2} onChange={e=>up("message",e.target.value)}/><span style={{position:"absolute",bottom:8,right:12,fontSize:11,color:"#c0b5ae"}}>{order.message.length}/60</span></div></div>
          </div>
        )}
        {phase===1&&(
          <div>
            <div style={{background:"#fdf0f8",border:"1px solid #f0c8d8",borderRadius:6,padding:"14px 16px",marginBottom:20,fontSize:13,color:"#7a3060"}}>🧁 Personnalisez vos <strong>5 Cupcakes</strong></div>
            <div style={{marginBottom:20}}><div style={CS.label}>Topping cupcakes</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{TOPPINGS.map(t=><Tag key={t} active={order.cupcakeToppings.includes(t)} onClick={()=>toggleArr("cupcakeToppings",t)}>{t}</Tag>)}</div></div>
            <div style={{marginBottom:20}}><div style={CS.label}>Nappage cupcakes (1 ou 2 max)</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{NAPPAGES.map(n=>{const sel=order.cupcakeNappages.includes(n);const max=order.cupcakeNappages.length>=2&&!sel;return<button key={n} disabled={max} onClick={()=>{if(sel)setOrder(o=>({...o,cupcakeNappages:o.cupcakeNappages.filter(x=>x!==n)}));else if(!max)setOrder(o=>({...o,cupcakeNappages:[...o.cupcakeNappages,n]}));}} style={{padding:"7px 14px",borderRadius:4,border:sel?"1.5px solid #b8ac9e":"1.5px solid #e8ddd5",background:sel?"#f5f0eb":max?"#f5f3f0":"#faf8f6",color:sel?"#3a2e28":max?"#c0b8b0":"#6a5f5a",fontSize:12,cursor:max?"default":"pointer",fontFamily:"inherit"}}>{n}</button>})}</div></div>
            <div><div style={CS.label}>Photo de référence <span style={{color:"#b0a098",fontWeight:400}}>(optionnel)</span></div><div style={{...CS.dropzone,...(dragOver?CS.dropzoneOn:{})}} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}} onClick={()=>document.getElementById("fi2").click()}>{order.photo?<img src={order.photo} alt="" style={{maxHeight:110,maxWidth:"100%",objectFit:"contain",borderRadius:4}}/>:<span style={{fontSize:13,color:"#b0a098",fontStyle:"italic"}}>Glissez une image ou cliquez</span>}</div><input id="fi2" type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/></div>
          </div>
        )}
        {phase===2&&(
          <div>
            <div style={{marginBottom:16}}><div style={CS.label}>Mode de récupération</div><div style={{display:"flex",gap:8,marginTop:8}}>{["retrait","livraison"].map(opt=><button key={opt} style={{...CS.toggleBtn,...(order.pickup===opt?CS.toggleBtnOn:{})}} onClick={()=>up("pickup",opt)}>{opt==="retrait"?"🏪 Retrait boutique":"🚗 Livraison"}</button>)}</div></div>
            <div style={{marginBottom:16}}><div style={CS.label}>Date souhaitée *</div><input type="date" style={{...CS.input,marginTop:6}} value={order.date} min={new Date().toISOString().split("T")[0]} onChange={e=>{const d=e.target.value;if(blockedDates[d]===0){alert("Cette date n'est pas disponible, veuillez en choisir une autre.");}else{up("date",d);}}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div><div style={CS.label}>Nom complet *</div><input style={{...CS.input,marginTop:6}} placeholder="Marie Martin" value={order.name} onChange={e=>up("name",e.target.value)}/></div>
              <div><div style={CS.label}>Email *</div><input type="email" style={{...CS.input,marginTop:6}} placeholder="marie@email.com" value={order.email} onChange={e=>up("email",e.target.value)}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><div style={CS.label}>Téléphone</div><input type="tel" style={{...CS.input,marginTop:6}} placeholder="06 00 00 00 00" value={order.phone} onChange={e=>up("phone",e.target.value)}/></div>
              <div><div style={CS.label}>Instagram <span style={{color:"#e8609a"}}>♥</span></div><input style={{...CS.input,marginTop:6}} placeholder="@moncompte" value={order.instagram} onChange={e=>up("instagram",e.target.value)}/></div>
            </div>
          </div>
        )}
        {phase===3&&(
          <div style={CS.recap}>
            <div style={{padding:"10px 16px",background:"#faf8f5",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#b8ac9e",fontWeight:600,borderBottom:"1px solid #f0ebe4"}}>🎂 Maxi Bentocake</div>
            {[{l:"Forme",v:order.boxForm},{l:"Toppings",v:order.boxToppings.join(", ")||"Aucun"},{l:"Nappage",v:order.boxNappage||"Aucun"},{l:"Couleur lissage",v:order.boxCouleurLissage||"—"},{l:"Message",v:order.message||"Aucun"}].map(({l,v})=><div key={l} style={CS.recapRow}><span style={CS.recapL}>{l}</span><span style={CS.recapV}>{v}</span></div>)}
            <div style={{padding:"10px 16px",background:"#fdf0f8",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#c9376a",fontWeight:600,borderBottom:"1px solid #f0ebe4",borderTop:"1px solid #f0ebe4"}}>🧁 5 Cupcakes</div>
            {[{l:"Toppings",v:order.cupcakeToppings.join(", ")||"Aucun"},{l:"Nappages",v:order.cupcakeNappages.join(", ")||"Aucun"}].map(({l,v})=><div key={l} style={CS.recapRow}><span style={CS.recapL}>{l}</span><span style={CS.recapV}>{v}</span></div>)}
            {[{l:"Date",v:order.date},{l:"Mode",v:order.pickup==="retrait"?"Retrait boutique":"Livraison"},{l:"Nom",v:order.name},{l:"Email",v:order.email}].map(({l,v})=><div key={l} style={CS.recapRow}><span style={CS.recapL}>{l}</span><span style={CS.recapV}>{v}</span></div>)}
            <div style={{...CS.recapRow,background:"#faf8f5",fontWeight:600}}><span style={CS.recapL}>Prix estimé</span><span style={{color:"#b8ac9e",fontSize:16}}>{calcPrice()}</span></div>
          </div>
        )}
        <div style={CS.nav}>
          {phase>0&&<button style={CS.btnSec} onClick={()=>setPhase(p=>p-1)}>← Retour</button>}
          <div style={{flex:1}}/>
          {phase<phases.length-1
            ?<button style={{...CS.btnPri,...(!canNext()?CS.btnDis:{})}} disabled={!canNext()} onClick={()=>setPhase(p=>p+1)}>{phase===0?"Passer aux Cupcakes 🧁 →":"Continuer →"}</button>
            :<button style={CS.btnPri} onClick={()=>onSubmit(order,{name:"Box Gourmande",tagline:"1 Maxi Bentocake + 5 Cupcakes"},calcPrice())}>Confirmer ✦</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── CONFIGURATOR ─────────────────────────────────────────────────────────────
function Configurator({product,onBack,onSubmit,blockedDates}){
  const [step,setStep]=useState(0);
  const [order,setOrder]=useState(emptyOrder());
  const [dragOver,setDragOver]=useState(false);
  const up=(k,v)=>setOrder(o=>({...o,[k]:v}));
  const toggleTopping=(t)=>setOrder(o=>({...o,toppings:o.toppings.includes(t)?o.toppings.filter(x=>x!==t):[...o.toppings,t]}));
  const steps=["Forme",...(product.hasDecoration?["Décoration"]:[]),"Garniture","Couleurs","Message & Photo","Livraison","Récapitulatif"];
  const actualStep=steps[step];
  const canNext=()=>{if(actualStep==="Forme")return!!order.form;if(actualStep==="Livraison")return!!order.date&&!!order.name&&!!order.email;return true;};
  const handleFile=(file)=>{if(file&&file.type.startsWith("image/")){const r=new FileReader();r.onload=e=>up("photo",e.target.result);up("photoName",file.name);r.readAsDataURL(file);}};
  const calcPrice=()=>{if(!product.basePrice)return"Sur devis";let p=product.basePrice;if(product.hasDecoration&&order.decoration){const d=product.decorations?.find(d=>d.id===order.decoration);if(d)p=product.basePrice+d.price;}const l=COULEURS_LISSAGE.find(c=>c.name===order.couleurLissage);if(l?.supplement)p+=l.supplement;if(order.decoSupp)p+=3;return`${p}€`;};

  return (
    <div style={CS.page}>
      <div style={CS.header}>
        <button style={CS.backBtn} onClick={onBack}>← Retour</button>
        <div><div style={CS.headerTitle}>{product.emoji} {product.name}</div><div style={CS.headerSub}>{product.tagline}</div></div>
        <div style={CS.price}>{calcPrice()}</div>
      </div>
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
        {actualStep==="Forme"&&(<div><p style={CS.hint}>Choisissez la forme de votre {product.name}</p><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{product.forms.map(f=><button key={f} style={{...CS.formBtn,...(order.form===f?CS.formBtnOn:{})}} onClick={()=>up("form",f)}><span style={{fontSize:22}}>{f==="Cercle"?"⭕":f==="Cœur"?"❤️":"⬛"}</span><span style={{fontWeight:500}}>{f}</span>{order.form===f&&<span style={{color:"#b8ac9e",fontSize:12}}>✦</span>}</button>)}</div></div>)}
        {actualStep==="Décoration"&&(<div><p style={CS.hint}>Quel type de décoration ?</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{product.decorations.map(d=><button key={d.id} style={{...CS.decoBtn,...(order.decoration===d.id?CS.decoBtnOn:{})}} onClick={()=>up("decoration",d.id)}><div style={{fontWeight:600,fontSize:15}}>{d.desc} — {d.label}</div>{order.decoration===d.id&&<span style={{color:"#b8ac9e"}}>✦</span>}</button>)}</div></div>)}
        {actualStep==="Garniture"&&(<div><div style={{marginBottom:20}}><div style={CS.label}>Topping (plusieurs choix)</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{TOPPINGS.map(t=><Tag key={t} active={order.toppings.includes(t)} onClick={()=>toggleTopping(t)}>{t}</Tag>)}</div></div><div><div style={CS.label}>Nappage (1 choix)</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{NAPPAGES.map(n=><Tag key={n} active={order.nappage===n} onClick={()=>up("nappage",n===order.nappage?"":n)}>{n}</Tag>)}</div></div></div>)}
        {actualStep==="Couleurs"&&(<div>{product.hasLissage&&<div style={{marginBottom:24}}><div style={CS.label}>Couleur du lissage <span style={{color:"#b0a098",fontWeight:400}}>(noir & rouge +2€)</span></div><div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>{COULEURS_LISSAGE.map(c=><ColorDot key={c.name} color={c.hex} label={c.name} selected={order.couleurLissage===c.name} onClick={()=>up("couleurLissage",c.name)}/>)}</div>{order.couleurLissage&&<div style={{marginTop:8,fontSize:12,color:"#b8ac9e"}}>{order.couleurLissage}</div>}</div>}{product.hasDessinColor&&<div style={{marginBottom:24}}><div style={CS.label}>Couleur dessins & écritures</div><div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>{COULEURS_DESSIN.map(c=><ColorDot key={c.name} color={c.hex} label={c.name} selected={order.couleurDessin===c.name} onClick={()=>up("couleurDessin",c.name)}/>)}</div>{order.couleurDessin&&<div style={{marginTop:8,fontSize:12,color:"#b8ac9e"}}>{order.couleurDessin}</div>}</div>}<div><div style={CS.label}>Supplément décoration <span style={{color:"#b0a098",fontWeight:400}}>+3€</span></div><p style={{fontSize:12,color:"#9a8f88",margin:"4px 0 10px"}}>Perle, feuille d'or, ruban…</p><button style={{...CS.toggleBtn,...(order.decoSupp?CS.toggleBtnOn:{})}} onClick={()=>up("decoSupp",!order.decoSupp)}>{order.decoSupp?"✦ Oui (+3€)":"Non merci"}</button></div></div>)}
        {actualStep==="Message & Photo"&&(<div><div style={{marginBottom:20}}><div style={CS.label}>Message <span style={{color:"#b0a098",fontWeight:400}}>(optionnel, max 60 car.)</span></div><div style={{position:"relative",marginTop:8}}><textarea style={CS.textarea} placeholder="Ex : Joyeux anniversaire Léa 🎉" value={order.message} maxLength={60} rows={2} onChange={e=>up("message",e.target.value)}/><span style={{position:"absolute",bottom:8,right:12,fontSize:11,color:"#c0b5ae"}}>{order.message.length}/60</span></div>{order.message&&<div style={{border:"1px dashed #d8c8c0",borderRadius:4,padding:"14px 16px",marginTop:8,background:"#fdf8f4"}}><span style={{fontSize:10,color:"#b8ac9e",textTransform:"uppercase",letterSpacing:"0.12em"}}>Aperçu</span><div style={{fontStyle:"italic",fontSize:16,color:"#4a3f3a",marginTop:4}}>{order.message}</div></div>}</div><div><div style={CS.label}>Photo de référence <span style={{color:"#b0a098",fontWeight:400}}>(optionnel)</span></div><div style={{...CS.dropzone,...(dragOver?CS.dropzoneOn:{})}} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}} onClick={()=>document.getElementById("fi").click()}>{order.photo?<img src={order.photo} alt="" style={{maxHeight:110,maxWidth:"100%",objectFit:"contain",borderRadius:4}}/>:<span style={{fontSize:13,color:"#b0a098",fontStyle:"italic"}}>Glissez une image ou cliquez</span>}</div><input id="fi" type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>{order.photoName&&<div style={{fontSize:11,color:"#b8ac9e",marginTop:6}}>{order.photoName}</div>}</div></div>)}
        {actualStep==="Livraison"&&(<div><div style={{marginBottom:16}}><div style={CS.label}>Mode de récupération</div><div style={{display:"flex",gap:8,marginTop:8}}>{["retrait","livraison"].map(opt=><button key={opt} style={{...CS.toggleBtn,...(order.pickup===opt?CS.toggleBtnOn:{})}} onClick={()=>up("pickup",opt)}>{opt==="retrait"?"🏪 Retrait boutique":"🚗 Livraison"}</button>)}</div></div><div style={{marginBottom:16}}><div style={CS.label}>Date souhaitée *</div><input type="date" style={{...CS.input,marginTop:6}} value={order.date} min={new Date().toISOString().split("T")[0]} onChange={e=>{const d=e.target.value;if(blockedDates[d]===0){alert("Cette date n'est pas disponible, veuillez en choisir une autre.");}else{up("date",d);}}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}><div><div style={CS.label}>Nom complet *</div><input style={{...CS.input,marginTop:6}} placeholder="Marie Martin" value={order.name} onChange={e=>up("name",e.target.value)}/></div><div><div style={CS.label}>Email *</div><input type="email" style={{...CS.input,marginTop:6}} placeholder="marie@email.com" value={order.email} onChange={e=>up("email",e.target.value)}/></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><div style={CS.label}>Téléphone</div><input type="tel" style={{...CS.input,marginTop:6}} placeholder="06 00 00 00 00" value={order.phone} onChange={e=>up("phone",e.target.value)}/></div><div><div style={CS.label}>Instagram <span style={{color:"#e8609a"}}>♥</span></div><input style={{...CS.input,marginTop:6}} placeholder="@moncompte" value={order.instagram} onChange={e=>up("instagram",e.target.value)}/></div></div><div style={{background:"#fdf0f5",border:"1px solid #f0c8d8",borderRadius:6,padding:"12px 14px",marginTop:16,fontSize:12,color:"#9a5070"}}>💝 En renseignant votre Instagram, vous cumulez des points de fidélité !</div></div>)}
        {actualStep==="Récapitulatif"&&(<div style={CS.recap}>{[{l:"Gâteau",v:`${product.name} — ${product.tagline}`},{l:"Forme",v:order.form},...(order.decoration?[{l:"Décoration",v:product.decorations?.find(d=>d.id===order.decoration)?.label}]:[]),{l:"Toppings",v:order.toppings.join(", ")||"Aucun"},{l:"Nappage",v:order.nappage||"Aucun"},{l:"Couleur lissage",v:order.couleurLissage||"—"},...(product.hasDessinColor?[{l:"Couleur dessins",v:order.couleurDessin||"—"}]:[]),{l:"Déco supp.",v:order.decoSupp?"Oui (+3€)":"Non"},{l:"Message",v:order.message||"Aucun"},{l:"Date",v:order.date},{l:"Mode",v:order.pickup==="retrait"?"Retrait boutique":"Livraison"},{l:"Nom",v:order.name},{l:"Email",v:order.email},{l:"Téléphone",v:order.phone||"—"},{l:"Instagram",v:order.instagram||"—"}].map(({l,v})=><div key={l} style={CS.recapRow}><span style={CS.recapL}>{l}</span><span style={CS.recapV}>{v}</span></div>)}{order.photo&&<div style={CS.recapRow}><span style={CS.recapL}>Photo réf.</span><img src={order.photo} alt="" style={{maxHeight:60,maxWidth:100,objectFit:"contain",borderRadius:3}}/></div>}<div style={{...CS.recapRow,background:"#faf8f5",fontWeight:600}}><span style={CS.recapL}>Prix estimé</span><span style={{color:"#b8ac9e",fontSize:16}}>{calcPrice()}</span></div></div>)}
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
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",fontSize:13,color:"#9a8880",marginBottom:28,fontStyle:"italic"}}>
          <span>{product.name}</span><span>·</span>{order.form&&<><span>{order.form}</span><span>·</span></>}<span>{order.date}</span><span>·</span><span style={{color:"#b8ac9e",fontWeight:600}}>{price}</span>
        </div>
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
  const [page,setPage]=useState("home");
  const [blockedDates,setBlockedDates]=useState({});

  useEffect(()=>{
    fetch("/api/blocked-dates").then(r=>r.json()).then(data=>{
      const config={};
      (data.dates||[]).forEach(d=>{config[d.date]=d.slots??0;});
      setBlockedDates(config);
    }).catch(()=>{});
  },[]);

  const handleSelect=(p)=>{
    setSelected(p);
    if(p.isLayerCake)setView("layersize");
    else if(p.isBox)setView("box");
    else setView("config");
  };
  const handleLayerSize=(sz)=>{
    setSelected({...sz,forms:["Cercle"],hasDecoration:false,hasLissage:true,hasDessinColor:false});
    setView("config");
  };
  const handleSubmit=(order,product,price)=>{
    setLastOrder(order);setLastPrice(price);setSelected(product);setView("success");
  };
  const handleNew=()=>{setSelected(null);setLastOrder(null);setView("home");};

  if(view==="layersize")return<LayerCakeSelector onSelectSize={handleLayerSize} onBack={()=>setView("home")}/>;
  if(view==="config"&&selected)return<Configurator product={selected} onBack={()=>setView("home")} onSubmit={handleSubmit} blockedDates={blockedDates}/>;
  if(view==="box")return<BoxConfigurator onBack={()=>setView("home")} onSubmit={handleSubmit} blockedDates={blockedDates}/>;
  if(view==="success")return<Success order={lastOrder} product={selected} price={lastPrice} onNew={handleNew}/>;

  return (
    <div style={{minHeight:"100vh",background:"#faf8f5",fontFamily:"Georgia,serif"}}>
      <Sidebar page={page} setPage={setPage} onOrder={handleSelect}/>
      <Hero onOrder={()=>document.getElementById("catalog-section")?.scrollIntoView({behavior:"smooth"})}/>
      <CatalogSection onSelect={handleSelect}/>
      <LoyaltySection/>
      <div style={{background:"#fdf0f5",padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:13,color:"#9a5070",letterSpacing:"0.08em",marginBottom:6}}>📸 Suivez nos créations</div>
        <a href="https://instagram.com/monjolidessert" style={{fontSize:18,color:"#c9376a",fontWeight:600,fontStyle:"italic",textDecoration:"none"}}>@monjolidessert</a>
      </div>
      <footer style={{padding:"24px",textAlign:"center",fontSize:11,color:"#b0a098",letterSpacing:"0.1em",borderTop:"1px solid #e8e0d8"}}>© 2026 Mon Joli Dessert · Artisan pâtissier</footer>
    </div>
  );
}

// ─── STYLES CONFIGURATEUR ─────────────────────────────────────────────────────
const CS = {
  page:{minHeight:"100vh",background:"#faf8f5",fontFamily:"Georgia,serif",color:"#2a2020",display:"flex",flexDirection:"column"},
  header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",background:"#fff",borderBottom:"1px solid #e8e0d8",gap:12},
  headerTitle:{fontSize:18,fontWeight:600,color:"#2a1810"},
  headerSub:{fontSize:12,color:"#9a8880"},
  price:{fontSize:18,color:"#b8ac9e",fontWeight:700},
  backBtn:{background:"none",border:"1.5px solid #e8e0d8",borderRadius:4,padding:"8px 16px",cursor:"pointer",fontSize:13,color:"#6a5f5a",fontFamily:"inherit"},
  stepsBar:{display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 24px 4px",gap:0},
  stepDot:{width:28,height:28,borderRadius:"50%",border:"1.5px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#b0a098",background:"#fff",flexShrink:0},
  stepDotOn:{background:"#b8ac9e",borderColor:"#b8ac9e",color:"#fff"},
  stepLine:{width:24,height:1.5,background:"#e0d8d0"},
  stepLineOn:{background:"#b8ac9e"},
  card:{background:"#fff",borderRadius:6,border:"1px solid #e8e0d8",padding:"32px 28px 24px",margin:"0 16px 16px",boxShadow:"0 2px 16px rgba(0,0,0,0.04)"},
  hint:{fontSize:14,color:"#8a7f78",marginBottom:18,margin:"0 0 18px"},
  label:{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#9a8880",fontWeight:600},
  input:{width:"100%",border:"1.5px solid #e8e0d8",borderRadius:4,padding:"10px 13px",fontSize:14,fontFamily:"Georgia,serif",background:"#faf8f5",color:"#2a2020",outline:"none",boxSizing:"border-box"},
  textarea:{width:"100%",border:"1.5px solid #e8e0d8",borderRadius:4,padding:"12px 14px",fontSize:14,fontFamily:"Georgia,serif",background:"#faf8f5",resize:"none",outline:"none",color:"#2a2020",boxSizing:"border-box",lineHeight:1.6},
  formBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"20px 28px",border:"1.5px solid #e8e0d8",borderRadius:6,background:"#faf8f5",cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",minWidth:100},
  formBtnOn:{border:"1.5px solid #b8ac9e",background:"#f5f0eb"},
  decoBtn:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",border:"1.5px solid #e8e0d8",borderRadius:6,background:"#faf8f5",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.18s"},
  decoBtnOn:{border:"1.5px solid #b8ac9e",background:"#f5f0eb"},
  toggleBtn:{padding:"10px 18px",border:"1.5px solid #e8e0d8",borderRadius:4,background:"#faf8f5",cursor:"pointer",fontSize:13,fontFamily:"inherit",color:"#6a5f5a",transition:"all 0.18s"},
  toggleBtnOn:{border:"1.5px solid #b8ac9e",background:"#f5f0eb",color:"#3a2e28",fontWeight:600},
  dropzone:{border:"1.5px dashed #d8c8c0",borderRadius:4,padding:"28px",textAlign:"center",cursor:"pointer",background:"#faf8f5",minHeight:90,display:"flex",alignItems:"center",justifyContent:"center",marginTop:8},
  dropzoneOn:{border:"1.5px dashed #b8ac9e",background:"#f5f0eb"},
  recap:{border:"1px solid #e8e0d8",borderRadius:6,overflow:"hidden"},
  recapRow:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",borderBottom:"1px solid #f5f0eb",gap:12},
  recapL:{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9a8880",flexShrink:0},
  recapV:{fontSize:13,color:"#2a2020",textAlign:"right"},
  nav:{display:"flex",alignItems:"center",gap:10,paddingTop:20,marginTop:8,borderTop:"1px solid #f0ebe4"},
  btnPri:{background:"#3a2e28",color:"#fff",border:"none",borderRadius:4,padding:"13px 28px",fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer",letterSpacing:"0.05em"},
  btnSec:{background:"transparent",color:"#6a5f5a",border:"1.5px solid #e0d8d0",borderRadius:4,padding:"11px 20px",fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer"},
  btnDis:{background:"#c8c0bc",cursor:"not-allowed"},
};
