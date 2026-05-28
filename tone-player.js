import * as Tone from "https://esm.sh/tone";

Tone.Transport.bpm.value = 88;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = "8m";
// 总音轨数从 18 减少到 16
const TOTAL_TRACKS = 16; 

// ========== 鼓组全分轨 ==========
const kick = new Tone.MembraneSynth().toDestination();
const kickParts = [
  new Tone.Part(t => kick.triggerAttackRelease("C1", "8n", t), [["0:0:0"],["1:0:0"],["2:0:0"],["3:0:0"]]),
  new Tone.Part(t => kick.triggerAttackRelease("C1", "8n", t), [["0:1:0"],["1:1:0"],["2:1:0"],["3:1:0"]]),
  new Tone.Part(t => kick.triggerAttackRelease("C1", "8n", t), [["0:2:0"],["1:2:0"],["2:2:0"],["3:2:0"]]),
  new Tone.Part(t => kick.triggerAttackRelease("C1", "8n", t), [["0:3:0"],["1:3:0"],["2:3:0"],["3:3:0"]]),
];
kickParts.forEach(p => { p.loop = true; p.start(0); p.probability = 0; });

const snare = new Tone.NoiseSynth({ envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }).toDestination();
const snareParts = [
  new Tone.Part(t => snare.triggerAttackRelease("8n", t), [["0:1:0"],["1:1:0"],["2:1:0"],["3:1:0"]]),
  new Tone.Part(t => snare.triggerAttackRelease("8n", t), [["0:3:0"],["1:3:0"],["2:3:0"],["3:3:0"]]),
];
snareParts.forEach(p => { p.loop = true; p.start(0); p.probability = 0; });

const hihat = new Tone.MetalSynth({ frequency: 250, envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
const hihatParts = [
  new Tone.Part(t => hihat.triggerAttackRelease("8n", t), [["0:0:2"],["1:0:2"],["2:0:2"],["3:0:2"]]),
  new Tone.Part(t => hihat.triggerAttackRelease("8n", t), [["0:2:2"],["1:2:2"],["2:2:2"],["3:2:2"]]),
];
hihatParts.forEach(p => { p.loop = true; p.start(0); p.probability = 0; });

const rim = new Tone.MetalSynth({ frequency: 200, envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 2, modulationIndex: 20, resonance: 800, octaves: 1 }).toDestination();
const rimPart = new Tone.Part(t => rim.triggerAttackRelease("16n", t), [["0:1:2"],["1:2:2"],["2:3:0"],["3:2:3"],["0:3:2"],["2:2:3"]]);
rimPart.loop = true; rimPart.start(0); rimPart.probability = 0;

const tom = new Tone.MembraneSynth({ pitchDecay: 0.1, octaves: 1.5, oscillator: { type: "sine" }, envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.5 } }).toDestination();
const tomPart = new Tone.Part(t => tom.triggerAttackRelease("A1", "8n", t), [["2:0:0"],["3:2:0"],["0:2:2"],["1:1:2"]]);
tomPart.loop = true; tomPart.start(0); tomPart.probability = 0;

const clickOsc = new Tone.Oscillator("C6", "square").toDestination();
const clickPart = new Tone.Part(t => clickOsc.start(t).stop(t + 0.05), [["0:0:3"], ["1:2:2"], ["2:1:3"], ["3:3:1"], ["2:2:1"]]);
clickPart.loop = true; clickPart.start(0); clickPart.probability = 0;

// ========== 其它乐器分轨 ==========
const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination();
const rhodes = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 3, modulationIndex: 6, oscillator: { type: "sine" }, envelope: { attack: 0.5, decay: 0.2, sustain: 0.3, release: 2 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.3, decay: 0.1, sustain: 0.2, release: 0.8 } }).connect(reverb);
const rhodesPart = new Tone.Part((time, chord) => rhodes.triggerAttackRelease(chord, "1n", time), [["0:0:0", ["D3", "F3", "C4"]], ["1:0:0", ["G3", "B3", "F4"]], ["2:0:0", ["C3", "E3", "B3", "G4"]], ["3:0:0", ["A3", "C4", "G4"]], ["4:0:0", ["D3", "F3", "A3"]], ["5:0:0", ["G3", "F4", "B4"]], ["6:0:0", ["C4", "E4", "B4", "G4"]], ["7:0:0", ["C4", "E4", "G4"]]]);
rhodesPart.loop = true; rhodesPart.loopEnd = "8m"; rhodesPart.start(0); rhodesPart.probability = 0;

