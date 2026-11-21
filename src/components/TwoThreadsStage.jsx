import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Play, Pause, ChevronRight, ChevronLeft, X, Trophy, PartyPopper } from 'lucide-react';
import { TIMELINE_DATA } from '../data/timelinePhotos';
import AnimatedTimelineBird from './AnimatedTimelineBird';
import { sounds } from '../utils/audio';

export default function TwoThreadsStage({ onOpenLetter, onRestartExperience }) {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [scrollX, setScrollX] = useState(0);
  const [drawnFrontX, setDrawnFrontX] = useState(250); // live front of the drawing threads
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeMemory, setActiveMemory] = useState(null);
  const [isModalFlipped, setIsModalFlipped] = useState(false);
  const [reachedMilestones, setReachedMilestones] = useState(new Set());
  const [hasPlayedConvergenceSfx, setHasPlayedConvergenceSfx] = useState(false);

  // 🌬️ 3D Physics & Parallax State
  const [scrollWindAngle, setScrollWindAngle] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 400, y: 200 });
  const [shootingWishes, setShootingWishes] = useState([]);
  const [showGrandFinaleBanner, setShowGrandFinaleBanner] = useState(false);
  const [pluckedThread, setPluckedThread] = useState(null);
  const lastScrollLeft = useRef(0);
  const lastScrollTime = useRef(performance.now());

  const TOTAL_TIMELINE_WIDTH = 4800;

  // Staged entrance: Trigger the first milestones (f1, m1) 700ms after entering the stage
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setDrawnFrontX(620);
      setReachedMilestones((prev) => {
        const next = new Set(prev);
        next.add('f1');
        next.add('m1');
        return next;
      });
    }, 700);

    return () => clearTimeout(entranceTimer);
  }, []);

  // Track horizontal scroll and sync thread drawing front + wind inertia physics
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = Math.min(1, Math.max(0, scrollLeft / (maxScroll || 1)));

    // Calculate aerodynamic scroll-breeze velocity for 3D photo sway
    const now = performance.now();
    const dt = Math.max(16, now - lastScrollTime.current);
    const dx = scrollLeft - lastScrollLeft.current;
    const velocity = dx / dt;
    setScrollWindAngle(Math.max(-10, Math.min(10, -velocity * 8.5)));
    lastScrollLeft.current = scrollLeft;
    lastScrollTime.current = now;

    setScrollX(scrollLeft);
    setScrollProgress(progress);

    // Live drawing front: the thread extends to ~70% across the user's visible viewport
    const activeFront = Math.min(
      TOTAL_TIMELINE_WIDTH,
      Math.max(620, scrollLeft + Math.min(clientWidth * 0.75, 780))
    );
    setDrawnFrontX(activeFront);

    // Trigger each milestone when the thread line reaches its X position!
    const allMilestones = [
      ...TIMELINE_DATA.femaleMilestones,
      ...TIMELINE_DATA.maleMilestones,
      ...TIMELINE_DATA.coupleMilestones
    ];

    allMilestones.forEach((m) => {
      if (activeFront >= m.x) {
        setReachedMilestones((prev) => {
          if (!prev.has(m.id)) {
            const next = new Set(prev);
            next.add(m.id);
            return next;
          }
          return prev;
        });
      }
    });

    // Convergence milestone sound when line reaches the Sacred Knot
    if (activeFront >= TIMELINE_DATA.convergencePoint.x && !hasPlayedConvergenceSfx) {
      setHasPlayedConvergenceSfx(true);
      sounds.playHeartbeat();
      sounds.playRomanticChime();
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Convert vertical mousewheel to smooth horizontal scroll
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.35;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', handleScroll);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', handleScroll);
    };
  }, [hasPlayedConvergenceSfx]);

  // Auto-Tour Smooth Scroll
  useEffect(() => {
    let animId;
    if (isAutoPlaying) {
      const step = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 5) {
          setIsAutoPlaying(false);
          return;
        }
        scrollRef.current.scrollLeft += 2.4;
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAutoPlaying]);

  // Smoothly decay aerodynamic wind swing angle to 0 when scrolling pauses
  useEffect(() => {
    if (scrollWindAngle === 0) return;
    const decayTimer = setTimeout(() => {
      setScrollWindAngle((prev) => (Math.abs(prev) < 0.35 ? 0 : prev * 0.72));
    }, 45);
    return () => clearTimeout(decayTimer);
  }, [scrollWindAngle]);

  // 3D Mouse Parallax Tracking & Spotlight across viewport
  const handleWrapperMouseMove = (e) => {
    const px = (e.clientX / window.innerWidth - 0.5) * 20;
    const py = (e.clientY / window.innerHeight - 0.5) * 14;
    setMouseParallax({ x: px, y: py });
    setSpotlightPos({ x: e.clientX, y: e.clientY });
  };

  // 🌟 Interactive Sky Click: Send a 3D Shooting Star Wish to the Moon
  const handleSkyClick = (e) => {
    if (e.target.closest('button, .hanging-polaroid-wrapper, .portal-card, .fixed-celestial-moon, .memory-modal-card-3d')) {
      return;
    }
    const rect = scrollRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left + (scrollRef.current?.scrollLeft || 0);
    const clickY = e.clientY - rect.top;

    sounds.playRomanticChime();
    const wishId = Date.now();
    setShootingWishes((prev) => [
      ...prev.slice(-3),
      { id: wishId, x: clickX, y: clickY }
    ]);

    setTimeout(() => {
      setShootingWishes((prev) => prev.filter((w) => w.id !== wishId));
    }, 1800);
  };

  const toggleAutoPlay = () => {
    sounds.playTap();
    setIsAutoPlaying((prev) => !prev);
  };

  const scrollByAmount = (amt) => {
    sounds.playTap();
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  // 🎵 Pluck Musical String Vibration on Life Threads
  const handlePluckThread = (type) => {
    sounds.playRomanticChime();
    setPluckedThread(type);
    setTimeout(() => setPluckedThread(null), 700);
  };

  // SVG Paths & Dynamic Stroke Calculations
  // Female thread (starts top-left at (20, 28), stays high (y=28-38), curves into (1940, 164))
  const femalePath = "M 20 28 C 500 28, 980 28, 1460 38 C 1660 48, 1840 130, 1940 164";
  // Male thread (starts bottom-left at (20, 300), stays low (y=300-290), curves into (1940, 164))
  const malePath = "M 20 300 C 500 300, 980 300, 1460 290 C 1660 280, 1840 198, 1940 164";
  // Combined couple thread (from (1940, 164) to (4750, 164))
  const couplePath = "M 1940 164 C 2420 164, 2900 164, 3380 164 C 3750 164, 4150 164, 4750 164";

  // Approximate stroke lengths
  const individualPathLength = 2050;
  const couplePathLength = 2850;

  // Exact progressive reveal:
  // Individual paths draw from x=20 to x=1940
  const individualProgress = Math.min(1, Math.max(0, (drawnFrontX - 20) / 1920));
  const individualOffset = individualPathLength * (1 - individualProgress);

  // Couple path draws from x=1940 to x=4550
  const coupleProgress = Math.min(1, Math.max(0, (drawnFrontX - 1940) / 2610));
  const coupleOffset = couplePathLength * (1 - coupleProgress);

  // 🌟 Rich Sparkling Starfield: 140 twinkling background stars across 4600px
  const stars = useRef(
    Array.from({ length: 140 }, (_, i) => {
      const x = Math.round(((i * 32.8 + (i * 19) % 55) % 4520) + 35);
      const y = Math.round(((i * 23 + (i * 31) % 65) % 360) + 15);
      const size = i % 5 === 0 ? 3.2 : i % 3 === 0 ? 2.4 : 1.6;
      const opacity = 0.45 + ((i * 7) % 6) * 0.1;
      const duration = 1.3 + ((i * 3) % 5) * 0.4;
      const delay = ((i * 5) % 9) * 0.3;
      const color =
        i % 4 === 0
          ? '#ffd700'
          : i % 7 === 0
          ? '#38bdf8'
          : i % 5 === 0
          ? '#f472b6'
          : '#ffffff';
      return { id: i, x, y, size, opacity, duration, delay, color };
    })
  ).current;

  // ✦ Diamond Cross-Glint Sparkle Stars (Big Sparkling Flares across 4600px)
  const diamondStars = useRef(
    Array.from({ length: 42 }, (_, i) => {
      const x = Math.round(((i * 110 + 43) % 4520) + 25);
      const y = Math.round(((i * 47 + 19) % 340) + 20);
      const size = i % 3 === 0 ? 16 : 13;
      const delay = ((i * 7) % 8) * 0.35;
      const duration = 1.8 + ((i * 3) % 4) * 0.5;
      const color = i % 3 === 0 ? '#ffd700' : i % 4 === 0 ? '#67e8f9' : '#ffffff';
      return { id: `ds-${i}`, x, y, size, delay, duration, color };
    })
  ).current;

  return (
    <div className="two-threads-stage-wrapper night-sky-theme" onMouseMove={handleWrapperMouseMove}>
      {/* Top Floating Control Ribbon - Compact Night Glassmorphism */}
      <header className="timeline-header-ribbon night-header compact-header">
        <div className="header-text-group">
          <span className="destiny-tag night-destiny-tag">
            <Heart size={13} fill="#ffd700" color="#ffd700" /> THE RED THREAD OF DESTINY 🕊️
          </span>
          <h2 className="timeline-title night-timeline-title">Do Dhaage, Ek Kahaani ✨</h2>
          <p className="timeline-subtitle night-timeline-subtitle">
            Scroll left to right under the moonlit sky: Watch birds land on the threads of life and reveal Didi & Jiju's memories! 💕
          </p>
        </div>

        <div className="header-actions">
          <button
            className={`timeline-action-btn night-action-btn ${isAutoPlaying ? 'active' : ''}`}
            onClick={toggleAutoPlay}
            title={isAutoPlaying ? "Pause Auto-Tour" : "Start Auto-Tour"}
          >
            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isAutoPlaying ? "Pause" : "Auto-Tour ✨"}</span>
          </button>

          <div className="nav-buttons-group">
            <button className="nav-arrow-btn night-nav-btn" onClick={() => scrollByAmount(-480)} title="Scroll Left">
              <ChevronLeft size={16} />
            </button>
            <button className="nav-arrow-btn night-nav-btn" onClick={() => scrollByAmount(480)} title="Scroll Right">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Live Progress Bar with Heart Pulse */}
        <div className="timeline-progress-track night-progress-track">
          <div
            className="progress-fill night-progress-fill"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
          <span
            className="progress-heart-glow"
            style={{ left: `${Math.round(scrollProgress * 100)}%` }}
          >
            ✨
          </span>
        </div>
      </header>

      {/* =========================================================
          🌙 PINNED / FIXED MOON WITH COUPLE (STAYS IN PLACE AT ALL TIMES!)
          ========================================================= */}
      <div className="fixed-celestial-moon">
        <div className="moon-aurora-glow" />
        <div className="moon-halo-outer" />
        <div className="moon-halo-inner" />
        
        <svg className="moon-phase-svg" width="88" height="88" viewBox="0 0 100 100">
          <defs>
            {/* Moon Surface Golden-Silver Gradient */}
            <linearGradient id="moonLitSurface" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffef0" />
              <stop offset="35%" stopColor="#fef3c7" />
              <stop offset="80%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Moon Night Shadow Color */}
            <linearGradient id="moonDarkShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#080b1e" />
              <stop offset="100%" stopColor="#151a36" />
            </linearGradient>

            <filter id="moonGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Full Moon Base (Dark side in shadow) */}
          <circle cx="50" cy="50" r="44" fill="url(#moonDarkShadow)" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="0.8" />

          {/* Waxing Gibbous Illuminated Region (~68% Illumination: curved terminator on left, full right edge) */}
          <path
            d="M 50 6 A 44 44 0 0 1 50 94 C 28 80, 28 20, 50 6 Z"
            fill="url(#moonLitSurface)"
            filter="url(#moonGlowFilter)"
          />

          {/* Craters & Lunar Maria Textures */}
          <circle cx="62" cy="36" r="4.2" fill="rgba(180, 83, 9, 0.16)" />
          <circle cx="74" cy="50" r="5.5" fill="rgba(180, 83, 9, 0.13)" />
          <circle cx="58" cy="65" r="3.8" fill="rgba(180, 83, 9, 0.14)" />
          <circle cx="80" cy="38" r="2.8" fill="rgba(180, 83, 9, 0.18)" />

          {/* ========================================================
              💑 TWO COUPLE (DIDI & JIJU) SITTING ON THE MOON
              ======================================================== */}
          <g className="moon-sitting-couple">
            {/* Delicate Golden String with Hanging Star Lantern from Moon Tip */}
            <line x1="50" y1="6" x2="44" y2="27" stroke="#ffd700" strokeWidth="0.8" strokeDasharray="1.2 1.2" />
            <polygon points="44,27 46,31 50,32 47,35 48,39 44,36 40,39 41,35 38,32 42,31" fill="#ffd700" filter="url(#moonGlowFilter)" />

            {/* Pulsing Love Heart floating above the couple */}
            <text x="65" y="44" fontSize="8" fill="#ff3377" textAnchor="middle" className="moon-couple-heart">💖</text>

            {/* Couple Silhouettes with Golden Rim Outline */}
            <g fill="#0b0e26" stroke="#ffd700" strokeWidth="0.65">
              {/* Jiju (Boy) - Sitting right, arm lovingly around Didi */}
              <circle cx="70" cy="52" r="4.6" />
              <path d="M 66 50 Q 70 46 74 49 Q 75 52 73 53 Z" fill="#0b0e26" />
              <path d="M 66 56 C 69 56, 75 58, 75 67 C 75 72, 70 73, 66 73 Z" />
              <path d="M 68 59 Q 62 60 58 63" strokeWidth="1.8" strokeLinecap="round" stroke="#0b0e26" fill="none" />
              <path d="M 72 73 L 73 84 L 76 86" strokeWidth="2.2" strokeLinecap="round" stroke="#0b0e26" fill="none" />
              <path d="M 69.5 73 L 70 82 L 73 84" strokeWidth="2.2" strokeLinecap="round" stroke="#0b0e26" fill="none" />
              <ellipse cx="76.5" cy="86" rx="2" ry="1.2" fill="#ffd700" stroke="none" />
              <ellipse cx="73.5" cy="84" rx="1.8" ry="1" fill="#ffd700" stroke="none" />

              {/* Didi (Girl) - Sitting left, resting head affectionately on Jiju's shoulder */}
              <circle cx="61.5" cy="54" r="4.2" />
              <path d="M 58 52 Q 53 54 50 61 Q 54 62 58 57 Z" fill="#0b0e26" />
              <path d="M 58 58 Q 63 58 65 66 L 55 73 Q 57 65 58 58 Z" />
              <path d="M 59 73 L 60 82 L 63 84" strokeWidth="2" strokeLinecap="round" stroke="#0b0e26" fill="none" />
              <path d="M 56.5 73 L 57 80 L 60 82" strokeWidth="2" strokeLinecap="round" stroke="#0b0e26" fill="none" />
              <ellipse cx="63.5" cy="84.5" rx="1.8" ry="1" fill="#ff77aa" stroke="none" />
              <ellipse cx="60.5" cy="82.5" rx="1.6" ry="0.9" fill="#ff77aa" stroke="none" />
            </g>
          </g>
        </svg>

        {/* Romantic Moonlight Ray Cones */}
        <div className="moonlight-soft-beam" />

        {/* Moon Badge with Couple Dedication */}
        <div className="moon-badge-label">
          <span>🌙 Didi & Jiju on the Moon 💕</span>
        </div>
      </div>

      {/* Main Horizontal Scrollable Canvas */}
      <div
        className="timeline-scroll-viewport night-viewport"
        ref={scrollRef}
        onClick={handleSkyClick}
        title="Click on the sky to send a shooting star wish to the Moon! ✨"
      >
        <div className="timeline-world" style={{ width: `${TOTAL_TIMELINE_WIDTH}px` }}>

          {/* =========================================================
              ROMANTIC NIGHT SKY BACKGROUND (Sparkling Stars & Nebulae)
              Layered with 3D Mouse Parallax + Drifting Flower Petals
              ========================================================= */}
          <div
            className="night-sky-background-layer"
            style={{
              transform: `translate3d(${mouseParallax.x * 0.6}px, ${mouseParallax.y * 0.6}px, 0)`
            }}
          >
            {/* Deep Cosmic Nebulae */}
            <div className="cosmic-nebula nebula-1" />
            <div className="cosmic-nebula nebula-2" />
            <div className="cosmic-nebula nebula-3" />

            {/* 🌟 Starlight Lantern Spotlight Cursor in Night Sky */}
            <div
              className="sky-starlight-spotlight"
              style={{
                left: `${spotlightPos.x + scrollX - 160}px`,
                top: `${spotlightPos.y - 160}px`
              }}
            />

            {/* Background Twinkling Stars */}
            {stars.map((s) => (
              <span
                key={s.id}
                className="twinkling-night-star"
                style={{
                  left: `${s.x}px`,
                  top: `${s.y}px`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  backgroundColor: s.color,
                  boxShadow: `0 0 ${s.size * 2.5}px ${s.color}, 0 0 ${s.size * 5}px rgba(255,255,255,0.45)`,
                  opacity: s.opacity,
                  animationDuration: `${s.duration}s`,
                  animationDelay: `${s.delay}s`
                }}
              />
            ))}

            {/* ✦ Dazzling Diamond Cross-Glint Sparkle Stars ✦ */}
            {diamondStars.map((ds) => (
              <div
                key={ds.id}
                className="diamond-sparkle-star"
                style={{
                  left: `${ds.x}px`,
                  top: `${ds.y}px`,
                  width: `${ds.size}px`,
                  height: `${ds.size}px`,
                  animationDelay: `${ds.delay}s`,
                  animationDuration: `${ds.duration}s`
                }}
              >
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
                  <path
                    d="M 12 0 Q 12 12 24 12 Q 12 12 12 24 Q 12 12 0 12 Q 12 12 12 0 Z"
                    fill={ds.color}
                  />
                  <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
                </svg>
              </div>
            ))}

            {/* Periodic Shooting Stars (Meteors) */}
            <div className="shooting-meteor meteor-1" style={{ left: 520, top: 35 }} />
            <div className="shooting-meteor meteor-2" style={{ left: 2150, top: 25 }} />
            <div className="shooting-meteor meteor-3" style={{ left: 3300, top: 40 }} />

            {/* 🌠 User-Triggered Interactive Sky Wishes */}
            {shootingWishes.map((w) => (
              <div
                key={w.id}
                className="interactive-shooting-wish"
                style={{ left: w.x, top: w.y }}
              >
                <div className="wish-meteor-head" />
                <div className="wish-meteor-tail" />
                <div className="wish-floating-bubble">
                  ✨ Wish sent to the Moon! 💖
                </div>
              </div>
            ))}

            {/* 🌸 Drifting 3D Cherry Blossom & Rose Petals across the Cosmos */}
            <div className="drifting-petals-layer">
              {[
                { id: 'p1', x: 380, y: 70, delay: 0, dur: 7.5, emoji: '🌸' },
                { id: 'p2', x: 1080, y: 190, delay: 1.8, dur: 9, emoji: '🌺' },
                { id: 'p3', x: 1680, y: 65, delay: 3.2, dur: 7, emoji: '🌸' },
                { id: 'p4', x: 2320, y: 220, delay: 0.9, dur: 8.8, emoji: '🌹' },
                { id: 'p5', x: 3050, y: 60, delay: 2.5, dur: 8.2, emoji: '🌸' },
                { id: 'p6', x: 3720, y: 235, delay: 4.1, dur: 8.6, emoji: '🌺' }
              ].map((p) => (
                <span
                  key={p.id}
                  className="drifting-3d-petal"
                  style={{
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.dur}s`
                  }}
                >
                  {p.emoji}
                </span>
              ))}
            </div>
          </div>

          {/* SVG Thread Canvas */}
          <svg
            className="threads-svg-canvas"
            width={TOTAL_TIMELINE_WIDTH}
            height="380"
            viewBox={`0 0 ${TOTAL_TIMELINE_WIDTH} 380`}
          >
            <defs>
              {/* Pink Didi Thread Glow */}
              <linearGradient id="pinkSilkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff77aa" />
                <stop offset="60%" stopColor="#ff3377" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>

              {/* Blue Jiju Thread Glow */}
              <linearGradient id="blueSilkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>

              {/* Combined Golden Eternal Ribbon */}
              <linearGradient id="coupleRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fff9c4" />
                <stop offset="15%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ff3377" />
                <stop offset="85%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fff9c4" />
              </linearGradient>

              {/* Radiant Highlight Aura for the Combined Ribbon */}
              <linearGradient id="highlightAuraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="30%" stopColor="#ff3377" />
                <stop offset="70%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              <filter id="threadGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Intense Dazzling Highlight Glow for Combined Thread */}
              <filter id="intenseHighlightGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="blurWide" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blurCore" />
                <feMerge>
                  <feMergeNode in="blurWide" />
                  <feMergeNode in="blurCore" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Didi's Path Guide (Dotted background) */}
            <path
              d={femalePath}
              fill="none"
              stroke="rgba(255, 182, 193, 0.28)"
              strokeWidth="5"
              strokeDasharray="6 6"
            />
            {/* Didi's Active Glowing Drawn Silk Thread */}
            <path
              d={femalePath}
              className={`interactive-life-thread ${pluckedThread === 'female' ? 'plucked-string-vibrate' : ''}`}
              fill="none"
              stroke="url(#pinkSilkGrad)"
              strokeWidth="4"
              filter="url(#threadGlow)"
              strokeDasharray={individualPathLength}
              strokeDashoffset={individualOffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out', cursor: 'pointer' }}
              onMouseEnter={() => handlePluckThread('female')}
              onClick={() => handlePluckThread('female')}
            />

            {/* Jiju's Path Guide (Dotted background) */}
            <path
              d={malePath}
              fill="none"
              stroke="rgba(186, 230, 253, 0.28)"
              strokeWidth="5"
              strokeDasharray="6 6"
            />
            {/* Jiju's Active Glowing Drawn Silk Thread */}
            <path
              d={malePath}
              className={`interactive-life-thread ${pluckedThread === 'male' ? 'plucked-string-vibrate' : ''}`}
              fill="none"
              stroke="url(#blueSilkGrad)"
              strokeWidth="4"
              filter="url(#threadGlow)"
              strokeDasharray={individualPathLength}
              strokeDashoffset={individualOffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out', cursor: 'pointer' }}
              onMouseEnter={() => handlePluckThread('male')}
              onClick={() => handlePluckThread('male')}
            />

            {/* Combined Couple Ribbon Guide (Dotted background) */}
            <path
              d={couplePath}
              fill="none"
              stroke="rgba(254, 240, 138, 0.32)"
              strokeWidth="6"
              strokeDasharray="8 8"
            />

            {/* =========================================================
                ✨ HIGHLIGHTED COMBINED THREAD (AFTER THE COMMON POINT)
                Dynamic, brilliant, multi-layer glowing ribbon that illuminates
                as the user scrolls from left to right!
                ========================================================= */}
            {/* Layer 1: Wide Golden-Rose Radiant Aurora Glow */}
            <path
              d={couplePath}
              fill="none"
              stroke="url(#highlightAuraGrad)"
              strokeWidth="18"
              opacity="0.45"
              filter="url(#intenseHighlightGlow)"
              strokeDasharray={couplePathLength}
              strokeDashoffset={coupleOffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
            />

            {/* Layer 2: Radiant Vibrant Silk Highlight Ribbon */}
            <path
              d={couplePath}
              fill="none"
              stroke="url(#coupleRibbonGrad)"
              strokeWidth="7"
              filter="url(#intenseHighlightGlow)"
              strokeDasharray={couplePathLength}
              strokeDashoffset={coupleOffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
            />

            {/* Layer 3: Blazing White Starlight Laser Core */}
            <path
              d={couplePath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              opacity="0.95"
              strokeDasharray={couplePathLength}
              strokeDashoffset={coupleOffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
            />

            {/* =========================================================
                🔥 LEADING STARLIGHT TORCH / SUNBURST AT THE DRAWING FRONT
                Visibly paints the highlight onto the couple thread from left to right!
                ========================================================= */}
            {drawnFrontX >= 1940 && (
              <g transform={`translate(${Math.min(drawnFrontX, 4040)}, 164)`}>
                {/* Pulsing Starlight Corona */}
                <circle r="22" fill="rgba(255, 215, 0, 0.45)" filter="url(#intenseHighlightGlow)" />
                <circle r="12" fill="rgba(255, 51, 119, 0.7)" filter="url(#intenseHighlightGlow)" />
                <circle r="5.5" fill="#ffffff" />
                {/* 4-point Diamond Sparkle Star */}
                <path
                  d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"
                  fill="#ffd700"
                  filter="url(#intenseHighlightGlow)"
                />
                <circle r="2.5" fill="#ffffff" />
              </g>
            )}

            {/* =========================================================
                CONTINUOUSLY MOVING GLOWING LIGHT STREAMS ALONG THREADS
                ========================================================= */}
            {/* Glowing Light 1: Flowing on Didi's Path */}
            <g filter="url(#threadGlow)">
              <circle r="4.5" fill="#ffffff">
                <animateMotion path={femalePath} dur="4.2s" repeatCount="indefinite" />
              </circle>
              <circle r="12" fill="rgba(255, 105, 180, 0.5)">
                <animateMotion path={femalePath} dur="4.2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Glowing Light 2: Flowing on Jiju's Path */}
            <g filter="url(#threadGlow)">
              <circle r="4.5" fill="#ffffff">
                <animateMotion path={malePath} dur="4.2s" repeatCount="indefinite" />
              </circle>
              <circle r="12" fill="rgba(14, 165, 233, 0.5)">
                <animateMotion path={malePath} dur="4.2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Glowing Lights on Combined Couple Path (CONTINUOUSLY MOVING AFTER COMBINING!) */}
            <g filter="url(#intenseHighlightGlow)">
              {/* Golden Starlight Comet 1 */}
              <circle r="6" fill="#ffffff">
                <animateMotion path={couplePath} dur="4.2s" repeatCount="indefinite" />
              </circle>
              <circle r="16" fill="rgba(255, 215, 0, 0.75)">
                <animateMotion path={couplePath} dur="4.2s" repeatCount="indefinite" />
              </circle>
              <circle r="26" fill="rgba(255, 215, 0, 0.3)">
                <animateMotion path={couplePath} dur="4.2s" repeatCount="indefinite" />
              </circle>
            </g>

            <g filter="url(#intenseHighlightGlow)">
              {/* Rose-Gold Starlight Comet 2 (Staggered by 2.1s) */}
              <circle r="5.5" fill="#ffffff">
                <animateMotion path={couplePath} dur="4.2s" begin="2.1s" repeatCount="indefinite" />
              </circle>
              <circle r="15" fill="rgba(255, 51, 119, 0.7)">
                <animateMotion path={couplePath} dur="4.2s" begin="2.1s" repeatCount="indefinite" />
              </circle>
            </g>

            <g filter="url(#intenseHighlightGlow)">
              {/* Shimmering Sunburst Starlight Spark 3 (Staggered by 1.05s) */}
              <circle r="4" fill="#ffffff">
                <animateMotion path={couplePath} dur="4.2s" begin="1.05s" repeatCount="indefinite" />
              </circle>
              <circle r="10" fill="rgba(254, 240, 138, 0.8)">
                <animateMotion path={couplePath} dur="4.2s" begin="1.05s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>

          {/* Thread Origin Labels on Left */}
          <div className="thread-origin-label label-female" style={{ left: 24, top: 14 }}>
            <span className="origin-icon">👩‍🦰</span>
            <strong>Didi's Path of Life</strong>
          </div>
          <div className="thread-origin-label label-male" style={{ left: 24, top: 284 }}>
            <span className="origin-icon">👨‍💼</span>
            <strong>Jiju's Path of Life</strong>
          </div>

          {/* =========================================================
              🏮 3D FLOATING KEEPSAKE CHARMS SUSPENDED ON THREADS
              ========================================================= */}
          {/* 🕊️ Miniature 3D Golden Origami Crane perched on Didi's Thread */}
          <div className="thread-keepsake-charm charm-origami-crane" style={{ left: 1200, top: 30 }}>
            <div className="crane-paper-body">
              <span className="crane-wing wing-left">▲</span>
              <span className="crane-core">🕊️</span>
              <span className="crane-wing wing-right">▲</span>
            </div>
            <div className="charm-twine-pin" />
          </div>

          {/* 🍾 Miniature 3D Love Message-in-a-Bottle on Couple Ribbon */}
          <div className="thread-keepsake-charm charm-message-bottle" style={{ left: 2660, top: 164 }}>
            <div className="bottle-glass-3d">
              <div className="bottle-cork" />
              <span className="bottle-scroll">📜</span>
              <div className="bottle-glow" />
            </div>
            <div className="charm-hanging-string" />
          </div>

          {/* Didi's Milestones (Female Photos with 3D Wind Sway) */}
          {TIMELINE_DATA.femaleMilestones.map((m) => (
            <AnimatedTimelineBird
              key={m.id}
              milestone={m}
              isReached={reachedMilestones.has(m.id)}
              onPhotoClick={(item) => {
                sounds.playTap();
                setIsModalFlipped(false);
                setActiveMemory(item);
              }}
              threadType="female"
              scrollWindAngle={scrollWindAngle}
            />
          ))}

          {/* Jiju's Milestones (Male Photos with 3D Wind Sway) */}
          {TIMELINE_DATA.maleMilestones.map((m) => (
            <AnimatedTimelineBird
              key={m.id}
              milestone={m}
              isReached={reachedMilestones.has(m.id)}
              onPhotoClick={(item) => {
                sounds.playTap();
                setIsModalFlipped(false);
                setActiveMemory(item);
              }}
              threadType="male"
              scrollWindAngle={scrollWindAngle}
            />
          ))}

          {/* The Sacred Convergence Point (Wedding / Knot with 3D Vortex) */}
          <div
            className="convergence-knot-node"
            style={{
              position: 'absolute',
              left: TIMELINE_DATA.convergencePoint.x,
              top: TIMELINE_DATA.convergencePoint.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 90
            }}
          >
            <motion.div
              className="sacred-knot-emblem"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={
                reachedMilestones.has('f3') || reachedMilestones.has('m3')
                  ? { scale: [1, 1.08, 1], opacity: 1 }
                  : { scale: 0.8, opacity: 0.5 }
              }
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            >
              {/* 💍 3D Tumbling Sacred Rings + Orbiting Starlight Vortex + 3D Constellation */}
              <div className="knot-golden-rings rings-3d-vortex">
                <div className="ring-torus ring-1" />
                <div className="ring-torus ring-2" />
                <span className="ring-center-infinity">♾️</span>
                {/* 3D Celestial Constellation "D & J" */}
                <div className="constellation-dj-revolving">
                  <span className="constellation-node node-d">D</span>
                  <span className="constellation-line">✦</span>
                  <span className="constellation-node node-j">J</span>
                </div>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={`vortex-${i}`}
                    className="vortex-orbit-spark"
                    style={{
                      animationDelay: `${i * 0.45}s`,
                      transform: `rotate(${i * 60}deg) translateX(30px)`
                    }}
                  />
                ))}
              </div>
              <div className="knot-halo-glow" />

              <div className="knot-milestone-card">
                <span className="knot-badge">{TIMELINE_DATA.convergencePoint.tag}</span>
                <h3 className="knot-title">{TIMELINE_DATA.convergencePoint.title}</h3>
                <p className="knot-poetry">"{TIMELINE_DATA.convergencePoint.poetry}"</p>
                <span className="knot-date">{TIMELINE_DATA.convergencePoint.date}</span>
              </div>
            </motion.div>
          </div>

          {/* Couple's Milestones (Combined Photos with 3D Wind Sway) */}
          {TIMELINE_DATA.coupleMilestones.map((m) => (
            <AnimatedTimelineBird
              key={m.id}
              milestone={m}
              isReached={reachedMilestones.has(m.id)}
              onPhotoClick={(item) => {
                sounds.playTap();
                setIsModalFlipped(false);
                setActiveMemory(item);
              }}
              threadType="couple"
              scrollWindAngle={scrollWindAngle}
            />
          ))}

          {/* Grand Celebration Portal at Timeline End (THE ULTIMATE CLIMAX!) */}
          <div
            className="timeline-portal-gateway"
            style={{
              position: 'absolute',
              left: 4100,
              top: 320,
              transform: 'translateY(-50%)',
              zIndex: 100
            }}
          >
            <motion.div
              className="portal-card grand-climax-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={
                reachedMilestones.has('c4')
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.92, opacity: 0.6 }
              }
              style={{
                background: 'linear-gradient(145deg, rgba(16, 24, 52, 0.96), rgba(35, 20, 60, 0.96))',
                border: '2.5px solid #f59e0b',
                borderRadius: '24px',
                padding: '24px 22px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.4)',
                width: '340px',
                boxSizing: 'border-box',
                backdropFilter: 'blur(16px)'
              }}
            >
              <div className="portal-icon-blast" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Trophy size={28} color="#f59e0b" />
                <PartyPopper size={26} color="#ec4899" />
              </div>
              <span
                className="portal-badge"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #fef08a, #f59e0b)',
                  color: '#78350f',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '5px 14px',
                  borderRadius: '14px',
                  letterSpacing: '0.6px',
                  border: '1px solid #fef08a',
                  marginBottom: '10px'
                }}
              >
                STAGE COMPLETED! 🥂🎂
              </span>
              <h3
                className="portal-heading"
                style={{
                  color: '#ffffff',
                  fontSize: '1.24rem',
                  fontWeight: 900,
                  margin: '6px 0 10px 0',
                  lineHeight: 1.3,
                  textShadow: '0 0 16px rgba(255, 215, 0, 0.45)'
                }}
              >
                Heartfelt Sibling Letter Awaits 💌
              </h3>
              <p
                className="portal-desc"
                style={{
                  color: '#f1f5f9',
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  fontWeight: 500,
                  marginBottom: '18px'
                }}
              >
                Didi & Jiju: Both life threads have united into an eternal knot! Now, an emotional letter written straight from a sibling's heart awaits... 💕
              </p>
              <div className="portal-action-buttons-stack" style={{ width: '100%' }}>
                <button
                  className="portal-proceed-btn fireworks-launch-btn"
                  onClick={() => {
                    sounds.playRomanticChime();
                    if (onOpenLetter) onOpenLetter();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                    color: '#ffffff',
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    padding: '12px 22px',
                    borderRadius: '28px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    boxShadow: '0 8px 24px rgba(244, 63, 94, 0.45)'
                  }}
                >
                  <span>Open Sibling's Letter 💌➔</span>
                  <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* =========================================================
          📸 3D TACTILE FLIP POLAROID LIGHTBOX MODAL
          Click photo or button to flip 180° in 3D & read secret note!
          ========================================================= */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="memory-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setActiveMemory(null);
              setIsModalFlipped(false);
            }}
          >
            <motion.div
              className={`memory-modal-card-3d ${isModalFlipped ? 'flipped' : ''}`}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="memory-close-btn"
                onClick={() => {
                  setActiveMemory(null);
                  setIsModalFlipped(false);
                }}
              >
                <X size={20} />
              </button>

              {/* 3D Flipper Box */}
              <div className="polaroid-flipper-container">
                {/* FRONT FACE (The Polaroid Image + Story) */}
                <div className="flipper-face face-front">
                  <div className="memory-modal-content">
                    <div
                      className="memory-image-frame"
                      onClick={() => {
                        sounds.playTap();
                        setIsModalFlipped(true);
                      }}
                      title="Click photo to flip & read secret note! 💌"
                    >
                      <img
                        src={activeMemory.image}
                        alt={activeMemory.title}
                        className="lightbox-full-img"
                        onError={(e) => {
                          if (activeMemory.fallbackSvg) {
                            e.target.src = activeMemory.fallbackSvg;
                          }
                        }}
                      />
                      <span className="lightbox-tag-pill">{activeMemory.tag}</span>
                      <div className="flip-instruction-pill">
                        🔄 Click Photo to Flip to Back! 💌
                      </div>
                    </div>

                    <div className="memory-details">
                      <h3 className="lightbox-title">{activeMemory.title}</h3>
                      <p className="lightbox-desc">{activeMemory.desc}</p>

                      <div className="flip-card-action-bar">
                        <button
                          className="flip-to-back-btn"
                          onClick={() => {
                            sounds.playTap();
                            setIsModalFlipped(true);
                          }}
                        >
                          <span>💌 Read Secret Note on Back</span>
                          <span className="flip-arrow">➔</span>
                        </button>
                      </div>

                      <div className="lightbox-footer">
                        <span className="memory-signature">1st Anniversary Special Archive • Didi & Jiju 💖</span>
                        <button
                          className="done-reading-btn"
                          onClick={() => {
                            setActiveMemory(null);
                            setIsModalFlipped(false);
                          }}
                        >
                          Close Memory 🌸
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK FACE (Vintage Polaroid Backing with Handwritten Note) */}
                <div
                  className="flipper-face face-back"
                  onClick={() => {
                    sounds.playTap();
                    setIsModalFlipped(false);
                  }}
                >
                  <div className="vintage-polaroid-back">
                    <div className="vintage-tape-corner top-left" />
                    <div className="vintage-tape-corner top-right" />

                    <div className="polaroid-back-header">
                      <div className="red-confidential-stamp">
                        TOP SECRET SIBLING MEMO 🕵️‍♂️
                      </div>
                      <div className="polaroid-vintage-stamp">
                        <span>POST 💌</span>
                        <small>FEB 2025</small>
                      </div>
                    </div>

                    <div className="handwritten-note-area">
                      <p className="handwritten-title">"{activeMemory.title}"</p>
                      <p className="handwritten-body">{activeMemory.note}</p>
                      <div className="handwritten-signature">
                        — Aapka Pyaara / Pyaari Sibling 💕
                      </div>
                    </div>

                    <div className="polaroid-back-footer">
                      <div className="faux-barcode">
                        <div className="barcode-lines" />
                        <span>MEM-2025-DJ-01</span>
                      </div>
                      <button
                        className="flip-back-to-front-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          setIsModalFlipped(false);
                        }}
                      >
                        <span>🔄 Flip to Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          🏆 GRAND CLIMAX CELEBRATION MODAL (THE FINAL ANNIVERSARY BLISS!)
          ========================================================= */}
      <AnimatePresence>
        {showGrandFinaleBanner && (
          <motion.div
            className="grand-finale-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGrandFinaleBanner(false)}
          >
            <motion.div
              className="grand-finale-card-3d"
              initial={{ scale: 0.75, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.75, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="finale-trophy-halo">
                <span className="trophy-giant-emoji">🏆</span>
                <span className="sparkle-orbit-1">✨</span>
                <span className="sparkle-orbit-2">💖</span>
              </div>

              <span className="finale-super-badge">OFFICIAL 1ST ANNIVERSARY TROPHY 🥂</span>
              <h2 className="finale-grand-title">Happy 1st Anniversary Didi & Jiju! ❤️✨</h2>
              <h4 className="finale-subtitle">"Do Dhaage, Ek Kahaani • Hamesha Ke Liye"</h4>

              <p className="finale-speech">
                Successfully survived 365 days of TV remote wars, silly sibling pranks, delicious treats, and unconditional love!
                May your bond remain as unbreakable as the golden thread! 🥂🎂💍
              </p>

              <div className="finale-action-group">
                <button
                  className="more-fireworks-btn"
                  onClick={() => {
                    sounds.playSuccess();
                    sounds.playRomanticChime();
                    confetti({ particleCount: 160, spread: 100, origin: { y: 0.55 } });
                  }}
                >
                  <Sparkles size={18} />
                  <span>Launch More Fireworks! 🎆</span>
                </button>

                <button
                  className="replay-from-top-btn"
                  onClick={() => {
                    sounds.playTap();
                    setShowGrandFinaleBanner(false);
                    onRestartExperience();
                  }}
                >
                  <span>Replay Sibling Journey 🔄</span>
                </button>

                <button
                  className="close-finale-btn"
                  onClick={() => setShowGrandFinaleBanner(false)}
                >
                  Done 🌸
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
