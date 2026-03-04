import { useState, useEffect, useCallback } from "react";

interface TerminalRevealProps {
  fontFamily: string;
  onBack?: () => void;
}

interface TerminalLine {
  text: string;
  color?: string;
  bold?: boolean;
  delay: number; // ms before this line starts typing
  typeSpeed: number; // ms per character
  isLink?: { url: string; label: string };
  isBlank?: boolean;
  isHeader?: boolean;
  isDim?: boolean;
  // mutt-specific
  isMuttBar?: boolean;      // status bar — inverted look
  isMuttSelected?: boolean; // highlighted selected row
  isMuttHint?: boolean;     // key hints row
  isMuttSep?: boolean;      // ─── separator
  isKeystroke?: boolean;    // simulated keypress e.g. <RET>
  isEmailHeader?: boolean;  // email header fields (From/Subject/etc)
}

const SEP = "─".repeat(72);

const LINES: TerminalLine[] = [
  // ── Phase 1: shell command ─────────────────────────────────────────────────
  { text: "$ mutt -f /var/spool/mail/keanu", color: "#888", delay: 300, typeSpeed: 30 },

  // ── Phase 2: mutt index UI ─────────────────────────────────────────────────
  { text: "", isBlank: true, delay: 80, typeSpeed: 0 },
  {
    text: "  Mutt 2.2.9 (2022-11-12)  /var/spool/mail/keanu              [Msgs:1 New:1]",
    isMuttBar: true, delay: 60, typeSpeed: 0,
  },
  {
    text: "  q:Quit  d:Del  u:Undel  s:Save  m:Mail  r:Reply  f:Fwd  ?:Help",
    isMuttHint: true, delay: 40, typeSpeed: 0,
  },
  { text: SEP, isMuttSep: true, delay: 30, typeSpeed: 0 },
  {
    text: "  1 N   02 Mar  Alvaro Joaquin      (3.2K)  ENGINEERTHON · Sat 7 March · London",
    isMuttSelected: true, delay: 40, typeSpeed: 0,
  },
  { text: SEP, isMuttSep: true, delay: 30, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 20, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 20, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 20, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 20, typeSpeed: 0 },
  {
    text: "  -- Mutt: /var/spool/mail/keanu [Msgs:1 New:1 Flag:0 Del:0]----",
    isMuttBar: true, delay: 20, typeSpeed: 0,
  },

  // ── Phase 3: keypress ──────────────────────────────────────────────────────
  { text: "", isBlank: true, delay: 700, typeSpeed: 0 },
  { text: "<RET>", isKeystroke: true, delay: 0, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 80, typeSpeed: 0 },

  // ── Phase 4: mutt pager — email view ──────────────────────────────────────
  {
    text: "  i:Exit  -:PrevMsg  <Space>:NextPage  d:Del  r:Reply  f:Fwd  ?:Help",
    isMuttBar: true, delay: 60, typeSpeed: 0,
  },
  { text: "", isBlank: true, delay: 60, typeSpeed: 0 },
  { text: "Date:    Mon, 02 Mar 2026 09:14:22 +0000", isEmailHeader: true, delay: 40, typeSpeed: 0 },
  { text: "From:    Alvaro Joaquin <organisers@hackathon.engineer>", isEmailHeader: true, delay: 40, typeSpeed: 0 },
  { text: "To:      engineers@hackathon.engineer", isEmailHeader: true, delay: 40, typeSpeed: 0 },
  { text: "Subject: ENGINEERTHON · Sat 7 March · London", isEmailHeader: true, bold: true, delay: 40, typeSpeed: 0 },
  { text: SEP, isMuttSep: true, delay: 80, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 120, typeSpeed: 0 },

  // ── Email body ─────────────────────────────────────────────────────────────
  {
    text: "Bringing back the curated social for the 6th time. Same as always — the evening'll be a chill one. No sponsors, no speeches, no panels.",
    delay: 100,
    typeSpeed: 12,
  },
  { text: "", isBlank: true, delay: 300, typeSpeed: 0 },
  {
    text: "This time we're trying something a bit crazy.",
    delay: 100,
    typeSpeed: 18,
    bold: true,
  },
  { text: "", isBlank: true, delay: 400, typeSpeed: 0 },
  {
    text: "Earlier in the afternoon, 12 of the best young engineers — dozens of wins collected all over the world — will compete in a hackathon tournament, observed by YC founders + tech veteran advisors, judged by experienced hackathonmaxxers.",
    delay: 100,
    typeSpeed: 10,
  },
  { text: "", isBlank: true, delay: 200, typeSpeed: 0 },
  {
    text: "Two stages. Not just code.",
    delay: 100,
    typeSpeed: 14,
    bold: true,
  },
  { text: "", isBlank: true, delay: 300, typeSpeed: 0 },
  { text: SEP, isMuttSep: true, delay: 50, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 100, typeSpeed: 0 },
  { text: "▸ STAGE 1 — MVP BUILDING (4 hours)", isHeader: true, delay: 150, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 80, typeSpeed: 0 },
  { text: "  Track A: Timing", bold: true, delay: 80, typeSpeed: 0 },
  {
    text: "  Open the news, find the most urgent real-world pain point, and deploy a working solution with no brief and no hand-holding.",
    delay: 100,
    typeSpeed: 8,
    isDim: true,
  },
  { text: "", isBlank: true, delay: 150, typeSpeed: 0 },
  { text: "  Track B: Complexity", bold: true, delay: 80, typeSpeed: 0 },
  {
    text: "  We've profiled you, chosen something technically brutal and completely outside your domain, and your only job is to build and deploy it anyway.",
    delay: 100,
    typeSpeed: 8,
    isDim: true,
  },
  { text: "", isBlank: true, delay: 150, typeSpeed: 0 },
  {
    text: "  Both tracks end with a live demo and a pitch to a room of VCs. Judged by us. Advised by VCs.",
    delay: 100,
    typeSpeed: 10,
    color: "rgba(255,255,255,0.6)",
  },
  { text: "", isBlank: true, delay: 200, typeSpeed: 0 },
  { text: SEP, isMuttSep: true, delay: 50, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 100, typeSpeed: 0 },
  { text: "▸ STAGE 2 — THE TECHNICAL GAUNTLET (2 hours)", isHeader: true, delay: 150, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 80, typeSpeed: 0 },
  {
    text: "  The strongest builders from each track enter a final, completely bias-free technical challenge — no judges, no politics, just the problem — and the best engineer wins.",
    delay: 100,
    typeSpeed: 8,
    isDim: true,
  },
  { text: "", isBlank: true, delay: 300, typeSpeed: 0 },
  { text: SEP, isMuttSep: true, delay: 50, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 100, typeSpeed: 0 },
  { text: "THE EVENING", isHeader: true, delay: 150, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 50, typeSpeed: 0 },
  {
    text: "7pm — Doors open. The Technical Gauntlet is underway. Grab food, crowd around the finalists, and place your bets on who'll secure the dub.",
    delay: 100,
    typeSpeed: 10,
  },
  { text: "", isBlank: true, delay: 200, typeSpeed: 0 },
  {
    text: "8pm — Winner crowned 👑 (coronation ceremony included), then it turns into the usual chill house party vibe.",
    delay: 100,
    typeSpeed: 10,
  },
  { text: "", isBlank: true, delay: 200, typeSpeed: 0 },
  {
    text: "Feel free to just come for the social — but the final is definitely worth seeing.",
    delay: 100,
    typeSpeed: 12,
    color: "rgba(255,255,255,0.55)",
  },
  { text: "", isBlank: true, delay: 300, typeSpeed: 0 },
  { text: SEP, isMuttSep: true, delay: 50, typeSpeed: 0 },
  { text: "", isBlank: true, delay: 150, typeSpeed: 0 },
  {
    text: "Hosted by John Sergeant, Elyab Berhanu & Alvaro Joaquin 🦦",
    delay: 100,
    typeSpeed: 14,
    isDim: true,
  },
  {
    text: "Curated by Keanu Czirjak, Natalie Chan, Aruzhan N 🚀",
    delay: 100,
    typeSpeed: 14,
    isDim: true,
  },
  { text: "", isBlank: true, delay: 100, typeSpeed: 0 },
  {
    text: "-- Alvaro Joaquin <organisers@hackathon.engineer>",
    delay: 80,
    typeSpeed: 0,
    color: "rgba(255,255,255,0.3)",
  },
  { text: "", isBlank: true, delay: 300, typeSpeed: 0 },
  {
    text: "→ RSVP",
    delay: 200,
    typeSpeed: 0,
    isLink: { url: "https://lu.ma/k18pspw5?tk=RQ34XT", label: "→ RSVP ON LUMA" },
    bold: true,
  },
];

