// Web Audio API Synthesizer for Industrial Evacuation Siren and Alert Beeps
class AudioSirenController {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.intervalId = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  startSiren() {
    if (this.isPlaying) return;
    this.init();

    this.isPlaying = true;
    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    this.oscillator.type = 'sawtooth';
    this.oscillator.frequency.setValueAtTime(500, this.audioCtx.currentTime);

    // Filter to give that resonant industrial loudspeaker horn feel
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, this.audioCtx.currentTime);

    this.oscillator.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.gainNode.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
    this.oscillator.start();

    // Dual-tone wailing frequency oscillation
    let high = false;
    this.intervalId = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      if (high) {
        this.oscillator.frequency.exponentialRampToValueAtTime(550, now + 0.35);
      } else {
        this.oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      }
      high = !high;
    }, 450);
  }

  stopSiren() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.gainNode && this.audioCtx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
        setTimeout(() => {
          if (this.oscillator) {
            try { this.oscillator.stop(); this.oscillator.disconnect(); } catch (e) {}
            this.oscillator = null;
          }
        }, 120);
      } catch (e) {
        if (this.oscillator) {
          try { this.oscillator.stop(); } catch (err) {}
          this.oscillator = null;
        }
      }
    }
  }

  playAdvisoryChime() {
    this.init();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime); // E5
    gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
  }
}

export const sirenEngine = new AudioSirenController();
