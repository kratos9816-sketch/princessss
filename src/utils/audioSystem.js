/**
 * THE CASTLE OF OUR FOREVER - PROCEDURAL & IMMERSIVE AUDIO ENGINE
 * Uses Web Audio API to create authentic romantic gothic orchestral harmonies,
 * ambient environmental soundscapes (crackling fire, wind, fountain, footsteps, creaking doors),
 * and supports custom audio stems without broken external file dependencies.
 */

class RomanticCastleAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.ambientGain = null;
    this.isMuted = false;
    this.isStarted = false;

    // Active nodes
    this.currentRoom = null;
    this.ambientGenerators = [];
    this.bgmInterval = null;
    this.footstepInterval = null;
    this.lastFootstepTime = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Submixes
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // Reverb / Convolver impulse for gothic cathedral acoustics
      this.reverbNode = this.createCathedralReverb(2.8, 0.45);
      this.reverbNode.connect(this.bgmGain);

      this.isStarted = true;
      this.startRomanticMelodyLoop();
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createCathedralReverb(duration, decay) {
    const rate = this.ctx.sampleRate;
    const length = rate * duration;
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = (length - i) / length;
      const d = Math.exp(-i / (rate * decay));
      left[i] = (Math.random() * 2 - 1) * d * n;
      right[i] = (Math.random() * 2 - 1) * d * n;
    }

    const convolver = this.ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  setMasterVolume(val) {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : val, this.ctx.currentTime, 0.05);
  }

  setBgmVolume(val) {
    if (!this.bgmGain || !this.ctx) return;
    this.bgmGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
  }

  setSfxVolume(val) {
    if (!this.sfxGain || !this.ctx) return;
    this.sfxGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
  }

  // Romantic Gothic Music Progressions
  startRomanticMelodyLoop() {
    if (!this.ctx) return;

    // Romantic Minor-to-Major emotional chord sequences (frequencies in Hz)
    // C minor -> Ab major -> Eb major -> Bb major -> G minor
    const chords = [
      [130.81, 155.56, 196.00, 261.63, 311.13, 392.00], // Cm9 (C3, Eb3, G3, C4, Eb4, G4)
      [103.83, 155.56, 207.65, 261.63, 311.13, 415.30], // Abmaj7 (Ab2, Eb3, Ab3, C4, Eb4, Ab4)
      [155.56, 196.00, 233.08, 311.13, 392.00, 466.16], // Ebmaj9 (Eb3, G3, Bb3, Eb4, G4, Bb4)
      [116.54, 174.61, 233.08, 293.66, 349.23, 466.16], // Bbadd9 (Bb2, F3, Bb3, D4, F4, Bb4)
      [98.00, 146.83, 196.00, 293.66, 349.23, 440.00],  // Gm7/11 (G2, D3, G3, D4, F4, A4)
      [103.83, 164.81, 207.65, 261.63, 329.63, 392.00], // Fm9 (F2, E3, Ab3, C4, E4, G4)
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.ctx || this.isMuted) return;

      const chord = chords[chordIndex % chords.length];
      const now = this.ctx.currentTime;
      const duration = 6.5;

      // Play soft warm pad chord
      chord.forEach((freq, idx) => {
        // Main warm oscillator (triangle/sine blend)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx < 2 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Gothic lowpass warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(idx < 2 ? 380 : 850, now);
        filter.frequency.exponentialRampToValueAtTime(idx < 2 ? 260 : 600, now + duration);

        // Envelope
        const volume = (idx < 2 ? 0.05 : 0.035) / Math.sqrt(chord.length);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.reverbNode);

        osc.start(now);
        osc.stop(now + duration + 0.6);
      });

      // Play romantic delicate harp / celesta arpeggios
      const harpNotes = [chord[2], chord[3], chord[4], chord[5], chord[4]];
      harpNotes.forEach((freq, i) => {
        const noteTime = now + 1.2 + i * 0.9;
        this.playHarpNote(freq * 1.5, noteTime);
      });

      chordIndex++;
    };

    playNextChord();
    this.bgmInterval = setInterval(playNextChord, 6200);
  }

  playHarpNote(freq, time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.04, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

    osc.connect(gain);
    gain.connect(this.reverbNode);

    osc.start(time);
    osc.stop(time + 1.9);
  }

  // Room Ambience switching
  setRoomAmbience(roomId) {
    if (!this.ctx) return;
    this.currentRoom = roomId;

    // Clear old ambient generators
    this.ambientGenerators.forEach((gen) => {
      try { gen.stop(); } catch (e) {}
    });
    this.ambientGenerators = [];

    const now = this.ctx.currentTime;

    if (roomId === 'exterior') {
      // Wind generator
      this.createWindAmbience();
    } else if (roomId === 'memory-chamber' || roomId === 'secret-library') {
      // Crackling fireplace
      this.createFireplaceAmbience();
    } else if (roomId === 'enchanted-garden') {
      // Night garden breeze + water fountain
      this.createFountainAmbience();
    }
  }

  createWindAmbience() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    noise.start();
    this.ambientGenerators.push(noise);
  }

  createFireplaceAmbience() {
    if (!this.ctx) return;
    // Low rumble + random sparks
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise for hearth warmth
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);

    noise.connect(gain);
    gain.connect(this.ambientGain);
    noise.start();
    this.ambientGenerators.push(noise);
  }

  createFountainAmbience() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);
    noise.start();
    this.ambientGenerators.push(noise);
  }

  // Interactive SFX
  playFootstep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    if (now - this.lastFootstepTime < 0.35) return;
    this.lastFootstepTime = now;

    // Marble stone step: crisp short tap with hollow body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playDoorOpen() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Heavy Gothic wooden creak + reverberant latch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.4);
    osc.frequency.linearRampToValueAtTime(95, now + 0.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  playSecretDiscovery() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 magical chime

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const noteTime = now + idx * 0.12;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.4);

      osc.connect(gain);
      gain.connect(this.reverbNode);

      osc.start(noteTime);
      osc.stop(noteTime + 1.5);
    });
  }

  playBallroomWaltzFlourish() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Grand romantic crescendo chord
    const flourishChord = [261.63, 329.63, 392.00, 523.25, 659.25];
    flourishChord.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.reverbNode);

      osc.start(now);
      osc.stop(now + 4.6);
    });
  }
}

export const soundManager = new RomanticCastleAudioEngine();
