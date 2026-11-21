/**
 * ===================================================================
 * 1ST WEDDING ANNIVERSARY SURPRISE - DIDI & JIJU (FROM SIBLING)
 * ===================================================================
 */

// State Management
const STATE = {
  currentStage: 1,
  soundEnabled: true,
  countdownFinished: false,
  countdownSecondsRemaining: 10, // Default demo timer is 10s for instant testing
  countdownInterval: null,
  isRunawayActive: true,
  currentPin: '',
  correctPin: '1234',
  shagunSecondsRemaining: 15,
  shagunInterval: null,
  taunts: [
    "Didi se nahi pakda jaayega! 🏃💨",
    "Jiju ko batau kya? 😜",
    "Chote bhai/behan ki speed alag hai! ⚡",
    "Arre itna slow response?! 🐢",
    "Peeche dekho Didi! 👻",
    "Ninja button hu main! 🥷",
    "Catch me if you can, Jiju! 🏃",
    "Oops! Miss ho gaya! 😝"
  ],
  roasts: [
    "Jiju, Didi ka birthday daal diya kya? Ye anniversary portal hai! 🤦‍♂️",
    "Wrong PIN! Mummy ko report bhej di gayi hai 🚨",
    "1 saal me hi date bhool gaye?! Didi will remember this! ⚖️",
    "Aayein? Baingan! Sahi PIN dalo (Hint: 1234) 🍆",
    "Didi ki daant incoming in 3... 2... 1... 📞",
    "Daya, darwaza tod do! Galat PIN daal diya! 🚪🔨",
    "Kya gunda banoge re Didi & Jiju! 🕵️‍♂️"
  ]
};

