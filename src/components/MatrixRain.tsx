import { useEffect, useRef } from "react";

export type CharacterSet = "bamum" | "ascii" | "binary" | "korean" | "matrix";
export type ColorMode = "white" | "cycling" | "accent-blue" | "accent-red" | "accent-amber" | "inverted";

interface MatrixRainProps {
  characterSet?: CharacterSet;
  colorMode?: ColorMode;
  speed?: number;
  fontSize?: number;
  fadeSpeed?: number;
  className?: string;
}

const CHARACTER_SETS: Record<CharacterSet, string> = {
  bamum: "\uA6A0\uA6A1\uA6A2\uA6A3\uA6A4\uA6A5\uA6A6\uA6A7\uA6A8\uA6A9\uA6AA\uA6AB\uA6AC\uA6AD\uA6AE\uA6AF\uA6B0\uA6B1\uA6B2\uA6B3\uA6B4\uA6B5\uA6B6\uA6B7\uA6B8\uA6B9\uA6BA\uA6BB\uA6BC\uA6BD\uA6BE\uA6BF\uA6C0\uA6C1\uA6C2\uA6C3\uA6C4\uA6C5\uA6C6\uA6C7\uA6C8\uA6C9\uA6CA\uA6CB\uA6CC\uA6CD\uA6CE\uA6CF\uA6D0\uA6D1\uA6D2\uA6D3\uA6D4\uA6D5\uA6D6\uA6D7\uA6D8\uA6D9\uA6DA\uA6DB\uA6DC\uA6DD\uA6DE\uA6DF\uA6E0\uA6E1\uA6E2\uA6E3\uA6E4\uA6E5\uA6E6\uA6E7\uA6E8\uA6E9\uA6EA\uA6EB\uA6EC\uA6ED\uA6EE\uA6EF",
  ascii: (() => {
    let chars = "";
    for (let i = 33; i <= 126; i++) chars += String.fromCharCode(i);
    return chars;
  })(),
  binary: "01",
  korean: "\uAC00\uAC01\uAC04\uAC07\uAC08\uAC09\uAC0A\uAC10\uAC11\uAC12\uAC13\uAC14\uAC15\uAC16\uAC17\uAC19\uAC1A\uAC1B\uAC1C\uAC1D\uAC20\uAC24\uAC2C\uAC2D\uAC2F\uAC30\uAC31\uAC38\uAC39\uAC3C\uAC40\uAC4B\uAC4D\uAC54\uAC58\uAC5C\uAC70\uAC71\uAC74\uAC77\uAC78\uAC7A\uAC80\uAC81\uAC83\uAC84\uAC85\uAC86\uAC89\uAC8A\uAC8B\uAC8C\uAC90\uAC94\uAC9C\uAC9D\uAC9F\uACA0\uACA1\uACA8\uACA9\uACAA\uACAC\uACAF\uACB0\uACB8\uACB9\uACBB\uACBC\uACBD",
  matrix: "\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
};

const FONT_FAMILIES: Record<CharacterSet, string> = {
  bamum: "'Noto Sans Bamum', monospace",
  ascii: "'Courier New', monospace",
  binary: "'Courier New', monospace",
  korean: "'Noto Sans KR', monospace",
  matrix: "'Courier New', monospace",
};

const COLOR_CONFIGS: Record<ColorMode, { bg: string; getColor: (hue: number) => string; cycling: boolean }> = {
  white: {
    bg: "#000000",
    getColor: () => "rgba(255, 255, 255, 0.9)",
    cycling: false,
  },
  cycling: {
    bg: "#000000",
    getColor: (hue) => `hsl(${hue}, 100%, 50%)`,
    cycling: true,
  },
  "accent-blue": {
    bg: "#000000",
    getColor: () => "#00aaff",
    cycling: false,
  },
  "accent-red": {
    bg: "#000000",
    getColor: () => "#ff2244",
    cycling: false,
  },
  "accent-amber": {
    bg: "#000000",
    getColor: () => "#ffaa00",
    cycling: false,
  },
  inverted: {
    bg: "#0a0a2e",
    getColor: () => "#ffd700",
    cycling: false,
  },
};

export default function MatrixRain({
  characterSet = "bamum",
  colorMode = "white",
  speed = 50,
  fontSize = 16,
  fadeSpeed = 0.05,
  className,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rainDropsRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number>(0);
  const hueRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const colorConfig = COLOR_CONFIGS[colorMode];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const columns = Math.floor(rect.width / fontSize);
      rainDropsRef.current = Array(columns).fill(0).map(() => Math.random() * (rect.height / fontSize));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = 0;
    const alphabet = CHARACTER_SETS[characterSet];
    const fontFamily = FONT_FAMILIES[characterSet];

    const draw = (currentTime: number) => {
      if (currentTime - lastTime >= speed) {
        lastTime = currentTime;

        // Parse background color for fade overlay
        const bg = colorConfig.bg;
        const r = parseInt(bg.slice(1, 3), 16);
        const g = parseInt(bg.slice(3, 5), 16);
        const b = parseInt(bg.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeSpeed})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (colorConfig.cycling) {
          hueRef.current = (hueRef.current + 2) % 360;
        }
        ctx.fillStyle = colorConfig.getColor(hueRef.current);
        ctx.font = `${fontSize}px ${fontFamily}`;

        for (let i = 0; i < rainDropsRef.current.length; i++) {
          const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
          const x = i * fontSize;
          const y = rainDropsRef.current[i] * fontSize;
          ctx.fillText(text, x, y);

          if (y > canvas.getBoundingClientRect().height && Math.random() > 0.975) {
            rainDropsRef.current[i] = 0;
          }
          rainDropsRef.current[i]++;
        }
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [characterSet, colorMode, speed, fontSize, fadeSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor: COLOR_CONFIGS[colorMode].bg,
      }}
    />
  );
}
