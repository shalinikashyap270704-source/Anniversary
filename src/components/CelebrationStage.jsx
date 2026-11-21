import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, BarChart3, Wand2, RotateCw, Heart, Sparkles, Umbrella, Home, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export default function CelebrationStage({ onLaunchLanterns, onEmojiFountain, onRestart }) {
  useEffect(() => {
    sounds.playSuccess();

    // Multi-cannon fireworks confetti burst
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="celebration-hero"
    >
      {/* 365-Days Survival Trophy */}
      <div className="trophy-badge">
        <Award size={36} className="trophy-icon" />
        <div className="trophy-info">
          <span className="trophy-title">1-Year Survival Trophy 🏆✨</span>
          <span className="trophy-sub">
            Successfully survived 365 days of each other's crazy drama! 😂
          </span>
        </div>
      </div>

      <h1 className="anniversary-headline">Happy 1st Anniversary Didi & Jiju! ❤️🎉</h1>
      <p className="celebration-sub">
        365 Days of Love, Fights over TV Remote, and Pure Wholesome Moments ✨🥂
      </p>

      {/* Household Audit Meters */}
      <div className="fun-meters-card">
        <h3 className="fun-meter-title">
          <BarChart3 size={22} style={{ color: '#ff3377' }} />
          The Official 1-Year Household Audit 📊🤣
        </h3>

        <div className="meter-item">
          <div className="meter-label">
            <span>Who apologizes first?</span>
            <strong className="winner-tag">Jiju (99.9%) 🙇‍♂️</strong>
          </div>
          <div className="meter-bar">
            <div className="bar-fill jiju-fill" style={{ width: '90%' }}>
              Jiju 🙇‍♂️
            </div>
            <div className="bar-fill didi-fill" style={{ width: '10%' }}>
              Didi 💅
            </div>
          </div>
        </div>

        <div className="meter-item">
          <div className="meter-label">
            <span>Getting ready for party:</span>
            <strong className="winner-tag">Didi (2.5 hrs vs Jiju 5 mins) 💄⏱️</strong>
          </div>
          <div className="meter-bar">
            <div className="bar-fill didi-fill" style={{ width: '85%' }}>
              Didi's Makeup 💄
            </div>
            <div className="bar-fill jiju-fill" style={{ width: '15%' }}>
              Jiju ⏱️
            </div>
          </div>
        </div>

        <div className="meter-item">
          <div className="meter-label">
            <span>Who decides dinner menu?</span>
            <strong className="winner-tag">"Kuch bhi mangwa lo" (Both) 🍕</strong>
          </div>
          <div className="meter-bar">
            <div className="bar-fill shared-fill" style={{ width: '100%' }}>
              Zomato & Swiggy 🍕🍔
            </div>
          </div>
        </div>
      </div>

      {/* Fairy Light Wire & Swinging Polaroids */}
      <div className="polaroid-gallery">
        <div className="fairy-light-wire">
          <span className="bulb b1" />
          <span className="bulb b2" />
          <span className="bulb b3" />
          <span className="bulb b4" />
          <span className="bulb b5" />
          <span className="bulb b6" />
        </div>

        <h2 className="gallery-title">Our Favorite Moments With You 📸💕</h2>
        <p className="gallery-hint">(Tap or hover on each photo to reveal cute sibling notes!)</p>

        <div className="cards-deck">
          {/* Card 1 */}
          <div className="polaroid-card card-1" tabIndex={0}>
            <div className="cloth-pin" />
            <div className="polaroid-inner">
              <div className="polaroid-front">
                <div className="photo-placeholder photo-wedding">
                  <Heart size={48} className="center-icon" />
                  <span className="photo-tag">Day 1</span>
                </div>
                <p className="polaroid-caption">When Jiju signed the contract! 💍👰‍♀️</p>
              </div>
              <div className="polaroid-back">
                <h3>The Grand Wedding 🥂</h3>
                <p>
                  "From dancing like crazy in your Baraat to crying during Vidaai... having Jiju in
                  our family is the best blessing ever!"
                </p>
                <span className="signature">Best Couple Always 💕</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="polaroid-card card-2" tabIndex={0}>
            <div className="cloth-pin" />
            <div className="polaroid-inner">
              <div className="polaroid-front">
                <div className="photo-placeholder photo-travel">
                  <Umbrella size={48} className="center-icon" />
                  <span className="photo-tag">Trips & Vacations</span>
                </div>
                <p className="polaroid-caption">Travel Goals & Cute Selfies ✈️🏖️</p>
              </div>
              <div className="polaroid-back">
                <h3>Partner In Crime 📸</h3>
                <p>
                  "Jiju, thank you for always clicking 500 photos until Didi approves at least 1!
                  You deserve an Oscar for patience."
                </p>
                <span className="signature">Best Jiju Award 🏅</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="polaroid-card card-3" tabIndex={0}>
            <div className="cloth-pin" />
            <div className="polaroid-inner">
              <div className="polaroid-front">
                <div className="photo-placeholder photo-home">
                  <Home size={48} className="center-icon" />
                  <span className="photo-tag">365 Days Strong</span>
                </div>
                <p className="polaroid-caption">Cutest Pair in Town 🏡❤️</p>
              </div>
              <div className="polaroid-back">
                <h3>Forever & Beyond 🌟</h3>
                <p>
                  "Seeing Didi so happy and pampered with you makes our whole heart smile. Keep
                  loving and roasting each other forever!"
                </p>
                <span className="signature">Love from Your Sibling ❤️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Action Hub (Sky Lanterns & Emoji Fountain) */}
      <div className="interactive-lanterns-box">
        <div className="lantern-text">
          <h3>Send Wishes to Didi & Jiju 🏮✨</h3>
          <p>Choose an interactive celebration trigger below!</p>
        </div>
        <div className="celebration-action-buttons">
          <button className="lantern-launch-btn" onClick={onLaunchLanterns}>
            <Wand2 size={18} /> Release Sky Lanterns 🏮
          </button>
          <button className="emoji-fountain-btn" onClick={onEmojiFountain}>
            <PartyPopper size={18} /> Erupt Emoji Fountain! 🚀💖
          </button>
        </div>
      </div>

      {/* Heartfelt Sibling Love Letter */}
      <div className="letter-container">
        <div className="wax-seal">
          <Heart size={22} />
        </div>
        <h2 className="letter-title">Dearest Didi & Jiju,</h2>
        <p className="letter-body">
          "It feels like just yesterday we were running around preparing for your wedding, and
          today you both complete 1 magical, laughter-filled year together! Thank you for setting
          such high couple goals and for being my favorite duo to tease, bother, and love
          endlessly. Jiju, thank you for loving my sister so dearly, and Didi, thank you for being
          my lifelong rock. Happy 1st Anniversary!"
        </p>
        <div className="letter-footer">
          <span>Lots of love, hugs & treat demands, from your sibling! 🎁🥂🍕</span>
        </div>
      </div>

      {/* Replay Button */}
      <div className="celebration-footer">
        <button className="restart-btn" onClick={onRestart}>
          <RotateCw size={18} /> Relive The Sibling Prank Again 🔄
        </button>
      </div>
    </motion.div>
  );
}
