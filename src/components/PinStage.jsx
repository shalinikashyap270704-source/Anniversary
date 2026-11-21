import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, RotateCcw, Delete, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import RibbonTie from './RibbonTie';
import ShagunGirl from './ShagunGirl';
import { sounds } from '../utils/audio';

const ROASTS = [
  "Jiju, Didi ka birthday daal diya kya? Ye anniversary portal hai! 🤦‍♂️🤣",
  "Wrong PIN! Belan attack activated! 🪓🚨",
  "1 saal me hi date bhool gaye?! Didi will remember this! ⚖️💅",
  "Aayein? Baingan! Sahi PIN dalo (Hint: 3011) 🍆😂",
  "Didi ki daant incoming in 3... 2... 1... 📞⚡",
  "Daya, darwaza tod do! Galat PIN daal diya! 🚪🔨💥",
  "Kya gunda banoge re Didi & Jiju! 🕵️‍♂️😂"
];

export default function PinStage({
  onPinSuccess,
  onRequestScanner,
  isCuttingRibbon,
  isRibbonCut,
  onRibbonCutComplete,
  isScannerOpen
}) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [showFlyingBelan, setShowFlyingBelan] = useState(false);
  const [showGlassCrack, setShowGlassCrack] = useState(false);
  const [showFlyingKeys, setShowFlyingKeys] = useState(false);
  const [isVaultOpening, setIsVaultOpening] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [roastMessage, setRoastMessage] = useState("Hint: Special date yaad hai na? 3011 🤫✨");
  const correctPin = '3011';

  const handleKeyInput = (val) => {
    if (!isRibbonCut || isSuccess || pin.length >= 4) return;
    const newPin = pin + val;
    sounds.playTap();
    setPin(newPin);

    if (newPin.length === 4) {
      validatePin(newPin);
    }
  };

  const handleBackspace = () => {
    if (!isRibbonCut || isSuccess || pin.length === 0) return;
    sounds.playTap();
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  const handleClear = () => {
    if (!isRibbonCut || isSuccess) return;
    sounds.playTap();
    setPin('');
    setIsError(false);
  };

  const validatePin = (enteredPin) => {
    if (enteredPin === correctPin) {
      // 4 GOLDEN KEYS FLY IN FROM 4 CORNERS OUTSIDE SCREEN!
      setIsSuccess(true);
      setShowFlyingKeys(true);
      sounds.playRomanticChime();

      setTimeout(() => {
        setIsVaultOpening(true);
        sounds.playHydraulicVault();
        sounds.playSuccess();
        confetti({ particleCount: 130, spread: 95, origin: { y: 0.5 } });

        setTimeout(() => {
          onPinSuccess();
        }, 1500);
      }, 700);

    } else {
      // 3D FLYING BELAN SMASHES FROM OUTSIDE SCREEN ON WRONG PIN!
      setIsError(true);
      setShowFlyingBelan(true);
      sounds.playBuzzer();
      sounds.playComicThud();

      setTimeout(() => {
        setShowGlassCrack(true);
        sounds.playCrack();
      }, 300);

      const randomRoast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
      setRoastMessage(randomRoast);

      setTimeout(() => {
        setShowFlyingBelan(false);
        setShowGlassCrack(false);
        setPin('');
        setIsError(false);
      }, 1300);
    }
  };

  useEffect(() => {
    if (!isRibbonCut) return;

    const onKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyInput(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pin, isSuccess, isRibbonCut]);

  return (
    <div className="pin-stage-wrapper">
      {/* 3D Flying Belan (Rolling Pin) coming from outside the screen */}
      <AnimatePresence>
        {showFlyingBelan && (
          <motion.div
            className="flying-belan-smash"
            initial={{ x: -window.innerWidth * 0.55, y: -120, rotate: -180, scale: 0.5, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: [0, -35, 15], scale: 1.35, opacity: 1 }}
            exit={{ x: -window.innerWidth * 0.55, y: -120, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="belan-3d-graphic">
              <span className="belan-icon">🥖</span>
              <span className="smash-impact-star">💥</span>
            </div>
            <div className="belan-roast-shout">BELAN ATTACK! 🤦‍♂️🤣</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spiderweb Glass Crack on Screen */}
      <AnimatePresence>
        {showGlassCrack && (
          <motion.div
            className="spiderweb-glass-crack"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="#dc2626" strokeWidth="1.5">
              <path d="M50 50 L10 15 M50 50 L85 10 M50 50 L95 65 M50 50 L55 95 M50 50 L15 85 M50 50 L5 45" />
              <circle cx="50" cy="50" r="14" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="28" strokeDasharray="4 4" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 3D Golden Keys flying in from 4 corners outside the screen */}
      <AnimatePresence>
        {showFlyingKeys && (
          <div className="flying-keys-quad">
            <motion.div
              className="quad-key key-top-left"
              initial={{ x: -window.innerWidth * 0.5, y: -window.innerHeight * 0.4, scale: 0.4, rotate: -45, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 1.2, rotate: 360, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              🗝️✨
            </motion.div>
            <motion.div
              className="quad-key key-top-right"
              initial={{ x: window.innerWidth * 0.5, y: -window.innerHeight * 0.4, scale: 0.4, rotate: 45, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 1.2, rotate: -360, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              🗝️✨
            </motion.div>
            <motion.div
              className="quad-key key-bottom-left"
              initial={{ x: -window.innerWidth * 0.5, y: window.innerHeight * 0.4, scale: 0.4, rotate: -90, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 1.2, rotate: 360, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              🗝️✨
            </motion.div>
            <motion.div
              className="quad-key key-bottom-right"
              initial={{ x: window.innerWidth * 0.5, y: window.innerHeight * 0.4, scale: 0.4, rotate: 90, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 1.2, rotate: -360, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              🗝️✨
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Volumetric Golden Rays on Vault Opening */}
      <AnimatePresence>
        {isVaultOpening && (
          <>
            <motion.div
              className="volumetric-light-blast"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="sunray ray-1" />
              <div className="sunray ray-2" />
              <div className="sunray ray-3" />
              <div className="sunray ray-4" />
            </motion.div>

            {/* 3D Hydraulic Steam Jets on Vault Door Decompression */}
            <div className="vault-hydraulic-steam-container">
              <motion.div
                className="steam-puff steam-left"
                initial={{ scale: 0.2, x: 0, opacity: 0.9 }}
                animate={{ scale: 2.2, x: -160, opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                💨
              </motion.div>
              <motion.div
                className="steam-puff steam-right"
                initial={{ scale: 0.2, x: 0, opacity: 0.9 }}
                animate={{ scale: 2.2, x: 160, opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                💨
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isVaultOpening
            ? { rotateY: -65, x: -80, opacity: 0.85, transition: { duration: 1.2, ease: 'easeInOut' } }
            : isError
            ? { x: [-14, 14, -14, 14, 0], transition: { duration: 0.4 } }
            : { opacity: 1, scale: 1 }
        }
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className={`glass-card vault-card ${!isRibbonCut ? 'vault-locked-with-ribbon' : 'vault-unlocked'}`}
        style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
      >
        {/* Heavy 3D Steel Vault Bolts */}
        <div className={`vault-bolt bolt-top ${isVaultOpening ? 'bolt-retracted' : ''}`} />
        <div className={`vault-bolt bolt-bottom ${isVaultOpening ? 'bolt-retracted' : ''}`} />
        <div className={`vault-bolt bolt-left ${isVaultOpening ? 'bolt-retracted' : ''}`} />
        <div className={`vault-bolt bolt-right ${isVaultOpening ? 'bolt-retracted' : ''}`} />

        {/* 3D Cloth Ribbon Tie Overlay */}
        <RibbonTie
          isCutting={isCuttingRibbon}
          isCut={isRibbonCut}
          onCutComplete={onRibbonCutComplete}
        />

        {/* 3D Mechanical Vault Wheel & Lock System */}
        <div className={`lock-icon-wrap ${isSuccess ? 'unlocked' : ''} ${!isRibbonCut ? 'ribbon-locked' : ''} ${isVaultOpening ? 'vault-wheel-spinning' : ''}`}>
          {/* 3D Spoke Gear Wheel */}
          <div className="vault-spoke-gear">
            <div className="gear-spoke spoke-1" />
            <div className="gear-spoke spoke-2" />
            <div className="gear-spoke spoke-3" />
            <div className="gear-hub" />
          </div>
          {isRibbonCut ? <Key size={34} style={{ position: 'relative', zIndex: 10 }} /> : <Lock size={34} style={{ position: 'relative', zIndex: 10 }} />}
        </div>

        <h2 className="section-title">
          {isRibbonCut
            ? "Strict Sibling Security Check 🕵️‍♂️🔐"
            : "PIN Locked: Ribbon Cutting Required! 🎀🔒"}
        </h2>
        <p className="subtitle">
          {isRibbonCut
            ? "Ribbon cut! Enter the secret 4-digit PIN to open the vault door."
            : "Yeh portal locked hai! Pehle Shagun do, tabhi ribbon katega! 💸"}
        </p>

        {/* PIN Dots with 3D Morphing Emoji Avatars */}
        <div className="pin-display">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`pin-dot ${idx < pin.length ? 'filled' : ''} ${isError ? 'error' : ''} ${!isRibbonCut ? 'dot-disabled' : ''}`}
            >
              {idx < pin.length ? (
                <motion.span
                  initial={{ scale: 0, rotate: -60 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                  className="pin-emoji-dot"
                >
                  {isError ? '😱' : ['🙈', '🤫', '😋', '🎉'][idx]}
                </motion.span>
              ) : (
                <span className="dot-hollow" />
              )}
            </div>
          ))}
        </div>

        {/* Roast / Status Dialogue Box */}
        <div className={`roast-box ${isError ? 'shake-roast' : ''}`}>
          {!isRibbonCut ? (
            <>
              <Lock size={18} style={{ color: '#e11d48' }} />
              <span>👉 Click the cute girl on the side to pay Shagun & cut the ribbon! 🎀</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={20} style={{ color: '#059669' }} />
              <span>Access Granted! 4 Keys Inserted... Opening Vault! ❤️🎉</span>
            </>
          ) : isError ? (
            <>
              <AlertTriangle size={20} style={{ color: '#e11d48' }} />
              <span>{roastMessage}</span>
            </>
          ) : (
            <>
              <Lightbulb size={20} style={{ color: '#f59e0b' }} />
              <span>{roastMessage}</span>
            </>
          )}
        </div>

        {/* 3D Liquid Glass Bubble Keypad */}
        <div className={`keypad ${!isRibbonCut ? 'keypad-disabled' : ''}`}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              className="key key-3d-bubble"
              onClick={() => handleKeyInput(digit)}
              disabled={!isRibbonCut}
            >
              <span className="bubble-liquid" />
              <span className="key-digit-label">{digit}</span>
              <span className="bubble-specular" />
            </button>
          ))}
          <button
            className="key key-3d-bubble action-key"
            onClick={handleClear}
            title="Clear PIN"
            disabled={!isRibbonCut}
          >
            <span className="bubble-liquid" />
            <RotateCcw size={20} style={{ position: 'relative', zIndex: 5 }} />
            <span className="bubble-specular" />
          </button>
          <button
            className="key key-3d-bubble"
            onClick={() => handleKeyInput('0')}
            disabled={!isRibbonCut}
          >
            <span className="bubble-liquid" />
            <span className="key-digit-label">0</span>
            <span className="bubble-specular" />
          </button>
          <button
            className="key key-3d-bubble action-key"
            onClick={handleBackspace}
            title="Backspace"
            disabled={!isRibbonCut}
          >
            <span className="bubble-liquid" />
            <Delete size={20} style={{ position: 'relative', zIndex: 5 }} />
            <span className="bubble-specular" />
          </button>
        </div>
      </motion.div>

      {/* 2D/3D Pixar-Chibi Girl with Real-Time Head Tracking */}
      <ShagunGirl
        onClick={onRequestScanner}
        isUnlocked={isRibbonCut}
        isModalOpen={isScannerOpen}
      />
    </div>
  );
}
