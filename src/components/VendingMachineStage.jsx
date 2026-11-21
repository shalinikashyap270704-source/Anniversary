import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  X,
  Sparkles,
  RotateCcw,
  Film,
  Coins,
  ChevronRight,
  Heart,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

// ─── Verified Fast-Streaming Video URLs with Local Public Video Support ───
const VENDING_ITEMS = [
  // ── ROW A: Hilarious Video Archives ──
  {
    id: 'mostSaidWord',
    code: 'A1',
    row: 'A',
    title: 'Most Said Word 🗣️',
    subtitle: "Didi's iconic punchline: 'Tujhe kuch nahi pata!' 😂",
    tag: 'Didi’s Catchphrase',
    emoji: '🗣️',
    videoUrl: '/videos/video_A1.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    note: "Har 5 minute mein ek baar Didi ka automatic statement: 'Bhai tu chup kar, tujhe duniya ka kuch nahi pata!' 💅"
  },
  {
    id: 'vidai',
    code: 'A2',
    row: 'A',
    title: 'Vidai 😭',
    subtitle: '10% genuine tears, 90% acting for the videographer 🥹🎬',
    tag: 'Emotional Drama',
    emoji: '😭',
    videoUrl: '/videos/video_A2.mp4',
    fallbackUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    note: "Sabse emotional moment, lekin jaise hi camera ghuma, Didi checked her lipstick in Jiju's sunglasses! 💄😎"
  },
  {
    id: 'yourArt',
    code: 'A3',
    row: 'A',
    title: 'Your Art 😂',
    subtitle: 'Picasso resigned after seeing Didi’s creative drawings 🎨',
    tag: 'Masterpiece',
    emoji: '🎨',
    videoUrl: '/videos/video_A3.mp4',
    fallbackUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    note: "School time se leke aaj tak: Ghode ki drawing banai thi aur mummy ko laga dinosaur hai! 🦕🐎"
  },
  {
    id: 'majak',
    code: 'A4',
    row: 'A',
    title: 'Majak Jo Mahanga Pada 😭',
    subtitle: 'Sorry again for that prank jo 3 din tak chala tha... 🙏😅',
    tag: 'Sibling Prank',
    emoji: '🙈',
    videoUrl: '/videos/video_A4.mp4',
    fallbackUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    note: "Mera intention accha tha Didi! Vo to bas timing galat ho gayi aur Jiju ne bhi haan bol diya! 🏃‍♂️💨"
  },

  // ── ROW B: Legendary Sagas ──
  {
    id: 'shadi',
    code: 'B1',
    row: 'B',
    title: 'Shadi Ka Dhamaka 🥳🙌',
    subtitle: 'Band, Baaja, Baraat & Shagun envelopes heist squad! 💵💸',
    tag: 'Royal Wedding',
    emoji: '🥳',
    videoUrl: '/videos/video_B1.mp4',
    fallbackUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    note: "Jiju ki entry pe jo dance hua tha, DJ wale babu ne bhi salute kiya tha! Aur joota churai ka hisab abhi baki hai! 👞💰"
  },
  {
    id: 'godsFavChild',
    code: 'B2',
    row: 'B',
    title: "God's Fav Child 👑",
    subtitle: 'All pampering for her, all scoldings for me 😇✨',
    tag: 'Sibling Privilege',
    emoji: '👑',
    videoUrl: '/videos/video_B2.mp4',
    fallbackUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
    note: "Ghar ka remote tode Didi: 'Galti se gir gaya hoga bachhi se'. Main paani ka glass giraun: 'Zindagi barbad kar di!' 🤦‍♂️"
  },
  {
    id: 'snakeFriends',
    code: 'B3',
    row: 'B',
    title: 'Snake Friends 🐍🐍',
    subtitle: 'The 2 AM secret gossip conference in the kitchen 🤫☕',
    tag: 'Gossip Council',
    emoji: '🐍',
    videoUrl: '/videos/video_B3.mp4',
    fallbackUrl: 'https://www.w3schools.com/tags/movie.mp4',
    note: "'Kisi ko mat batana haan'... aur 10 minute baad pure rishtedaaro ko pata chal chuka tha! 📢😂"
  },
  {
    id: 'ourReel',
    code: 'B4',
    row: 'B',
    title: 'Our Reel 🎬❤️',
    subtitle: '37 takes for a 15-second reel that got 42 views 🕺💃',
    tag: 'Viral Attempt',
    emoji: '🎬',
    videoUrl: '/videos/video_B4.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    note: "'Ek aur take le, iss baar main zyada natural lagungi!' — Narrator: She was not natural at all. 🎥🤣"
  },

  // ── ROW C: Time Travel & Grand Finale ──
  {
    id: 'talktopast',
    code: 'C1',
    row: 'C',
    title: 'Me to Me 🕰️',
    subtitle: 'Internal monologue 5 seconds before making bad choices 🧠🤯',
    tag: 'Brain Cell Glitch',
    emoji: '🕰️',
    videoUrl: '/videos/video_C1.mp4',
    fallbackUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    note: "Brain: 'Chup baith'. Me: 'Par roast karna zaroori hai!' 🤪"
  },
  {
    id: 'talk',
    code: 'C2',
    row: 'C',
    title: 'Talk to Past 🕰️',
    subtitle: 'Message to Didi when she first said ‘Haan ladka accha hai’ 💌',
    tag: 'Golden Memory',
    emoji: '💌',
    videoUrl: '/videos/video_C2.mp4',
    fallbackUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    note: "Sach mein Didi, Jiju jaisa sweet aur patient insaan dhundne se bhi nahi milta! You guys are made for each other! 💖"
  },
  {
    id: 'moveForward',
    code: 'C3',
    row: 'C',
    title: 'Move Forward ➔',
    subtitle: 'Unlock the Grand 365-Days Survival Finale & Trophy! 🏆🎉',
    tag: 'PREMIUM PASS',
    emoji: '🚀',
    isCTA: true,
    note: "Vending machine cleared! Ready for the official 1-Year Household Audit & Fireworks Celebration!"
  }
];

