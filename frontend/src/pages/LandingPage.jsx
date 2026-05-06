import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── palette (same as Login) ─────────────────────────────── */
const C = {
  navy:   '#1B2C5E',
  navy2:  '#0F1D42',
  blue:   '#2563EB',
  blue2:  '#1D4ED8',
  slate:  '#93C5FD',
  white:  '#FFFFFF',
  off:    '#F8FAFC',
  gray50: '#F9FAFB',
  g100:   '#F3F4F6',
  g200:   '#E5E7EB',
  g300:   '#D1D5DB',
  g400:   '#9CA3AF',
  g500:   '#6B7280',
  g600:   '#4B5563',
  g700:   '#374151',
  g900:   '#0F172A',
  green:  '#16A34A',
  red:    '#DC2626',
};

/* ─── data ────────────────────────────────────────────────── */
const FEATURES = [
  { n:'01', title:'Tableau de bord analytique',
    desc:'KPIs en temps réel, graphes de recouvrement, taux de présence par classe. Vos données, claires et actionnables.' },
  { n:'02', title:'Communication WhatsApp',
    desc:'Alertes absences, rappels paiements, bulletins — envoyés automatiquement. Taux d\'ouverture 95 %, zéro frais SMS.' },
  { n:'03', title:'Gestion des présences',
    desc:'Pointage par classe en deux minutes. Notification automatique au parent dès l\'enregistrement de l\'absence.' },
  { n:'04', title:'Portail parents',
    desc:'Accès sécurisé aux notes, présences et paiements. Authentification par numéro de téléphone et code Massar.' },
  { n:'05', title:'Application Android',
    desc:'Disponible sur Google Play Store. Interface optimisée mobile pour parents et enseignants.' },
  { n:'06', title:'Conformité Maroc',
    desc:'Export Massar MEN, Tawjih BAC, calendrier officiel. Conçu pour le système éducatif marocain, pas une adaptation.' },
];

const MODULES = [
  'Inscriptions','Paiements','Présences','Notes','Bulletins PDF','Certificats',
  'Emploi du temps','Agenda','Portail parents','Application Android',
  'CRM Prospects','Fiche médicale','Cantine','Transport','Bibliothèque',
  'Inventaire','RH Enseignants','Massar MEN','Circulaires','QR Code élèves',
];

const COMPARE = [
  ['WhatsApp natif sans frais SMS',          true,  false],
  ['Code Massar MEN intégré',                true,  false],
  ['Tawjih BAC Maroc',                       true,  false],
  ['Portail parents et application mobile',  true,  'Partiel'],
  ['CRM prospects et inscriptions',          true,  false],
  ['Support en français',                    true,  false],
  ['Déploiement en 24 heures',               true,  false],
  ['Tarif annuel — école 200 élèves',       '1 990 MAD', '6 000 – 12 000 MAD'],
];

const PLANS = [
  { name:'Starter', badge:'Démarrage', featured:false,
    setup:'1 500 MAD setup',  price:'1 990', period:'MAD / an · 200 élèves max',
    feats:['Inscriptions & paiements','WhatsApp automatique','Bulletins & certificats','Emploi du temps','Support e-mail 48 h'] },
  { name:'Pro', badge:'Recommandé', featured:true,
    setup:'2 000 MAD setup',  price:'3 990', period:'MAD / an · 500 élèves max',
    feats:['Tout Starter inclus','Portail parents et élèves','Analytics avancés','CRM Prospects','Application Android','Formation 2 h incluse','Support prioritaire'] },
  { name:'École+', badge:'Grandes écoles', featured:false,
    setup:'3 000 MAD setup',  price:'6 990', period:'MAD / an · Illimité',
    feats:['Tout Pro inclus','Multi-établissements','Examens en ligne','Formation 4 h dédiée','Support 24/7'] },
];

