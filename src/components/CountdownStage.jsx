import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cake, Footprints, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

const TAUNTS = [
  "Didi se nahi pakda jaayega! 🏃‍♀️💨",
  "Jiju ko batau kya? 😜🙈",
  "Chote bhai ka Sibling Flick! ☝️💥",
  "Arre itna slow response?! 🐢😂",
  "Ninja hoverboard pe hu main! 🥷💨",
  "Catch me if you can, Jiju! 🏃‍♂️💨",
  "Oops! Miss ho gaya! 😝🍕",
  "Chalo ek aur try karo! 🚀✨"
];

// ─── 3D Gyroscopic Hourglass of Love with Particle Cascade ───
function Hourglass3D({ seconds }) {
  return (
    <div className="hourglass-3d-chassis">
      {/* 3D Revolving Orbital Rings */}
      <div className="hourglass-orbit-ring ring-x" />
      <div className="hourglass-orbit-ring ring-y" />

      {/* Glass Body */}
      <div className="hourglass-glass-capsule">
        {/* Top Bulb with trickling grains */}
        <div className="hourglass-bulb bulb-top">
          <div className="sand-reservoir top-sand" style={{ height: `${Math.max(10, (seconds / 10) * 100)}%` }} />
          <div className="sand-swirl-grains" />
        </div>

        {/* Constriction Neck with Live Sand Waterfall & Falling Hearts */}
        <div className="hourglass-neck">
          <div className="falling-sand-stream" />
          <span className="neck-falling-heart">💖</span>
        </div>

        {/* Bottom Bulb with building sand hill & bouncing golden sparks */}
        <div className="hourglass-bulb bulb-bottom">
          <div className="sand-reservoir bottom-sand" style={{ height: `${Math.min(95, ((10 - seconds) / 10) * 100)}%` }} />
          <span className="hourglass-spark spark-1">💖</span>
          <span className="hourglass-spark spark-2">✨</span>
          <span className="hourglass-spark spark-3">🌟</span>
        </div>
      </div>

      {/* Golden Brass Baseplates */}
      <div className="hourglass-cap cap-top" />
      <div className="hourglass-cap cap-bottom" />
    </div>
  );
}

// ─── 3D Split-Flap Odometer Roller with Specular Flap Fold ───
function OdometerRoller({ val, label, highlight }) {
  return (
    <div className={`odometer-cylinder-box ${highlight ? 'highlight-3d' : ''}`}>
      <div className="cylinder-inner">
        <motion.div
          key={val}
          className="odometer-flip-wrapper"
          initial={{ rotateX: -90, opacity: 0.3 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0.3 }}
          transition={{ duration: 0.38, type: 'spring', stiffness: 350, damping: 20 }}
        >
          <span className="odometer-number">{val}</span>
        </motion.div>
        {/* Mechanical Split-Flap Center Horizon Crease */}
        <div className="split-flap-crease" />
      </div>
      <span className="timer-label">{label}</span>
      <div className="specular-reflection" />
    </div>
  );
}

// ─── 3D Velvet Theatrical Curtains Transition ───
function TheatricalCurtains3D({ isClosing, onClosed }) {
  if (!isClosing) return null;

  return (
    <div className="theatrical-curtains-stage">
      {/* Left Velvet Drape */}
      <motion.div
        className="velvet-curtain curtain-left"
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 0.75, ease: [0.45, 0.05, 0.55, 0.95] }}
      >
        <div className="curtain-folds" />
        <div className="golden-tassel tassel-left">🎗️</div>
      </motion.div>

      {/* Right Velvet Drape */}
      <motion.div
        className="velvet-curtain curtain-right"
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 0.75, ease: [0.45, 0.05, 0.55, 0.95] }}
        onAnimationComplete={() => {
          setTimeout(onClosed, 350);
        }}
      >
        <div className="curtain-folds" />
        <div className="golden-tassel tassel-right">🎗️</div>
      </motion.div>

      <div className="curtain-center-crest">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 260 }}
          className="crest-badge"
        >
          <span>Didi & Jiju</span>
          <small>Unlocking Strict Sibling Vault... 🔐</small>
        </motion.div>
      </div>
    </div>
  );
}

