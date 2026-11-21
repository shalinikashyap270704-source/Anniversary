import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import TimelineBirdGraphic from './TimelineBirdGraphic';
import { sounds } from '../utils/audio';

export default function AnimatedTimelineBird({
  milestone,
  isReached,
  onPhotoClick,
  threadType, // 'female' | 'male' | 'couple'
  scrollWindAngle = 0
}) {
  // Stages: 'hidden' -> 'flying' -> 'perched' -> 'photo'
  const [stage, setStage] = useState('hidden');
  const [isHovered, setIsHovered] = useState(false);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 });
  const triggeredRef = useRef(false);

  // 3D Interactive Card Tilt on Mouse Move
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({
      rx: -relY * 18,
      ry: relX * 18
    });
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setCardTilt({ rx: 0, ry: 0 });
  };

  useEffect(() => {
    if (isReached && !triggeredRef.current) {
      triggeredRef.current = true;
      setStage('flying');
      sounds.playBirdChirp();

      // Step 1: Perch on thread after flight (850ms)
      const perchTimer = setTimeout(() => {
        setStage('perched');
      }, 850);

      // Step 2: Trigger 3D Metamorphosis into Photo after perching (1700ms)
      const morphTimer = setTimeout(() => {
        setStage('photo');
        sounds.playHarpArpeggio();

        // Confetti starburst at the metamorphosis point
        confetti({
          particleCount: 26,
          spread: 55,
          startVelocity: 16,
          ticks: 60,
          origin: {
            x: Math.min(0.9, Math.max(0.1, (milestone.x - window.scrollX) / window.innerWidth)),
            y: Math.min(0.85, Math.max(0.15, milestone.y / window.innerHeight))
          },
          colors: threadType === 'female'
            ? ['#ff77aa', '#ff3377', '#ffd700']
            : threadType === 'male'
            ? ['#38bdf8', '#0ea5e9', '#ffd700']
            : ['#ffd700', '#f59e0b', '#ffffff']
        });
      }, 1700);

      return () => {
        clearTimeout(perchTimer);
        clearTimeout(morphTimer);
      };
    }
  }, [isReached]); // Only triggered once by isReached!

  if (stage === 'hidden') {
    return (
      <div
        className="timeline-anchor-ghost"
        style={{ position: 'absolute', left: milestone.x, top: milestone.y }}
      />
    );
  }

  const isPhoto = stage === 'photo';

  return (
    <div
      className={`timeline-milestone-node type-${threadType}`}
      style={{
        position: 'absolute',
        left: milestone.x,
        top: milestone.y,
        zIndex: isPhoto ? (isHovered ? 160 : 60) : 120
      }}
    >
      <AnimatePresence mode="wait">
        {!isPhoto ? (
          // ==========================================
          // 🕊️ STAGE 1 & 2: THE MAJESTIC BIRD
          // ==========================================
          <motion.div
            key="bird-perch"
            className="flying-timeline-bird"
            initial={{
              y: -window.innerHeight * 0.45 - 80,
              x: -120,
              scale: 0.65,
              rotateZ: 30,
              opacity: 0
            }}
            animate={
              stage === 'flying'
                ? {
                    y: -30,
                    x: -42,
                    scale: 1,
                    rotateZ: [30, -10, 4, 0],
                    opacity: 1
                  }
                : {
                    // Perched on thread
                    y: -32,
                    x: -42,
                    scale: [1, 1.05, 1],
                    rotateZ: 0,
                    opacity: 1
                  }
            }
            exit={{
              // 3D Metamorphosis Spin Out!
              scale: [1, 1.25, 0],
              rotateY: 180,
              opacity: 0,
              transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            }}
            transition={{
              duration: stage === 'flying' ? 0.85 : 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {/* Sparkle Trail while flying */}
            {stage === 'flying' && (
              <div className="bird-flight-trail">
                <span className="trail-sparkle s1">✨</span>
                <span className="trail-sparkle s2">🌸</span>
              </div>
            )}

            {/* Fairy Dust Halo on Perch & Falling Sparks */}
            {stage === 'perched' && (
              <div className="bird-magic-burst">
                <div className="burst-halo-ring" />
                <Sparkles size={34} color="#ffd700" />
                {/* 3D Paper Origami Unfolding Wings */}
                <div className="origami-wings-unfolding-layer">
                  <div className="origami-fold-wing fold-left" />
                  <div className="origami-fold-wing fold-right" />
                </div>
                {/* 6 Falling Golden Stardust Sparks */}
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <span
                    key={`dust-${idx}`}
                    className="falling-fairy-dust"
                    style={{
                      left: `${-15 + idx * 7}px`,
                      animationDelay: `${idx * 0.12}s`,
                      animationDuration: '1.4s'
                    }}
                  >
                    ✨
                  </span>
                ))}
              </div>
            )}

            <TimelineBirdGraphic
              type={threadType}
              isFlapping={stage === 'flying'}
            />
          </motion.div>
        ) : (
          // ==========================================
          // 📸 STAGE 3: THE HANGING POLAROID PHOTO
          // With 3D Inertia Wind-Sway + Mouse Tilt & Glare
          // ==========================================
          <motion.div
            key="polaroid-photo"
            className={`hanging-polaroid-wrapper ${isHovered ? 'hovered' : ''}`}
            initial={{ scale: 0.25, rotateY: -180, opacity: 0 }}
            animate={{
              scale: isHovered ? 1.08 : 1,
              rotateY: isHovered ? cardTilt.ry : 0,
              rotateX: isHovered ? cardTilt.rx : 0,
              rotateZ: isHovered
                ? cardTilt.ry * 0.2
                : scrollWindAngle !== 0
                ? scrollWindAngle
                : [-2.5, 2.5, -2.5],
              opacity: 1
            }}
            transition={{
              scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              rotateY: { duration: isHovered ? 0.08 : 0.6, ease: 'easeOut' },
              rotateX: { duration: isHovered ? 0.08 : 0.6, ease: 'easeOut' },
              rotateZ: {
                repeat: isHovered || scrollWindAngle !== 0 ? 0 : Infinity,
                duration: 4.8,
                ease: 'easeInOut'
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            onClick={() => onPhotoClick(milestone)}
          >
            {/* Golden Clothespin Clip */}
            <div className="photo-thread-clip">
              <div className="clip-pin" />
              <div className="clip-string" />
            </div>

            {/* 3D Polaroid Paper Frame */}
            <div
              className="polaroid-frame-3d"
              style={{
                transform: isHovered
                  ? `perspective(800px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`
                  : 'perspective(800px) rotateX(0deg) rotateY(0deg)'
              }}
            >
              {/* Dynamic 3D Holographic Glare */}
              <div
                className="specular-gloss dynamic-glare"
                style={{
                  opacity: isHovered ? 0.8 : 0,
                  transform: `translate(${cardTilt.ry * 2.5}px, ${cardTilt.rx * 2.5}px) rotate(30deg)`
                }}
              />

              <div className="photo-media-container">
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="polaroid-img"
                  loading="eager"
                  onError={(e) => {
                    if (milestone.fallbackSvg) {
                      e.target.src = milestone.fallbackSvg;
                    }
                  }}
                />
                <span className="photo-badge-tag">{milestone.tag}</span>
                <div className="click-to-view-hint">
                  <Eye size={12} /> Click to Read Note
                </div>
              </div>

              {/* Caption */}
              <div className="polaroid-caption-box">
                <h4 className="caption-title">{milestone.title}</h4>
                <p className="caption-desc">{milestone.desc}</p>
                <div className="caption-footer">
                  <span className="sibling-heart-stamp">
                    <Heart size={11} fill="#ff3377" color="#ff3377" /> Memorable
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
