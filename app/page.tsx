"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ITINERARY = [
  {
    date: "26 APR",
    day: "FRIDAY",
    title: "Mumbai Muster",
    location: "Panvel / Mumbai",
    emoji: "🏠",
    highlight: "Chirag's Fortress",
    activities: [
      "Tanmay & Aabha arrive at Panvel",
      "Stay at Chirag's house",
      "Full Mumbai chaos mode — the gang assembles",
    ],
    vibe: "GATHERING",
    color: "#f59e0b",
  },
  {
    date: "27 APR",
    day: "SATURDAY",
    title: "Birthday Bash",
    location: "Mumbai",
    emoji: "🎂",
    highlight: "Chirag's Birthday",
    activities: [
      "Celebrate Chirag Gandhi turning one year older",
      "Party party — yay yay!!",
      "The crew goes full chaos mode for the birthday king",
    ],
    vibe: "PARTY 🎉",
    color: "#ec4899",
  },
  {
    date: "28 APR",
    day: "SUNDAY",
    title: "The Descent Begins",
    location: "Mumbai → Dehradun → Rishikesh",
    emoji: "✈️",
    highlight: "5:00 AM Departure",
    activities: [
      "Flight from Mumbai at 5:00 AM — yes, really",
      "Land Dehradun 8:30 AM. Drive to Rishikesh, arrive ~11 AM",
      "Freshen up → Pahadi lunch at 12 PM",
      "Rent scooties → ride to Ganga Path for evening aarti",
      "Nearby café wind-down → early sleep",
    ],
    vibe: "TRANSIT",
    color: "#06b6d4",
  },
  {
    date: "29 APR",
    day: "MONDAY",
    title: "RAPIDS DAY",
    location: "Rishikesh — The River Calls",
    emoji: "🚣",
    highlight: "White Water Rafting",
    activities: [
      "Morning breakfast → head straight to the river",
      "RAFTING — hold on tight, scream louder",
      "Lunch at a famous café by Laxman Jhula",
      "Sit by the ghat. Breathe. Let the Ganga do her thing.",
      "Evening nashta at Gorakhpur Press — legendary stuff",
    ],
    vibe: "ADRENALINE",
    color: "#3b82f6",
    isHero: true,
  },
  {
    date: "30 APR",
    day: "TUESDAY",
    title: "Haridwar Pilgrimage",
    location: "Haridwar",
    emoji: "🪔",
    highlight: "Har Ki Pauri",
    activities: [
      "Leave for Haridwar — hit all the major spots",
      "Full food tour — eat everything in sight",
      "Roam till evening",
      "Attend Ganga Aarti — either Rishikesh or Haridwar",
    ],
    vibe: "SPIRITUAL",
    color: "#f97316",
  },
  {
    date: "01 MAY",
    day: "WEDNESDAY",
    title: "Sangam at Dev Prayag",
    location: "Vashisth Gufa → Dev Prayag",
    emoji: "🏔️",
    highlight: "Birth of Ganga",
    activities: [
      "Leave for Vashisth Gufa — ancient cave, pure vibes",
      "Drive to Dev Prayag",
      "Witness the Sangam: Bhagirathi + Alaknanda = Ganga",
      "Stand at the point where a river is born",
    ],
    vibe: "SACRED",
    color: "#8b5cf6",
  },
  {
    date: "02 MAY",
    day: "THURSDAY",
    title: "Free Bird Day",
    location: "Wherever the wind takes you",
    emoji: "🌅",
    highlight: "Your Call",
    activities: [
      "Plan for yourself — no agenda, no schedule",
      "Go about it freely",
      "Last full day in the mountains — make it count",
    ],
    vibe: "FREE",
    color: "#10b981",
  },
  {
    date: "03 MAY",
    day: "FRIDAY",
    title: "The Return",
    location: "Rishikesh → Mumbai",
    emoji: "🛫",
    highlight: "Until Next Time",
    activities: [
      "Pack up the memories",
      "Leave for Mumbai",
      "Carry the river home",
    ],
    vibe: "FAREWELL",
    color: "#6b7280",
  },
];

