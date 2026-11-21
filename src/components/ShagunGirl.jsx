import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function ShagunGirl({ onClick, isUnlocked, isModalOpen }) {
  const [headTilt, setHeadTilt] = useState({ rotateX: 0, rotateY: 0, pupilX: 0, pupilY: 0 });
  const [isWinking, setIsWinking] = useState(false);

  // 3D Head & Eye Cursor Tracking
  useEffect(() => {
    const onMouseMove = (e) => {
      const girlAnchorX = window.innerWidth * 0.88;
      const girlAnchorY = window.innerHeight * 0.72;
      const dx = (e.clientX - girlAnchorX) / window.innerWidth;
      const dy = (e.clientY - girlAnchorY) / window.innerHeight;

      // Gentle, lifelike rotations
      const rotY = Math.max(-18, Math.min(18, dx * 36));
      const rotX = Math.max(-12, Math.min(12, -dy * 24));
      const pX = Math.max(-2.8, Math.min(2.8, dx * 6.5));
      const pY = Math.max(-2.0, Math.min(2.0, dy * 4.5));

      setHeadTilt({ rotateX: rotX, rotateY: rotY, pupilX: pX, pupilY: pY });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Winking & Blinking animation interval
  useEffect(() => {
    const winkTimer = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 350);
    }, 4200);

    return () => clearInterval(winkTimer);
  }, []);

  if (isModalOpen) return null;

  return (
    <motion.div
      className="shagun-girl-container peeking-3d-girl"
      initial={{ x: 230, opacity: 0, y: 40 }}
      animate={{ x: 0, opacity: 1, y: 0 }}
      exit={{ x: 230, opacity: 0 }}
      transition={{ type: 'spring', damping: 16, stiffness: 160 }}
      onClick={onClick}
      title="Click me for Shagun QR Scanner!"
    >
      {/* Speech Bubble */}
      <motion.div
        className="girl-speech-bubble"
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', damping: 14 }}
      >
        <span className="speech-badge">
          <Heart size={12} fill="#ff3377" color="#ff3377" /> Sibling Shagun Patrol
        </span>
        <p className="speech-text">
          {isUnlocked
            ? "Yay! Shagun mil gaya! Ab PIN dalo Didi & Jiju! 🎉🔓"
            : "Ahem ahem! Jiju, pehle Shagun do, tabhi ribbon katega! 😜💸"}
        </p>
        {!isUnlocked && (
          <span className="speech-click-hint">
            <Sparkles size={13} /> Click me for QR Scanner! 👇
          </span>
        )}
        <div className="bubble-pointer" />
      </motion.div>

      {/* 3D Pixar-Chibi Styled Girl with Real-Time Head/Eye Tracking */}
      <div className="girl-avatar-wrapper" style={{ perspective: 700 }}>
        <svg
          className="girl-svg"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Hair Buns with Jasmine Flower Gajra */}
          <g className="hair-buns-group">
            {/* Left Bun */}
            <circle cx="48" cy="52" r="19" fill="#1f1118" />
            <circle cx="48" cy="52" r="14" fill="#2d1520" />
            {/* Jasmine Gajra flowers */}
            <circle cx="34" cy="48" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
            <circle cx="42" cy="38" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
            <circle cx="54" cy="36" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
            <circle cx="63" cy="44" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />

            {/* Right Bun */}
            <circle cx="152" cy="52" r="19" fill="#1f1118" />
            <circle cx="152" cy="52" r="14" fill="#2d1520" />
            {/* Jasmine Gajra flowers */}
            <circle cx="137" cy="44" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
            <circle cx="146" cy="36" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
            <circle cx="158" cy="38" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
            <circle cx="166" cy="48" r="4.5" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
          </g>

          {/* Lehenga Body */}
          <path d="M58 140 L142 140 L165 235 L35 235 Z" fill="url(#pixarLehenga)" />
          {/* Gold lace borders */}
          <path d="M35 228 L165 228 L165 235 L35 235 Z" fill="#ffd700" />
          <path d="M38 217 L162 217 L162 222 L38 222 Z" fill="#facc15" />
          <path d="M42 208 L158 208 L158 212 L42 212 Z" fill="#ffd700" />

          {/* Choli (Blouse) */}
          <path d="M70 135 L130 135 L126 166 L74 166 Z" fill="#be185d" />

          {/* Neck */}
          <rect x="89" y="115" width="22" height="25" rx="6" fill="#ffd1b3" />
          {/* Golden Necklace */}
          <path d="M85 130 Q100 142 115 130" stroke="#ffd700" strokeWidth="3" fill="none" />
          <circle cx="100" cy="138" r="3" fill="#e11d48" stroke="#ffd700" strokeWidth="1" />

          {/* 3D Tracked Head Group */}
          <g
            style={{
              transformOrigin: '100px 80px',
              transform: `perspective(400px) rotateX(${headTilt.rotateX}deg) rotateY(${headTilt.rotateY}deg)`,
              transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Soft 3D Face */}
            <path d="M64 74 C64 38 136 38 136 74 C136 116 64 116 64 74 Z" fill="url(#faceSkinGrad)" />

            {/* Glowing Rosy Cheeks */}
            <ellipse cx="76" cy="88" rx="9" ry="5.5" fill="#f472b6" opacity="0.65" />
            <ellipse cx="124" cy="88" rx="9" ry="5.5" fill="#f472b6" opacity="0.65" />

            {/* Anime Eyes with Blinking & Winking */}
            {isWinking ? (
              <>
                {/* Left eye winking 😉 */}
                <path d="M72 80 Q80 88 88 80" stroke="#4a044e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M74 76 L71 73 M86 76 L89 73" stroke="#4a044e" strokeWidth="2" strokeLinecap="round" />
                {/* Right eye open */}
                <ellipse cx="120" cy="78" rx="7.5" ry="9" fill="#1e1b4b" />
                <circle cx="118" cy="75" r="2.8" fill="#ffffff" />
                <circle cx="122" cy="81" r="1.3" fill="#ffffff" />
              </>
            ) : (
              <>
                <ellipse cx="80" cy="78" rx="7.5" ry="9" fill="#1e1b4b" />
                <ellipse cx="120" cy="78" rx="7.5" ry="9" fill="#1e1b4b" />
                {/* Pupils */}
                <g transform={`translate(${headTilt.pupilX}, ${headTilt.pupilY})`}>
                  <circle cx="79" cy="77" r="4.8" fill="#4a044e" />
                  <circle cx="119" cy="77" r="4.8" fill="#4a044e" />
                  <circle cx="77.5" cy="74.5" r="2.8" fill="#ffffff" />
                  <circle cx="82" cy="80" r="1.3" fill="#ffffff" />
                  <circle cx="117.5" cy="74.5" r="2.8" fill="#ffffff" />
                  <circle cx="122" cy="80" r="1.3" fill="#ffffff" />
                </g>
              </>
            )}

            {/* Eyebrows & Smile */}
            <path d="M73 66 Q80 62 87 66" stroke="#2d1520" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M113 66 Q120 62 127 66" stroke="#2d1520" strokeWidth="2.2" strokeLinecap="round" />
            <path
              d="M92 92 Q100 102 108 92"
              stroke="#be185d"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="#f43f5e"
            />

            {/* Sparkle Bindi */}
            <circle cx="100" cy="67" r="2.4" fill="#e11d48" />
            <circle cx="100" cy="67" r="1.2" fill="#ffd700" />

            {/* 3D Swaying Jhumkas with Pendular Sway */}
            <g className="swaying-jhumka-left">
              <path d="M62 82 L57 93 L67 93 Z" fill="#ffd700" stroke="#b45309" strokeWidth="0.8" />
              <circle cx="62" cy="95" r="2.5" fill="#facc15" />
            </g>
            <g className="swaying-jhumka-right">
              <path d="M138 82 L133 93 L143 93 Z" fill="#ffd700" stroke="#b45309" strokeWidth="0.8" />
              <circle cx="138" cy="95" r="2.5" fill="#facc15" />
            </g>

            {/* Cute Front Bangs */}
            <path
              d="M62 70 C65 28 135 28 138 70 C135 52 120 48 100 50 C80 48 65 52 62 70 Z"
              fill="#1f1118"
            />
          </g>

          {/* Dupatta Draped */}
          <path
            d="M60 135 C48 170 48 200 50 230 C56 232 62 225 64 210 C60 180 70 150 76 140 Z"
            fill="#f472b6"
            opacity="0.88"
          />
          <path
            d="M140 135 C152 170 152 200 150 230 C144 232 138 225 136 210 C140 180 130 150 124 140 Z"
            fill="#f472b6"
            opacity="0.88"
          />

          {/* Waving Right Hand with Bangles */}
          <g className="waving-hand">
            <path
              d="M130 145 C152 130 162 115 172 95 C175 90 180 92 178 98 C172 115 160 140 142 160 Z"
              fill="#ffd1b3"
            />
            <rect x="163" y="102" width="8" height="4" rx="2" fill="#ffd700" transform="rotate(-30 163 102)" />
            <rect x="166" y="106" width="8" height="3" rx="1.5" fill="#e11d48" transform="rotate(-30 166 106)" />
          </g>

          {/* 3D Brass Pooja/Shagun Thali with Flickering Diya Flame */}
          <g transform="translate(34, 140)">
            {/* Brass Thali */}
            <ellipse cx="26" cy="20" rx="25" ry="11" fill="url(#brassThaliGrad)" stroke="#ffd700" strokeWidth="2" />
            <ellipse cx="26" cy="19" rx="20" ry="8" fill="#fef08a" />
            
            {/* Diya Base */}
            <ellipse cx="26" cy="18" rx="7" ry="3.5" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            
            {/* Flickering Flame with Embers */}
            <g className="flickering-diya-flame">
              <path
                d="M26 8 C23 13 23 16 26 18 C29 16 29 13 26 8 Z"
                fill="url(#diyaFlameGrad)"
              />
              <circle cx="26" cy="15" r="2.2" fill="#ffffff" />
            </g>

            {/* Shagun Envelopes & Coins on Thali */}
            <rect x="8" y="13" width="14" height="9" rx="1" fill="#dc2626" transform="rotate(-15 8 13)" />
            <circle cx="40" cy="18" r="4" fill="#ffd700" stroke="#b45309" strokeWidth="0.8" />
            <text x="38" y="20" fontSize="5" fontWeight="bold" fill="#78350f">₹</text>
          </g>

          <defs>
            <linearGradient id="pixarLehenga" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff1493" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#9d174d" />
            </linearGradient>
            <linearGradient id="faceSkinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff1e6" />
              <stop offset="100%" stopColor="#ffd1b3" />
            </linearGradient>
            <linearGradient id="brassThaliGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
            <linearGradient id="diyaFlameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulsing 3D Indicator Tag */}
        {!isUnlocked && (
          <div className="click-me-pulse-tag">
            <span>Tap for Shagun! 💸✨</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