const TESTI = [
  { ini:'AB', bg:C.navy,  name:'Ahmed B.',  role:'Directeur — École Excellence, Casablanca',
    text:'Notre taux de recouvrement est passé de 55 % à 89 % en deux semaines. Les parents règlent maintenant sans relance téléphonique.' },
  { ini:'FR', bg:C.blue,  name:'Fatima R.', role:'Responsable administrative — Académie Al Nour, Rabat',
    text:'Les parents reçoivent les notes et bulletins directement sur WhatsApp. Notre image d\'établissement a complètement changé.' },
  { ini:'KM', bg:'#0D9488', name:'Karim M.', role:'Directeur fondateur — École Avenir, Marrakech',
    text:'Formation en deux heures, déploiement en une journée. Le support répond en moins d\'une heure, en français.' },
];

const STEPS = [
  { n:'01', title:'Démo gratuite',    desc:'30 minutes en ligne. Présentation sur un exemple concret de votre école.' },
  { n:'02', title:'Configuration',    desc:'Vos classes, tarifs et données importées. Prêt en quelques heures.' },
  { n:'03', title:'Formation',        desc:'2 heures pour toute votre équipe. Manuel complet en français.' },
  { n:'04', title:'Mise en ligne',    desc:'Votre école est opérationnelle. Support dédié les 30 premiers jours.' },
];

/* ─── hook: scroll-triggered visibility ─────────────────── */
function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Reveal({ children, delay = 0, y = 24 }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  return (
    <div ref={ref} style={{ transition: `opacity .6s ${delay}s, transform .6s ${delay}s`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : `translateY(${y}px)` }}>
      {children}
    </div>
  );
}