const CREW = [
  {
    name: "Jobin James",
    title: "Master of Universe",
    description:
      "Ride-or-die friend. Reliable to a fault, drops the quirkiest one-liners, and somehow pulls off naïve + genius at the same time.",
    accent: "#6366f1",
    initial: "JJ",
    trait: "RELIABILITY: ∞",
    photo: "/images/crew/jobin.jpg",
  },
  {
    name: "Chirag Gandhi",
    title: "Mogambo",
    description:
      "Sincere, protective and always scanning for danger before we even see it. Funny as hell and the friend who will show up before even asking.",
    accent: "#ef4444",
    initial: "CG",
    trait: "THREAT DETECTION: MAX",
    photo: "/images/crew/chirag.jpg",
  },
  {
    name: "Aabha Murugkar",
    title: "Queen of Chaos Control",
    description:
      "The funniest, sweetest, most caring one in the crew. Keeps tabs on all of us and makes sure the boys actually behave. The boss lady — unofficial mom of the gang but way cooler.",
    accent: "#ec4899",
    initial: "AM",
    trait: "CHAOS CONTROL: LEGENDARY",
    photo: "/images/crew/aabha.jpg",
  },
  {
    name: "Tanmay Murugkar",
    title: "Chief Escape Officer",
    description:
      "Always cooking up the next trip. Runs the show when it's time to escape, but lives by one rule: Live freely. Doesn't take life seriously — just the next destination.",
    accent: "#f59e0b",
    initial: "TM",
    trait: "WANDERLUST: CRITICAL",
    photo: "/images/crew/tanmay.jpg",
  },
];

// ─── Raft Hero — Cinematic Photo Sequence ─────────────────────────────────────

const RAFT_IMAGES = [
  "/images/rafting/raft1.jpg",
  "/images/rafting/raft2.jpg",
  "/images/rafting/raft3.jpg",
  "/images/rafting/raft4.jpg",
  "/images/rafting/raft5.avif",
];

// Reel sequence order — ends on index 2 (most dramatic white-water shot)
const REEL_SEQ  = [0, 3, 1, 4, 2, 0, 4, 1, 3, 2, 0, 3, 4, 1, 2];
const SETTLE_SEQ = [4, 0, 2];
const FINAL_FRAME = 2;

type HeroPhase = "reel" | "settle" | "locked";

