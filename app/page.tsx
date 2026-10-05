'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Scene = "intro" | "teachers-day" | "flowers" | "question" | "celebration";

const rejectionMessages = [
  "Fatiha, please try again 🌸",
  "Are you sure, Fatiha? 😌",
  "Fatiha, these flowers really want you! 🌷",
  "One more little try, Fatiha... ❤️",
  "The flowers are crying, Fatiha! 😢🌸",
  "Fatiha please... just press the green one! 💚"
];

const flowerData = [
  { type: "rose", left: "8%", bottom: "7%", delay: 0 },
  { type: "tulip", left: "21%", bottom: "4%", delay: 0.15 },
  { type: "daisy", left: "35%", bottom: "8%", delay: 0.28 },
  { type: "rose", left: "51%", bottom: "3%", delay: 0.42 },
  { type: "tulip", left: "66%", bottom: "6%", delay: 0.56 },
  { type: "daisy", left: "80%", bottom: "4%", delay: 0.7 },
  { type: "rose", left: "91%", bottom: "8%", delay: 0.84 }
];

function Petals({ intensity = 1 }: { intensity?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        delay: `${(i % 9) * 0.8}s`,
        duration: `${7 + (i % 5) * 1.4}s`,
        size: `${8 + (i % 4) * 3}px`,
        opacity: 0.22 + (i % 5) * 0.08
      })),
    []
  );

  return (
    <div className={`petal-layer ${intensity > 1 ? "petal-layer-strong" : ""}`} aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: `calc(${petal.size} * 1.55)`,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            opacity: petal.opacity
          }}
        />
      ))}
    </div>
  );
}

