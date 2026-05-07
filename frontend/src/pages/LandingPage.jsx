import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── design tokens (exact same as Login) ─────────────────── */
const navy  = '#1B2C5E';
const navy2 = '#0F1D42';
const blue  = '#2563EB';
const slate = '#93C5FD';
const gold  = '#E8C46A';
const white = '#FFFFFF';
const off   = '#F8FAFC';
const g50   = '#F9FAFB';
const g100  = '#F3F4F6';
const g200  = '#E5E7EB';
const g300  = '#D1D5DB';
const g400  = '#9CA3AF';
const g500  = '#6B7280';
const g600  = '#4B5563';
const g700  = '#374151';
const g900  = '#0F172A';
const green = '#16A34A';

/* ── scroll reveal hook ──────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Fade({ children, delay = 0, y = 28, x = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ transition: `opacity .65s ${delay}s ease, transform .65s ${delay}s ease`, opacity: vis ? 1 : 0, transform: vis ? 'translate(0,0)' : `translate(${x}px,${y}px)` }}>
      {children}
    </div>
  );
}

/* ── hover button ────────────────────────────────────────── */
function Btn({ label, variant = 'primary', onClick, href }) {
  const [h, setH] = useState(false);
  const base = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'inherit', textDecoration: 'none', transition: 'all .2s' };
  const s = {
    primary: { ...base, background: h ? '#1D4ED8' : blue, color: white, boxShadow: h ? '0 8px 28px rgba(37,99,235,.4)' : '0 4px 16px rgba(37,99,235,.25)', transform: h ? 'translateY(-2px)' : 'none' },
    outline:  { ...base, background: 'transparent', color: h ? blue : g600, border: `1.5px solid ${h ? blue : g200}`, transform: h ? 'translateY(-1px)' : 'none' },
    gold:     { ...base, background: h ? '#F5C842' : gold, color: navy, boxShadow: h ? '0 8px 28px rgba(232,196,106,.45)' : 'none', transform: h ? 'translateY(-2px)' : 'none' },
    ghost:    { ...base, background: h ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.08)', color: white, border: `1px solid rgba(255,255,255,.2)` },
  };
  const props = { style: s[variant], onClick, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) };
  return href ? <a href={href} {...props}>{label}</a> : <button {...props}>{label}</button>;
}

/* ── section label pill ──────────────────────────────────── */
const Pill = ({ t }) => (
  <span style={{ display: 'inline-block', background: '#EFF6FF', border: `1px solid #BFDBFE`, borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 600, color: blue, marginBottom: 16, letterSpacing: '.03em' }}>{t}</span>
);

const H2 = ({ children, center, light }) => (
  <h2 style={{ fontFamily: "'Georgia',serif", fontSize: 38, fontWeight: 700, color: light ? white : navy, letterSpacing: '-1.2px', lineHeight: 1.12, margin: center ? '0 auto 18px' : '0 0 18px', textAlign: center ? 'center' : undefined }}>
    {children}
  </h2>
);

const P = ({ children, center, light, wide }) => (
  <p style={{ fontSize: 17, color: light ? 'rgba(255,255,255,.55)' : g500, lineHeight: 1.75, maxWidth: wide ? 640 : 520, margin: center ? '0 auto' : 0 }}>
    {children}
  </p>
);

/* ── check / cross SVG ───────────────────────────────────── */
const Check = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#DCFCE7"/><path d="M6 10l3 3 5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Cross = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill={g100}/><path d="M7 7l6 6M13 7l-6 6" stroke={g300} strokeWidth="2" strokeLinecap="round"/></svg>;

/* ── data ────────────────────────────────────────────────── */
const FEATS = [
  { n:'01', t:'Tableau de bord analytique',  d:'KPIs en temps réel — recouvrement, présences, alertes. Vos données toujours accessibles et actionnables.' },
  { n:'02', t:'Communication WhatsApp',       d:'Absences, paiements, bulletins — envoyés automatiquement. Taux d\'ouverture 95 %, sans frais SMS.' },
  { n:'03', t:'Gestion des présences',        d:'Pointage par classe en deux minutes. Notification automatique au parent dès l\'enregistrement.' },
  { n:'04', t:'Portail parents',              d:'Notes, présences et paiements accessibles sur mobile. Authentification par code Massar.' },
  { n:'05', t:'Application Android',          d:'Disponible sur Google Play Store. Optimisée mobile pour parents et enseignants.' },
  { n:'06', t:'Conformité Maroc',             d:'Massar MEN, Tawjih BAC, calendrier officiel. Conçu pour le système éducatif marocain.' },
];