export default function TerminalReveal({ fontFamily, onBack }: TerminalRevealProps) {
  const [visibleLines, setVisibleLines] = useState<{ text: string; config: TerminalLine }[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isTypingLine, setIsTypingLine] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [allDone, setAllDone] = useState(false);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    const el = document.getElementById("terminal-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Typing engine
  useEffect(() => {
    if (currentLineIdx >= LINES.length) {
      setAllDone(true);
      return;
    }

    const line = LINES[currentLineIdx];

    if (!isTypingLine) {
      const timeout = setTimeout(() => {
        setIsTypingLine(true);
        setCurrentCharIdx(0);
        setVisibleLines((prev) => [...prev, { text: "", config: line }]);
        scrollToBottom();
      }, line.delay);
      return () => clearTimeout(timeout);
    }

    // Instant lines
    if (line.typeSpeed === 0 || line.isBlank || line.isLink || line.isMuttBar ||
        line.isMuttSelected || line.isMuttHint || line.isMuttSep ||
        line.isKeystroke || line.isEmailHeader) {
      setVisibleLines((prev) => {
        const next = [...prev];
        next[next.length - 1] = { text: line.text, config: line };
        return next;
      });
      setIsTypingLine(false);
      setCurrentLineIdx((i) => i + 1);
      scrollToBottom();
      return;
    }

    // Character-by-character typing
    if (currentCharIdx < line.text.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            text: line.text.slice(0, currentCharIdx + 1),
            config: line,
          };
          return next;
        });
        setCurrentCharIdx((i) => i + 1);
        scrollToBottom();
      }, line.typeSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsTypingLine(false);
      setCurrentLineIdx((i) => i + 1);
    }
  }, [currentLineIdx, currentCharIdx, isTypingLine, scrollToBottom]);

  const getLineStyle = (config: TerminalLine): React.CSSProperties => {
    const base: React.CSSProperties = {
      margin: 0,
      padding: 0,
      lineHeight: 1.7,
      fontSize: 14,
      color: "#fff",
      fontWeight: 400,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    };

    if (config.isBlank) return { ...base, height: 8 };

    if (config.isMuttBar) return {
      ...base,
      background: "rgba(255,255,255,0.14)",
      color: "rgba(255,255,255,0.9)",
      fontSize: 12,
      letterSpacing: "0.01em",
      margin: "0 -24px",
      padding: "3px 24px",
      fontWeight: 500,
    };

    if (config.isMuttSelected) return {
      ...base,
      background: "rgba(0,200,120,0.18)",
      color: "#fff",
      fontSize: 13,
      margin: "0 -24px",
      padding: "3px 24px",
      borderLeft: "2px solid rgba(0,220,130,0.7)",
    };

    if (config.isMuttHint) return {
      ...base,
      color: "rgba(255,255,255,0.38)",
      fontSize: 12,
      letterSpacing: "0.02em",
    };

    if (config.isMuttSep) return {
      ...base,
      color: "rgba(255,255,255,0.12)",
      fontSize: 12,
      letterSpacing: 0,
      overflow: "hidden",
    };

    if (config.isKeystroke) return {
      ...base,
      color: "rgba(255,255,255,0.35)",
      fontSize: 12,
      letterSpacing: "0.08em",
      fontStyle: "italic",
    };

    if (config.isEmailHeader) return {
      ...base,
      color: "rgba(255,255,255,0.55)",
      fontSize: 13,
      fontWeight: config.bold ? 600 : 400,
    };

    if (config.isHeader) return { ...base, fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" };
    if (config.isDim) return { ...base, color: "rgba(255,255,255,0.5)" };
    if (config.color) return { ...base, color: config.color };
    if (config.bold) return { ...base, fontWeight: 600 };

    return base;
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 10,
          width: "min(90vw, 720px)",
          maxHeight: "min(85vh, 700px)",
          display: "flex",
          flexDirection: "column",
          fontFamily,
          backdropFilter: "blur(8px)",
          overflow: "hidden",
          boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ff5f57",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={onBack}
            title="Back to hero"
          />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.05em",
            }}
          >
            mutt — /var/spool/mail/keanu
          </span>
        </div>

        {/* Content */}
        <div
          id="terminal-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px 24px",
          }}
        >
          {visibleLines.map((line, i) => {
            const isLastLine = i === visibleLines.length - 1;
            const style = getLineStyle(line.config);

            if (line.config.isLink) {
              return (
                <div key={i} style={{ ...style, marginTop: 4 }}>
                  <a
                    href={line.config.isLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#fff",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      padding: "14px 32px",
                      minHeight: 48,
                      borderRadius: 4,
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: 14,
                      letterSpacing: "0.15em",
                      display: "inline-block",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                    }}
                  >
                    {line.config.isLink.label}
                  </a>
                </div>
              );
            }

            // Mutt selected row — colour the "N" (new) indicator green
            if (line.config.isMuttSelected) {
              const text = line.text;
              const nIdx = text.indexOf(" N ");
              return (
                <div key={i} style={style}>
                  {nIdx >= 0 ? (
                    <>
                      {text.slice(0, nIdx + 1)}
                      <span style={{ color: "#4ade80", fontWeight: 700 }}>N</span>
                      {text.slice(nIdx + 2)}
                    </>
                  ) : text}
                </div>
              );
            }

            return (
              <div key={i} style={style}>
                {line.text}
                {isLastLine && !allDone && showCursor && (
                  <span style={{ color: "#fff", fontWeight: 700 }}>▋</span>
                )}
              </div>
            );
          })}

          {allDone && (
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
              <span>{showCursor ? "$ ▋" : "$ "}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
