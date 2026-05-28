import * as Tone from "https://esm.sh/tone";

Tone.Transport.bpm.value = 88;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = "8m";

// 经过合并优化，总音轨减少至 11 条，单轨更具音乐性
const TOTAL_TRACKS = 11;

// ========== 1. 完整底鼓 (Kick) ==========
const kick = new Tone.MembraneSynth().toDestination();
// 合并了原先的 4 条，现在一条音轨打满 4 拍
const kickPart = new Tone.Part(t => kick.triggerAttackRelease("C1", "8n", t), [
  ["0:0:0"], ["0:1:0"], ["0:2:0"], ["0:3:0"],
  ["1:0:0"], ["1:1:0"], ["1:2:0"], ["1:3:0"],
  ["2:0:0"], ["2:1:0"], ["2:2:0"], ["2:3:0"],
  ["3:0:0"], ["3:1:0"], ["3:2:0"], ["3:3:0"]
]);
kickPart.loop = true; kickPart.start(0); kickPart.probability = 0;

// ========== 2. 完整军鼓 (Snare) ==========
const snare = new Tone.NoiseSynth({ envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }).toDestination();
// 合并了原先的 2 条，负责 2、4 拍
const snarePart = new Tone.Part(t => snare.triggerAttackRelease("8n", t), [
  ["0:1:0"], ["0:3:0"], ["1:1:0"], ["1:3:0"],
  ["2:1:0"], ["2:3:0"], ["3:1:0"], ["3:3:0"]
]);
snarePart.loop = true; snarePart.start(0); snarePart.probability = 0;

// ========== 3. 完整踩镲 (Hihat) ==========
const hihat = new Tone.MetalSynth({ frequency: 250, envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
const hihatPart = new Tone.Part(t => hihat.triggerAttackRelease("8n", t), [
  ["0:0:2"], ["0:2:2"], ["1:0:2"], ["1:2:2"],
  ["2:0:2"], ["2:2:2"], ["3:0:2"], ["3:2:2"]
]);
hihatPart.loop = true; hihatPart.start(0); hihatPart.probability = 0;

// ========== 4. 边击 (Rim) ==========
const rim = new Tone.MetalSynth({ frequency: 200, envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 2, modulationIndex: 20, resonance: 800, octaves: 1 }).toDestination();
const rimPart = new Tone.Part(t => rim.triggerAttackRelease("16n", t), [["0:1:2"],["1:2:2"],["2:3:0"],["3:2:3"],["0:3:2"],["2:2:3"]]);
rimPart.loop = true; rimPart.start(0); rimPart.probability = 0;

// ========== 5. 嗵鼓 (Tom) ==========
const tom = new Tone.MembraneSynth({ pitchDecay: 0.1, octaves: 1.5, oscillator: { type: "sine" }, envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.5 } }).toDestination();
const tomPart = new Tone.Part(t => tom.triggerAttackRelease("A1", "8n", t), [["2:0:0"],["3:2:0"],["0:2:2"],["1:1:2"]]);
tomPart.loop = true; tomPart.start(0); tomPart.probability = 0;

// ========== 6. 节拍器效果 (Click) ==========
const clickOsc = new Tone.Oscillator("C6", "square").toDestination();
const clickPart = new Tone.Part(t => clickOsc.start(t).stop(t + 0.05), [["0:0:3"], ["1:2:2"], ["2:1:3"], ["3:3:1"], ["2:2:1"]]);
clickPart.loop = true; clickPart.start(0); clickPart.probability = 0;

// ========== 7. 和弦 (Rhodes) ==========
const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination();
const rhodes = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 3, modulationIndex: 6, oscillator: { type: "sine" }, envelope: { attack: 0.5, decay: 0.2, sustain: 0.3, release: 2 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.3, decay: 0.1, sustain: 0.2, release: 0.8 } }).connect(reverb);
const rhodesPart = new Tone.Part((time, chord) => rhodes.triggerAttackRelease(chord, "1n", time), [["0:0:0", ["D3", "F3", "C4"]], ["1:0:0", ["G3", "B3", "F4"]], ["2:0:0", ["C3", "E3", "B3", "G4"]], ["3:0:0", ["A3", "C4", "G4"]], ["4:0:0", ["D3", "F3", "A3"]], ["5:0:0", ["G3", "F4", "B4"]], ["6:0:0", ["C4", "E4", "B4", "G4"]], ["7:0:0", ["C4", "E4", "G4"]]]);
rhodesPart.loop = true; rhodesPart.loopEnd = "8m"; rhodesPart.start(0); rhodesPart.probability = 0;