function RaftHero() {
  const [phase, setPhase]           = useState<HeroPhase>("reel");
  const [currentImg, setCurrentImg] = useState(0);
  const [flash, setFlash]           = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    let timer: ReturnType<typeof setTimeout>;

    let ri = 0;
    const runReel = () => {
      if (ri < REEL_SEQ.length) {
        setCurrentImg(REEL_SEQ[ri]);
        setFlash(true);
        setTimeout(() => setFlash(false), 35);
        ri++;
        timer = setTimeout(runReel, 110);
      } else {
        setPhase("settle");
        let si = 0;
        const runSettle = () => {
          if (si < SETTLE_SEQ.length) {
            setCurrentImg(SETTLE_SEQ[si]);
            setFlash(true);
            setTimeout(() => setFlash(false), 60);
            si++;
            timer = setTimeout(runSettle, 320);
          } else {
            setCurrentImg(FINAL_FRAME);
            setPhase("locked");
            setTimeout(() => setTextVisible(true), 350);
          }
        };
        runSettle();
      }
    };

    // Brief black hold, then reel fires
    timer = setTimeout(runReel, 200);
    return () => clearTimeout(timer);
  }, [mounted]);

  const isLocked = phase === "locked";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: "#000" }}
    >
      {/* ── All 5 photos pre-loaded, z-stacked ── */}
      {RAFT_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{
            opacity: currentImg === i ? 1 : 0,
            transition: isLocked && currentImg === i
              ? "opacity 0.6s ease"
              : "none",
            zIndex: currentImg === i ? 2 : 1,
          }}
        >
          {/* Ken Burns zoom only on locked frame */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: isLocked && currentImg === i ? "scale(1.07)" : "scale(1)",
              transition: isLocked && currentImg === i
                ? "transform 9s ease-out"
                : "none",
              transformOrigin: "center center",
            }}
          />
        </div>
      ))}

      {/* ── Color grade overlay — cinematic teal-dark tint ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(160deg, rgba(0,20,40,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,10,20,0.65) 100%)",
          mixBlendMode: "multiply",
          zIndex: 5,
          transition: isLocked ? "opacity 1s ease" : "none",
          opacity: isLocked ? 1 : 0.4,
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
          zIndex: 6,
        }}
      />

      {/* ── Letterbox bars — cinematic 2.35:1 ── */}
      <motion.div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{ height: "9vh", background: "#000", zIndex: 8, transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isLocked ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{ height: "9vh", background: "#000", zIndex: 8, transformOrigin: "bottom" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isLocked ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* ── Cut flash ── */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "#fff", zIndex: 10 }}
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.06 }}
          />
        )}
      </AnimatePresence>

      {/* ── Reel HUD — frame counter ── */}
      <AnimatePresence>
        {!isLocked && mounted && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              zIndex: 12,
              textAlign: "center",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: "clamp(60px, 14vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.07)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {String(currentImg + 1).padStart(2, "0")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scan-line during reel ── */}
      {!isLocked && mounted && (
        <motion.div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: 2,
            background: "rgba(255,255,255,0.18)",
            zIndex: 11,
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* ── Hero text — burns in after lock ── */}
      <AnimatePresence>
        {textVisible && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 20, paddingTop: "9vh", paddingBottom: "9vh", pointerEvents: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Date strip */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.45em" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.6rem",
                pointerEvents: "auto",
              }}
            >
              <div style={{ width: 28, height: 1, background: "#06b6d4" }} />
              <motion.a
                href="#itinerary"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("itinerary");
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(6,182,212,0.8)" }}
                whileTap={{ scale: 0.96 }}
                style={{
                  fontFamily: "var(--font-orbitron), Orbitron, monospace",
                  fontSize: "clamp(11px, 1.3vw, 14px)",
                  fontWeight: 700,
                  letterSpacing: "0.4em",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 30px rgba(6,182,212,1)",
                  background: "rgba(0,0,0,0.65)",
                  border: "1px solid #06b6d4",
                  padding: "7px 18px",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  cursor: "pointer",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                26 APR — 03 MAY · 2026
              </motion.a>
              <div style={{ width: 28, height: 1, background: "#06b6d4" }} />
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: "clamp(42px, 9.5vw, 120px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textAlign: "center",
                color: "#ffffff",
                textShadow:
                  "0 2px 0 rgba(0,0,0,0.8), 0 0 60px rgba(6,182,212,0.35), 0 0 120px rgba(6,182,212,0.15)",
              }}
            >
              RISHIKESH
            </motion.h1>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: "clamp(14px, 2vw, 22px)",
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: "#ffffff",
                textTransform: "uppercase",
                marginTop: "1.8rem",
                textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(6,182,212,0.6)",
              }}
            >
              Into the Rapids
            </motion.div>

            {/* Crew names */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{
                display: "flex",
                gap: "clamp(6px, 1.5vw, 12px)",
                marginTop: "3rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                { name: "JOBIN", color: "#818cf8" },
                { name: "CHIRAG", color: "#f87171" },
                { name: "AABHA", color: "#f472b6" },
                { name: "TANMAY", color: "#fbbf24" },
              ].map(({ name, color }, i) => (
                <motion.a
                  key={name}
                  href="#crew"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.45 }}
                  onClick={(e) => {
                    e.preventDefault();
                    const crew = document.getElementById("crew");
                    if (crew) {
                      const top = crew.getBoundingClientRect().top + window.pageYOffset;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  style={{
                    fontFamily: "var(--font-orbitron), Orbitron, monospace",
                    fontSize: "clamp(10px, 1.2vw, 13px)",
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    color: "#ffffff",
                    textTransform: "uppercase",
                    padding: "7px 16px",
                    border: `1px solid ${color}`,
                    background: "rgba(0,0,0,0.7)",
                    textShadow: `0 2px 6px rgba(0,0,0,0.9), 0 0 20px ${color}`,
                    boxShadow: `0 0 16px ${color}55, inset 0 0 12px ${color}18`,
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    cursor: "pointer",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: `0 0 28px ${color}99, inset 0 0 16px ${color}28`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {name}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll indicator ── */}
      {textVisible && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            bottom: "11vh",
            left: "50%",
            x: "-50%",
            zIndex: 25,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <span
            style={{
              fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
              fontSize: 9,
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            style={{
              width: 1,
              height: 36,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            }}
          />
        </motion.div>
      )}

      {/* ── HUD corners ── */}
      <HUDCorners />
    </section>
  );
}

// ─── HUD Corners ──────────────────────────────────────────────────────────────

function HUDCorners() {
  const corner = (pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: 32,
        height: 32,
        ...pos,
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M0 16 L0 0 L16 0" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
      </svg>
    </div>
  );

  return (
    <>
      {corner({ top: 24, left: 24 })}
      {corner({ top: 24, right: 24, transform: "scaleX(-1)" })}
      {corner({ bottom: 24, left: 24, transform: "scaleY(-1)" })}
      {corner({ bottom: 24, right: 24, transform: "scale(-1,-1)" })}
    </>
  );
}

// ─── Itinerary Section ─────────────────────────────────────────────────────────

function ItinerarySection() {
  return (
    <section
      id="itinerary"
      style={{
        background: "#020b14",
        paddingTop: "6rem",
        paddingBottom: "4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background photos — stacked top / mid / bottom ── */}
      {[
        { src: "/images/itinerary-bg.jpg",   top: "0%",     height: "40%" },
        { src: "/images/itinerary-bg2.jpg",  top: "30%",    height: "45%" },
        { src: "/images/itinerary-bg3.jpeg", top: "62%",    height: "42%" },
      ].map(({ src, top, height }) => (
        <div
          key={src}
          className="absolute pointer-events-none"
          style={{
            left: 0,
            right: 0,
            top,
            height,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            opacity: 0.55,
            zIndex: 0,
          }}
        />
      ))}
      {/* Gradient blends between images + fades edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "linear-gradient(to bottom,",
            "  #020b14 0%,",
            "  rgba(2,11,20,0.25) 8%,",
            "  rgba(2,11,20,0.25) 92%,",
            "  #020b14 100%",
            ")",
          ].join(" "),
          zIndex: 1,
        }}
      />

      {/* Section header */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          marginBottom: "4rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(6,182,212,0.5)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
              fontSize: 10,
              letterSpacing: "0.5em",
              color: "rgba(6,182,212,0.7)",
              textTransform: "uppercase",
            }}
          >
            Mission Timeline
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-orbitron), Orbitron, monospace",
            fontSize: "clamp(28px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          THE ITINERARY
        </h2>
      </div>

      {/* Timeline */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "clamp(1.5rem, 5vw, 4rem)",
            top: 0,
            bottom: 0,
            width: 1,
            background:
              "linear-gradient(to bottom, rgba(6,182,212,0.0), rgba(6,182,212,0.3) 10%, rgba(6,182,212,0.3) 90%, rgba(6,182,212,0.0))",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {ITINERARY.map((day, i) => (
            <DayCard key={day.date} day={day} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DayCard({
  day,
  index,
}: {
  day: (typeof ITINERARY)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });
  const opacity = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 20,
  });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [40, 0]), {
    stiffness: 100,
    damping: 20,
  });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, paddingLeft: "clamp(2.5rem, 6vw, 5rem)" }}
    >
      <div
        style={{
          position: "relative",
          borderLeft: `2px solid ${day.color}22`,
          paddingLeft: "2rem",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        {/* Timeline dot */}
        <div
          style={{
            position: "absolute",
            left: -7,
            top: "2.4rem",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: day.isHero ? day.color : `${day.color}88`,
            boxShadow: day.isHero
              ? `0 0 0 4px ${day.color}33, 0 0 20px ${day.color}66`
              : "none",
          }}
        />

        {/* Day header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {/* Date badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 64,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: "clamp(13px, 1.8vw, 18px)",
                fontWeight: 800,
                color: day.color,
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              {day.date}
            </span>
            <span
              style={{
                fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                fontSize: 8,
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              {day.day}
            </span>
          </div>

          {/* Vibe pill */}
          <span
            style={{
              fontFamily: "var(--font-orbitron), Orbitron, monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: day.color,
              border: `1px solid ${day.color}55`,
              padding: "3px 10px",
              borderRadius: 2,
              marginTop: 2,
            }}
          >
            {day.vibe}
          </span>

          {/* Emoji + Title */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: "clamp(14px, 2.2vw, 22px)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.05em",
                marginBottom: 2,
              }}
            >
              {day.emoji} {day.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                fontSize: "clamp(10px, 1.2vw, 12px)",
                letterSpacing: "0.3em",
                color: `${day.color}aa`,
                textTransform: "uppercase",
              }}
            >
              {day.location}
            </p>
          </div>
        </div>

        {/* Highlight callout */}
        {day.isHero && (
          <div
            style={{
              background: `${day.color}11`,
              border: `1px solid ${day.color}44`,
              borderLeft: `3px solid ${day.color}`,
              padding: "0.6rem 1rem",
              marginBottom: "0.75rem",
              borderRadius: "0 2px 2px 0",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: day.color,
                textTransform: "uppercase",
              }}
            >
              ★ {day.highlight}
            </span>
          </div>
        )}

        {/* Activities */}
        <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {day.activities.map((act, j) => (
            <li
              key={j}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                fontSize: "clamp(15px, 1.6vw, 18px)",
                fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.5,
                letterSpacing: "0.02em",
                textShadow: "0 1px 6px rgba(0,0,0,0.8)",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: `${day.color}66`,
                  marginTop: "0.55em",
                }}
              />
              {act}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ─── Crew Section ──────────────────────────────────────────────────────────────

function CrewSection() {
  return (
    <section
      id="crew"
      style={{
        background: "#020b14",
        borderTop: "1px solid rgba(6,182,212,0.08)",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ width: 60, height: 1, background: "rgba(6,182,212,0.3)" }} />
            <span
              style={{
                fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                fontSize: 10,
                letterSpacing: "0.5em",
                color: "rgba(6,182,212,0.7)",
                textTransform: "uppercase",
              }}
            >
              The Crew
            </span>
            <div style={{ width: 60, height: 1, background: "rgba(6,182,212,0.3)" }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-orbitron), Orbitron, monospace",
              fontSize: "clamp(26px, 4.5vw, 52px)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            WHO'S ON THE RAFT
          </h2>
        </div>

        {/* Crew grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "1.5rem",
          }}
        >
          {CREW.map((member, i) => (
            <CrewCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CrewCard({
  member,
  index,
}: {
  member: (typeof CREW)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.5"],
  });
  const opacity = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 20 });
  const y      = useSpring(useTransform(scrollYProgress, [0, 1], [70, 0]), { stiffness: 80, damping: 20 });

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${hovered ? member.accent + "88" : member.accent + "33"}`,
          background: "#030e1a",
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
          boxShadow: hovered
            ? `0 0 0 1px ${member.accent}22, 0 8px 48px ${member.accent}22, inset 0 0 40px ${member.accent}08`
            : `0 4px 24px rgba(0,0,0,0.5)`,
          cursor: "default",
        }}
      >
        {/* ── Top: photo or gradient fallback ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            overflow: "hidden",
            background: `linear-gradient(160deg, ${member.accent}33 0%, #020b14 100%)`,
          }}
        >
          {!photoError ? (
            <img
              src={member.photo}
              alt={member.name}
              onError={() => setPhotoError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                transform: hovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.6s ease",
                filter: "contrast(1.05) saturate(0.92)",
              }}
            />
          ) : (
            /* Fallback when photo not yet added */
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${member.accent}28 0%, #020b14 100%)`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-orbitron), Orbitron, monospace",
                  fontSize: "clamp(36px, 5vw, 52px)",
                  fontWeight: 900,
                  color: `${member.accent}88`,
                  letterSpacing: "0.05em",
                }}
              >
                {member.initial}
              </span>
            </div>
          )}

          {/* Color wash over photo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, transparent 40%, #030e1a 100%)`,
              pointerEvents: "none",
            }}
          />

          {/* Accent top bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(to right, transparent, ${member.accent}, transparent)`,
            }}
          />

          {/* Title pill overlaid on photo bottom */}
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              right: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: member.accent,
                textTransform: "uppercase",
                background: `${member.accent}18`,
                border: `1px solid ${member.accent}44`,
                padding: "4px 10px",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {member.title}
            </span>
          </div>
        </div>

        {/* ── Bottom: info panel ── */}
        <div style={{ padding: "1.4rem 1.4rem 1.6rem" }}>
          {/* Name */}
          <h3
            style={{
              fontFamily: "var(--font-orbitron), Orbitron, monospace",
              fontSize: "clamp(13px, 1.5vw, 16px)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.04em",
              marginBottom: "0.75rem",
            }}
          >
            {member.name}
          </h3>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: 1,
              background: `linear-gradient(to right, ${member.accent}66, transparent)`,
              marginBottom: "0.85rem",
            }}
          />

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              lineHeight: 1.7,
              color: "rgba(232,232,232,0.72)",
              marginBottom: "1.2rem",
            }}
          >
            {member.description}
          </p>

          {/* Trait badge */}
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-orbitron), Orbitron, monospace",
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: member.accent,
              border: `1px solid ${member.accent}55`,
              background: `${member.accent}0d`,
              padding: "4px 12px",
              textTransform: "uppercase",
            }}
          >
            {member.trait}
          </span>
        </div>

        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 40,
            height: 40,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M40 20 L40 40 L20 40" stroke={`${member.accent}44`} strokeWidth="1" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Trip Footer ───────────────────────────────────────────────────────────────

