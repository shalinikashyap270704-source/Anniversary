import React from 'react';

export default function TimelineBirdGraphic({ type = 'female', isFlapping = true }) {
  // Color Palettes
  // female: Rose Pink & Magenta Swallow
  // male: Royal Sapphire & Electric Cyan Swallow
  // couple: Radiant Golden & Pearl White Dove
  
  if (type === 'couple') {
    // 🕊️ Golden Celestial Dove
    return (
      <svg
        className={`bird-svg-element dove-type ${isFlapping ? 'flapping' : 'perched'}`}
        viewBox="0 0 120 100"
        width="86"
        height="72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="doveGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="doveWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="doveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#doveGlow)">
          {/* Back Wing (Behind Body) */}
          <g className="wing-back">
            <path
              d="M 52 46 C 42 22 22 8 8 16 C 4 28 14 42 34 50 C 44 54 50 50 52 46 Z"
              fill="url(#doveWingGrad)"
              stroke="#b45309"
              strokeWidth="1.2"
              opacity="0.9"
            />
            {/* Feathers layering */}
            <path d="M 12 18 C 18 28 26 38 42 46" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
            <path d="M 18 24 C 24 33 32 40 46 48" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
          </g>

          {/* Fanned Tail */}
          <path
            d="M 68 56 C 82 62 102 70 108 84 C 98 84 84 76 72 66 C 70 62 68 58 68 56 Z"
            fill="url(#doveGoldGrad)"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          <path d="M 76 60 C 88 68 100 76 104 82" stroke="#d97706" strokeWidth="1" strokeLinecap="round" />
          <path d="M 74 64 C 84 70 94 76 98 82" stroke="#d97706" strokeWidth="1" strokeLinecap="round" />

          {/* Dove Body & Head */}
          <path
            d="M 32 40 C 26 32 30 22 38 20 C 46 18 52 24 56 32 C 64 36 74 44 72 56 C 70 64 58 68 46 66 C 36 64 30 52 32 40 Z"
            fill="url(#doveGoldGrad)"
            stroke="#b45309"
            strokeWidth="1.4"
          />

          {/* Breast Soft Highlight */}
          <path
            d="M 36 28 C 34 36 36 46 44 56 C 40 54 36 48 34 40 Z"
            fill="#ffffff"
            opacity="0.8"
          />

          {/* Beak & Olive Leaf */}
          <polygon points="26,24 16,26 25,28" fill="#d97706" stroke="#92400e" strokeWidth="0.8" />
          <circle cx="21" cy="23" r="2.5" fill="#10b981" />
          <path d="M 21 23 Q 18 19 22 17 Q 24 21 21 23 Z" fill="#34d399" />

          {/* Dove Eye */}
          <circle cx="34" cy="24" r="2.8" fill="#1e1b4b" />
          <circle cx="33.2" cy="23.2" r="1" fill="#ffffff" />

          {/* Front Wing (In Front of Body) */}
          <g className="wing-front">
            <path
              d="M 46 44 C 40 18 56 4 74 2 C 78 14 74 30 58 44 C 52 48 48 46 46 44 Z"
              fill="url(#doveWingGrad)"
              stroke="#b45309"
              strokeWidth="1.3"
            />
            {/* Wing Feather Ribs */}
            <path d="M 66 10 C 66 22 62 34 52 42" stroke="#d97706" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M 60 16 C 60 26 56 36 48 44" stroke="#d97706" strokeWidth="1.1" strokeLinecap="round" />
          </g>

          {/* Little Perching Feet (visible when perched) */}
          <g className="bird-feet">
            <line x1="48" y1="66" x2="48" y2="74" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="45" y1="74" x2="52" y2="74" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="56" y1="65" x2="56" y2="74" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="53" y1="74" x2="60" y2="74" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  const isFemale = type === 'female';
  const gradId = isFemale ? 'swallowPinkGrad' : 'swallowBlueGrad';
  const wingGradId = isFemale ? 'swallowPinkWing' : 'swallowBlueWing';
  const strokeColor = isFemale ? '#9d174d' : '#0369a1';
  const accentColor = isFemale ? '#ff3377' : '#0ea5e9';
  const glowColor = isFemale ? 'rgba(255, 51, 119, 0.45)' : 'rgba(14, 165, 233, 0.45)';

  // 🌸 Female or 💙 Male Majestic Swallow with Forked Tail
  return (
    <svg
      className={`bird-svg-element swallow-type ${isFlapping ? 'flapping' : 'perched'}`}
      viewBox="0 0 120 100"
      width="84"
      height="70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {isFemale ? (
          <>
            <linearGradient id="swallowPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdf2f8" />
              <stop offset="35%" stopColor="#f472b6" />
              <stop offset="75%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
            <linearGradient id="swallowPinkWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </>
        ) : (
          <>
            <linearGradient id="swallowBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="75%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
            <linearGradient id="swallowBlueWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </>
        )}

        <filter id={`swallowGlow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={glowColor} floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter={`url(#swallowGlow-${type})`}>
        {/* Back Wing (Behind Body) */}
        <g className="wing-back">
          <path
            d="M 50 44 C 38 18 16 6 4 14 C 2 26 14 38 34 46 C 42 50 48 48 50 44 Z"
            fill={`url(#${wingGradId})`}
            stroke={strokeColor}
            strokeWidth="1.2"
            opacity="0.9"
          />
          <path d="M 8 16 C 16 26 26 36 40 44" stroke={accentColor} strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Forked Swallow Tail (Iconic Scissor Tail) */}
        <path
          d="M 68 54 C 80 62 100 76 112 92 C 102 88 92 80 84 76 C 88 84 94 94 98 100 C 86 86 76 72 68 62 Z"
          fill={`url(#${gradId})`}
          stroke={strokeColor}
          strokeWidth="1.2"
        />

        {/* Swallow Body & Head */}
        <path
          d="M 32 38 C 26 30 30 20 38 18 C 46 16 52 22 56 30 C 64 34 74 42 72 54 C 70 62 58 66 46 64 C 36 62 30 50 32 38 Z"
          fill={`url(#${gradId})`}
          stroke={strokeColor}
          strokeWidth="1.4"
        />

        {/* Soft Creamy Breast Highlight */}
        <path
          d="M 35 26 C 33 34 35 44 43 54 C 39 52 35 46 33 38 Z"
          fill="#ffffff"
          opacity="0.85"
        />

        {/* Slender Pointed Beak */}
        <polygon points="26,22 14,24 24,27" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />

        {/* Glossy Eye */}
        <circle cx="34" cy="22" r="2.8" fill="#1e1b4b" />
        <circle cx="33.2" cy="21.2" r="1" fill="#ffffff" />

        {/* Front Wing (In Front of Body) */}
        <g className="wing-front">
          <path
            d="M 46 42 C 40 16 58 2 76 0 C 80 12 76 28 58 42 C 52 46 48 44 46 42 Z"
            fill={`url(#${wingGradId})`}
            stroke={strokeColor}
            strokeWidth="1.3"
          />
          <path d="M 68 8 C 68 20 64 32 52 40" stroke={accentColor} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M 60 14 C 60 24 56 34 46 42" stroke={accentColor} strokeWidth="1.1" strokeLinecap="round" />
        </g>

        {/* Tiny Perching Claws */}
        <g className="bird-feet">
          <line x1="48" y1="64" x2="48" y2="72" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="45" y1="72" x2="52" y2="72" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="56" y1="63" x2="56" y2="72" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="53" y1="72" x2="60" y2="72" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
