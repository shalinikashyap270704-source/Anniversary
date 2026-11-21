// Procedural Web Audio API Sound Effects (Zero External Dependencies)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmAudio = null;
    this.bgmStarted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.bgmStarted && typeof window !== 'undefined') {
      this.initBgm();
    }
  }

  initBgm() {
    if (this.bgmStarted || typeof window === 'undefined') return;
    this.bgmStarted = true;
    try {
      this.bgmAudio = new Audio('/audio/background_music.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.4;
      if (this.enabled) {
        this.bgmAudio.play().catch(() => {});
      }
    } catch (e) {}
  }

  toggle(val) {
    this.enabled = val !== undefined ? val : !this.enabled;
    if (this.bgmAudio) {
      if (this.enabled) {
        this.bgmAudio.play().catch(() => {});
      } else {
        this.bgmAudio.pause();
      }
    }
    return this.enabled;
  }

  playBgm(url = '/audio/background_music.mp3') {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio(url);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.4;
      }
      this.bgmAudio.play().catch(() => {});
    } catch (e) {}
  }

  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  playFlick() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // High-pitched cartoon boing / flick sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playTap() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(560, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playBuzzer() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.14, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  playCoin() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      [987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  playRomanticChime() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.09, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.6);
      });
    } catch (e) {}
  }

  playSnip() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playComicThud() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  playCrack() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // High-frequency glass snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  playHydraulicVault() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.45);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  }

  playBirdChirp() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Sweet two-note musical bird tweet
      [1760, 2200].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + i * 0.09 + 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.08);
      });
    } catch (e) {}
  }

  playHarpArpeggio() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.5);
      });
    } catch (e) {}
  }

  playHeartbeat() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Double warm thump
      [0, 0.14].forEach((delay) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(75, now + delay);
        osc.frequency.exponentialRampToValueAtTime(45, now + delay + 0.12);
        gain.gain.setValueAtTime(0.25, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch (e) {}
  }

  playRocketLaunch() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.55);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  playFireworksExplosion() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Deep resonant boom
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(160, now);
      boom.frequency.exponentialRampToValueAtTime(35, now + 0.45);
      boomGain.gain.setValueAtTime(0.35, now);
      boomGain.gain.exponentialRampToValueAtTime(0.005, now + 0.5);
      boom.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boom.start(now);
      boom.stop(now + 0.5);

      // Crackling starburst sparks
      [0.08, 0.15, 0.22, 0.28, 0.35].forEach((delay, i) => {
        const crack = this.ctx.createOscillator();
        const crackGain = this.ctx.createGain();
        crack.type = 'triangle';
        crack.frequency.setValueAtTime(800 + i * 200, now + delay);
        crack.frequency.exponentialRampToValueAtTime(200, now + delay + 0.06);
        crackGain.gain.setValueAtTime(0.12, now + delay);
        crackGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);
        crack.connect(crackGain);
        crackGain.connect(this.ctx.destination);
        crack.start(now + delay);
        crack.stop(now + delay + 0.06);
      });
    } catch (e) {}
  }
}

export const sounds = new SoundEngine();