// ─── 3D Rotating Golden/Rose Spring Coil behind items ───
function CoilSVG({ active }) {
  return (
    <div className="vending-coil-wrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 60"
        className={`vending-coil-svg ${active ? 'spinning' : ''}`}
      >
        <defs>
          <linearGradient id="roseGoldCoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <path
          d="M 10,30 C 15,8 25,8 30,30 C 35,52 45,52 50,30 C 55,8 65,8 70,30 C 75,52 85,52 90,30"
          fill="none"
          stroke="url(#roseGoldCoilGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="drop-shadow(0px 3px 6px rgba(245, 158, 11, 0.4))"
        />
      </svg>
    </div>
  );
}

// ─── Memory Cassette Card with 3D Tilt ───
function VendingMemoryCard({ item, onClick, isDispensing, vendingPhase }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rx = ((y - midY) / midY) * -12;
    const ry = ((x - midX) / midX) * 12;
    setTilt({ rx, ry, hovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, hovered: false });
  };

  return (
    <div
      className={`vending-card-3d-anchor ${item.isCTA ? 'is-cta-item' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`Click to dispense ${item.code}: ${item.title}`}
    >
      <div
        className={`vending-card-body ${tilt.hovered ? 'is-hovered' : ''} ${item.isCTA ? 'cta-glow' : ''}`}
        style={{
          transform: tilt.hovered
            ? `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(10px)`
            : 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
        }}
      >
        {/* Cassette Header Bar with Reels */}
        <div className="cassette-top-strip">
          <div className="tape-reel reel-left">
            <span className="reel-hole" />
          </div>
          <div className="tape-window">
            <span className="tape-line" />
          </div>
          <div className="tape-reel reel-right">
            <span className="reel-hole" />
          </div>
        </div>

        {/* Card Content */}
        <div className="cassette-content">
          <div className="cassette-badge-row">
            <span className="cassette-tag">{item.tag}</span>
            <span className="cassette-emoji">{item.emoji}</span>
          </div>

          <h4 className="cassette-title">{item.title}</h4>
          <p className="cassette-sub">{item.subtitle}</p>
        </div>

        {/* Bottom Barcode & Price Tag */}
        <div className="cassette-footer-bar">
          <div className="cassette-code-badge">
            <span className="code-dot" />
            <strong>CODE: {item.code}</strong>
          </div>
          <span className="cassette-price">
            {item.isCTA ? '✨ FREE PASS' : '🪙 1 WISH'}
          </span>
        </div>

        {/* Specular Glare */}
        {tilt.hovered && (
          <div
            className="cassette-glare"
            style={{
              transform: `translate(${tilt.ry * 3}px, ${tilt.rx * 3}px) rotate(25deg)`
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Custom Luxury Video Player Modal with Retro CRT 3D Accents ───
function CinematicVideoPlayer({ item, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(item.videoUrl || `/videos/video_${item.code}.mp4`);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    sounds.playRomanticChime();
    const vid = videoRef.current;
    if (!vid) return;

    vid.play().then(() => setIsPlaying(true)).catch(() => {
      // Browser autoplay policy might require mute
      vid.muted = true;
      setIsMuted(true);
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    });
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2400);
    }
  };

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    sounds.playTap();
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const next = !isMuted;
    setIsMuted(next);
    vid.muted = next;
    sounds.playTap();
  };

  const handleSeek = (e) => {
    const vid = videoRef.current;
    if (!vid || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min((clickX / rect.width) * duration, duration));
    vid.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
    sounds.playTap();
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className="vending-video-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="vending-video-modal-card crt-television-card-3d"
        initial={{ scale: 0.82, opacity: 0, y: 35, rotateX: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.82, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CRT Wood/Rose-Gold Top Bezel & Channel Knobs */}
        <div className="crt-tv-bezel-top">
          <div className="crt-brand-badge">
            <span className="crt-power-led" />
            <span>SIBLING-VISION CRT 2025</span>
          </div>
          <div className="crt-analog-dials">
            <span className="dial-knob" title="Channel Knob">🔘</span>
            <span className="dial-knob" title="Volume Knob">🔘</span>
            <button className="vending-modal-close" onClick={onClose} title="Power Off / Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Top Header */}
        <div className="vending-modal-header">
          <div className="modal-title-left">
            <span className="vending-pill-code">{item.code}</span>
            <div>
              <h3 className="modal-title-text">{item.title}</h3>
              <p className="modal-sub-text">{item.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Video Player Box with CRT Glass Curvature & Scanlines */}
        <div
          ref={containerRef}
          className="vending-video-player-box crt-glass-screen"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <div className="crt-scanline-mesh" />
          <div className="crt-glass-reflection" />

          {hasError ? (
            <div className="video-fallback-banner">
              <span className="fallback-icon">🎬</span>
              <h4>Video Demo Player</h4>
              <p>Sample video stream simulated for "{item.title}"!</p>
              <button
                className="modal-action-btn"
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  if (item.fallbackUrl) setVideoSrc(item.fallbackUrl);
                  if (videoRef.current) videoRef.current.load();
                }}
              >
                Retry Stream
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoSrc}
              className="vending-html-video"
              playsInline
              onClick={togglePlay}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => {
                setDuration(videoRef.current?.duration || 0);
                setIsLoading(false);
              }}
              onError={() => {
                // If local file failed to load, automatically attempt sample online stream fallback!
                if (item.fallbackUrl && videoSrc !== item.fallbackUrl) {
                  setVideoSrc(item.fallbackUrl);
                  setIsLoading(true);
                  return;
                }
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}

          {isLoading && !hasError && (
            <div className="video-loading-spinner-box">
              <div className="spinner-core" />
              <span>Loading Cassette... 📼</span>
            </div>
          )}

          {/* Controls Bar Overlay */}
          <div className={`video-controls-bar ${showControls ? 'visible' : 'hidden'}`}>
            {/* Seek Bar */}
            <div className="video-seek-track" onClick={handleSeek}>
              <div className="video-seek-fill" style={{ width: `${progressPercent}%` }}>
                <span className="video-seek-knob" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="video-controls-row">
              <div className="controls-left">
                <button className="video-ctrl-btn play-btn" onClick={togglePlay}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                </button>

                <button className="video-ctrl-btn" onClick={toggleMute}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (videoRef.current) {
                      videoRef.current.volume = val;
                      videoRef.current.muted = val === 0;
                      setIsMuted(val === 0);
                    }
                  }}
                  className="video-volume-slider"
                />

                <span className="video-time-label">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="controls-right">
                <a
                  href={item.videoUrl}
                  download={`Memory-${item.code}.mp4`}
                  className="video-ctrl-btn"
                  title="Download Video"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download size={17} />
                </a>

                <button className="video-ctrl-btn" onClick={toggleFullscreen} title="Fullscreen">
                  {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sibling Commentary Note Below Video */}
        <div className="modal-sibling-note-card">
          <span className="note-icon">💬</span>
          <div className="note-text-content">
            <strong>Sibling Truth Bomb:</strong>
            <p>{item.note}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="vending-modal-footer">
          <span className="footer-tag">✨ Sibling Memory Cassette #{item.code}</span>
          <button className="done-memory-btn" onClick={onClose}>
            Done Watching 🌸
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN VENDING MACHINE STAGE COMPONENT ───
export default function VendingMachineStage({ onProceedToCelebration }) {
  const [dispensingItem, setDispensingItem] = useState(null);
  const [vendingPhase, setVendingPhase] = useState('idle'); // 'idle' | 'spinning' | 'dropping' | 'retrievable'
  const [keypadInput, setKeypadInput] = useState('');
  const [displayText, setDisplayText] = useState('SELECT ITEM');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [coinCount, setCoinCount] = useState(5);
  const [doorOpen, setDoorOpen] = useState(false);
  const [cabinetTilt, setCabinetTilt] = useState({ rx: 0, ry: 0 });
  const [flyingCoins, setFlyingCoins] = useState([]);

  // Smooth 3D Cabinet Parallax Tilt
  const handleWrapperMouseMove = (e) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const rx = ((e.clientY - h / 2) / (h / 2)) * -4;
    const ry = ((e.clientX - w / 2) / (w / 2)) * 4.5;
    setCabinetTilt({ rx, ry });
  };

  const handleWrapperMouseLeave = () => {
    setCabinetTilt({ rx: 0, ry: 0 });
  };

  // Trigger dispense sequence
  const startDispense = useCallback((item) => {
    if (vendingPhase !== 'idle') return;

    sounds.playCoin();
    setKeypadInput(item.code);
    setDispensingItem(item);
    setVendingPhase('spinning');
    setDisplayText(`DISPENSING ${item.code}...`);

    // Phase 1: Spinning & mechanical sound
    setTimeout(() => {
      sounds.playWhoosh();
    }, 400);

    // Phase 2: Dropping with gravity
    setTimeout(() => {
      setVendingPhase('dropping');
      setTimeout(() => {
        sounds.playComicThud();
        sounds.playRomanticChime();
        setVendingPhase('retrievable');
        setDisplayText('COLLECT ITEM 📥');
      }, 750);
    }, 1100);
  }, [vendingPhase]);

  // Submit code from keypad
  const handleSubmitCode = useCallback(() => {
    const code = keypadInput.toUpperCase().trim();
    if (code.length < 2) {
      sounds.playBuzzer();
      setDisplayText('ENTER 2 DIGITS');
      setTimeout(() => setDisplayText('SELECT ITEM'), 1200);
      return;
    }

    const item = VENDING_ITEMS.find((it) => it.code === code);
    if (!item) {
      sounds.playBuzzer();
      setDisplayText('EMPTY SLOT ❌');
      setTimeout(() => {
        setDisplayText('SELECT ITEM');
        setKeypadInput('');
      }, 1200);
      return;
    }

    startDispense(item);
  }, [keypadInput, startDispense]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (vendingPhase !== 'idle' || activeVideoModal) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', '1', '2', '3', '4'].includes(key)) {
        sounds.playTap();
        setKeypadInput((prev) => (prev.length < 2 ? prev + key : key));
      } else if (key === 'ENTER') {
        e.preventDefault();
        handleSubmitCode();
      } else if (key === 'BACKSPACE' || key === 'ESCAPE') {
        sounds.playTap();
        setKeypadInput('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vendingPhase, activeVideoModal, handleSubmitCode]);

  // Collect item from retrieval bin
  const handleRetrieveItem = () => {
    if (vendingPhase !== 'retrievable' || !dispensingItem) {
      setDoorOpen((prev) => !prev);
      sounds.playTap();
      return;
    }

    sounds.playSuccess();
    setDoorOpen(true);

    if (dispensingItem.isCTA) {
      // Grand transition to Red Thread of Destiny!
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => {
        onProceedToCelebration();
      }, 600);
    } else {
      setActiveVideoModal(dispensingItem);
    }

    setVendingPhase('idle');
    setDispensingItem(null);
    setDisplayText('SELECT ITEM');
    setKeypadInput('');
  };

  // Add more wish coins with 3D airborne flip
  const handleAddWishCoin = () => {
    sounds.playCoin();
    const newId = Date.now();
    setFlyingCoins((prev) => [...prev, { id: newId }]);

    setTimeout(() => {
      sounds.playRomanticChime();
      setCoinCount((c) => c + 1);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
      setFlyingCoins((prev) => prev.filter((c) => c.id !== newId));
    }, 600);
  };

  return (
    <div
      className="vending-page-wrapper"
      onMouseMove={handleWrapperMouseMove}
      onMouseLeave={handleWrapperMouseLeave}
    >
      {/* 3D Airborne Flipping Coins */}
      {flyingCoins.map((fc) => (
        <motion.div
          key={fc.id}
          className="flying-3d-airborne-coin"
          initial={{ opacity: 1, scale: 0.6, y: 120, x: -40, rotateX: 0, rotateY: 0 }}
          animate={{
            scale: [0.8, 1.3, 0.9],
            y: [120, -100, 20],
            x: [-40, 40, 100],
            rotateX: 720,
            rotateY: 1080
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="airborne-gold-disc">🪙✨</div>
        </motion.div>
      ))}

      {/* Top Ambient Heading */}
      <motion.div
        className="vending-hero-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="vending-badge-pill">
          <Film size={14} />
          <span>STAGE 3: THE SIBLING MEMORY VAULT</span>
        </div>
        <h1 className="vending-main-title">
          <span className="vending-title-gradient">Didi & Jiju's Memory Vending Machine</span>
          <span className="vending-title-emoji" role="img" aria-label="cassette and sparkles">📼 ✨</span>
        </h1>
        <p className="vending-main-subtitle">
          All our craziest videos and golden memories are packed inside! Tap any cassette or punch its code on the keypad to dispense! 💖
        </p>
      </motion.div>

      {/* Main Machine Container with 3D Parallax Tilt */}
      <div
        className="vending-cabinet-chassis"
        style={{
          transform: `perspective(1200px) rotateX(${cabinetTilt.rx}deg) rotateY(${cabinetTilt.ry}deg)`,
          transition: 'transform 0.16s ease-out'
        }}
      >
        {/* Glowing Top Marquee Sign */}
        <div className="vending-cabinet-marquee">
          <div className="marquee-light-dots">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="light-dot" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <span className="marquee-text">✨ SIBLING RETRO MEMORY VAULT 📼</span>
          <div className="marquee-light-dots">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="light-dot" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>

        {/* Inside Cabinet Layout: Glass Showcase on Left + Control Panel on Right */}
        <div className="vending-cabinet-interior">
          {/* ─── LEFT: ILLUMINATED GLASS SHOWCASE ─── */}
          <div className="vending-showcase-panel">
            {/* Shelf A */}
            <div className="vending-shelf-tier">
              <div className="shelf-header-label">
                <span className="tier-tag">ROW A</span>
                <span className="tier-desc">Hilarious Video Archives 🎬</span>
              </div>
              <div className="shelf-items-row">
                {VENDING_ITEMS.filter((i) => i.row === 'A').map((item) => {
                  const isDisp = dispensingItem?.id === item.id;
                  let cardY = 0;
                  let cardX = 0;
                  let cardScale = 1;
                  let cardOpacity = 1;

                  if (isDisp) {
                    if (vendingPhase === 'spinning') {
                      cardX = [0, -4, 4, -4, 4, -2, 2, 0];
                      cardScale = 1.05;
                    } else if (vendingPhase === 'dropping') {
                      cardY = 360;
                      cardScale = 0.45;
                      cardOpacity = [1, 0.9, 0];
                    } else if (vendingPhase === 'retrievable') {
                      cardOpacity = 0;
                    }
                  }

                  return (
                    <motion.div
                      key={item.id}
                      className="vending-item-slot"
                      animate={{
                        x: cardX,
                        y: cardY,
                        scale: cardScale,
                        opacity: cardOpacity
                      }}
                      transition={
                        isDisp && vendingPhase === 'dropping'
                          ? { duration: 0.75, ease: [0.5, 0.05, 1, 0.5], times: [0, 0.6, 1] }
                          : { type: 'spring', stiffness: 90, damping: 13 }
                      }
                    >
                      <CoilSVG active={isDisp && vendingPhase === 'spinning'} />
                      <VendingMemoryCard
                        item={item}
                        onClick={() => startDispense(item)}
                        isDispensing={isDisp}
                        vendingPhase={vendingPhase}
                      />
                    </motion.div>
                  );
                })}
              </div>
              <div className="shelf-glass-ledge" />
            </div>

            {/* Shelf B */}
            <div className="vending-shelf-tier">
              <div className="shelf-header-label">
                <span className="tier-tag">ROW B</span>
                <span className="tier-desc">Wedding Sagas & Sibling Privileges 👑</span>
              </div>
              <div className="shelf-items-row">
                {VENDING_ITEMS.filter((i) => i.row === 'B').map((item) => {
                  const isDisp = dispensingItem?.id === item.id;
                  let cardY = 0;
                  let cardX = 0;
                  let cardScale = 1;
                  let cardOpacity = 1;

                  if (isDisp) {
                    if (vendingPhase === 'spinning') {
                      cardX = [0, -4, 4, -4, 4, -2, 2, 0];
                      cardScale = 1.05;
                    } else if (vendingPhase === 'dropping') {
                      cardY = 220;
                      cardScale = 0.45;
                      cardOpacity = [1, 0.9, 0];
                    } else if (vendingPhase === 'retrievable') {
                      cardOpacity = 0;
                    }
                  }

                  return (
                    <motion.div
                      key={item.id}
                      className="vending-item-slot"
                      animate={{
                        x: cardX,
                        y: cardY,
                        scale: cardScale,
                        opacity: cardOpacity
                      }}
                      transition={
                        isDisp && vendingPhase === 'dropping'
                          ? { duration: 0.75, ease: [0.5, 0.05, 1, 0.5], times: [0, 0.6, 1] }
                          : { type: 'spring', stiffness: 90, damping: 13 }
                      }
                    >
                      <CoilSVG active={isDisp && vendingPhase === 'spinning'} />
                      <VendingMemoryCard
                        item={item}
                        onClick={() => startDispense(item)}
                        isDispensing={isDisp}
                        vendingPhase={vendingPhase}
                      />
                    </motion.div>
                  );
                })}
              </div>
              <div className="shelf-glass-ledge" />
            </div>

            {/* Shelf C */}
            <div className="vending-shelf-tier">
              <div className="shelf-header-label">
                <span className="tier-tag">ROW C</span>
                <span className="tier-desc">Time Travel & Grand Finale 🚀</span>
              </div>
              <div className="shelf-items-row">
                {VENDING_ITEMS.filter((i) => i.row === 'C').map((item) => {
                  const isDisp = dispensingItem?.id === item.id;
                  let cardY = 0;
                  let cardX = 0;
                  let cardScale = 1;
                  let cardOpacity = 1;

                  if (isDisp) {
                    if (vendingPhase === 'spinning') {
                      cardX = [0, -4, 4, -4, 4, -2, 2, 0];
                      cardScale = 1.05;
                    } else if (vendingPhase === 'dropping') {
                      cardY = 110;
                      cardScale = 0.45;
                      cardOpacity = [1, 0.9, 0];
                    } else if (vendingPhase === 'retrievable') {
                      cardOpacity = 0;
                    }
                  }

                  return (
                    <motion.div
                      key={item.id}
                      className="vending-item-slot"
                      animate={{
                        x: cardX,
                        y: cardY,
                        scale: cardScale,
                        opacity: cardOpacity
                      }}
                      transition={
                        isDisp && vendingPhase === 'dropping'
                          ? { duration: 0.75, ease: [0.5, 0.05, 1, 0.5], times: [0, 0.6, 1] }
                          : { type: 'spring', stiffness: 90, damping: 13 }
                      }
                    >
                      <CoilSVG active={isDisp && vendingPhase === 'spinning'} />
                      <VendingMemoryCard
                        item={item}
                        onClick={() => startDispense(item)}
                        isDispensing={isDisp}
                        vendingPhase={vendingPhase}
                      />
                    </motion.div>
                  );
                })}
              </div>
              <div className="shelf-glass-ledge" />
            </div>

            {/* Bottom Drop Zone / Retrieval Bin */}
            <div className="vending-retrieval-zone">
              {vendingPhase === 'retrievable' && (
                <motion.div
                  className="retrieval-indicator-banner"
                  animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <span>✨ 📥 CLICK BIN DOOR TO RETRIEVE MEMORY 📥 ✨</span>
                </motion.div>
              )}

              <div
                className={`vending-drop-bin ${vendingPhase === 'retrievable' ? 'bin-ready-glow' : ''}`}
                onClick={handleRetrieveItem}
                title="Click door to collect your dispensed cassette!"
              >
                {/* 3D Hinged Flap Door */}
                <div className={`bin-flap-door ${doorOpen || vendingPhase === 'retrievable' ? 'flap-pushed' : ''}`}>
                  <span className="flap-icon">🎁</span>
                  <span className="flap-text">PUSH TO COLLECT MEMORY</span>
                  <span className="flap-sub">Spring-loaded luxury bin</span>
                </div>

                {/* Dispensed Cassette Inside the Bin */}
                {vendingPhase === 'retrievable' && dispensingItem && (
                  <motion.div
                    className="bin-collected-cassette"
                    initial={{ scale: 0.3, y: -30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 10 }}
                  >
                    <span className="cassette-gift-icon">📼</span>
                    <div className="collected-info">
                      <strong>{dispensingItem.title}</strong>
                      <small>Click to open video player! 🎬</small>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: CONTROL PANEL & KEYPAD ─── */}
          <div className="vending-control-panel">
            {/* Glowing Digital LCD Screen */}
            <div className="vending-lcd-screen">
              <div className="lcd-scanlines" />
              <div className="lcd-status-row">
                <span className="lcd-status-dot" />
                <span className="lcd-mode-text">VAULT TERMINAL v2.5</span>
              </div>
              <div className="lcd-main-display">{displayText}</div>
              {keypadInput && (
                <div className="lcd-code-entered">
                  INPUT: <strong>{keypadInput}</strong>
                </div>
              )}
            </div>

            {/* Keypad Grid */}
            <div className="vending-keypad-box">
              <div className="keypad-grid">
                {['A', 'B', 'C'].map((char) => (
                  <button
                    key={char}
                    className="vending-key-btn key-alpha"
                    onClick={() => {
                      sounds.playTap();
                      setKeypadInput((p) => (p.length < 2 ? p + char : char));
                    }}
                  >
                    {char}
                  </button>
                ))}

                {['1', '2', '3'].map((num) => (
                  <button
                    key={num}
                    className="vending-key-btn key-num"
                    onClick={() => {
                      sounds.playTap();
                      setKeypadInput((p) => (p.length < 2 ? p + num : num));
                    }}
                  >
                    {num}
                  </button>
                ))}

                {['4'].map((num) => (
                  <button
                    key={num}
                    className="vending-key-btn key-num"
                    onClick={() => {
                      sounds.playTap();
                      setKeypadInput((p) => (p.length < 2 ? p + num : num));
                    }}
                  >
                    {num}
                  </button>
                ))}

                <button
                  className="vending-key-btn key-clr"
                  onClick={() => {
                    sounds.playTap();
                    setKeypadInput('');
                  }}
                  title="Clear input"
                >
                  CLR
                </button>

                <button
                  className="vending-key-btn key-ent"
                  onClick={() => handleSubmitCode()}
                  title="Dispense Code"
                >
                  ENT ↵
                </button>
              </div>
            </div>

            {/* Wish Coin Slot & Balance */}
            <div className="vending-coin-slot-card">
              <div className="coin-slot-header">
                <Coins size={16} className="coin-icon" />
                <span>Wish Coin Balance: <strong>{coinCount} 🪙</strong></span>
              </div>
              <div className="coin-slot-hole" onClick={handleAddWishCoin} title="Click to insert wish coin!">
                <div className="hole-slit" />
                <span className="hole-label">INSERT COIN (CLICK ME)</span>
              </div>
              <button className="add-coin-btn" onClick={handleAddWishCoin}>
                + Add Bonus Wish Coin ✨
              </button>
            </div>

            {/* Direct Shortcut to Red Thread of Destiny */}
            <div className="vending-finale-shortcut-card">
              <span className="shortcut-title">Ready for the Romantic Climax? 🕊️✨</span>
              <p className="shortcut-desc">
                Step into the Red Thread of Destiny to watch your life paths unite under the starry moonlit sky!
              </p>
              <button
                className="vending-proceed-celebration-btn"
                onClick={() => {
                  sounds.playRomanticChime();
                  confetti({ particleCount: 100, spread: 75, origin: { y: 0.6 } });
                  onProceedToCelebration();
                }}
              >
                <span>Red Thread of Destiny ➔</span>
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Video Player Modal */}
      <AnimatePresence>
        {activeVideoModal && (
          <CinematicVideoPlayer
            item={activeVideoModal}
            onClose={() => setActiveVideoModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
