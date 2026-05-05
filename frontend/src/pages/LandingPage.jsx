import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Syne:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.lp{font-family:'Plus Jakarta Sans',sans-serif;color:#1F2937;background:#fff;overflow-x:hidden;line-height:1.6}
/* NAV */
.lnav{position:fixed;top:0;width:100%;z-index:1000;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(0,0,0,0.06);transition:box-shadow .3s}
.lnav.sc{box-shadow:0 4px 24px rgba(0,0,0,0.08)}
.lnav-in{max-width:1160px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:70px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.logo-mk{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#1B2C5E,#2563EB);display:flex;align-items:center;justify-content:center;font-size:18px}
.logo-tx{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#1B2C5E}
.logo-tx em{color:#2563EB;font-style:normal}
.lnav-links{display:flex;gap:4px;list-style:none}
.lnav-links a{padding:8px 15px;border-radius:8px;font-size:14px;font-weight:500;color:#4B5563;text-decoration:none;transition:all .15s}
.lnav-links a:hover{background:#F3F4F6;color:#1B2C5E}
.lnav-r{display:flex;align-items:center;gap:10px}
.nbtn{padding:9px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;text-decoration:none}
.nbtn-g{border:1.5px solid #E5E7EB;background:#fff;color:#1F2937}
.nbtn-g:hover{border-color:#2563EB;color:#2563EB}
.nbtn-p{background:#2563EB;border:none;color:#fff;display:flex;align-items:center;gap:6px}
.nbtn-p:hover{background:#1D4ED8;transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,99,235,.35)}
/* HERO */
.hero{padding:148px 40px 80px;background:linear-gradient(175deg,#F0F6FF 0%,#fff 60%);text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-300px;left:50%;transform:translateX(-50%);width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 65%);pointer-events:none}
.hero-in{max-width:820px;margin:0 auto;position:relative}
.badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1px solid #BFDBFE;border-radius:100px;padding:6px 18px 6px 8px;font-size:13px;font-weight:600;color:#2563EB;margin-bottom:30px}
.badge-chip{background:#2563EB;color:#fff;font-size:10px;font-weight:700;letter-spacing:.06em;padding:3px 10px;border-radius:100px}
.h1{font-family:'Syne',sans-serif;font-size:66px;font-weight:800;color:#1B2C5E;letter-spacing:-2.5px;margin-bottom:22px;line-height:1.07}
.h1 .acc{color:#2563EB}
.hero-sub{font-size:19px;color:#4B5563;font-weight:400;max-width:540px;margin:0 auto 40px;line-height:1.75}
.hero-acts{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:18px;flex-wrap:wrap}
.cbtn-p{display:inline-flex;align-items:center;gap:8px;padding:15px 32px;border-radius:10px;background:#2563EB;border:none;font-size:15px;font-weight:700;color:#fff;cursor:pointer;text-decoration:none;box-shadow:0 4px 24px rgba(37,99,235,.35);transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif}
.cbtn-p:hover{background:#1D4ED8;transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,99,235,.45)}
.cbtn-s{display:inline-flex;align-items:center;gap:8px;padding:15px 32px;border-radius:10px;background:#fff;border:1.5px solid #E5E7EB;font-size:15px;font-weight:600;color:#1F2937;cursor:pointer;text-decoration:none;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif}
.cbtn-s:hover{border-color:#2563EB;color:#2563EB}
.trust{display:flex;align-items:center;justify-content:center;gap:6px;font-size:13px;color:#9CA3AF;margin-bottom:60px;flex-wrap:wrap}
.trust strong{color:#10B981;font-weight:600}
.tdot{width:4px;height:4px;border-radius:50%;background:#E5E7EB}
/* SCREENSHOT */
.scr{max-width:980px;margin:0 auto;border-radius:16px;border:1px solid #E5E7EB;box-shadow:0 32px 80px rgba(0,0,0,.13);overflow:hidden;background:#fff}
.scr-bar{background:#F9FAFB;border-bottom:1px solid #E5E7EB;padding:12px 18px;display:flex;align-items:center;gap:12px}
.dots{display:flex;gap:6px}
.dot{width:11px;height:11px;border-radius:50%}
.url-bar{flex:1;background:#fff;border:1px solid #E5E7EB;border-radius:6px;padding:5px 12px;font-size:12px;color:#9CA3AF;font-family:monospace;text-align:left}
.scr-body{display:flex;height:370px}
.scr-sb{width:195px;background:#1B2C5E;flex-shrink:0;padding:14px 0}
.sb-logo{padding:0 16px 14px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:8px}
.sb-logo .t{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#fff}
.sb-logo .t em{color:#93C5FD;font-style:normal}
.sb-logo .s{font-size:9px;color:rgba(255,255,255,.35);letter-spacing:.08em}
.sb-sec{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);padding:10px 16px 4px}
.sb-item{display:flex;align-items:center;gap:8px;padding:7px 16px;font-size:11px;color:rgba(255,255,255,.5)}
.sb-item.act{background:rgba(255,255,255,.1);color:#fff;font-weight:600;border-left:2.5px solid #F59E0B;padding-left:13.5px}
.sb-bdg{margin-left:auto;background:#EF4444;color:#fff;font-size:8px;font-weight:700;padding:1px 5px;border-radius:10px}
.scr-main{flex:1;background:#F8FAFF;padding:18px;overflow:hidden}
.sm-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
.sm-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#1B2C5E}
.sm-sub{font-size:10px;color:#9CA3AF;margin-top:2px}
.sm-btn{background:#2563EB;color:#fff;border:none;border-radius:7px;padding:7px 13px;font-size:11px;font-weight:600;cursor:pointer}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
.kpi{background:#fff;border-radius:10px;padding:11px 13px;border:1px solid #E5E7EB}
.kpi-v{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.kpi-l{font-size:9px;color:#9CA3AF;margin-top:1px}
.charts{display:grid;grid-template-columns:1.7fr 1fr;gap:8px}
.chart-box{background:#fff;border-radius:10px;padding:13px;border:1px solid #E5E7EB}
.chart-title{font-size:10px;font-weight:700;color:#1B2C5E;margin-bottom:10px}
.bars{display:flex;align-items:flex-end;gap:3px;height:74px}
.bc{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;justify-content:flex-end}
.br{width:100%;border-radius:2px 2px 0 0}
.bl{font-size:7px;color:#9CA3AF}
.donut-wrap{display:flex;align-items:center;justify-content:center;flex-direction:column;height:82px;gap:8px}
.donut{width:62px;height:62px;border-radius:50%;background:conic-gradient(#10B981 0% 55%,#2563EB 55% 80%,#F59E0B 80% 100%);position:relative}
.donut::after{content:'';position:absolute;inset:10px;border-radius:50%;background:#fff}
.dleg{display:flex;flex-direction:column;gap:4px}
.drow{display:flex;align-items:center;gap:5px;font-size:8px;color:#6B7280}
.ddot{width:7px;height:7px;border-radius:50%}
/* CLIENTS */
.clients{padding:34px 40px;border-top:1px solid #F3F4F6;border-bottom:1px solid #F3F4F6}
.clients-in{max-width:960px;margin:0 auto;text-align:center}
.cl-lbl{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9CA3AF;margin-bottom:20px}
.cl-logos{display:flex;align-items:center;justify-content:center;gap:44px;flex-wrap:wrap}
.cl-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:#D1D5DB;transition:color .2s}
.cl-name:hover{color:#9CA3AF}
/* SECTION */
.sec{padding:96px 40px}
.sec-in{max-width:1160px;margin:0 auto}
.pill{display:inline-flex;align-items:center;gap:6px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:100px;padding:5px 16px;font-size:12px;font-weight:600;color:#2563EB;margin-bottom:16px}
.h2{font-family:'Syne',sans-serif;font-size:44px;font-weight:800;color:#1B2C5E;letter-spacing:-1.5px;margin-bottom:16px;line-height:1.1}
.sp{font-size:17px;color:#4B5563;font-weight:400;line-height:1.7;max-width:520px}
/* FEATURES */
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:52px}
.fc{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:28px;transition:all .25s;position:relative;overflow:hidden}
.fc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:#2563EB;transform:scaleX(0);transform-origin:left;transition:transform .3s}
.fc:hover{transform:translateY(-4px);box-shadow:0 20px 56px rgba(0,0,0,.09);border-color:transparent}
.fc:hover::before{transform:scaleX(1)}
.fi{width:50px;height:50px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px}
.fi-b{background:#EFF6FF}.fi-g{background:#ECFDF5}.fi-a{background:#FFFBEB}.fi-p{background:#F5F3FF}.fi-t{background:#F0FDFA}.fi-n{background:rgba(27,44,94,.07)}
.ft{font-size:17px;font-weight:700;color:#1B2C5E;margin-bottom:8px}
.fd{font-size:14px;color:#4B5563;line-height:1.65}
/* METRICS */
.met{background:#1B2C5E;padding:76px 40px}
.met-in{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:48px}
.mitem{text-align:center}
.mv{font-family:'Syne',sans-serif;font-size:54px;font-weight:800;color:#F59E0B;line-height:1;margin-bottom:8px}
.ml{font-size:14px;color:rgba(255,255,255,.5);line-height:1.5}
/* MODULES */
.mod-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:48px}
.mod{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:18px 14px;text-align:center;transition:all .2s;cursor:default}
.mod:hover{border-color:#2563EB;box-shadow:0 8px 24px rgba(37,99,235,.1);transform:translateY(-2px)}
.mod-i{font-size:24px;margin-bottom:8px}
.mod-n{font-size:12px;font-weight:700;color:#1B2C5E}
.mod-s{font-size:10px;color:#9CA3AF;margin-top:3px}
/* COMPARE */
.ctbl{margin-top:48px;border-radius:14px;overflow:hidden;border:1px solid #E5E7EB}
.ch{display:grid;grid-template-columns:2fr 1fr 1fr;background:#F9FAFB;border-bottom:1px solid #E5E7EB}
.chc{padding:14px 20px;font-size:13px;font-weight:700;color:#6B7280}
.chc.lx{color:#2563EB;background:#EFF6FF;text-align:center}
.chc.ot{text-align:center}
.crow{display:grid;grid-template-columns:2fr 1fr 1fr;border-bottom:1px solid #F3F4F6}
.crow:last-child{border:none}
.crow:hover{background:#F9FAFB}
.cc{padding:12px 20px;font-size:13px;color:#4B5563;display:flex;align-items:center}
.cc.ctr{justify-content:center}
.cc.lxc{background:rgba(37,99,235,.025)}
.cyes{color:#10B981;font-size:18px;font-weight:700}
.cno{color:#E5E7EB;font-size:18px}
.cpart{font-size:12px;font-weight:600;color:#F59E0B}
/* STEPS */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:52px}
.step{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:28px 22px;text-align:center;transition:all .25s;position:relative}
.step:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,.09)}
.step-n{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#1B2C5E,#2563EB);color:#fff;font-family:'Syne',sans-serif;font-size:20px;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.step-i{font-size:26px;margin-bottom:10px}
.step-t{font-size:15px;font-weight:700;color:#1B2C5E;margin-bottom:6px}
.step-d{font-size:13px;color:#4B5563;line-height:1.6}
/* TESTI */
.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:48px}
.tc{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:26px;transition:all .25s}
.tc:hover{box-shadow:0 16px 48px rgba(0,0,0,.08);transform:translateY(-3px)}
.tst{color:#F59E0B;font-size:14px;margin-bottom:12px}
.ttx{font-size:15px;color:#1F2937;line-height:1.7;margin-bottom:18px;font-style:italic}
.tau{display:flex;align-items:center;gap:12px;border-top:1px solid #F3F4F6;padding-top:14px}
.tav{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0;font-family:'Syne',sans-serif}
.tavn{font-size:14px;font-weight:700;color:#1B2C5E}
.tavr{font-size:11px;color:#9CA3AF}
/* PRICING */
.pg{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:48px auto 0;max-width:880px}
.pc{background:#fff;border:1px solid #E5E7EB;border-radius:18px;padding:28px 24px;transition:all .25s;position:relative;overflow:hidden}
.pc:not(.pf):hover{box-shadow:0 20px 56px rgba(0,0,0,.1)}
.pf{background:#1B2C5E;border-color:#1B2C5E}
.pb{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:18px}
.pc:not(.pf) .pb{background:#F3F4F6;color:#4B5563}
.pf .pb{background:rgba(255,255,255,.12);color:#FCD34D}
.pn{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#1B2C5E;margin-bottom:4px}
.pf .pn{color:#fff}
.pset{font-size:11px;color:#9CA3AF;margin-bottom:10px}
.pf .pset{color:rgba(255,255,255,.4)}
.ppr{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;color:#2563EB;line-height:1;margin-bottom:4px}
.pf .ppr{color:#FCD34D}
.pper{font-size:12px;color:#9CA3AF;margin-bottom:22px}
.pf .pper{color:rgba(255,255,255,.4)}
.pdiv{height:1px;background:#F3F4F6;margin-bottom:18px}
.pf .pdiv{background:rgba(255,255,255,.1)}
.pfeat{display:flex;gap:9px;margin-bottom:10px;font-size:13px;color:#4B5563}
.pf .pfeat{color:rgba(255,255,255,.7)}
.pchk{color:#10B981;flex-shrink:0;font-size:14px}
.pf .pchk{color:#FCD34D}
.pcta{display:block;width:100%;margin-top:22px;padding:13px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;border:none;text-align:center;transition:all .2s;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif}
.pc:not(.pf) .pcta{background:#2563EB;color:#fff}
.pc:not(.pf) .pcta:hover{background:#1D4ED8}
.pf .pcta{background:#F59E0B;color:#1B2C5E}
.pf .pcta:hover{background:#FCD34D}
/* CTA BANNER */
.ctab{margin:0 40px 80px;background:linear-gradient(135deg,#1B2C5E 0%,#1E40AF 100%);border-radius:22px;padding:68px 60px;display:grid;grid-template-columns:1fr auto;gap:60px;align-items:center;position:relative;overflow:hidden}
.ctab::before{content:'';position:absolute;right:-80px;top:-80px;width:350px;height:350px;border-radius:50%;background:rgba(255,255,255,.03)}
.ctab-t{font-family:'Syne',sans-serif;font-size:38px;font-weight:800;color:#fff;line-height:1.1;margin-bottom:12px;letter-spacing:-1px}
.ctab-t em{color:#FCD34D;font-style:normal}
.ctab-s{font-size:16px;color:rgba(255,255,255,.55);line-height:1.6}
.ctab-btns{display:flex;flex-direction:column;gap:10px;flex-shrink:0;position:relative;z-index:1}
.ctab-m{padding:15px 30px;border-radius:10px;background:#F59E0B;border:none;font-size:15px;font-weight:700;color:#1B2C5E;cursor:pointer;white-space:nowrap;transition:all .2s;text-decoration:none;display:block;text-align:center;font-family:'Plus Jakarta Sans',sans-serif}
.ctab-m:hover{background:#FCD34D;transform:translateY(-2px)}
.ctab-sc{padding:14px 30px;border-radius:10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);font-size:14px;font-weight:600;color:#fff;cursor:pointer;white-space:nowrap;text-align:center;text-decoration:none;display:block;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif}
.ctab-sc:hover{background:rgba(255,255,255,.18)}
/* FOOTER */
.lfoot{background:#111827;padding:60px 40px 36px}
.lfoot-in{max-width:1160px;margin:0 auto}
.lfoot-top{display:grid;grid-template-columns:2.2fr 1fr 1fr 1fr;gap:60px;margin-bottom:48px}
.lfoot-brand{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff;margin-bottom:10px}
.lfoot-brand em{color:#93C5FD;font-style:normal}
.lfoot-desc{font-size:13px;color:rgba(255,255,255,.38);line-height:1.7;max-width:260px}
.lfoot-ct{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.25);margin-bottom:14px}
.lfoot-links{list-style:none;display:flex;flex-direction:column;gap:9px}
.lfoot-links a{font-size:13px;color:rgba(255,255,255,.45);text-decoration:none;transition:color .15s}
.lfoot-links a:hover{color:#fff}
.lfoot-bot{border-top:1px solid rgba(255,255,255,.05);padding-top:24px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,.25)}
/* WA FLOAT */
.wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 20px rgba(37,211,102,.4);cursor:pointer;text-decoration:none;transition:all .2s}
.wa:hover{transform:scale(1.1);box-shadow:0 8px 28px rgba(37,211,102,.55)}
/* WA SECTION */
.wa-sec{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;padding:96px 40px;background:#F8FAFF}
.wa-phone-wrap{position:relative;display:flex;justify-content:center}
.wa-phone{width:290px;background:#1A1A1A;border-radius:38px;padding:12px;box-shadow:0 40px 80px rgba(0,0,0,.25)}
.wa-screen{background:#ECE5DD;border-radius:28px;overflow:hidden;height:480px;display:flex;flex-direction:column}
.wa-hdr{background:#075E54;padding:10px 14px;display:flex;align-items:center;gap:10px}
.wa-av{width:34px;height:34px;border-radius:50%;background:#F59E0B;display:flex;align-items:center;justify-content:center;font-size:15px}
.wa-cn{font-size:13px;font-weight:700;color:#fff}
.wa-cs{font-size:10px;color:rgba(255,255,255,.65)}
.wa-msgs{flex:1;padding:12px;display:flex;flex-direction:column;gap:8px;overflow:hidden}
.wm{max-width:88%;background:#fff;border-radius:12px 12px 12px 0;padding:9px 12px;font-size:11px;color:#1a1a1a;line-height:1.5;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.wm.s{align-self:flex-end;background:#DCF8C6;border-radius:12px 12px 0 12px}
.wm-t{font-size:9px;color:#9ca3af;text-align:right;margin-top:3px}
.wm-tag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;margin-bottom:4px;display:inline-block}
.tag-r{background:#FEE2E2;color:#DC2626}
.tag-b{background:#DBEAFE;color:#2563EB}
.tag-g{background:#DCFCE7;color:#16A34A}
.wa-badge1{position:absolute;right:-16px;top:90px;background:#fff;border-radius:12px;padding:12px 16px;box-shadow:0 8px 32px rgba(0,0,0,.15);border:1px solid #E5E7EB;font-size:12px;min-width:155px}
.wa-badge2{position:absolute;left:-16px;bottom:100px;background:#1B2C5E;border-radius:12px;padding:12px 16px;box-shadow:0 8px 32px rgba(0,0,0,.2);font-size:12px;min-width:148px;color:#fff}
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const goLogin = () => navigate('/login');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const FEATS = [
    ['fi-b','📊','Dashboard analytique','Recouvrement, présences, performances en temps réel. Graphes interactifs et alertes intelligentes.'],
    ['fi-g','💬','WhatsApp automatique','Alertes absences, rappels paiements, bulletins — tout automatisé. Taux d\'ouverture 95%, zéro SMS payant.'],
    ['fi-a','✅','Présences journalières','Pointage par classe en 2 minutes. Parent notifié automatiquement en cas d\'absence. Historique complet.'],
    ['fi-p','👨‍👩‍👧','Portail parents','Notes, présences et paiements depuis le téléphone. Login simple : numéro + code Massar.'],
    ['fi-t','📱','Application Android','App mobile sur Play Store. Parents et enseignants connectés partout, même hors connexion.'],
    ['fi-n','🇲🇦','100% Adapté au Maroc','Massar MEN, Tawjih BAC, calendrier officiel. Conçu pour le système éducatif marocain.'],
  ];

  const MODULES = [
    ['📊','Dashboard','Live'],['👥','Inscriptions','Élèves'],['💰','Paiements','Suivi'],['✅','Présences','WA auto'],
    ['💬','WhatsApp','Auto'],['📋','Notes','S1/S2'],['📄','Bulletins PDF','Auto'],['🎓','Certificats','PDF'],
    ['🕐','EDT','Classes'],['📅','Agenda','RDV'],['👨‍👩‍👧','Portail parents','Mobile'],['📱','App Android','Play Store'],
    ['🤝','CRM','Prospects'],['🏥','Médical','Fiches'],['🍽️','Cantine','Menus'],['🚌','Transport','Circuits'],
    ['📚','Biblio','Emprunts'],['📦','Inventaire','Matériel'],['👔','RH','Enseignants'],['🇲🇦','Massar','MEN'],
  ];

  const COMPARE = [
    ['WhatsApp natif (sans SMS payant)','✓','✗'],
    ['Code Massar MEN intégré','✓','✗'],
    ['Tawjih BAC Maroc','✓','✗'],
    ['Portail parents & App Android','✓','Partiel'],
    ['CRM prospects inscriptions','✓','✗'],
    ['Support en français & darija','✓','✗'],
    ['Déploiement en 24h','✓','2–4 semaines'],
    ['Prix annuel (200 élèves)','1 990 MAD/an','6 000–12 000 MAD'],
  ];

  const PLANS = [
    { badge:'Démarrage', name:'Starter', setup:'1 500 MAD', price:'1 990', period:'MAD/an · 200 élèves', featured:false,
      feats:['Inscriptions & paiements','WhatsApp automatique','Bulletins & certificats PDF','Emploi du temps & présences','Support email 48h'] },
    { badge:'⭐ Recommandé', name:'Pro', setup:'2 000 MAD', price:'3 990', period:'MAD/an · 500 élèves', featured:true,
      feats:['Tout Starter +','Portail parents & élèves','Analytics & graphes avancés','CRM Prospects','App Android incluse','Formation 2h + support 24h'] },
    { badge:'Grandes écoles', name:'École+', setup:'3 000 MAD', price:'6 990', period:'MAD/an · Illimité', featured:false,
      feats:['Tout Pro +','Multi-établissements','Examens en ligne','Formation 4h dédiée','Support 24/7 WhatsApp'] },
  ];

  return (
    <>
      <style>{S}</style>
      <div className="lp">
        <a className="wa" href="#" title="WhatsApp">💬</a>

        {/* NAV */}
        <nav className={`lnav${scrolled?' sc':''}`}>
          <div className="lnav-in">
            <a href="/" className="logo">
              <div className="logo-mk">🎓</div>
              <div className="logo-tx">Lux<em>Edu</em></div>
            </a>
            <ul className="lnav-links">
              {[['#features','Fonctionnalités'],['#modules','Modules'],['#tarifs','Tarifs'],['#testi','Témoignages']].map(([h,l]) =>
                <li key={h}><a href={h}>{l}</a></li>
              )}
            </ul>
            <div className="lnav-r">
              <button className="nbtn nbtn-g" onClick={goLogin}>Se connecter</button>
              <button className="nbtn nbtn-p" onClick={goLogin}>
                Démo gratuite
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-in">
            <div className="badge"><span className="badge-chip">NOUVEAU</span>App Android disponible sur Play Store</div>
            <h1 className="h1">Logiciel de Gestion<br/>Scolaire <span className="acc">100% Maroc</span></h1>
            <p className="hero-sub">LuxEdu centralise présences, paiements, notes et communication parents dans une seule plateforme. Conçu pour les écoles privées marocaines.</p>
            <div className="hero-acts">
              <button className="cbtn-p" onClick={goLogin}>
                Essayer gratuitement
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a className="cbtn-s" href="#features">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor"/></svg>
                Voir la démo
              </a>
            </div>
            <div className="trust">
              <strong>✓ Déploiement en 24h</strong><div className="tdot"/>
              <strong>✓ Code Massar MEN</strong><div className="tdot"/>
              <strong>✓ Support FR & Darija</strong><div className="tdot"/>
              <strong>✓ Sans engagement</strong>
            </div>

            {/* Dashboard preview */}
            <div className="scr">
              <div className="scr-bar">
                <div className="dots">
                  <div className="dot" style={{background:'#FF5F57'}}/>
                  <div className="dot" style={{background:'#FEBC2E'}}/>
                  <div className="dot" style={{background:'#28C840'}}/>
                </div>
                <div className="url-bar">app.luxedu.ma/dashboard</div>
              </div>
              <div className="scr-body">
                <div className="scr-sb">
                  <div className="sb-logo">
                    <div className="t">Lux<em>Edu</em></div>
                    <div className="s">Espace Directeur</div>
                  </div>
                  <div className="sb-sec">Principal</div>
                  <div className="sb-item act">📊 Tableau de bord</div>
                  <div className="sb-item">👥 Tous les élèves</div>
                  <div className="sb-item">📋 Notes & résultats</div>
                  <div className="sb-sec">Finances</div>
                  <div className="sb-item">💰 Paiements <span className="sb-bdg">1</span></div>
                  <div className="sb-sec">École</div>
                  <div className="sb-item">🏫 Classes</div>
                  <div className="sb-item">👨‍🏫 Enseignants</div>
                  <div className="sb-item">📱 Portail parents</div>
                </div>
                <div className="scr-main">
                  <div className="sm-hd">
                    <div>
                      <div className="sm-title">Bonjour, Ahmed ! 👋</div>
                      <div className="sm-sub">Dimanche 3 mai 2026 · Tout va bien</div>
                    </div>
                    <button className="sm-btn">+ Inscrire</button>
                  </div>
                  <div className="kpis">
                    {[['👥','248','Élèves','#2563EB'],['✅','94%','Présence','#10B981'],['💰','86%','Recouvrement','#F59E0B'],['⚠️','3','Alertes','#EF4444']].map(([i,v,l,c])=>
                      <div className="kpi" key={l}>
                        <div style={{fontSize:16,marginBottom:4}}>{i}</div>
                        <div className="kpi-v" style={{color:c}}>{v}</div>
                        <div className="kpi-l">{l}</div>
                      </div>
                    )}
                  </div>
                  <div className="charts">
                    <div className="chart-box">
                      <div className="chart-title">📈 Recouvrement 2025-2026</div>
                      <div className="bars">
                        {[['Sep',32,'#E5E7EB'],['Oct',40,'#BFDBFE'],['Nov',48,'#93C5FD'],['Déc',54,'#60A5FA'],['Jan',60,'#3B82F6'],['Fév',63,'#2563EB'],['Mar',67,'#1D4ED8'],['Avr',71,'#1B2C5E'],['Mai',68,'#F59E0B']].map(([m,h,c])=>
                          <div className="bc" key={m}>
                            <div className="br" style={{height:h+'px',background:c}}/>
                            <div className="bl">{m}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="chart-box">
                      <div className="chart-title">🍩 Statut paiements</div>
                      <div className="donut-wrap">
                        <div className="donut"/>
                        <div className="dleg">
                          {[['#10B981','Réglés 55%'],['#2563EB','Partiels 25%'],['#F59E0B','Retard 20%']].map(([c,l])=>
                            <div className="drow" key={l}><div className="ddot" style={{background:c}}/>{l}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLIENTS */}
        <div className="clients">
          <div className="clients-in">
            <div className="cl-lbl">Fait confiance par les meilleures écoles privées du Maroc</div>
            <div className="cl-logos">
              {['École Excellence Arrow','Académie Al Nour','Institut Avenir','École Lumière Rabat','Complexe Atlas','Lycée Horizon'].map(n=>
                <div className="cl-name" key={n}>{n}</div>
              )}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="sec" id="features" style={{background:'#F8FAFF'}}>
          <div className="sec-in">
            <div className="pill">✨ Fonctionnalités</div>
            <div className="h2">Tout ce dont votre école<br/>a besoin dans une seule plateforme</div>
            <p className="sp">LuxEdu remplace les tableurs, les dossiers papier et les SMS coûteux — en un seul système moderne.</p>
            <div className="feat-grid">
              {FEATS.map(([cls,icon,title,desc])=>
                <div className="fc" key={title}>
                  <div className={`fi ${cls}`}>{icon}</div>
                  <div className="ft">{title}</div>
                  <div className="fd">{desc}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* METRICS */}
        <div className="met">
          <div className="met-in">
            {[['+35%','Recouvrement paiements dès le 1er mois'],['3h','Économisées par jour par votre équipe'],['24h','Pour être opérationnel après signature'],['31','Modules actifs inclus']].map(([v,l])=>
              <div className="mitem" key={v}><div className="mv">{v}</div><div className="ml">{l}</div></div>
            )}
          </div>
        </div>

        {/* WHATSAPP SECTION */}
        <div className="wa-sec">
          <div className="wa-phone-wrap">
            <div className="wa-phone">
              <div className="wa-screen">
                <div className="wa-hdr">
                  <div className="wa-av">🎓</div>
                  <div><div className="wa-cn">LuxEdu École</div><div className="wa-cs">En ligne</div></div>
                </div>
                <div className="wa-msgs">
                  <div className="wm"><div className="wm-tag tag-r">🚨 Absence</div>Votre enfant Youssef est absent aujourd'hui. Contactez-nous.<div className="wm-t">08:32</div></div>
                  <div className="wm s">Merci, il a un rendez-vous médical ce matin.<div className="wm-t">08:35 ✓✓</div></div>
                  <div className="wm"><div className="wm-tag tag-b">📊 Bulletin S2</div>Le bulletin de Youssef est disponible. Moyenne: 16.4/20<div className="wm-t">14:10</div></div>
                  <div className="wm"><div className="wm-tag tag-r">💰 Paiement</div>Frais Avril 2026 en attente — 2 800 MAD.<div className="wm-t">09:00</div></div>
                  <div className="wm s">Paiement effectué par virement. Merci !<div className="wm-t">09:45 ✓✓</div></div>
                </div>
              </div>
            </div>
            <div className="wa-badge1">
              <div style={{fontSize:10,color:'#6B7280',marginBottom:4}}>⚡ Alerte envoyée en</div>
              <div style={{fontSize:22,fontFamily:'Syne,sans-serif',fontWeight:800,color:'#1B2C5E'}}>2 min</div>
              <div style={{fontSize:10,color:'#10B981'}}>après le pointage</div>
            </div>
            <div className="wa-badge2">
              <div style={{fontSize:10,color:'rgba(255,255,255,.55)',marginBottom:4}}>📈 Taux réponse parents</div>
              <div style={{fontSize:24,fontFamily:'Syne,sans-serif',fontWeight:800,color:'#F59E0B'}}>95%</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,.45)'}}>vs 12% par email</div>
            </div>
          </div>
          <div>
            <div className="pill">💬 WhatsApp natif</div>
            <div className="h2">Vos parents informés<br/>en temps réel — automatiquement</div>
            <p className="sp">LuxEdu intègre WhatsApp nativement. Zéro configuration, zéro SMS payant. Les parents reçoivent les informations directement sur leur téléphone.</p>
            <div style={{marginTop:32,display:'flex',flexDirection:'column',gap:14}}>
              {[['#ECFDF5','⚡','Alerte absence automatique','Parent notifié en moins de 2 minutes après le pointage. Aucune action requise de votre équipe.'],
                ['#FFFBEB','💰','Rappels paiements','Taux de recouvrement +35% dès le premier mois grâce aux rappels automatiques ciblés.'],
                ['#EFF6FF','📄','Bulletins en 1 clic','Envoyez les bulletins PDF à tous les parents simultanément. École informée en secondes.'],
              ].map(([bg,icon,title,desc])=>
                <div key={title} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                  <div style={{width:42,height:42,background:bg,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{icon}</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:700,color:'#1B2C5E',marginBottom:3}}>{title}</div>
                    <div style={{fontSize:13,color:'#4B5563'}}>{desc}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODULES */}
        <section className="sec" id="modules">
          <div className="sec-in">
            <div style={{textAlign:'center'}}><div className="pill">🔧 31 modules actifs</div>
              <div className="h2" style={{textAlign:'center'}}>Une plateforme complète,<br/>rien de plus</div>
            </div>
            <div className="mod-grid">
              {MODULES.map(([i,n,s])=>
                <div className="mod" key={n}><div className="mod-i">{i}</div><div className="mod-n">{n}</div><div className="mod-s">{s}</div></div>
              )}
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="sec" style={{background:'#F8FAFF'}}>
          <div className="sec-in">
            <div className="pill">🚀 Comment ça marche</div>
            <div className="h2">Opérationnel en 24 heures, garanti.</div>
            <div className="steps">
              {[['1','🎯','Démo gratuite','30 min en ligne. On vous montre LuxEdu avec un exemple concret.'],
                ['2','⚙️','Configuration','Classes, tarifs et données importées. Prêt en quelques heures.'],
                ['3','🎓','Formation incluse','2h pour votre équipe. Manuel complet en français fourni.'],
                ['4','✅','Mise en ligne','Votre école est live. Support dédié 30 jours sans supplément.']
              ].map(([n,icon,t,d])=>
                <div className="step" key={n}>
                  <div className="step-n">{n}</div>
                  <div className="step-i">{icon}</div>
                  <div className="step-t">{t}</div>
                  <div className="step-d">{d}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COMPARE */}
        <section className="sec">
          <div className="sec-in">
            <div className="pill">⚖️ Comparaison</div>
            <div className="h2">Pourquoi choisir LuxEdu ?</div>
            <p className="sp">La seule solution conçue pour le marché marocain.</p>
            <div className="ctbl">
              <div className="ch">
                <div className="chc">Fonctionnalité</div>
                <div className="chc lx">🎓 LuxEdu</div>
                <div className="chc ot">Logiciels génériques</div>
              </div>
              {COMPARE.map(([f,lx,ot])=>
                <div className="crow" key={f}>
                  <div className="cc">{f}</div>
                  <div className="cc ctr lxc"><span className={lx==='✓'?'cyes':''}style={lx!=='✓'?{fontWeight:700,color:'#10B981',fontSize:13}:{}}>{lx}</span></div>
                  <div className="cc ctr"><span className={ot==='✗'?'cno':'cpart'}>{ot}</span></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="sec" id="testi" style={{background:'#F8FAFF'}}>
          <div className="sec-in">
            <div style={{textAlign:'center'}}><div className="pill">💬 Témoignages</div>
              <div className="h2" style={{textAlign:'center'}}>Ils ont transformé leur école<br/>avec LuxEdu</div>
            </div>
            <div className="tg">
              {[['AB','#1B2C5E','Ahmed B.','Directeur — École Excellence, Casablanca',"En 2 semaines, notre recouvrement est passé de 55% à 89%. Les parents paient sans rappel. Incroyable."],
                ['FR','#2563EB','Fatima R.','Responsable adm. — Académie Al Nour, Rabat',"Notes, présences et bulletins sur WhatsApp. L'image de notre école a complètement changé."],
                ['KM','#F59E0B','Karim M.','Directeur fondateur — École Avenir, Marrakech',"Formation en 2h, déploiement en 1 journée. Support réactif en français. Exactement ce qu'on cherchait."],
              ].map(([ini,bg,name,role,text])=>
                <div className="tc" key={name}>
                  <div className="tst">★★★★★</div>
                  <div className="ttx">"{text}"</div>
                  <div className="tau">
                    <div className="tav" style={{background:bg,color:bg==='#F59E0B'?'#1B2C5E':'white'}}>{ini}</div>
                    <div><div className="tavn">{name}</div><div className="tavr">{role}</div></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="sec" id="tarifs">
          <div className="sec-in">
            <div style={{textAlign:'center'}}><div className="pill">💎 Tarification</div>
              <div className="h2" style={{textAlign:'center'}}>Simple, transparent, sans surprise</div>
              <p className="sp" style={{textAlign:'center',margin:'14px auto 0'}}>Facturé annuellement. Setup unique. -10% fidélité dès l'an 2.</p>
            </div>
            <div className="pg">
              {PLANS.map(p=>
                <div className={`pc${p.featured?' pf':''}`} key={p.name}>
                  <div className="pb">{p.badge}</div>
                  <div className="pn">{p.name}</div>
                  <div className="pset">+ {p.setup} setup (une fois)</div>
                  <div className="ppr">{p.price}</div>
                  <div className="pper">{p.period}</div>
                  <div className="pdiv"/>
                  {p.feats.map(f=><div className="pfeat" key={f}><div className="pchk">✓</div><div>{f}</div></div>)}
                  <button className="pcta" onClick={goLogin}>Commencer →</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className="ctab">
          <div>
            <div className="ctab-t">Votre école mérite<br/><em>mieux qu'un tableur.</em></div>
            <div className="ctab-s">Rejoignez les écoles qui pilotent avec intelligence. Démo gratuite, sans engagement, en 30 minutes.</div>
          </div>
          <div className="ctab-btns">
            <button className="ctab-m" onClick={goLogin}>Demander ma démo gratuite</button>
            <a className="ctab-sc" href="#">💬 WhatsApp direct</a>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="lfoot">
          <div className="lfoot-in">
            <div className="lfoot-top">
              <div>
                <div className="lfoot-brand">🎓 Lux<em>Edu</em></div>
                <div className="lfoot-desc">La solution ERP scolaire conçue pour les écoles privées du Maroc. Moderne, locale, abordable.</div>
              </div>
              {[['Produit',['Fonctionnalités','Modules','Tarification','Portail parents','App Android']],
                ['Ressources',['Documentation','Guide démarrage','Tutoriels vidéo','FAQ']],
                ['Contact',['WhatsApp','Email','Démonstration','Support']]
              ].map(([t,links])=>
                <div key={t}>
                  <div className="lfoot-ct">{t}</div>
                  <ul className="lfoot-links">{links.map(l=><li key={l}><a href="#">{l}</a></li>)}</ul>
                </div>
              )}
            </div>
            <div className="lfoot-bot">
              <div>© 2026 LuxEdu — Tous droits réservés</div>
              <div style={{display:'flex',gap:20}}>
                <a href="#" style={{color:'rgba(255,255,255,.25)',textDecoration:'none'}}>Mentions légales</a>
                <a href="#" style={{color:'rgba(255,255,255,.25)',textDecoration:'none'}}>Confidentialité</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