function TripFooter() {
  return (
    <footer
      style={{
        background: "#020b14",
        borderTop: "1px solid rgba(6,182,212,0.1)",
        padding: "3rem clamp(1.5rem, 5vw, 4rem)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* River line */}
        <div
          style={{
            width: "100%",
            height: 2,
            background:
              "linear-gradient(to right, transparent, rgba(6,182,212,0.4), rgba(6,182,212,0.6), rgba(6,182,212,0.4), transparent)",
            marginBottom: "2rem",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: "var(--font-orbitron), Orbitron, monospace",
            fontSize: "clamp(13px, 2vw, 18px)",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "0.75rem",
          }}
        >
          जय गंगा माँ
        </motion.p>

        <p
          style={{
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
            fontSize: "clamp(10px, 1.2vw, 12px)",
            letterSpacing: "0.35em",
            color: "rgba(6,182,212,0.4)",
            textTransform: "uppercase",
          }}
        >
          Rishikesh · April–May 2026 · Four Riders, One River
        </p>

        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {["Jobin", "Chirag", "Aabha", "Tanmay"].map((name) => (
            <span
              key={name}
              style={{
                fontFamily: "var(--font-orbitron), Orbitron, monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function RishikeshPage() {
  return (
    <main style={{ background: "#020b14" }}>
      <RaftHero />
      <ItinerarySection />
      <CrewSection />
      <TripFooter />
    </main>
  );
}