const bassFilter = new Tone.Filter(100, "lowpass").toDestination();
const jazzBass = new Tone.MonoSynth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.03, decay: 0.2, sustain: 0.3, release: 1.5 }, filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.8, baseFrequency: 200, octaves: 1.5 } }).connect(bassFilter);
jazzBass.set({ glide: 0.08 });
const bassPart = new Tone.Part((t, n) => jazzBass.triggerAttackRelease(n, "8n", t), [["0:1:3", "C2"], ["1:0:1", "E2"], ["2:1:0", "A1"], ["3:2:2", "D2"]]);
bassPart.loop = true; bassPart.start(0); bassPart.probability = 0;

const cityNoise = new Tone.Noise("brown"); const cityGain = new Tone.Gain(0).toDestination(); cityNoise.connect(cityGain);
const radioNoise = new Tone.Noise("brown"); const radioGain = new Tone.Gain(0).toDestination(); radioNoise.connect(radioGain);

const gameSynth = new Tone.FMSynth({ modulationIndex: 18, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.5 } }).toDestination();
const gamePart = new Tone.Part((t, n) => gameSynth.triggerAttackRelease(n, "16n", t), [["0:0:2", "G4"], ["1:1:3", "B4"], ["2:2:1", "E5"], ["3:0:2", "D5"]]);
gamePart.loop = true; gamePart.start(0); gamePart.probability = 0;

// ========== 轨道分配 ==========
function setOnlyActiveTrack(idx) {
  // 分配前全员静音
  kickParts.forEach(p => p.probability = 0);
  snareParts.forEach(p => p.probability = 0);
  hihatParts.forEach(p => p.probability = 0);
  rimPart.probability = 0;
  tomPart.probability = 0;
  clickPart.probability = 0;
  rhodesPart.probability = 0;
  bassPart.probability = 0;
  gamePart.probability = 0;
  cityGain.gain.value = 0;
  radioGain.gain.value = 0;

  if (radioNoise.state === "started") radioNoise.stop();
  if (cityNoise.state === "started") cityNoise.stop();

  // 重新分配这 16 条音轨
  if (idx < 4) kickParts[idx].probability = 1; // 0, 1, 2, 3
  else if (idx < 6) snareParts[idx - 4].probability = 1; // 4, 5
  else if (idx < 8) hihatParts[idx - 6].probability = 1; // 6, 7
  else if (idx === 8) rimPart.probability = 1;
  else if (idx === 9) tomPart.probability = 1;
  else if (idx === 10) clickPart.probability = 1;
  else if (idx === 11) rhodesPart.probability = 1;
  else if (idx === 12) bassPart.probability = 1;
  else if (idx === 13) gamePart.probability = 1;
  else if (idx === 14) { cityGain.gain.value = 0.1; if (cityNoise.state !== "started") cityNoise.start(); }
  else if (idx === 15) { radioGain.gain.value = 0.15; if (radioNoise.state !== "started") radioNoise.start(); }
}

// ========== 智能加权分配算法 (面试官适配模式) ==========
export async function startPlayback() {
  await Tone.start();
  
  // 核心乐器：任意 Kick(0-3), Rhodes和弦(11), Bass(12)
  const coreTracks = [0, 1, 2, 3, 11, 12];
  // 装饰乐器：其余所有 (去掉了之前的采样音轨)
  const decorTracks = [4, 5, 6, 7, 8, 9, 10, 13, 14, 15];
  
  let trackToPlay;
  const randomValue = Math.random();
  
  // 60% 概率分配核心骨架音（保证人少时也好听），40% 分配装饰音
  if (randomValue < 0.6) {
      trackToPlay = coreTracks[Math.floor(Math.random() * coreTracks.length)];
  } else {
      trackToPlay = decorTracks[Math.floor(Math.random() * decorTracks.length)];
  }

  setOnlyActiveTrack(trackToPlay);
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  Tone.Transport.start("+0.1");
}

// ========== 视觉闪烁 ==========
const flashColors = ["#FF007F", "#00FFFF", "#FFA500", "#00FF66"];
let flashIndex = 0;
export function setupBackgroundFlash() {
  if (Tone.context.state !== "running") Tone.start();
  Tone.Transport.start();
  Tone.Transport.scheduleRepeat(() => {
    flashIndex = (flashIndex + 1) % flashColors.length;
    document.body.style.backgroundColor = flashColors[flashIndex];
  }, "1m");
}
