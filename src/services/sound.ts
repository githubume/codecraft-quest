type SoundName = "add" | "remove" | "run" | "success" | "fail" | "hint" | "reset";

let audioContext: AudioContext | undefined;
let musicTimer: number | undefined;
let musicStarted = false;
let musicStep = 0;

function getAudioContext() {
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function tone(frequency: number, start: number, duration: number, gainValue = 0.08) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playSound(name: SoundName) {
  const context = getAudioContext();
  const now = context.currentTime;

  if (name === "success") {
    tone(523, now, 0.12);
    tone(659, now + 0.1, 0.12);
    tone(784, now + 0.2, 0.16);
    return;
  }

  if (name === "fail") {
    tone(330, now, 0.09, 0.055);
    tone(247, now + 0.08, 0.11, 0.055);
    tone(196, now + 0.2, 0.18, 0.05);
    return;
  }

  const singleTones: Record<Exclude<SoundName, "success" | "fail">, number> = {
    add: 440,
    remove: 260,
    run: 392,
    hint: 622,
    reset: 330,
  };
  tone(singleTones[name], now, 0.08, 0.05);
}

function musicTone(frequency: number, start: number, duration: number) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.linearRampToValueAtTime(0.018, start + 0.08);
  gain.gain.linearRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);
}

function scheduleMusicBar() {
  const context = getAudioContext();
  const now = context.currentTime + 0.02;
  const phrases = [
    [196, 247, 294, 330, 294, 247, 220, 247],
    [220, 262, 330, 392, 330, 294, 262, 220],
    [196, 247, 294, 370, 330, 294, 247, 196],
    [165, 196, 247, 294, 262, 247, 220, 196],
  ];
  const chords = [98, 123, 110, 82];
  const phraseIndex = musicStep % phrases.length;
  const notes = phrases[phraseIndex];
  notes.forEach((note, index) => {
    musicTone(note, now + index * 0.32, 0.24);
    if (index % 2 === 0) {
      musicTone(chords[phraseIndex], now + index * 0.32, 0.56);
    }
  });
  musicStep += 1;
}

export function startBackgroundMusic() {
  if (musicStarted) return;
  musicStarted = true;
  scheduleMusicBar();
  musicTimer = window.setInterval(scheduleMusicBar, 2600);
}

export function stopBackgroundMusic() {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = undefined;
  }
  musicStarted = false;
}
