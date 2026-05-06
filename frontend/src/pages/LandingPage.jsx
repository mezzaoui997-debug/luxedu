import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── design tokens ─────────────────────────────────────────── */
const T = {
  navy:    '#1B2C5E',
  navy2:   '#243872',
  gold:    '#C9A84C',
  gold2:   '#E8C46A',
  white:   '#FFFFFF',
  off:     '#F7F9FC',
  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray800: '#1F2937',
  blue:    '#2563EB',
  green:   '#16A34A',
  red:     '#DC2626',
};

/* ─── reusable style helpers ─────────────────────────────────── */
const card = {
  background: T.white,
  border: `1px solid ${T.gray200}`,
  borderRadius: 14,
  padding: '28px',
};

/* ─── data ───────────────────────────────────────────────────── */
const FEATURES = [
  { title:'Tableau de bord analytique',   desc:'Recouvrement, présences et performances en temps réel. Rapports exportables en Excel et PDF.' },
  { title:'Communication WhatsApp',        desc:'Alertes automatiques aux parents — absences, paiements, bulletins. Taux d\'ouverture 95%, sans frais SMS.' },
  { title:'Présences journalières',        desc:'Pointage par classe en moins de deux minutes. Notifications automatiques aux parents absents.' },
  { title:'Portail parents',               desc:'Accès sécurisé aux notes, présences et paiements depuis tout appareil. Authentification par numéro et code Massar.' },
  { title:'Application Android',           desc:'Disponible sur Google Play Store. Parents et enseignants connectés partout, même hors connexion.' },
  { title:'Conformité Maroc',              desc:'Export Massar MEN, Tawjih BAC, calendrier officiel. Conçu pour le système éducatif marocain.' },
];

const MODULES = [
  'Inscriptions','Paiements','Présences','Notes','Bulletins PDF','Certificats',
  'Emploi du temps','Agenda & RDV','Portail parents','App Android',
  'CRM Prospects','Fiche médicale','Cantine','Transport','Bibliothèque',
  'Inventaire','RH Enseignants','Massar MEN','Circulaires','QR Code élèves',
];

const COMPARE = [
  ['WhatsApp natif (sans SMS payant)',         true,  false],
  ['Intégration Code Massar MEN',              true,  false],
  ['Tawjih BAC Maroc',                         true,  false],
  ['Portail parents & Application mobile',     true,  'Partiel'],
  ['CRM prospects et inscriptions',            true,  false],
  ['Support en français',                      true,  false],
  ['Déploiement en 24 heures',                 true,  false],
  ['Tarif annuel (école 200 élèves)',          '1 990 MAD/an', '6 000 – 12 000 MAD/an'],
];

const PLANS = [
  {
    name:'Starter', badge:'Démarrage', featured:false,
    setup:'1 500 MAD setup (une fois)', price:'1 990', period:'MAD / an · 200 élèves',
    feats:['Inscriptions & paiements','WhatsApp automatique','Bulletins & certificats','Emploi du temps','Support e-mail 48h'],
  },
  {
    name:'Pro', badge:'Recommandé', featured:true,
    setup:'2 000 MAD setup (une fois)', price:'3 990', period:'MAD / an · 500 élèves',
    feats:['Tout Starter +','Portail parents et élèves','Analytics avancés','CRM Prospects','Application Android','Formation 2h incluse','Support prioritaire'],
  },
  {
    name:'École+', badge:'Grandes écoles', featured:false,
    setup:'3 000 MAD setup (une fois)', price:'6 990', period:'MAD / an · Illimité',
    feats:['Tout Pro +','Multi-établissements','Examens en ligne','Formation 4h dédiée','Support 24/7'],
  },
];

