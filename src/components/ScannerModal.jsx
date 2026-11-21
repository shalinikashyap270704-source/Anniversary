import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Wallet, Smile, Sparkles, Copy, Check, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import { QR_MATRIX, UPI_STRING } from '../utils/qrCodeData';

export default function ScannerModal({ isOpen, onComplete }) {
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [copied, setCopied] = useState(false);
  const radius = 19;
  const totalCircumference = 2 * Math.PI * radius; // approx 119.38

  useEffect(() => {
    if (!isOpen) return;
    setSecondsRemaining(15);
    setCopied(false);
    sounds.playRomanticChime();

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSuccess("Timer Finished! Sibling concession applied! Free Entry! 😂🎉");
          return 0;
        }
        if (prev <= 5) {
          sounds.playTap();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCopyUpi = () => {
    sounds.playTap();
    if (navigator.clipboard) {
      navigator.clipboard.writeText("anniversary.shagun@upi");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSuccess = (msg) => {
    sounds.playCoin();
    confetti({
      particleCount: 130,
      spread: 95,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  if (!isOpen) return null;

  const progress = secondsRemaining / 15;
  const strokeDashoffset = totalCircumference * (1 - progress);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Cute Rupee Paper Airplanes floating outside screen */}
        <motion.div
          className="flying-rupee-plane plane-1"
          initial={{ x: -260, y: -90, rotate: -20, opacity: 0 }}
          animate={{ x: 0, y: [0, -8, 0], rotate: [0, 8, -4, 0], opacity: 1 }}
          transition={{
            x: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
            y: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
            opacity: { duration: 0.8 }
          }}
        >
          <div className="plane-body">
            <span className="rupee-text">₹2000 ✈️</span>
          </div>
        </motion.div>

        <motion.div
          className="flying-rupee-plane plane-2"
          initial={{ x: 260, y: -70, rotate: 20, opacity: 0 }}
          animate={{ x: 0, y: [0, 8, 0], rotate: [0, -8, 4, 0], opacity: 1 }}
          transition={{
            x: { duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
            y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 4.8, ease: 'easeInOut' },
            opacity: { duration: 0.8 }
          }}
        >
          <div className="plane-body">
            <span className="rupee-text">₹500 ✈️</span>
          </div>
        </motion.div>

        {/* 3D Shagun Cyclone Vortex: 6 3D Currency Cards Tumbling Around the Modal */}
        <div className="shagun-cyclone-vortex-layer">
          {[
            { id: 'sc1', deg: 0, text: '₹2000 💵', dur: 7 },
            { id: 'sc2', deg: 60, text: '₹500 💸', dur: 8 },
            { id: 'sc3', deg: 120, text: 'Shagun 💌', dur: 6.5 },
            { id: 'sc4', deg: 180, text: '₹2000 💵', dur: 7.2 },
            { id: 'sc5', deg: 240, text: '₹500 💸', dur: 8.5 },
            { id: 'sc6', deg: 300, text: 'Pizza Treat 🍕', dur: 6.8 }
          ].map((item) => (
            <div
              key={item.id}
              className="shagun-vortex-card-3d"
              style={{
                animationDuration: `${item.dur}s`,
                transform: `rotate(${item.deg}deg) translateX(min(45vw, 360px))`
              }}
            >
              <div className="vortex-note-body">
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          className="scanner-modal-card compact-modal-card"
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        >
          {/* Toll Header */}
          <div className="toll-header">
            <span className="toll-badge">
              <Gift size={13} style={{ display: 'inline', marginRight: 4 }} /> SHAGUN TOLL PLAZA 🎁
            </span>
            <span className="live-tag">
              <span className="dot" /> 100% SCANNABLE UPI 💸
            </span>
          </div>

          <h2 className="qr-heading">
            Agar Aage Dekhna Hai...<br />
            <span className="gradient-text">Toh Shagun Dena Padega! 💸🍕</span>
          </h2>
          <p className="qr-desc">
            Didi & Jiju: Phone camera ya kisi bhi UPI app se scan karo! 😉
          </p>

          {/* Clean, Flat, 100% Scannable QR Code Card */}
          <div className="scannable-qr-container">
            <div className="scannable-qr-card">
              {/* Corner Viewfinder Brackets */}
              <div className="corner-bracket corner-tl" />
              <div className="corner-bracket corner-tr" />
              <div className="corner-bracket corner-bl" />
              <div className="corner-bracket corner-br" />

              {/* Sci-Fi Luxury Holographic 3D Laser Grid Sweep */}
              <div className="scanner-laser-line holographic-laser-sweep" />
              <div className="scanner-hologram-grid" />
              <div className="hologram-shimmer-badge">
                <Sparkles size={11} /> 100% SIBLING VERIFIED
              </div>

              {/* Real 47x47 Crisp SVG QR Code */}
              <div className="qr-svg-wrapper">
                <svg
                  className="qr-code-svg"
                  viewBox={`0 0 ${QR_MATRIX.length} ${QR_MATRIX.length}`}
                  shapeRendering="crispEdges"
                >
                  <rect width={QR_MATRIX.length} height={QR_MATRIX.length} fill="#ffffff" />
                  {QR_MATRIX.map((row, r) =>
                    row.map((cell, c) =>
                      cell ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width={1}
                          height={1}
                          fill="#181826"
                        />
                      ) : null
                    )
                  )}
                </svg>

                {/* Subtle Centered Treat Logo */}
                <div className="qr-center-pill">
                  <span>🍕</span>
                </div>
              </div>
            </div>

            {/* UPI Apps Row */}
            <div className="upi-apps-row">
              <span className="app-badge gpay">GPay</span>
              <span className="app-badge phonepe">PhonePe</span>
              <span className="app-badge paytm">Paytm</span>
              <span className="app-badge bhim">BHIM UPI</span>
            </div>

            {/* UPI ID Pill with 1-Click Copy */}
            <div className="upi-id-copy-row" onClick={handleCopyUpi} title="Click to copy UPI ID">
              <span className="upi-label">UPI ID:</span>
              <span className="upi-address">anniversary.shagun@upi</span>
              <button className="copy-btn" type="button" aria-label="Copy UPI ID">
                {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                <span>{copied ? "Copied! 🎉" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* 15-second progress ring (Compact) */}
          <div className="shagun-timer-container">
            <div className="circular-timer">
              <svg className="progress-ring" width="46" height="46">
                <circle
                  stroke="rgba(244, 114, 182, 0.22)"
                  strokeWidth="3.5"
                  fill="transparent"
                  r={radius}
                  cx="23"
                  cy="23"
                />
                <circle
                  stroke="#ff3377"
                  strokeWidth="3.5"
                  fill="transparent"
                  r={radius}
                  cx="23"
                  cy="23"
                  style={{
                    strokeDasharray: totalCircumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 1s linear'
                  }}
                />
              </svg>
              <span className="timer-countdown-text">{secondsRemaining}</span>
            </div>
            <div className="timer-info-text">
              <strong>Sibling Discount Active... ⏱️</strong>
              <p>Wait {secondsRemaining}s ya treat pakki karo! 🍕</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shagun-actions">
            <button
              className="shagun-btn primary-btn"
              onClick={() => handleSuccess("Treat Guaranteed! ₹1001 Shagun credited! 🍕❤️")}
            >
              <Wallet size={16} /> Shagun De Diya! (Treat Guaranteed) 🍕💸
            </button>
            <button
              className="shagun-btn secondary-btn"
              onClick={() => handleSuccess("Kanjoosi Award Unlocked! Aage badho Didi & Jiju! 😜")}
            >
              <Smile size={16} /> Hum Kanjoos Hain (Skip Timer) 🙈
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