export default function CountdownStage({ secondsRemaining, setSecondsRemaining, onNextStage }) {
  const [isRunawayActive, setIsRunawayActive] = useState(true);
  const [btnPos, setBtnPos] = useState(() => ({
    top: typeof window !== 'undefined' ? `${Math.min(window.innerHeight * 0.76, window.innerHeight - 130)}px` : '76%',
    left: typeof window !== 'undefined' ? `${window.innerWidth * 0.5}px` : '50%'
  }));
  const [btnTilt, setBtnTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0 });
  const [tauntIndex, setTauntIndex] = useState(0);
  const [currentTaunt, setCurrentTaunt] = useState(TAUNTS[0]);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgePuffs, setDodgePuffs] = useState([]);
  const [isJellyBouncing, setIsJellyBouncing] = useState(false);
  const [isCurtainClosing, setIsCurtainClosing] = useState(false);

  // Smooth Sibling Hand Flick from Outside
  const [showSiblingHand, setShowSiblingHand] = useState(false);

  const runawayBtnRef = useRef(null);
  const lastHoverTimeRef = useRef(0);

  // Countdown timer effect
  useEffect(() => {
    if (secondsRemaining <= 0) {
      if (isRunawayActive) {
        setIsRunawayActive(false);
        sounds.playSuccess();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.7 } });
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunawayActive(false);
          sounds.playSuccess();
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.7 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, isRunawayActive, setSecondsRemaining]);

  // Smooth Button Evasion & Sibling Hand (Strictly clamped INSIDE screen bounds)
  const moveButtonAway = (cursorX, cursorY) => {
    if (!isRunawayActive) return;

    // Record old position for cartoon poof of smoke / sparkle blast!
    if (runawayBtnRef.current) {
      const rect = runawayBtnRef.current.getBoundingClientRect();
      const oldX = rect.left + rect.width / 2;
      const oldY = rect.top + rect.height / 2;
      const puffId = Date.now();
      setDodgePuffs((prev) => [...prev.slice(-4), { id: puffId, x: oldX, y: oldY }]);
      setTimeout(() => {
        setDodgePuffs((prev) => prev.filter((p) => p.id !== puffId));
      }, 750);
    }

    setIsJellyBouncing(true);
    setTimeout(() => setIsJellyBouncing(false), 500);

    // Safety padding so button NEVER moves out of the screen!
    // Button dimensions with jets and badge: width ~320px, height ~90px
    const halfW = 160;
    const halfH = 55;
    const margin = 40;

    const minX = halfW + margin;
    const maxX = window.innerWidth - halfW - margin;
    const minY = halfH + margin + 65; // keep well clear of top header
    const maxY = window.innerHeight - halfH - margin - 35; // keep well clear of bottom

    const safeMaxX = Math.max(minX + 40, maxX);
    const safeMaxY = Math.max(minY + 40, maxY);

    let newX = Math.random() * (safeMaxX - minX) + minX;
    let newY = Math.random() * (safeMaxY - minY) + minY;

    // Make sure new spot is well away from current cursor position
    if (cursorX && cursorY) {
      const dist = Math.hypot(newX - cursorX, newY - cursorY);
      if (dist < 200) {
        const angle = Math.atan2(newY - cursorY, newX - cursorX) + (Math.random() - 0.5) * 0.8;
        newX = cursorX + Math.cos(angle) * 260;
        newY = cursorY + Math.sin(angle) * 220;

        // Re-clamp strictly within safe screen boundaries
        newX = Math.max(minX, Math.min(safeMaxX, newX));
        newY = Math.max(minY, Math.min(safeMaxY, newY));
      }
    }

    setShowSiblingHand(true);
    sounds.playFlick();
    setTimeout(() => setShowSiblingHand(false), 550);

    const tiltZ = (Math.random() - 0.5) * 16;
    const tiltX = (Math.random() - 0.5) * 14;
    const tiltY = (Math.random() - 0.5) * 18;

    setBtnTilt({ rotateX: tiltX, rotateY: tiltY, rotateZ: tiltZ });
    setBtnPos({ top: `${newY}px`, left: `${newX}px` });
    setDodgeCount((prev) => prev + 1);

    // Show NEXT message ONE AT A TIME sequentially!
    setTauntIndex((prev) => {
      const next = (prev + 1) % TAUNTS.length;
      setCurrentTaunt(TAUNTS[next]);
      return next;
    });
  };

  // Hover handler with debounce so it moves cleanly once per hover
  const handleButtonHover = (e) => {
    if (!isRunawayActive) return;
    const now = Date.now();
    if (now - lastHoverTimeRef.current < 420) return;
    lastHoverTimeRef.current = now;

    const clientX = e?.clientX || (e?.touches && e.touches[0]?.clientX);
    const clientY = e?.clientY || (e?.touches && e.touches[0]?.clientY);
    moveButtonAway(clientX, clientY);
  };

  useEffect(() => {
    if (!isRunawayActive) return;

    const onMouseMove = (e) => {
      if (!runawayBtnRef.current) return;
      const rect = runawayBtnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // Subtle 3D tilt when cursor is nearby, but DO NOT jump here (jumps only on hover!)
      if (dist < 260) {
        setBtnTilt({
          rotateX: -(dy / 260) * 14,
          rotateY: (dx / 260) * 16,
          rotateZ: -(dx / 260) * 6
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isRunawayActive]);

  const handleButtonClick = () => {
    if (isRunawayActive) {
      moveButtonAway();
    } else {
      sounds.playRomanticChime();
      sounds.playWhoosh();
      setIsCurtainClosing(true);
    }
  };

  const formattedSeconds = String(secondsRemaining).padStart(2, '0');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card hero-card countdown-hero-card"
      >
        {/* Floating Impatience Sibling Bubble */}
        {dodgeCount >= 2 && isRunawayActive && (
          <motion.div
            className="sibling-impatience-toast"
            initial={{ scale: 0, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <span>🏃‍♀️ Didi gate pe impatient ho rahi hai... Jiju catch the button! 💨</span>
          </motion.div>
        )}

        <div className="cute-badge">
          <Cake size={16} /> 365 Days of Didi & Jiju! 🥳🎂
        </div>

        <h1 className="main-title">Wait for the 1st Year Magic! ✨</h1>
        <p className="subtitle">
          1 saal pura hone wala hai... par chote bhai/behan ka surprise dekhna itna aasan nahi hai! 😜
        </p>

        {/* 3D Gyroscopic Hourglass of Love + Odometer Rollers */}
        <div className="countdown-center-deck">
          <Hourglass3D seconds={secondsRemaining} />

          <div className="odometer-cylinders-wrapper">
            <OdometerRoller val="00" label="Days" highlight={false} />
            <div className="timer-colon-3d">:</div>
            <OdometerRoller val="00" label="Hours" highlight={false} />
            <div className="timer-colon-3d">:</div>
            <OdometerRoller val="00" label="Minutes" highlight={false} />
            <div className="timer-colon-3d">:</div>
            <OdometerRoller val={formattedSeconds} label="Seconds" highlight={true} />
          </div>
        </div>

        <div className="tease-status">
          {isRunawayActive ? (
            <>
              <Footprints size={18} style={{ display: 'inline', marginRight: 6 }} />
              <span>
                Button pakad ke dikhao Didi & Jiju! (Dodges: <strong>{dodgeCount}</strong>) 🚀💨
              </span>
            </>
          ) : (
            <>
              <ShieldCheck size={18} style={{ display: 'inline', marginRight: 6, color: '#059669' }} />
              <span>Time Up! Hoverboard Off! 🔓 Ab click karo! 🎉</span>
            </>
          )}
        </div>

        {/* The Smooth Hoverboard Runaway Button */}
        {!isRunawayActive ? (
          <button
            className="runaway-hoverboard-button unlocked"
            onClick={handleButtonClick}
          >
            <span className="btn-text">Proceed to Secret Vault 🔐</span>
            <ArrowRight size={20} />
            <span className="taunt-tag">Click Me Now! 🎉🥳</span>
          </button>
        ) : (
          <div className="runaway-button-card-placeholder" style={{ height: '70px', margin: '20px 0 0 0' }} />
        )}
      </motion.div>

      {/* 🚀 Hoverboard Runaway Button Portaled to document.body (Guaranteed 100% inside true viewport!) */}
      {isRunawayActive && typeof document !== 'undefined' && createPortal(
        <>
          {/* Cartoon Smoke Poofs & Anime Speed Lines spawned where button jumped from */}
          {dodgePuffs.map((puff) => (
            <motion.div
              key={puff.id}
              className="dodge-smoke-puff"
              style={{
                position: 'fixed',
                left: puff.x,
                top: puff.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 9998,
                pointerEvents: 'none'
              }}
              initial={{ scale: 0.35, opacity: 1 }}
              animate={{ scale: [0.35, 1.4, 1.75], opacity: [1, 0.85, 0] }}
              transition={{ duration: 0.72, ease: 'easeOut' }}
            >
              <div className="poof-cloud-ring" />
              <span className="poof-emoji emoji-1">💨</span>
              <span className="poof-emoji emoji-2">✨</span>
              <span className="poof-emoji emoji-3">💥</span>
              <div className="poof-speed-line line-1" />
              <div className="poof-speed-line line-2" />
              <div className="poof-speed-line line-3" />
            </motion.div>
          ))}

          <button
            ref={runawayBtnRef}
            className={`runaway-hoverboard-button ${isJellyBouncing ? 'jelly-squash' : ''}`}
            style={{
              position: 'fixed',
              top: btnPos.top,
              left: btnPos.left,
              transform: `translate(-50%, -50%) perspective(800px) rotateX(${btnTilt.rotateX}deg) rotateY(${btnTilt.rotateY}deg) rotateZ(${btnTilt.rotateZ}deg)`,
              zIndex: 9999
            }}
            onMouseEnter={handleButtonHover}
            onPointerEnter={handleButtonHover}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              handleButtonHover(touch);
            }}
            onClick={handleButtonClick}
          >
            <div className="jet-thruster thruster-left">
              <span className="thruster-nozzle" />
              <div className="flame-particle-3d" />
            </div>

            <span className="btn-text">Move to Next 🚀</span>
            <ArrowRight size={20} />

            <div className="jet-thruster thruster-right">
              <span className="thruster-nozzle" />
              <div className="flame-particle-3d" />
            </div>

            <span className="taunt-tag">{currentTaunt}</span>
          </button>

          {/* Sibling Hand Flick Animation portaled alongside button */}
          <AnimatePresence>
            {showSiblingHand && (
              <motion.div
                className="sibling-hand-flick"
                initial={{ x: 220, y: -80, rotate: -20, opacity: 0, scale: 0.85 }}
                animate={{ x: 0, y: 0, rotate: 12, opacity: 1, scale: 1.15 }}
                exit={{ x: 220, y: -80, opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  top: btnPos.top,
                  left: btnPos.left,
                  zIndex: 10000,
                  pointerEvents: 'none'
                }}
              >
                <div className="hand-flick-graphic">
                  <span className="hand-emoji">☝️</span>
                  <span className="flick-sparkle">💥</span>
                </div>
                <div className="hand-taunt-bubble">Flick! Not so fast Jiju! 😜</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}

      {/* 3D Velvet Theatrical Curtains Transition */}
      <TheatricalCurtains3D
        isClosing={isCurtainClosing}
        onClosed={() => {
          setIsCurtainClosing(false);
          onNextStage();
        }}
      />
    </>
  );
}