// ===================================================
// PROCEDURAL WEB AUDIO SFX ENGINE
// ===================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playWhoosh() {
    if (!STATE.soundEnabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playTap() {
    if (!STATE.soundEnabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playBuzzer() {
    if (!STATE.soundEnabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playSuccess() {
    if (!STATE.soundEnabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  playCoin() {
    if (!STATE.soundEnabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      [987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  playRomanticChime() {
    if (!STATE.soundEnabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.08, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.6);
      });
    } catch (e) {}
  }
}

const sounds = new SoundEngine();

// ===================================================
// CUTE FAIRY DUST / SPARKLE CURSOR TRAIL ENGINE
// ===================================================
class CursorSparkleTrail {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => this.addSparkles(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      this.addSparkles(t.clientX, t.clientY);
    });

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  addSparkles(x, y) {
    const colors = ['#ff4d8d', '#ffd166', '#ffbe98', '#b39ddb', '#ffffff'];
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }

  drawSparkleStar(ctx, x, y, size, color, alpha, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.2, size * 0.2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      } else {
        this.drawSparkleStar(this.ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ===================================================
// AMBIENT PARTICLES & FLOATING SKY LANTERNS
// ===================================================
class AmbientBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.lanterns = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 15), 60);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        isHeart: Math.random() > 0.65
      });
    }
  }

  spawnLantern() {
    const x = Math.random() * (this.width - 100) + 50;
    this.lanterns.push({
      x: x,
      y: this.height + 40,
      size: Math.random() * 16 + 22,
      speedY: -(Math.random() * 1.5 + 1.2),
      sway: Math.random() * 2,
      swaySpeed: Math.random() * 0.03 + 0.02,
      time: Math.random() * 100
    });
  }

  drawHeart(ctx, x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff4d8d';
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawLantern(ctx, lantern) {
    ctx.save();
    const glow = ctx.createRadialGradient(lantern.x, lantern.y, 2, lantern.x, lantern.y, lantern.size * 1.8);
    glow.addColorStop(0, 'rgba(255, 180, 50, 0.8)');
    glow.addColorStop(0.5, 'rgba(255, 90, 0, 0.35)');
    glow.addColorStop(1, 'rgba(255, 90, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lantern.x, lantern.y, lantern.size * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Lantern Body
    ctx.fillStyle = '#ffaa33';
    ctx.beginPath();
    ctx.roundRect(lantern.x - lantern.size * 0.4, lantern.y - lantern.size * 0.5, lantern.size * 0.8, lantern.size, 6);
    ctx.fill();

    // Flame
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lantern.x, lantern.y + lantern.size * 0.15, lantern.size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render floating background particles
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      if (p.isHeart) {
        this.drawHeart(this.ctx, p.x, p.y, p.size * 3.5, p.alpha);
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = '#ffd166';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    });

    // Render sky lanterns
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.time += l.swaySpeed;
      l.x += Math.sin(l.time) * l.sway;
      l.y += l.speedY;
      this.drawLantern(this.ctx, l);
      if (l.y < -80) {
        this.lanterns.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ===================================================
// STAGE TRANSITION CONTROLLER
// ===================================================
function switchStage(stageNum) {
  const currentStageEl = document.querySelector(`.stage.active`);
  const targetStageEl = document.getElementById(`stage-${stageNum}`);

  if (currentStageEl) {
    currentStageEl.classList.remove('active');
  }

  if (targetStageEl) {
    targetStageEl.classList.add('active');
    STATE.currentStage = stageNum;
  }

  if (stageNum === 3) {
    startShagunTimer();
  } else if (stageNum === 4) {
    triggerGrandCelebration();
  }
}

// ===================================================
// STAGE 1: SIBLING RUNAWAY BUTTON LOGIC
// ===================================================
const runawayBtn = document.getElementById('runawayBtn');
const tauntTag = document.getElementById('tauntTag');
const teaseStatus = document.getElementById('teaseStatus');
const secDisplay = document.getElementById('seconds');

function moveRunawayButtonAway(cursorX, cursorY) {
  if (!STATE.isRunawayActive) return;

  const pad = 90;
  const maxW = window.innerWidth - pad;
  const maxH = window.innerHeight - pad;

  let newX = Math.random() * (maxW - pad) + pad;
  let newY = Math.random() * (maxH - pad) + pad;

  if (cursorX && cursorY) {
    const distToCursor = Math.hypot(newX - cursorX, newY - cursorY);
    if (distToCursor < 200) {
      newX = (newX + 300) % (maxW - pad) + pad;
      newY = (newY + 250) % (maxH - pad) + pad;
    }
  }

  runawayBtn.style.position = 'fixed';
  runawayBtn.style.left = `${newX}px`;
  runawayBtn.style.top = `${newY}px`;
  runawayBtn.style.transform = 'translate(-50%, -50%)';

  const randomTaunt = STATE.taunts[Math.floor(Math.random() * STATE.taunts.length)];
  tauntTag.textContent = randomTaunt;

  sounds.playWhoosh();
}

runawayBtn.addEventListener('mouseenter', (e) => {
  if (STATE.isRunawayActive) {
    moveRunawayButtonAway(e.clientX, e.clientY);
  }
});

window.addEventListener('mousemove', (e) => {
  if (!STATE.isRunawayActive || STATE.currentStage !== 1) return;
  const rect = runawayBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;
  const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

  if (distance < 130) {
    moveRunawayButtonAway(e.clientX, e.clientY);
  }
});

runawayBtn.addEventListener('touchstart', (e) => {
  if (STATE.isRunawayActive) {
    e.preventDefault();
    const touch = e.touches[0];
    moveRunawayButtonAway(touch.clientX, touch.clientY);
  }
});

function startCountdown() {
  if (STATE.countdownInterval) clearInterval(STATE.countdownInterval);

  STATE.countdownInterval = setInterval(() => {
    STATE.countdownSecondsRemaining--;

    if (STATE.countdownSecondsRemaining <= 0) {
      clearInterval(STATE.countdownInterval);
      STATE.countdownSecondsRemaining = 0;
      secDisplay.textContent = '00';
      onCountdownComplete();
    } else {
      secDisplay.textContent = STATE.countdownSecondsRemaining.toString().padStart(2, '0');
    }
  }, 1000);
}

function onCountdownComplete() {
  STATE.isRunawayActive = false;
  STATE.countdownFinished = true;

  sounds.playSuccess();
  if (window.confetti) {
    confetti({ particleCount: 75, spread: 65, origin: { y: 0.7 } });
  }

  teaseStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Time Up! Chalo maaf kiya! 🔓 Ab click karo!';
  runawayBtn.classList.add('unlocked');
  runawayBtn.querySelector('.btn-text').textContent = "Proceed to Secret Vault";
  tauntTag.textContent = "Click Me Now! 🎉";
}

runawayBtn.addEventListener('click', () => {
  if (STATE.isRunawayActive) {
    moveRunawayButtonAway();
  } else {
    sounds.playTap();
    switchStage(2);
  }
});

// ===================================================
// STAGE 2: SECRET VAULT PIN SCREEN
// ===================================================
const pinDots = [
  document.getElementById('dot-1'),
  document.getElementById('dot-2'),
  document.getElementById('dot-3'),
  document.getElementById('dot-4')
];
const roastBox = document.getElementById('roastBox');
const vaultCard = document.getElementById('vaultCard');
const lockIconWrap = document.getElementById('lockIconWrap');
const lockIcon = document.getElementById('lockIcon');

function updatePinDisplay() {
  pinDots.forEach((dot, index) => {
    if (index < STATE.currentPin.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
      dot.classList.remove('error');
    }
  });
}

function handleKeyInput(val) {
  if (STATE.currentPin.length < 4) {
    STATE.currentPin += val;
    sounds.playTap();
    updatePinDisplay();

    if (STATE.currentPin.length === 4) {
      validatePin();
    }
  }
}

function handleBackspace() {
  if (STATE.currentPin.length > 0) {
    STATE.currentPin = STATE.currentPin.slice(0, -1);
    sounds.playTap();
    updatePinDisplay();
  }
}

function handleClear() {
  STATE.currentPin = '';
  sounds.playTap();
  updatePinDisplay();
}

function validatePin() {
  if (STATE.currentPin === STATE.correctPin) {
    // Correct PIN!
    sounds.playSuccess();
    lockIconWrap.classList.add('unlocked');
    lockIcon.classList.remove('fa-key');
    lockIcon.classList.add('fa-lock-open');

    roastBox.className = 'roast-box';
    roastBox.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Access Granted! Welcome Favorite Couple ❤️';

    if (window.confetti) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      switchStage(3);
    }, 1200);

  } else {
    // Wrong PIN!
    sounds.playBuzzer();
    pinDots.forEach(dot => dot.classList.add('error'));
    vaultCard.classList.add('shake-anim');

    const randomRoast = STATE.roasts[Math.floor(Math.random() * STATE.roasts.length)];
    roastBox.className = 'roast-box shake-roast';
    roastBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${randomRoast}</span>`;

    setTimeout(() => {
      vaultCard.classList.remove('shake-anim');
      STATE.currentPin = '';
      updatePinDisplay();
    }, 900);
  }
}

document.querySelectorAll('.key').forEach(button => {
  button.addEventListener('click', () => {
    const val = button.getAttribute('data-val');
    const action = button.getAttribute('data-action');

    if (val !== null) {
      handleKeyInput(val);
    } else if (action === 'backspace') {
      handleBackspace();
    } else if (action === 'clear') {
      handleClear();
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (STATE.currentStage !== 2) return;

  if (e.key >= '0' && e.key <= '9') {
    handleKeyInput(e.key);
  } else if (e.key === 'Backspace') {
    handleBackspace();
  } else if (e.key === 'Escape') {
    handleClear();
  }
});

// ===================================================
// STAGE 3: SIBLING SHAGUN TOLL GATE & QR SCANNER
// ===================================================
const shagunSecondsEl = document.getElementById('shagunSeconds');
const shagunSecLabel = document.getElementById('shagunSecLabel');
const progressCircle = document.getElementById('progressCircle');
const payShagunBtn = document.getElementById('payShagunBtn');
const kanjoosBtn = document.getElementById('kanjoosBtn');

const TOTAL_CIRCUMFERENCE = 2 * Math.PI * 26; // approx 163.36
if (progressCircle) {
  progressCircle.style.strokeDasharray = `${TOTAL_CIRCUMFERENCE}`;
  progressCircle.style.strokeDashoffset = `0`;
}

function startShagunTimer() {
  STATE.shagunSecondsRemaining = 15;
  if (STATE.shagunInterval) clearInterval(STATE.shagunInterval);

  sounds.playRomanticChime();

  STATE.shagunInterval = setInterval(() => {
    STATE.shagunSecondsRemaining--;
    
    if (shagunSecondsEl) {
      shagunSecondsEl.textContent = STATE.shagunSecondsRemaining;
    }
    if (shagunSecLabel) {
      shagunSecLabel.textContent = `${STATE.shagunSecondsRemaining}s`;
    }

    const progress = STATE.shagunSecondsRemaining / 15;
    const offset = TOTAL_CIRCUMFERENCE * (1 - progress);
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = offset;
    }

    if (STATE.shagunSecondsRemaining <= 5 && STATE.shagunSecondsRemaining > 0) {
      sounds.playTap();
    }

    if (STATE.shagunSecondsRemaining <= 0) {
      clearInterval(STATE.shagunInterval);
      triggerShagunSuccess("Timer Finished! Sibling concession applied! Free Entry! 😂🎉");
    }
  }, 1000);
}

function triggerShagunSuccess(message) {
  if (STATE.shagunInterval) clearInterval(STATE.shagunInterval);

  sounds.playCoin();
  if (window.confetti) {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  const qrDesc = document.querySelector('.qr-desc');
  if (qrDesc) {
    qrDesc.innerHTML = `<span style="color: #10b981; font-weight: bold;">${message}</span>`;
  }

  setTimeout(() => {
    switchStage(4);
  }, 1400);
}

payShagunBtn.addEventListener('click', () => {
  triggerShagunSuccess("Treat Guaranteed! ₹1001 Shagun credited! 🍕❤️");
});

kanjoosBtn.addEventListener('click', () => {
  triggerShagunSuccess("Kanjoosi Award Unlocked! Aage badho Didi & Jiju! 😜");
});

// ===================================================
// STAGE 4: GRAND 1ST ANNIVERSARY CELEBRATION
// ===================================================
const launchLanternBtn = document.getElementById('launchLanternBtn');
const restartBtn = document.getElementById('restartBtn');

function triggerGrandCelebration() {
  sounds.playSuccess();

  // Multi-cannon Fireworks Confetti
  if (window.confetti) {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  // Release sky lanterns
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      if (window.ambientBg) window.ambientBg.spawnLantern();
    }, i * 350);
  }
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

launchLanternBtn.addEventListener('click', () => {
  sounds.playRomanticChime();
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      if (window.ambientBg) window.ambientBg.spawnLantern();
    }, i * 200);
  }
  if (window.confetti) {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
  }
});

restartBtn.addEventListener('click', () => {
  sounds.playTap();
  STATE.countdownSecondsRemaining = 10;
  STATE.isRunawayActive = true;
  STATE.countdownFinished = false;
  STATE.currentPin = '';

  teaseStatus.innerHTML = '<i class="fa-solid fa-person-running fa-bounce"></i> Button pakad ke dikhao Didi & Jiju! 🏃💨';
  runawayBtn.classList.remove('unlocked');
  runawayBtn.querySelector('.btn-text').textContent = "Move to Next";
  tauntTag.textContent = "Pakad ke dikhao! 🏃";
  runawayBtn.style.position = 'fixed';
  runawayBtn.style.top = '75%';
  runawayBtn.style.left = '50%';
  runawayBtn.style.transform = 'translate(-50%, -50%)';

  updatePinDisplay();
  startCountdown();
  switchStage(1);
});

// Floating Controls
const soundToggle = document.getElementById('soundToggle');
const demoToggle = document.getElementById('demoToggle');

soundToggle.addEventListener('click', () => {
  STATE.soundEnabled = !STATE.soundEnabled;
  if (STATE.soundEnabled) {
    soundToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    sounds.playTap();
  } else {
    soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }
});

demoToggle.addEventListener('click', () => {
  sounds.playTap();
  STATE.countdownSecondsRemaining = 3;
  secDisplay.textContent = '03';
});

// ===================================================
// INITIALIZATION
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
  const ambientCanvas = document.getElementById('ambientCanvas');
  if (ambientCanvas) {
    window.ambientBg = new AmbientBackground(ambientCanvas);
  }

  const cursorCanvas = document.getElementById('cursorCanvas');
  if (cursorCanvas) {
    window.cursorTrail = new CursorSparkleTrail(cursorCanvas);
  }

  startCountdown();
});
