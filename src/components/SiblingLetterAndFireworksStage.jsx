import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Rocket, Mail, RotateCcw, PartyPopper, Eye, EyeOff, FastForward, Moon, Stars } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

// ─── Pastel Luxury Balloon Colors ───
const BALLOON_COLORS = [
  'radial-gradient(circle at 35% 35%, #ffb3c6, #ff3377)',
  'radial-gradient(circle at 35% 35%, #fed7aa, #f59e0b)',
  'radial-gradient(circle at 35% 35%, #e0e7ff, #6366f1)',
  'radial-gradient(circle at 35% 35%, #fce7f3, #ec4899)',
  'radial-gradient(circle at 35% 35%, #fef08a, #ffd700)',
  'radial-gradient(circle at 35% 35%, #ffffff, #cbd5e1)',
  'radial-gradient(circle at 35% 35%, #bae6fd, #0ea5e9)'
];

// 🕊️ 13 Bird Coordinates in a true Heart Formation (Offsets from flock center)
const HEART_BIRD_OFFSETS = [
  { id: 0, x: 0, y: -26, isLeader: true, delay: 0 },         // Top Center dip (Leader with letter)
  { id: 1, x: -28, y: -48, isLeader: false, delay: 0.05 },   // Left upper peak
  { id: 2, x: 28, y: -48, isLeader: false, delay: 0.05 },    // Right upper peak
  { id: 3, x: -56, y: -36, isLeader: false, delay: 0.1 },    // Left high shoulder
  { id: 4, x: 56, y: -36, isLeader: false, delay: 0.1 },     // Right high shoulder
  { id: 5, x: -74, y: -12, isLeader: false, delay: 0.15 },   // Left outer cheek
  { id: 6, x: 74, y: -12, isLeader: false, delay: 0.15 },    // Right outer cheek
  { id: 7, x: -64, y: 16, isLeader: false, delay: 0.2 },     // Left lower curve
  { id: 8, x: 64, y: 16, isLeader: false, delay: 0.2 },      // Right lower curve
  { id: 9, x: -44, y: 44, isLeader: false, delay: 0.25 },    // Left taper
  { id: 10, x: 44, y: 44, isLeader: false, delay: 0.25 },    // Right taper
  { id: 11, x: -20, y: 72, isLeader: false, delay: 0.3 },    // Left point slant
  { id: 12, x: 20, y: 72, isLeader: false, delay: 0.3 },     // Right point slant
  { id: 13, x: 0, y: 92, isLeader: false, delay: 0.35 }      // Bottom tip point
];

// 🎈 Sweet blessings that appear when balloons are popped!
const BALLOON_POP_BLESSINGS = [
  'Rab Ne Bana Di Jodi! 💖',
  'Best Couple in the Universe! ✨',
  '100 Years of Love & Laughs! 🥂',
  'Didi Ki Smile, Jiju Ka Style! 🌟',
  'Forever & Always Together! 💍',
  'Soulmates For Eternity! 💫',
  'Didi’s Hero & Jiju’s Queen! 👑',
  'May Your Love Grow Everyday! 💕',
  'Happy 1st Anniversary! 🎂',
  'Purest Love Story Ever! 🌸',
  'Infinite Joy & Hugs! 🕊️',
  '10 Gold Medals to Jiju! 🏆'
];

