import { useState, useEffect } from "react";

const navy = "#0F1D42", blue = "#2563EB", gold = "#C9963F", green = "#059669", white = "#FFFFFF";

function Btn({ children, variant = "primary", href, onClick }) {
  const [h, setH] = useState(false);
  const base = { display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", border:"none", fontFamily:"inherit", textDecoration:"none", transition:"all .2s", whiteSpace:"nowrap" };
  const s = {
    gold: { ...base, background:h?"#B8832E":gold, color:white, boxShadow:h?"0 8px 32px rgba(201,150,63,.45)":"0 4px 16px rgba(201,150,63,.25)", transform:h?"translateY(-2px)":"none" },
    ghost: { ...base, background:h?"rgba(255,255,255,.12)":"rgba(255,255,255,.07)", color:white, border:"1px solid rgba(255,255,255,.15)" },
    outline: { ...base, background:"transparent", color:h?blue:"#475569", border:`1.5px solid ${h?blue:"#CBD5E1"}` },
    navy: { ...base, background:h?"#162554":navy, color:white },
    blue_solid: { ...base, background:h?"#1D4ED8":blue, color:white },
  };
  const p = { style:s[variant]||s.gold, onClick, onMouseEnter:()=>setH(true), onMouseLeave:()=>setH(false) };
  return href ? <a href={href} {...p}>{children}</a> : <button {...p}>{children}</button>;
}

function Card({ children, style={}, hover={} }) {
  const [h, setH] = useState(false);
  return <div style={{...style,...(h?hover:{})}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</div>;
}

const Chk = ({c=green}) => <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill={c===green?"#DCFCE7":"#EFF6FF"}/><path d="M6 10l3 3 5-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Xmark = () => <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#F1F5F9"/><path d="M7 7l6 6M13 7l-6 6" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/></svg>;

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:open?white:"#FAFBFC", border:"1px solid #E2E8F0", borderRadius:12, overflow:"hidden" }}>
      <button onClick={()=>setOpen(!open)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontSize:15, fontWeight:600, color:navy }}>{q}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink:0, transform:open?"rotate(180deg)":"none", transition:"transform .2s" }}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && <div style={{ padding:"0 24px 18px", fontSize:14, color:"#475569", lineHeight:1.75 }}>{a}</div>}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ nom:"", ecole:"", email:"", tel:"", eleves:"", message:"" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://formsubmit.co/ajax/info@luxeduschool.com", {
        method:"POST",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify({ ...form, _subject:"Demande demo LuxEdu — "+form.ecole, _captcha:"false", _template:"table" })
      });
    } catch(e) {}
    setSent(true);
    setLoading(false);
  };

  const inp = { width:"100%", padding:"13px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,.12)", background:"rgba(255,255,255,.06)", color:white, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, fontWeight:600, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:6, display:"block" };

  if (sent) return (
    <div style={{ textAlign:"center", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:20, padding:48 }}>
      <div style={{ width:56, height:56, borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h3 style={{ fontSize:24, fontWeight:800, color:white, margin:"0 0 14px" }}>Demande envoyee !</h3>
      <p style={{ fontSize:16, color:"rgba(255,255,255,.55)", lineHeight:1.7, maxWidth:420, margin:"0 auto" }}>Notre equipe vous contactera sous 24h pour organiser votre demonstration personnalisee de 30 minutes.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:20, padding:40 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Votre nom *</label><input required style={inp} placeholder="Mohamed Alami" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} /></div>
        <div><label style={lbl}>Nom de votre ecole *</label><input required style={inp} placeholder="Ecole Al Farabi" value={form.ecole} onChange={e=>setForm({...form,ecole:e.target.value})} /></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Email professionnel *</label><input required type="email" style={inp} placeholder="directeur@ecole.ma" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
        <div><label style={lbl}>WhatsApp *</label><input required style={inp} placeholder="+212 6XX XXX XXX" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} /></div>
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={lbl}>Nombre d eleves approximatif</label>
        <select style={{...inp, cursor:"pointer"}} value={form.eleves} onChange={e=>setForm({...form,eleves:e.target.value})}>
          <option value="" style={{background:"#0F1D42"}}>Selectionnez</option>
          {["Moins de 100","100 a 200","200 a 400","400 a 600","Plus de 600"].map(o=><option key={o} value={o} style={{background:"#0F1D42"}}>{o} eleves</option>)}
        </select>
      </div>
      <div style={{ marginBottom:28 }}>
        <label style={lbl}>Message (optionnel)</label>
        <textarea style={{...inp, height:90, resize:"vertical"}} placeholder="Decrivez vos besoins..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
      </div>
      <button type="submit" disabled={loading} style={{ width:"100%", padding:"15px", borderRadius:10, background:loading?"#8B6914":gold, color:white, fontSize:16, fontWeight:700, cursor:loading?"not-allowed":"pointer", border:"none", fontFamily:"inherit", transition:"all .2s" }}>
        {loading ? "Envoi en cours..." : "Envoyer ma demande de demonstration"}
      </button>
      <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,.3)", marginTop:14 }}>Reponse garantie sous 24h — Aucun engagement</p>
    </form>
  );
}

