import { useState, useEffect } from "react";
import { useAuth } from "../features/useAuth";
const logo = "../shared/assets/logo.png";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0e1a; font-family: 'DM Sans', sans-serif; }

  /* ── Intro animations ── */
  @keyframes logoDrop {
    0%   { opacity: 0; transform: scale(0.5) translateY(-30px); filter: blur(16px); }
    50%  { opacity: 1; transform: scale(1.1) translateY(0);     filter: blur(0); }
    70%  { transform: scale(0.96); }
    85%  { transform: scale(1.03); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes titleFade {
    0%   { opacity: 0; transform: translateY(12px); letter-spacing: 0.6em; }
    100% { opacity: 1; transform: translateY(0);    letter-spacing: 0.25em; }
  }
  @keyframes ring {
    0%   { transform: scale(0.5); opacity: 0.5; }
    100% { transform: scale(3.2); opacity: 0; }
  }
  @keyframes introOut {
    0%   { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.04); pointer-events: none; }
  }
  @keyframes panelIn {
    0%   { opacity: 0; transform: translateY(32px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes logoSmallIn {
    0%   { opacity: 0; transform: scale(0.7) rotate(-4deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-7px); }
    40%,80% { transform: translateX(7px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes goldGlow {
    0%,100% { box-shadow: 0 0 30px rgba(192,150,60,0.15); }
    50%      { box-shadow: 0 0 60px rgba(192,150,60,0.35); }
  }

  .intro-logo  { animation: logoDrop 1.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .intro-title { animation: titleFade 0.9s ease-out 1s both; }
  .intro-sub   { animation: titleFade 0.7s ease-out 1.3s both; }
  .ring-1      { animation: ring 2s ease-out 0.3s both; }
  .ring-2      { animation: ring 2s ease-out 0.6s both; }
  .ring-3      { animation: ring 2s ease-out 0.9s both; }
  .intro-out   { animation: introOut 0.6s ease-in forwards; }
  .panel-in    { animation: panelIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
  .logo-small  { animation: logoSmallIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .shake       { animation: shake 0.4s ease; }
  .spinning    { animation: spin 1s linear infinite; }
  .gold-glow   { animation: goldGlow 3s ease-in-out infinite; }

  /* ── Fields ── */
  .field {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    outline: none;
    width: 100%;
    padding: 13px 16px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: border-color 0.2s, background 0.2s;
  }
  .field:focus {
    border-color: rgba(192,150,60,0.5);
    background: rgba(255,255,255,0.06);
  }
  .field::placeholder { color: rgba(255,255,255,0.2); }

  /* ── Buttons ── */
  .btn-primary {
    background: linear-gradient(135deg, #c0963c, #e8c96a, #c0963c);
    background-size: 200% 200%;
    color: #1a1200;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.06em;
    border: none;
    cursor: pointer;
    width: 100%;
    padding: 14px;
    border-radius: 10px;
    transition: transform 0.15s, opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.92; }
  .btn-primary:active:not(:disabled){ transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .error-box {
    background: rgba(220,50,50,0.1);
    border: 1px solid rgba(220,50,50,0.3);
    color: #fca5a5;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
  }
`;

// ── Intro Screen ──────────────────────────────────────────────────────────────
function IntroScreen({ leaving }) {
  return (
    <div
      className={leaving ? "intro-out" : ""}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "radial-gradient(ellipse at 50% 40%, #0d1530 0%, #04080f 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 28,
      }}
    >
      {/* Radial rings */}
      {["ring-1","ring-2","ring-3"].map((cls) => (
        <div key={cls} className={cls} style={{
          position: "absolute",
          width: 220, height: 220,
          borderRadius: "50%",
          border: "1px solid rgba(192,150,60,0.25)",
          top: "50%", left: "50%",
          marginLeft: -110, marginTop: -140,
          pointerEvents: "none",
        }} />
      ))}

      {/* Logo */}
      <div className="intro-logo gold-glow" style={{
        width: 200, height: 200,
        borderRadius: "50%",
        padding: 8,
        background: "radial-gradient(circle, rgba(192,150,60,0.12) 0%, transparent 70%)",
      }}>
        <img
          src={logo}
          alt="Colegio Bernardo O'Higgins"
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(192,150,60,0.4))" }}
        />
      </div>

      {/* Title */}
      <div style={{ textAlign: "center" }}>
        <p className="intro-title" style={{
          fontFamily: "'Playfair Display', serif",
          color: "#e8c96a",
          fontSize: 13,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}>
          Colegio Bernardo O'Higgins
        </p>
        <p className="intro-sub" style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}>
          Chile
        </p>
      </div>
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [shaking, setShaking]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // redirigir aquí, ej: navigate("/dashboard")
    } catch {
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 30% 20%, #0d1530 0%, #04080f 100%)",
      display: "flex",
    }}>

      {/* Panel izquierdo — decorativo */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid sutil */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(192,150,60,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(192,150,60,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Logo grande fantasma */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <img
            src={logo}
            alt=""
            style={{
              width: 320, height: 320,
              objectFit: "contain",
              opacity: 0.06,
              filter: "sepia(1) saturate(0.5)",
            }}
          />
        </div>

        {/* Viñeta */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, #04080f 100%)",
        }} />

        {/* Línea separadora */}
        <div style={{
          position: "absolute", right: 0, top: "10%", bottom: "10%",
          width: 1,
          background: "linear-gradient(to bottom, transparent, rgba(192,150,60,0.2), transparent)",
        }} />
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        width: "100%", maxWidth: 460,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 32px",
      }}>
        <div className="panel-in" style={{ width: "100%", maxWidth: 340 }}>

          {/* Logo pequeño */}
          <div className="logo-small" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: 64, height: 64, objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(192,150,60,0.3))" }}
            />
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#e8c96a", fontSize: 13, letterSpacing: "0.05em" }}>
                Colegio Bernardo
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#e8c96a", fontSize: 13, letterSpacing: "0.05em" }}>
                O'Higgins
              </p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
                Chile
              </p>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 300, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
              Iniciar sesión
            </h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Error */}
          {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={shaking ? "shake" : ""}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label style={{
                display: "block", color: "rgba(192,150,60,0.7)",
                fontSize: 11, letterSpacing: "0.12em",
                textTransform: "uppercase", marginBottom: 8,
              }}>
                Correo electrónico
              </label>
              <input
                type="email"
                className="field"
                placeholder="correo@colegio.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{
                display: "block", color: "rgba(192,150,60,0.7)",
                fontSize: 11, letterSpacing: "0.12em",
                textTransform: "uppercase", marginBottom: 8,
              }}>
                Contraseña
              </label>
              <input
                type="password"
                className="field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ textAlign: "right" }}>
              <button type="button" style={{
                background: "none", border: "none",
                color: "rgba(192,150,60,0.45)", fontSize: 12,
                cursor: "pointer", padding: 0,
                transition: "color 0.2s",
              }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? (
                <>
                  <svg className="spinning" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
                  </svg>
                  Ingresando…
                </>
              ) : "Ingresar"}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.15)", fontSize: 11, marginTop: 32, letterSpacing: "0.05em" }}>
            © Colegio Bernardo O'Higgins · Chile
          </p>

        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Login() {
  const [phase, setPhase] = useState("intro");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("leaving"), 2800);
    const t2 = setTimeout(() => setPhase("login"),   3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      <style>{styles}</style>
      {phase !== "login" && <IntroScreen leaving={phase === "leaving"} />}
      {phase === "login" && <LoginPage />}
    </>
  );
}