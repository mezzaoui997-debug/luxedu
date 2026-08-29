import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const navy = "#0F1D42", blue = "#2563EB", gold = "#C9963F", green = "#059669", white = "#FFFFFF";

const DEMO_SCHOOL = { id:"cmo3ot7y700009lupl6zsfzbp", name:"Ecole Excellence Casablanca", city:"Casablanca" };
const DEMO_USERS = {
  DIRECTOR:      { id:"d1", firstName:"Ahmed",  lastName:"Benali", role:"DIRECTOR",      schoolId:"cmo3ot7y700009lupl6zsfzbp", email:"directeur@demo.ma" },
  TEACHER:       { id:"d2", firstName:"Sara",   lastName:"Alami",  role:"TEACHER",       schoolId:"cmo3ot7y700009lupl6zsfzbp", email:"enseignant@demo.ma" },
  FONCTIONNAIRE: { id:"d3", firstName:"Fatima", lastName:"Benali", role:"FONCTIONNAIRE", schoolId:"cmo3ot7y700009lupl6zsfzbp", email:"fonctionnaire@demo.ma" },
};

export default function DemoApp() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(null);

  const handleERP = async (role) => {
    if (role === "MOBILE_PARENT") { navigate("/mobile"); return; }
    if (role === "MOBILE_STUDENT") { navigate("/etudiant"); return; }
    setLoading(role);
    try {
      const CREDS = {
        DIRECTOR: { email: "directeur@excellence-casa.ma", password: "password123" },
        TEACHER: { email: "directeur@excellence-casa.ma", password: "password123" },
        FONCTIONNAIRE: { email: "directeur@excellence-casa.ma", password: "password123" },
      };
      const res = await fetch("https://luxedu-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CREDS[role]),
      });
      const data = await res.json();
      if (data.token) {
        login(data.token, data.user, data.school);
        window.location.href = "/app";
      } else {
        setLoading(null);
      }
    } catch(e) {
      setLoading(null);
    }
  };

  const spaces = [
    {
      id: "erp_dir",
      tag: "ERP LUXEDU",
      title: "Tableau de bord Directeur",
      subtitle: "Acces immediat au vrai ERP — donnees demo preconfigureees",
      desc: "Explorez le tableau de bord complet du directeur : presences en temps reel, recouvrement financier, gestion des eleves, reclamations parents et analytics avances.",
      features: ["Dashboard analytique complet", "Gestion des eleves et classes", "Suivi paiements et recouvrement", "Reclamations parents", "Bulletins PDF, certificats", "CRM et statistiques"],
      color: navy, border: "#334155", tagBg: "rgba(201,150,63,.15)", tagC: gold,
      icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>,
      action: () => handleERP("DIRECTOR"), role: "DIRECTOR", cta: "Acceder au tableau de bord",
    },
    {
      id: "erp_ens",
      tag: "ERP LUXEDU",
      title: "Espace Enseignant",
      subtitle: "Interface professeur — notes, presences, cahier de texte",
      desc: "Voyez comment un enseignant utilise LuxEdu : saisie des notes, appel digital, cahier de texte, devoirs en ligne et communication avec les parents.",
      features: ["Saisie notes et evaluations", "Appel digital par classe", "Cahier de texte numerique", "Devoirs en ligne", "Messagerie parents", "Tawjih BAC — Orientation IA"],
      color: blue, border: "#BFDBFE", tagBg: "rgba(37,99,235,.1)", tagC: blue,
      icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
      action: () => handleERP("TEACHER"), role: "TEACHER", cta: "Acceder a l espace enseignant",
    },
    {
      id: "erp_fonc",
      tag: "ERP LUXEDU",
      title: "Espace Fonctionnaire",
      subtitle: "Secretariat — inscriptions, paiements, bulletins",
      desc: "Decourvez l espace du personnel administratif : gestion des inscriptions, suivi des paiements, generation des bulletins PDF et documents officiels.",
      features: ["Inscriptions et scolarite", "Suivi paiements complet", "Generation bulletins PDF", "Certificats de scolarite", "Cartes eleves QR code", "Messagerie WhatsApp"],
      color: "#059669", border: "#BBF7D0", tagBg: "rgba(5,150,105,.1)", tagC: "#059669",
      icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
      action: () => handleERP("FONCTIONNAIRE"), role: "FONCTIONNAIRE", cta: "Acceder a l espace fonctionnaire",
    },
    {
      id: "mobile_parent",
      tag: "APPLICATION MOBILE",
      title: "Portails Parents et Etudiants",
      subtitle: "iPhone et Android — un acces, deux espaces",
      desc: "Une seule application pour toute la famille. Au premier ecran, choisissez l espace Parent (notes, absences, paiements, RIB, reclamations) ou l espace Etudiant (bulletin de notes, devoirs, orientation BAC, messagerie professeurs).",
      features: ["Notes et moyennes en direct", "Alertes absences instantanees", "Paiements et historique RIB", "Reclamations en ligne", "Orientation BAC IA — Tawjih", "Devoirs et messagerie professeurs"],
      color: "#7C3AED", border: "#DDD6FE", tagBg: "rgba(124,58,237,.1)", tagC: "#7C3AED",
      icon: <><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="#7C3AED"/></>,
      action: () => navigate("/mobile"), role: "MOBILE_PARENT", cta: "Voir l application mobile",
    },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#F8FAFC", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background:`linear-gradient(135deg, ${navy}, #162554)`, padding:"40px 5% 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.03) 1px,transparent 0)", backgroundSize:"40px 40px" }} />
        <div style={{ maxWidth:900, margin:"0 auto", position:"relative", textAlign:"center" }}>
          <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height:60, width:"auto", marginBottom:20 }} />
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,150,63,.15)", border:"1px solid rgba(201,150,63,.3)", borderRadius:100, padding:"5px 16px", marginBottom:16 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:gold, animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:12, fontWeight:700, color:gold, letterSpacing:".1em", textTransform:"uppercase" }}>Demonstration interactive — Acces sandbox</span>
          </div>
          <h1 style={{ fontSize:38, fontWeight:900, color:white, letterSpacing:"-1.5px", margin:"0 0 12px", lineHeight:1.1 }}>
            Explorez LuxEdu en conditions reelles
          </h1>
          <p style={{ fontSize:17, color:"rgba(255,255,255,.55)", lineHeight:1.7, maxWidth:560, margin:"0 auto" }}>
            Acces immediat au vrai systeme avec des donnees preconfigureees. Aucune inscription requise.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:980, margin:"0 auto", padding:"48px 5%" }}>

        {/* ERP SECTION */}
        <div style={{ marginBottom:48 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
            <div style={{ height:1, flex:1, background:"#E2E8F0" }} />
            <span style={{ fontSize:12, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:".12em", whiteSpace:"nowrap" }}>ERP LuxEdu — Systeme de gestion scolaire</span>
            <div style={{ height:1, flex:1, background:"#E2E8F0" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {spaces.filter(s => s.tag === "ERP LUXEDU").map(s => (
              <SpaceCard key={s.id} space={s} loading={loading} onAction={s.action} />
            ))}
          </div>
        </div>

        {/* MOBILE SECTION */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
            <div style={{ height:1, flex:1, background:"#E2E8F0" }} />
            <span style={{ fontSize:12, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:".12em", whiteSpace:"nowrap" }}>Applications Mobiles — iPhone et Android</span>
            <div style={{ height:1, flex:1, background:"#E2E8F0" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {spaces.filter(s => s.tag === "APPLICATION MOBILE").map(s => (
              <SpaceCard key={s.id} space={s} loading={loading} onAction={s.action} />
            ))}
          </div>
        </div>

        {/* FOOTER CTA */}
        <div style={{ marginTop:48, background:`linear-gradient(135deg, ${navy}, #1a3a8f)`, borderRadius:20, padding:"32px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:24 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:white, marginBottom:6 }}>Pret a equiper votre ecole ?</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,.5)" }}>Deploiement en 24h · Formation incluse · Support dedie</div>
          </div>
          <div style={{ display:"flex", gap:12, flexShrink:0 }}>
            <a href="/landing#contact" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 22px", borderRadius:10, background:gold, color:white, fontWeight:700, fontSize:14, textDecoration:"none" }}>Demander une demonstration</a>
            <a href="https://wa.me/212666490261" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 18px", borderRadius:10, background:"rgba(255,255,255,.08)", color:white, fontWeight:600, fontSize:14, textDecoration:"none", border:"1px solid rgba(255,255,255,.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpaceCard({ space: s, loading, onAction }) {
  const [hovered, setHovered] = useState(false);
  const isLoading = loading === s.role;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background:"white", border:`1.5px solid ${hovered ? s.border : "#E2E8F0"}`, borderRadius:16, padding:24, transition:"all .2s", transform:hovered?"translateY(-4px)":"none", boxShadow:hovered?"0 16px 40px rgba(0,0,0,.1)":"none", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <span style={{ display:"inline-block", background:s.tagBg, color:s.tagC, fontSize:10, fontWeight:800, borderRadius:100, padding:"3px 10px", letterSpacing:".08em", marginBottom:8 }}>{s.tag}</span>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#0F1D42", margin:"0 0 4px", lineHeight:1.3 }}>{s.title}</h3>
          <p style={{ fontSize:12, color:"#64748b", margin:0, lineHeight:1.4 }}>{s.subtitle}</p>
        </div>
        <div style={{ width:44, height:44, background:s.tagBg, border:`1px solid ${s.border}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize:13, color:"#475569", lineHeight:1.65, marginBottom:16, flex:1 }}>{s.desc}</p>

      {/* Features */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
        {s.features.map(f => (
          <span key={f} style={{ fontSize:11, color:s.color, background:s.tagBg, border:`1px solid ${s.border}`, borderRadius:100, padding:"3px 10px", fontWeight:600 }}>{f}</span>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onAction}
        disabled={isLoading}
        style={{ width:"100%", padding:"12px 16px", borderRadius:10, background:isLoading ? "#94a3b8" : s.color, color:white, fontSize:14, fontWeight:700, cursor:isLoading?"not-allowed":"pointer", border:"none", fontFamily:"inherit", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        {isLoading ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation:"spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Connexion en cours...
          </>
        ) : (
          <>{s.cta} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
        )}
      </button>
    </div>
  );
}