export default function LandingPage() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color:"#1e293b", overflowX:"hidden" }}>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:sc?"rgba(255,255,255,.96)":"transparent", backdropFilter:sc?"blur(16px)":"none", borderBottom:sc?"1px solid #e8edf5":"none", transition:"all .3s", padding:"0 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:76 }}>
          <a href="#" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
            <img src={sc?"/luxedu-logo.png":"/luxedu-logo-white.png"} alt="LuxEdu" style={{ height:58, width:"auto" }} />
            <span style={{ fontSize:22, fontWeight:900, color:sc?navy:white, fontFamily:"Georgia,serif", letterSpacing:"-0.5px" }}>LuxEdu</span>
          </a>
          <div style={{ display:"flex", gap:4 }}>
            {["Fonctionnalites","Tarifs","Demonstration"].map(l=>(
              <a key={l} href="#" style={{ padding:"8px 16px", borderRadius:8, fontSize:14, fontWeight:500, color:sc?"#475569":"rgba(255,255,255,.7)", textDecoration:"none" }}>{l}</a>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" href="/login">Se connecter</Btn>
            <Btn variant="gold" href="#contact">Demander une demo</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", background:`linear-gradient(140deg,#0a1628 0%,${navy} 45%,#162554 100%)`, position:"relative", display:"flex", alignItems:"center", overflow:"hidden", paddingTop:76 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.04) 1px,transparent 0)", backgroundSize:"48px 48px" }} />
        <div style={{ position:"absolute", top:"15%", right:"8%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,150,63,.1) 0%,transparent 65%)" }} />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 5%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", width:"100%" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,150,63,.15)", border:"1px solid rgba(201,150,63,.3)", borderRadius:100, padding:"6px 18px", marginBottom:28 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:gold }} />
              <span style={{ fontSize:12, fontWeight:700, color:gold, letterSpacing:".1em", textTransform:"uppercase" }}>Plateforme ERP Scolaire — Maroc 2026</span>
            </div>
            <h1 style={{ fontSize:60, fontWeight:900, color:white, lineHeight:1.04, letterSpacing:"-2.5px", margin:"0 0 24px" }}>
              La plateforme qui<br/><span style={{ color:gold }}>modernise</span><br/>votre ecole.
            </h1>
            <p style={{ fontSize:18, color:"rgba(255,255,255,.58)", lineHeight:1.75, marginBottom:40, maxWidth:500 }}>
              Presences, paiements, notes, bulletins, WhatsApp, orientation BAC et app mobile. Tout ce dont votre ecole a besoin, en une seule plateforme 100% marocaine.
            </p>
            <div style={{ display:"flex", gap:14, marginBottom:40 }}>
              <Btn variant="gold" href="#contact">Demander une demonstration</Btn>
              <Btn variant="ghost" href="/login">Voir la demo ERP</Btn>
            </div>
            <div style={{ display:"flex", gap:0 }}>
              {[["Deploiement 24h","#4ADE80"],["Code Massar MEN","#60A5FA"],["Sans engagement","#F59E0B"]].map(([t,c],i)=>(
                <div key={t} style={{ display:"flex", alignItems:"center", gap:7, paddingRight:i<2?20:0, marginRight:i<2?20:0, borderRight:i<2?"1px solid rgba(255,255,255,.1)":"none" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:c }} />
                  <span style={{ fontSize:13, color:"rgba(255,255,255,.5)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", top:-24, right:-24, background:white, borderRadius:14, padding:"14px 18px", boxShadow:"0 24px 64px rgba(0,0,0,.2)", zIndex:3 }}>
              <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:4 }}>Recouvrement</div>
              <div style={{ fontSize:26, fontWeight:800, color:green }}>+35%</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>vs mois dernier</div>
            </div>
            <div style={{ position:"absolute", bottom:50, left:-28, background:navy, borderRadius:14, padding:"14px 18px", boxShadow:"0 24px 64px rgba(0,0,0,.3)", zIndex:3, border:"1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600, marginBottom:4 }}>WhatsApp envoyes</div>
              <div style={{ fontSize:22, fontWeight:800, color:gold }}>1 248</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.25)" }}>ce mois — 0 MAD</div>
            </div>
            <div style={{ position:"absolute", bottom:-20, right:40, background:white, borderRadius:12, padding:"12px 16px", boxShadow:"0 16px 40px rgba(0,0,0,.15)", zIndex:3, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:navy }}>Reclamation traitee</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>il y a 2 minutes</div>
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", borderRadius:18, overflow:"hidden", boxShadow:"0 48px 96px rgba(0,0,0,.45)" }}>
              <div style={{ background:"rgba(255,255,255,.05)", padding:"11px 16px", display:"flex", alignItems:"center", gap:8 }}>
                {["#FF5F57","#FEBC2E","#28C840"].map(c=><div key={c} style={{ width:11, height:11, borderRadius:"50%", background:c }} />)}
                <div style={{ flex:1, background:"rgba(255,255,255,.05)", borderRadius:6, padding:"4px 12px", fontSize:11, color:"rgba(255,255,255,.25)", marginLeft:8 }}>luxeduschool.com/app</div>
              </div>
              <div style={{ display:"flex" }}>
                <div style={{ width:170, background:navy, padding:"18px 14px", minHeight:300 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:gold, letterSpacing:".05em", marginBottom:4 }}>LuxEdu</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginBottom:18 }}>Espace Directeur</div>
                  {[["Tableau de bord",true],["Tous les eleves",false],["Notes",false],["Paiements",false],["Reclamations",false]].map(([item,active])=>(
                    <div key={item} style={{ padding:"8px 10px", borderRadius:8, fontSize:11, color:active?white:"rgba(255,255,255,.4)", background:active?"rgba(255,255,255,.11)":"transparent", marginBottom:3, fontWeight:active?600:400 }}>{item}</div>
                  ))}
                </div>
                <div style={{ flex:1, padding:18, background:"#F8FAFC" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:navy, marginBottom:12 }}>Tableau de bord</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
                    {[["248","Eleves",blue],["94%","Presence",green],["86%","Recouvr.",gold],["3","Alertes","#EF4444"]].map(([v,l,c])=>(
                      <div key={l} style={{ background:white, borderRadius:8, padding:"8px 6px", textAlign:"center", border:"1px solid #f1f5f9" }}>
                        <div style={{ fontSize:16, fontWeight:700, color:c }}>{v}</div>
                        <div style={{ fontSize:9, color:"#94a3b8" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:white, borderRadius:8, padding:10, border:"1px solid #f1f5f9" }}>
                    <div style={{ fontSize:10, color:"#94a3b8", marginBottom:6 }}>Recouvrement mensuel</div>
                    <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:44 }}>
                      {[30,42,48,45,58,62,55,70,66,72,78,85].map((h,i)=>(
                        <div key={i} style={{ flex:1, background:i===11?blue:i>8?"#BFDBFE":"#E2E8F0", borderRadius:"2px 2px 0 0", height:`${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background:white, borderBottom:"1px solid #f1f5f9", padding:"24px 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-around", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          {[["Nouveau en 2026","Lancement officiel"],["30 jours","Demonstration gratuite"],["24h","Deploiement garanti"],["100% Maroc","Concu pour vous"],["0 MAD","WhatsApp inclus"]].map(([v,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:navy, letterSpacing:"-0.5px" }}>{v}</div>
              <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section style={{ padding:"90px 5%", background:"#F8FAFC" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <span style={{ display:"inline-block", background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:100, padding:"5px 18px", fontSize:12, fontWeight:700, color:blue, marginBottom:14, letterSpacing:".06em", textTransform:"uppercase" }}>Pourquoi LuxEdu</span>
            <h2 style={{ fontSize:42, fontWeight:900, color:navy, letterSpacing:"-1.5px", margin:"0 0 14px" }}>Fini les outils disperses.</h2>
            <p style={{ fontSize:17, color:"#64748b", maxWidth:500, margin:"0 auto", lineHeight:1.7 }}>LuxEdu remplace 5 outils differents par une seule plateforme pensee pour le Maroc.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:20, padding:"32px 36px" }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#DC2626", textTransform:"uppercase", letterSpacing:".12em", marginBottom:22 }}>Sans LuxEdu</div>
              {["Excel pour les paiements — erreurs et retards","SMS a 0.35 MAD piece pour les parents","Bulletins imprimes et distribues manuellement","Absences sur cahier — parents non informes","Aucune visibilite sur le recouvrement","3 logiciels qui ne communiquent pas","Pas de portail parents ni application mobile"].map(t=>(
                <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                  <Xmark />
                  <span style={{ fontSize:14, color:"#7F1D1D", lineHeight:1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:20, padding:"32px 36px" }}>
              <div style={{ fontSize:12, fontWeight:800, color:green, textTransform:"uppercase", letterSpacing:".12em", marginBottom:22 }}>Avec LuxEdu</div>
              {["Paiements suivis, relances WhatsApp automatiques","WhatsApp gratuit — taux d ouverture 95%","Bulletins PDF generes et envoyes en 1 clic","Absence enregistree — parent alerte en 2 minutes","Dashboard temps reel — recouvrement et presences","Tout centralise : notes, paiements, RH, parents","App mobile iPhone et Android pour parents et eleves"].map(t=>(
                <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                  <Chk />
                  <span style={{ fontSize:14, color:"#14532D", lineHeight:1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"90px 5%", background:white }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <span style={{ display:"inline-block", background:"#FFF7ED", border:"1px solid #FED7AA", borderRadius:100, padding:"5px 18px", fontSize:12, fontWeight:700, color:"#EA580C", marginBottom:14, textTransform:"uppercase", letterSpacing:".06em" }}>31 Modules</span>
            <h2 style={{ fontSize:42, fontWeight:900, color:navy, letterSpacing:"-1.5px", margin:"0 0 14px" }}>Tout ce dont votre ecole a besoin.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { c:blue, bg:"#EFF6FF", bc:"#BFDBFE", t:"Dashboard Analytique", d:"KPIs en temps reel : recouvrement, presences, alertes. Prenez les meilleures decisions.", icon:<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
              { c:"#25D366", bg:"#F0FDF4", bc:"#BBF7D0", t:"WhatsApp Natif — 0 MAD", d:"Alertes absences, rappels paiements, bulletins envoyes automatiquement aux parents.", icon:<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></> },
              { c:"#7C3AED", bg:"#F5F3FF", bc:"#DDD6FE", t:"App Mobile Parents", d:"Notes, absences et paiements sur iPhone et Android. Parents informes en temps reel.", icon:<><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="#7C3AED"/></> },
              { c:green, bg:"#F0FDF4", bc:"#BBF7D0", t:"Gestion des Presences", d:"Pointage par classe en 2 minutes. Parent notifie automatiquement des labsence.", icon:<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></> },
              { c:gold, bg:"#FFFBEB", bc:"#FDE68A", t:"Bulletins PDF en 1 clic", d:"Generation automatique conforme MEN. Envoi WhatsApp a tous les parents en quelques secondes.", icon:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
              { c:"#E11D48", bg:"#FFF1F2", bc:"#FFE4E6", t:"Reclamations Parents", d:"Les parents soumettent leurs reclamations depuis lapp. Le directeur les traite en temps reel.", icon:<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
              { c:"#0D9488", bg:"#F0FDFA", bc:"#99F6E4", t:"Tawjih BAC — Orientation IA", d:"Analyse les notes de chaque eleve. Recommande CPGE, ENSA, universites Maroc et international.", icon:<><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></> },
              { c:blue, bg:"#EFF6FF", bc:"#BFDBFE", t:"Paiements et Recouvrement", d:"Suivi mensuel par eleve. RIB virement bancaire integre. Relances automatiques pour impayes.", icon:<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></> },
              { c:"#7C3AED", bg:"#F5F3FF", bc:"#DDD6FE", t:"Espace Etudiant", d:"Notes, devoirs, emploi du temps et messages des professeurs. Accessible sur mobile.", icon:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
            ].map(f=>(
              <Card key={f.t}
                style={{ background:white, border:"1px solid #E2E8F0", borderRadius:16, padding:28, transition:"all .2s", cursor:"default" }}
                hover={{ transform:"translateY(-4px)", boxShadow:"0 16px 40px rgba(0,0,0,.08)", borderColor:f.bc }}>
                <div style={{ width:48, height:48, background:f.bg, border:`1px solid ${f.bc}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:navy, marginBottom:8 }}>{f.t}</div>
                <div style={{ fontSize:14, color:"#64748b", lineHeight:1.7 }}>{f.d}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO BANNER */}
      <section style={{ padding:"0 5% 80px", background:white }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ background:"linear-gradient(135deg,#EFF6FF,#F0FDF4)", border:"1px solid #BFDBFE", borderRadius:20, padding:"36px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:32 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:blue, textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Demonstration interactive</div>
              <h3 style={{ fontSize:24, fontWeight:800, color:navy, margin:"0 0 8px", letterSpacing:"-0.5px" }}>Voyez LuxEdu en action maintenant</h3>
              <p style={{ fontSize:15, color:"#64748b", margin:0, lineHeight:1.6 }}>Explorez sans inscription. Demo parent, etudiant et directeur disponibles immediatement.</p>
            </div>
            <div style={{ display:"flex", gap:12, flexShrink:0 }}>
              <a href="/demo" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 22px", borderRadius:10, background:navy, color:white, fontWeight:700, fontSize:14, textDecoration:"none" }}>Demo mobile</a>
              <a href="/login" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 22px", borderRadius:10, background:blue, color:white, fontWeight:700, fontSize:14, textDecoration:"none" }}>Demo ERP directeur</a>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding:"80px 5%", background:"#F8FAFC" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <h2 style={{ fontSize:40, fontWeight:900, color:navy, letterSpacing:"-1.5px", margin:"0 0 12px" }}>3 fois moins cher. Infiniment plus complet.</h2>
            <p style={{ fontSize:16, color:"#64748b" }}>Comparaison avec les solutions existantes au Maroc</p>
          </div>
          <div style={{ border:"1px solid #E2E8F0", borderRadius:20, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", background:navy }}>
              <div style={{ padding:"16px 24px", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".08em" }}>Fonctionnalite</div>
              <div style={{ padding:"16px 24px", textAlign:"center" }}><img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height:26, width:"auto" }} /></div>
              <div style={{ padding:"16px 24px", fontSize:13, fontWeight:700, color:"rgba(255,255,255,.45)", textAlign:"center" }}>Concurrents Maroc</div>
            </div>
            {[
              ["WhatsApp natif — 0 MAD",true,false],
              ["Code Massar MEN integre",true,false],
              ["Orientation Tawjih BAC (IA)",true,false],
              ["App mobile parents incluse",true,"Option payante"],
              ["Gestion reclamations parents",true,false],
              ["Espace etudiant avec messagerie",true,false],
              ["Formation incluse",true,false],
              ["Deploiement en 24 heures",true,false],
              ["Support en francais",true,true],
              ["Tarif annuel 200 eleves","3 490 MAD","7 900–12 000 MAD"],
            ].map(([feat,lux,comp],i)=>(
              <div key={feat} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", background:i%2===0?"#FAFBFC":white, borderTop:"1px solid #F1F5F9" }}>
                <div style={{ padding:"13px 24px", fontSize:14, color:"#374151", fontWeight:500 }}>{feat}</div>
                <div style={{ padding:"13px 24px", display:"flex", justifyContent:"center", alignItems:"center" }}>{lux===true?<Chk />:<span style={{ fontSize:13, fontWeight:800, color:blue }}>{lux}</span>}</div>
                <div style={{ padding:"13px 24px", display:"flex", justifyContent:"center", alignItems:"center" }}>{comp===true?<Chk c={blue}/>:comp===false?<Xmark/>:<span style={{ fontSize:12, color:"#EA580C", fontWeight:600 }}>{comp}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"80px 5%", background:white }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontSize:38, fontWeight:900, color:navy, letterSpacing:"-1.5px", margin:"0 0 12px" }}>Operationnel en 24 heures, garanti.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[{n:"01",t:"Demo gratuite",d:"30 minutes en ligne. On vous montre LuxEdu sur un exemple concret de votre ecole.",c:blue},{n:"02",t:"Configuration",d:"Import de vos classes, eleves et tarifs. Votre espace pret en quelques heures.",c:"#7C3AED"},{n:"03",t:"Formation",d:"2 heures pour directeur, enseignants et fonctionnaires. Manuel complet fourni.",c:gold},{n:"04",t:"Mise en ligne",d:"Votre ecole est operationnelle. Support dedie pendant 30 jours.",c:green}].map(s=>(
              <div key={s.n} style={{ background:"#F8FAFC", borderRadius:16, padding:"24px 20px", border:"1px solid #E2E8F0", position:"relative", overflow:"hidden" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:s.c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:white, marginBottom:14, position:"relative", zIndex:1 }}>{s.n}</div>
                <div style={{ fontSize:50, fontWeight:900, color:s.c, opacity:.07, position:"absolute", top:-8, right:8, lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:15, fontWeight:700, color:navy, marginBottom:8 }}>{s.t}</div>
                <div style={{ fontSize:13, color:"#64748b", lineHeight:1.65 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"80px 5%", background:"#F8FAFC" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontSize:38, fontWeight:900, color:navy, letterSpacing:"-1.5px", margin:"0 0 12px" }}>Ce que disent nos premiers clients</h2>
            <p style={{ fontSize:15, color:"#64748b" }}>Ecoles pilotes ayant teste LuxEdu en avant-premiere</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {[{i:"MB",bg:navy,n:"Mohamed Benjelloun",r:"Directeur — Casablanca",t:"Notre taux de recouvrement est passe de 52% a 91% en six semaines. Les rappels WhatsApp automatiques ont tout change."},{i:"KA",bg:blue,n:"Khadija El Alami",r:"Responsable admin. — Rabat",t:"La plateforme remplace cinq outils differents. Bulletins, presences, paiements — tout centralise. Formation en 2h."},{i:"YT",bg:"#0D9488",n:"Youssef Tazi",r:"Directeur — Marrakech",t:"Deploiement en une journee, support reactif, interface claire. Les parents nous felicitent pour notre communication."}].map(t=>(
              <Card key={t.n} style={{ background:white, borderRadius:20, padding:28, border:"1px solid #E2E8F0", transition:"all .2s" }} hover={{ transform:"translateY(-4px)", boxShadow:"0 16px 40px rgba(0,0,0,.08)" }}>
                <div style={{ display:"flex", gap:2, marginBottom:16 }}>{Array(5).fill(0).map((_,i)=><span key={i} style={{ color:"#FBBF24", fontSize:16 }}>★</span>)}</div>
                <p style={{ fontSize:15, color:"#374151", lineHeight:1.75, marginBottom:24, fontStyle:"italic" }}>"{t.t}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:white }}>{t.i}</div>
                  <div><div style={{ fontSize:14, fontWeight:700, color:navy }}>{t.n}</div><div style={{ fontSize:12, color:"#64748b" }}>{t.r}</div></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding:"80px 5%", background:white }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <h2 style={{ fontSize:38, fontWeight:900, color:navy, letterSpacing:"-1.5px", margin:"0 0 12px" }}>Simple, transparent, sans surprise.</h2>
            <p style={{ fontSize:15, color:"#64748b", maxWidth:440, margin:"0 auto 12px" }}>Facture annuellement. Setup offert la 1ere annee.</p>
          </div>
          <div style={{ background:`linear-gradient(135deg,${navy},#1a3a8f)`, borderRadius:16, padding:"20px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:white, marginBottom:4 }}>Obtenez votre demonstration personnalisee</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,.45)" }}>Demonstration 30 min · Reponse sous 24h · Aucun engagement</div>
            </div>
            <Btn variant="gold" href="#contact">Demander une demo</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {[
              {n:"Starter",badge:"Petites ecoles",bb:"#F1F5F9",bc:"#475569",setup:"Setup gratuit — prix fondateur",price:"990",fullPrice:"3 490",per:"MAD/an · 150 eleves",feats:["Inscriptions et paiements","WhatsApp automatique","Bulletins et certificats","Emploi du temps","Support e-mail 48h"],featured:false},
              {n:"Essentiel",badge:"Recommande",bb:blue,bc:white,setup:"Setup gratuit — prix fondateur",price:"1 990",fullPrice:"5 490",per:"MAD/an · 300 eleves",feats:["Tout Starter inclus","Portail parents + App mobile","Reclamations parents","Analytics avances","CRM Prospects","Formation 2h incluse","Support prioritaire"],featured:true},
              {n:"Pro",badge:"Grandes ecoles",bb:"#FFF7ED",bc:"#EA580C",setup:"Setup gratuit — prix fondateur",price:"2 990",fullPrice:"8 990",per:"MAD/an · Illimite",feats:["Tout Essentiel inclus","Multi-etablissements","Orientation IA Tawjih","Formation 4h equipe","Support 24/7"],featured:false},
            ].map(p=>(
              <div key={p.n} style={{ background:p.featured?navy:white, borderRadius:20, padding:32, border:p.featured?"none":"1px solid #E2E8F0", boxShadow:p.featured?"0 24px 64px rgba(15,29,66,.3)":"none", position:"relative", overflow:"hidden" }}>
                {p.featured && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${blue},${gold})` }} />}
                <div style={{ display:"inline-block", background:p.bb, color:p.bc, fontSize:11, fontWeight:700, borderRadius:100, padding:"4px 12px", marginBottom:18 }}>{p.badge}</div>
                <div style={{ fontSize:12, color:p.featured?"rgba(255,255,255,.35)":"#94a3b8", marginBottom:4 }}>{p.setup}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:2 }}>
                  <div style={{ fontSize:46, fontWeight:900, color:p.featured?white:navy, letterSpacing:"-2px", lineHeight:1 }}>{p.price}</div>
                </div>
                <div style={{ fontSize:13, color:p.featured?"rgba(255,255,255,.3)":"#94a3b8", textDecoration:"line-through", marginBottom:2 }}>{p.fullPrice} MAD/an tarif normal</div>
                <div style={{ fontSize:13, color:p.featured?"rgba(255,255,255,.4)":"#94a3b8", marginBottom:26 }}>{p.per}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:26 }}>
                  {p.feats.map(f=>(
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Chk c={p.featured?"#4ADE80":green} />
                      <span style={{ fontSize:14, color:p.featured?"rgba(255,255,255,.78)":"#374151" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Btn variant={p.featured?"gold":"outline"} href="#contact">Demander une demo</Btn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"80px 5%", background:"#F8FAFC" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <h2 style={{ fontSize:36, fontWeight:900, color:navy, letterSpacing:"-1.5px", margin:"0 0 12px" }}>Questions frequentes</h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              ["Combien de temps pour deployer LuxEdu ?","24 heures maximum. Nous nous occupons de tout : creation de votre compte, import de vos eleves, configuration et formation de votre equipe."],
              ["Y a-t-il un engagement ou contrat ?","Non. Demonstration gratuite sans carte bancaire. Abonnement annuel resiliable. Vous restez parce que ca marche."],
              ["Les parents doivent-ils installer une application ?","Non obligatoire. Application web depuis le navigateur du telephone. Une version Android est aussi disponible sur Google Play."],
              ["LuxEdu est-il compatible avec Massar MEN ?","Oui. LuxEdu integre nativement le code Massar, la saisie des notes et export au format officiel du Ministere de l Education Nationale."],
              ["Que se passe-t-il si j ai plus de 300 eleves ?","Choisissez le plan Pro (illimite). Vous pouvez evoluer a tout moment sans perte de donnees."],
              ["Le support est-il disponible en arabe ?","Support assure en francais et en arabe. Reponse sous 48h pour Starter, sous 4h pour Essentiel et Pro."],
            ].map(([q,a])=><FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" style={{ padding:"96px 5%", background:`linear-gradient(140deg,#0a1628 0%,${navy} 50%,#162554 100%)`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.025) 1px,transparent 0)", backgroundSize:"48px 48px" }} />
        <div style={{ maxWidth:640, margin:"0 auto", position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height:68, width:"auto", marginBottom:20, opacity:.9 }} />
            <h2 style={{ fontSize:40, fontWeight:900, color:white, letterSpacing:"-1.5px", margin:"0 0 14px" }}>Demandez votre demonstration</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,.5)", lineHeight:1.7 }}>Notre equipe vous contacte sous 24h pour organiser une demonstration personnalisee de 30 minutes sur votre ecole.</p>
          </div>
          <ContactForm />
          <div style={{ display:"flex", justifyContent:"center", marginTop:24 }}>
            <a href="https://wa.me/212666490261?text=Bonjour%20LuxEdu" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:600, color:white, border:"1px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.05)", textDecoration:"none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#080F20", padding:"52px 5% 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:44 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height:44, width:"auto", opacity:.85 }} />
                <span style={{ fontSize:18, fontWeight:900, color:white, fontFamily:"Georgia,serif" }}>LuxEdu</span>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.28)", lineHeight:1.7, maxWidth:260 }}>La solution ERP scolaire concue pour les ecoles privees du Maroc.</p>
              <div style={{ marginTop:14, fontSize:13, color:"rgba(255,255,255,.25)" }}>info@luxeduschool.com</div>
            </div>
            {[{t:"Produit",ls:["Fonctionnalites","Tarifs","Modules","App Android","Portail parents"]},{t:"Ressources",ls:["Documentation","Guide demarrage","FAQ","Support"]},{t:"Contact",ls:["WhatsApp","E-mail","Demonstration","A propos"]}].map(col=>(
              <div key={col.t}>
                <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:14 }}>{col.t}</div>
                {col.ls.map(l=><div key={l} style={{ fontSize:13, color:"rgba(255,255,255,.35)", marginBottom:9 }}><a href="#" style={{ color:"inherit", textDecoration:"none" }}>{l}</a></div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:22, display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,.18)" }}>
            <span>© 2026 LuxEdu · luxeduschool.com · Maroc</span>
            <div style={{ display:"flex", gap:20 }}>{["Mentions legales","Confidentialite"].map(l=><a key={l} href="#" style={{ color:"inherit", textDecoration:"none" }}>{l}</a>)}</div>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/212666490261?text=Bonjour%20LuxEdu" target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed", bottom:28, right:28, zIndex:1000, width:56, height:56, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 24px rgba(37,211,102,.45)", textDecoration:"none" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
}
