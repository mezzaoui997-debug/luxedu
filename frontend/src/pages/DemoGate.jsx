import { useState, useEffect } from "react";
import DemoApp from "./DemoApp";

const navy = "#0F1D42", gold = "#C9963F", white = "#FFFFFF";

// Change this code to give to customers
const DEMO_CODES = ["LUXEDU2026", "DEMO2026", "ECOLE2026"];

export default function DemoGate() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("luxedu_demo_access");
    if (saved && DEMO_CODES.includes(saved)) setUnlocked(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const upper = code.trim().toUpperCase();
    if (DEMO_CODES.includes(upper)) {
      localStorage.setItem("luxedu_demo_access", upper);
      setUnlocked(true);
    } else {
      setError("Code incorrect. Contactez-nous sur WhatsApp pour recevoir votre code d\'acces.");
      setCode("");
    }
  };

  if (unlocked) return <DemoApp />;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(140deg, #0a1628 0%, ${navy} 50%, #162554 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,.03) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
      <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 440, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 72, width: "auto", marginBottom: 20, opacity: .9 }} />
          <h1 style={{ fontSize: 26, fontWeight: 800, color: white, margin: "0 0 10px", letterSpacing: "-0.5px" }}>Demonstration LuxEdu</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.6, margin: 0 }}>Entrez votre code d'acces pour explorer la plateforme.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>Code d'acces</label>
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }}
              placeholder="Entrez votre code"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: error ? "1px solid #EF4444" : "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.07)", color: white, fontSize: 18, fontFamily: "inherit", outline: "none", letterSpacing: "3px", textAlign: "center", fontWeight: 700, boxSizing: "border-box" }}
              autoFocus
            />
            {error && <p style={{ fontSize: 13, color: "#EF4444", marginTop: 8, lineHeight: 1.5 }}>{error}</p>}
          </div>
          <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 10, background: gold, color: white, fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none", fontFamily: "inherit", transition: "all .2s" }}>
            Acceder a la demonstration
          </button>
        </form>

        <div style={{ marginTop: 28, padding: "16px 20px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", margin: 0, lineHeight: 1.6, textAlign: "center" }}>
            Pas encore de code ? Contactez-nous pour recevoir votre acces demonstration.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
            <a href="https://wa.me/212666490261?text=Bonjour%20LuxEdu%2C%20je%20voudrais%20un%20code%20demo" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 8, background: "#25D366", color: white, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Demander un code
            </a>
            <a href="/landing#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 8, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.7)", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,.12)" }}>
              Formulaire de contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
