import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const navy='#1B2C5E',navy2='#0F1D42',blue='#2563EB',gold='#E8C46A',white='#FFFFFF',off='#F8FAFC',g100='#F3F4F6',g200='#E5E7EB',g400='#9CA3AF',g500='#6B7280',g600='#4B5563',g700='#374151',g900='#0F172A',green='#16A34A';

const FEATS=[
  {n:'01',t:'Tableau de bord analytique',d:'KPIs en temps réel — recouvrement, présences, alertes. Vos données toujours accessibles et actionnables.'},
  {n:'02',t:'Communication WhatsApp',d:'Absences, paiements, bulletins — envoyés automatiquement. Taux d\'ouverture 95 %, sans frais SMS.'},
  {n:'03',t:'Gestion des présences',d:'Pointage par classe en deux minutes. Notification automatique au parent dès l\'enregistrement.'},
  {n:'04',t:'Portail parents',d:'Notes, présences et paiements accessibles sur mobile. Authentification par code Massar.'},
  {n:'05',t:'Application Android',d:'Disponible sur Google Play Store. Optimisée mobile pour parents et enseignants.'},
  {n:'06',t:'Conformité Maroc',d:'Massar MEN, Tawjih BAC, calendrier officiel. Conçu pour le système éducatif marocain.'},
];

const MODULES=['Inscriptions','Paiements','Présences','Notes','Bulletins PDF','Certificats','Emploi du temps','Agenda','Portail parents','App Android','CRM Prospects','Fiche médicale','Cantine','Transport','Bibliothèque','Inventaire','RH Enseignants','Massar MEN','Circulaires','QR Code élèves'];

const COMPARE=[
  ['WhatsApp natif sans frais SMS',true,false],
  ['Code Massar MEN intégré',true,false],
  ['Tawjih BAC Maroc',true,false],
  ['Portail parents et application mobile',true,'Partiel'],
  ['CRM prospects et inscriptions',true,false],
  ['Support en français',true,false],
  ['Déploiement en 24 heures',true,false],
  ['Tarif annuel — 200 élèves','1 990 MAD','6 000–12 000 MAD'],
];

const PLANS=[
  {n:'Starter',b:'Démarrage',f:false,s:'1 500 MAD setup',p:'1 990',per:'MAD/an · 200 élèves',feats:['Inscriptions & paiements','WhatsApp automatique','Bulletins & certificats','Emploi du temps','Support e-mail 48 h']},
  {n:'Pro',b:'Recommandé',f:true,s:'2 000 MAD setup',p:'3 990',per:'MAD/an · 500 élèves',feats:['Tout Starter inclus','Portail parents','Analytics avancés','CRM Prospects','Application Android','Formation 2 h incluse','Support prioritaire']},
  {n:'École+',b:'Grandes écoles',f:false,s:'3 000 MAD setup',p:'6 990',per:'MAD/an · Illimité',feats:['Tout Pro inclus','Multi-établissements','Examens en ligne','Formation 4 h','Support 24/7']},
];

const TESTI=[
  {ini:'MB',bg:navy,name:'Mohamed Benjelloun',role:'Directeur — École Sidi Maarouf, Casablanca',text:'Notre taux de recouvrement est passé de 52 % à 91 % en six semaines. Les rappels WhatsApp automatiques ont tout changé.'},
  {ini:'KA',bg:blue,name:'Khadija El Alami',role:'Responsable adm. — Complexe Annasr, Rabat',text:'La plateforme remplace cinq outils différents. Bulletins, présences, paiements — tout centralisé. Nos enseignants formés en 2h.'},
  {ini:'YT',bg:'#0D9488',name:'Youssef Tazi',role:'Directeur — Institut Averroès, Marrakech',text:'Déploiement en une journée, support réactif, interface claire. Les parents nous félicitent pour notre communication.'},
];

const STEPS=[
  {n:'01',t:'Démo gratuite',d:'30 minutes en ligne. Présentation sur un exemple concret de votre école.'},
  {n:'02',t:'Configuration',d:'Vos classes, tarifs et données importées. Prêt en quelques heures.'},
  {n:'03',t:'Formation',d:'2 heures pour toute votre équipe. Manuel complet en français fourni.'},
  {n:'04',t:'Mise en ligne',d:'Votre école est opérationnelle. Support dédié les 30 premiers jours.'},
];