/* ─── component ──────────────────────────────────────────── */
export default function LandingPage() {
  const navigate  = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeModule, setActiveModule] = useState(null);
  const goLogin   = () => navigate('/login');

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navShadow = scrollY > 10;

  /* shared */
  const Pill = ({ children }) => (
    <span style={{ display:'inline-flex', alignItems:'center', background:C.off, border:`1px solid ${C.g200}`, borderRadius:100, padding:'5px 16px', fontSize:12, fontWeight:600, color:C.blue, marginBottom:18, letterSpacing:'0.03em' }}>
      {children}
    </span>
  );

  const H2 = ({ children, center, light }) => (
    <h2 style={{ fontFamily:"'Georgia',serif", fontSize:38, fontWeight:700, color: light ? C.white : C.navy, letterSpacing:'-1px', lineHeight:1.12, margin:`0 0 16px ${center?'auto':'0'}`, textAlign: center ? 'center' : undefined, maxWidth: center ? 640 : undefined }}>
      {children}
    </h2>
  );

  const Sub = ({ children, center, light }) => (
    <p style={{ fontSize:16, color: light ? 'rgba(255,255,255,0.55)' : C.g500, lineHeight:1.75, maxWidth:520, margin: center ? '0 auto' : 0 }}>
      {children}
    </p>
  );

  const Btn = ({ children, variant='primary', onClick, small }) => {
    const [hov, setHov] = useState(false);
    const base = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding: small ? '10px 22px' : '14px 30px', borderRadius:10, fontSize: small ? 13 : 15, fontWeight:700, cursor:'pointer', border:'none', fontFamily:'inherit', transition:'all .2s', textDecoration:'none' };
    const styles = {
      primary:  { ...base, background: hov ? C.blue2 : C.blue, color:C.white, boxShadow: hov ? '0 8px 24px rgba(37,99,235,.4)' : '0 4px 14px rgba(37,99,235,.28)', transform: hov ? 'translateY(-2px)' : 'translateY(0)' },
      outline:  { ...base, background:'transparent', color:C.g600, border:`1.5px solid ${C.g200}`, boxShadow:'none', transform: hov ? 'translateY(-1px)' : 'translateY(0)', ...(hov ? { borderColor:C.blue, color:C.blue } : {}) },
      gold:     { ...base, background: hov ? '#F5C842' : '#E8C46A', color:C.navy, transform: hov ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hov ? '0 8px 24px rgba(232,196,106,.4)' : 'none' },
      ghost:    { ...base, background: hov ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)', color:C.white, border:'1px solid rgba(255,255,255,0.2)' },
    };
    return <button style={styles[variant]} onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>{children}</button>;
  };

  /* ── render ── */
  return (
    <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:C.g900, background:C.white, overflowX:'hidden' }}>

      {/* ════ NAV ════ */}
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:1000, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${navShadow ? C.g200 : 'transparent'}`, transition:'border-color .3s, box-shadow .3s', boxShadow: navShadow ? '0 2px 16px rgba(0,0,0,0.06)' : 'none' }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:68 }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <img src="/luxedu-logo-white.png" alt="LuxEdu"
              style={{ width:36, height:36, objectFit:'contain', filter:'invert(17%) sepia(63%) saturate(600%) hue-rotate(200deg) brightness(60%)' }}
              onError={e => e.target.style.display='none'} />
            <span style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, color:C.navy }}>LuxEdu</span>
          </a>

          <div style={{ display:'flex', gap:2 }}>
            {[['#features','Fonctionnalités'],['#modules','Modules'],['#tarifs','Tarifs'],['#temoignages','Témoignages']].map(([h,l]) => {
              const [hov,setHov] = useState(false);
              return (
                <a key={h} href={h} style={{ padding:'7px 14px', borderRadius:8, fontSize:14, fontWeight:500, color: hov ? C.navy : C.g500, background: hov ? C.g100 : 'transparent', textDecoration:'none', transition:'all .15s' }}
                  onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>{l}</a>
              );
            })}
          </div>

          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Btn variant="outline" onClick={goLogin} small>Se connecter</Btn>
            <Btn variant="primary" onClick={goLogin} small>Démo gratuite</Btn>
          </div>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section style={{ paddingTop:140, paddingBottom:100, background:`linear-gradient(175deg, #EEF4FF 0%, ${C.white} 65%)`, textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-200, left:'50%', transform:'translateX(-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,.06) 0%,transparent 70%)', pointerEvents:'none' }} />
        {/* Floating dots */}
        {[[140,180,'#BFDBFE'],[900,300,'#DDD6FE'],[200,520,'#BBF7D0'],[950,480,'#BFDBFE']].map(([x,y,bg],i) => (
          <div key={i} style={{ position:'absolute', left:x, top:y, width:8, height:8, borderRadius:'50%', background:bg, animation:`float${i%2} 4s ease-in-out infinite`, pointerEvents:'none' }} />
        ))}
        <style>{`@keyframes float0{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes float1{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}`}</style>

        <div style={{ maxWidth:800, margin:'0 auto', padding:'0 40px', position:'relative' }}>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border:'1px solid #BFDBFE', borderRadius:100, padding:'6px 18px 6px 8px', fontSize:13, fontWeight:600, color:C.blue, marginBottom:28 }}>
              <span style={{ background:C.blue, color:C.white, fontSize:10, fontWeight:700, letterSpacing:'.06em', padding:'3px 10px', borderRadius:100 }}>NOUVEAU</span>
              Application Android disponible sur Play Store
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{ fontFamily:"'Georgia',serif", fontSize:60, fontWeight:700, color:C.navy, letterSpacing:'-2.5px', lineHeight:1.08, marginBottom:22 }}>
              Logiciel de Gestion Scolaire<br />
              <span style={{ color:C.blue }}>100 % Maroc</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p style={{ fontSize:19, color:C.g500, maxWidth:540, margin:'0 auto 40px', lineHeight:1.75 }}>
              LuxEdu centralise présences, paiements, notes et communication parents dans une seule plateforme. Conçu pour les écoles privées marocaines.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:20, flexWrap:'wrap' }}>
              <Btn variant="primary" onClick={goLogin}>Essayer gratuitement</Btn>
              <Btn variant="outline"><a href="#features" style={{ textDecoration:'none', color:'inherit' }}>Voir les fonctionnalités</a></Btn>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, fontSize:13, color:C.g400, flexWrap:'wrap', marginBottom:72 }}>
              {['Déploiement en 24 h','Code Massar MEN','Support en français','Sans engagement'].map((t,i,a) => (
                <span key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:C.green, fontWeight:600, fontSize:15 }}>&#10003;</span>
                  <span>{t}</span>
                  {i < a.length-1 && <span style={{ width:4, height:4, borderRadius:'50%', background:C.g200, display:'inline-block', marginLeft:14 }} />}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Dashboard preview */}
          <Reveal delay={0.2} y={40}>
            <div style={{ maxWidth:980, margin:'0 auto', background:C.white, borderRadius:16, border:`1px solid ${C.g200}`, boxShadow:'0 32px 80px rgba(0,0,0,.14)', overflow:'hidden' }}>
              <div style={{ background:'#F9FAFB', borderBottom:`1px solid ${C.g200}`, padding:'12px 18px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ display:'flex', gap:6 }}>
                  {['#FF5F57','#FEBC2E','#28C840'].map(col => <div key={col} style={{ width:11, height:11, borderRadius:'50%', background:col }} />)}
                </div>
                <div style={{ flex:1, background:C.white, border:`1px solid ${C.g200}`, borderRadius:6, padding:'5px 12px', fontSize:12, color:C.g400, fontFamily:'monospace', textAlign:'left' }}>app.luxedu.ma/dashboard</div>
              </div>
              <div style={{ display:'flex', height:340 }}>
                {/* sidebar */}
                <div style={{ width:188, background:C.navy, padding:'12px 0', flexShrink:0 }}>
                  <div style={{ padding:'0 14px 12px', borderBottom:'1px solid rgba(255,255,255,.08)', marginBottom:6 }}>
                    <div style={{ fontFamily:"'Georgia',serif", fontSize:14, fontWeight:700, color:C.white }}>LuxEdu</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', marginTop:2 }}>Espace Directeur</div>
                  </div>
                  {[['Tableau de bord',true],['Tous les élèves',false],['Notes & résultats',false],['Paiements',false],['Classes',false],['Paramètres',false]].map(([l,a]) => (
                    <div key={l} style={{ padding:'7px 14px', fontSize:11, color:a?C.white:'rgba(255,255,255,.45)', background:a?'rgba(255,255,255,.1)':'transparent', borderLeft:a?'2px solid #93C5FD':'2px solid transparent', fontWeight:a?600:400 }}>{l}</div>
                  ))}
                </div>
                {/* main */}
                <div style={{ flex:1, background:'#F8FAFC', padding:18, overflow:'hidden' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                    <div>
                      <div style={{ fontFamily:"'Georgia',serif", fontSize:14, fontWeight:700, color:C.navy }}>Tableau de bord</div>
                      <div style={{ fontSize:10, color:C.g400 }}>Mercredi 6 mai 2026</div>
                    </div>
                    <div style={{ background:C.blue, color:C.white, border:'none', borderRadius:7, padding:'6px 12px', fontSize:11, fontWeight:600 }}>+ Inscrire</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
                    {[['248','Élèves',C.blue],['94%','Présence','#16A34A'],['86%','Recouvrement','#F59E0B'],['3','Alertes','#EF4444']].map(([v,l,col]) => (
                      <div key={l} style={{ background:C.white, borderRadius:9, padding:'10px 12px', border:`1px solid ${C.g200}` }}>
                        <div style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, color:col, lineHeight:1 }}>{v}</div>
                        <div style={{ fontSize:9, color:C.g400, marginTop:3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr', gap:8 }}>
                    <div style={{ background:C.white, borderRadius:9, padding:12, border:`1px solid ${C.g200}` }}>
                      <div style={{ fontSize:10, fontWeight:600, color:C.navy, marginBottom:10 }}>Recouvrement 2025-2026</div>
                      <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:70 }}>
                        {[['Sep',30,C.g200],['Oct',38,'#BFDBFE'],['Nov',46,'#93C5FD'],['Déc',53,'#60A5FA'],['Jan',60,C.blue],['Fév',63,'#1D4ED8'],['Mar',68,C.navy],['Avr',72,C.navy],['Mai',68,'#E8C46A']].map(([m,h,bg]) => (
                          <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, justifyContent:'flex-end', height:'100%' }}>
                            <div style={{ width:'100%', height:h+'px', background:bg, borderRadius:'2px 2px 0 0' }} />
                            <div style={{ fontSize:7, color:C.g400 }}>{m}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background:C.white, borderRadius:9, padding:12, border:`1px solid ${C.g200}` }}>
                      <div style={{ fontSize:10, fontWeight:600, color:C.navy, marginBottom:10 }}>Statut paiements</div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                        <div style={{ width:58, height:58, borderRadius:'50%', background:'conic-gradient(#16A34A 0% 55%,#2563EB 55% 80%,#F59E0B 80% 100%)', position:'relative' }}>
                          <div style={{ position:'absolute', inset:10, borderRadius:'50%', background:C.white }} />
                        </div>
                        <div>
                          {[['#16A34A','Réglés 55%'],['#2563EB','Partiels 25%'],['#F59E0B','Retard 20%']].map(([bg,l]) => (
                            <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:8, color:C.g600, marginBottom:3 }}>
                              <div style={{ width:6, height:6, borderRadius:'50%', background:bg }} />{l}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ CLIENTS ════ */}
      <div style={{ padding:'32px 40px', borderTop:`1px solid ${C.g100}`, borderBottom:`1px solid ${C.g100}`, background:C.white }}>
        <div style={{ maxWidth:960, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:C.g400, marginBottom:20 }}>Fait confiance par les meilleures écoles du Maroc</div>
          <div style={{ display:'flex', gap:48, justifyContent:'center', flexWrap:'wrap' }}>
            {['École Excellence Arrow','Académie Al Nour','Institut Avenir','École Lumière Rabat','Complexe Atlas'].map(n => (
              <div key={n} style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:700, color:C.g300 }}>{n}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ FEATURES ════ */}
      <section id="features" style={{ padding:'96px 40px', background:C.off }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <Reveal><Pill>Fonctionnalités</Pill></Reveal>
          <Reveal delay={0.1}><H2>Tout ce dont votre école a besoin<br />dans une seule plateforme</H2></Reveal>
          <Reveal delay={0.15}><Sub>LuxEdu remplace les tableurs, les dossiers papier et les appels téléphoniques par un système moderne et centralisé.</Sub></Reveal>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22, marginTop:52 }}>
            {FEATURES.map((f,i) => {
              const [hov,setHov] = useState(false);
              return (
                <Reveal key={f.n} delay={i*0.07}>
                  <div style={{ background:C.white, border:`1px solid ${hov ? C.navy : C.g200}`, borderRadius:14, padding:'28px', transition:'all .25s', transform: hov ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hov ? '0 20px 48px rgba(27,44,94,.1)' : 'none', cursor:'default', position:'relative', overflow:'hidden' }}
                    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:C.navy, transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:'transform .3s' }} />
                    <div style={{ fontFamily:"'Georgia',serif", fontSize:32, fontWeight:700, color:C.g200, lineHeight:1, marginBottom:14 }}>{f.n}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:C.navy, marginBottom:10 }}>{f.title}</div>
                    <div style={{ fontSize:14, color:C.g500, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ METRICS ════ */}
      <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`, padding:'80px 40px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:48 }}>
          {[['+35 %','Recouvrement paiements dès le 1er mois'],['3 h','Économisées par jour par votre équipe'],['24 h','Pour être opérationnel après signature'],['31','Modules actifs inclus dans la plateforme']].map(([v,l],i) => (
            <Reveal key={v} delay={i*0.1}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:48, fontWeight:700, color:'#E8C46A', lineHeight:1, marginBottom:10 }}>{v}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.55 }}>{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ════ MODULES ════ */}
      <section id="modules" style={{ padding:'96px 40px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <Reveal><Pill>31 modules actifs</Pill></Reveal>
            <Reveal delay={0.1}><H2 center>Une plateforme complète, rien de plus</H2></Reveal>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {MODULES.map((m,i) => {
              const [hov,setHov] = useState(false);
              const active = activeModule === m;
              return (
                <Reveal key={m} delay={(i%5)*0.05}>
                  <div style={{ background:C.white, border:`1px solid ${active||hov ? C.navy : C.g200}`, borderRadius:12, padding:'18px 14px', textAlign:'center', transition:'all .2s', cursor:'default', transform: hov ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hov ? '0 8px 24px rgba(27,44,94,.1)' : 'none' }}
                    onMouseEnter={()=>{ setHov(true); setActiveModule(m); }} onMouseLeave={()=>{ setHov(false); setActiveModule(null); }}>
                    <div style={{ width:28, height:3, background: hov ? C.navy : C.g200, borderRadius:2, margin:'0 auto 12px', transition:'background .2s' }} />
                    <div style={{ fontSize:12, fontWeight:700, color: hov ? C.navy : C.g700 }}>{m}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section style={{ padding:'96px 40px', background:C.off }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <Reveal><Pill>Comment ça marche</Pill></Reveal>
          <Reveal delay={0.1}><H2>Opérationnel en 24 heures, garanti.</H2></Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, marginTop:52, position:'relative' }}>
            <div style={{ position:'absolute', top:32, left:'12%', width:'76%', height:1, background:`linear-gradient(90deg, ${C.navy} 0%, ${C.g200} 100%)`, zIndex:0 }} />
            {STEPS.map((s,i) => {
              const [hov,setHov] = useState(false);
              return (
                <Reveal key={s.n} delay={i*0.1}>
                  <div style={{ background:C.white, border:`1px solid ${C.g200}`, borderRadius:14, padding:'28px 22px', textAlign:'center', transition:'all .25s', cursor:'default', transform: hov ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hov ? '0 20px 48px rgba(0,0,0,.09)' : 'none', position:'relative', zIndex:1 }}
                    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
                    <div style={{ width:52, height:52, borderRadius:'50%', background: hov ? C.navy : C.off, border:`2px solid ${hov ? C.navy : C.g200}`, color: hov ? C.white : C.g400, fontFamily:"'Georgia',serif", fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', transition:'all .25s' }}>{s.n}</div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.navy, marginBottom:8 }}>{s.title}</div>
                    <div style={{ fontSize:13, color:C.g500, lineHeight:1.6 }}>{s.desc}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ COMPARE ════ */}
      <section style={{ padding:'96px 40px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <Reveal><Pill>Comparaison</Pill></Reveal>
          <Reveal delay={0.1}><H2>Pourquoi choisir LuxEdu ?</H2></Reveal>
          <Reveal delay={0.15}><Sub>La seule solution conçue spécifiquement pour le marché éducatif marocain.</Sub></Reveal>
          <Reveal delay={0.2}>
            <div style={{ marginTop:48, borderRadius:14, overflow:'hidden', border:`1px solid ${C.g200}` }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', background:C.gray50 || '#F9FAFB', borderBottom:`1px solid ${C.g200}` }}>
                <div style={{ padding:'14px 20px', fontSize:12, fontWeight:700, color:C.g500 }}>Fonctionnalité</div>
                <div style={{ padding:'14px 20px', fontSize:12, fontWeight:700, color:C.blue, background:'#EFF6FF', textAlign:'center' }}>LuxEdu</div>
                <div style={{ padding:'14px 20px', fontSize:12, fontWeight:700, color:C.g500, textAlign:'center' }}>Logiciels génériques</div>
              </div>
              {COMPARE.map(([feat,lux,other],i) => {
                const [hov,setHov] = useState(false);
                return (
                  <div key={feat} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', borderBottom: i < COMPARE.length-1 ? `1px solid ${C.g100}` : 'none', background: hov ? C.off : C.white, transition:'background .15s' }}
                    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
                    <div style={{ padding:'12px 20px', fontSize:13, color:C.g600, display:'flex', alignItems:'center' }}>{feat}</div>
                    <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(37,99,235,0.025)' }}>
                      {lux === true
                        ? <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#DCFCE7"/><path d="M6 10l3 3 5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        : <span style={{ fontSize:12, fontWeight:700, color:C.green }}>{lux}</span>
                      }
                    </div>
                    <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {other === false
                        ? <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#F3F4F6"/><path d="M7 7l6 6M13 7l-6 6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                        : <span style={{ fontSize:12, fontWeight:600, color:'#F59E0B' }}>{other}</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section id="temoignages" style={{ padding:'96px 40px', background:C.off }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <Reveal><Pill>Témoignages</Pill></Reveal>
            <Reveal delay={0.1}><H2 center>Ils ont transformé leur école<br />avec LuxEdu</H2></Reveal>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {TESTI.map((t,i) => {
              const [hov,setHov] = useState(false);
              return (
                <Reveal key={t.name} delay={i*0.1}>
                  <div style={{ background:C.white, border:`1px solid ${C.g200}`, borderRadius:16, padding:'28px', transition:'all .25s', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? '0 16px 48px rgba(0,0,0,.08)' : 'none' }}
                    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
                    <div style={{ display:'flex', gap:2, marginBottom:16 }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color:'#F59E0B', fontSize:15 }}>&#9733;</span>)}
                    </div>
                    <p style={{ fontSize:15, color:C.g800 || '#1F2937', lineHeight:1.72, marginBottom:22, fontStyle:'italic' }}>"{t.text}"</p>
                    <div style={{ display:'flex', alignItems:'center', gap:12, borderTop:`1px solid ${C.g100}`, paddingTop:18 }}>
                      <div style={{ width:42, height:42, borderRadius:'50%', background:t.bg, color: t.bg === '#E8C46A' ? C.navy : C.white, fontSize:14, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Georgia',serif", flexShrink:0 }}>{t.ini}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>{t.name}</div>
                        <div style={{ fontSize:12, color:C.g400, marginTop:2 }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ PRICING ════ */}
      <section id="tarifs" style={{ padding:'96px 40px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <Reveal><Pill>Tarification</Pill></Reveal>
            <Reveal delay={0.1}><H2 center>Simple, transparent, sans surprise</H2></Reveal>
            <Reveal delay={0.15}><Sub center>Facturé annuellement. Setup unique. Réduction fidélité de 10 % dès la 2e année.</Sub></Reveal>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {PLANS.map((p,i) => {
              const [hov,setHov] = useState(false);
              return (
                <Reveal key={p.name} delay={i*0.1}>
                  <div style={{ background: p.featured ? C.navy : C.white, border:`1px solid ${p.featured ? C.navy : C.g200}`, borderRadius:18, padding:'30px 26px', position:'relative', overflow:'hidden', transition:'all .25s', transform: !p.featured && hov ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hov ? '0 20px 56px rgba(0,0,0,.1)' : 'none' }}
                    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
                    {p.featured && <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'#E8C46A' }} />}
                    <div style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, marginBottom:18, background: p.featured ? 'rgba(255,255,255,.12)' : C.g100, color: p.featured ? '#E8C46A' : C.g500 }}>{p.badge}</div>
                    <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color: p.featured ? C.white : C.navy, marginBottom:4 }}>{p.name}</div>
                    <div style={{ fontSize:11, color: p.featured ? 'rgba(255,255,255,.4)' : C.g400, marginBottom:14 }}>{p.setup} · facturé une seule fois</div>
                    <div style={{ fontFamily:"'Georgia',serif", fontSize:44, fontWeight:700, color: p.featured ? '#E8C46A' : C.blue, lineHeight:1, marginBottom:4 }}>{p.price}</div>
                    <div style={{ fontSize:12, color: p.featured ? 'rgba(255,255,255,.4)' : C.g400, marginBottom:24 }}>{p.period}</div>
                    <div style={{ height:1, background: p.featured ? 'rgba(255,255,255,.1)' : C.g100, marginBottom:20 }} />
                    {p.feats.map(f => (
                      <div key={f} style={{ display:'flex', gap:10, marginBottom:10, fontSize:13, color: p.featured ? 'rgba(255,255,255,.7)' : C.g600 }}>
                        <span style={{ color: p.featured ? '#E8C46A' : C.green, flexShrink:0, fontWeight:700, fontSize:15 }}>&#10003;</span>
                        {f}
                      </div>
                    ))}
                    <button onClick={goLogin} style={{ display:'block', width:'100%', marginTop:26, padding:'13px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', fontFamily:'inherit', background: p.featured ? '#E8C46A' : C.blue, color: p.featured ? C.navy : C.white, transition:'opacity .2s' }}
                      onMouseEnter={e=>e.target.style.opacity='.88'} onMouseLeave={e=>e.target.style.opacity='1'}>
                      Commencer
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.3}>
            <p style={{ textAlign:'center', fontSize:12, color:C.g400, marginTop:20 }}>
              Les frais de setup sont facturés une seule fois. Renouvellement annuel avec réduction fidélité.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <div style={{ margin:'0 40px 80px' }}>
        <Reveal>
          <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy2} 100%)`, borderRadius:22, padding:'72px 64px', display:'grid', gridTemplateColumns:'1fr auto', gap:64, alignItems:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', right:-100, top:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
            <div>
              <h2 style={{ fontFamily:"'Georgia',serif", fontSize:40, fontWeight:700, color:C.white, lineHeight:1.1, marginBottom:14, letterSpacing:'-1px', margin:'0 0 14px' }}>
                Votre école mérite<br /><span style={{ color:'#E8C46A' }}>mieux qu'un tableur.</span>
              </h2>
              <p style={{ fontSize:16, color:'rgba(255,255,255,.55)', lineHeight:1.65, margin:0 }}>
                Démo gratuite, sans engagement, en 30 minutes.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12, flexShrink:0, position:'relative' }}>
              <Btn variant="gold" onClick={goLogin}>Demander une démo gratuite</Btn>
              <a href="mailto:contact@luxedu.ma" style={{ padding:'13px 28px', borderRadius:10, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.18)', fontSize:14, fontWeight:600, color:C.white, textAlign:'center', textDecoration:'none', transition:'background .2s' }}
                onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.16)'} onMouseLeave={e=>e.target.style.background='rgba(255,255,255,0.08)'}>
                contact@luxedu.ma
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ════ FOOTER ════ */}
      <footer style={{ background:'#0A1628', padding:'60px 40px 36px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2.2fr 1fr 1fr 1fr', gap:60, marginBottom:52 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ width:32, height:32, objectFit:'contain', opacity:0.8 }} onError={e=>e.target.style.display='none'} />
                <span style={{ fontFamily:"'Georgia',serif", fontSize:18, fontWeight:700, color:C.white }}>LuxEdu</span>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.35)', lineHeight:1.7, maxWidth:260, margin:0 }}>La solution ERP scolaire conçue pour les écoles privées du Maroc.</p>
            </div>
            {[['Produit',['Fonctionnalités','Modules','Tarification','Portail parents','Application Android']],
              ['Ressources',['Documentation','Guide démarrage','FAQ','Support']],
              ['Contact',['WhatsApp','E-mail','Démonstration','À propos']],
            ].map(([t,links]) => (
              <div key={t}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.25)', marginBottom:14 }}>{t}</div>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {links.map(l => {
                    const [hov,setHov] = useState(false);
                    return (
                      <li key={l} style={{ marginBottom:10 }}>
                        <a href="#" style={{ fontSize:13, color: hov ? C.white : 'rgba(255,255,255,.45)', textDecoration:'none', transition:'color .15s' }}
                          onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>{l}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:'rgba(255,255,255,.25)' }}>
            <span>© 2026 LuxEdu — Tous droits réservés</span>
            <div style={{ display:'flex', gap:20 }}>
              {['Mentions légales','Confidentialité'].map(l => (
                <a key={l} href="#" style={{ color:'rgba(255,255,255,.25)', textDecoration:'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
