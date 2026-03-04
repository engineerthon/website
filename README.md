# Engineerthon

Landing page for **Engineerthon** — a curated invite-only hackathon + social in London on 7 March 2026.

12 of the best young engineers compete across 2 sequential rounds, judged by YC founders and tech veterans. Points accumulate on a live leaderboard. Then it turns into a house party.

**Live at [hackathon.engineer](https://hackathon.engineer)**

## Stack

- React + TypeScript
- Vite (static build)
- Matrix rain canvas animation (Bamum script)
- GitHub Pages deployment

## Development

```bash
npm install
npm run dev
```

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via GitHub Actions.

To use the custom domain (`hackathon.engineer`), configure a CNAME record pointing to `<org>.github.io` and add a `CNAME` file in `public/`.

## Project Structure

```
src/
  components/
    MatrixRain.tsx        # Canvas-based falling characters animation
    CenteredHero.tsx      # Hero overlay with event title + CTA
    TerminalHero.tsx      # Terminal-style section
    TerminalReveal.tsx    # Animated terminal reveal for event details
  hooks/
    useAudio.ts           # Audio playback hook
  App.tsx                 # Main app with scene transitions
public/
  dissolvedgirl.mp3       # Background audio (Git LFS)
```
