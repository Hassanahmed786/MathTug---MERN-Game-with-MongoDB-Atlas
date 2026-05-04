/**
 * Sound Effects — Web Audio API (no external files)
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone({ freq = 440, type = 'sine', duration = 0.15, gain = 0.25, delay = 0 }) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    osc.type = type;
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch {
    // Audio not available — silent fallback
  }
}

function playNoise({ duration = 0.2, gain = 0.1, delay = 0 }) {
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(gain, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

    source.start(ctx.currentTime + delay);
  } catch {
    // silent
  }
}

/** 3-note ascending chime: C5, E5, G5 */
export function playCorrect() {
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    playTone({ freq, type: 'sine', duration: 0.18, gain: 0.3, delay: i * 0.09 });
  });
}

/** Low buzzer */
export function playWrong() {
  playTone({ freq: 150, type: 'sawtooth', duration: 0.35, gain: 0.25 });
}

/** Whoosh for rope slide */
export function playRopeSlide() {
  playNoise({ duration: 0.22, gain: 0.12 });
}

/** Soft tick for under-5s countdown */
export function playTick() {
  playTone({ freq: 600, type: 'square', duration: 0.05, gain: 0.15 });
}

/** 5-note ascending fanfare for winner */
export function playFanfare() {
  const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    playTone({ freq, type: 'sine', duration: 0.3, gain: 0.35, delay: i * 0.12 });
  });
}

export function playCriticalHit() {
  playTone({ freq: 880, type: 'square', duration: 0.15, gain: 0.4 });
  playTone({ freq: 1760, type: 'sine', duration: 0.2, gain: 0.3, delay: 0.1 });
}

let bgmInterval = null;
let bgmStep = 0;

export function startBGM(isSuddenDeath = false) {
  if (bgmInterval) clearInterval(bgmInterval);
  const speed = isSuddenDeath ? 150 : 250;
  const sequence = [220, 261.63, 329.63, 261.63]; // A3, C4, E4, C4
  bgmInterval = setInterval(() => {
    playTone({ freq: sequence[bgmStep % sequence.length], type: 'triangle', duration: 0.1, gain: 0.05 });
    bgmStep++;
  }, speed);
}

export function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

/** Resume audio context (needed for mobile) */
export function resumeAudio() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    // ignore
  }
}