// Hover card component - hooks at top level
function HoverCard({ children, style, hoverStyle }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ ...style, ...(h ? hoverStyle : {}) }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
}

function NavLink({ href, children }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} style={{ padding:'7px 16px', borderRadius:8, fontSize:14, fontWeight:500, color:h?navy:g500, background:h?g100:'transparent', textDecoration:'none', transition:'all .15s' }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</a>
  );
}

function Btn({ children, variant='primary', onClick, href }) {
  const [h, setH] = useState(false);
  const base = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 28px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', fontFamily:'inherit', textDecoration:'none', transition:'all .2s' };
  const styles = {
    primary:{ ...base, background:h?'#1D4ED8':blue, color:white, boxShadow:h?'0 8px 28px rgba(37,99,235,.4)':'0 4px 14px rgba(37,99,235,.25)', transform:h?'translateY(-2px)':'none' },
    outline: { ...base, background:'transparent', color:h?blue:g600, border:`1.5px solid ${h?blue:g200}`, transform:h?'translateY(-1px)':'none' },
    gold:    { ...base, background:h?'#F5C842':gold, color:navy, transform:h?'translateY(-2px)':'none', boxShadow:h?'0 8px 28px rgba(232,196,106,.45)':'none' },
    ghost:   { ...base, background:h?'rgba(255,255,255,.15)':'rgba(255,255,255,.08)', color:white, border:'1px solid rgba(255,255,255,.2)' },
  };
  const props = { style:styles[variant]||styles.primary, onClick, onMouseEnter:()=>setH(true), onMouseLeave:()=>setH(false) };
  return href ? <a href={href} {...props}>{children}</a> : <button {...props}>{children}</button>;
}

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Fade({ children, delay=0, y=24 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ transition:`opacity .65s ${delay}s, transform .65s ${delay}s`, opacity:vis?1:0, transform:vis?'translateY(0)':`translateY(${y}px)` }}>
      {children}
    </div>
  );
}