function Sparkles({ count = 18 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 47 + 11) % 96}%`,
        top: `${(i * 31 + 7) % 88}%`,
        delay: `${(i % 8) * 0.45}s`,
        size: 2 + (i % 3)
      })),
    [count]
  );

  return (
    <div className="sparkle-layer" aria-hidden="true">
      {dots.map((dot) => (
        <i
          key={dot.id}
          className="sparkle"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            animationDelay: dot.delay
          }}
        />
      ))}
    </div>
  );
}

function DecorativeHeart({ delay, left, top }: { delay: number; left: string; top: string }) {
  return (
    <motion.span
      className="floating-heart"
      style={{ left, top }}
      animate={{ y: [0, -16, 0], rotate: [-8, 5, -8], opacity: [0.25, 0.8, 0.25] }}
      transition={{ duration: 4.5, repeat: Infinity, delay, ease: "easeInOut" }}
      aria-hidden="true"
    >
      ♥
    </motion.span>
  );
}

function Cake() {
  return (
    <motion.div
      className="cake-wrap"
      initial={{ opacity: 0, y: 35, scale: 0.82 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25, type: "spring", bounce: 0.28 }}
      aria-label="Decorative celebration cake"
    >
      <div className="cake-glow" />
      <div className="candle-row">
        {[0, 1, 2].map((i) => (
          <div className="candle" key={i}>
            <span className="flame" />
          </div>
        ))}
      </div>
      <div className="cake-top">
        <span className="icing-drip d1" />
        <span className="icing-drip d2" />
        <span className="icing-drip d3" />
        <span className="cake-flower flower-a">✿</span>
        <span className="cake-flower flower-b">✿</span>
      </div>
      <div className="cake-body">
        <div className="cake-band" />
        <div className="cake-detail one" />
        <div className="cake-detail two" />
        <div className="cake-detail three" />
      </div>
      <div className="cake-plate" />
    </motion.div>
  );
}

function Flower({ type, left, bottom, delay, strong = false }: { type: string; left: string; bottom: string; delay: number; strong?: boolean }) {
  return (
    <motion.div
      className={`grown-flower ${type} ${strong ? "strong-flower" : ""}`}
      style={{ left, bottom }}
      initial={{ opacity: 0, y: 100, scale: 0.35 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay, type: "spring", bounce: 0.25 }}
    >
      <div className="stem" />
      <div className="leaf leaf-left" />
      <div className="leaf leaf-right" />
      <div className="flower-head">
        {type === "daisy" ? (
          <>
            {Array.from({ length: 10 }, (_, i) => <span className="daisy-petal" key={i} style={{ transform: `rotate(${i * 36}deg) translateY(-12px)` }} />)}
            <span className="daisy-center" />
          </>
        ) : type === "tulip" ? (
          <span className="tulip-head" />
        ) : (
          <span className="rose-head"><i /><i /><i /></span>
        )}
      </div>
    </motion.div>
  );
}

function MusicControl({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button className="music-control" onClick={onToggle} aria-label={playing ? "Pause music" : "Play music"}>
      <span className={playing ? "music-bars active" : "music-bars"}>
        <i /><i /><i />
      </span>
      <span>{playing ? "Music" : "♫"}</span>
    </button>
  );
}

function SceneShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.main
      className={`scene ${className}`}
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function TeacherDayExperience() {
  const [scene, setScene] = useState<Scene>("intro");
  const [rejectCount, setRejectCount] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [rejectShrink, setRejectShrink] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.18;
  }, []);

  const startMusic = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      await startMusic();
    }
  };

  const advance = (next: Scene) => {
    if (scene === "intro") startMusic();
    setScene(next);
  };

  const reject = () => {
    setRejectCount((n) => n + 1);
    setSwapped((v) => !v);
    setRejectShrink((n) => Math.min(n + 1, 4));
  };

  const celebrationBurst = !prefersReducedMotion;

  // The reject button gets progressively smaller after each rejection
  const rejectScale = Math.max(1 - rejectShrink * 0.12, 0.52);

  return (
    <div className="experience">
      <audio ref={audioRef} src="/music/teachers-day.mp3" loop preload="none" />
      <AnimatePresence mode="wait">
        {scene === "intro" && (
          <SceneShell className="intro-scene">
            <Sparkles count={12} />
            <div className="intro-orbit orbit-one" />
            <div className="intro-orbit orbit-two" />
            <div className="intro-content">
              <motion.div className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                A little surprise for you
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
                Hello Fatiha!<br />I made something for you...
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.05 }}>
                Click the button below to see your surprise <span>✦</span>
              </motion.p>
              <motion.button
                className="lux-button dark-button"
                onClick={() => advance("teachers-day")}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.45, type: "spring" }}
                whileHover={{ scale: 1.08, boxShadow: "0 0 30px rgba(201,166,107,.4), 0 20px 60px rgba(0,0,0,.45)" }}
                whileTap={{ scale: 0.96 }}
              >
                <span>👉 CLICK ME TO START</span><b>✦</b>
              </motion.button>
              <motion.div
                className="button-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.2 }}
              >
                ☝️ Click this button, Fatiha!
              </motion.div>
            </div>
            <div className="intro-signature">made with love for Fatiha ❤️</div>
          </SceneShell>
        )}

        {scene === "teachers-day" && (
          <SceneShell className="warm-scene">
            <Petals />
            <Sparkles count={22} />
            <div className="halo halo-one" />
            <div className="halo halo-two" />
            <div className="scene-topline">A day worth celebrating</div>
            <div className="hero-copy">
              <motion.div className="mini-flower">✿</motion.div>
              <motion.h2 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
                Happy Teachers&apos; Day
                <br />
                <span className="fatiha-name">Dear Fatiha</span>
                <span> 🌸</span>
              </motion.h2>
              <motion.p className="subtitle" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
                To a truly wonderful teacher — Fatiha
              </motion.p>
              <motion.p className="microcopy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }}>
                Today is all about celebrating you, Fatiha!
              </motion.p>
            </div>
            <Cake />
            <motion.button
              className="lux-button light-button scene-button"
              onClick={() => advance("flowers")}
              whileHover={{ scale: 1.08, boxShadow: "0 0 35px rgba(183,95,112,.3), 0 20px 60px rgba(115,56,72,.2)" }}
              whileTap={{ scale: 0.96 }}
            >
              <span>👉 CLICK ME TO SEE YOUR FLOWERS</span><b>✦</b>
            </motion.button>
            <div className="button-hint-light">Click here to see something beautiful! 🌷</div>
          </SceneShell>
        )}

        {scene === "flowers" && (
          <SceneShell className="flower-scene">
            <Petals intensity={2} />
            <Sparkles count={16} />
            <div className="flower-moon" />
            <div className="floral-copy">
              <motion.div className="tiny-label" initial={{ opacity: 0, letterSpacing: "0.2em" }} animate={{ opacity: 1, letterSpacing: "0.32em" }} transition={{ duration: 1 }}>
                JUST FOR YOU, FATIHA
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.15 }}>
                These flowers<br />are for you, Fatiha <span>🌷</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.45 }}>
                Because someone as special as you, Fatiha,<br />deserves something beautiful.
              </motion.p>
            </div>
            <div className="flower-garden" aria-hidden="true">
              {flowerData.map((flower) => <Flower key={`${flower.type}-${flower.left}`} {...flower} />)}
            </div>
            <motion.button
              className="lux-button rose-button scene-button"
              onClick={() => advance("question")}
              whileHover={{ scale: 1.08, boxShadow: "0 0 35px rgba(185,103,120,.4), 0 20px 60px rgba(115,56,72,.25)" }}
              whileTap={{ scale: 0.96 }}
            >
              <span>👉 CLICK ME FOR ONE MORE THING</span><b>♥</b>
            </motion.button>
            <div className="button-hint-light">There&apos;s one more surprise, Fatiha! Click me here ☝️</div>
          </SceneShell>
        )}

        {scene === "question" && (
          <SceneShell className="question-scene">
            <Petals />
            <Sparkles count={20} />
            <DecorativeHeart delay={0} left="9%" top="18%" />
            <DecorativeHeart delay={1.2} left="82%" top="24%" />
            <DecorativeHeart delay={2.1} left="16%" top="74%" />
            <DecorativeHeart delay={0.7} left="87%" top="72%" />
            <motion.div className="question-card" initial={{ opacity: 0, y: 35, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, type: "spring", bounce: 0.22 }}>
              <div className="card-ornament">✦</div>
              <div className="tiny-label">ONE LITTLE QUESTION FOR FATIHA</div>
              <h2>Fatiha, will you<br />accept these flowers? <span>🌸</span></h2>
              <p>They were picked with the biggest smile, just for you!</p>
              <AnimatePresence mode="wait">
                {rejectCount > 0 && (
                  <motion.div key={rejectCount} className="playful-message" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    {rejectionMessages[Math.min(rejectCount - 1, rejectionMessages.length - 1)]}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div className={`choice-row ${swapped ? "swapped" : ""}`} layout transition={{ type: "spring", stiffness: 520, damping: 28 }}>
                <motion.button
                  className="choice accept"
                  layout
                  onClick={() => advance("celebration")}
                  whileHover={{ scale: 1.07, boxShadow: "0 0 30px rgba(132,62,82,.35), 0 16px 40px rgba(132,62,82,.25)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">✅</span>
                  <span className="btn-label">YES, I ACCEPT!</span>
                  <span className="btn-sublabel">Click me to take the flowers 💐</span>
                </motion.button>
                <motion.button
                  className="choice reject"
                  layout
                  onClick={reject}
                  whileHover={{ scale: 0.97, boxShadow: "0 0 15px rgba(109,77,85,.15)" }}
                  whileTap={{ scale: 0.9 }}
                  style={{ transform: `scale(${rejectScale})` }}
                >
                  <span className="btn-icon">😅</span>
                  <span className="btn-label">NO THANKS</span>
                  <span className="btn-sublabel">Are you sure, Fatiha?</span>
                </motion.button>
              </motion.div>
              <div className="card-footer">No wrong answers, Fatiha. Just a little flower-powered fun! 🌼</div>
            </motion.div>
          </SceneShell>
        )}

        {scene === "celebration" && (
          <SceneShell className="celebration-scene">
            <Petals intensity={3} />
            <Sparkles count={36} />
            {celebrationBurst && (
              <div className="burst-field" aria-hidden="true">
                {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}
              </div>
            )}
            <motion.div className="celebration-light" initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} transition={{ duration: 1.2 }} />
            <div className="celebration-copy">
              <motion.div className="yay" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, type: "spring", bounce: 0.4 }}>
                Yay, Fatiha! <span>♥</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18 }}>
                These flowers are<br />officially yours, Fatiha <span>🌸</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.42 }}>
                Happy Teachers&apos; Day, Fatiha!
              </motion.p>
              <motion.div className="final-note" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.62 }}>
                Keep smiling, beautiful Fatiha. You are the best teacher! ✨
              </motion.div>
              <motion.div
                className="fatiha-badge"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 1, type: "spring", bounce: 0.5 }}
              >
                🏆 Best Teacher Award — Fatiha 🏆
              </motion.div>
            </div>
            <div className="celebration-garden" aria-hidden="true">
              {flowerData.map((flower, index) => <Flower key={`${flower.type}-final-${index}`} {...flower} strong />)}
            </div>
            <Cake />
          </SceneShell>
        )}
      </AnimatePresence>

      {scene !== "intro" && <MusicControl playing={musicPlaying} onToggle={toggleMusic} />}
    </div>
  );
}