// ========== 8. 贝斯 (Bass) ==========
const bassFilter = new Tone.Filter(100, "lowpass").toDestination();
const jazzBass = new Tone.MonoSynth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.03, decay: 0.2, sustain: 0.3, release: 1.5 }, filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.8, baseFrequency: 200, octaves: 1.5 } }).connect(bassFilter);
jazzBass.set({ glide: 0.08 });
const bassPart = new Tone.Part((t, n) => jazzBass.triggerAttackRelease(n, "8n", t), [["0:1:3", "C2"], ["1:0:1", "E2"], ["2:1:0", "A1"], ["3:2:2", "D2"]]);
bassPart.loop = true; bassPart.start(0); bassPart.probability = 0;

// ========== 9. 游戏合成音 (Game Synth) ==========
const gameSynth = new Tone.FMSynth({ modulationIndex: 18, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.5 } }).toDestination();
const gamePart = new Tone.Part((t, n) => gameSynth.triggerAttackRelease(n, "16n", t), [["0:0:2", "G4"], ["1:1:3", "B4"], ["2:2:1", "E5"], ["3:0:2", "D5"]]);
gamePart.loop = true; gamePart.start(0); gamePart.probability = 0;

// ========== 10 & 11. 环境音 (City & Radio) ==========
const cityNoise = new Tone.Noise("brown"); const cityGain = new Tone.Gain(0).toDestination(); cityNoise.connect(cityGain);
const radioNoise = new Tone.Noise("brown"); const radioGain = new Tone.Gain(0).toDestination(); radioNoise.connect(radioGain);


// ========== 轨道分配引擎 ==========
function setOnlyActiveTrack(idx) {
  // 1. 全员静音复位
  kickPart.probability = 0;
  snarePart.probability = 0;
  hihatPart.probability = 0;
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

  // 2. 激活唯一指定轨道 (0-10)
  switch(idx) {
    case 0: kickPart.probability = 1; break;
    case 1: snarePart.probability = 1; break;
    case 2: hihatPart.probability = 1; break;
    case 3: rimPart.probability = 1; break;
    case 4: tomPart.probability = 1; break;
    case 5: clickPart.probability = 1; break;
    case 6: rhodesPart.probability = 1; break;
    case 7: bassPart.probability = 1; break;
    case 8: gamePart.probability = 1; break;
    case 9: cityGain.gain.value = 0.1; if (cityNoise.state !== "started") cityNoise.start(); break;
    case 10: radioGain.gain.value = 0.15; if (radioNoise.state !== "started") radioNoise.start(); break;
  }
}

// ========== 启动与分配逻辑 (支持 URL 定向) ==========
export async function startPlayback() {
  await Tone.start();
  
  const urlParams = new URLSearchParams(window.location.search);
  const trackParam = urlParams.get('track');
  
  let trackToPlay;

  if (trackParam !== null && !isNaN(trackParam)) {
      // 如果扫了指定二维码，精确分配（取余确保不超出 11）
      trackToPlay = parseInt(trackParam) % TOTAL_TRACKS;
  } else {
      // 如果扫了通用二维码，启用智能加权随机
      // 核心骨架音：0(底鼓), 6(和弦), 7(贝斯)
      const coreTracks = [0, 6, 7];
      // 其他装饰/律动音：其余所有
      const decorTracks = [1, 2, 3, 4, 5, 8, 9, 10];
      
      if (Math.random() < 0.6) { // 60% 概率抽中三大核心
          trackToPlay = coreTracks[Math.floor(Math.random() * coreTracks.length)];
      } else { // 40% 概率抽中其他
          trackToPlay = decorTracks[Math.floor(Math.random() * decorTracks.length)];
      }
  }

  setOnlyActiveTrack(trackToPlay);
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  Tone.Transport.start("+0.1");
}

// ========== 视觉节奏闪烁 ==========
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