const Pill = ({ t }) => <span style={{ display:'inline-block', background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:100, padding:'5px 16px', fontSize:12, fontWeight:600, color:blue, marginBottom:16, letterSpacing:'.03em' }}>{t}</span>;
const H2 = ({ children, center, light }) => <h2 style={{ fontFamily:"'Georgia',serif", fontSize:38, fontWeight:700, color:light?white:navy, letterSpacing:'-1.2px', lineHeight:1.12, margin:center?'0 auto 18px':'0 0 18px', textAlign:center?'center':undefined }}>{children}</h2>;
const P = ({ children, center, light }) => <p style={{ fontSize:17, color:light?'rgba(255,255,255,.55)':g500, lineHeight:1.75, maxWidth:520, margin:center?'0 auto':0 }}>{children}</p>;
const Check = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#DCFCE7"/><path d="M6 10l3 3 5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Cross = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill={g100}/><path d="M7 7l6 6M13 7l-6 6" stroke={g200} strokeWidth="2" strokeLinecap="round"/></svg>;

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const goLogin = () => navigate('/login');

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:g900, background:white, overflowX:'hidden' }}>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:1000, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${scrollY>10?g200:'transparent'}`, boxShadow:scrollY>10?'0 2px 16px rgba(0,0,0,.06)':'none', transition:'all .3s' }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:70 }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <img src="/luxedu-logo.png" alt="LuxEdu" style={{ width:40, height:40, objectFit:'contain' }} onError={e=>e.target.style.display='none'} />
            <span style={{ fontFamily:"'Georgia',serif", fontSize:21, fontWeight:700, color:navy }}>LuxEdu</span>
          </a>
          <div style={{ display:'flex', gap:2 }}>
            {[['#features','Fonctionnalités'],['#modules','Modules'],['#tarifs','Tarifs'],['#avis','Témoignages']].map(([h,l])=><NavLink key={h} href={h}>{l}</NavLink>)}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn variant="outline" onClick={goLogin}>Se connecter</Btn>
            <Btn variant="primary" onClick={goLogin}>Démo gratuite</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop:130, background:`linear-gradient(165deg,#EAF0FF 0%,${off} 55%,${white} 100%)`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-200, right:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,.06) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1160, margin:'0 auto', padding:'60px 40px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          <div>
            <Fade>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border:'1px solid #BFDBFE', borderRadius:100, padding:'6px 18px 6px 8px', fontSize:13, fontWeight:600, color:blue, marginBottom:28 }}>
                <span style={{ background:blue, color:white, fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:100 }}>NOUVEAU</span>
                Application Android disponible · Essai gratuit 30 jours
              </div>
            </Fade>
            <Fade delay={0.08}>
              <h1 style={{ fontFamily:"'Georgia',serif", fontSize:52, fontWeight:700, color:navy, letterSpacing:'-2px', lineHeight:1.1, margin:'0 0 22px' }}>
                Gérez votre école<br/><span style={{ color:blue }}>intelligemment.</span>
              </h1>
            </Fade>
            <Fade delay={0.14}>
              <p style={{ fontSize:18, color:g500, lineHeight:1.78, margin:'0 0 36px', maxWidth:460 }}>
                LuxEdu centralise présences, paiements, notes et communication parents. Une seule plateforme, conçue pour les écoles privées marocaines.
              </p>
            </Fade>
            <Fade delay={0.2}>
              <div style={{ display:'flex', gap:14, marginBottom:32, flexWrap:'wrap' }}>
                <Btn variant="primary" onClick={goLogin}>Essayer gratuitement</Btn>
                <Btn variant="outline" href="#features">Voir les fonctionnalités</Btn>
              </div>
            </Fade>
            <Fade delay={0.26}>
              <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
                {['Déploiement en 24 h','Code Massar MEN','Sans engagement'].map(t=>(
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:g500 }}>
                    <span style={{ color:green, fontSize:16, fontWeight:700 }}>✓</span>{t}
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Dashboard preview */}
          <Fade delay={0.15} y={0}>
            <div style={{ position:'relative', paddingBottom:24 }}>
              <div style={{ position:'absolute', top:-18, right:-12, background:white, borderRadius:14, padding:'12px 18px', boxShadow:'0 8px 32px rgba(0,0,0,.12)', border:`1px solid ${g200}`, zIndex:2, minWidth:160 }}>
                <div style={{ fontSize:11, color:g400, marginBottom:4 }}>Recouvrement ce mois</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:26, fontWeight:700, color:green }}>+35 %</div>
                <div style={{ fontSize:11, color:g400 }}>vs mois dernier</div>
              </div>
              <div style={{ position:'absolute', bottom:10, left:-18, background:navy, borderRadius:14, padding:'12px 16px', boxShadow:'0 8px 32px rgba(27,44,94,.3)', zIndex:2 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginBottom:4 }}>WhatsApp envoyés</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:gold }}>1 248</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>ce mois · 0 MAD</div>
              </div>
              <div style={{ borderRadius:16, overflow:'hidden', boxShadow:'0 32px 80px rgba(27,44,94,.2)', background:white, border:`1px solid ${g200}` }}>
                <div style={{ background:off, borderBottom:`1px solid ${g200}`, padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ display:'flex', gap:5 }}>
                    {['#FF5F57','#FEBC2E','#28C840'].map(c=><div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
                  </div>
                  <div style={{ flex:1, background:white, border:`1px solid ${g200}`, borderRadius:5, padding:'4px 12px', fontSize:11, color:g400, fontFamily:'monospace' }}>app.luxeduschool.com/dashboard</div>
                </div>
                <div style={{ display:'flex', height:300 }}>
                  <div style={{ width:170, background:navy, padding:'12px 0', flexShrink:0 }}>
                    <div style={{ padding:'0 14px 12px', borderBottom:'1px solid rgba(255,255,255,.07)', marginBottom:6 }}>
                      <div style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:700, color:white }}>LuxEdu</div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', marginTop:2 }}>Espace Directeur</div>
                    </div>
                    {[['Tableau de bord',true],['Tous les élèves',false],['Notes',false],['Paiements',false],['Classes',false]].map(([l,a])=>(
                      <div key={l} style={{ padding:'6px 14px', fontSize:11, color:a?white:'rgba(255,255,255,.45)', background:a?'rgba(255,255,255,.1)':'transparent', borderLeft:a?`2px solid ${gold}`:'2px solid transparent' }}>{l}</div>
                    ))}
                  </div>
                  <div style={{ flex:1, background:off, padding:14, overflow:'hidden' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                      <div>
                        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:700, color:navy }}>Tableau de bord</div>
                        <div style={{ fontSize:9, color:g400 }}>Mercredi 6 mai 2026</div>
                      </div>
                      <div style={{ background:blue, color:white, borderRadius:6, padding:'5px 10px', fontSize:10, fontWeight:600 }}>+ Inscrire</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:10 }}>
                      {[['248','Élèves',blue],['94%','Présence',green],['86%','Recouvr.','#F59E0B'],['3','Alertes','#EF4444']].map(([v,l,c])=>(
                        <div key={l} style={{ background:white, borderRadius:8, padding:'8px 10px', border:`1px solid ${g200}` }}>
                          <div style={{ fontFamily:"'Georgia',serif", fontSize:18, fontWeight:700, color:c, lineHeight:1 }}>{v}</div>
                          <div style={{ fontSize:8, color:g400, marginTop:2 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:white, borderRadius:8, padding:10, border:`1px solid ${g200}` }}>
                      <div style={{ fontSize:9, fontWeight:600, color:navy, marginBottom:6 }}>Recouvrement mensuel</div>
                      <div style={{ display:'flex', alignItems:'flex-end', gap:2, height:60 }}>
                        {[['S',28,g200],['O',36,'#BFDBFE'],['N',44,'#93C5FD'],['D',52,'#60A5FA'],['J',58,blue],['F',62,'#1D4ED8'],['M',66,navy],['A',70,navy],['M',64,gold]].map(([m,h,c])=>(
                          <div key={m+h} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, justifyContent:'flex-end', height:'100%' }}>
                            <div style={{ width:'100%', height:h+'%', background:c, borderRadius:'2px 2px 0 0', minHeight:3 }}/>
                            <div style={{ fontSize:7, color:g400 }}>{m}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </div>

        {/* Photo band */}
        <div style={{ display:'flex', gap:12, padding:'32px 40px 0', overflow:'hidden' }}>
          {['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=380&h=200&fit=crop&q=70','https://images.unsplash.com/photo-1588072432836-e10032774350?w=380&h=200&fit=crop&q=70','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=380&h=200&fit=crop&q=70','https://images.unsplash.com/photo-1509062522246-3755977927d7?w=380&h=200&fit=crop&q=70'].map((src,i)=>(
            <img key={i} src={src} alt="" style={{ height:160, width:280, objectFit:'cover', borderRadius:12, flexShrink:0, boxShadow:'0 8px 32px rgba(0,0,0,.12)', opacity:.9 }} />
          ))}
        </div>
      </section>

      {/* CLIENTS */}
      <div style={{ background:white, borderTop:`1px solid ${g100}`, borderBottom:`1px solid ${g100}`, padding:'32px 40px' }}>
        <div style={{ maxWidth:960, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:g400, marginBottom:20 }}>Fait confiance par des écoles privées du Maroc</div>
          <div style={{ display:'flex', gap:40, justifyContent:'center', flexWrap:'wrap' }}>
            {['École Sidi Maarouf · Casablanca','Complexe Annasr · Rabat','Institut Averroès · Marrakech','École Ibn Khaldoun · Fès','Al Farabi · Agadir'].map(n=>(
              <div key={n} style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:700, color:g200 }}>{n}</div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ padding:'96px 40px', background:off }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <Fade><Pill t="Fonctionnalités" /></Fade>
          <Fade delay={0.08}><H2>Tout ce dont votre école a besoin<br/>dans une seule plateforme</H2></Fade>
          <Fade delay={0.12}><P>LuxEdu remplace les tableurs, les dossiers papier et les appels téléphoniques par un système moderne.</P></Fade>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22, marginTop:52 }}>
            {FEATS.map((f,i)=>(
              <Fade key={f.n} delay={i*0.07}>
                <HoverCard
                  style={{ background:white, border:`1px solid ${g200}`, borderRadius:14, padding:28, transition:'all .25s', cursor:'default', overflow:'hidden', position:'relative' }}
                  hoverStyle={{ transform:'translateY(-4px)', boxShadow:'0 20px 48px rgba(27,44,94,.1)', borderColor:'transparent', borderTop:`3px solid ${navy}` }}>
                  <div style={{ fontFamily:"'Georgia',serif", fontSize:30, fontWeight:700, color:g200, lineHeight:1, marginBottom:14 }}>{f.n}</div>
                  <div style={{ fontSize:16, fontWeight:700, color:navy, marginBottom:10 }}>{f.t}</div>
                  <div style={{ fontSize:14, color:g500, lineHeight:1.65 }}>{f.d}</div>
                </HoverCard>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <div style={{ background:`linear-gradient(135deg,${navy} 0%,${navy2} 100%)`, padding:'80px 40px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:48 }}>
          {[['+35 %','Recouvrement paiements dès le 1er mois'],['3 h','Économisées par jour par votre équipe'],['24 h','Pour être opérationnel après signature'],['31','Modules actifs inclus dans la plateforme']].map(([v,l],i)=>(
            <Fade key={v} delay={i*0.1}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:48, fontWeight:700, color:gold, lineHeight:1, marginBottom:10 }}>{v}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.55 }}>{l}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>

      {/* WHATSAPP SECTION */}
      <section style={{ padding:'96px 40px', background:white }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          <Fade y={0}>
            <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
              <div style={{ position:'absolute', right:-20, top:60, background:white, borderRadius:12, padding:'10px 14px', boxShadow:'0 8px 28px rgba(0,0,0,.12)', border:`1px solid ${g200}`, zIndex:2 }}>
                <div style={{ fontSize:10, color:g400 }}>Taux d'ouverture</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:navy }}>95 %</div>
                <div style={{ fontSize:10, color:green }}>vs 12 % email</div>
              </div>
              <div style={{ position:'absolute', left:-16, bottom:60, background:navy, borderRadius:12, padding:'10px 14px', boxShadow:'0 8px 28px rgba(27,44,94,.25)', zIndex:2 }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.5)' }}>Alertes envoyées en</div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, color:gold }}>2 min</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>après le pointage</div>
              </div>
              <div style={{ width:260, background:'#1C1C1E', borderRadius:36, padding:10, boxShadow:'0 32px 64px rgba(0,0,0,.3)' }}>
                <div style={{ background:'#ECE5DD', borderRadius:28, overflow:'hidden', height:420, display:'flex', flexDirection:'column' }}>
                  <div style={{ background:'#075E54', padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>L</div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:white }}>LuxEdu École</div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,.65)' }}>En ligne</div>
                    </div>
                  </div>
                  <div style={{ flex:1, padding:10, display:'flex', flexDirection:'column', gap:7, overflow:'hidden' }}>
                    {[
                      {s:false,tag:'Absence',tagC:'#DC2626',tagBg:'#FEE2E2',text:"Youssef est absent aujourd'hui."},
                      {s:true,text:"Merci, rendez-vous médical."},
                      {s:false,tag:'Bulletin S2',tagC:'#2563EB',tagBg:'#DBEAFE',text:"Bulletin disponible. Moy: 16.4/20"},
                      {s:false,tag:'Paiement',tagC:'#D97706',tagBg:'#FEF3C7',text:"Frais Avril — 2 800 MAD en attente."},
                      {s:true,text:"Paiement effectué. Merci."},
                    ].map((m,i)=>(
                      <div key={i} style={{ maxWidth:'87%', alignSelf:m.s?'flex-end':'flex-start', background:m.s?'#DCF8C6':white, borderRadius:m.s?'12px 12px 2px 12px':'12px 12px 12px 2px', padding:'7px 10px', boxShadow:'0 1px 2px rgba(0,0,0,.08)' }}>
                        {m.tag && <div style={{ fontSize:8, fontWeight:700, background:m.tagBg, color:m.tagC, padding:'1px 6px', borderRadius:3, display:'inline-block', marginBottom:3 }}>{m.tag}</div>}
                        <div style={{ fontSize:10, color:'#1a1a1a', lineHeight:1.5 }}>{m.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Fade>
          <Fade delay={0.1}>
            <Pill t="WhatsApp natif" />
            <H2>Vos parents informés<br/>en temps réel.</H2>
            <P>LuxEdu intègre WhatsApp nativement. Alertes absences, rappels paiements, bulletins — envoyés automatiquement sans frais SMS.</P>
            <div style={{ marginTop:28, display:'flex', flexDirection:'column', gap:14 }}>
              {[['Alerte absence en 2 minutes','Parent notifié automatiquement dès le pointage.'],['Rappels paiements ciblés','Taux de recouvrement +35 % dès le premier mois.'],['Bulletins en 1 clic','Envoyez les bulletins PDF à toute l\'école simultanément.']].map(([t,d])=>(
                <div key={t} style={{ display:'flex', gap:12 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:blue, flexShrink:0, marginTop:6 }} />
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:navy, marginBottom:3 }}>{t}</div>
                    <div style={{ fontSize:13, color:g500 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" style={{ padding:'96px 40px', background:off }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <Fade><Pill t="31 modules actifs" /></Fade>
            <Fade delay={0.08}><H2 center>Une plateforme complète, rien de plus</H2></Fade>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {MODULES.map((m,i)=>(
              <Fade key={m} delay={(i%5)*0.04}>
                <HoverCard
                  style={{ background:white, border:`1px solid ${g200}`, borderRadius:12, padding:'16px 14px', textAlign:'center', transition:'all .2s', cursor:'default' }}
                  hoverStyle={{ background:navy, borderColor:navy, transform:'translateY(-2px)', boxShadow:'0 8px 24px rgba(27,44,94,.15)' }}>
                  <div style={{ width:24, height:3, background:g200, borderRadius:2, margin:'0 auto 10px' }} />
                  <div style={{ fontSize:12, fontWeight:700, color:g700 }}>{m}</div>
                </HoverCard>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'96px 40px', background:white }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <Fade><Pill t="Comment ça marche" /></Fade>
          <Fade delay={0.08}><H2>Opérationnel en 24 heures, garanti.</H2></Fade>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:22, marginTop:52, position:'relative' }}>
            <div style={{ position:'absolute', top:32, left:'12%', width:'76%', height:1, background:`linear-gradient(90deg,${navy} 0%,${g200} 100%)`, zIndex:0 }} />
            {STEPS.map((s,i)=>(
              <Fade key={s.n} delay={i*0.1}>
                <HoverCard
                  style={{ background:white, border:`1px solid ${g200}`, borderRadius:14, padding:'26px 20px', textAlign:'center', transition:'all .25s', cursor:'default', position:'relative', zIndex:1 }}
                  hoverStyle={{ transform:'translateY(-4px)', boxShadow:'0 20px 48px rgba(27,44,94,.12)', background:navy }}>
                  <div style={{ width:50, height:50, borderRadius:'50%', background:off, border:`2px solid ${g200}`, fontFamily:"'Georgia',serif", fontSize:15, fontWeight:700, color:g400, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>{s.n}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:navy, marginBottom:6 }}>{s.t}</div>
                  <div style={{ fontSize:12, color:g500, lineHeight:1.6 }}>{s.d}</div>
                </HoverCard>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section style={{ padding:'96px 40px', background:off }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <Fade><Pill t="Comparaison" /></Fade>
          <Fade delay={0.08}><H2>Pourquoi choisir LuxEdu ?</H2></Fade>
          <Fade delay={0.12}><P>La seule solution conçue pour le marché éducatif marocain.</P></Fade>
          <Fade delay={0.18}>
            <div style={{ marginTop:48, borderRadius:14, overflow:'hidden', border:`1px solid ${g200}` }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', background:'#F9FAFB', borderBottom:`1px solid ${g200}` }}>
                <div style={{ padding:'13px 20px', fontSize:12, fontWeight:700, color:g500 }}>Fonctionnalité</div>
                <div style={{ padding:'13px 20px', fontSize:12, fontWeight:700, color:blue, background:'#EFF6FF', textAlign:'center' }}>LuxEdu</div>
                <div style={{ padding:'13px 20px', fontSize:12, fontWeight:700, color:g500, textAlign:'center' }}>Génériques</div>
              </div>
              {COMPARE.map(([feat,lux,other],i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', borderBottom:i<COMPARE.length-1?`1px solid ${g100}`:undefined, background:white }}>
                  <div style={{ padding:'11px 20px', fontSize:13, color:g600, display:'flex', alignItems:'center' }}>{feat}</div>
                  <div style={{ padding:'11px 20px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(37,99,235,.02)' }}>
                    {lux===true?<Check />:<span style={{ fontSize:12, fontWeight:700, color:green }}>{lux}</span>}
                  </div>
                  <div style={{ padding:'11px 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {other===false?<Cross />:<span style={{ fontSize:12, fontWeight:600, color:'#F59E0B' }}>{other}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="avis" style={{ padding:'96px 40px', background:white }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <Fade><Pill t="Témoignages" /></Fade>
            <Fade delay={0.08}><H2 center>Ils ont transformé leur école avec LuxEdu</H2></Fade>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {TESTI.map((t,i)=>(
              <Fade key={t.name} delay={i*0.1}>
                <HoverCard
                  style={{ background:white, border:`1px solid ${g200}`, borderRadius:16, padding:'28px', transition:'all .25s', cursor:'default' }}
                  hoverStyle={{ transform:'translateY(-4px)', boxShadow:'0 20px 52px rgba(27,44,94,.1)' }}>
                  <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                    {[1,2,3,4,5].map(s=><svg key={s} width="14" height="14" viewBox="0 0 16 16" fill="#F59E0B"><path d="M8 1l1.8 3.6L14 5.2l-3 2.9.7 4.1L8 10.1l-3.7 2.1.7-4.1-3-2.9 4.2-.6z"/></svg>)}
                  </div>
                  <p style={{ fontSize:14, color:'#1F2937', lineHeight:1.72, marginBottom:20, fontStyle:'italic', margin:'0 0 20px' }}>"{t.text}"</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12, borderTop:`1px solid ${g100}`, paddingTop:16 }}>
                    <div style={{ width:42, height:42, borderRadius:'50%', background:t.bg, color:white, fontSize:13, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Georgia',serif", flexShrink:0 }}>{t.ini}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:navy }}>{t.name}</div>
                      <div style={{ fontSize:11, color:g400, marginTop:2 }}>{t.role}</div>
                    </div>
                  </div>
                </HoverCard>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding:'96px 40px', background:off }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <Fade><Pill t="Tarification" /></Fade>
            <Fade delay={0.08}><H2 center>Simple, transparent, sans surprise</H2></Fade>
            <Fade delay={0.12}><P center>Facturé annuellement. Setup unique. Réduction fidélité de 10 % dès la 2e année.</P></Fade>
          </div>

          {/* Free trial banner */}
          <Fade delay={0.1}>
            <div style={{ background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border:'1px solid #BFDBFE', borderRadius:14, padding:'22px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, marginBottom:28 }}>
              <div>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:18, fontWeight:700, color:navy, marginBottom:6 }}>Essayez LuxEdu gratuitement pendant 30 jours</div>
                <div style={{ fontSize:13, color:g500 }}>Sans engagement · Sans carte bancaire · Configuration incluse · Support dédié</div>
              </div>
              <button onClick={goLogin} style={{ padding:'12px 26px', background:blue, color:white, border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 }}>
                Démarrer l'essai gratuit
              </button>
            </div>
          </Fade>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {PLANS.map((p,i)=>(
              <Fade key={p.n} delay={i*0.1}>
                <div style={{ background:p.f?navy:white, border:`1px solid ${p.f?navy:g200}`, borderRadius:20, padding:'28px 24px', position:'relative', overflow:'hidden', transition:'all .25s' }}>
                  {p.f && <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:gold }} />}
                  <div style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, marginBottom:18, background:p.f?'rgba(255,255,255,.12)':g100, color:p.f?gold:g500 }}>{p.b}</div>
                  <div style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, color:p.f?white:navy, marginBottom:4 }}>{p.n}</div>
                  <div style={{ fontSize:11, color:p.f?'rgba(255,255,255,.4)':g400, marginBottom:12 }}>{p.s} · facturé une fois</div>
                  <div style={{ fontFamily:"'Georgia',serif", fontSize:44, fontWeight:700, color:p.f?gold:blue, lineHeight:1, marginBottom:4 }}>{p.p}</div>
                  <div style={{ fontSize:12, color:p.f?'rgba(255,255,255,.4)':g400, marginBottom:24 }}>{p.per}</div>
                  <div style={{ height:1, background:p.f?'rgba(255,255,255,.1)':g100, marginBottom:20 }} />
                  {p.feats.map(feat=>(
                    <div key={feat} style={{ display:'flex', gap:10, marginBottom:10, fontSize:13, color:p.f?'rgba(255,255,255,.75)':g600 }}>
                      <span style={{ color:p.f?gold:green, flexShrink:0, fontWeight:700, fontSize:15 }}>✓</span>{feat}
                    </div>
                  ))}
                  <button onClick={goLogin} style={{ display:'block', width:'100%', marginTop:26, padding:13, borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', fontFamily:'inherit', background:p.f?gold:blue, color:p.f?navy:white }}>
                    Commencer
                  </button>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding:'0 40px 80px' }}>
        <Fade>
          <div style={{ background:`linear-gradient(135deg,${navy} 0%,#1E3A8A 100%)`, borderRadius:22, overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:320, position:'relative' }}>
            <div style={{ padding:'64px', position:'relative', zIndex:1 }}>
              <h2 style={{ fontFamily:"'Georgia',serif", fontSize:38, fontWeight:700, color:white, lineHeight:1.1, margin:'0 0 16px', letterSpacing:'-1px' }}>
                Votre école mérite<br/><span style={{ color:gold }}>mieux qu'un tableur.</span>
              </h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', lineHeight:1.65, margin:'0 0 32px' }}>Démo gratuite, sans engagement, en 30 minutes.</p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <Btn variant="gold" onClick={goLogin}>Demander une démo gratuite</Btn>
                <Btn variant="ghost" href="mailto:contact@luxeduschool.com">contact@luxeduschool.com</Btn>
              </div>
            </div>
            <div style={{ position:'relative', overflow:'hidden' }}>
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=400&fit=crop&q=70" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:.3 }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(27,44,94,1) 0%,transparent 60%)' }} />
            </div>
          </div>
        </Fade>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#080F1E', padding:'60px 40px 36px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2.2fr 1fr 1fr 1fr', gap:60, marginBottom:48 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ width:36, height:36, objectFit:'contain', opacity:.85 }} onError={e=>e.target.style.display='none'} />
                <span style={{ fontFamily:"'Georgia',serif", fontSize:18, fontWeight:700, color:white }}>LuxEdu</span>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.35)', lineHeight:1.75, maxWidth:260, margin:0 }}>La solution ERP scolaire conçue pour les écoles privées du Maroc.</p>
            </div>
            {[['Produit',['Fonctionnalités','Modules','Tarification','Portail parents','Application Android']],['Ressources',['Documentation','Guide démarrage','FAQ','Support']],['Contact',['WhatsApp','E-mail','Démonstration','À propos']]].map(([title,links])=>(
              <div key={title}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.22)', marginBottom:14 }}>{title}</div>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {links.map(l=><li key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontSize:13, color:'rgba(255,255,255,.45)', textDecoration:'none' }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:24, display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,.22)' }}>
            <span>© 2026 LuxEdu · luxeduschool.com · Maroc</span>
            <div style={{ display:'flex', gap:20 }}>
              {['Mentions légales','Confidentialité'].map(l=><a key={l} href="#" style={{ color:'rgba(255,255,255,.22)', textDecoration:'none' }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
      {/* WhatsApp floating button */}
      <a href="https://wa.me/212600000000?text=Bonjour%20LuxEdu" target="_blank" rel="noopener noreferrer" style={{ position:'fixed', bottom:28, right:28, zIndex:1000, width:56, height:56, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(37,211,102,0.45)', textDecoration:'none' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
}
