import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export default function RibbonTie({ isCutting, isCut, onCutComplete }) {
  const [showDoveDelivery, setShowDoveDelivery] = useState(false);
  const [scissorsCut, setScissorsCut] = useState(false);

  useEffect(() => {
    if (isCutting && !isCut) {
      // 3D Dove with Scissors flies in from outside!
      setShowDoveDelivery(true);

      // Dove reaches center and snip happens
      setTimeout(() => {
        setScissorsCut(true);
        sounds.playSnip();

        // Confetti explosion at ribbon center
        confetti({
          particleCount: 85,
          spread: 85,
          origin: { x: 0.5, y: 0.45 }
        });

        // Ribbon slice falls away & Dove exits
        setTimeout(() => {
          setShowDoveDelivery(false);
          onCutComplete();
        }, 850);
      }, 800);
    }
  }, [isCutting, isCut, onCutComplete]);

  if (isCut) return null;

  return (
    <div className="ribbon-tie-overlay">
      {/* 3D Golden Dove Flying from Outside Delivering the Scissors */}
      <AnimatePresence>
        {showDoveDelivery && (
          <motion.div
            className="golden-dove-delivery"
            initial={{ x: 280, y: -220, scale: 0.5, rotate: -30, opacity: 0 }}
            animate={
              scissorsCut
                ? { x: -60, y: -80, scale: 0.8, rotate: -15, opacity: [1, 1, 0] }
                : { x: 10, y: -10, scale: 1.15, rotate: 5, opacity: 1 }
            }
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            {/* The 3D Flying Dove SVG */}
            <svg width="74" height="60" viewBox="0 0 100 80" fill="none" className="dove-svg">
              {/* Flapping Wings */}
              <path
                d="M50 40 C35 10 10 5 5 25 C15 35 35 45 50 40 Z"
                fill="#ffd700"
                stroke="#b45309"
                strokeWidth="2"
                className="flapping-wing-left"
              />
              <path
                d="M55 40 C70 10 95 5 100 25 C90 35 70 45 55 40 Z"
                fill="#ffd700"
                stroke="#b45309"
                strokeWidth="2"
                className="flapping-wing-right"
              />
              {/* Body */}
              <ellipse cx="50" cy="45" rx="18" ry="12" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />
              {/* Tail */}
              <polygon points="45,55 50,75 55,55" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Head & Beak holding scissors */}
              <circle cx="50" cy="32" r="9" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
              <polygon points="50,34 50,40 46,36" fill="#f59e0b" />
            </svg>

            {/* Golden Scissors in Beak */}
            <div className="scissors-in-beak">
              <svg width="55" height="55" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9C7.65685 9 9 7.65685 9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9Z"
                  fill="#ffd700"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z"
                  fill="#ffd700"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
                <path
                  d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"
                  stroke="#ffd700"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="2.5" fill="#f59e0b" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Ribbon Half with Elastic Spring Recoil */}
      <motion.div
        className={`ribbon-half ribbon-left ${scissorsCut ? 'recoil-curling' : ''}`}
        animate={
          scissorsCut
            ? {
                x: [-10, -230],
                y: [0, 85],
                rotate: [0, -65],
                scaleX: [1, 0.45],
                scaleY: [1, 1.45],
                opacity: [1, 1, 0],
                transition: { type: 'spring', stiffness: 380, damping: 16 }
              }
            : { x: 0, y: 0, rotate: 0, opacity: 1 }
        }
      >
        <div className="ribbon-fabric">
          <div className="ribbon-gold-trim trim-top" />
          <div className="ribbon-gold-trim trim-bottom" />
        </div>
        {/* Recoil Golden Thread Sparks */}
        {scissorsCut && <div className="ribbon-recoil-sparks sparks-left" />}
      </motion.div>

      {/* Right Ribbon Half with Elastic Spring Recoil */}
      <motion.div
        className={`ribbon-half ribbon-right ${scissorsCut ? 'recoil-curling' : ''}`}
        animate={
          scissorsCut
            ? {
                x: [10, 230],
                y: [0, 85],
                rotate: [0, 65],
                scaleX: [1, 0.45],
                scaleY: [1, 1.45],
                opacity: [1, 1, 0],
                transition: { type: 'spring', stiffness: 380, damping: 16 }
              }
            : { x: 0, y: 0, rotate: 0, opacity: 1 }
        }
      >
        <div className="ribbon-fabric">
          <div className="ribbon-gold-trim trim-top" />
          <div className="ribbon-gold-trim trim-bottom" />
        </div>
        {/* Recoil Golden Thread Sparks */}
        {scissorsCut && <div className="ribbon-recoil-sparks sparks-right" />}
      </motion.div>

      {/* Center Satin Bow Knot with 3D Orbital Shatter */}
      <motion.div
        className="ribbon-center-bow"
        animate={
          scissorsCut
            ? {
                scale: [1, 1.55, 0],
                opacity: [1, 1, 0],
                rotate: [0, 180, 360],
                transition: { duration: 0.62, ease: 'easeOut' }
              }
            : { scale: 1, opacity: 1 }
        }
      >
        <div className="bow-loop loop-left" />
        <div className="bow-loop loop-right" />
        <div className="bow-center-knot">
          <span className="knot-gem">🎀</span>
        </div>
        <div className="bow-tail tail-left" />
        <div className="bow-tail tail-right" />
      </motion.div>
    </div>
  );
}