const SCHOOLS = [
  { name: 'École Sidi Maarouf', city: 'Casablanca', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=120&h=120&fit=crop&q=80' },
  { name: 'Complexe Éducatif Annasr', city: 'Rabat', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=120&h=120&fit=crop&q=80' },
  { name: 'École Privée Ibn Khaldoun', city: 'Fès', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=120&h=120&fit=crop&q=80' },
  { name: 'Institut Averroès', city: 'Marrakech', img: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=120&h=120&fit=crop&q=80' },
  { name: 'École Al Farabi', city: 'Agadir', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=120&h=120&fit=crop&q=80' },
];

const TESTI = [
  { name: 'Mohamed Benjelloun', role: 'Directeur — École Sidi Maarouf, Casablanca', ini: 'MB',
    text: 'Notre taux de recouvrement est passé de 52 % à 91 % en six semaines. Les rappels automatiques WhatsApp ont transformé notre gestion des paiements.' },
  { name: 'Khadija El Alami',  role: 'Responsable administrative — Complexe Annasr, Rabat', ini: 'KA',
    text: 'La plateforme remplace cinq outils différents. Bulletins, présences, paiements, tout centralisé. Nos enseignants ont été formés en deux heures.' },
  { name: 'Youssef Tazi',      role: 'Directeur fondateur — Institut Averroès, Marrakech', ini: 'YT',
    text: 'Déploiement en une journée, support réactif, interface claire. Les parents nous félicitent pour la qualité de communication. Résultat immédiat.' },
];

const COMPARE = [
  ['WhatsApp natif sans frais SMS',         true,  false],
  ['Code Massar MEN intégré',               true,  false],
  ['Tawjih BAC Maroc',                      true,  false],
  ['Portail parents et application mobile', true,  'Partiel'],
  ['CRM prospects et inscriptions',         true,  false],
  ['Support en français',                   true,  false],
  ['Déploiement en 24 heures',              true,  false],
  ['Tarif annuel — 200 élèves',            '1 990 MAD', '6 000–12 000 MAD'],
];

const PLANS = [
  { n:'Starter', b:'Démarrage', f:false, s:'1 500 MAD setup', p:'1 990', per:'MAD/an · 200 élèves',
    feats:['Inscriptions & paiements','WhatsApp automatique','Bulletins & certificats','Emploi du temps','Support e-mail 48 h'] },
  { n:'Pro',     b:'Recommandé',f:true,  s:'2 000 MAD setup', p:'3 990', per:'MAD/an · 500 élèves',
    feats:['Tout Starter inclus','Portail parents','Analytics avancés','CRM Prospects','Application Android','Formation 2 h incluse','Support prioritaire'] },
  { n:'École+',  b:'Grand groupe',f:false,s:'3 000 MAD setup',p:'6 990', per:'MAD/an · Illimité',
    feats:['Tout Pro inclus','Multi-établissements','Examens en ligne','Formation 4 h','Support 24/7'] },
];

const STEPS = [
  { n:'01', t:'Démo gratuite',  d:'30 minutes en ligne. Présentation sur un exemple concret de votre école.' },
  { n:'02', t:'Configuration',  d:'Vos classes, tarifs et données importées. Prêt en quelques heures.' },
  { n:'03', t:'Formation',      d:'2 heures pour toute votre équipe. Manuel complet en français fourni.' },
  { n:'04', t:'Mise en ligne',  d:'Votre école est opérationnelle. Support dédié les 30 premiers jours.' },
];

const MODULES = [
  'Inscriptions','Paiements','Présences','Notes','Bulletins PDF','Certificats',
  'Emploi du temps','Agenda','Portail parents','App Android',
  'CRM Prospects','Fiche médicale','Cantine','Transport','Bibliothèque',
  'Inventaire','RH Enseignants','Massar MEN','Circulaires','QR Code élèves',
];

/* ══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const goLogin = () => navigate('/login');

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── NAV ── */
  const Nav = () => {
    const links = [['#features','Fonctionnalités'],['#modules','Modules'],['#tarifs','Tarifs'],['#avis','Témoignages']];
    return (
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:1000, background:'rgba(255,255,255,0.97)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${scrollY>10?g200:'transparent'}`, boxShadow:scrollY>10?'0 2px 20px rgba(0,0,0,.06)':'none', transition:'all .3s' }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:70 }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <img src="/luxedu-logo.png" alt="LuxEdu" style={{ width:44, height:44, objectFit:'contain' }} onError={e=>e.target.style.display='none'} />
            <span style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:navy, letterSpacing:'-0.5px' }}>LuxEdu</span>
          </a>
          <div style={{ display:'flex', gap:2 }}>
            {links.map(([h,l]) => {
              const [hov,setHov] = useState(false);
              return <a key={h} href={h} style={{ padding:'7px 16px', borderRadius:8, fontSize:14, fontWeight:500, color:hov?navy:g500, background:hov?g100:'transparent', textDecoration:'none', transition:'all .15s' }} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>{l}</a>;
            })}
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Btn label="Se connecter" variant="outline" onClick={goLogin} />
            <Btn label="Démo gratuite" variant="primary" onClick={goLogin} />
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:g900, background:white, overflowX:'hidden' }}>
      <Nav />

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ paddingTop:130, background:`linear-gradient(165deg,#EAF0FF 0%,#F8FAFC 55%,${white} 100%)`, position:'relative', overflow:'hidden' }}>
        {/* decorative blobs */}
        <div style={{ position:'absolute', top:-120, right:-120, width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,.08) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, left:-80, width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(232,196,106,.06) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1160, margin:'0 auto', padding:'60px 40px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          {/* Left text */}
          <div>
            <Fade>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border:'1px solid #BFDBFE', borderRadius:100, padding:'6px 18px 6px 8px', fontSize:13, fontWeight:600, color:blue, marginBottom:28 }}>
                <span style={{ background:blue, color:white, fontSize:10, fontWeight:700, letterSpacing:'.05em', padding:'3px 10px', borderRadius:100 }}>NOUVEAU</span>
                Application Android disponible
              </div>
            </Fade>
            <Fade delay={0.08}>
              <h1 style={{ fontFamily:"'Georgia',serif", fontSize:54, fontWeight:700, color:navy, letterSpacing:'-2px', lineHeight:1.1, margin:'0 0 22px' }}>
                Gérez votre école<br />
                <span style={{ color:blue }}>intelligemment.</span>
              </h1>
            </Fade>
            <Fade delay={0.14}>
              <p style={{ fontSize:18, color:g500, lineHeight:1.78, margin:'0 0 36px', maxWidth:460 }}>
                LuxEdu centralise présences, paiements, notes et communication parents. Une seule plateforme, conçue pour les écoles privées marocaines.
              </p>
            </Fade>
            <Fade delay={0.2}>
              <div style={{ display:'flex', gap:14, marginBottom:40, flexWrap:'wrap' }}>
                <Btn label="Essayer gratuitement" variant="primary" onClick={goLogin} />
                <Btn label="Voir la démo" variant="outline" href="#features" />
              </div>
            </Fade>
            <Fade delay={0.26}>
              <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
                {['Déploiement en 24 h','Code Massar MEN','Sans engagement'].map(t => (
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:g500 }}>
                    <span style={{ color:green, fontSize:16, fontWeight:700 }}>&#10003;</span>{t}
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Right: dashboard screenshot */}
          <Fade delay={0.15} x={30} y={0}>
            <div style={{ position:'relative' }}>
              {/* floating badge top-right */}
              <div style={{ position:'absolute', top:-18, right:-12, background:white, borderRadius:14, padding:'12px 18px', boxShadow:'0 8px 32px rgba(0,0,0,.12)', border:`1px solid ${g200}`, zIndex:2, minWidth:160 }}>
                <div style={{ fontSize:11, color:g400, marginBottom:4 }}>Recouvrement ce mois</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:26, fontWeight:700, color:green }}>+35 %</div>
                <div style={{ fontSize:11, color:g400 }}>vs mois dernier</div>
              </div>
              {/* floating badge bottom-left */}
              <div style={{ position:'absolute', bottom:-16, left:-18, background:navy, borderRadius:14, padding:'12px 16px', boxShadow:'0 8px 32px rgba(27,44,94,.3)', zIndex:2, minWidth:150 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginBottom:4 }}>WhatsApp envoyés</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:gold }}>1 248</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>ce mois · 0 MAD</div>
              </div>
              {/* main screenshot */}
              <div style={{ borderRadius:18, overflow:'hidden', boxShadow:'0 40px 80px rgba(27,44,94,.2), 0 0 0 1px rgba(0,0,0,.06)', background:white }}>
                {/* browser chrome */}
                <div style={{ background:g50, borderBottom:`1px solid ${g200}`, padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ display:'flex', gap:5 }}>
                    {['#FF5F57','#FEBC2E','#28C840'].map(c=><div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
                  </div>
                  <div style={{ flex:1, background:white, border:`1px solid ${g200}`, borderRadius:5, padding:'4px 12px', fontSize:11, color:g400, fontFamily:'monospace' }}>app.luxedu.ma/dashboard</div>
                </div>
                {/* app body */}
                <div style={{ display:'flex', height:320 }}>
                  {/* sidebar */}
                  <div style={{ width:172, background:navy, flexShrink:0, padding:'14px 0' }}>
                    <div style={{ padding:'0 14px 12px', borderBottom:'1px solid rgba(255,255,255,.07)', marginBottom:8 }}>
                      <div style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:700, color:white }}>LuxEdu</div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', marginTop:2 }}>Espace Directeur</div>
                    </div>
                    {[['Tableau de bord',true],['Tous les élèves',false],['Notes',false],['Paiements',false],['Classes',false]].map(([l,a])=>(
                      <div key={l} style={{ padding:'7px 14px', fontSize:11, color:a?white:'rgba(255,255,255,.45)', background:a?'rgba(255,255,255,.1)':'transparent', borderLeft:a?`2px solid ${slate}`:'2px solid transparent', fontWeight:a?600:400 }}>{l}</div>
                    ))}
                  </div>
                  {/* main */}
                  <div style={{ flex:1, background:'#F8FAFC', padding:16, overflow:'hidden' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                      <div>
                        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, fontWeight:700, color:navy }}>Tableau de bord</div>
                        <div style={{ fontSize:10, color:g400 }}>Mercredi 6 mai 2026</div>
                      </div>
                      <div style={{ background:blue, color:white, borderRadius:6, padding:'5px 12px', fontSize:11, fontWeight:600 }}>+ Inscrire</div>
                    </div>
                    {/* KPIs */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:12 }}>
                      {[['248','Élèves',blue],['94%','Présence',green],['86%','Recouvrement','#F59E0B'],['3','Alertes','#EF4444']].map(([v,l,c])=>(
                        <div key={l} style={{ background:white, borderRadius:8, padding:'9px 11px', border:`1px solid ${g200}` }}>
                          <div style={{ fontFamily:"'Georgia',serif", fontSize:19, fontWeight:700, color:c, lineHeight:1 }}>{v}</div>
                          <div style={{ fontSize:9, color:g400, marginTop:2 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    {/* mini chart */}
                    <div style={{ background:white, borderRadius:8, padding:10, border:`1px solid ${g200}`, marginBottom:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, color:navy, marginBottom:8 }}>Recouvrement mensuel</div>
                      <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:52 }}>
                        {[['S',28,g200],['O',36,'#BFDBFE'],['N',44,'#93C5FD'],['D',52,'#60A5FA'],['J',58,blue],['F',62,'#1D4ED8'],['M',66,navy],['A',70,navy],['M',66,gold]].map(([m,h,c])=>(
                          <div key={m+h} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, justifyContent:'flex-end', height:'100%' }}>
                            <div style={{ width:'100%', height:h+'%', background:c, borderRadius:'2px 2px 0 0', minHeight:4 }}/>
                            <div style={{ fontSize:7, color:g400 }}>{m}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* recent */}
                    <div style={{ background:white, borderRadius:8, padding:10, border:`1px solid ${g200}` }}>
                      <div style={{ fontSize:9, fontWeight:600, color:navy, marginBottom:6 }}>Paiements urgents</div>
                      {[['Benjelloun Y.','2 800 MAD','#FEF3C7','#D97706'],['Moussa O.','2 500 MAD','#FEE2E2','#DC2626']].map(([n,m,bg,c])=>(
                        <div key={n} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0', borderBottom:`1px solid ${g100}` }}>
                          <span style={{ fontSize:10, color:g600 }}>{n}</span>
                          <span style={{ fontSize:10, fontWeight:600, background:bg, color:c, padding:'2px 7px', borderRadius:8 }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </div>

        {/* Hero photo band */}
        <div style={{ marginTop:72, position:'relative', overflow:'hidden', height:220 }}>
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg, rgba(234,240,255,1) 0%, transparent 15%, transparent 85%, rgba(248,250,252,1) 100%)`, zIndex:1, pointerEvents:'none' }} />
          <div style={{ display:'flex', gap:16, padding:'0 40px', alignItems:'center', height:'100%' }}>
            {[
              'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=380&h=220&fit=crop&q=80',
              'https://images.unsplash.com/photo-1588072432836-e10032774350?w=380&h=220&fit=crop&q=80',
              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=380&h=220&fit=crop&q=80',
              'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=380&h=220&fit=crop&q=80',
              'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=380&h=220&fit=crop&q=80',
            ].map((src,i)=>(
              <img key={i} src={src} alt="" style={{ height:200, width:340, objectFit:'cover', borderRadius:14, flexShrink:0, boxShadow:'0 8px 32px rgba(0,0,0,.12)', opacity:.92 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SCHOOLS RIBBON ════════════════ */}
      <div style={{ background:white, borderTop:`1px solid ${g100}`, borderBottom:`1px solid ${g100}`, padding:'36px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:g400, textAlign:'center', marginBottom:28 }}>
            Fait confiance par des écoles privées du Maroc
          </div>
          <div style={{ display:'flex', gap:40, justifyContent:'center', alignItems:'center', flexWrap:'wrap' }}>
            {SCHOOLS.map(s => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <img src={s.img} alt={s.name} style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:`2px solid ${g200}` }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:g300, lineHeight:1.2 }}>{s.name}</div>
                  <div style={{ fontSize:10, color:g300 }}>{s.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════ FEATURES ════════════════ */}
      <section id="features" style={{ padding:'100px 40px', background:off }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <Fade><Pill t="Fonctionnalités" /></Fade>
          <Fade delay={0.08}><H2>Tout ce dont votre école a besoin,<br />dans une seule plateforme</H2></Fade>
          <Fade delay={0.12}><P>LuxEdu remplace les tableurs, les dossiers papier et les appels téléphoniques par un système moderne et centralisé.</P></Fade>

          {/* Feature cards with photo */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, marginTop:52 }}>
            {FEATS.map((f,i) => {
              const [h,setH] = useState(false);
              const photos = [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=280&fit=crop&q=75',
                'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=280&fit=crop&q=75',
                'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=280&fit=crop&q=75',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=280&fit=crop&q=75',
                'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=280&fit=crop&q=75',
                'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=280&fit=crop&q=75',
              ];
              return (
                <Fade key={f.n} delay={i*0.07}>
                  <div style={{ background:white, border:`1px solid ${h?navy:g200}`, borderRadius:16, overflow:'hidden', transition:'all .25s', transform:h?'translateY(-5px)':'translateY(0)', boxShadow:h?'0 24px 56px rgba(27,44,94,.12)':'none', cursor:'default' }}
                    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
                    <div style={{ height:160, overflow:'hidden', position:'relative' }}>
                      <img src={photos[i]} alt={f.t} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s', transform:h?'scale(1.05)':'scale(1)' }} />
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(180deg,transparent 40%,rgba(27,44,94,.5) 100%)` }} />
                      <div style={{ position:'absolute', bottom:12, left:14, fontFamily:"'Georgia',serif", fontSize:28, fontWeight:700, color:'rgba(255,255,255,.2)' }}>{f.n}</div>
                    </div>
                    <div style={{ padding:'20px 22px 24px' }}>
                      <div style={{ fontSize:16, fontWeight:700, color:navy, marginBottom:8 }}>{f.t}</div>
                      <div style={{ fontSize:13, color:g500, lineHeight:1.65 }}>{f.d}</div>
                    </div>
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ METRICS STRIP ════════════════ */}
      <div style={{ background:`linear-gradient(135deg,${navy} 0%,${navy2} 100%)`, padding:'80px 40px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,.03)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:48 }}>
          {[['+35 %','Recouvrement paiements dès le 1er mois'],['3 h','Économisées par jour par votre équipe'],['24 h','Pour être opérationnel après signature'],['31','Modules inclus dans la plateforme']].map(([v,l],i)=>(
            <Fade key={v} delay={i*0.1}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:50, fontWeight:700, color:gold, lineHeight:1, marginBottom:10 }}>{v}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.55 }}>{l}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>

      {/* ════════════════ WHATSAPP SECTION ════════════════ */}
      <section style={{ padding:'100px 40px', background:white }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          {/* Phone mockup */}
          <Fade x={-30} y={0}>
            <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
              {/* glow */}
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,.08) 0%,transparent 70%)', pointerEvents:'none' }} />
              {/* phone */}
              <div style={{ width:280, background:'#1C1C1E', borderRadius:40, padding:12, boxShadow:'0 40px 80px rgba(0,0,0,.3)', position:'relative', zIndex:1 }}>
                <div style={{ background:'#ECE5DD', borderRadius:30, overflow:'hidden', height:480 }}>
                  {/* WA header */}
                  <div style={{ background:'#075E54', padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:gold, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <img src="/luxedu-logo-white.png" alt="" style={{ width:24, height:24, objectFit:'contain' }} onError={e=>e.target.style.display='none'} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:white }}>LuxEdu — École Sidi Maarouf</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,.65)' }}>En ligne</div>
                    </div>
                  </div>
                  {/* messages */}
                  <div style={{ padding:12, display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      { s:false, tag:'Absence', tagC:'#DC2626', tagBg:'#FEE2E2', text:"Votre enfant Youssef est absent aujourd'hui. Merci de contacter l'école.", time:'08:32' },
                      { s:true,  text:"Merci, il a un rendez-vous médical.", time:'08:35' },
                      { s:false, tag:'Bulletin S2', tagC:'#2563EB', tagBg:'#DBEAFE', text:"Le bulletin de Youssef est disponible. Moyenne : 16.4/20", time:'14:10' },
                      { s:false, tag:'Paiement', tagC:'#D97706', tagBg:'#FEF3C7', text:"Frais Avril 2026 en attente — 2 800 MAD.", time:'09:00' },
                      { s:true,  text:"Paiement effectué par virement. Merci.", time:'09:45' },
                    ].map((m,i)=>(
                      <div key={i} style={{ maxWidth:'86%', alignSelf:m.s?'flex-end':'flex-start', background:m.s?'#DCF8C6':white, borderRadius:m.s?'14px 14px 4px 14px':'14px 14px 14px 4px', padding:'9px 12px', boxShadow:'0 1px 3px rgba(0,0,0,.08)' }}>
                        {m.tag && <div style={{ fontSize:9, fontWeight:700, background:m.tagBg, color:m.tagC, padding:'2px 7px', borderRadius:4, display:'inline-block', marginBottom:4 }}>{m.tag}</div>}
                        <div style={{ fontSize:11, color:'#1a1a1a', lineHeight:1.5 }}>{m.text}</div>
                        <div style={{ fontSize:9, color:g400, textAlign:'right', marginTop:3 }}>{m.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* badge */}
              <div style={{ position:'absolute', right:-24, top:80, background:white, borderRadius:14, padding:'12px 18px', boxShadow:'0 8px 32px rgba(0,0,0,.12)', border:`1px solid ${g200}`, zIndex:2 }}>
                <div style={{ fontSize:10, color:g400 }}>Taux d'ouverture</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:24, fontWeight:700, color:navy }}>95 %</div>
                <div style={{ fontSize:10, color:green }}>vs 12 % par email</div>
              </div>
              <div style={{ position:'absolute', left:-20, bottom:80, background:navy, borderRadius:14, padding:'12px 16px', boxShadow:'0 8px 32px rgba(27,44,94,.25)', zIndex:2 }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.5)' }}>Alertes envoyées en</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:gold }}>2 min</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>après le pointage</div>
              </div>
            </div>
          </Fade>
          {/* Text */}
          <Fade delay={0.1} x={30} y={0}>
            <Pill t="WhatsApp natif" />
            <H2>Vos parents informés<br />en temps réel.</H2>
            <P>LuxEdu intègre WhatsApp nativement. Alertes absences, rappels paiements, bulletins — envoyés automatiquement sans aucune configuration ni frais SMS.</P>
            <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:16 }}>
              {[
                ['Alerte absence en 2 minutes','Parent notifié automatiquement dès le pointage. Aucune action de votre équipe.'],
                ['Rappels paiements ciblés','Taux de recouvrement +35 % dès le premier mois grâce aux rappels automatiques.'],
                ['Bulletins en 1 clic','Envoyez les bulletins PDF à toute l\'école simultanément.'],
              ].map(([t,d])=>(
                <div key={t} style={{ display:'flex', gap:14 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:blue, flexShrink:0, marginTop:6 }} />
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:navy, marginBottom:3 }}>{t}</div>
                    <div style={{ fontSize:13, color:g500 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* ════════════════ MODULES ════════════════ */}
      <section id="modules" style={{ padding:'100px 40px', background:off }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <Fade><Pill t="31 modules actifs" /></Fade>
            <Fade delay={0.08}><H2 center>Une plateforme complète, rien de plus</H2></Fade>
            <Fade delay={0.12}><P center>Chaque module est conçu pour le contexte des écoles privées marocaines.</P></Fade>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {MODULES.map((m,i)=>{
              const [h,setH]=useState(false);
              return (
                <Fade key={m} delay={(i%5)*0.04}>
                  <div style={{ background:h?navy:white, border:`1px solid ${h?navy:g200}`, borderRadius:12, padding:'18px 14px', textAlign:'center', transition:'all .2s', cursor:'default', transform:h?'translateY(-2px)':'translateY(0)', boxShadow:h?'0 8px 28px rgba(27,44,94,.15)':'none' }}
                    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
                    <div style={{ width:24, height:3, background:h?gold:g200, borderRadius:2, margin:'0 auto 12px', transition:'background .2s' }} />
                    <div style={{ fontSize:12, fontWeight:700, color:h?white:g700, transition:'color .2s' }}>{m}</div>
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section style={{ padding:'100px 40px', background:white }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <Fade><Pill t="Comment ça marche" /></Fade>
          <Fade delay={0.08}><H2>Opérationnel en 24 heures, garanti.</H2></Fade>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, marginTop:52, position:'relative' }}>
            <div style={{ position:'absolute', top:32, left:'12%', width:'76%', height:1, background:`linear-gradient(90deg,${navy} 0%,${g200} 100%)`, zIndex:0 }} />
            {STEPS.map((s,i)=>{
              const [h,setH]=useState(false);
              return (
                <Fade key={s.n} delay={i*0.1}>
                  <div style={{ background:h?navy:white, border:`1px solid ${h?navy:g200}`, borderRadius:16, padding:'28px 22px', textAlign:'center', transition:'all .28s', cursor:'default', transform:h?'translateY(-5px)':'translateY(0)', boxShadow:h?'0 24px 52px rgba(27,44,94,.18)':'none', position:'relative', zIndex:1 }}
                    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
                    <div style={{ width:54, height:54, borderRadius:'50%', background:h?gold:off, border:`2px solid ${h?gold:g200}`, color:h?navy:g400, fontFamily:"'Georgia',serif", fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', transition:'all .28s' }}>{s.n}</div>
                    <div style={{ fontSize:15, fontWeight:700, color:h?white:navy, marginBottom:8, transition:'color .28s' }}>{s.t}</div>
                    <div style={{ fontSize:13, color:h?'rgba(255,255,255,.6)':g500, lineHeight:1.6, transition:'color .28s' }}>{s.d}</div>
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ COMPARE ════════════════ */}
      <section style={{ padding:'100px 40px', background:off }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <Fade><Pill t="Comparaison" /></Fade>
          <Fade delay={0.08}><H2>Pourquoi choisir LuxEdu ?</H2></Fade>
          <Fade delay={0.12}><P>La seule solution conçue pour le marché éducatif marocain.</P></Fade>
          <Fade delay={0.18}>
            <div style={{ marginTop:48, borderRadius:16, overflow:'hidden', border:`1px solid ${g200}` }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', background:g50 || '#F9FAFB', borderBottom:`1px solid ${g200}` }}>
                <div style={{ padding:'14px 22px', fontSize:12, fontWeight:700, color:g500 }}>Fonctionnalité</div>
                <div style={{ padding:'14px 22px', fontSize:12, fontWeight:700, color:blue, background:'#EFF6FF', textAlign:'center' }}>LuxEdu</div>
                <div style={{ padding:'14px 22px', fontSize:12, fontWeight:700, color:g500, textAlign:'center' }}>Logiciels génériques</div>
              </div>
              {COMPARE.map(([feat,lux,other],i)=>{
                const [h,setH]=useState(false);
                return (
                  <div key={feat} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', borderBottom:i<COMPARE.length-1?`1px solid ${g100}`:undefined, background:h?off:white, transition:'background .15s' }}
                    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
                    <div style={{ padding:'12px 22px', fontSize:13, color:g600, display:'flex', alignItems:'center' }}>{feat}</div>
                    <div style={{ padding:'12px 22px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(37,99,235,0.02)' }}>
                      {lux===true?<Check />:<span style={{ fontSize:12, fontWeight:700, color:green }}>{lux}</span>}
                    </div>
                    <div style={{ padding:'12px 22px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {other===false?<Cross />:<span style={{ fontSize:12, fontWeight:600, color:'#F59E0B' }}>{other}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Fade>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section id="avis" style={{ padding:'100px 40px', background:white }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <Fade><Pill t="Témoignages" /></Fade>
            <Fade delay={0.08}><H2 center>Ils ont transformé leur école avec LuxEdu</H2></Fade>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {TESTI.map((t,i)=>{
              const [h,setH]=useState(false);
              return (
                <Fade key={t.name} delay={i*0.1}>
                  <div style={{ background:h?off:white, border:`1px solid ${h?navy:g200}`, borderRadius:18, padding:'30px 28px', transition:'all .25s', cursor:'default', transform:h?'translateY(-4px)':'translateY(0)', boxShadow:h?'0 20px 52px rgba(27,44,94,.1)':'none' }}
                    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
                    {/* stars */}
                    <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                      {[1,2,3,4,5].map(s=><svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="#F59E0B"><path d="M8 1l1.8 3.6L14 5.2l-3 2.9.7 4.1L8 10.1l-3.7 2.1.7-4.1-3-2.9 4.2-.6z"/></svg>)}
                    </div>
                    {/* quote */}
                    <p style={{ fontSize:15, color:g800||'#1F2937', lineHeight:1.75, marginBottom:24, fontStyle:'italic', margin:'0 0 24px' }}>"{t.text}"</p>
                    {/* author */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, borderTop:`1px solid ${g100}`, paddingTop:18 }}>
                      <div style={{ width:44, height:44, borderRadius:'50%', background:navy, color:white, fontSize:14, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Georgia',serif", flexShrink:0 }}>{t.ini}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:navy }}>{t.name}</div>
                        <div style={{ fontSize:12, color:g400, marginTop:2 }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ PRICING ════════════════ */}
      <section id="tarifs" style={{ padding:'100px 40px', background:off }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <Fade><Pill t="Tarification" /></Fade>
            <Fade delay={0.08}><H2 center>Simple, transparent, sans surprise</H2></Fade>
            <Fade delay={0.12}><P center wide>Facturé annuellement. Setup unique. Réduction fidélité de 10 % dès la 2e année.</P></Fade>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {PLANS.map((p,i)=>{
              const [h,setH]=useState(false);
              return (
                <Fade key={p.n} delay={i*0.1}>
                  <div style={{ background:p.f?navy:white, border:`1px solid ${p.f?navy:g200}`, borderRadius:20, padding:'30px 26px', position:'relative', overflow:'hidden', transition:'all .25s', transform:!p.f&&h?'translateY(-5px)':'translateY(0)', boxShadow:h?'0 24px 56px rgba(0,0,0,.12)':'none' }}
                    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
                    {p.f && <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:gold }} />}
                    <div style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, marginBottom:20, background:p.f?'rgba(255,255,255,.12)':g100, color:p.f?gold:g500 }}>{p.b}</div>
                    <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:p.f?white:navy, marginBottom:4 }}>{p.n}</div>
                    <div style={{ fontSize:11, color:p.f?'rgba(255,255,255,.4)':g400, marginBottom:14 }}>{p.s} · facturé une fois</div>
                    <div style={{ fontFamily:"'Georgia',serif", fontSize:46, fontWeight:700, color:p.f?gold:blue, lineHeight:1, marginBottom:4 }}>{p.p}</div>
                    <div style={{ fontSize:12, color:p.f?'rgba(255,255,255,.4)':g400, marginBottom:26 }}>{p.per}</div>
                    <div style={{ height:1, background:p.f?'rgba(255,255,255,.1)':g100, marginBottom:22 }} />
                    {p.feats.map(feat=>(
                      <div key={feat} style={{ display:'flex', gap:10, marginBottom:12, fontSize:13, color:p.f?'rgba(255,255,255,.75)':g600 }}>
                        <span style={{ color:p.f?gold:green, flexShrink:0, fontWeight:700, fontSize:15, lineHeight:1 }}>&#10003;</span>{feat}
                      </div>
                    ))}
                    <button onClick={goLogin} style={{ display:'block', width:'100%', marginTop:28, padding:'14px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', fontFamily:'inherit', background:p.f?gold:blue, color:p.f?navy:white, transition:'opacity .2s' }}
                      onMouseEnter={e=>e.target.style.opacity='.87'} onMouseLeave={e=>e.target.style.opacity='1'}>
                      Commencer
                    </button>
                  </div>
                </Fade>
              );
            })}
          </div>
          <Fade delay={0.3}>
            <p style={{ textAlign:'center', fontSize:12, color:g400, marginTop:18 }}>Setup facturé une seule fois. Renouvellement annuel. Réduction fidélité à partir de la 2e année.</p>
          </Fade>
        </div>
      </section>

      {/* ════════════════ CTA BANNER ════════════════ */}
      <div style={{ padding:'0 40px 80px' }}>
        <Fade>
          <div style={{ background:`linear-gradient(135deg,${navy} 0%,#1E3A8A 100%)`, borderRadius:24, padding:'0', overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:360, position:'relative' }}>
            {/* left text */}
            <div style={{ padding:'72px 64px', position:'relative', zIndex:1 }}>
              <h2 style={{ fontFamily:"'Georgia',serif", fontSize:40, fontWeight:700, color:white, lineHeight:1.1, margin:'0 0 16px', letterSpacing:'-1px' }}>
                Votre école mérite<br /><span style={{ color:gold }}>mieux qu'un tableur.</span>
              </h2>
              <p style={{ fontSize:16, color:'rgba(255,255,255,.55)', lineHeight:1.65, margin:'0 0 36px' }}>
                Démo gratuite, sans engagement, en 30 minutes.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <Btn label="Demander une démo gratuite" variant="gold" onClick={goLogin} />
                <Btn label="contact@luxedu.ma" variant="ghost" href="mailto:contact@luxedu.ma" />
              </div>
            </div>
            {/* right photo */}
            <div style={{ position:'relative', overflow:'hidden' }}>
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=400&fit=crop&q=80" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:.35 }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(27,44,94,1) 0%,transparent 60%)' }} />
            </div>
          </div>
        </Fade>
      </div>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer style={{ background:'#080F1E', padding:'64px 40px 36px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2.4fr 1fr 1fr 1fr', gap:64, marginBottom:52 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ width:40, height:40, objectFit:'contain', opacity:.9 }} onError={e=>e.target.style.display='none'} />
                <span style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, color:white }}>LuxEdu</span>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.35)', lineHeight:1.75, maxWidth:260, margin:0 }}>
                La solution ERP scolaire conçue pour les écoles privées du Maroc. Moderne, locale, abordable.
              </p>
            </div>
            {[['Produit',['Fonctionnalités','Modules','Tarification','Portail parents','Application Android']],
              ['Ressources',['Documentation','Guide démarrage','FAQ','Support']],
              ['Contact',['WhatsApp','E-mail','Démonstration','À propos']],
            ].map(([title,links])=>(
              <div key={title}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.22)', marginBottom:16 }}>{title}</div>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {links.map(l=>{
                    const [h,setH]=useState(false);
                    return <li key={l} style={{ marginBottom:11 }}><a href="#" style={{ fontSize:13, color:h?white:'rgba(255,255,255,.45)', textDecoration:'none', transition:'color .15s' }} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{l}</a></li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:28, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:'rgba(255,255,255,.22)' }}>
            <span>© 2026 LuxEdu — Tous droits réservés</span>
            <div style={{ display:'flex', gap:24 }}>
              {['Mentions légales','Confidentialité'].map(l=><a key={l} href="#" style={{ color:'rgba(255,255,255,.22)', textDecoration:'none' }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
