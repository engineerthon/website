import { useState, useEffect, useRef } from "react";

interface TerminalHeroProps {
  fontFamily: string;
  onComplete?: () => void;
}

const LINES = [
  { text: "> INITIALIZING ENGINEERTHON_", delay: 0, typeSpeed: 40 },
  { text: "> DATE: SATURDAY 7 MARCH 2026", delay: 800, typeSpeed: 30 },
  { text: "> LOCATION: LONDON", delay: 600, typeSpeed: 30 },
  { text: "> COMPETITORS: 12", delay: 500, typeSpeed: 30 },
  { text: "> ROUNDS: 3", delay: 400, typeSpeed: 30 },
  { text: "> WINNER: 1", delay: 400, typeSpeed: 30 },
  { text: "", delay: 300, typeSpeed: 0 },
  { text: "> STATUS: LOADING...", delay: 500, typeSpeed: 35 },
];

export default function TerminalHero({ fontFamily }: TerminalHeroProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Typing effect
  useEffect(() => {
    if (currentLineIndex >= LINES.length) return;

    const line = LINES[currentLineIndex];

    if (!isTyping) {
      const timeout = setTimeout(() => {
        setIsTyping(true);
        setCurrentCharIndex(0);
        setVisibleLines((prev) => [...prev, ""]);
      }, line.delay);
      return () => clearTimeout(timeout);
    }

    if (line.text === "") {
      setIsTyping(false);
      setCurrentLineIndex((i) => i + 1);
      return;
    }

    if (currentCharIndex < line.text.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = line.text.slice(0, currentCharIndex + 1);
          return next;
        });
        setCurrentCharIndex((i) => i + 1);
      }, line.typeSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      setCurrentLineIndex((i) => i + 1);
    }
  }, [currentLineIndex, currentCharIndex, isTyping]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 8,
          padding: "32px 40px",
          maxWidth: 600,
          width: "90%",
          fontFamily,
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        </div>
        {visibleLines.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.startsWith("> STATUS")
                ? "#ffaa00"
                : line.startsWith("> INITIALIZING")
                ? "#fff"
                : "rgba(255,255,255,0.7)",
              fontSize: line.startsWith("> INITIALIZING") ? 18 : 14,
              fontWeight: line.startsWith("> INITIALIZING") ? 700 : 400,
              lineHeight: 1.8,
              letterSpacing: "0.05em",
            }}
          >
            {line}
            {i === visibleLines.length - 1 && showCursor && (
              <span style={{ color: "#fff", fontWeight: 700 }}>▋</span>
            )}
          </div>
        ))}
        {visibleLines.length === 0 && showCursor && (
          <div style={{ color: "#fff", fontSize: 14, lineHeight: 1.8 }}>
            <span style={{ fontWeight: 700 }}>▋</span>
          </div>
        )}
      </div>
    </div>
  );
}
