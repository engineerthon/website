import { useState, useCallback } from "react";
import MatrixRain from "./components/MatrixRain";
import CenteredHero from "./components/CenteredHero";
import TerminalReveal from "./components/TerminalReveal";
import { useAudio } from "./hooks/useAudio";

const FONT = "'Space Mono', monospace";

function hasSeenAnimation(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith("engineerthon_seen="));
}

export default function App() {
  const [heroKey, setHeroKey] = useState(0);
  const [scene, setScene] = useState<"hero" | "exiting" | "terminal">(
    hasSeenAnimation() ? "terminal" : "hero"
  );

  const { play: playAudio, toggleMute, muted, playing: audioPlaying } = useAudio();

  const handleEnter = useCallback(() => {
    playAudio();
    setScene("exiting");
    setTimeout(() => setScene("terminal"), 1000);
  }, [playAudio]);

  const handleBack = useCallback(() => {
    setScene("hero");
    setHeroKey((k) => k + 1);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Matrix Rain Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <MatrixRain
          characterSet="bamum"
          colorMode="cycling"
          fontSize={16}
          speed={20}
          fadeSpeed={0.05}
        />
      </div>

      {/* Hero Overlay */}
      {scene !== "terminal" && (
        <div key={heroKey} style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          <CenteredHero
            fontFamily={FONT}
            animate={true}
            textBrightness={0.85}
            backdrop="vignette"
            onEnter={handleEnter}
            exiting={scene === "exiting"}
          />
        </div>
      )}

      {/* Terminal Reveal */}
      {scene === "terminal" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            animation: "fadeIn 0.6s ease forwards",
          }}
        >
          <TerminalReveal fontFamily={FONT} onBack={handleBack} />
        </div>
      )}

      {/* Audio mute toggle */}
      {audioPlaying && (
        <button
          className="mute-toggle"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10,
            padding: "12px 18px",
            minHeight: 48,
            minWidth: 48,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            letterSpacing: "0.05em",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          }}
        >
          <span style={{ fontSize: 20 }}>{muted ? "🔇" : "🔊"}</span>
          <span>{muted ? "UNMUTE" : "MUTE"}</span>
        </button>
      )}
    </div>
  );
}