const TESTI = [
  { initials:'AB', bg:T.navy,  name:'Ahmed B.',   role:'Directeur — École Excellence, Casablanca', text:'En deux semaines, notre taux de recouvrement est passé de 55 % à 89 %. Les parents règlent maintenant sans relance téléphonique.' },
  { initials:'FR', bg:T.blue,  name:'Fatima R.',  role:'Responsable administrative — Académie Al Nour, Rabat', text:'Les parents reçoivent les notes et bulletins directement sur WhatsApp. Cela a complètement transformé notre image d\'établissement.' },
  { initials:'KM', bg:T.gold,  name:'Karim M.',   role:'Directeur — École Avenir, Marrakech', text:'Formation en deux heures, déploiement en une journée. Le support répond en moins d\'une heure, en français.' },
];

/* ─── component ──────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate   = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const goLogin    = () => navigate('/login');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── shared micro-components ── */
  const Pill = ({ children }) => (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:T.gray50, border:`1px solid ${T.gray200}`, borderRadius:100, padding:'5px 16px', fontSize:12, fontWeight:600, color:T.blue, marginBottom:16, letterSpacing:'0.02em' }}>
      {children}
    </span>
  );

  const H2 = ({ children, center }) => (
    <div style={{ fontFamily:"'Georgia',serif", fontSize:40, fontWeight:700, color:T.navy, letterSpacing:'-1px', lineHeight:1.1, marginBottom:16, textAlign:center?'center':undefined }}>
      {children}
    </div>
  );

  const Sub = ({ children, center }) => (
    <p style={{ fontSize:17, color:T.gray600, lineHeight:1.75, maxWidth:520, margin:center?'0 auto':undefined }}>
      {children}
    </p>
  );

  const CheckMark = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#DCFCE7"/><path d="M5.5 9l2.5 2.5 5-5" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );

  const CrossMark = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#F3F4F6"/><path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round"/></svg>
  );

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:T.gray800, background:T.white, overflowX:'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:1000, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${scrolled?T.gray200:'transparent'}`, transition:'border-color .3s' }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:68 }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <img src="/luxedu-logo.png" alt="LuxEdu" style={{ width:36, height:36, objectFit:'contain' }} />
            <span style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, color:T.navy }}>LuxEdu</span>
          </a>
          <nav style={{ display:'flex', gap:4 }}>
            {[['#features','Fonctionnalités'],['#modules','Modules'],['#tarifs','Tarifs'],['#temoignages','Témoignages']].map(([h,l]) => (
              <a key={h} href={h} style={{ padding:'7px 14px', borderRadius:8, fontSize:14, fontWeight:500, color:T.gray600, textDecoration:'none' }}
                onMouseEnter={e=>{ e.target.style.background=T.gray100; e.target.style.color=T.navy; }}
                onMouseLeave={e=>{ e.target.style.background='transparent'; e.target.style.color=T.gray600; }}>
                {l}
              </a>
            ))}
          </nav>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <button onClick={goLogin} style={{ padding:'9px 20px', borderRadius:8, border:`1.5px solid ${T.gray200}`, background:T.white, fontSize:13, fontWeight:600, color:T.gray800, cursor:'pointer', fontFamily:'inherit' }}
              onMouseEnter={e=>{ e.target.style.borderColor=T.navy; e.target.style.color=T.navy; }}
              onMouseLeave={e=>{ e.target.style.borderColor=T.gray200; e.target.style.color=T.gray800; }}>
              Se connecter
            </button>
            <button onClick={goLogin} style={{ padding:'9px 22px', borderRadius:8, background:T.navy, border:'none', fontSize:13, fontWeight:700, color:T.white, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}
              onMouseEnter={e=>{ e.target.style.background=T.navy2; e.target.style.transform='translateY(-1px)'; }}
              onMouseLeave={e=>{ e.target.style.background=T.navy; e.target.style.transform='translateY(0)'; }}>
              Démo gratuite
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop:140, paddingBottom:80, paddingLeft:40, paddingRight:40, background:`linear-gradient(175deg,#F0F5FF 0%,${T.white} 65%)`, textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-250, left:'50%', transform:'translateX(-50%)', width:900, height:900, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:800, margin:'0 auto', position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border:'1px solid #BFDBFE', borderRadius:100, padding:'6px 18px 6px 8px', fontSize:13, fontWeight:600, color:T.blue, marginBottom:30 }}>
            <span style={{ background:T.blue, color:T.white, fontSize:10, fontWeight:700, letterSpacing:'.06em', padding:'3px 10px', borderRadius:100 }}>NOUVEAU</span>
            Application Android disponible sur Play Store
          </div>
          <h1 style={{ fontFamily:"'Georgia',serif", fontSize:62, fontWeight:700, color:T.navy, letterSpacing:'-2px', lineHeight:1.08, marginBottom:22 }}>
            Logiciel de Gestion Scolaire<br />
            <span style={{ color:T.blue }}>100&nbsp;% Maroc</span>
          </h1>
          <p style={{ fontSize:19, color:T.gray600, maxWidth:540, margin:'0 auto 40px', lineHeight:1.75, fontWeight:400 }}>
            LuxEdu centralise présences, paiements, notes et communication parents dans une seule plateforme. Conçu pour les écoles privées marocaines.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:20, flexWrap:'wrap' }}>
            <button onClick={goLogin} style={{ padding:'15px 32px', borderRadius:10, background:T.blue, border:'none', fontSize:15, fontWeight:700, color:T.white, cursor:'pointer', boxShadow:'0 4px 24px rgba(37,99,235,.3)', fontFamily:'inherit', transition:'all .2s' }}
              onMouseEnter={e=>{ e.target.style.background='#1D4ED8'; e.target.style.transform='translateY(-2px)'; }}
              onMouseLeave={e=>{ e.target.style.background=T.blue; e.target.style.transform='translateY(0)'; }}>
              Essayer gratuitement
            </button>
            <a href="#features" style={{ padding:'15px 32px', borderRadius:10, background:T.white, border:`1.5px solid ${T.gray200}`, fontSize:15, fontWeight:600, color:T.gray800, cursor:'pointer', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, transition:'all .2s' }}
              onMouseEnter={e=>{ e.target.style.borderColor=T.blue; e.target.style.color=T.blue; }}
              onMouseLeave={e=>{ e.target.style.borderColor=T.gray200; e.target.style.color=T.gray800; }}>
              Voir les fonctionnalités
            </a>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:13, color:T.gray400, flexWrap:'wrap' }}>
            {['Déploiement en 24h','Code Massar MEN intégré','Support en français','Sans engagement'].map((t,i,a) => (
              <span key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:T.green, fontWeight:600 }}>&#10003;&nbsp;{t}</span>
                {i < a.length-1 && <span style={{ width:4, height:4, borderRadius:'50%', background:T.gray200, display:'inline-block' }} />}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div style={{ maxWidth:960, margin:'64px auto 0', background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, boxShadow:'0 32px 80px rgba(0,0,0,.13)', overflow:'hidden' }}>
          {/* Browser bar */}
          <div style={{ background:T.gray50, borderBottom:`1px solid ${T.gray200}`, padding:'11px 18px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', gap:6 }}>
              {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width:11, height:11, borderRadius:'50%', background:c }} />)}
            </div>
            <div style={{ flex:1, background:T.white, border:`1px solid ${T.gray200}`, borderRadius:6, padding:'5px 12px', fontSize:12, color:T.gray400, fontFamily:'monospace', textAlign:'left' }}>app.luxedu.ma/dashboard</div>
          </div>
          {/* App shell */}
          <div style={{ display:'flex', height:360 }}>
            {/* Sidebar */}
            <div style={{ width:190, background:T.navy, padding:'14px 0', flexShrink:0 }}>
              <div style={{ padding:'0 16px 14px', borderBottom:'1px solid rgba(255,255,255,.08)', marginBottom:8 }}>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:14, fontWeight:700, color:T.white }}>LuxEdu</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', letterSpacing:'.08em', marginTop:3 }}>Espace Directeur</div>
              </div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.3)', padding:'8px 16px 4px' }}>Principal</div>
              {[['Tableau de bord',true],['Tous les élèves',false],['Notes & résultats',false]].map(([l,a]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 16px', fontSize:11, color:a?T.white:'rgba(255,255,255,.5)', background:a?'rgba(255,255,255,.1)':'transparent', borderLeft:a?`2.5px solid ${T.gold}`:'2.5px solid transparent', paddingLeft:a?13.5:16 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:a?T.gold:'rgba(255,255,255,.2)', flexShrink:0 }} />
                  {l}
                </div>
              ))}
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.3)', padding:'10px 16px 4px' }}>Finances</div>
              {[['Paiements',false],['Rapports',false]].map(([l]) => (
                <div key={l} style={{ padding:'7px 16px 7px 22px', fontSize:11, color:'rgba(255,255,255,.5)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,.2)', flexShrink:0 }} />{l}
                </div>
              ))}
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.3)', padding:'10px 16px 4px' }}>École</div>
              {['Classes','Enseignants'].map(l => (
                <div key={l} style={{ padding:'7px 16px 7px 22px', fontSize:11, color:'rgba(255,255,255,.5)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,.2)', flexShrink:0 }} />{l}
                </div>
              ))}
            </div>
            {/* Main */}
            <div style={{ flex:1, background:T.gray50, padding:18, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <div style={{ fontFamily:"'Georgia',serif", fontSize:15, fontWeight:700, color:T.navy }}>Tableau de bord</div>
                  <div style={{ fontSize:10, color:T.gray400, marginTop:2 }}>Mercredi 6 mai 2026</div>
                </div>
                <button style={{ background:T.blue, color:T.white, border:'none', borderRadius:7, padding:'7px 13px', fontSize:11, fontWeight:600, cursor:'pointer' }}>+ Inscrire</button>
              </div>
              {/* KPIs */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
                {[['248','Élèves inscrits',T.blue],['94%','Taux présence',T.green],['86%','Recouvrement',T.gold],['3','Alertes',T.red]].map(([v,l,c]) => (
                  <div key={l} style={{ background:T.white, borderRadius:9, padding:'10px 12px', border:`1px solid ${T.gray200}` }}>
                    <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:c }}>{v}</div>
                    <div style={{ fontSize:9, color:T.gray400, marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
              {/* Charts */}
              <div style={{ display:'grid', gridTemplateColumns:'1.7fr 1fr', gap:8 }}>
                <div style={{ background:T.white, borderRadius:9, padding:12, border:`1px solid ${T.gray200}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.navy, marginBottom:8 }}>Recouvrement 2025-2026</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:72 }}>
                    {[['Sep',32,T.gray200],['Oct',40,'#BFDBFE'],['Nov',48,'#93C5FD'],['Déc',54,'#60A5FA'],['Jan',60,'#3B82F6'],['Fév',63,T.blue],['Mar',67,'#1D4ED8'],['Avr',71,T.navy],['Mai',68,T.gold]].map(([m,h,c]) => (
                      <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, justifyContent:'flex-end' }}>
                        <div style={{ width:'100%', height:h+'px', background:c, borderRadius:'2px 2px 0 0' }} />
                        <div style={{ fontSize:7, color:T.gray400 }}>{m}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:T.white, borderRadius:9, padding:12, border:`1px solid ${T.gray200}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.navy, marginBottom:8 }}>Statut paiements</div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <div style={{ width:60, height:60, borderRadius:'50%', background:'conic-gradient(#16A34A 0% 55%,#2563EB 55% 80%,#F59E0B 80% 100%)', position:'relative' }}>
                      <div style={{ position:'absolute', inset:10, borderRadius:'50%', background:T.white }} />
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                      {[['#16A34A','Réglés 55%'],['#2563EB','Partiels 25%'],['#F59E0B','Retard 20%']].map(([c,l]) => (
                        <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:8, color:T.gray600 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:c }} />{l}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENTS RIBBON ── */}
      <div style={{ padding:'32px 40px', borderTop:`1px solid ${T.gray100}`, borderBottom:`1px solid ${T.gray100}` }}>
        <div style={{ maxWidth:960, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:T.gray400, marginBottom:22 }}>Fait confiance par les meilleures écoles privées du Maroc</div>
          <div style={{ display:'flex', gap:48, justifyContent:'center', flexWrap:'wrap' }}>
            {['École Excellence Arrow','Académie Al Nour','Institut Avenir','École Lumière Rabat','Complexe Atlas'].map(n => (
              <div key={n} style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:700, color:T.gray200 }}>{n}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:'96px 40px', background:T.gray50 }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <Pill>Fonctionnalités</Pill>
          <H2>Tout ce dont votre école a besoin<br />dans une seule plateforme</H2>
          <Sub>LuxEdu remplace les tableurs, les dossiers papier et les appels téléphoniques par un système moderne et centralisé.</Sub>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22, marginTop:52 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ ...card, transition:'all .25s', cursor:'default', borderTop:`3px solid transparent` }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 56px rgba(0,0,0,.09)'; e.currentTarget.style.borderTopColor=T.navy; e.currentTarget.style.borderColor='transparent'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderTopColor='transparent'; e.currentTarget.style.borderColor=T.gray200; }}>
                <div style={{ width:40, height:4, background:T.navy, borderRadius:2, marginBottom:20 }} />
                <div style={{ fontSize:16, fontWeight:700, color:T.navy, marginBottom:10 }}>{f.title}</div>
                <div style={{ fontSize:14, color:T.gray600, lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <div style={{ background:T.navy, padding:'72px 40px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:48 }}>
          {[['+35 %','Recouvrement paiements dès le 1er mois'],['3 h','Économisées par jour par votre équipe'],['24 h','Pour être opérationnel après signature'],['31','Modules actifs inclus dans la plateforme']].map(([v,l]) => (
            <div key={v} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Georgia',serif", fontSize:50, fontWeight:700, color:T.gold, lineHeight:1, marginBottom:8 }}>{v}</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODULES ── */}
      <section id="modules" style={{ padding:'96px 40px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center' }}>
            <Pill>31 modules actifs</Pill>
            <H2 center>Une plateforme complète,<br />rien de plus</H2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginTop:48 }}>
            {MODULES.map(m => (
              <div key={m} style={{ ...card, padding:'18px 14px', textAlign:'center', transition:'all .2s', cursor:'default' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.navy; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(27,44,94,.1)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.gray200; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ width:28, height:3, background:T.navy, borderRadius:2, margin:'0 auto 12px' }} />
                <div style={{ fontSize:12, fontWeight:700, color:T.navy }}>{m}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'96px 40px', background:T.gray50 }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <Pill>Comment ça marche</Pill>
          <H2>Opérationnel en 24 heures,<br />garanti.</H2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, marginTop:52 }}>
            {[['01','Démo gratuite','30 minutes en ligne. Présentation sur un exemple concret de votre école.'],['02','Configuration','Vos classes, tarifs et données importées. Prêt en quelques heures.'],['03','Formation','2 heures pour toute votre équipe. Manuel complet en français.'],['04','Mise en ligne','Votre école est opérationnelle. Support dédié les 30 premiers jours.']].map(([n,t,d]) => (
              <div key={n} style={{ ...card, textAlign:'center', transition:'all .25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 48px rgba(0,0,0,.09)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:36, fontWeight:700, color:T.navy, opacity:.15, marginBottom:12, lineHeight:1 }}>{n}</div>
                <div style={{ width:40, height:3, background:T.gold, borderRadius:2, margin:'0 auto 16px' }} />
                <div style={{ fontSize:15, fontWeight:700, color:T.navy, marginBottom:8 }}>{t}</div>
                <div style={{ fontSize:13, color:T.gray600, lineHeight:1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section style={{ padding:'96px 40px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <Pill>Comparaison</Pill>
          <H2>Pourquoi choisir LuxEdu ?</H2>
          <Sub>La seule solution conçue pour le marché éducatif marocain.</Sub>
          <div style={{ marginTop:48, borderRadius:14, overflow:'hidden', border:`1px solid ${T.gray200}` }}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', background:T.gray50, borderBottom:`1px solid ${T.gray200}` }}>
              <div style={{ padding:'14px 20px', fontSize:12, fontWeight:700, color:T.gray600 }}>Fonctionnalité</div>
              <div style={{ padding:'14px 20px', fontSize:12, fontWeight:700, color:T.blue, background:'#EFF6FF', textAlign:'center' }}>LuxEdu</div>
              <div style={{ padding:'14px 20px', fontSize:12, fontWeight:700, color:T.gray600, textAlign:'center' }}>Logiciels génériques</div>
            </div>
            {COMPARE.map(([feat, lux, other], i) => (
              <div key={feat} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', borderBottom: i < COMPARE.length-1 ? `1px solid ${T.gray100}` : 'none' }}
                onMouseEnter={e=>{ e.currentTarget.style.background=T.gray50; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}>
                <div style={{ padding:'12px 20px', fontSize:13, color:T.gray600, display:'flex', alignItems:'center' }}>{feat}</div>
                <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(37,99,235,.025)' }}>
                  {lux === true ? <CheckMark /> : <span style={{ fontSize:13, fontWeight:700, color:T.green }}>{lux}</span>}
                </div>
                <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {other === false ? <CrossMark /> : <span style={{ fontSize:12, fontWeight:600, color: other === 'Partiel' ? T.gold : T.red }}>{other}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="temoignages" style={{ padding:'96px 40px', background:T.gray50 }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center' }}>
            <Pill>Témoignages</Pill>
            <H2 center>Ils ont transformé leur école<br />avec LuxEdu</H2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22, marginTop:48 }}>
            {TESTI.map(t => (
              <div key={t.name} style={{ ...card, transition:'all .25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,.08)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color:T.gold, fontSize:14 }}>&#9733;</span>)}
                </div>
                <p style={{ fontSize:15, color:T.gray800, lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:12, borderTop:`1px solid ${T.gray100}`, paddingTop:16 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color: t.bg === T.gold ? T.navy : T.white, flexShrink:0, fontFamily:"'Georgia',serif" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{t.name}</div>
                    <div style={{ fontSize:12, color:T.gray400, marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="tarifs" style={{ padding:'96px 40px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center' }}>
            <Pill>Tarification</Pill>
            <H2 center>Simple, transparent,<br />sans surprise</H2>
            <Sub center>Facturé annuellement. Setup unique. Réduction fidélité de 10 % dès la deuxième année.</Sub>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginTop:52 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ background: p.featured ? T.navy : T.white, border: `1px solid ${p.featured ? T.navy : T.gray200}`, borderRadius:18, padding:'28px 24px', position:'relative', transition:'all .25s' }}
                onMouseEnter={e=>{ if(!p.featured) { e.currentTarget.style.boxShadow='0 20px 56px rgba(0,0,0,.1)'; } }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; }}>
                {p.featured && <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:T.gold, borderRadius:'18px 18px 0 0' }} />}
                <div style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, marginBottom:18, background: p.featured ? 'rgba(255,255,255,.12)' : T.gray100, color: p.featured ? T.gold2 : T.gray600 }}>{p.badge}</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, color: p.featured ? T.white : T.navy, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:11, color: p.featured ? 'rgba(255,255,255,.4)' : T.gray400, marginBottom:12 }}>{p.setup}</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:42, fontWeight:700, color: p.featured ? T.gold2 : T.blue, lineHeight:1, marginBottom:4 }}>{p.price}</div>
                <div style={{ fontSize:12, color: p.featured ? 'rgba(255,255,255,.4)' : T.gray400, marginBottom:24 }}>{p.period}</div>
                <div style={{ height:1, background: p.featured ? 'rgba(255,255,255,.1)' : T.gray100, marginBottom:20 }} />
                {p.feats.map(f => (
                  <div key={f} style={{ display:'flex', gap:10, marginBottom:10, fontSize:13, color: p.featured ? 'rgba(255,255,255,.7)' : T.gray600 }}>
                    <span style={{ color: p.featured ? T.gold2 : T.green, flexShrink:0, fontWeight:700 }}>&#10003;</span>
                    {f}
                  </div>
                ))}
                <button onClick={goLogin} style={{ display:'block', width:'100%', marginTop:24, padding:13, borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', fontFamily:'inherit', background: p.featured ? T.gold : T.blue, color: p.featured ? T.navy : T.white, transition:'all .2s' }}
                  onMouseEnter={e=>{ e.target.style.opacity='.88'; }}
                  onMouseLeave={e=>{ e.target.style.opacity='1'; }}>
                  Commencer
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign:'center', fontSize:12, color:T.gray400, marginTop:20 }}>
            Les frais de setup sont facturés une seule fois. Renouvellement annuel avec réduction fidélité.
          </p>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div style={{ margin:'0 40px 80px', background:`linear-gradient(135deg,${T.navy} 0%,#1E40AF 100%)`, borderRadius:22, padding:'68px 64px', display:'grid', gridTemplateColumns:'1fr auto', gap:60, alignItems:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-80, top:-80, width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,.03)' }} />
        <div>
          <div style={{ fontFamily:"'Georgia',serif", fontSize:38, fontWeight:700, color:T.white, lineHeight:1.1, marginBottom:14, letterSpacing:'-1px' }}>
            Votre école mérite<br /><span style={{ color:T.gold2 }}>mieux qu'un tableur.</span>
          </div>
          <p style={{ fontSize:16, color:'rgba(255,255,255,.55)', lineHeight:1.6 }}>
            Rejoignez les écoles qui pilotent avec des données réelles. Démo gratuite, sans engagement, en 30 minutes.
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, flexShrink:0, position:'relative' }}>
          <button onClick={goLogin} style={{ padding:'15px 30px', borderRadius:10, background:T.gold, border:'none', fontSize:15, fontWeight:700, color:T.navy, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'all .2s' }}
            onMouseEnter={e=>{ e.target.style.background=T.gold2; e.target.style.transform='translateY(-2px)'; }}
            onMouseLeave={e=>{ e.target.style.background=T.gold; e.target.style.transform='translateY(0)'; }}>
            Demander une démo gratuite
          </button>
          <a href="mailto:contact@luxedu.ma" style={{ padding:'14px 30px', borderRadius:10, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', fontSize:14, fontWeight:600, color:T.white, cursor:'pointer', whiteSpace:'nowrap', textAlign:'center', textDecoration:'none', transition:'all .2s' }}
            onMouseEnter={e=>{ e.target.style.background='rgba(255,255,255,.18)'; }}
            onMouseLeave={e=>{ e.target.style.background='rgba(255,255,255,.1)'; }}>
            contact@luxedu.ma
          </a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#0F172A', padding:'60px 40px 36px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2.2fr 1fr 1fr 1fr', gap:60, marginBottom:48 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <img src="/luxedu-logo.png" alt="LuxEdu" style={{ width:32, height:32, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:.8 }} />
                <span style={{ fontFamily:"'Georgia',serif", fontSize:18, fontWeight:700, color:T.white }}>LuxEdu</span>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.38)', lineHeight:1.7, maxWidth:260 }}>La solution ERP scolaire conçue pour les écoles privées du Maroc. Moderne, locale, abordable.</p>
            </div>
            {[['Produit',['Fonctionnalités','Modules','Tarification','Portail parents','Application Android']],
              ['Ressources',['Documentation','Guide démarrage','Tutoriels','FAQ']],
              ['Contact',['WhatsApp','E-mail','Démonstration','Support']],
            ].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.25)', marginBottom:14 }}>{title}</div>
                <ul style={{ listStyle:'none' }}>
                  {links.map(l => <li key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontSize:13, color:'rgba(255,255,255,.45)', textDecoration:'none', transition:'color .15s' }}
                    onMouseEnter={e=>{ e.target.style.color=T.white; }}
                    onMouseLeave={e=>{ e.target.style.color='rgba(255,255,255,.45)'; }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.05)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:'rgba(255,255,255,.25)' }}>
            <span>© 2026 LuxEdu — Tous droits réservés</span>
            <div style={{ display:'flex', gap:20 }}>
              {['Mentions légales','Confidentialité'].map(l => <a key={l} href="#" style={{ color:'rgba(255,255,255,.25)', textDecoration:'none' }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
