import { useRef, useState, useCallback, useEffect } from "react";

const TARGET_VOLUME = 0.3;
const FADE_DURATION = 2000; // ms
const FADE_STEPS = 40;

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const fadeIntervalRef = useRef<number>(0);

  // Initialize audio element lazily
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/dissolvedgirl.mp3");
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const fadeIn = useCallback(() => {
    const audio = getAudio();
    let step = 0;
    const interval = FADE_DURATION / FADE_STEPS;

    clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = window.setInterval(() => {
      step++;
      const progress = step / FADE_STEPS;
      // Ease-out curve for natural fade
      audio.volume = TARGET_VOLUME * (1 - Math.pow(1 - progress, 3));

      if (step >= FADE_STEPS) {
        audio.volume = TARGET_VOLUME;
        clearInterval(fadeIntervalRef.current);
      }
    }, interval);
  }, [getAudio]);

  const play = useCallback(() => {
    const audio = getAudio();
    audio.volume = 0;
    audio.muted = false;
    const promise = audio.play();
    if (promise) {
      promise
        .then(() => {
          setPlaying(true);
          setMuted(false);
          fadeIn();
        })
        .catch(() => {
          // Autoplay blocked — silently fail
          console.warn("Audio autoplay blocked");
        });
    }
  }, [getAudio, fadeIn]);

  const toggleMute = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;

    if (muted) {
      audio.muted = false;
      setMuted(false);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  }, [getAudio, muted]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { play, toggleMute, muted, playing };
}