const SiblingLetterAndFireworksStage = forwardRef(function SiblingLetterAndFireworksStage({ onRestartExperience }, ref) {
  // Phases: 'birds' -> 'letter' -> 'celebration'
  const [phase, setPhase] = useState('birds');
  const [birdsVisible, setBirdsVisible] = useState(true);
  const [birdsDispersed, setBirdsDispersed] = useState(false);
  const [letterDropped, setLetterDropped] = useState(false);
  const [letterOpeningStep, setLetterOpeningStep] = useState('falling'); // 'falling' -> 'breaking-seal' -> 'unfolding' -> 'opened'
  const [showBeachOnly, setShowBeachOnly] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [rockets, setRockets] = useState([]);
  const [sparkBursts, setSparkBursts] = useState([]);
  const [poppedBalloons, setPoppedBalloons] = useState(new Set());
  const [popBlessings, setPopBlessings] = useState([]);
  const [oceanRipples, setOceanRipples] = useState([]);
  const [origamiLeaves, setOrigamiLeaves] = useState([]);

  const letterScrollRef = useRef(null);

  // Auto-scroll letter to top whenever opened so no header is cut off!
  useEffect(() => {
    if (phase === 'letter' && letterScrollRef.current) {
      letterScrollRef.current.scrollTop = 0;
    }
  }, [phase]);

  // Imperative back handler for seamless back button navigation
  useImperativeHandle(ref, () => ({
    handleBack: () => {
      if (phase === 'celebration') {
        setPhase('letter');
        return true;
      }
      if (showBeachOnly) {
        setShowBeachOnly(false);
        return true;
      }
      return false;
    }
  }), [phase, showBeachOnly]);

  // =========================================================
  // 1. SEQUENCE ORCHESTRATION: SUNSET BEACH -> BIRDS IN HEART FORMATION -> LETTER DROP
  // =========================================================
  useEffect(() => {
    sounds.playRomanticChime();

    // Birds in heart formation swoop across the sunset ocean -> drops letter at 3.0s
    const dropTimer = setTimeout(() => {
      setLetterDropped(true);
      setLetterOpeningStep('falling');
      sounds.playBirdChirp();
      sounds.playWhoosh();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { x: 0.5, y: 0.35 },
        colors: ['#ffd700', '#ff3377', '#fef08a']
      });
    }, 3000);

    // Birds fly gracefully across to the right horizon at 3.8s
    const disperseTimer = setTimeout(() => {
      setBirdsDispersed(true);
    }, 3800);

    // Birds disappear into distance at 4.6s
    const birdsGoneTimer = setTimeout(() => {
      setBirdsVisible(false);
    }, 4600);

    // Wax seal cracks open with sparkles at 4.8s
    const sealTimer = setTimeout(() => {
      setLetterOpeningStep('breaking-seal');
      sounds.playCrack();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#ffd700', '#dc2626']
      });
    }, 4800);

    // Envelope flap folds open & letter unfurls at 5.5s
    const unfoldTimer = setTimeout(() => {
      setLetterOpeningStep('unfolding');
      sounds.playHarpArpeggio();
    }, 5500);

    // Full readable parchment letter ready at 6.3s
    const openTimer = setTimeout(() => {
      setPhase('letter');
      setLetterOpeningStep('opened');
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#ffd700', '#ec4899', '#ffffff']
      });
    }, 6300);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(disperseTimer);
      clearTimeout(birdsGoneTimer);
      clearTimeout(sealTimer);
      clearTimeout(unfoldTimer);
      clearTimeout(openTimer);
    };
  }, []);

  const handleSkipToLetter = () => {
    setLetterDropped(true);
    setBirdsVisible(false);
    setLetterOpeningStep('opened');
    setPhase('letter');
    sounds.playHarpArpeggio();
  };

  // =========================================================
  // 2. CELEBRATION: SPARKS, MOONLIT SKY, BALLOONS (FLOAT UP ONLY)
  // =========================================================
  const spawnBalloonsBatch = useCallback(() => {
    // Generate 26 balloons that float UPWARDS ONLY at a relaxed, gentle pace (15s - 20s)
    const newBalloons = Array.from({ length: 26 }, (_, i) => ({
      id: `balloon-${Date.now()}-${i}-${Math.random()}`,
      left: `${(i * 3.7 + Math.random() * 2) % 94 + 3}%`,
      bg: BALLOON_COLORS[i % BALLOON_COLORS.length],
      size: Math.random() * 22 + 58, // 58px - 80px: clear, easy-to-tap hit target
      speed: Math.random() * 5 + 15, // 15s - 20s: gentle, peaceful float up
      delay: Math.random() * 2.2,
      sway: (Math.random() - 0.5) * 35,
      isHeart: i % 3 === 0
    }));
    setBalloons((prev) => [...prev, ...newBalloons]);
  }, []);

  const triggerSkyShootSequence = useCallback(() => {
    sounds.playRocketLaunch();

    // Rockets launching from Left, Right, and Bottom edges upwards
    const newRockets = [
      // Left side rockets shooting inward & up
      { id: Date.now() + 1, startX: '4%', startY: '95%', targetX: '26%', targetY: '30%', rotate: 26, delay: 0, color: '#ffd700' },
      { id: Date.now() + 2, startX: '5%', startY: '75%', targetX: '34%', targetY: '22%', rotate: 32, delay: 0.18, color: '#ff3377' },

      // Down/Bottom rockets shooting straight up & angled
      { id: Date.now() + 3, startX: '32%', startY: '98%', targetX: '38%', targetY: '18%', rotate: 8, delay: 0.28, color: '#38bdf8' },
      { id: Date.now() + 4, startX: '50%', startY: '100%', targetX: '50%', targetY: '14%', rotate: 0, delay: 0.42, color: '#fef08a' },
      { id: Date.now() + 5, startX: '68%', startY: '98%', targetX: '62%', targetY: '18%', rotate: -8, delay: 0.55, color: '#f59e0b' },

      // Right side rockets shooting inward & up
      { id: Date.now() + 6, startX: '95%', startY: '75%', targetX: '66%', targetY: '22%', rotate: -32, delay: 0.22, color: '#ec4899' },
      { id: Date.now() + 7, startX: '96%', startY: '95%', targetX: '74%', targetY: '30%', rotate: -26, delay: 0.35, color: '#a855f7' }
    ];
    setRockets(newRockets);

    // Multi-directional cannons firing from LEFT, RIGHT, and DOWN (never from top!)
    // WAVE 1: Side cannons (Left & Right shooting inwards)
    setTimeout(() => {
      sounds.playFireworksExplosion();
      // Left cannon shooting up-right
      confetti({
        particleCount: 85,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        startVelocity: 68,
        colors: ['#ffd700', '#ff3377', '#fde047', '#ffffff'],
        scalar: 1.2
      });
      // Right cannon shooting up-left
      confetti({
        particleCount: 85,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        startVelocity: 68,
        colors: ['#38bdf8', '#ec4899', '#c084fc', '#ffffff'],
        scalar: 1.2
      });
      setSparkBursts((prev) => [
        ...prev,
        { id: Date.now() + 's1', x: '26%', y: '30%' },
        { id: Date.now() + 's2', x: '74%', y: '30%' }
      ]);
    }, 450);

    // WAVE 2: Bottom cannons shooting straight up into the sky
    setTimeout(() => {
      sounds.playFireworksExplosion();
      // Bottom left-center
      confetti({
        particleCount: 95,
        angle: 85,
        spread: 60,
        origin: { x: 0.35, y: 0.98 },
        startVelocity: 76,
        colors: ['#ffd700', '#f59e0b', '#ff3377', '#ffffff'],
        scalar: 1.25
      });
      // Bottom right-center
      confetti({
        particleCount: 95,
        angle: 95,
        spread: 60,
        origin: { x: 0.65, y: 0.98 },
        startVelocity: 76,
        colors: ['#38bdf8', '#f472b6', '#fed7aa', '#ffffff'],
        scalar: 1.25
      });
      setSparkBursts((prev) => [
        ...prev,
        { id: Date.now() + 's3', x: '38%', y: '20%' },
        { id: Date.now() + 's4', x: '62%', y: '20%' }
      ]);
    }, 850);

    // WAVE 3: Grand climax from Center-Bottom and Mid-Left / Mid-Right!
    setTimeout(() => {
      sounds.playFireworksExplosion();
      // Center bottom shooting straight up
      confetti({
        particleCount: 140,
        angle: 90,
        spread: 85,
        origin: { x: 0.5, y: 0.98 },
        startVelocity: 85,
        colors: ['#ffd700', '#ff3377', '#ec4899', '#ffffff', '#38bdf8'],
        scalar: 1.35
      });
      // Left mid cannon
      confetti({
        particleCount: 65,
        angle: 45,
        spread: 50,
        origin: { x: 0, y: 0.6 },
        startVelocity: 62,
        colors: ['#ffd700', '#f43f5e', '#fed7aa']
      });
      // Right mid cannon
      confetti({
        particleCount: 65,
        angle: 135,
        spread: 50,
        origin: { x: 1, y: 0.6 },
        startVelocity: 62,
        colors: ['#a855f7', '#38bdf8', '#ffffff']
      });
      setSparkBursts((prev) => [
        ...prev,
        { id: Date.now() + 's5', x: '50%', y: '15%' }
      ]);
    }, 1250);

    // Clear spark bursts after fade
    setTimeout(() => setSparkBursts([]), 3200);
    setTimeout(() => setRockets([]), 2200);

    // Release balloons batch
    spawnBalloonsBatch();
  }, [spawnBalloonsBatch]);

  const handleLaunchCelebration = () => {
    sounds.playRomanticChime();
    setPhase('celebration');
    triggerSkyShootSequence();
  };

  // Pop balloon & display blessing message
  const handlePopBalloon = (id, e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    if (poppedBalloons.has(id)) return;

    sounds.playComicThud();
    setPoppedBalloons((prev) => new Set(prev).add(id));

    const clickX = e?.clientX || (e?.touches && e.touches[0]?.clientX) || window.innerWidth / 2;
    const clickY = e?.clientY || (e?.touches && e.touches[0]?.clientY) || window.innerHeight / 2;

    // Pop sparkle burst shooting outward from the balloon
    confetti({
      particleCount: 42,
      spread: 75,
      origin: {
        x: clickX / window.innerWidth,
        y: clickY / window.innerHeight
      },
      colors: ['#ffd700', '#ff3377', '#ffffff', '#38bdf8']
    });

    // Random blessing message
    const randomBlessing = BALLOON_POP_BLESSINGS[Math.floor(Math.random() * BALLOON_POP_BLESSINGS.length)];
    const newMsg = {
      id: `bless-${Date.now()}-${Math.random()}`,
      text: randomBlessing,
      x: clickX,
      y: clickY
    };
    setPopBlessings((prev) => [...prev, newMsg]);

    // 🌸 Spawn tumbling 3D Origami Blessing Leaf fluttering down
    const leafId = `leaf-${Date.now()}-${Math.random()}`;
    const leafEmoji = ['🌸', '🍃', '🕊️', '💌', '✨'][Math.floor(Math.random() * 5)];
    setOrigamiLeaves((prev) => [
      ...prev.slice(-6),
      {
        id: leafId,
        x: clickX,
        y: clickY,
        emoji: leafEmoji,
        driftX: (Math.random() - 0.5) * 120
      }
    ]);

    setTimeout(() => {
      setOrigamiLeaves((prev) => prev.filter((l) => l.id !== leafId));
    }, 2800);

    // Auto remove blessing badge after 2.6s
    setTimeout(() => {
      setPopBlessings((prev) => prev.filter((m) => m.id !== newMsg.id));
    }, 2600);
  };

  // 🌊 Interactive Ocean Water Click: Concentric Shimmering Wave Ripples
  const handleOceanClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const ripId = Date.now();
    sounds.playTap();
    setOceanRipples((prev) => [...prev.slice(-6), { id: ripId, x: rippleX, y: rippleY }]);
    setTimeout(() => {
      setOceanRipples((prev) => prev.filter((r) => r.id !== ripId));
    }, 1800);
  };

  return (
    <div className="sunset-beach-stage-wrapper full-screen-sunset-mode">
      {/* =========================================================
          🌅 FULL BACKGROUND SCENERY
          (Sunset Sky -> Transitions to Romantic Moonlit Night in Celebration)
          ========================================================= */}
      <div
        className={`sunset-scenery-container ${
          phase === 'celebration' ? 'moonlit-night-sky' : ''
        } ${phase === 'letter' && !showBeachOnly ? 'soft-dimmed' : ''}`}
      >
        {/* Sky Background: Sunset Gradient OR Moonlit Twilight Gradient */}
        <div className={`scenery-sky-gradient ${phase === 'celebration' ? 'sky-moonlit' : 'sky-sunset'}`} />

        {/* 🌞 Glowing Setting Sun (Smoothly sinks & fades when moonlight begins) */}
        <motion.div
          className="sunset-setting-sun"
          animate={
            phase === 'celebration'
              ? { opacity: 0, scale: 0.6, y: 120 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        >
          <div className="sun-pulsing-corona" />
          <div className="sun-glowing-core" />
          <div className="sun-heat-halo" />
        </motion.div>

        {/* 🌙 Luminous Pearl Moon & Moonlight Corona (Rises in Night Sky during Celebration) */}
        {phase === 'celebration' && (
          <motion.div
            className="moonlit-luminous-moon"
            initial={{ opacity: 0, scale: 0.6, y: -60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          >
            <div className="moon-lunar-halo" />
            <div className="moon-silver-orb" />
            <div className="moon-crater crater-1" />
            <div className="moon-crater crater-2" />
            <div className="moon-crater crater-3" />
          </motion.div>
        )}

        {/* Floating Clouds */}
        <div className="sunset-clouds-layer">
          <div className="sunset-cloud cloud-1" />
          <div className="sunset-cloud cloud-2" />
          <div className="sunset-cloud cloud-3" />
        </div>

        {/* 🌊 Ocean with Water Reflection Path (Sun Gold in Sunset -> Silver in Moonlight) */}
        <div
          className={`sunset-ocean-canvas ${phase === 'celebration' ? 'night-ocean' : ''}`}
          onClick={handleOceanClick}
        >
          {/* Shimmering Concentric Water Wave Ripples on Click */}
          {oceanRipples.map((rip) => (
            <div
              key={rip.id}
              className="water-ripple-wave"
              style={{ left: rip.x, top: rip.y }}
            >
              <span className="ripple-ring ring-1" />
              <span className="ripple-ring ring-2" />
              <span className="ripple-ring ring-3" />
            </div>
          ))}

          <div className={`ocean-reflection-path ${phase === 'celebration' ? 'moon-reflection' : 'sun-reflection'}`} />

          <svg className="ocean-waves-svg" viewBox="0 0 1440 260" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradSunset" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.45)" />
                <stop offset="40%" stopColor="rgba(124, 45, 18, 0.75)" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="waveGradMoonlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
                <stop offset="40%" stopColor="rgba(30, 27, 75, 0.85)" />
                <stop offset="100%" stopColor="#050816" />
              </linearGradient>
            </defs>
            <path
              className="wave-layer wave-back"
              fill={phase === 'celebration' ? 'url(#waveGradMoonlight)' : 'url(#waveGradSunset)'}
              d="M0,70 C320,110 420,30 720,75 C1020,120 1120,40 1440,80 L1440,260 L0,260 Z"
            />
            <path
              className="wave-layer wave-mid"
              fill={phase === 'celebration' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(251, 146, 60, 0.4)'}
              d="M0,105 C360,50 520,140 820,90 C1100,40 1220,125 1440,100 L1440,260 L0,260 Z"
            />
            <path
              className="wave-layer wave-front"
              fill={phase === 'celebration' ? '#070b19' : '#1e112a'}
              d="M0,135 C300,175 540,120 820,155 C1100,195 1260,135 1440,145 L1440,260 L0,260 Z"
            />
            <path
              className="wave-foam"
              d="M0,135 C300,175 540,120 820,155 C1100,195 1260,135 1440,145"
              fill="none"
              stroke={phase === 'celebration' ? 'rgba(224, 231, 255, 0.75)' : 'rgba(255, 255, 255, 0.7)'}
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* =========================================================
            🚢 SMALL SHIP CROSSING SEA: STOPS AT CENTER ONCE THEN CONTINUES
            ========================================================= */}
        <AnimatePresence>
          {phase === 'ship' && (
            <motion.div
              className="sea-anniversary-ship-wrapper"
              initial={{ x: '-25vw' }}
              animate={{
                // Enters from left (-25vw), stops at center (45vw), pauses 2.3s, then sails to 115vw!
                x: ['-25vw', '45vw', '45vw', '115vw']
              }}
              transition={{
                duration: 8.5,
                times: [0, 0.38, 0.65, 1],
                ease: 'easeInOut'
              }}
            >
              <div className="sea-ship-container">
                {/* Anniversary Wishing Banner trailing above ship */}
                <div className={`ship-anniversary-banner ${shipPausedAtCenter ? 'banner-center-pulse' : ''}`}>
                  <span className="banner-sparkle-left">✨</span>
                  <span className="banner-wishing-text">
                    {shipPausedAtCenter ? '💖 Wishing Happy 1st Anniversary Didi & Jiju! 🥂' : 'Happy 1st Anniversary Didi & Jiju! 💕'}
                  </span>
                  <span className="banner-sparkle-right">🚢</span>
                </div>

                {/* SVG Silhouette of the Romantic Yacht/Ship */}
                <svg width="150" height="75" viewBox="0 0 150 75" className="sea-ship-svg">
                  <defs>
                    <linearGradient id="shipHullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fed7aa" />
                      <stop offset="40%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#1e112a" />
                    </linearGradient>
                    <filter id="shipGlow">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fef08a" floodOpacity="0.8" />
                    </filter>
                  </defs>

                  <ellipse cx="65" cy="67" rx="60" ry="3.5" fill="rgba(254, 240, 138, 0.4)" filter="blur(1px)" />

                  <path
                    d="M 15 48 L 132 48 C 122 62, 100 66, 32 66 C 18 66, 12 56, 15 48 Z"
                    fill="url(#shipHullGrad)"
                    stroke="#fef08a"
                    strokeWidth="1"
                  />

                  <path d="M 38 48 L 42 35 L 98 35 L 108 48 Z" fill="#180b27" stroke="#f59e0b" strokeWidth="0.8" />

                  {[48, 62, 76, 90].map((wx) => (
                    <circle key={`win-${wx}`} cx={wx} cy="41" r="2.8" fill="#fef08a" filter="url(#shipGlow)" />
                  ))}

                  <line x1="72" y1="12" x2="72" y2="35" stroke="#fef08a" strokeWidth="1.8" />
                  <line x1="102" y1="20" x2="102" y2="35" stroke="#fed7aa" strokeWidth="1.4" />

                  <path d="M 40 32 Q 72 24, 102 24 Q 120 28, 130 36" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="3 3" />
                  <polygon points="72,12 84,15 72,18" fill="#ff3377" />
                  <polygon points="102,20 111,22 102,24" fill="#38bdf8" />

                  <rect x="54" y="26" width="6" height="9" fill="#7c2d12" stroke="#ea580c" strokeWidth="0.6" />
                  <circle cx="57" cy="22" r="2.5" fill="rgba(254, 240, 138, 0.7)" filter="blur(1px)" className="ship-smoke-puff" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Ship Button */}
        {phase === 'ship' && (
          <button className="skip-ship-btn" onClick={handleSkipShip}>
            <span>Watch Heart Birds 🕊️➔</span>
            <FastForward size={14} />
          </button>
        )}

        {/* =========================================================
            🏖️ ARTISTIC ROMANTIC SILHOUETTE OF DIDI & JIJU ON BEACH
            ========================================================= */}
        <div className={`beach-sandy-shore ${phase === 'celebration' ? 'night-beach-sand' : ''}`}>
          <div className="beach-couple-silhouettes">
            <svg width="300" height="180" viewBox="0 0 300 180" className="couple-beach-svg">
              <defs>
                <linearGradient id="coupleRimLightGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="25%" stopColor={phase === 'celebration' ? '#bae6fd' : '#fef08a'} />
                  <stop offset="55%" stopColor={phase === 'celebration' ? '#60a5fa' : '#f59e0b'} />
                  <stop offset="100%" stopColor="#1e112a" />
                </linearGradient>

                <radialGradient id="lanternWarmGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>

                <filter id="coupleSunsetGlowFilter" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow
                    dx="0"
                    dy="-4"
                    stdDeviation="6"
                    floodColor={phase === 'celebration' ? '#38bdf8' : '#f59e0b'}
                    floodOpacity="0.75"
                  />
                </filter>
              </defs>

              <ellipse cx="150" cy="168" rx="105" ry="10" fill="rgba(69, 26, 3, 0.7)" />
              <path d="M 46 168 Q 150 162, 254 168" stroke="#f59e0b" strokeWidth="2.5" fill="none" opacity="0.6" />

              {/* Glowing Beach Lantern beside couple */}
              <g transform="translate(48, 134)">
                <circle cx="10" cy="18" r="34" fill="url(#lanternWarmGlow)" />
                <path d="M 5 28 L 15 28 L 17 12 L 3 12 Z" fill="rgba(17, 7, 31, 0.9)" stroke="#fef08a" strokeWidth="1" />
                <path d="M 3 12 Q 10 6, 17 12" fill="#78350f" stroke="#fde047" strokeWidth="1" />
                <circle cx="10" cy="20" r="4.5" fill="#fef08a" className="lantern-flame-pulse" />
              </g>

              {/* Two celebration glasses */}
              <g transform="translate(236, 148)" opacity="0.85">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#fef08a" strokeWidth="1.2" />
                <path d="M -4 -6 L 4 -6 L 0 0 Z" fill="#fed7aa" stroke="#fef08a" strokeWidth="0.8" />
                <line x1="8" y1="2" x2="8" y2="12" stroke="#fef08a" strokeWidth="1.2" />
                <path d="M 4 -4 L 12 -4 L 8 2 Z" fill="#fed7aa" stroke="#fef08a" strokeWidth="0.8" />
              </g>

              {/* 💑 Didi & Jiju Silhouette */}
              <g filter="url(#coupleSunsetGlowFilter)">
                {/* Jiju (Right) */}
                <g fill="#11071f" stroke="url(#coupleRimLightGold)" strokeWidth="1.4">
                  <circle cx="168" cy="80" r="14.5" />
                  <path d="M 158 76 C 160 67, 178 68, 181 77 C 182 81, 180 84, 178 86" fill="#11071f" stroke="none" />
                  <path d="M 151 94 C 151 94, 168 88, 188 94 C 198 97, 201 112, 196 136 L 190 162 L 152 162 Z" />
                  <path d="M 162 101 C 146 98, 126 102, 118 116" strokeWidth="5.5" strokeLinecap="round" stroke="#11071f" fill="none" />
                  <ellipse cx="118" cy="116" rx="5" ry="3.5" fill="#11071f" stroke="url(#coupleRimLightGold)" strokeWidth="1" />
                  <path d="M 188 106 C 196 118, 198 138, 202 158" strokeWidth="4.5" strokeLinecap="round" stroke="#11071f" fill="none" />
                  <path d="M 154 158 C 164 167, 192 168, 202 162 C 205 157, 194 148, 182 152 Z" />
                </g>

                {/* Didi (Left) */}
                <g fill="#11071f" stroke="url(#coupleRimLightGold)" strokeWidth="1.4">
                  <circle cx="132" cy="88" r="13.2" />
                  <path d="M 124 84 C 112 90, 102 106, 106 128 C 111 122, 116 104, 122 96 Z" fill="#11071f" stroke="url(#coupleRimLightGold)" strokeWidth="0.8" />
                  <path d="M 121 92 C 108 105, 96 122, 101 142 C 106 134, 112 118, 118 108 Z" fill="#11071f" stroke="none" />
                  <path d="M 120 102 C 127 96, 142 98, 150 106 L 144 162 L 108 162 Z" />
                  <path d="M 128 114 C 136 124, 148 132, 156 135" strokeWidth="4" strokeLinecap="round" stroke="#11071f" fill="none" />
                  <path d="M 108 156 C 114 166, 138 168, 152 162 C 154 157, 138 148, 126 150 Z" />
                </g>
                <circle cx="156" cy="135" r="3.2" fill="#fef08a" />
              </g>

              <text x="150" y="60" fontSize="18" fill="#ff3377" textAnchor="middle" className="beach-couple-floating-heart">
                💖
              </text>
            </svg>

            <div className="couple-beach-tag">
              {phase === 'celebration' ? 'Didi & Jiju Under Moonlit Stars 🌙✨' : 'Didi & Jiju at Sunset Beach 💕'}
            </div>
          </div>
        </div>

        {/* Twinkling Stars (Denser in Moonlit Night mode) */}
        <div className="sunset-ambient-stars">
          {[...Array(phase === 'celebration' ? 48 : 28)].map((_, i) => (
            <span
              key={`star-${i}`}
              className="sunset-twinkle-sparkle"
              style={{
                left: `${(i * 17 + 5) % 96}%`,
                top: `${(i * 11 + 4) % (phase === 'celebration' ? 55 : 38)}%`,
                animationDelay: `${(i * 0.22) % 2.5}s`,
                width: i % 4 === 0 ? '3.5px' : '2px',
                height: i % 4 === 0 ? '3.5px' : '2px'
              }}
            />
          ))}
        </div>
      </div>

      {/* =========================================================
          🕊️ BIRDS IN HEART FORMATION: FLYING FROM ONE END TO THE OTHER OVER SUNSET OCEAN
          - Sweeps across sunset sky in heart formation
          - Leader drops the letter at center
          - Flock soars away gracefully to the horizon!
          ========================================================= */}
      <AnimatePresence>
        {birdsVisible && (
          <motion.div
            className="birds-heart-flock-formation"
            initial={{ scale: 0.38, opacity: 0, x: '-60vw', y: '-10vh' }}
            animate={
              birdsDispersed
                ? {
                    scale: 0.32,
                    x: '65vw',
                    y: '-26vh',
                    opacity: 0,
                    transition: { duration: 1.8, ease: 'easeIn' }
                  }
                : {
                    scale: [0.38, 0.75, 1.05, 1.0],
                    x: ['-60vw', '-25vw', '0vw', '8vw'],
                    y: ['-10vh', '-2vh', '2vh', '0vh'],
                    opacity: [0, 0.85, 1, 1],
                    transition: { duration: 3.0, ease: [0.25, 1, 0.5, 1] }
                  }
            }
          >
            <svg width="420" height="340" viewBox="-120 -100 240 220" className="heart-birds-group-svg">
              <defs>
                <filter id="birdGoldHalo">
                  <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ffd700" floodOpacity="0.85" />
                </filter>
              </defs>

              {HEART_BIRD_OFFSETS.map((bird) => (
                <g
                  key={`heart-bird-${bird.id}`}
                  transform={`translate(${bird.x}, ${bird.y}) scale(${bird.isLeader ? 1.35 : 0.95})`}
                  filter={bird.isLeader ? 'url(#birdGoldHalo)' : undefined}
                >
                  <g fill={bird.isLeader ? '#ffd700' : '#1e112a'} stroke={bird.isLeader ? '#ffffff' : '#fde047'} strokeWidth="0.8">
                    <ellipse cx="0" cy="0" rx="9" ry="3.8" />
                    <circle cx="8" cy="-1.5" r="2.8" />
                    <polygon points="10,-2 15,-1.2 10,-0.4" fill="#f59e0b" />
                    <path d="M -1 0 Q 4 -16, 14 -14 Q 5 -3, 0 0" className="wing-flap-left" />
                    <path d="M -1 0 Q -4 -16, -14 -14 Q -4 -3, 0 0" className="wing-flap-right" />
                  </g>

                  {bird.isLeader && !letterDropped && (
                    <g transform="translate(0, 8) scale(0.75)">
                      <rect x="-9" y="-6" width="18" height="12" rx="2" fill="#fffef0" stroke="#f59e0b" strokeWidth="1.2" />
                      <circle cx="0" cy="0" r="3.2" fill="#dc2626" />
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Birds Flight Button */}
      {phase === 'birds' && !letterDropped && (
        <button className="skip-flight-to-letter-btn" onClick={handleSkipToLetter}>
          <span>Open Sibling's Letter Now 💌➔</span>
        </button>
      )}

      {/* =========================================================
          💌 ENVELOPE DROP, WAX SEAL BREAK & PARCHMENT UNFURLING ANIMATION
          ========================================================= */}
      <AnimatePresence>
        {letterDropped && phase === 'birds' && (
          <motion.div
            className="letter-opening-showcase-container"
            initial={{ scale: 0.25, y: -160, opacity: 0 }}
            animate={{
              scale: letterOpeningStep === 'falling' ? [0.25, 0.55, 0.85, 1] : 1,
              y: letterOpeningStep === 'falling' ? [-160, -70, 15, 0] : 0,
              opacity: 1
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {/* The Envelope with Realistic 3D Opening Flap */}
            <div className={`royal-envelope-3d-box ${letterOpeningStep}`}>
              {/* Back flap & interior pocket */}
              <div className="envelope-interior-paper">
                {/* Folded Parchment Letter sliding out! */}
                <motion.div
                  className="envelope-sliding-letter-parchment"
                  animate={
                    letterOpeningStep === 'unfolding' || letterOpeningStep === 'opened'
                      ? { y: -140, scaleY: [0.5, 1.2, 1], scaleX: [0.8, 1], opacity: 1 }
                      : { y: 0, scaleY: 0.5, opacity: 0.8 }
                  }
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                >
                  <div className="mini-parchment-content">
                    <span className="mini-gold-crest">⚜️ Dearest Didi & Jiju ⚜️</span>
                    <p className="mini-gold-preview">"365 Days of Pure Love & Togetherness..."</p>
                  </div>
                </motion.div>
              </div>

              {/* Envelope Body */}
              <div className="envelope-front-pocket">
                <span className="envelope-gold-stamp">💌 SIBLING SPECIAL DISPATCH</span>
              </div>

              {/* Envelope Triangular Top Flap (Flips open upwards) */}
              <div className={`envelope-top-flap ${letterOpeningStep !== 'falling' ? 'flap-opened' : ''}`}>
                <div className="envelope-flap-triangle" />
              </div>

              {/* Wax Seal (Cracks open with sparkles) */}
              <motion.div
                className={`envelope-wax-seal-button ${letterOpeningStep === 'breaking-seal' ? 'seal-cracking' : ''}`}
                animate={
                  letterOpeningStep === 'breaking-seal'
                    ? { scale: [1, 1.35, 0], opacity: [1, 1, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.5 }}
                onClick={handleSkipToLetter}
                title="Click to break wax seal & open! 💌"
              >
                <span>💕</span>
                <small>DJ</small>
              </motion.div>
            </div>

            <p className="letter-opening-instruction">
              {letterOpeningStep === 'falling' && 'Delivered from the Sunset Beach... 🕊️'}
              {letterOpeningStep === 'breaking-seal' && 'Breaking Royal Wax Seal... ✨'}
              {(letterOpeningStep === 'unfolding' || letterOpeningStep === 'opened') && 'Unfurling Sibling Khat... 💕'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          📜 SCENE 4: THE FULL READABLE EMOTIONAL SIBLING LETTER
          ========================================================= */}
      <AnimatePresence>
        {phase === 'letter' && (
          <motion.div
            className="sibling-letter-readable-container"
            initial={{ scale: 0.82, opacity: 0, y: 35 }}
            animate={{
              scale: showBeachOnly ? 0.35 : 1,
              opacity: showBeachOnly ? 0 : 1,
              y: showBeachOnly ? 300 : 0,
              pointerEvents: showBeachOnly ? 'none' : 'auto'
            }}
            exit={{ scale: 0.85, opacity: 0, y: -30 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          >
            <div className="parchment-double-gold-border">
              <div ref={letterScrollRef} className="parchment-readable-paper">
                <span className="filigree-corner top-left">⚜️</span>
                <span className="filigree-corner top-right">⚜️</span>
                <span className="filigree-corner bottom-left">⚜️</span>
                <span className="filigree-corner bottom-right">⚜️</span>

                <div className="letter-header-stamp">
                  <span className="postage-tag">💌 SPECIAL ANNIVERSARY SIBLING DISPATCH</span>
                  <span className="postage-date">365 DAYS COMPLETED • FEB 2025</span>
                </div>

                <h2 className="letter-salutation">Dearest Didi & Jiju, ❤️</h2>

                <div className="letter-body-prose">
                  <p className="letter-para">
                    Sach kahun toh yeh khat likhte waqt dil bohot emotional ho raha hai, par chehre par ek bohot pyari si smile hai. 
                    Aisa lagta hai jaise kal hi ki baat thi jab ghar mein wedding ki madness chal rahi thi, joota-churai ki planning 
                    ho rahi thi, aur hum sab shaadi ke function mein naach rahe the... Aur dekhte hi dekhte, aap dono ne successfully 
                    <strong className="highlight-milestone"> 365 Days of Pure Love & Togetherness</strong> complete kar liye! 🥂✨
                  </p>

                  <p className="letter-para">
                    <strong className="highlight-didi">Didi</strong>, bachpan se leke aaj tak aap sirf meri badi behan nahi, balki meri 
                    sabse badi strength, meri secret-keeper, aur meri second mom rahi ho. Meri har bematlab ki zid poori karna, 
                    mummy-papa ki daant se bachana, aur raat ko 2 baje late-night Maggi banana... aapke bina mera bachpan itna 
                    khoobsurat kabhi nahi ho sakta tha. Jab aapki shaadi hui aur bidaai ka waqt aaya, toh dil bohot zyada roya tha... 
                    Ghar achanak bohot shaant aur adhoora lagne laga tha.
                  </p>

                  <p className="letter-para">
                    Par <strong className="highlight-jiju">Jiju</strong>, jis din aap hamari family ka hissa bane, hamara saara darr aur 
                    udaasi hamesha ke liye gayab ho gayi! Maine apni poori life mein kisi ko Didi ki itni respect karte, unki choti-choti 
                    khushiyon ka itna khayal rakhte, aur unhe ek rani ki tarah treat karte nahi dekha. 
                    Jiju, thank you so much for being Didi’s rock, her best friend, and her forever cheerleader! Didi ke drama, shopping 
                    sprees aur mood swings handle karne ke liye aapko sacchi mein <strong>10 Gold Medals</strong> milne chahiye! 🏆😂 
                    Sach mein, we couldn't have asked for a cooler, sweetest, aur treat-sponsor elder brother than you! 😇
                  </p>

                  <p className="letter-para">
                    Aap dono jab saath hote ho na, it feels like pure poetry in motion. <em>"Do Dhaage, Ek Kahaani"</em> — do bilkul alag 
                    duniya, jise Rab ne itne khoobsurat dhaage se baandh diya jo hamesha chamakta rahega.
                  </p>

                  <p className="letter-para">
                    Yeh 1st Anniversary toh bas shuruat hai ek 100-year-long fairy tale ki! Meri dil se bas yahi dua hai ki aap dono ke 
                    beech ka yeh pyaar, yeh dosti, aur yeh pagalpan har guzarte saal ke saath aur zyada gehra hota jaaye. 
                    Hamesha aise hi ek doosre ka haath pakde rehna, har mushkil mein muskuraate rehna, aur ek doosre ki favorite person bane rehna.
                  </p>

                  <div className="letter-signature-callout">
                    <span>Happy 1st Anniversary to my most favorite couple in the world! 💖🎂💍</span>
                  </div>
                </div>

                <div className="letter-footer-seal-row">
                  <div className="wax-stamp-imprint">
                    <span className="stamp-heart">💕</span>
                    <span>SEALED WITH SIBLING LOVE</span>
                  </div>

                  <div className="signature-right">
                    <span>Hamesha Aapka Pyaara,</span>
                    <strong>— Sibling 💕</strong>
                  </div>
                </div>

                <div className="letter-action-center">
                  <button
                    className="launch-sky-celebration-btn"
                    onClick={handleLaunchCelebration}
                  >
                    <span>Light Up The Anniversary Sky! 🎆🎈➔</span>
                    <Sparkles size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle View Sunset Beach Button */}
      {phase === 'letter' && (
        <button
          className="beach-view-toggle-pill"
          onClick={() => setShowBeachOnly((prev) => !prev)}
          title={showBeachOnly ? "Show Sibling Letter" : "View Sunset Beach Scene"}
        >
          {showBeachOnly ? <Mail size={16} /> : <Eye size={16} />}
          <span>{showBeachOnly ? "Show Letter 📜" : "View Sunset Beach 🌅"}</span>
        </button>
      )}

      {/* =========================================================
          🎆 CELEBRATION: MOONLIT SKY, BALLOONS (GO UP ONLY), POP BLESSINGS & SPARKS
          ========================================================= */}
      <AnimatePresence>
        {phase === 'celebration' && (
          <motion.div
            className="sky-celebration-arena"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
          >
            {/* 🚀 Sky Shoot Rockets (Launching from Left, Right & Down) */}
            {rockets.map((r) => (
              <motion.div
                key={r.id}
                className="sky-shoot-rocket"
                initial={{ left: r.startX, top: r.startY, scale: 1, rotate: r.rotate || 0 }}
                animate={{ left: r.targetX, top: r.targetY, scale: 0.45 }}
                transition={{ duration: 0.75, delay: r.delay, ease: 'easeOut' }}
              >
                <div className="rocket-body" style={{ color: r.color }}>
                  🚀
                  <div className="rocket-fire-trail" />
                </div>
              </motion.div>
            ))}

            {/* ✨ Custom Firecracker Spark Bursts */}
            {sparkBursts.map((sb) => (
              <div key={sb.id} className="firework-spark-burst" style={{ left: sb.x, top: sb.y }}>
                {[...Array(12)].map((_, sIdx) => (
                  <div
                    key={`spark-${sIdx}`}
                    className="firework-spark-ray"
                    style={{
                      transform: `rotate(${sIdx * 30}deg) translateY(-35px)`
                    }}
                  />
                ))}
              </div>
            ))}

            {/* 🎈 FLOATING BALLOONS (GO UP SLOWLY & STICK IN PLACE ON HOVER) */}
            <div className="floating-balloons-layer">
              {balloons.map((b) => {
                if (poppedBalloons.has(b.id)) return null;

                return (
                  <div
                    key={b.id}
                    className="drifting-sky-balloon"
                    style={{
                      left: b.left,
                      '--balloon-speed': `${b.speed}s`,
                      '--balloon-delay': `${b.delay}s`,
                      '--balloon-sway': `${b.sway}px`
                    }}
                    onClick={(e) => handlePopBalloon(b.id, e)}
                    onPointerDown={(e) => handlePopBalloon(b.id, e)}
                  >
                    <div
                      className={`balloon-rubber-shape ${b.isHeart ? 'balloon-heart' : ''}`}
                      style={{
                        background: b.bg,
                        width: `${b.size}px`,
                        height: `${b.size * 1.25}px`
                      }}
                    >
                      <div className="balloon-shine" />
                      <div className="balloon-knot" />
                      <div className="balloon-dangling-string" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 💬 POP BLESSINGS PILLS (Appear where balloons are popped!) */}
            {popBlessings.map((msg) => (
              <motion.div
                key={msg.id}
                className="balloon-pop-blessing-pill"
                initial={{ left: msg.x - 70, top: msg.y - 15, scale: 0.5, opacity: 0 }}
                animate={{
                  top: msg.y - 85,
                  scale: [0.5, 1.15, 1],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 2.4, ease: 'easeOut' }}
              >
                <span>{msg.text}</span>
              </motion.div>
            ))}

            {/* 🌸 Tumbling 3D Origami Blessing Leaves & Petals */}
            {origamiLeaves.map((leaf) => (
              <motion.div
                key={leaf.id}
                className="origami-fluttering-leaf"
                initial={{
                  left: leaf.x,
                  top: leaf.y,
                  scale: 0.6,
                  rotateZ: 0,
                  opacity: 1
                }}
                animate={{
                  top: leaf.y + 140,
                  left: [leaf.x, leaf.x + leaf.driftX * 0.5, leaf.x + leaf.driftX],
                  rotateZ: [-15, 35, -25, 45],
                  rotateY: [0, 180, 360],
                  scale: [0.6, 1.1, 0.8],
                  opacity: [1, 1, 0.8, 0]
                }}
                transition={{ duration: 2.6, ease: 'easeOut' }}
              >
                <span className="origami-leaf-symbol">{leaf.emoji}</span>
              </motion.div>
            ))}

            {/* ✨ GRAND ANNIVERSARY HEADLINE CLIMAX ✨ */}
            <motion.div
              className="anniversary-headline-showcase moonlit-headline"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 220, damping: 20 }}
            >
              <div className="anniversary-gold-badge">
                <PartyPopper size={18} color="#ffd700" />
                <span>365 DAYS OF UNCONDITIONAL LOVE</span>
                <PartyPopper size={18} color="#ffd700" />
              </div>

              <div className="balloon-pop-hint-pill">
                <span>🎈 Tap any balloon to reveal sweet blessings! ✨</span>
              </div>

              <h1 className="happy-anniversary-grand-text">
                <span className="line-happy">Happy 1st Anniversary</span>
                <span className="line-names">Didi & Jiju ❤️🥂</span>
              </h1>

              <p className="anniversary-poetic-sub">
                "Do Dhaage, Ek Kahaani... Hamesha Ke Liye!" ✨
              </p>

              <div className="anniversary-celebration-toolbar">
                <button
                  className="anniversary-tool-btn firework-boost-btn"
                  onClick={triggerSkyShootSequence}
                >
                  <Rocket size={18} />
                  <span>Launch More Fireworks & Sparks! 🎆</span>
                </button>

                <button
                  className="anniversary-tool-btn balloon-boost-btn"
                  onClick={spawnBalloonsBatch}
                >
                  <Sparkles size={18} />
                  <span>Release More Balloons! 🎈</span>
                </button>

                <button
                  className="anniversary-tool-btn letter-review-btn"
                  onClick={() => setPhase('letter')}
                >
                  <Mail size={18} />
                  <span>Read Letter Again 💌</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SiblingLetterAndFireworksStage;
