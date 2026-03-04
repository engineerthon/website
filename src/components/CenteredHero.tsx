import { useState, useEffect, useRef } from "react";

export type BackdropMode = "none" | "vignette" | "pill" | "band";

interface CenteredHeroProps {
  fontFamily: string;
  animate?: boolean;
  textBrightness?: number;
  backdrop?: BackdropMode;
  onEnter?: () => void;
  exiting?: boolean;
}

export default function CenteredHero({ fontFamily, animate = true, textBrightness = 0.5, backdrop = "vignette", onEnter, exiting = false }: CenteredHeroProps) {
  const [phase, setPhase] = useState(animate ? 0 : 4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) {
      setPhase(4);
      return;
    }
    // Phase 0: blank (500ms)
    // Phase 1: title zooms in (0ms delay after phase 0)
    // Phase 2: subtitle fades (800ms after title)
    // Phase 3: details fade (600ms after subtitle)
    // Phase 4: CTA fades (500ms after details)
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 450),
      setTimeout(() => setPhase(3), 750),
      setTimeout(() => setPhase(4), 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [animate]);

  const fadeIn = (minPhase: number, extraDelay = 0) => ({
    opacity: phase >= minPhase ? 1 : 0,
    transform: phase >= minPhase ? "translateY(0)" : "translateY(20px)",
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${extraDelay}ms`,
  });

  const titleStyle = {
    opacity: phase >= 1 ? 1 : 0,
    transform: phase >= 1 ? "scale(1)" : "scale(1.5)",
    transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const backdropStyles: Record<BackdropMode, React.CSSProperties> = {
    none: {},
    vignette: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, transparent 92%)",
      pointerEvents: "none",
    },
    pill: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "min(90vw, 800px)",
      height: "380px",
      background: "rgba(0,0,0,0.7)",
      borderRadius: "50%",
      filter: "blur(40px)",
      pointerEvents: "none",
    },
    band: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      height: "420px",
      background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.8) 80%, transparent)",
      pointerEvents: "none",
    },
  };

  const exitStyle: React.CSSProperties = exiting
    ? {
        transform: "scale(2.5)",
        opacity: 0,
        filter: "blur(8px)",
        transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
      }
    : {};

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        fontFamily,
        textAlign: "center",
        padding: "0 24px",
        ...exitStyle,
      }}
    >
      {/* Backdrop layer */}
      {backdrop !== "none" && (
        <div style={backdropStyles[backdrop]} />
      )}

      <h1
        style={{
          ...titleStyle,
          fontSize: "clamp(40px, 8vw, 96px)",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.15em",
          margin: 0,
          lineHeight: 1.1,
          textShadow: "0 0 60px rgba(255,255,255,0.3)",
        }}
      >
        ENGINEERTHON
      </h1>

      <p
        style={{
          ...fadeIn(2),
          fontSize: "clamp(17px, 2.5vw, 22px)",
          color: `rgba(255,255,255,${textBrightness})`,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          margin: "16px 0 0",
          textShadow: textBrightness < 0.7 ? "none" : `0 0 20px rgba(255,255,255,${textBrightness * 0.3})`,
        }}
      >
        12 Engineers &middot; 3 Rounds &middot; 1 Winner
      </p>

      <div
        style={{
          ...fadeIn(3),
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px 24px",
          marginTop: 28,
          fontSize: "clamp(15px, 1.8vw, 18px)",
          color: `rgba(255,255,255,${Math.min(textBrightness + 0.1, 1)})`,
          letterSpacing: "0.1em",
          textShadow: textBrightness < 0.7 ? "none" : `0 0 20px rgba(255,255,255,${textBrightness * 0.3})`,
        }}
      >
        <span>SAT 7 MARCH 2026</span>
        <span style={{ color: `rgba(255,255,255,${textBrightness * 0.4})` }}>|</span>
        <span>LONDON</span>
      </div>

      <button
        style={{
          ...fadeIn(4),
          marginTop: "clamp(28px, 4vw, 48px)" as unknown as number,
          padding: "16px 48px",
          minHeight: 48,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          fontFamily,
          fontSize: "clamp(13px, 1.2vw, 14px)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
        }}
        onClick={onEnter}
      >
        Enter
      </button>
    </div>
  );
}
