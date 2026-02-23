import { useState, useEffect, useRef, useCallback } from 'react';

// ==================== TYPES ====================
interface DrawPoint {
  t: number;
  l: number;
  r: number;
  s: boolean;
  sl?: number;
  sr?: number;
}

interface Theme {
  name: string;
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  accentHover: string;
  border: string;
  borderLight: string;
  editorBg: string;
  editorText: string;
  scopeBg: string;
  scopeGlow: string;
  waveColorL: string;
  waveColorR: string;
  waveColorMono: string;
  selectBg: string;
  selectText: string;
  buttonBg: string;
  buttonBgActive: string;
  buttonText: string;
  buttonTextActive: string;
}

interface CodeTheme {
  name: string;
  background: string;
  text: string;
  keyword: string;
  number: string;
  string: string;
  comment: string;
  operator: string;
  function: string;
  variable: string;
  bracket: string;
}

interface Preset {
  code: string;
  mode: string;
  rate: number;
}

interface SavedProject {
  id: string;
  name: string;
  code: string;
  mode: string;
  sampleRate: number;
  timestamp: number;
}

interface AppSettings {
  uiTheme: string;
  codeTheme: string;
  syntaxHighlight: boolean;
  showLines: boolean;
  fontFamily: string;
  fontSize: number;
  showGrid: boolean;
  vizMode: string;
  scale: number;
  decay: number;
  thickness: number;
  glow: number;
  scanlines: boolean;
  scanlineIntensity: number;
  gridSize: number;
  waveColorMonoCustom: string;
  waveColorLCustom: string;
  waveColorRCustom: string;
  useCustomColors: boolean;
  editorLayout: string;
  cursorStyle: string;
  autoCompile: boolean;
  autoCompileDelay: number;
  smoothing: boolean;
  bgOpacity: number;
}

// ==================== FONTS ====================
const fonts = [
  { value: "'Courier New', Courier, monospace", label: "Courier New" },
  { value: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
  { value: "'Fira Code', monospace", label: "Fira Code" },
  { value: "'Source Code Pro', monospace", label: "Source Code Pro" },
  { value: "'Cascadia Code', monospace", label: "Cascadia Code" },
  { value: "'IBM Plex Mono', monospace", label: "IBM Plex Mono" },
  { value: "'Roboto Mono', monospace", label: "Roboto Mono" },
  { value: "'Ubuntu Mono', monospace", label: "Ubuntu Mono" },
  { value: "'Inconsolata', monospace", label: "Inconsolata" },
  { value: "'Monaco', monospace", label: "Monaco" },
  { value: "'Consolas', monospace", label: "Consolas" },
  { value: "monospace", label: "System Mono" }
];

// ==================== THEMES ====================
// Updated: waveColorMono = white (#ffffff), waveColorL = green (#00ff00), waveColorR = purple (#aa00ff)
const themes: Record<string, Theme> = {
  matrix: {
    name: 'Matrix',
    bg: '#0a0a0a',
    bgSecondary: '#111111',
    bgTertiary: '#1a1a1a',
    text: '#eeeeee',
    textMuted: '#888888',
    accent: '#00ff00',
    accentSecondary: '#00cc00',
    accentHover: '#00cc00',
    border: '#333333',
    borderLight: '#444444',
    editorBg: '#0d0d0d',
    editorText: '#00ff00',
    scopeBg: 'radial-gradient(ellipse at center, #001a00 0%, #000 70%)',
    scopeGlow: 'rgba(0, 255, 0, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#1a1a1a',
    selectText: '#00ff00',
    buttonBg: '#1a1a1a',
    buttonBgActive: '#003300',
    buttonText: '#888888',
    buttonTextActive: '#00ff00'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    bg: '#0d0221',
    bgSecondary: '#1a0533',
    bgTertiary: '#2a0944',
    text: '#f0e6ff',
    textMuted: '#9966cc',
    accent: '#ff00ff',
    accentSecondary: '#ff66ff',
    accentHover: '#cc00cc',
    border: '#4a1466',
    borderLight: '#6a2486',
    editorBg: '#0a0118',
    editorText: '#ff66ff',
    scopeBg: 'radial-gradient(ellipse at center, #1a0033 0%, #000 70%)',
    scopeGlow: 'rgba(255, 0, 255, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#2a0944',
    selectText: '#ff66ff',
    buttonBg: '#2a0944',
    buttonBgActive: '#4a1466',
    buttonText: '#9966cc',
    buttonTextActive: '#ff00ff'
  },
  arctic: {
    name: 'Arctic',
    bg: '#0a1628',
    bgSecondary: '#0f1f35',
    bgTertiary: '#152742',
    text: '#e0f0ff',
    textMuted: '#6699bb',
    accent: '#00d4ff',
    accentSecondary: '#66e0ff',
    accentHover: '#00aacc',
    border: '#234567',
    borderLight: '#345678',
    editorBg: '#081422',
    editorText: '#80e0ff',
    scopeBg: 'radial-gradient(ellipse at center, #001a2e 0%, #000812 70%)',
    scopeGlow: 'rgba(0, 212, 255, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#152742',
    selectText: '#00d4ff',
    buttonBg: '#152742',
    buttonBgActive: '#234567',
    buttonText: '#6699bb',
    buttonTextActive: '#00d4ff'
  },
  sunset: {
    name: 'Sunset',
    bg: '#1a0a0a',
    bgSecondary: '#2a1010',
    bgTertiary: '#3a1515',
    text: '#ffe6e0',
    textMuted: '#cc8866',
    accent: '#ff6633',
    accentSecondary: '#ff9966',
    accentHover: '#cc5522',
    border: '#553322',
    borderLight: '#664433',
    editorBg: '#140808',
    editorText: '#ffaa66',
    scopeBg: 'radial-gradient(ellipse at center, #2a0800 0%, #0a0000 70%)',
    scopeGlow: 'rgba(255, 102, 51, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#3a1515',
    selectText: '#ff6633',
    buttonBg: '#3a1515',
    buttonBgActive: '#553322',
    buttonText: '#cc8866',
    buttonTextActive: '#ff6633'
  },
  monochrome: {
    name: 'Mono',
    bg: '#0c0c0c',
    bgSecondary: '#141414',
    bgTertiary: '#1c1c1c',
    text: '#e0e0e0',
    textMuted: '#707070',
    accent: '#ffffff',
    accentSecondary: '#cccccc',
    accentHover: '#cccccc',
    border: '#404040',
    borderLight: '#505050',
    editorBg: '#080808',
    editorText: '#c0c0c0',
    scopeBg: 'radial-gradient(ellipse at center, #181818 0%, #000 70%)',
    scopeGlow: 'rgba(255, 255, 255, 0.2)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#1c1c1c',
    selectText: '#ffffff',
    buttonBg: '#1c1c1c',
    buttonBgActive: '#333333',
    buttonText: '#707070',
    buttonTextActive: '#ffffff'
  },
  ocean: {
    name: 'Ocean',
    bg: '#020810',
    bgSecondary: '#041020',
    bgTertiary: '#061830',
    text: '#c0e8ff',
    textMuted: '#4488aa',
    accent: '#00aaff',
    accentSecondary: '#66ccff',
    accentHover: '#0088cc',
    border: '#1a3050',
    borderLight: '#2a4060',
    editorBg: '#010610',
    editorText: '#66ccff',
    scopeBg: 'radial-gradient(ellipse at center, #001830 0%, #000408 70%)',
    scopeGlow: 'rgba(0, 170, 255, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#061830',
    selectText: '#00aaff',
    buttonBg: '#061830',
    buttonBgActive: '#1a3050',
    buttonText: '#4488aa',
    buttonTextActive: '#00aaff'
  },
  forest: {
    name: 'Forest',
    bg: '#0a100a',
    bgSecondary: '#101810',
    bgTertiary: '#182018',
    text: '#d0f0d0',
    textMuted: '#66aa66',
    accent: '#33cc33',
    accentSecondary: '#66dd66',
    accentHover: '#22aa22',
    border: '#2a4a2a',
    borderLight: '#3a5a3a',
    editorBg: '#080e08',
    editorText: '#88dd88',
    scopeBg: 'radial-gradient(ellipse at center, #0a1a0a 0%, #020402 70%)',
    scopeGlow: 'rgba(51, 204, 51, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#182018',
    selectText: '#33cc33',
    buttonBg: '#182018',
    buttonBgActive: '#2a4a2a',
    buttonText: '#66aa66',
    buttonTextActive: '#33cc33'
  },
  blood: {
    name: 'Blood',
    bg: '#100808',
    bgSecondary: '#1a0c0c',
    bgTertiary: '#241010',
    text: '#ffd0d0',
    textMuted: '#aa6666',
    accent: '#ff3333',
    accentSecondary: '#ff6666',
    accentHover: '#cc2222',
    border: '#4a2020',
    borderLight: '#5a3030',
    editorBg: '#0a0404',
    editorText: '#ff6666',
    scopeBg: 'radial-gradient(ellipse at center, #200808 0%, #040000 70%)',
    scopeGlow: 'rgba(255, 50, 50, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#241010',
    selectText: '#ff3333',
    buttonBg: '#241010',
    buttonBgActive: '#4a2020',
    buttonText: '#aa6666',
    buttonTextActive: '#ff3333'
  },
  amber: {
    name: 'Amber',
    bg: '#0f0a00',
    bgSecondary: '#1a1200',
    bgTertiary: '#252000',
    text: '#ffdd99',
    textMuted: '#aa8844',
    accent: '#ffaa00',
    accentSecondary: '#ffcc44',
    accentHover: '#cc8800',
    border: '#4a3a10',
    borderLight: '#5a4a20',
    editorBg: '#0a0700',
    editorText: '#ffcc44',
    scopeBg: 'radial-gradient(ellipse at center, #1a1000 0%, #050300 70%)',
    scopeGlow: 'rgba(255, 170, 0, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#252000',
    selectText: '#ffaa00',
    buttonBg: '#252000',
    buttonBgActive: '#4a3a10',
    buttonText: '#aa8844',
    buttonTextActive: '#ffaa00'
  },
  phosphor: {
    name: 'Phosphor',
    bg: '#000a00',
    bgSecondary: '#001400',
    bgTertiary: '#002000',
    text: '#88ff88',
    textMuted: '#44aa44',
    accent: '#44ff44',
    accentSecondary: '#66ff66',
    accentHover: '#22cc22',
    border: '#225522',
    borderLight: '#336633',
    editorBg: '#000800',
    editorText: '#66ff66',
    scopeBg: 'radial-gradient(ellipse at center, #003300 0%, #000500 70%)',
    scopeGlow: 'rgba(68, 255, 68, 0.4)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#002000',
    selectText: '#44ff44',
    buttonBg: '#002000',
    buttonBgActive: '#225522',
    buttonText: '#44aa44',
    buttonTextActive: '#44ff44'
  },
  midnight: {
    name: 'Midnight',
    bg: '#080812',
    bgSecondary: '#0e0e1c',
    bgTertiary: '#161628',
    text: '#d0d0ff',
    textMuted: '#6666aa',
    accent: '#6666ff',
    accentSecondary: '#8888ff',
    accentHover: '#4444dd',
    border: '#2a2a55',
    borderLight: '#3a3a66',
    editorBg: '#060610',
    editorText: '#8888ff',
    scopeBg: 'radial-gradient(ellipse at center, #0a0a20 0%, #020204 70%)',
    scopeGlow: 'rgba(102, 102, 255, 0.3)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#161628',
    selectText: '#6666ff',
    buttonBg: '#161628',
    buttonBgActive: '#2a2a55',
    buttonText: '#6666aa',
    buttonTextActive: '#6666ff'
  },
  neon: {
    name: 'Neon',
    bg: '#0a0010',
    bgSecondary: '#120018',
    bgTertiary: '#1a0024',
    text: '#ff88ff',
    textMuted: '#aa44aa',
    accent: '#ff00ff',
    accentSecondary: '#ff44ff',
    accentHover: '#cc00cc',
    border: '#440066',
    borderLight: '#550077',
    editorBg: '#080010',
    editorText: '#ff66ff',
    scopeBg: 'radial-gradient(ellipse at center, #1a0030 0%, #040008 70%)',
    scopeGlow: 'rgba(255, 0, 255, 0.4)',
    waveColorL: '#00ff00',
    waveColorR: '#aa00ff',
    waveColorMono: '#ffffff',
    selectBg: '#1a0024',
    selectText: '#ff00ff',
    buttonBg: '#1a0024',
    buttonBgActive: '#440066',
    buttonText: '#aa44aa',
    buttonTextActive: '#ff00ff'
  }
};

// ==================== CODE THEMES ====================
const codeThemes: Record<string, CodeTheme> = {
  atomDark: {
    name: 'Atom Dark',
    background: '#1d1f21',
    text: '#c5c8c6',
    keyword: '#b294bb',
    number: '#de935f',
    string: '#b5bd68',
    comment: '#5c6370',
    operator: '#8abeb7',
    function: '#81a2be',
    variable: '#cc6666',
    bracket: '#de935f'
  },
  monokai: {
    name: 'Monokai',
    background: '#272822',
    text: '#f8f8f2',
    keyword: '#f92672',
    number: '#ae81ff',
    string: '#e6db74',
    comment: '#75715e',
    operator: '#f92672',
    function: '#a6e22e',
    variable: '#66d9ef',
    bracket: '#f8f8f2'
  },
  dracula: {
    name: 'Dracula',
    background: '#282a36',
    text: '#f8f8f2',
    keyword: '#ff79c6',
    number: '#bd93f9',
    string: '#f1fa8c',
    comment: '#6272a4',
    operator: '#ff79c6',
    function: '#50fa7b',
    variable: '#8be9fd',
    bracket: '#f8f8f2'
  },
  solarizedDark: {
    name: 'Solarized',
    background: '#002b36',
    text: '#839496',
    keyword: '#859900',
    number: '#2aa198',
    string: '#2aa198',
    comment: '#586e75',
    operator: '#93a1a1',
    function: '#268bd2',
    variable: '#b58900',
    bracket: '#93a1a1'
  },
  nightOwl: {
    name: 'Night Owl',
    background: '#011627',
    text: '#d6deeb',
    keyword: '#c792ea',
    number: '#f78c6c',
    string: '#ecc48d',
    comment: '#637777',
    operator: '#c792ea',
    function: '#82aaff',
    variable: '#addb67',
    bracket: '#d6deeb'
  },
  gruvbox: {
    name: 'Gruvbox',
    background: '#282828',
    text: '#ebdbb2',
    keyword: '#fb4934',
    number: '#d3869b',
    string: '#b8bb26',
    comment: '#928374',
    operator: '#fe8019',
    function: '#83a598',
    variable: '#fabd2f',
    bracket: '#ebdbb2'
  },
  synthwave: {
    name: 'Synthwave',
    background: '#2b213a',
    text: '#f0e6ff',
    keyword: '#ff7edb',
    number: '#f97e72',
    string: '#72f1b8',
    comment: '#848bbd',
    operator: '#fede5d',
    function: '#36f9f6',
    variable: '#ff8b39',
    bracket: '#f0e6ff'
  },
  nord: {
    name: 'Nord',
    background: '#2e3440',
    text: '#d8dee9',
    keyword: '#81a1c1',
    number: '#b48ead',
    string: '#a3be8c',
    comment: '#616e88',
    operator: '#81a1c1',
    function: '#88c0d0',
    variable: '#8fbcbb',
    bracket: '#d8dee9'
  },
  matrix: {
    name: 'Matrix',
    background: '#0a0a0a',
    text: '#00ff00',
    keyword: '#00ff66',
    number: '#00ffaa',
    string: '#66ff00',
    comment: '#006600',
    operator: '#00cc00',
    function: '#33ff33',
    variable: '#00ff00',
    bracket: '#00aa00'
  },
  terminal: {
    name: 'Terminal',
    background: '#000000',
    text: '#00ff00',
    keyword: '#ffff00',
    number: '#ff00ff',
    string: '#00ffff',
    comment: '#555555',
    operator: '#ffffff',
    function: '#ff8800',
    variable: '#00ff00',
    bracket: '#888888'
  },
  cobalt: {
    name: 'Cobalt',
    background: '#002240',
    text: '#e1efff',
    keyword: '#ff9d00',
    number: '#ff628c',
    string: '#a5ff90',
    comment: '#0088ff',
    operator: '#ffffff',
    function: '#ffc600',
    variable: '#9effff',
    bracket: '#e1efff'
  },
  oneDark: {
    name: 'One Dark',
    background: '#21252b',
    text: '#abb2bf',
    keyword: '#c678dd',
    number: '#d19a66',
    string: '#98c379',
    comment: '#5c6370',
    operator: '#56b6c2',
    function: '#61afef',
    variable: '#e06c75',
    bracket: '#abb2bf'
  }
};

// ==================== PRESETS ====================
const presets: Record<string, Preset> = {
  classic: { code: "t * ((t>>12|t>>8)&63&t>>4)", mode: "Bytebeat", rate: 8000 },
  crowd: { code: "(t<<1^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7", mode: "Bytebeat", rate: 8000 },
  sierpinski: { code: "t & t >> 8", mode: "Bytebeat", rate: 8000 },
  fortytwo: { code: "t * (42 & t >> 10)", mode: "Bytebeat", rate: 8000 },
  techno: { code: "((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7", mode: "Bytebeat", rate: 8000 },
  ambient: { code: "(t>>4)*(13&(0x8898a989>>(t>>11&30)))", mode: "Bytebeat", rate: 8000 },
  glitch: { code: "t*(t>>11&t>>8&123&t>>3)", mode: "Bytebeat", rate: 8000 },
  stereobeat: { code: "l=t*(t>>9|t>>13),r=t*(t>>8|t>>13),[l,r]", mode: "Bytebeat", rate: 8000 },
  detunedSound: { code: "t/=6,[(u=10^t>>15&7,u+=3,y=(t>>11&7)/u,f=8*t*y,z=16*t/u&99|f|1.01*f,2*z),z*4]", mode: "Bytebeat", rate: 48000 },
  harmonics: { code: "(t*(t>>5|t>>8))>>(t>>16)", mode: "Bytebeat", rate: 8000 },
  bassline: { code: "t*((t>>9|t>>13)&25&t>>6)", mode: "Bytebeat", rate: 8000 },
  stereoPan: { code: "l=(t>>4)*((t>>9|t>>13)&23),r=(t>>4)*((t>>10|t>>14)&23),[l,r]", mode: "Bytebeat", rate: 8000 },
  wideStereo: { code: "l=t*(t>>12&t>>8|t>>4),r=t*(t>>11&t>>9|t>>5),[l,r]", mode: "Bytebeat", rate: 8000 },
  chaos: { code: "(t>>=2,k=sin(4E3/('10001001001'[t>>10&15]*t&1023)&255)*2.5,h=(tan(t*random())&1)/(1+(t>>8&3)),s=sin(t*t*t)/(1+(t>>10&3))*(t>>12&1),c=((9*t&t>>4|5*t&t>>7|(3*t&t>>10)-1)&255)/128-1,c+k+h+s)", mode: "Floatbeat", rate: 32000 },
  floatbeat: { code: "sin(t/50)*sin(t/1000)+sin(t/300)*0.5", mode: "Floatbeat", rate: 8000 },
  harmonic: { code: "sin(t/20)*0.3+sin(t/40)*0.2+sin(t/60)*0.15+sin(t/80)*0.1", mode: "Floatbeat", rate: 22050 },
  vibrato: { code: "sin(t*(1+sin(t/500)*0.1)/10)*0.7", mode: "Floatbeat", rate: 22050 },
  stereoFloat: { code: "[sin(t/30+sin(t/300))*0.6, sin(t/31+sin(t/310))*0.6]", mode: "Floatbeat", rate: 22050 },
  funcbeat: {
    code: `// Funcbeat: return a function(time, sampleRate, index)
return function(t, sr, i) {
  // t = time in seconds, sr = sample rate, i = sample index
  var freq = 440 * pow(2, (sin(t * 2) * 12) / 12);
  return sin(t * freq * 2 * PI) * 0.5;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  funcbeat2: {
    code: `// Arpeggio synth
return function(t, sr, i) {
  var notes = [261.63, 329.63, 392.00, 523.25];
  var noteIdx = floor(t * 8) % 4;
  var freq = notes[noteIdx];
  var env = 1 - ((t * 8) % 1);
  return sin(t * freq * 2 * PI) * env * 0.6;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  rave: {
    code: `function percVolume(t) {
  return ((1 - t) ** 3 * cos(cbrt(t) * PI) * 2) * 4;
}
function sharpVolume(t) {
  return ((1 - t) ** 10);
}
function kickDrum(t, p) {
  return cbrt(sin(cbrt(t * p) * p * PI * 2));
}
function noiseDrum(t, p) {
  var d = sin(random() * 0.01 * sin(t * p >> 4) * sin(t * p >> 3) * sin(t * p >> 2) * (t * p % 1666) * (t * p / 256));
  return d < 0 ? d + 1.5 : d - 1.5;
}
function instrument(time, impulseRate, timeFunc, volFunc, pitch, impulseVolMultiplier, impulseRateMultiplier) {
  impulseVolMultiplier = impulseVolMultiplier || [1];
  impulseRateMultiplier = impulseRateMultiplier || [1];
  var impulseTime = time % (60 / impulseRate / beatsPerMinute / impulseRateMultiplier[floor(time / 60 * impulseRate * beatsPerMinute) % impulseRateMultiplier.length]);
  return timeFunc(impulseTime, pitch) * volFunc(impulseTime) * impulseVolMultiplier[floor(time / 60 * impulseRate * beatsPerMinute) % impulseVolMultiplier.length];
}
function clamp(val, low, high) {
  return min(max(val, low), high);
}
function subBass(t, p) {
  return sin(t * p * PI * 2) * pow(1 - t, 4);
}

var beatsPerMinute = 140;

return function(time, rate) {
  var t = time * beatsPerMinute / 60 * 4096;

  var kick = instrument(time, 4, kickDrum, percVolume, 20, [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,1,0,1], [1]);
  var hat = instrument(time, 4, noiseDrum, sharpVolume, 8e4, [0.6,0.4,0.8,0.5, 0.7,0.3,1,0.5], [1,1,1,1]) / 2;
  var snare = instrument(time, 2, noiseDrum, sharpVolume, 1.8e4, [0,1,0,1]) * 1.2;
  var sub = instrument(time, 4, subBass, percVolume, 40, [1,0,0.8,0, 1,0,0.7,0], [1]);

  var saw1 = sin(t / 128 + sin(t / 256)) / 5;
  var saw2 = sin(t / 128.7 + sin(t / 255)) / 5;
  var saw3 = sin(t / 127.3 + sin(t / 257)) / 5;
  var saw4 = sin(t / 129 + sin(t / 254)) / 5;
  var saw5 = sin(t / 126 + sin(t / 258)) / 5;

  var chorus = (saw1 + saw2 + saw3 + saw4 + saw5) + sin((floor(t) & floor(t) >> 8) * t / 44100) / 4;
  var filterMod = sin(time * 0.5) * 0.3 + 0.7;
  var raveLead = chorus * filterMod;

  var drums = clamp(kick * 1.2 + hat + snare * 1.5 + sub, -1, 1) / 2;
  var left = drums + raveLead + sin(t / 256) / 8;
  var right = drums + raveLead - sin(t / 256) / 8;

  return [clamp(left, -1, 1) / 1.6, clamp(right, -1, 1) / 1.6];
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  rave2: {
    code: `function percVolume(t){
  return Math.pow(1-t,3)*Math.cos(Math.cbrt(t)*Math.PI)*7;
}
function sharpVolume(t){
  return Math.pow(1-t,8);
}
function kickDrum(t,p){
  return Math.cbrt(Math.sin(Math.cbrt(t*p)*p*Math.PI*2));
}
function noiseDrum(t,p){
  d=Math.sin(Math.sin(t*p>>3)*Math.sin(t*p>>2)*(t*p%2048));
  return d<0?d+1:d-1;
}
function instrument(time,rate,osc,env,pitch,pat=[1],rat=[1]){
  const bpm=140;
  const beat=Math.floor(time*rate*bpm/60);
  const r=rat[beat%rat.length]||1;
  const it=(time*rate)%(60/(bpm*r));
  return osc(it*42,pitch)*env(it)*(pat[beat%pat.length]||0);
}
return function(time){
  const bpm=140;
  const t=time/15*bpm*4096;
  const kick=instrument(time,2,kickDrum,percVolume,6.5,[1,0,2,0,1,0,2,0]);
  const hat=instrument(time,8,noiseDrum,sharpVolume,1e5,[0.7,0.3,0.9,0.4,0.6])*0.45;
  const snare=instrument(time,2,noiseDrum,sharpVolume,4e4,[0,0,1,0])*1.1;
  const wob=(t>>12)&3;
  const growl1=Math.sin(t*Math.PI/8192)*.4+Math.sin((t&t>>12)*Math.PI*t/16384)*.3-Math.sin(((t&t>>12)^(t&t>>14))*Math.PI*t/22050)*.3;
  const growl2=Math.cos(t*Math.PI/8192)*.4+Math.cos((t&t>>12)*Math.PI*t/16384)*.3-Math.cos(((t&t>>12)^(t&t>>14))*Math.PI*t/22050)*.3;
  const wobble=((t>>wob)&1?growl1:growl2)*1.35;
  const drums=kick*0.72+hat+snare*1.2;
  const L=drums*0.68+wobble*1.15;
  const R=drums*0.68-wobble*0.98;
  return [Math.max(-1,Math.min(1,L)),Math.max(-1,Math.min(1,R))];
}`,
    mode: "Funcbeat",
    rate: 48000
  },
  logmode1: { code: "log(t) * t & 255", mode: "LogMode", rate: 8000 },
  logmode2: { code: "log(t * 0.1) * (t >> 4) | (t >> 8)", mode: "LogMode", rate: 11025 },
  mode2048_1: { code: "t * (t >> 5 | t >> 8) >> (t >> 16)", mode: "Mode2048", rate: 8000 },
  mode2048_2: { code: "(t >> 6 | t | t >> (t >> 16)) * 10 + ((t >> 11) & 7)", mode: "Mode2048", rate: 8000 },
  pwm1: { code: "(t % 256 < 128) ? 255 : 0", mode: "PWM", rate: 8000 },
  pwm2: { code: "(t % 256 < (t >> 8 & 255)) ? 255 : 0", mode: "PWM", rate: 8000 },
  softbeat: { code: "tanh(sin(t / 50) * 3) * 0.8", mode: "SoftBeat", rate: 22050 },
  sqrt1: { code: "sqrt(t) * (t >> 10) & 255", mode: "SqrtBeat", rate: 8000 },
  expbeat1: { code: "exp(sin(t/100))*50 & 255", mode: "ExpBeat", rate: 11025 },
  sinbeat1: { code: "(sin(t/10)+1)*127", mode: "Sinbeat", rate: 8000 },
  tanbeat1: { code: "tan(t/100)*50&255", mode: "Tanbeat", rate: 8000 },
  modbeat1: { code: "t%(t>>8|1)*2", mode: "Modbeat", rate: 8000 },
  xorbeat1: { code: "t^(t>>8)^(t>>12)", mode: "Xorbeat", rate: 8000 },
  fracbeat: { code: "((t*1.5)&255)^((t*0.75)&255)", mode: "Fracbeat", rate: 8000 },
  wavebeat: { code: "sin(t/10)*128+cos(t/20)*64+sin(t/40)*32", mode: "Wavebeat", rate: 11025 },
  base1: { code: 'eval(unescape(escape("\u7468\u6973\u2E76\u3F3F\u3D30\u2C77\u3D76\u2F36\u2C73\u3D28\u772C\u732C\u6929\u3D3E\u2876\u2B2B\u7C7C\u2861\u3D41\u7272\u6179\u2872\u6F75\u6E64\u2873\u2929\u2E66\u696C\u6C28\u3029\u292C\u773D\u7725\u3235\u362B\u615B\u7A3D\u7625\u612E\u6C65\u6E67\u7468\u5D2C\u615B\u7A5D\u3D77\u2A69\u2C77\u292C\u703D\u2877\u2C73\u3D30\u293D\u3E77\u2A32\u2A2A\u2828\u732D\u3229\u2F31\u3229\u2C66\u6D3D\u733D\u3E73\u696E\u2873\u2F32\u2B73\u696E\u2873\u2F32\u2D31\u292A\u7369\u6E28\u7369\u6E28\u732B\u7369\u6E28\u7329\u292F\u322B\u7369\u6E28\u732F\u3229\u292A\u2A33\u2A28\u772F\u3235\u3625\u3235\u362F\u3634\u2929\u2F32\u1F63\u3D28\u652C\u663D\u312C\u673D\u2266\u6D22\u293D\u3E65\u7661\u6C28\u6729\u2870\u2877\u2C65\u5B30\u5D29\u2A50\u492F\u3634\u2A66\u292B\u6576\u616C\u2867\u2928\u7028\u772C\u655B\u315D\u292A\u5049\u2F36\u342A\u6629\u2B65\u7661\u6C28\u6729\u2870\u2877\u2C65\u5B32\u5D29\u2A50\u492F\u3634\u2A66\u292C\u6E3D\u7028\u772C\u6F3D\u2238\u3635\u3422\u5B77\u3E3E\u3136\u2633\u5D29\u2C73\u6F6E\u673D\u7228\u7369\u6E28\u7228\u7369\u6E28\u6328\u713D\u5B5B\u382C\u2D34\u2C33\u5D2C\u5B36\u2C2D\u312C\u315D\u2C5B\u352C\u312C\u2D32\u5D2C\u5B34\u2C31\u2C2D\u335D\u5D5B\u773E\u3E31\u3626\u335D\u2C31\u292A\u2873\u696E\u2877\u2F36\u3535\u3336\u292F\u342B\u2E35\u2929\u2F32\u2C34\u3931\u3532\u2C2D\u2E35\u292B\u2121\u2877\u3E3E\u3139\u292A\u2828\u7028\u772C\u6F2D\u2875\u3D5B\u5B30\u2C33\u2C37\u2C31\u302C\u3132\u5D2C\u5B30\u2C33\u2C37\u2C31\u302C\u3132\u5D2C\u5B30\u2C34\u2C37\u2C39\u2C31\u325D\u2C5B\u302C\u332C\u352C\u372C\u3132\u5D5D\u295B\u773E\u3E31\u3626\u335D\u5B28\u2877\u3E3E\u3131\u292A\u2A45\u2531\u307C\u3029\u2535\u5D29\u2F36\u3426\u3129\u2A28\u772F\u3136\u3338\u3425\u3129\u2F32\u2B73\u696E\u2832\u2A73\u7172\u7428\u7725\u2877\u3E3E\u3230\u3F31\u3633\u3838\u343A\u3635\u3533\u3629\u2929\u2F33\u292B\u2121\u2877\u3E3E\u3230\u292A\u2877\u2A2A\u7369\u6E28\u772A\u7729\u2531\u292A\u2877\u2F31\u3633\u3838\u3425\u312D\u3129\u2A28\u773E\u3E31\u3426\u3129\u2F32\u292F\u322D\u2121\u2832\u2A77\u2F33\u3E3E\u3230\u292A\u6173\u696E\u2873\u696E\u2870\u2832\u2A77\u2C6F\u2D75\u5B77\u3E3E\u3136\u2633\u5D5B\u2828\u773E\u3E31\u3129\u2A2A\u5049\u2531\u307C\u3029\u2535\u5D29\u2A50\u492F\u3634\u292A\u2877\u2F31\u3633\u3838\u3425\u3129\u2F32\u292B\u2821\u2128\u772F\u333E\u3E32\u3029\u2A73\u696E\u2873\u696E\u2870\u2877\u2C6F\u2D75\u5B77\u3E3E\u3136\u2633\u5D5B\u2828\u773E\u3E31\u3229\u2A2A\u5049\u2531\u377C\u3029\u2535\u5D29\u2A50\u492F\u3634\u292D\u7228\u6328\u712C\u322C\u2273\u696E\u2229\u2C31\u3232\u3838\u382C\u2D2E\u3529\u2F34\u292F\u322B\u7228\u6328\u712C\u3229\u2F34\u2C31\u3238\u2C2D\u2E35\u292A\u2877\u2F36\u3535\u3336\u2531\u292A\u3229\u2C31\u3633\u3838\u342C\u2E35\u292F\u322D\u2833\u2A77\u3E3E\u3429\u2A28\u372A\u773E\u3E35\u292A\u7725\u7371\u7274\u2832\u292F\u322F\u2877\u2F32\u3034\u3825\u3235\u362D\u3235\u3629").replace(/u(..)/g,"$1%")))', mode: "Floatbeat", rate: 64000 },
  // Additional classic presets
  viznut: { code: "t*(((t>>12)|(t>>8))&(63&(t>>4)))", mode: "Bytebeat", rate: 8000 },
  formula42: { code: "(t>>6|t|t>>(t>>16))*10+((t>>11)&7)", mode: "Bytebeat", rate: 8000 },
  danoise: { code: "((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7", mode: "Bytebeat", rate: 8000 },
  greggman: { code: "((t>>10)&42)*t", mode: "Bytebeat", rate: 8000 },
  tejeez: { code: "t*5&(t>>7)|t*3&(t*4>>10)", mode: "Bytebeat", rate: 8000 },
  xpansive: { code: "(t*(t>>8|t>>9)&46&t>>8)^(t&t>>13|t>>6)", mode: "Bytebeat", rate: 8000 },
  // More stereo
  stereoPhaser: { code: "[sin(t/20+sin(t/200)*3)*0.7,sin(t/20.5+sin(t/205)*3)*0.7]", mode: "Floatbeat", rate: 44100 },
  stereoChorus: { code: "[sin(t/30)*0.5+sin(t/31)*0.3,sin(t/29)*0.5+sin(t/32)*0.3]", mode: "Floatbeat", rate: 44100 },
  spaceStereo: { code: "l=sin(t/50+sin(t/500))*0.6,r=sin(t/51+cos(t/490))*0.6,[l+sin(t/1000)*0.2,r+cos(t/1000)*0.2]", mode: "Floatbeat", rate: 44100 },
  // High frequency experiments
  ultraSonic: { code: "sin(t/5)*sin(t/100)+sin(t/7)*0.5", mode: "Floatbeat", rate: 96000 },
  crystalHD: { code: "sin(t/3)*0.3+sin(t/5)*0.3+sin(t/7)*0.2+sin(t/11)*0.1", mode: "Floatbeat", rate: 88200 },
  // Low frequency / Lo-Fi
  lofi: { code: "(t*(t>>5|t>>8))>>(t>>16)", mode: "Bytebeat", rate: 4000 },
  retro8bit: { code: "t*(42&t>>10)+(t>>6)", mode: "Bytebeat", rate: 8000 },
  chiptune: { code: "(t>>4)*(13&(0x8898a989>>(t>>11&30)))", mode: "Bytebeat", rate: 11025 },
  // Funcbeat experiments
  wobble: {
    code: `return function(t, sr, i) {
  var wobbleFreq = 4 + sin(t * 0.5) * 3;
  var baseFreq = 110 * pow(2, floor(t * 2) % 12 / 12);
  var wobble = sin(t * wobbleFreq * 2 * PI);
  return sin(t * baseFreq * 2 * PI * (1 + wobble * 0.02)) * 0.6;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  pad: {
    code: `return function(t, sr, i) {
  var osc1 = sin(t * 220 * 2 * PI);
  var osc2 = sin(t * 220.5 * 2 * PI);
  var osc3 = sin(t * 219.5 * 2 * PI);
  var osc4 = sin(t * 330 * 2 * PI) * 0.5;
  var lfo = (sin(t * 0.2 * 2 * PI) + 1) / 2;
  return (osc1 + osc2 + osc3 + osc4) * 0.2 * (0.5 + lfo * 0.5);
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  bass303: {
    code: `return function(t, sr, i) {
  var notes = [32.7, 36.7, 41.2, 43.65, 49.0, 55.0, 61.74, 65.41];
  var noteIdx = floor(t * 4) % 8;
  var freq = notes[noteIdx];
  var env = pow(1 - ((t * 4) % 1), 0.5);
  var osc = sin(t * freq * 2 * PI) + sin(t * freq * 4 * PI) * 0.5;
  var filter = sin(t * freq * 2 * PI * (1 + env * 3));
  return (osc * 0.3 + filter * 0.5) * env * 0.8;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  musicBox: {
    code: `T=182/60;arrays={e:'0 C 7 4 C7  44  1 D 8 5 D8  55  0 C 7 4 C7  44  345 567 789 C',S:'00000077000000771111118811111188000000770000007777779999BBBBCCCC'};pwm=c=>(c%128+69&128)/256-.25;shift=c=>2**(parseInt(c,36)/12);fm=(c,d=PI/64)=>{x=0;for(i=-1;3>i;i++)x+=sinh(sin(c*i*d+cos(c*i*d/4+sin(c*d/4)/8)*i*12));return x};return c=>{a=pwm(c*(B=34500)*2*shift(arrays.e[n=0|c*T*4]));b=fm(c*B/2*shift(arrays.S[n]))*.52**(O='/'==(C='/// /// /// /// /// /// RRRRRRRR'[c*T*2&31])?c*T%2:C=='R'?c*T%1:c*T%.5)+pwm(c/2*B*shift(arrays.S[n]))*.32**O*8;return(a+b/8)/2}`,
    mode: "Funcbeat",
    rate: 44100
  },
  epicStereo: {
    code: `var samplerate = 44100;
var c_ = 0, d_ = 0;
return function(time) {
  var t = floor(time * samplerate);
  c_ += d_ += ((random() - random()) - c_ - d_) / max(pow(0.9993, (t/2/16 % 8192)) * 800, 1);
  var s = c_ * (sign(max(atan(t - 65536 * 12), 0)) * sign(max(atan(-t + 65536 * 16), 0))) * log(pow(1.0001, (t/2 % 8192)));
  var a = (((t >> (t % (t >> 12))) | (t & (t >> 1) & (t >> 2)) * t / 4096) & 255) *
          [min((t / 128 / 128 / 16), 1), log(pow(1.0005, (t/2 % 8192))) / 4][sign(max(atan(t - 65536 * 8), 0))] *
          1.1 / 128 / 2 - 0.5;
  var mode = ((t >> 14) & 1) * ((t >> 15) & 1) * ((t >> 16) & 1) + 1;
  var b = t * mode - pow(0.9993, (t/2 * mode % 8192) / mode * 3) * 7600;
  var extra1 = sin(pow(0.998, (t/2 % 8192)) * 80) * sign(max(atan(t - 65536 * 8), 0)) / 1.5;
  var extra2 = (random() - random()) * pow(0.9995, (t/2 % 8192)) * ((t >> 14) & 1) / 1.5 +
               (random() - random()) * pow(0.999, (t * 2 % 8192)) / 1.5;
  extra2 *= sign(max(atan(t - 65536 * 4), 0));
  var extra3 = a * (((~(t >> ( (t & 16384 ? 12 : 11) )) & 1)) || 
                   sign(max(atan(~t + 65536 * 7.5), 0)) + 
                   sign(max(atan(t - 65536 * 8), 0)));
  var extra4 = (b / 256 & 3) * sign(max(atan(t - 65536 * 8), 0)) / 4;
  s += extra1 + extra2 + extra3 + extra4;
  return [s + a * 0.4, s - a * 0.4];
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  ambient2: {
    code: `return function(t, sr, i) {
  var f1 = 110 + sin(t * 0.1) * 20;
  var f2 = 220 + cos(t * 0.15) * 30;
  var f3 = 55 + sin(t * 0.05) * 10;
  var lfo = (sin(t * 0.3) + 1) / 2;
  var osc1 = sin(t * f1 * 2 * PI) * 0.3;
  var osc2 = sin(t * f2 * 2 * PI) * 0.2 * lfo;
  var osc3 = sin(t * f3 * 2 * PI) * 0.2;
  var noise = (random() - 0.5) * 0.02;
  return osc1 + osc2 + osc3 + noise;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  dnbDrums: {
    code: `return function(t, sr, i) {
  var bpm = 174;
  var beat = t * bpm / 60;
  var kickPattern = [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0];
  var snarePattern = [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0];
  var hatPattern = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0];
  var step = floor(beat * 4) % 16;
  var subBeat = (beat * 4) % 1;
  var kick = kickPattern[step] * sin(pow(1 - subBeat, 3) * 200) * pow(1 - subBeat, 2);
  var snare = snarePattern[step] * (random() - 0.5) * pow(1 - subBeat, 1.5);
  var hat = hatPattern[step] * (random() - 0.5) * pow(1 - subBeat, 4) * 0.3;
  return (kick * 0.8 + snare * 0.6 + hat) * 0.8;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  acidBass: {
    code: `return function(t, sr, i) {
  var bpm = 130;
  var beat = t * bpm / 60;
  var notes = [55, 55, 73.42, 55, 82.41, 55, 55, 61.74];
  var noteIdx = floor(beat * 2) % 8;
  var freq = notes[noteIdx];
  var subBeat = (beat * 2) % 1;
  var env = pow(1 - subBeat, 0.3);
  var cutoff = 200 + env * 2000 + sin(t * 4) * 500;
  var saw = 0;
  for (var h = 1; h <= 10; h++) {
    if (h * freq < cutoff) {
      saw += sin(t * freq * h * 2 * PI) / h;
    }
  }
  var accent = (noteIdx % 3 === 0) ? 1.3 : 1;
  return saw * env * 0.4 * accent;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  retroSynth: {
    code: `return function(t, sr, i) {
  var melody = [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66];
  var noteIdx = floor(t * 3) % 8;
  var freq = melody[noteIdx];
  var subNote = (t * 3) % 1;
  var env = subNote < 0.1 ? subNote * 10 : pow(1 - (subNote - 0.1) / 0.9, 0.5);
  var pulse = sin(t * freq * 2 * PI) > sin(t * 2) * 0.3 ? 1 : -1;
  var sub = sin(t * freq * PI);
  var vibrato = sin(t * freq * 2 * PI * (1 + sin(t * 6) * 0.01));
  return (pulse * 0.3 + sub * 0.2 + vibrato * 0.2) * env * 0.7;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  spaceAmbient: {
    code: `return function(t, sr, i) {
  var drone1 = sin(t * 55 * 2 * PI) * 0.2;
  var drone2 = sin(t * 82.5 * 2 * PI + sin(t * 0.1) * 2) * 0.15;
  var drone3 = sin(t * 110 * 2 * PI + cos(t * 0.07) * 3) * 0.1;
  var shimmer = sin(t * 880 * 2 * PI + sin(t * 3) * 5) * 0.05 * (sin(t * 0.5) + 1) / 2;
  var lfo = (sin(t * 0.2) + 1) / 2;
  var pad = drone1 + drone2 + drone3 + shimmer;
  var left = pad * (0.7 + lfo * 0.3);
  var right = pad * (1 - lfo * 0.3);
  return [left * 0.8, right * 0.8];
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  glitchBeats: {
    code: `return function(t, sr, i) {
  var bpm = 140;
  var beat = t * bpm / 60;
  var glitch = sin(floor(beat * 16) * 12345.6789) * 0.5 + 0.5;
  var kick = sin(pow(1 - (beat % 1), 3) * 150) * (beat % 1 < 0.3 ? 1 : 0);
  var noise = (random() - 0.5) * glitch * ((floor(beat * 4) % 4 === 2) ? 1 : 0);
  var tone = sin(t * (200 + floor(beat * 8) % 4 * 100) * 2 * PI) * 0.2 * (glitch > 0.7 ? 1 : 0);
  var stutter = sin(t * 440 * 2 * PI) * ((floor(beat * 32) % 3 === 0) ? 0.3 : 0) * (beat % 4 > 3 ? 1 : 0);
  return (kick * 0.6 + noise * 0.4 + tone + stutter) * 0.7;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  chipArpeggio: {
    code: `return function(t, sr, i) {
  var bpm = 150;
  var beat = t * bpm / 60;
  var notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 659.25, 523.25];
  var noteIdx = floor(beat * 8) % 8;
  var freq = notes[noteIdx];
  var octave = floor(beat / 4) % 3;
  freq *= pow(2, octave - 1);
  var square = sin(t * freq * 2 * PI) > 0 ? 0.3 : -0.3;
  var env = 1 - ((beat * 8) % 1) * 0.5;
  return square * env;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  orchestralHit: {
    code: `return function(t, sr, i) {
  var bpm = 120;
  var beat = t * bpm / 60;
  var hitTime = beat % 4;
  var isHit = hitTime < 0.5;
  if (!isHit) return 0;
  var env = pow(1 - hitTime * 2, 0.3);
  var bass = sin(t * 65.41 * 2 * PI) * 0.3;
  var mid1 = sin(t * 130.81 * 2 * PI) * 0.2;
  var mid2 = sin(t * 196.00 * 2 * PI) * 0.15;
  var high = sin(t * 392.00 * 2 * PI) * 0.1;
  var brass = sin(t * 261.63 * 2 * PI + sin(t * 5) * 0.5) * 0.15;
  var strings = sin(t * 523.25 * 2 * PI) * 0.08 + sin(t * 659.25 * 2 * PI) * 0.05;
  var noise = (random() - 0.5) * 0.1 * pow(env, 2);
  return (bass + mid1 + mid2 + high + brass + strings + noise) * env;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  vaporwave: {
    code: `return function(t, sr, i) {
  var slowT = t * 0.7;
  var chord = [261.63, 329.63, 392.00, 493.88];
  var chordIdx = floor(slowT / 2) % 2;
  var freqs = chordIdx === 0 ? [261.63, 329.63, 392.00] : [220.00, 277.18, 329.63];
  var pad = 0;
  for (var j = 0; j < 3; j++) {
    pad += sin(slowT * freqs[j] * 2 * PI + sin(slowT * 0.5) * 0.5) * 0.2;
    pad += sin(slowT * freqs[j] * 1.002 * 2 * PI) * 0.1;
  }
  var lfo = (sin(slowT * 0.3) + 1) / 2;
  var filter = 0.5 + lfo * 0.5;
  var left = pad * filter;
  var right = pad * (1 - filter * 0.3);
  return [left * 0.6, right * 0.6];
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  synthBass: {
    code: `return function(t, sr, i) {
  var bpm = 125;
  var beat = t * bpm / 60;
  var pattern = [1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0];
  var notes = [55, 55, 55, 73.42, 73.42, 73.42, 82.41, 82.41, 55, 55, 61.74, 61.74, 73.42, 55, 55, 55];
  var step = floor(beat * 4) % 16;
  var freq = notes[step];
  var gate = pattern[step];
  var subBeat = (beat * 4) % 1;
  var env = gate * pow(1 - subBeat, 0.4);
  var saw = 0;
  for (var h = 1; h <= 8; h++) {
    saw += sin(t * freq * h * 2 * PI) / h * 0.5;
  }
  var sub = sin(t * freq * PI) * 0.4;
  return (saw + sub) * env * 0.7;
}`,
    mode: "Funcbeat",
    rate: 44100
  },
  cosmicPad: {
    code: `return function(t, sr, i) {
  var f1 = 110 * (1 + sin(t * 0.05) * 0.1);
  var f2 = 165 * (1 + cos(t * 0.07) * 0.1);
  var f3 = 220 * (1 + sin(t * 0.03) * 0.1);
  var osc1 = sin(t * f1 * 2 * PI + sin(t * 0.5) * 2);
  var osc2 = sin(t * f2 * 2 * PI + cos(t * 0.7) * 2);
  var osc3 = sin(t * f3 * 2 * PI + sin(t * 0.3) * 2);
  var mix = (osc1 + osc2 + osc3) / 3;
  var stereoMod = sin(t * 0.2);
  var left = mix * (0.6 + stereoMod * 0.4);
  var right = mix * (0.6 - stereoMod * 0.4);
  left += sin(t * 55 * 2 * PI) * 0.1;
  right += sin(t * 55 * 2 * PI) * 0.1;
  return [left * 0.5, right * 0.5];
}`,
    mode: "Funcbeat",
    rate: 44100
  }
};

// ==================== AUDIO WORKLET PROCESSOR CODE ====================
const processorCode = `
class BytebeatProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.t = 0;
    this.isPlaying = false;
    this.sampleRateVal = 32000;
    this.mode = "Floatbeat";
    this.func = null;
    this.errorShown = false;
    this.isStereo = false;
    this.codeVersion = 0;
    this.compiledVersion = -1;
    this.pendingCode = null;
    this.lastThrownMessage = null;
    this.thrownMessageTime = 0;
    this.port.onmessage = (e) => this.handleMessage(e.data);
  }

  handleMessage(data) {
    if (data.isPlaying !== undefined) this.isPlaying = data.isPlaying;
    if (data.sampleRate !== undefined) this.sampleRateVal = data.sampleRate;
    if (data.mode !== undefined) {
      this.mode = data.mode;
    }
    if (data.resetTime) {
      this.t = 0;
      this.lastThrownMessage = null;
      this.thrownMessageTime = 0;
      this.port.postMessage({t: 0, clearThrownMessage: true});
    }
    if (data.code !== undefined) {
      this.codeVersion++;
      this.pendingCode = { code: data.code, version: this.codeVersion };
      this.lastThrownMessage = null;
      this.thrownMessageTime = 0;
      this.compile(data.code);
    }
    if (data.forceRecompile) {
      if (this.pendingCode) {
        this.compile(this.pendingCode.code);
      }
    }
  }

  autoUnpack(code) {
    var trimmed = code.trim();
    if (trimmed[trimmed.length - 1] === ';') trimmed = trimmed.slice(0, -1).trim();
    if (trimmed.indexOf('eval(unescape(escape') !== 0) return code;
    try {
      var inner = trimmed.slice(5, -1);
      var unpacked = eval(inner);
      if (typeof unpacked === 'string' && unpacked.length > 0) return unpacked;
    } catch(e) {
      try {
        var ei = trimmed.indexOf('escape') + 6;
        var nc = trimmed[ei];
        var si, ed;
        if (nc === String.fromCharCode(96)) { si = ei + 1; ed = String.fromCharCode(96); }
        else if (nc === '(') {
          var qc = trimmed[ei + 1];
          if (qc === '"' || qc === "'") { si = ei + 2; ed = qc; }
          else return code;
        } else return code;
        var eidx = -1;
        for (var k = si; k < trimmed.length; k++) {
          if (trimmed[k] === '\\\\' && ed !== String.fromCharCode(96)) { k++; continue; }
          if (trimmed[k] === ed) { eidx = k; break; }
        }
        if (eidx === -1) return code;
        var ps = trimmed.substring(si, eidx);
        var result = '';
        for (var j = 0; j < ps.length; j++) {
          var cc = ps.charCodeAt(j);
          if (cc > 255) { result += String.fromCharCode((cc >> 8) & 255, cc & 255); }
          else { result += ps[j]; }
        }
        if (result.trim().length > 0) return result.trim();
      } catch(e2) {}
    }
    return code;
  }

  compile(code) {
    code = this.autoUnpack(code);
    try {
      const mathFuncs = Object.getOwnPropertyNames(Math);
      const mathVals = mathFuncs.map(k => Math[k]);
      mathFuncs.push("int");
      mathVals.push(Math.floor);

      if (this.mode === "Funcbeat") {
        let contextCode = "";
        for (let i = 0; i < mathFuncs.length; i++) {
          contextCode += "var " + mathFuncs[i] + " = __ctx__[" + i + "];\\n";
        }
        contextCode += "var PI = Math.PI;\\n";
        contextCode += "var E = Math.E;\\n";
        contextCode += "var random = Math.random;\\n";
        // Predeclare common helper variables so bare assignments like T=182/60 work
        contextCode += "var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,u,v,w,x,y,z," +
                       "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,U,V,W,X,Y,Z," +
                       "T,arrays,pwm,shift,fm,B,O;\\n";
        
        const wrappedCode = "(function(__ctx__) {\\n" + contextCode + code + "\\n})";
        
        const factory = eval(wrappedCode);
        this.func = factory(mathVals);
        
        if (typeof this.func !== "function") {
          throw new Error("Funcbeat must return a function");
        }
        let testResult;
        try {
          testResult = this.func(0, this.sampleRateVal, 0);
        } catch (thrown) {
          testResult = (thrown !== undefined && thrown !== null) ? thrown : 0;
        }
        this.isStereo = Array.isArray(testResult);
        this.port.postMessage({stereoMode: this.isStereo});
      } else {
        this.func = new Function(...mathFuncs, "t", "return " + (code || "0"));
        this.func = this.func.bind(null, ...mathVals);
        
        let testResult;
        try {
          testResult = this.func(0);
        } catch (thrown) {
          testResult = (thrown !== undefined && thrown !== null) ? thrown : 0;
        }
        this.isStereo = Array.isArray(testResult);
        this.port.postMessage({stereoMode: this.isStereo});
      }
      this.compiledVersion = this.codeVersion;
      this.errorShown = false;
      this.port.postMessage({error: null, compiled: true});
    } catch(e) {
      this.func = null;
      this.errorShown = false;
      this.port.postMessage({error: "Compile: " + e.message});
    }
  }

  processSample(ti) {
    let rawValue = 0;
    let sampleL = 0;
    let sampleR = 0;
    let rawL = 0;
    let rawR = 0;
    let thrownMsg = null;

    if (this.mode === "Funcbeat") {
      try {
        rawValue = this.func(ti / this.sampleRateVal, this.sampleRateVal, ti);
      } catch (thrown) {
        if (typeof thrown === 'string') {
          thrownMsg = thrown;
          rawValue = 0;
        } else if (thrown && thrown.message && typeof thrown.message === 'string' && !(thrown instanceof Error)) {
          thrownMsg = thrown.message;
          rawValue = typeof thrown.value === 'number' ? thrown.value : 0;
        } else if (typeof thrown === 'number') {
          rawValue = thrown;
        } else if (Array.isArray(thrown)) {
          rawValue = thrown;
        } else if (thrown !== undefined && thrown !== null) {
          rawValue = thrown;
        } else {
          rawValue = 0;
        }
      }
      
      if (thrownMsg !== null && thrownMsg !== this.lastThrownMessage) {
        this.lastThrownMessage = thrownMsg;
        this.thrownMessageTime = ti;
        this.port.postMessage({thrownMessage: thrownMsg});
      }
      if (Array.isArray(rawValue)) {
        sampleL = Math.max(-1, Math.min(1, rawValue[0] || 0));
        sampleR = Math.max(-1, Math.min(1, rawValue[1] || 0));
        rawL = sampleL;
        rawR = sampleR;
      } else {
        sampleL = sampleR = Math.max(-1, Math.min(1, rawValue || 0));
        rawL = rawR = sampleL;
      }
    } else {
      try {
        rawValue = this.func(ti);
      } catch (thrown) {
        if (typeof thrown === 'string') {
          thrownMsg = thrown;
          rawValue = 0;
        } else if (thrown && thrown.message && typeof thrown.message === 'string' && !(thrown instanceof Error)) {
          thrownMsg = thrown.message;
          rawValue = typeof thrown.value === 'number' ? thrown.value : 0;
        } else if (typeof thrown === 'number') {
          rawValue = thrown;
        } else if (Array.isArray(thrown)) {
          rawValue = thrown;
        } else if (thrown !== undefined && thrown !== null) {
          rawValue = thrown;
        } else {
          rawValue = 0;
        }
      }
      
      if (thrownMsg !== null && thrownMsg !== this.lastThrownMessage) {
        this.lastThrownMessage = thrownMsg;
        this.thrownMessageTime = ti;
        this.port.postMessage({thrownMessage: thrownMsg});
      }
      
      let valL, valR;
      if (Array.isArray(rawValue)) {
        valL = rawValue[0] || 0;
        valR = rawValue[1] || 0;
      } else {
        valL = valR = rawValue;
      }
      
      if (this.mode === "Bytebeat") {
        sampleL = ((valL & 255) - 128) / 128;
        sampleR = ((valR & 255) - 128) / 128;
        rawL = valL & 255;
        rawR = valR & 255;
      } else if (this.mode === "Signed Bytebeat") {
        sampleL = (((valL + 128) & 255) - 128) / 128;
        sampleR = (((valR + 128) & 255) - 128) / 128;
        rawL = (valL + 128) & 255;
        rawR = (valR + 128) & 255;
      } else if (this.mode === "Floatbeat") {
        sampleL = Math.max(-1, Math.min(1, valL || 0));
        sampleR = Math.max(-1, Math.min(1, valR || 0));
        rawL = sampleL;
        rawR = sampleR;
      } else if (this.mode === "Bitbeat") {
        sampleL = (valL & 1) ? 0.5 : -0.5;
        sampleR = (valR & 1) ? 0.5 : -0.5;
        rawL = (valL & 1) ? 255 : 0;
        rawR = (valR & 1) ? 255 : 0;
      } else if (this.mode === "LogMode") {
        const logValL = Math.log(Math.abs(valL) + 1);
        const logValR = Math.log(Math.abs(valR) + 1);
        sampleL = ((logValL * 10 & 255) - 128) / 128;
        sampleR = ((logValR * 10 & 255) - 128) / 128;
        rawL = (logValL * 10) & 255;
        rawR = (logValR * 10) & 255;
      } else if (this.mode === "Mode2048") {
        sampleL = (((valL & 2047) / 1024) - 1);
        sampleR = (((valR & 2047) / 1024) - 1);
        rawL = (valL & 2047) >> 3;
        rawR = (valR & 2047) >> 3;
      } else if (this.mode === "PWM") {
        const pwmL = (valL & 255) > 127 ? 1 : -1;
        const pwmR = (valR & 255) > 127 ? 1 : -1;
        sampleL = pwmL * 0.5;
        sampleR = pwmR * 0.5;
        rawL = pwmL > 0 ? 255 : 0;
        rawR = pwmR > 0 ? 255 : 0;
      } else if (this.mode === "SoftBeat") {
        sampleL = Math.tanh(valL) * 0.9;
        sampleR = Math.tanh(valR) * 0.9;
        rawL = Math.floor((sampleL + 1) * 127.5);
        rawR = Math.floor((sampleR + 1) * 127.5);
      } else if (this.mode === "SqrtBeat") {
        const sqrtL = Math.sqrt(Math.abs(valL)) * Math.sign(valL);
        const sqrtR = Math.sqrt(Math.abs(valR)) * Math.sign(valR);
        sampleL = ((sqrtL & 255) - 128) / 128;
        sampleR = ((sqrtR & 255) - 128) / 128;
        rawL = Math.abs(sqrtL) & 255;
        rawR = Math.abs(sqrtR) & 255;
      } else if (this.mode === "ExpBeat") {
        const expL = Math.exp(valL / 255) * 50;
        const expR = Math.exp(valR / 255) * 50;
        sampleL = ((expL & 255) - 128) / 128;
        sampleR = ((expR & 255) - 128) / 128;
        rawL = expL & 255;
        rawR = expR & 255;
      } else if (this.mode === "Sinbeat") {
        sampleL = Math.sin(valL / 40) * 0.8;
        sampleR = Math.sin(valR / 40) * 0.8;
        rawL = Math.floor((sampleL + 1) * 127.5);
        rawR = Math.floor((sampleR + 1) * 127.5);
      } else if (this.mode === "Tanbeat") {
        const tanL = Math.tan(valL / 100);
        const tanR = Math.tan(valR / 100);
        sampleL = Math.max(-1, Math.min(1, tanL * 0.3));
        sampleR = Math.max(-1, Math.min(1, tanR * 0.3));
        rawL = Math.floor((sampleL + 1) * 127.5);
        rawR = Math.floor((sampleR + 1) * 127.5);
      } else if (this.mode === "Modbeat") {
        sampleL = ((valL & 255) - 128) / 128;
        sampleR = ((valR & 255) - 128) / 128;
        rawL = valL & 255;
        rawR = valR & 255;
      } else if (this.mode === "Xorbeat") {
        const xorL = valL ^ (valL >> 4);
        const xorR = valR ^ (valR >> 4);
        sampleL = ((xorL & 255) - 128) / 128;
        sampleR = ((xorR & 255) - 128) / 128;
        rawL = xorL & 255;
        rawR = xorR & 255;
      } else if (this.mode === "Fracbeat") {
        sampleL = ((valL & 255) - 128) / 128;
        sampleR = ((valR & 255) - 128) / 128;
        rawL = valL & 255;
        rawR = valR & 255;
      } else if (this.mode === "Wavebeat") {
        sampleL = Math.max(-1, Math.min(1, valL / 255));
        sampleR = Math.max(-1, Math.min(1, valR / 255));
        rawL = Math.floor((sampleL + 1) * 127.5);
        rawR = Math.floor((sampleR + 1) * 127.5);
      } else {
        sampleL = ((valL & 255) - 128) / 128;
        sampleR = ((valR & 255) - 128) / 128;
        rawL = valL & 255;
        rawR = valR & 255;
      }
    }

    return { sampleL, sampleR, rawL, rawR };
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const channel0 = output[0];
    const channel1 = output[1] || channel0;
    const len = channel0.length;

    if (!this.isPlaying || !this.func) {
      channel0.fill(0);
      if (channel1 !== channel0) channel1.fill(0);
      return true;
    }

    const ratio = this.sampleRateVal / sampleRate;
    const drawData = [];

    for (let i = 0; i < len; i++) {
      const ti = Math.floor(this.t);
      let result = { sampleL: 0, sampleR: 0, rawL: 0, rawR: 0 };
      
      try {
        result = this.processSample(ti);
      } catch(e) {
        if (e !== undefined && e !== null && typeof e !== 'object') {
          var thrownVal = Number(e) || 0;
          if (this.mode === "Floatbeat" || this.mode === "Funcbeat") {
            result = { sampleL: Math.max(-1, Math.min(1, thrownVal)), sampleR: Math.max(-1, Math.min(1, thrownVal)), rawL: thrownVal, rawR: thrownVal };
          } else {
            var byteVal = thrownVal & 255;
            result = { sampleL: (byteVal - 128) / 128, sampleR: (byteVal - 128) / 128, rawL: byteVal, rawR: byteVal };
          }
        } else if (e && Array.isArray(e)) {
          var tL = Number(e[0]) || 0;
          var tR = Number(e[1]) || 0;
          if (this.mode === "Floatbeat" || this.mode === "Funcbeat") {
            result = { sampleL: Math.max(-1, Math.min(1, tL)), sampleR: Math.max(-1, Math.min(1, tR)), rawL: tL, rawR: tR };
          } else {
            result = { sampleL: ((tL & 255) - 128) / 128, sampleR: ((tR & 255) - 128) / 128, rawL: tL & 255, rawR: tR & 255 };
          }
        } else if (e && e.message) {
          if (!this.errorShown) {
            this.errorShown = true;
            this.port.postMessage({error: "Runtime @t=" + ti + ": " + e.message});
          }
        }
      }
      
      channel0[i] = result.sampleL;
      channel1[i] = result.sampleR;
      
      if (i % 4 === 0) {
        let byteL = 0;
        let byteR = 0;
        
        if (this.mode === "Floatbeat" || this.mode === "Funcbeat" || this.mode === "SoftBeat" || this.mode === "Wavebeat") {
          byteL = Math.floor((result.rawL + 1) * 127.5);
          byteR = Math.floor((result.rawR + 1) * 127.5);
        } else {
          byteL = result.rawL & 255;
          byteR = result.rawR & 255;
        }
        drawData.push({t: ti, l: byteL, r: byteR, s: this.isStereo, sl: result.sampleL, sr: result.sampleR});
      }
      
      this.t += ratio;
    }

    this.port.postMessage({t: Math.floor(this.t), drawData: drawData});
    return true;
  }
}

registerProcessor("bytebeat-processor", BytebeatProcessor);
`;

// ==================== PACK / UNPACK (eval unescape escape replace) ====================
// Compatible con chasyxx: eval(unescape(escape`...`.replace(/u(..)/g,"$1%")))
// Compatible con nuestro formato: eval(unescape(escape("...").replace(/%u(..)(..)/g,"%$1%$2")))

function minifyCodeHelper(code: string): string {
  let minified = '';
  let idx = 0;
  let inStr = false;
  let strCh = '';
  const ln = code.length;
  while (idx < ln) {
    const ch = code[idx];
    if ((ch === '"' || ch === "'" || ch === '`') && (idx === 0 || code[idx-1] !== '\\')) {
      if (!inStr) { inStr = true; strCh = ch; } else if (ch === strCh) { inStr = false; }
      minified += ch; idx++; continue;
    }
    if (inStr) { minified += ch; idx++; continue; }
    if (ch === '/' && code[idx+1] === '/') { while (idx < ln && code[idx] !== '\n') idx++; continue; }
    if (ch === '/' && code[idx+1] === '*') { idx += 2; while (idx < ln && !(code[idx] === '*' && code[idx+1] === '/')) idx++; idx += 2; continue; }
    if (/\s/.test(ch)) {
      if (minified.length > 0 && /[a-zA-Z0-9_$]/.test(minified[minified.length-1])) {
        let j = idx; while (j < ln && /\s/.test(code[j])) j++;
        if (j < ln && /[a-zA-Z0-9_$]/.test(code[j])) minified += ' ';
      }
      while (idx < ln && /\s/.test(code[idx])) idx++;
      continue;
    }
    minified += ch; idx++;
  }
  return minified;
}

function packCode(code: string): string {
  const minified = minifyCodeHelper(code);
  try {
    const padded = minified.length % 2 === 1 ? minified + ' ' : minified;
    let packed = '';
    for (let i = 0; i < padded.length; i += 2) {
      packed += String.fromCharCode((padded.charCodeAt(i) << 8) | padded.charCodeAt(i + 1));
    }
    const escaped = packed.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    // Formato compatible con chasyxx: /u(..)/g,"$1%"
    return `eval(unescape(escape("${escaped}").replace(/u(..)/g,"$1%")))`;
  } catch (_e) {
    return minified;
  }
}

function unpackCode(code: string): string {
  let trimmed = code.trim();
  if (trimmed.endsWith(';')) trimmed = trimmed.slice(0, -1).trim();
  
  // Detectar AMBOS formatos:
  // chasyxx: eval(unescape(escape`...`.replace(/u(..)/g,"$1%")))
  // nuestro: eval(unescape(escape("...").replace(/%u(..)(..)/g,"%$1%$2")))
  if (trimmed.startsWith('eval(unescape(escape')) {
    // Método 1: eval la parte interna (funciona con ambos formatos)
    try {
      const inner = trimmed.slice(5, -1);
      // eslint-disable-next-line no-eval
      const unpacked = eval(inner);
      if (typeof unpacked === 'string' && unpacked.length > 0) {
        return beautifyCode(unpacked);
      }
    } catch (_e1) { /* eval failed */ }
    
    // Método 2: extracción manual
    try {
      const escapeIdx = trimmed.indexOf('escape') + 6;
      const nc = trimmed[escapeIdx];
      let startIdx: number;
      let endDelim: string;
      if (nc === '`') { startIdx = escapeIdx + 1; endDelim = '`'; }
      else if (nc === '(') {
        const qc = trimmed[escapeIdx + 1];
        if (qc === '"' || qc === "'") { startIdx = escapeIdx + 2; endDelim = qc; }
        else { return beautifyCode(code); }
      } else { return beautifyCode(code); }
      let endIdx = -1;
      for (let i = startIdx; i < trimmed.length; i++) {
        if (trimmed[i] === '\\' && endDelim !== '`') { i++; continue; }
        if (trimmed[i] === endDelim) { endIdx = i; break; }
      }
      if (endIdx === -1) return beautifyCode(code);
      let packedStr = trimmed.substring(startIdx, endIdx);
      if (endDelim !== '`') {
        packedStr = packedStr.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\r/g, '\r');
      }
      let unpacked = '';
      for (let i = 0; i < packedStr.length; i++) {
        const cc = packedStr.charCodeAt(i);
        if (cc > 255) {
          const hi = (cc >> 8) & 0xFF; const lo = cc & 0xFF;
          if (hi > 0) unpacked += String.fromCharCode(hi);
          if (lo > 0) unpacked += String.fromCharCode(lo);
        } else { unpacked += packedStr[i]; }
      }
      if (unpacked.trim().length > 0) return beautifyCode(unpacked.trim());
    } catch (_e2) { /* manual failed */ }
  }

  // Formato viejo - ignorar este match
  const _packedMatch_UNUSED = trimmed.match(/^eval\(unescape\(escape\((["'`])([\s\S]*?)\1\)\.replace\(\/%u\([0-9a-fA-F]{2}\)\([0-9a-fA-F]{2}\)\/g,\s*["'`]%\$1%\$2["'`]\)\)\)\s*;?$/);
  
  // Old unpack code removed - handled above
  
  // Ahora hacer beautify del código
  let result = '';
  let indent = 0;
  let i = 0;
  let inString = false;
  let stringChar = '';
  const len = code.length;
  
  const addIndent = () => '  '.repeat(indent);
  const addNewline = () => {
    result += '\n' + addIndent();
  };
  
  while (i < len) {
    const char = code[i];
    const nextChar = code[i + 1] || '';
    
    // Handle strings - preserve as-is
    if ((char === '"' || char === "'" || char === '`') && (i === 0 || code[i-1] !== '\\')) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      result += char;
      i++;
      continue;
    }
    
    if (inString) {
      result += char;
      i++;
      continue;
    }
    
    // Handle single-line comments
    if (char === '/' && nextChar === '/') {
      result += char;
      i++;
      while (i < len && code[i] !== '\n') {
        result += code[i];
        i++;
      }
      if (i < len) {
        addNewline();
        i++;
      }
      continue;
    }
    
    // Handle multi-line comments
    if (char === '/' && nextChar === '*') {
      result += '/*';
      i += 2;
      while (i < len - 1 && !(code[i] === '*' && code[i + 1] === '/')) {
        result += code[i];
        i++;
      }
      if (i < len - 1) {
        result += '*/';
        i += 2;
      }
      continue;
    }
    
    // Skip extra whitespace
    if (/\s/.test(char)) {
      if (result.length > 0 && !/\s/.test(result[result.length - 1]) && !result.endsWith('\n')) {
        result += ' ';
      }
      i++;
      while (i < len && /\s/.test(code[i])) i++;
      continue;
    }
    
    // Opening braces
    if (char === '{') {
      result += ' {';
      indent++;
      addNewline();
      i++;
      continue;
    }
    
    // Closing braces
    if (char === '}') {
      indent = Math.max(0, indent - 1);
      result = result.trimEnd();
      result += '\n' + addIndent() + '}';
      if (nextChar && nextChar !== ';' && nextChar !== ',' && nextChar !== ')' && nextChar !== '\n') {
        addNewline();
      }
      i++;
      continue;
    }
    
    // Semicolons
    if (char === ';') {
      result += ';';
      if (nextChar && nextChar !== '}' && nextChar !== '\n') {
        addNewline();
      }
      i++;
      continue;
    }
    
    // Commas - add space after
    if (char === ',') {
      result += ', ';
      i++;
      while (i < len && /\s/.test(code[i])) i++;
      continue;
    }
    
    // Keywords - add space after
    const keywords = ['return', 'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'typeof', 'throw'];
    let foundKeyword = false;
    for (const kw of keywords) {
      if (code.slice(i, i + kw.length) === kw && !/[a-zA-Z0-9_$]/.test(code[i + kw.length] || '')) {
        result += kw + ' ';
        i += kw.length;
        foundKeyword = true;
        break;
      }
    }
    if (foundKeyword) continue;
    
    result += char;
    i++;
  }
  
  // Clean up
  result = result
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/{\s*\n\s*\n/g, '{\n')
    .replace(/\n\s*\n\s*}/g, '\n}')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .trim();
  
  return result;
}

function beautifyCode(code: string): string {
  const indent = '  ';
  let result = '';
  let depth = 0;
  let i = 0;
  const len = code.length;
  let lineStart = true;
  
  const addIndent = () => indent.repeat(depth);
  const addNewLine = () => {
    result += '\n' + addIndent();
    lineStart = true;
  };
  
  while (i < len) {
    const char = code[i];
    const nextChar = code[i + 1] || '';
    
    // Handle strings - preserve as-is
    if (char === '"' || char === "'" || char === '`') {
      if (lineStart) {
        result += addIndent();
        lineStart = false;
      }
      const quote = char;
      result += char;
      i++;
      while (i < len && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < len) {
          result += code[i] + code[i + 1];
          i += 2;
        } else {
          result += code[i];
          i++;
        }
      }
      if (i < len) result += code[i];
      i++;
      continue;
    }
    
    // Handle single-line comments
    if (char === '/' && nextChar === '/') {
      if (lineStart) {
        result += addIndent();
        lineStart = false;
      }
      while (i < len && code[i] !== '\n') {
        result += code[i];
        i++;
      }
      if (i < len) {
        addNewLine();
        i++;
      }
      continue;
    }
    
    // Handle multi-line comments
    if (char === '/' && nextChar === '*') {
      if (lineStart) {
        result += addIndent();
        lineStart = false;
      }
      result += '/*';
      i += 2;
      while (i < len - 1 && !(code[i] === '*' && code[i + 1] === '/')) {
        result += code[i];
        i++;
      }
      if (i < len - 1) {
        result += '*/';
        i += 2;
      }
      continue;
    }
    
    // Skip whitespace at line start
    if (lineStart && /\s/.test(char)) {
      i++;
      continue;
    }
    
    // Opening braces
    if (char === '{') {
      if (lineStart) {
        result += addIndent();
        lineStart = false;
      }
      result += ' {';
      depth++;
      addNewLine();
      i++;
      continue;
    }
    
    // Closing braces
    if (char === '}') {
      depth = Math.max(0, depth - 1);
      result = result.trimEnd();
      result += '\n' + addIndent() + '}';
      if (nextChar && nextChar !== ';' && nextChar !== ',' && nextChar !== ')' && nextChar !== '\n') {
        addNewLine();
      }
      i++;
      lineStart = false;
      continue;
    }
    
    // Semicolons
    if (char === ';') {
      result += ';';
      if (nextChar && nextChar !== '}' && nextChar !== '\n') {
        addNewLine();
      }
      i++;
      continue;
    }
    
    // Opening brackets/parens with content
    if (char === '[' || char === '(') {
      if (lineStart) {
        result += addIndent();
        lineStart = false;
      }
      result += char;
      i++;
      continue;
    }
    
    // Commas - add space after
    if (char === ',') {
      result += ', ';
      i++;
      // Skip following whitespace
      while (i < len && /\s/.test(code[i])) i++;
      continue;
    }
    
    // Operators - add spaces around
    if (/[+\-*/%]/.test(char) && nextChar !== '=' && code[i-1] !== '(' && !/[0-9]/.test(code[i-1]) || char === '=' && nextChar !== '=' && code[i-1] !== '!' && code[i-1] !== '<' && code[i-1] !== '>' && code[i-1] !== '=') {
      if (lineStart) {
        result += addIndent();
        lineStart = false;
      }
      // Check for unary operators
      const prevChar = result[result.length - 1] || '';
      if (/[(,=:<>!&|^~\[]/.test(prevChar) || prevChar === '' || result.endsWith('return ')) {
        result += char;
      } else {
        result += ' ' + char;
        // Add space after if not followed by = or same operator
        if (nextChar && !/[=+\-]/.test(nextChar)) {
          result += ' ';
        }
      }
      i++;
      continue;
    }
    
    // Keywords - add newlines
    const keywords = ['return', 'var', 'let', 'const', 'function', 'if', 'else', 'for', 'while'];
    let foundKeyword = false;
    for (const kw of keywords) {
      if (code.slice(i, i + kw.length) === kw && !/[a-zA-Z0-9_$]/.test(code[i + kw.length] || '')) {
        if (lineStart) {
          result += addIndent();
          lineStart = false;
        }
        result += kw;
        i += kw.length;
        // Add space after keyword
        if (code[i] && /[a-zA-Z0-9_$({]/.test(code[i])) {
          result += ' ';
        }
        foundKeyword = true;
        break;
      }
    }
    if (foundKeyword) continue;
    
    // Regular characters
    if (lineStart && !/\s/.test(char)) {
      result += addIndent();
      lineStart = false;
    }
    result += char;
    i++;
  }
  
  // Clean up
  result = result
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/{\s*\n\s*\n/g, '{\n')
    .replace(/\n\s*\n\s*}/g, '\n}')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .trim();
  
  return result;
}

// ==================== SYNTAX HIGHLIGHTER ====================
function highlightCode(code: string, theme: CodeTheme): string {
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const keywords = ['return', 'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'typeof', 'instanceof', 'true', 'false', 'null', 'undefined', 'throw', 'try', 'catch', 'finally', 'delete', 'void', 'in', 'of', 'class', 'extends', 'super', 'yield', 'async', 'await'];
  const mathFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'sinh', 'cosh', 'tanh', 'sqrt', 'cbrt', 'pow', 'exp', 'log', 'log2', 'log10', 'abs', 'floor', 'ceil', 'round', 'trunc', 'sign', 'min', 'max', 'random', 'PI', 'E', 'int', 'clamp'];

  let result = '';
  let i = 0;
  const len = code.length;

  while (i < len) {
    if (code.slice(i, i + 2) === '//') {
      let end = code.indexOf('\n', i);
      if (end === -1) end = len;
      result += `<span style="color:${theme.comment}">${escapeHtml(code.slice(i, end))}</span>`;
      i = end;
      continue;
    }

    if (code.slice(i, i + 2) === '/*') {
      let end = code.indexOf('*/', i + 2);
      if (end === -1) end = len;
      else end += 2;
      result += `<span style="color:${theme.comment}">${escapeHtml(code.slice(i, end))}</span>`;
      i = end;
      continue;
    }

    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let end = i + 1;
      while (end < len && code[end] !== quote) {
        if (code[end] === '\\') end++;
        end++;
      }
      if (end < len) end++;
      result += `<span style="color:${theme.string}">${escapeHtml(code.slice(i, end))}</span>`;
      i = end;
      continue;
    }

    if (/[0-9]/.test(code[i]) || (code[i] === '.' && /[0-9]/.test(code[i + 1] || ''))) {
      let end = i;
      if (code.slice(i, i + 2).toLowerCase() === '0x') {
        end = i + 2;
        while (end < len && /[0-9a-fA-F]/.test(code[end])) end++;
      } else {
        while (end < len && /[0-9.eE+-]/.test(code[end])) {
          if ((code[end] === 'e' || code[end] === 'E') && (code[end + 1] === '+' || code[end + 1] === '-')) {
            end += 2;
          } else {
            end++;
          }
        }
      }
      result += `<span style="color:${theme.number}">${escapeHtml(code.slice(i, end))}</span>`;
      i = end;
      continue;
    }

    if (/[a-zA-Z_$]/.test(code[i])) {
      let end = i;
      while (end < len && /[a-zA-Z0-9_$]/.test(code[end])) end++;
      const word = code.slice(i, end);
      
      if (keywords.includes(word)) {
        result += `<span style="color:${theme.keyword}">${escapeHtml(word)}</span>`;
      } else if (mathFunctions.includes(word)) {
        result += `<span style="color:${theme.function}">${escapeHtml(word)}</span>`;
      } else if (code[end] === '(') {
        result += `<span style="color:${theme.function}">${escapeHtml(word)}</span>`;
      } else {
        result += `<span style="color:${theme.variable}">${escapeHtml(word)}</span>`;
      }
      i = end;
      continue;
    }

    if (/[+\-*/%&|^~<>=!?:]/.test(code[i])) {
      let end = i;
      while (end < len && /[+\-*/%&|^~<>=!?:]/.test(code[end])) end++;
      result += `<span style="color:${theme.operator}">${escapeHtml(code.slice(i, end))}</span>`;
      i = end;
      continue;
    }

    if (/[(){}[\]]/.test(code[i])) {
      result += `<span style="color:${theme.bracket}">${escapeHtml(code[i])}</span>`;
      i++;
      continue;
    }

    result += escapeHtml(code[i]);
    i++;
  }

  return result;
}

// ==================== STORAGE HELPERS ====================
const STORAGE_KEYS = {
  PROJECTS: 'bytebeat_projects',
  SETTINGS: 'bytebeat_settings',
  LAST_CODE: 'bytebeat_last_code',
  LAST_MODE: 'bytebeat_last_mode',
  LAST_RATE: 'bytebeat_last_rate'
};

function loadProjects(): SavedProject[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: SavedProject[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects:', e);
  }
}

function loadSettings(): Partial<AppSettings> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

function loadLastSession(): { code: string; mode: string; rate: number } | null {
  try {
    const code = localStorage.getItem(STORAGE_KEYS.LAST_CODE);
    const mode = localStorage.getItem(STORAGE_KEYS.LAST_MODE);
    const rate = localStorage.getItem(STORAGE_KEYS.LAST_RATE);
    if (code) {
      return {
        code,
        mode: mode || 'Floatbeat',
        rate: rate ? parseInt(rate) : 32000
      };
    }
    return null;
  } catch {
    return null;
  }
}

function saveLastSession(code: string, mode: string, rate: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_CODE, code);
    localStorage.setItem(STORAGE_KEYS.LAST_MODE, mode);
    localStorage.setItem(STORAGE_KEYS.LAST_RATE, rate.toString());
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

// ==================== MAIN COMPONENT ====================
export default function App() {
  // Load saved settings
  const savedSettings = loadSettings();
  const lastSession = loadLastSession();

  // State
  const [theme, setTheme] = useState<string>(savedSettings.uiTheme || 'matrix');
  const [codeTheme, setCodeTheme] = useState<string>(savedSettings.codeTheme || 'atomDark');
  const [isPlaying, setIsPlaying] = useState(false);
  const [code, setCode] = useState(lastSession?.code || presets.chaos.code);
  const [mode, setMode] = useState(lastSession?.mode || 'Floatbeat');
  const [sampleRate, setSampleRate] = useState(lastSession?.rate || 32000);
  const [volume, setVolume] = useState(40);
  const [currentT, setCurrentT] = useState(0);
  const [error, setError] = useState<string | null>(null);
const [thrownMessage, setThrownMessage] = useState<string | null>(null);
const [isStereoMode, setIsStereoMode] = useState(false);
  const [drawMode, setDrawMode] = useState(savedSettings.vizMode || 'Waveform');
  const [scale, setScale] = useState(savedSettings.scale || 4);
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(savedSettings.syntaxHighlight !== false);
  const [showLineNumbers, setShowLineNumbers] = useState(savedSettings.showLines !== false);
  const [phosphorDecay, setPhosphorDecay] = useState(savedSettings.decay !== undefined ? savedSettings.decay : 1);
  const [waveThickness, setWaveThickness] = useState(savedSettings.thickness !== undefined ? savedSettings.thickness : 1);
  const [glowIntensity, setGlowIntensity] = useState(savedSettings.glow !== undefined ? savedSettings.glow : 0);
  const [showGrid, setShowGrid] = useState(savedSettings.showGrid !== undefined ? savedSettings.showGrid : false);
  const [fontFamily, setFontFamily] = useState(savedSettings.fontFamily || "'Courier New', Courier, monospace");
  const [fontSize, setFontSize] = useState(savedSettings.fontSize || 13);
  const [showScanlines, setShowScanlines] = useState(savedSettings.scanlines !== undefined ? savedSettings.scanlines : false);
  const [scanlineIntensity, setScanlineIntensity] = useState(savedSettings.scanlineIntensity || 0.06);
  const [gridSize, setGridSize] = useState(savedSettings.gridSize || 32);
  const [useCustomColors, setUseCustomColors] = useState(savedSettings.useCustomColors || false);
  const [customMonoColor, setCustomMonoColor] = useState(savedSettings.waveColorMonoCustom || '#ffffff');
  const [customLColor, setCustomLColor] = useState(savedSettings.waveColorLCustom || '#00ff00');
  const [customRColor, setCustomRColor] = useState(savedSettings.waveColorRCustom || '#aa00ff');
  const [editorLayout, setEditorLayout] = useState(savedSettings.editorLayout || 'horizontal');
  const [autoCompile, setAutoCompile] = useState(savedSettings.autoCompile !== false);
  const [autoCompileDelay, setAutoCompileDelay] = useState(savedSettings.autoCompileDelay || 300);
  const [smoothing, setSmoothing] = useState(savedSettings.smoothing !== false);
  const [bgOpacity, setBgOpacity] = useState(savedSettings.bgOpacity || 1.0);

  // Modal states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'editor' | 'visual' | 'colors' | 'advanced'>('editor');
  const [projects, setProjects] = useState<SavedProject[]>(loadProjects());
  const [newProjectName, setNewProjectName] = useState('');
  const [presetSearch, setPresetSearch] = useState('');

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawBufferRef = useRef<DrawPoint[]>([]);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const codeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number>(0);
  const presetsMenuRef = useRef<HTMLDivElement>(null);

  const currentTheme = themes[theme];
  const currentCodeTheme = codeThemes[codeTheme];

  // Resolve active wave colors (custom or theme)
  const activeWaveColorMono = useCustomColors ? customMonoColor : currentTheme.waveColorMono;
  const activeWaveColorL = useCustomColors ? customLColor : currentTheme.waveColorL;
  const activeWaveColorR = useCustomColors ? customRColor : currentTheme.waveColorR;

  // Save settings when they change
  useEffect(() => {
    const settings: AppSettings = {
      uiTheme: theme,
      codeTheme,
      syntaxHighlight: syntaxHighlighting,
      showLines: showLineNumbers,
      fontFamily,
      fontSize,
      showGrid,
      vizMode: drawMode,
      scale,
      decay: phosphorDecay,
      thickness: waveThickness,
      glow: glowIntensity,
      scanlines: showScanlines,
      scanlineIntensity,
      gridSize,
      waveColorMonoCustom: customMonoColor,
      waveColorLCustom: customLColor,
      waveColorRCustom: customRColor,
      useCustomColors,
      editorLayout,
      cursorStyle: 'line',
      autoCompile,
      autoCompileDelay,
      smoothing,
      bgOpacity
    };
    saveSettings(settings);
  }, [theme, codeTheme, syntaxHighlighting, showLineNumbers, fontFamily, fontSize, showGrid, drawMode, scale, phosphorDecay, waveThickness, glowIntensity, showScanlines, scanlineIntensity, gridSize, customMonoColor, customLColor, customRColor, useCustomColors, editorLayout, autoCompile, autoCompileDelay, smoothing, bgOpacity]);

  // Save last session when code/mode/rate changes
  useEffect(() => {
    saveLastSession(code, mode, sampleRate);
  }, [code, mode, sampleRate]);

  // Audio initialization
  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return true;

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const blob = new Blob([processorCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);

      await audioContext.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      const workletNode = new AudioWorkletNode(audioContext, 'bytebeat-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2]
      });
      workletNodeRef.current = workletNode;

      const gainNode = audioContext.createGain();
      gainNodeRef.current = gainNode;
      workletNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      workletNode.port.onmessage = (e) => {
        const data = e.data;
        if (data.t !== undefined) {
          setCurrentT(data.t);
        }
        if (data.stereoMode !== undefined) {
          setIsStereoMode(data.stereoMode);
        }
        if (data.drawData) {
          for (const p of data.drawData) {
            if (p.s !== undefined) {
              setIsStereoMode(p.s);
            }
            drawBufferRef.current.push(p);
          }
          if (drawBufferRef.current.length > 8192) {
            drawBufferRef.current.splice(0, drawBufferRef.current.length - 8192);
          }
        }
        if (data.error !== undefined) {
        if (data.error) {
          setError(data.error);
        } else {
          setError(null);
        }
      }
      if (data.thrownMessage !== undefined) {
        setThrownMessage(data.thrownMessage);
      }
      if (data.clearThrownMessage) {
        setThrownMessage(null);
      }
      };

      const val = volume / 100;
      gainNode.gain.value = val * val;
      
      workletNode.port.postMessage({ sampleRate: sampleRate, mode: mode });
      workletNode.port.postMessage({ code: code });

      return true;
    } catch (e: unknown) {
      console.error("Audio init failed:", e);
      setError("Failed to initialize: " + (e instanceof Error ? e.message : 'Unknown error'));
      return false;
    }
  }, [code, mode, sampleRate, volume]);

  // Send code to worklet
  const sendCode = useCallback((codeToSend: string) => {
    if (!workletNodeRef.current) return;
    setThrownMessage(null);
    setError(null);
    workletNodeRef.current.port.postMessage({ code: codeToSend });
  }, []);

  // Update volume
  const updateVolume = useCallback((vol: number) => {
    if (!gainNodeRef.current) return;
    const val = vol / 100;
    gainNodeRef.current.gain.value = val * val;
  }, []);

  // Toggle play/stop
  const togglePlay = useCallback(async () => {
    if (!audioContextRef.current) {
      const ok = await initAudio();
      if (!ok) return;
    }

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    workletNodeRef.current?.port.postMessage({ isPlaying: newPlaying });
  }, [isPlaying, initAudio]);

  // Reset time
  const resetTime = useCallback(() => {
    if (!workletNodeRef.current) return;
    workletNodeRef.current.port.postMessage({ resetTime: true });
    setCurrentT(0);
    setThrownMessage(null);
    drawBufferRef.current.length = 0;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // Handle code change
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (autoCompile) {
      if (codeTimeoutRef.current) clearTimeout(codeTimeoutRef.current);
      codeTimeoutRef.current = setTimeout(() => {
        sendCode(newCode);
      }, autoCompileDelay);
    }
  }, [sendCode, autoCompile, autoCompileDelay]);

  // Manual compile
  const manualCompile = useCallback(() => {
    sendCode(code);
  }, [sendCode, code]);

  // Handle preset change
  const handlePresetChange = useCallback((presetKey: string) => {
    const preset = presets[presetKey];
    if (preset) {
      // Use preset code as-is (no automatic minibake)
      const codeToUse = preset.code;

      setCode(codeToUse);
      setMode(preset.mode);
      setSampleRate(preset.rate);

      setTimeout(() => {
        if (workletNodeRef.current) {
          workletNodeRef.current.port.postMessage({
            sampleRate: preset.rate,
            mode: preset.mode
          });
          workletNodeRef.current.port.postMessage({ code: codeToUse });
          workletNodeRef.current.port.postMessage({ resetTime: true });
        }
        setCurrentT(0);
        drawBufferRef.current.length = 0;
      }, 50);
    }
  }, []);

  // Handle mode change
  const handleModeChange = useCallback((newMode: string) => {
    setMode(newMode);
    if (workletNodeRef.current) {
      workletNodeRef.current.port.postMessage({ mode: newMode });
      workletNodeRef.current.port.postMessage({ code: code });
    }
  }, [code]);

  // Handle sample rate change - accepts any positive number
  const handleSampleRateChange = useCallback((newRate: number) => {
    if (newRate > 0 && Number.isFinite(newRate)) {
      setSampleRate(newRate);
      if (workletNodeRef.current) {
        workletNodeRef.current.port.postMessage({ sampleRate: newRate });
      }
    }
  }, []);

  // Handle volume change
  const handleVolumeChange = useCallback((newVol: number) => {
    setVolume(newVol);
    updateVolume(newVol);
  }, [updateVolume]);

  // Sync scroll for syntax highlighting and line numbers
  const syncScroll = useCallback(() => {
    if (editorRef.current) {
      if (highlightRef.current) {
        highlightRef.current.scrollTop = editorRef.current.scrollTop;
        highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
      }
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
      }
    }
  }, []);

  // Save project
  const saveProject = useCallback(() => {
    if (!newProjectName.trim()) return;

    const newProject: SavedProject = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      code,
      mode,
      sampleRate,
      timestamp: Date.now()
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setNewProjectName('');
  }, [newProjectName, code, mode, sampleRate, projects]);

  // Load project
  const loadProject = useCallback((project: SavedProject) => {
    setCode(project.code);
    setMode(project.mode);
    setSampleRate(project.sampleRate);

    setTimeout(() => {
      if (workletNodeRef.current) {
        workletNodeRef.current.port.postMessage({
          sampleRate: project.sampleRate,
          mode: project.mode
        });
        workletNodeRef.current.port.postMessage({ code: project.code });
        workletNodeRef.current.port.postMessage({ resetTime: true });
      }
      setCurrentT(0);
      drawBufferRef.current.length = 0;
    }, 50);

    setShowProjectsModal(false);
  }, []);

  // Delete project
  const deleteProject = useCallback((id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  }, [projects]);

  // Render loop with CRT phosphor beam simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Helper: Draw CRT beam with phosphor effect
    const drawCRTBeam = (
      points: {x: number, y: number}[], 
      color: string, 
      alpha: number = 1.0,
      drawHead: boolean = true
    ) => {
      if (points.length < 2) return;
      
      const passes = glowIntensity > 0 ? 4 : 1;
      
      for (let pass = 0; pass < passes; pass++) {
        const spread = pass * (glowIntensity * 0.8);
        const passAlpha = pass === 0 ? alpha : alpha * (0.4 / (pass + 1));
        
        ctx.lineWidth = waveThickness + spread;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = passAlpha;
        
        let r = 0, g = 0, b = 0;
        if (color.startsWith('#')) {
          r = parseInt(color.slice(1,3), 16);
          g = parseInt(color.slice(3,5), 16);
          b = parseInt(color.slice(5,7), 16);
        }
        
        if (pass === 0 && glowIntensity > 3) {
          const blendR = Math.floor(r + (255 - r) * 0.3);
          const blendG = Math.floor(g + (255 - g) * 0.3);
          const blendB = Math.floor(b + (255 - b) * 0.3);
          ctx.strokeStyle = `rgb(${blendR},${blendG},${blendB})`;
        } else {
          ctx.strokeStyle = `rgb(${r},${g},${b})`;
        }
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        if (smoothing) {
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2;
            const cpY = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
          }
        } else {
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
        }
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }
      
      if (drawHead && points.length > 0) {
        const head = points[points.length - 1];
        
        if (Number.isFinite(head.x) && Number.isFinite(head.y)) {
          const headSize = Math.max(0.1, waveThickness * 2);
          const headRadius = headSize * 2;
          
          if (Number.isFinite(headRadius) && headRadius > 0) {
            try {
              const gradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, headRadius);
              gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
              gradient.addColorStop(0.3, color);
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
              
              ctx.globalAlpha = alpha;
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(head.x, head.y, headRadius, 0, Math.PI * 2);
              ctx.fill();
            } catch (_e) {
              // Silently ignore gradient errors
            }
          }
        }
      }
      
      ctx.globalAlpha = 1.0;
    };

    const drawPhosphorDot = (x: number, y: number, color: string, size: number = 3, alpha: number = 1.0) => {
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(size) || !Number.isFinite(alpha)) {
        return;
      }
      
      const canvasW = canvas.width || 100;
      const canvasH = canvas.height || 100;
      const safeX = Math.max(0, Math.min(canvasW, x));
      const safeY = Math.max(0, Math.min(canvasH, y));
      const safeSize = Math.max(0.1, Math.min(50, size));
      const safeAlpha = Math.max(0, Math.min(1, alpha));
      
      let r = 0, g = 0, b = 0;
      if (color && color.startsWith('#') && color.length >= 7) {
        r = parseInt(color.slice(1,3), 16) || 0;
        g = parseInt(color.slice(3,5), 16) || 0;
        b = parseInt(color.slice(5,7), 16) || 0;
      }
      
      const radius = safeSize * (1 + glowIntensity * 0.3);
      if (radius <= 0 || !Number.isFinite(radius)) return;
      
      try {
        const gradient = ctx.createRadialGradient(safeX, safeY, 0, safeX, safeY, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${safeAlpha})`);
        gradient.addColorStop(0.3, `rgba(${r},${g},${b}, ${safeAlpha})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(safeX, safeY, radius, 0, Math.PI * 2);
        ctx.fill();
      } catch (_e) {
        // Silently ignore gradient errors
      }
    };

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const w = canvas.width;
      const h = canvas.height;
      const buffer = drawBufferRef.current;

      if (drawMode === 'Waveform') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length < 2) return;

        const step = w / buffer.length;
        
        const pointsL: {x: number, y: number}[] = [];
        const pointsR: {x: number, y: number}[] = [];
        
        for (let i = 0; i < buffer.length; i++) {
          const x = i * step;
          pointsL.push({ x, y: h - (buffer[i].l / 255) * h });
          pointsR.push({ x, y: h - (buffer[i].r / 255) * h });
        }

        if (isStereoMode) {
          drawCRTBeam(pointsL, activeWaveColorL, 0.5, true);
          drawCRTBeam(pointsR, activeWaveColorR, 1.0, true);

          // Detect intersections (Mono points)
          for (let i = 0; i < pointsL.length - 1; i++) {
            const p1L = pointsL[i];
            const p2L = pointsL[i+1];
            const p1R = pointsR[i];
            const p2R = pointsR[i+1];

            const diff1 = p1L.y - p1R.y;
            const diff2 = p2L.y - p2R.y;

            // Check for crossing
            if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
              const totalDiff = Math.abs(diff1) + Math.abs(diff2);
              const t = Math.abs(diff1) / totalDiff;
              const x = p1L.x + t * (p2L.x - p1L.x);
              const y = p1L.y + t * (p2L.y - p1L.y);
              drawPhosphorDot(x, y, '#ffffff', waveThickness * 2, 1.0);
            }
            // Check for touching
            else if (Math.abs(diff1) < 0.1) {
              drawPhosphorDot(p1L.x, p1L.y, '#ffffff', waveThickness * 2, 1.0);
            }
          }
        } else {
          drawCRTBeam(pointsL, activeWaveColorMono, 1.0, true);
        }
        
        buffer.length = 0;

      } else if (drawMode === 'Bars') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay * 0.5})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length === 0) return;

        const numBars = 64;
        const barWidth = w / numBars;
        const barsL = new Array(numBars).fill(0);
        const barsR = new Array(numBars).fill(0);

        for (let i = 0; i < buffer.length; i++) {
          const barIdx = Math.floor((i / buffer.length) * numBars);
          barsL[barIdx] = Math.max(barsL[barIdx], buffer[i].l);
          barsR[barIdx] = Math.max(barsR[barIdx], buffer[i].r);
        }

        for (let i = 0; i < numBars; i++) {
          const x = i * barWidth;
          
          if (isStereoMode) {
            const barHL = Math.max(0.1, (barsL[i] / 255) * h);
            try {
              const gradL = ctx.createLinearGradient(x, h, x, h - barHL);
              gradL.addColorStop(0, activeWaveColorL);
              gradL.addColorStop(1, '#ffffff');
              
              ctx.globalAlpha = 0.5;
              ctx.shadowColor = activeWaveColorL;
              ctx.shadowBlur = glowIntensity;
              ctx.fillStyle = gradL;
              ctx.fillRect(x + 1, h - barHL, barWidth - 2, barHL);
            } catch (_e) { /* ignore */ }
            
            const barHR = Math.max(0.1, (barsR[i] / 255) * h);
            try {
              const gradR = ctx.createLinearGradient(x, h, x, h - barHR);
              gradR.addColorStop(0, activeWaveColorR);
              gradR.addColorStop(1, '#ffffff');
              
              ctx.globalAlpha = 1.0;
              ctx.shadowColor = activeWaveColorR;
              ctx.fillStyle = gradR;
              ctx.fillRect(x + 2, h - barHR, barWidth - 4, barHR);
            } catch (_e) { /* ignore */ }

            // Intersection (Mono effect) for Bars
            if (Math.abs(barsL[i] - barsR[i]) < 10) {
              const barH = Math.max(0.1, (barsL[i] / 255) * h);
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = glowIntensity * 1.5;
              ctx.fillRect(x + 1, h - barH, barWidth - 2, 2);
              ctx.shadowBlur = 0;
            }
          } else {
            const barH = Math.max(0.1, (barsL[i] / 255) * h);
            try {
              const grad = ctx.createLinearGradient(x, h, x, h - barH);
              grad.addColorStop(0, activeWaveColorMono);
              grad.addColorStop(1, '#ffffff');
              
              ctx.shadowColor = activeWaveColorMono;
              ctx.shadowBlur = glowIntensity;
              ctx.fillStyle = grad;
              ctx.fillRect(x + 1, h - barH, barWidth - 2, barH);
            } catch (_e) { /* ignore */ }
          }
        }
        
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        buffer.length = 0;

      } else if (drawMode === 'Goniometer') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay * 0.15})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length === 0) return;

        const centerX = w / 2;
        const centerY = h / 2;
        const maxRadius = Math.min(w, h) / 2 - 20;

        ctx.strokeStyle = `${currentTheme.accent}18`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, h);
        ctx.moveTo(0, centerY);
        ctx.lineTo(w, centerY);
        ctx.moveTo(0, 0);
        ctx.lineTo(w, h);
        ctx.moveTo(w, 0);
        ctx.lineTo(0, h);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = activeWaveColorL;
        ctx.font = 'bold 11px monospace';
        ctx.fillText('L', 8, centerY - 5);
        ctx.fillStyle = activeWaveColorR;
        ctx.fillText('R', w - 15, centerY - 5);
        ctx.globalAlpha = 1.0;

        const points: {x: number, y: number}[] = [];
        for (let i = 0; i < buffer.length; i++) {
          const p = buffer[i];
          const sampleL = (p.l / 255) * 2 - 1;
          const sampleR = (p.r / 255) * 2 - 1;
          const x = centerX + (sampleR - sampleL) * maxRadius * 0.707;
          const y = centerY - (sampleR + sampleL) * maxRadius * 0.707;
          points.push({ x, y });
        }

        if (points.length > 1) {
          const gradient = ctx.createLinearGradient(0, 0, w, h);
          gradient.addColorStop(0, activeWaveColorL);
          gradient.addColorStop(0.5, activeWaveColorMono);
          gradient.addColorStop(1, activeWaveColorR);
          
          for (let pass = 0; pass < 4; pass++) {
            const spread = pass * glowIntensity * 0.6;
            const alpha = pass === 0 ? 1.0 : 0.3 / pass;
            
            ctx.lineWidth = waveThickness + spread;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = gradient;
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              const prev = points[i - 1];
              const curr = points[i];
              const cpX = (prev.x + curr.x) / 2;
              const cpY = (prev.y + curr.y) / 2;
              ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
            }
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.stroke();
          }
        }
        
        if (points.length > 0) {
          const head = points[points.length - 1];
          
          if (Number.isFinite(head.x) && Number.isFinite(head.y)) {
            const headRadius = Math.max(0.1, waveThickness * 4);
            
            if (Number.isFinite(headRadius) && headRadius > 0) {
              try {
                const headGradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, headRadius);
                headGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                headGradient.addColorStop(0.4, currentTheme.accent);
                headGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = headGradient;
                ctx.beginPath();
                ctx.arc(head.x, head.y, headRadius, 0, Math.PI * 2);
                ctx.fill();
              } catch (_e) {
                // Silently ignore gradient errors
              }
            }
          }
        }
        
        ctx.globalAlpha = 1.0;
        buffer.length = 0;

      } else if (drawMode === 'Spectrum') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay * 0.8})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length === 0) return;

        const numBins = 48;
        const binWidth = w / numBins;
        const binsL = new Array(numBins).fill(0);
        const binsR = new Array(numBins).fill(0);

        for (let i = 0; i < buffer.length; i++) {
          const bin = Math.floor((i / buffer.length) * numBins);
          binsL[bin] = Math.max(binsL[bin], buffer[i].l);
          binsR[bin] = Math.max(binsR[bin], buffer[i].r);
        }

        for (let i = 0; i < numBins; i++) {
          const x = i * binWidth + binWidth / 2;
          const heightL = Math.max(0.1, (binsL[i] / 255) * h * 0.9);
          const heightR = Math.max(0.1, (binsR[i] / 255) * h * 0.9);

          if (isStereoMode) {
            try {
              const gradL = ctx.createLinearGradient(0, h, 0, h - heightL);
              gradL.addColorStop(0, activeWaveColorL);
              gradL.addColorStop(1, '#ffffff');
              
              ctx.globalAlpha = 0.5;
              ctx.shadowColor = activeWaveColorL;
              ctx.shadowBlur = glowIntensity;
              ctx.fillStyle = gradL;
              ctx.beginPath();
              ctx.roundRect(x - binWidth * 0.35, h - heightL, binWidth * 0.7, heightL, 2);
              ctx.fill();
            } catch (_e) { /* ignore */ }
            
            drawPhosphorDot(x, h - heightL, activeWaveColorL, 3, 0.5);

            try {
              const gradR = ctx.createLinearGradient(0, h, 0, h - heightR);
              gradR.addColorStop(0, activeWaveColorR);
              gradR.addColorStop(1, '#ffffff');
              
              ctx.globalAlpha = 1.0;
              ctx.shadowColor = activeWaveColorR;
              ctx.fillStyle = gradR;
              ctx.beginPath();
              ctx.roundRect(x - binWidth * 0.25, h - heightR, binWidth * 0.5, heightR, 2);
              ctx.fill();
            } catch (_e) { /* ignore */ }
            
            drawPhosphorDot(x, h - heightR, activeWaveColorR, 3, 1.0);

            // Intersection (Mono effect) for Spectrum
            if (Math.abs(binsL[i] - binsR[i]) < 10) {
              drawPhosphorDot(x, h - heightL, '#ffffff', 4, 1.0);
            }
          } else {
            try {
              const grad = ctx.createLinearGradient(0, h, 0, h - heightL);
              grad.addColorStop(0, activeWaveColorMono);
              grad.addColorStop(1, '#ffffff');
              
              ctx.shadowColor = activeWaveColorMono;
              ctx.shadowBlur = glowIntensity;
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.roundRect(x - binWidth * 0.35, h - heightL, binWidth * 0.7, heightL, 2);
              ctx.fill();
            } catch (_e) { /* ignore */ }
            
            drawPhosphorDot(x, h - heightL, activeWaveColorMono, 3, 1.0);
          }
        }
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        buffer.length = 0;

      } else if (drawMode === 'Circular') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay * 0.5})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length === 0) return;

        const centerX = w / 2;
        const centerY = h / 2;
        const baseRadius = Math.min(w, h) / 4;
        const maxRadius = Math.min(w, h) / 2 - 20;

        const pointsL: {x: number, y: number}[] = [];
        const pointsR: {x: number, y: number}[] = [];
        
        for (let i = 0; i < buffer.length; i++) {
          const angle = (i / buffer.length) * Math.PI * 2 - Math.PI / 2;
          const valL = buffer[i].l / 255;
          const valR = buffer[i].r / 255;
          const radiusL = baseRadius + valL * (maxRadius - baseRadius);
          const radiusR = baseRadius + valR * (maxRadius - baseRadius);
          
          pointsL.push({
            x: centerX + Math.cos(angle) * radiusL,
            y: centerY + Math.sin(angle) * radiusL
          });
          pointsR.push({
            x: centerX + Math.cos(angle) * radiusR,
            y: centerY + Math.sin(angle) * radiusR
          });
        }
        
        if (pointsL.length > 0) {
          pointsL.push(pointsL[0]);
          pointsR.push(pointsR[0]);
        }

        if (isStereoMode) {
          drawCRTBeam(pointsL, activeWaveColorL, 0.5, false);
          drawCRTBeam(pointsR, activeWaveColorR, 1.0, false);

          // Detect intersections (Circular)
          for (let i = 0; i < pointsL.length - 1; i++) {
            // Check raw values from buffer to avoid complex xy intersection logic if possible
            // But buffer index maps to points index.
            const idx = i >= buffer.length ? 0 : i;
            const idxNext = (i + 1) >= buffer.length ? 0 : i + 1;
            
            const valL1 = buffer[idx].l;
            const valR1 = buffer[idx].r;
            const valL2 = buffer[idxNext].l;
            const valR2 = buffer[idxNext].r;
            
            const diff1 = valL1 - valR1;
            const diff2 = valL2 - valR2;
            
            if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
              const p1L = pointsL[i];
              const p2L = pointsL[i+1];
              
              const t = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
              const x = p1L.x + t * (p2L.x - p1L.x);
              const y = p1L.y + t * (p2L.y - p1L.y);
              
              drawPhosphorDot(x, y, '#ffffff', waveThickness * 2, 1.0);
            } else if (Math.abs(diff1) < 2) {
               drawPhosphorDot(pointsL[i].x, pointsL[i].y, '#ffffff', waveThickness * 2, 1.0);
            }
          }
        } else {
          drawCRTBeam(pointsL, activeWaveColorMono, 1.0, false);
        }
        
        drawPhosphorDot(centerX, centerY, currentTheme.accent, 3, 0.5);
        
        buffer.length = 0;

      } else if (drawMode === 'Waterfall') {
        const imageData = ctx.getImageData(0, 2, w, h - 2);
        ctx.putImageData(imageData, 0, 0);

        if (buffer.length === 0) return;

        for (let i = 0; i < w; i++) {
          const bufIdx = Math.floor((i / w) * buffer.length);
          if (bufIdx >= buffer.length) continue;

          const p = buffer[bufIdx];
          const valL = p.l / 255;
          const valR = p.r / 255;
          
          let r, g, b;
          
          if (isStereoMode) {
            const stereoDiff = (valR - valL + 1) / 2;
            const intensity = (valL + valR) / 2;
            
            if (stereoDiff < 0.4) {
              r = Math.floor(intensity * 100);
              g = Math.floor(intensity * 255);
              b = Math.floor(intensity * 255 * (1 - stereoDiff * 2));
            } else if (stereoDiff > 0.6) {
              r = Math.floor(intensity * 255);
              g = Math.floor(intensity * 100 * (1 - (stereoDiff - 0.6) * 2.5));
              b = Math.floor(intensity * 255 * ((stereoDiff - 0.6) * 2.5));
            } else {
              r = Math.floor(intensity * 255 * Math.abs(stereoDiff - 0.5) * 5);
              g = Math.floor(intensity * 255);
              b = Math.floor(intensity * 50);
            }
          } else {
            const val = valL;
            if (val < 0.2) {
              r = 0; g = 0; b = Math.floor(val * 5 * 180);
            } else if (val < 0.4) {
              r = 0; g = Math.floor((val - 0.2) * 5 * 255); b = 180;
            } else if (val < 0.6) {
              r = 0; g = 255; b = 180 - Math.floor((val - 0.4) * 5 * 180);
            } else if (val < 0.8) {
              r = Math.floor((val - 0.6) * 5 * 255); g = 255; b = 0;
            } else {
              r = 255; g = 255; b = Math.floor((val - 0.8) * 5 * 255);
            }
          }

          ctx.fillStyle = `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)})`;
          ctx.fillRect(i, h - 2, 1, 2);
        }
        
        buffer.length = 0;

      } else if (drawMode === 'VU Meter') {
        ctx.fillStyle = currentTheme.bg;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length === 0) return;

        let sumL = 0, sumR = 0;
        let peakL = 0, peakR = 0;
        for (const p of buffer) {
          const valL = (p.l / 255) * 2 - 1;
          const valR = (p.r / 255) * 2 - 1;
          sumL += valL * valL;
          sumR += valR * valR;
          peakL = Math.max(peakL, Math.abs(valL));
          peakR = Math.max(peakR, Math.abs(valR));
        }
        const rmsL = Math.sqrt(sumL / buffer.length);
        const rmsR = Math.sqrt(sumR / buffer.length);

        const meterWidth = w * 0.85;
        const meterHeight = 35;
        const startX = w * 0.1;
        const segments = 40;
        const segWidth = (meterWidth / segments) - 1;
        const segGap = 1;

        const drawMeter = (yPos: number, level: number, peak: number, color: string, label: string) => {
          ctx.fillStyle = currentTheme.bgTertiary;
          ctx.beginPath();
          ctx.roundRect(startX - 5, yPos - 3, meterWidth + 10, meterHeight + 6, 4);
          ctx.fill();
          
          const litSegments = Math.floor(Math.min(1, level * 2.5) * segments);
          const peakSegment = Math.floor(Math.min(1, peak) * segments);

          for (let i = 0; i < segments; i++) {
            const x = startX + i * (meterWidth / segments);
            const isLit = i < litSegments;
            const isPeak = i === peakSegment || i === peakSegment - 1;
            
            let segColor: string;
            let glowColor: string;
            if (i < segments * 0.6) {
              segColor = isLit ? currentTheme.accent : `${currentTheme.accent}20`;
              glowColor = currentTheme.accent;
            } else if (i < segments * 0.8) {
              segColor = isLit ? '#ffcc00' : '#332200';
              glowColor = '#ffcc00';
            } else {
              segColor = isLit ? '#ff3333' : '#330000';
              glowColor = '#ff3333';
            }
            
            if (isLit) {
              ctx.shadowColor = glowColor;
              ctx.shadowBlur = glowIntensity * 0.5;
            } else {
              ctx.shadowBlur = 0;
            }
            
            ctx.fillStyle = segColor;
            ctx.beginPath();
            ctx.roundRect(x + segGap, yPos, segWidth, meterHeight, 2);
            ctx.fill();
            
            if (isPeak && peak > 0.1) {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = glowIntensity;
              ctx.beginPath();
              ctx.roundRect(x + segGap, yPos, segWidth, meterHeight, 2);
              ctx.fill();
            }
          }
          
          ctx.shadowBlur = 0;
          
          ctx.fillStyle = color;
          ctx.font = 'bold 14px monospace';
          ctx.fillText(label, startX - 25, yPos + meterHeight / 2 + 5);
        };

        if (isStereoMode) {
          drawMeter(h * 0.25, rmsL, peakL, activeWaveColorL, 'L');
          drawMeter(h * 0.55, rmsR, peakR, activeWaveColorR, 'R');
        } else {
          drawMeter(h * 0.4, rmsL, peakL, activeWaveColorMono, 'M');
        }

        buffer.length = 0;

      } else if (drawMode === 'Mirror') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length < 2) return;

        const step = w / buffer.length;
        const midY = h / 2;

        ctx.strokeStyle = `${currentTheme.accent}20`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();

        const pointsLUp: {x: number, y: number}[] = [];
        const pointsLDown: {x: number, y: number}[] = [];
        const pointsRUp: {x: number, y: number}[] = [];
        const pointsRDown: {x: number, y: number}[] = [];
        
        for (let i = 0; i < buffer.length; i++) {
          const x = i * step;
          const valL = buffer[i].l / 255;
          const valR = buffer[i].r / 255;
          
          pointsLUp.push({ x, y: midY - valL * midY * 0.9 });
          pointsLDown.push({ x, y: midY + valL * midY * 0.9 });
          pointsRUp.push({ x, y: midY - valR * midY * 0.9 });
          pointsRDown.push({ x, y: midY + valR * midY * 0.9 });
        }

        if (isStereoMode) {
          drawCRTBeam(pointsLUp, activeWaveColorL, 0.5, false);
          drawCRTBeam(pointsLDown, activeWaveColorL, 0.5, false);
          drawCRTBeam(pointsRUp, activeWaveColorR, 1.0, false);
          drawCRTBeam(pointsRDown, activeWaveColorR, 1.0, false);

          // Detect intersections (Up)
          for (let i = 0; i < pointsLUp.length - 1; i++) {
            const p1L = pointsLUp[i];
            const p2L = pointsLUp[i+1];
            const p1R = pointsRUp[i];
            const p2R = pointsRUp[i+1];
            
            const diff1 = p1L.y - p1R.y;
            const diff2 = p2L.y - p2R.y;
            
            if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
              const t = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
              const x = p1L.x + t * (p2L.x - p1L.x);
              const y = p1L.y + t * (p2L.y - p1L.y);
              drawPhosphorDot(x, y, '#ffffff', waveThickness * 2, 0.8);
            }
          }

          // Detect intersections (Down)
          for (let i = 0; i < pointsLDown.length - 1; i++) {
            const p1L = pointsLDown[i];
            const p2L = pointsLDown[i+1];
            const p1R = pointsRDown[i];
            const p2R = pointsRDown[i+1];
            
            const diff1 = p1L.y - p1R.y;
            const diff2 = p2L.y - p2R.y;
            
            if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
              const t = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
              const x = p1L.x + t * (p2L.x - p1L.x);
              const y = p1L.y + t * (p2L.y - p1L.y);
              drawPhosphorDot(x, y, '#ffffff', waveThickness * 2, 0.8);
            }
          }
        } else {
          drawCRTBeam(pointsLUp, activeWaveColorMono, 1.0, false);
          drawCRTBeam(pointsLDown, activeWaveColorMono, 1.0, false);
        }
        
        buffer.length = 0;

      } else if (drawMode === 'Lissajous') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay * 0.1})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length < 2) return;

        const centerX = w / 2;
        const centerY = h / 2;
        const maxSize = Math.min(w, h) / 2 - 20;

        ctx.strokeStyle = `${currentTheme.accent}15`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, h);
        ctx.moveTo(0, centerY);
        ctx.lineTo(w, centerY);
        ctx.stroke();
        
        ctx.strokeRect(centerX - maxSize, centerY - maxSize, maxSize * 2, maxSize * 2);

        const points: {x: number, y: number}[] = [];
        for (let i = 0; i < buffer.length; i++) {
          const valL = (buffer[i].l / 255) * 2 - 1;
          const valR = (buffer[i].r / 255) * 2 - 1;
          points.push({
            x: centerX + valL * maxSize,
            y: centerY - valR * maxSize
          });
        }
        
        const gradient = ctx.createLinearGradient(
          centerX - maxSize, centerY - maxSize, 
          centerX + maxSize, centerY + maxSize
        );
        gradient.addColorStop(0, activeWaveColorL);
        gradient.addColorStop(0.5, activeWaveColorMono);
        gradient.addColorStop(1, activeWaveColorR);

        for (let pass = 0; pass < 4; pass++) {
          const spread = pass * glowIntensity * 0.5;
          const alpha = pass === 0 ? 1.0 : 0.3 / pass;
          
          ctx.lineWidth = waveThickness + spread;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = gradient;
          
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2;
            const cpY = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
          }
          ctx.stroke();
        }
        
        if (points.length > 0) {
          const head = points[points.length - 1];
          drawPhosphorDot(head.x, head.y, currentTheme.accent, waveThickness * 2, 1.0);
        }
        
        ctx.globalAlpha = 1.0;
        buffer.length = 0;

      } else if (drawMode === 'Tunnel') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay * 0.3})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length === 0) return;

        const centerX = w / 2;
        const centerY = h / 2;
        const rings = 24;
        const maxRingRadius = Math.min(w, h) / 2 - 10;

        for (let ring = 0; ring < rings; ring++) {
          const bufIdx = Math.floor((ring / rings) * buffer.length);
          if (bufIdx >= buffer.length) continue;
          
          const p = buffer[bufIdx];
          const valL = p.l / 255;
          const valR = p.r / 255;
          const valMono = isStereoMode ? (valL + valR) / 2 : valL;
          
          const depthFactor = (rings - ring) / rings;
          const baseRadius = depthFactor * maxRingRadius;
          const radiusMod = valMono * 40 * depthFactor;
          const radius = baseRadius + radiusMod;
          
          const alpha = Math.pow(depthFactor, 0.5);
          const stereoOffset = isStereoMode ? ((valR - valL) * 30 * depthFactor) : 0;
          
          let ringColor = activeWaveColorMono;
          if (isStereoMode) {
            if (stereoOffset > 5) ringColor = activeWaveColorR;
            else if (stereoOffset < -5) ringColor = activeWaveColorL;
          }
          
          let r = 0, g = 0, b = 0;
          if (ringColor.startsWith('#')) {
            r = parseInt(ringColor.slice(1,3), 16);
            g = parseInt(ringColor.slice(3,5), 16);
            b = parseInt(ringColor.slice(5,7), 16);
          }
          
          for (let pass = 0; pass < 3; pass++) {
            const spread = pass * glowIntensity * 0.3;
            const passAlpha = pass === 0 ? alpha : alpha * 0.3 / pass;
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${passAlpha})`;
            ctx.lineWidth = waveThickness + spread;
            ctx.beginPath();
            ctx.arc(centerX + stereoOffset, centerY, Math.max(1, radius), 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        
        drawPhosphorDot(centerX, centerY, currentTheme.accent, 4, 0.8);
        
        buffer.length = 0;

      } else if (drawMode === 'Starfield') {
        ctx.fillStyle = `rgba(0, 0, 0, ${phosphorDecay * 0.15})`;
        ctx.fillRect(0, 0, w, h);

        if (buffer.length === 0) return;

        const centerX = w / 2;
        const centerY = h / 2;

        for (let i = 0; i < buffer.length; i += 2) {
          const p = buffer[i];
          const angle = (p.t / scale) * 0.01 + i * 0.05;
          const valL = p.l / 255;
          const valR = p.r / 255;
          const dist = isStereoMode ? (valL + valR) / 2 : valL;
          const speed = 1 + dist * 5;
          
          const x = centerX + Math.cos(angle) * dist * w * 0.5 * speed;
          const y = centerY + Math.sin(angle) * dist * h * 0.5 * speed;
          
          const size = 1 + dist * 4;
          const alpha = 0.4 + dist * 0.6;
          
          let starColor = activeWaveColorMono;
          if (isStereoMode) {
            const stereoShift = valR - valL;
            if (stereoShift > 0.15) starColor = activeWaveColorR;
            else if (stereoShift < -0.15) starColor = activeWaveColorL;
          }
          
          drawPhosphorDot(x, y, starColor, size, alpha);
          
          if (dist > 0.5 && Number.isFinite(x) && Number.isFinite(y)) {
            const trailLen = dist * 15;
            const trailX = x - Math.cos(angle) * trailLen;
            const trailY = y - Math.sin(angle) * trailLen;
            
            if (Number.isFinite(trailX) && Number.isFinite(trailY)) {
              let r = 0, g = 0, b = 0;
              if (starColor && starColor.startsWith('#') && starColor.length >= 7) {
                r = parseInt(starColor.slice(1,3), 16) || 0;
                g = parseInt(starColor.slice(3,5), 16) || 0;
                b = parseInt(starColor.slice(5,7), 16) || 0;
              }
              
              try {
                const gradient = ctx.createLinearGradient(trailX, trailY, x, y);
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.5})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = size * 0.5;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(trailX, trailY);
                ctx.lineTo(x, y);
                ctx.stroke();
              } catch (_e) { /* ignore */ }
            }
          }
        }
        
        drawPhosphorDot(centerX, centerY, currentTheme.accent, 5, 0.3);
        
        buffer.length = 0;

      } else {
        // Points mode
        if (buffer.length === 0) return;

        for (let i = 0; i < buffer.length; i++) {
          const p = buffer[i];
          const x = Math.floor((p.t / scale) % w);

          const clearX = (x + 20) % w;
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(clearX, 0, 12, h);

          if (isStereoMode) {
            const valL = p.l;
            const yL = Math.floor(h - (valL / 255) * h);
            
            const valR = p.r;
            const yR = Math.floor(h - (valR / 255) * h);
            
            // Check intersection/proximity for Points
            if (Math.abs(valL - valR) < 3) {
              drawPhosphorDot(x, yL, '#ffffff', waveThickness + 2, 1.0);
            } else {
              drawPhosphorDot(x, yL, activeWaveColorL, waveThickness + 1, 0.5);
              drawPhosphorDot(x, yR, activeWaveColorR, waveThickness + 1, 1.0);
            }
          } else {
            const val = p.l;
            const y = Math.floor(h - (val / 255) * h);
            drawPhosphorDot(x, y, activeWaveColorMono, waveThickness + 1, 1.0);
          }
        }
        buffer.length = 0;
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isStereoMode, drawMode, scale, currentTheme, phosphorDecay, waveThickness, glowIntensity, activeWaveColorL, activeWaveColorR, activeWaveColorMono, smoothing]);

  // Close presets menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (presetsMenuRef.current && !presetsMenuRef.current.contains(e.target as Node)) {
        setShowPresetsMenu(false);
        setPresetSearch('');
      }
    };
    if (showPresetsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPresetsMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          togglePlay();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          resetTime();
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          setShowProjectsModal(true);
        }
      }
      // ESC to close presets menu
      if (e.key === 'Escape' && showPresetsMenu) {
        setShowPresetsMenu(false);
        setPresetSearch('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, resetTime, showPresetsMenu]);

  const lineNumbers = code.split('\n').map((_: string, i: number) => i + 1);

  const modes = ['Bytebeat', 'Floatbeat', 'Signed Bytebeat', 'Bitbeat', 'Funcbeat', 'LogMode', 'Mode2048', 'PWM', 'SoftBeat', 'SqrtBeat', 'ExpBeat', 'Sinbeat', 'Tanbeat', 'Modbeat', 'Xorbeat', 'Fracbeat', 'Wavebeat'];
  const rates = [4000, 8000, 11025, 16000, 22050, 32000, 44100, 48000, 88200, 96000, 176400, 192000];
  const visualModes = ['Points', 'Waveform', 'Bars', 'Goniometer', 'Spectrum', 'Circular', 'Waterfall', 'VU Meter', 'Mirror', 'Tunnel', 'Starfield', 'Lissajous'];
  const scales = [1, 2, 4, 8, 16];

  const flexDir = editorLayout === 'vertical' ? 'flex-col' : 'flex-col md:flex-row';

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
        fontFamily: fontFamily,
        opacity: bgOpacity
      }}
    >
      {/* Control Bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0 flex-wrap"
        style={{
          background: `linear-gradient(180deg, ${currentTheme.bgTertiary} 0%, ${currentTheme.bgSecondary} 100%)`,
          borderBottom: `2px solid ${currentTheme.border}`
        }}
      >
        {/* Logo */}
        <div
          className="font-bold text-lg tracking-wider mr-2"
          style={{
            color: currentTheme.accent,
            textShadow: `0 0 10px ${currentTheme.scopeGlow}`
          }}
        >
          ⌘ BYTEBEAT
        </div>

        {/* Play/Stop */}
        <button
          onClick={togglePlay}
          className="px-4 py-1.5 font-bold text-sm rounded transition-all"
          style={{
            background: isPlaying 
              ? `linear-gradient(180deg, #dc2626 0%, #991b1b 100%)` 
              : `linear-gradient(180deg, ${currentTheme.accent}cc 0%, ${currentTheme.accentHover} 100%)`,
            border: `1px solid ${isPlaying ? '#dc2626' : currentTheme.accent}`,
            color: 'white',
            boxShadow: `0 0 10px ${isPlaying ? '#dc262666' : currentTheme.scopeGlow}`
          }}
        >
          {isPlaying ? '■ STOP' : '▶ PLAY'}
        </button>

        {/* Reset */}
        <button
          onClick={resetTime}
          className="px-3 py-1.5 text-xs font-bold rounded"
          style={{
            backgroundColor: currentTheme.buttonBg,
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.buttonText
          }}
        >
          ⏮ RESET
        </button>

        {!autoCompile && (
          <button
            onClick={manualCompile}
            className="px-3 py-1.5 text-xs font-bold rounded"
            style={{
              backgroundColor: currentTheme.buttonBgActive,
              border: `1px solid ${currentTheme.accent}`,
              color: currentTheme.accent
            }}
          >
            ⟳ COMPILE
          </button>
        )}

        {/* Pack / Unpack */}
        <button
          onClick={() => setCode(packCode(code))}
          className="px-2 py-1.5 text-xs font-bold rounded"
          title="Pack code using eval(unescape(escape(...).replace(...)))"
          style={{
            backgroundColor: currentTheme.buttonBg,
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.buttonText
          }}
        >
          📦 Pack
        </button>
        <button
          onClick={() => setCode(unpackCode(code))}
          className="px-2 py-1.5 text-xs font-bold rounded"
          title="Unpack and beautify code"
          style={{
            backgroundColor: currentTheme.buttonBg,
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.buttonText
          }}
        >
          📂 Unpack
        </button>

        <div className="w-px h-5" style={{ backgroundColor: currentTheme.border }} />

        {/* Mode Select */}
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>Mode:</span>
          <select
            value={mode}
            onChange={(e) => handleModeChange(e.target.value)}
            className="px-2 py-1 text-xs rounded cursor-pointer outline-none"
            style={{
              backgroundColor: currentTheme.selectBg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.selectText
            }}
          >
            {modes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Sample Rate - Simple text input */}
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>Hz:</span>
          <input
            type="text"
            value={sampleRate}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              if (val === '') return;
              const num = parseInt(val);
              if (num > 0 && Number.isFinite(num)) {
                handleSampleRateChange(num);
              }
            }}
            onBlur={(e) => {
              const val = parseInt(e.target.value);
              if (isNaN(val) || val < 1) handleSampleRateChange(8000);
            }}
            className="w-20 px-2 py-1 text-xs rounded outline-none text-center font-mono"
            style={{
              backgroundColor: currentTheme.selectBg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.accent
            }}
          />
          <select
            value={rates.includes(sampleRate) ? sampleRate : ''}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) handleSampleRateChange(val);
            }}
            className="px-1 py-1 text-xs rounded cursor-pointer outline-none"
            style={{
              backgroundColor: currentTheme.selectBg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.selectText,
              width: '24px'
            }}
            title="Quick presets"
          >
            <option value="" disabled>▾</option>
            {rates.map(r => <option key={r} value={r}>{r >= 1000 ? `${r/1000}k` : r}</option>)}
          </select>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>Vol:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="w-14 h-2 cursor-pointer"
            style={{ accentColor: currentTheme.accent }}
          />
        </div>

        <div className="w-px h-5" style={{ backgroundColor: currentTheme.border }} />

        {/* Presets Menu */}
        <div className="relative" ref={presetsMenuRef}>
          <button
            onClick={() => setShowPresetsMenu(!showPresetsMenu)}
            className="px-3 py-1 text-xs rounded cursor-pointer outline-none flex items-center gap-2"
            style={{
              backgroundColor: showPresetsMenu ? currentTheme.buttonBgActive : currentTheme.selectBg,
              border: `1px solid ${showPresetsMenu ? currentTheme.accent : currentTheme.border}`,
              color: showPresetsMenu ? currentTheme.accent : currentTheme.selectText
            }}
          >
            <span>🎵 Presets</span>
            <span style={{ fontSize: '8px' }}>{showPresetsMenu ? '▲' : '▼'}</span>
          </button>
          
          {showPresetsMenu && (
            <div 
              className="absolute top-full left-0 mt-1 rounded-lg shadow-2xl overflow-hidden z-50"
              style={{
                backgroundColor: currentTheme.bgSecondary,
                border: `2px solid ${currentTheme.border}`,
                minWidth: '320px',
                maxHeight: '70vh'
              }}
            >
              {/* Search */}
              <div className="p-2" style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                <input
                  type="text"
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  placeholder="🔍 Search presets..."
                  autoFocus
                  className="w-full px-3 py-2 text-xs rounded outline-none"
                  style={{
                    backgroundColor: currentTheme.bgTertiary,
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.text
                  }}
                />
              </div>
              
              {/* Preset Categories */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 50px)' }}>
                {/* Bytebeat */}
                {Object.entries(presets).filter(([k, p]) => p.mode === 'Bytebeat' && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).length > 0 && (
                  <div>
                    <div 
                      className="px-3 py-1.5 text-xs font-bold sticky top-0"
                      style={{ 
                        backgroundColor: currentTheme.bgTertiary, 
                        color: currentTheme.accent,
                        borderBottom: `1px solid ${currentTheme.border}`
                      }}
                    >
                      🔢 Bytebeat
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {Object.entries(presets).filter(([k, p]) => p.mode === 'Bytebeat' && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).map(([k, p]) => (
                        <button
                          key={k}
                          onClick={() => {
                            handlePresetChange(k);
                            setShowPresetsMenu(false);
                            setPresetSearch('');
                          }}
                          className="px-2 py-1.5 text-xs rounded text-left truncate transition-all hover:scale-[1.02]"
                          style={{
                            backgroundColor: currentTheme.buttonBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: currentTheme.text
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBgActive;
                            e.currentTarget.style.borderColor = currentTheme.accent;
                            e.currentTarget.style.color = currentTheme.accent;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBg;
                            e.currentTarget.style.borderColor = currentTheme.border;
                            e.currentTarget.style.color = currentTheme.text;
                          }}
                          title={`${k} (${p.rate}Hz)`}
                        >
                          {k}
                          <span className="ml-1 opacity-50" style={{ fontSize: '9px' }}>{p.rate >= 1000 ? `${p.rate/1000}k` : p.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floatbeat */}
                {Object.entries(presets).filter(([k, p]) => p.mode === 'Floatbeat' && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).length > 0 && (
                  <div>
                    <div 
                      className="px-3 py-1.5 text-xs font-bold sticky top-0"
                      style={{ 
                        backgroundColor: currentTheme.bgTertiary, 
                        color: currentTheme.accentSecondary,
                        borderBottom: `1px solid ${currentTheme.border}`
                      }}
                    >
                      〰️ Floatbeat
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {Object.entries(presets).filter(([k, p]) => p.mode === 'Floatbeat' && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).map(([k, p]) => (
                        <button
                          key={k}
                          onClick={() => {
                            handlePresetChange(k);
                            setShowPresetsMenu(false);
                            setPresetSearch('');
                          }}
                          className="px-2 py-1.5 text-xs rounded text-left truncate transition-all hover:scale-[1.02]"
                          style={{
                            backgroundColor: currentTheme.buttonBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: currentTheme.text
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBgActive;
                            e.currentTarget.style.borderColor = currentTheme.accent;
                            e.currentTarget.style.color = currentTheme.accent;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBg;
                            e.currentTarget.style.borderColor = currentTheme.border;
                            e.currentTarget.style.color = currentTheme.text;
                          }}
                          title={`${k} (${p.rate}Hz)`}
                        >
                          {k}
                          <span className="ml-1 opacity-50" style={{ fontSize: '9px' }}>{p.rate >= 1000 ? `${p.rate/1000}k` : p.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Funcbeat */}
                {Object.entries(presets).filter(([k, p]) => p.mode === 'Funcbeat' && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).length > 0 && (
                  <div>
                    <div 
                      className="px-3 py-1.5 text-xs font-bold sticky top-0"
                      style={{ 
                        backgroundColor: currentTheme.bgTertiary, 
                        color: '#ff6b6b',
                        borderBottom: `1px solid ${currentTheme.border}`
                      }}
                    >
                      ⚡ Funcbeat
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {Object.entries(presets).filter(([k, p]) => p.mode === 'Funcbeat' && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).map(([k, p]) => (
                        <button
                          key={k}
                          onClick={() => {
                            handlePresetChange(k);
                            setShowPresetsMenu(false);
                            setPresetSearch('');
                          }}
                          className="px-2 py-1.5 text-xs rounded text-left truncate transition-all hover:scale-[1.02]"
                          style={{
                            backgroundColor: currentTheme.buttonBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: currentTheme.text
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBgActive;
                            e.currentTarget.style.borderColor = currentTheme.accent;
                            e.currentTarget.style.color = currentTheme.accent;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBg;
                            e.currentTarget.style.borderColor = currentTheme.border;
                            e.currentTarget.style.color = currentTheme.text;
                          }}
                          title={`${k} (${p.rate}Hz)`}
                        >
                          {k}
                          <span className="ml-1 opacity-50" style={{ fontSize: '9px' }}>{p.rate >= 1000 ? `${p.rate/1000}k` : p.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other modes */}
                {Object.entries(presets).filter(([k, p]) => !['Bytebeat', 'Floatbeat', 'Funcbeat'].includes(p.mode) && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).length > 0 && (
                  <div>
                    <div 
                      className="px-3 py-1.5 text-xs font-bold sticky top-0"
                      style={{ 
                        backgroundColor: currentTheme.bgTertiary, 
                        color: '#ffd93d',
                        borderBottom: `1px solid ${currentTheme.border}`
                      }}
                    >
                      🎛️ Other Modes
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {Object.entries(presets).filter(([k, p]) => !['Bytebeat', 'Floatbeat', 'Funcbeat'].includes(p.mode) && (presetSearch === '' || k.toLowerCase().includes(presetSearch.toLowerCase()))).map(([k, p]) => (
                        <button
                          key={k}
                          onClick={() => {
                            handlePresetChange(k);
                            setShowPresetsMenu(false);
                            setPresetSearch('');
                          }}
                          className="px-2 py-1.5 text-xs rounded text-left truncate transition-all hover:scale-[1.02]"
                          style={{
                            backgroundColor: currentTheme.buttonBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: currentTheme.text
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBgActive;
                            e.currentTarget.style.borderColor = currentTheme.accent;
                            e.currentTarget.style.color = currentTheme.accent;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.buttonBg;
                            e.currentTarget.style.borderColor = currentTheme.border;
                            e.currentTarget.style.color = currentTheme.text;
                          }}
                          title={`${k} - ${p.mode} (${p.rate}Hz)`}
                        >
                          <span className="opacity-60" style={{ fontSize: '9px' }}>{p.mode.slice(0,3)}</span> {k}
                          <span className="ml-1 opacity-50" style={{ fontSize: '9px' }}>{p.rate >= 1000 ? `${p.rate/1000}k` : p.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {presetSearch !== '' && 
                  Object.entries(presets).filter(([k]) => k.toLowerCase().includes(presetSearch.toLowerCase())).length === 0 && (
                  <div className="p-6 text-center" style={{ color: currentTheme.textMuted }}>
                    No presets found for "{presetSearch}"
                  </div>
                )}
              </div>
              
              {/* Footer with count */}
              <div 
                className="px-3 py-1.5 text-xs flex justify-between"
                style={{ 
                  backgroundColor: currentTheme.bgTertiary, 
                  color: currentTheme.textMuted,
                  borderTop: `1px solid ${currentTheme.border}`
                }}
              >
                <span>{Object.keys(presets).length} presets</span>
                <span>ESC to close</span>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Mode */}
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>View:</span>
          <select
            value={drawMode}
            onChange={(e) => setDrawMode(e.target.value)}
            className="px-2 py-1 text-xs rounded cursor-pointer outline-none"
            style={{
              backgroundColor: currentTheme.selectBg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.selectText
            }}
          >
            {visualModes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Scale */}
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>Scale:</span>
          <select
            value={scale}
            onChange={(e) => setScale(parseInt(e.target.value))}
            className="px-2 py-1 text-xs rounded cursor-pointer outline-none"
            style={{
              backgroundColor: currentTheme.selectBg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.selectText
            }}
          >
            {scales.map(s => <option key={s} value={s}>{s}x</option>)}
          </select>
        </div>

        <div className="flex-1" />

        {/* Projects Button */}
        <button
          onClick={() => setShowProjectsModal(true)}
          className="px-3 py-1.5 text-xs font-bold rounded"
          style={{
            backgroundColor: currentTheme.buttonBg,
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.buttonText
          }}
        >
          💾 Projects
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="px-3 py-1.5 text-xs font-bold rounded"
          style={{
            backgroundColor: currentTheme.buttonBg,
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.buttonText
          }}
        >
          ⚙ Settings
        </button>

        {/* Time Display */}
        <div 
          className="text-xs px-2 py-1 rounded font-mono"
          style={{ 
            backgroundColor: currentTheme.bgTertiary, 
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.accent 
          }}
        >
          t = {currentT.toLocaleString()}
        </div>

        {/* Stereo Indicator */}
        <div 
          className="text-xs font-bold px-2 py-1 rounded"
          style={{ 
            backgroundColor: isStereoMode ? currentTheme.bgTertiary : 'transparent',
            color: isStereoMode ? activeWaveColorR : currentTheme.textMuted 
          }}
        >
          {isStereoMode ? '🔊 STEREO' : '🔈 MONO'}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex flex-1 ${flexDir} overflow-hidden`}>
        {/* Editor */}
        <div 
          className="flex-1 flex flex-col min-h-[35%] md:min-h-0 relative"
          style={{ borderRight: editorLayout === 'horizontal' ? `1px solid ${currentTheme.border}` : 'none', borderBottom: editorLayout === 'vertical' ? `1px solid ${currentTheme.border}` : 'none' }}
        >
          <div className="flex-1 flex overflow-hidden relative">
            {showLineNumbers && (
              <div 
                ref={lineNumbersRef}
                className="py-2 px-2 text-right select-none flex-shrink-0"
                style={{
                  backgroundColor: currentCodeTheme.background,
                  color: currentCodeTheme.comment,
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5',
                  fontFamily: fontFamily,
                  minWidth: '40px',
                  borderRight: `1px solid ${currentTheme.border}`,
                  overflowY: 'hidden',
                  overflowX: 'hidden'
                }}
              >
                {lineNumbers.map((n: number) => <div key={n}>{n}</div>)}
              </div>
            )}

            {syntaxHighlighting && (
              <div
                ref={highlightRef}
                className="absolute p-2 overflow-auto pointer-events-none whitespace-pre-wrap break-words"
                style={{
                  left: showLineNumbers ? '40px' : '0',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: currentCodeTheme.background,
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5',
                  fontFamily: fontFamily
                }}
                dangerouslySetInnerHTML={{ __html: highlightCode(code, currentCodeTheme) + '\n' }}
              />
            )}

            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onScroll={syncScroll}
              className="flex-1 p-2 w-full h-full resize-none outline-none"
              style={{
                backgroundColor: syntaxHighlighting ? 'transparent' : currentCodeTheme.background,
                color: syntaxHighlighting ? 'transparent' : currentCodeTheme.text,
                caretColor: currentCodeTheme.text,
                fontSize: `${fontSize}px`,
                lineHeight: '1.5',
                fontFamily: fontFamily,
                position: 'relative',
                zIndex: 1
              }}
              spellCheck={false}
              placeholder="Enter bytebeat formula..."
            />
          </div>

          {thrownMessage && (
            <div 
              className="text-xs p-2 font-mono"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                color: '#dbeafe',
                borderTop: '1px solid #3b82f6'
              }}
            >
              💬 {thrownMessage}
            </div>
          )}
          {error && (
            <div 
              className="text-xs p-2 font-mono"
              style={{
                backgroundColor: 'rgba(185, 28, 28, 0.9)',
                color: '#fecaca',
                borderTop: '1px solid #dc2626'
              }}
            >
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Visualizer */}
        <div 
          className="flex-1 flex flex-col min-h-[65%] md:min-h-0 relative overflow-hidden"
          style={{ background: currentTheme.scopeBg }}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(${currentTheme.accent}15 1px, transparent 1px),
                  linear-gradient(90deg, ${currentTheme.accent}15 1px, transparent 1px)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`,
                zIndex: 2
              }}
            />
          )}

          {/* Scanlines */}
          {showScanlines && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${scanlineIntensity}) 2px, rgba(0,0,0,${scanlineIntensity}) 4px)`,
                zIndex: 1
              }}
            />
          )}

          {/* Stereo Indicator */}
          {isStereoMode && (
            <div 
              className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-4 text-xs font-bold"
              style={{ zIndex: 10 }}
            >
              <span style={{ color: activeWaveColorL, textShadow: `0 0 5px ${activeWaveColorL}`, opacity: 0.6 }}>◀ L (back)</span>
              <span style={{ color: activeWaveColorR, textShadow: `0 0 5px ${activeWaveColorR}` }}>R (front) ▶</span>
            </div>
          )}

          {/* Mode Label */}
          <div 
            className="absolute top-2 right-2 text-xs font-bold opacity-60"
            style={{ zIndex: 10, color: currentTheme.accent }}
          >
            {drawMode.toUpperCase()}
          </div>

          <canvas 
            ref={canvasRef}
            className="w-full h-full relative"
            style={{ zIndex: 0, imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* Footer */}
      <div 
        className="px-3 py-1 text-xs flex justify-between items-center flex-shrink-0"
        style={{
          backgroundColor: currentTheme.bgSecondary,
          borderTop: `1px solid ${currentTheme.border}`,
          color: currentTheme.textMuted
        }}
      >
        <span>
          <kbd className="px-1 rounded text-xs mr-1" style={{ backgroundColor: currentTheme.bgTertiary, color: currentTheme.accent }}>Ctrl+Enter</kbd> Play/Stop
          <kbd className="px-1 rounded text-xs mx-1 ml-3" style={{ backgroundColor: currentTheme.bgTertiary, color: currentTheme.accent }}>Ctrl+R</kbd> Reset
          <kbd className="px-1 rounded text-xs mx-1 ml-3" style={{ backgroundColor: currentTheme.bgTertiary, color: currentTheme.accent }}>Ctrl+S</kbd> Projects
        </span>
        <span className="flex items-center gap-3">
          <span style={{ color: activeWaveColorMono }}>● Mono</span>
          <span style={{ color: activeWaveColorL }}>● L</span>
          <span style={{ color: activeWaveColorR }}>● R</span>
          <span style={{ color: currentTheme.accent }}>
            {mode} @ {sampleRate}Hz
          </span>
        </span>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto"
            style={{ 
              backgroundColor: currentTheme.bgSecondary,
              border: `2px solid ${currentTheme.border}`
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: currentTheme.accent }}>⚙ Settings</h2>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-2xl px-2"
                style={{ color: currentTheme.textMuted }}
              >×</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4">
              {(['editor', 'visual', 'colors', 'advanced'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSettingsTab(tab)}
                  className="px-4 py-2 rounded text-sm font-bold capitalize"
                  style={{
                    backgroundColor: settingsTab === tab ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                    border: `1px solid ${settingsTab === tab ? currentTheme.accent : currentTheme.border}`,
                    color: settingsTab === tab ? currentTheme.buttonTextActive : currentTheme.buttonText
                  }}
                >
                  {tab === 'editor' ? '📝 Editor' : tab === 'visual' ? '🎨 Visual' : tab === 'colors' ? '🌈 Colors' : '⚡ Advanced'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* ===== EDITOR TAB ===== */}
              {settingsTab === 'editor' && (
                <>
                  {/* UI Theme */}
                  <div>
                    <label className="block text-sm mb-1" style={{ color: currentTheme.textMuted }}>UI Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-3 py-2 rounded"
                      style={{
                        backgroundColor: currentTheme.selectBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: currentTheme.selectText
                      }}
                    >
                      {Object.entries(themes).map(([k, t]) => (
                        <option key={k} value={k}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Code Theme */}
                  <div>
                    <label className="block text-sm mb-1" style={{ color: currentTheme.textMuted }}>Code Theme</label>
                    <select
                      value={codeTheme}
                      onChange={(e) => setCodeTheme(e.target.value)}
                      className="w-full px-3 py-2 rounded"
                      style={{
                        backgroundColor: currentTheme.selectBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: currentTheme.selectText
                      }}
                    >
                      {Object.entries(codeThemes).map(([k, t]) => (
                        <option key={k} value={k}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm mb-1" style={{ color: currentTheme.textMuted }}>Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 rounded"
                      style={{
                        backgroundColor: currentTheme.selectBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: currentTheme.selectText,
                        fontFamily: fontFamily
                      }}
                    >
                      {fonts.map(f => (
                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm mb-1" style={{ color: currentTheme.textMuted }}>Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                      style={{ accentColor: currentTheme.accent }}
                    />
                  </div>

                  {/* Editor Layout */}
                  <div>
                    <label className="block text-sm mb-1" style={{ color: currentTheme.textMuted }}>Editor Layout</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditorLayout('horizontal')}
                        className="flex-1 px-3 py-2 rounded text-sm"
                        style={{
                          backgroundColor: editorLayout === 'horizontal' ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                          border: `1px solid ${currentTheme.border}`,
                          color: editorLayout === 'horizontal' ? currentTheme.buttonTextActive : currentTheme.buttonText
                        }}
                      >
                        ⬌ Horizontal
                      </button>
                      <button
                        onClick={() => setEditorLayout('vertical')}
                        className="flex-1 px-3 py-2 rounded text-sm"
                        style={{
                          backgroundColor: editorLayout === 'vertical' ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                          border: `1px solid ${currentTheme.border}`,
                          color: editorLayout === 'vertical' ? currentTheme.buttonTextActive : currentTheme.buttonText
                        }}
                      >
                        ⬍ Vertical
                      </button>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSyntaxHighlighting(!syntaxHighlighting)}
                      className="px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: syntaxHighlighting ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: syntaxHighlighting ? currentTheme.buttonTextActive : currentTheme.buttonText
                      }}
                    >
                      {syntaxHighlighting ? '✓' : '○'} Syntax Highlighting
                    </button>

                    <button
                      onClick={() => setShowLineNumbers(!showLineNumbers)}
                      className="px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: showLineNumbers ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: showLineNumbers ? currentTheme.buttonTextActive : currentTheme.buttonText
                      }}
                    >
                      {showLineNumbers ? '✓' : '○'} Line Numbers
                    </button>
                  </div>
                </>
              )}

              {/* ===== VISUAL TAB ===== */}
              {settingsTab === 'visual' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className="px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: showGrid ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: showGrid ? currentTheme.buttonTextActive : currentTheme.buttonText
                      }}
                    >
                      {showGrid ? '✓' : '○'} Show Grid
                    </button>

                    <button
                      onClick={() => setShowScanlines(!showScanlines)}
                      className="px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: showScanlines ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: showScanlines ? currentTheme.buttonTextActive : currentTheme.buttonText
                      }}
                    >
                      {showScanlines ? '✓' : '○'} Scanlines
                    </button>

                    <button
                      onClick={() => setSmoothing(!smoothing)}
                      className="px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: smoothing ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: smoothing ? currentTheme.buttonTextActive : currentTheme.buttonText
                      }}
                    >
                      {smoothing ? '✓' : '○'} Wave Smoothing
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                        Phosphor Decay: {phosphorDecay.toFixed(2)}
                      </label>
                      <input
                        type="range" min="0.01" max="1" step="0.01" value={phosphorDecay}
                        onChange={(e) => setPhosphorDecay(parseFloat(e.target.value))}
                        className="w-full" style={{ accentColor: currentTheme.accent }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                        Wave Thickness: {waveThickness}
                      </label>
                      <input
                        type="range" min="1" max="5" step="0.5" value={waveThickness}
                        onChange={(e) => setWaveThickness(parseFloat(e.target.value))}
                        className="w-full" style={{ accentColor: currentTheme.accent }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                        Glow Intensity: {glowIntensity}
                      </label>
                      <input
                        type="range" min="0" max="15" step="1" value={glowIntensity}
                        onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                        className="w-full" style={{ accentColor: currentTheme.accent }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                        Grid Size: {gridSize}px
                      </label>
                      <input
                        type="range" min="8" max="64" step="4" value={gridSize}
                        onChange={(e) => setGridSize(parseInt(e.target.value))}
                        className="w-full" style={{ accentColor: currentTheme.accent }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                        Scanline Intensity: {scanlineIntensity.toFixed(2)}
                      </label>
                      <input
                        type="range" min="0" max="0.3" step="0.01" value={scanlineIntensity}
                        onChange={(e) => setScanlineIntensity(parseFloat(e.target.value))}
                        className="w-full" style={{ accentColor: currentTheme.accent }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ===== COLORS TAB ===== */}
              {settingsTab === 'colors' && (
                <>
                  <div className="p-3 rounded" style={{ backgroundColor: currentTheme.bgTertiary }}>
                    <button
                      onClick={() => setUseCustomColors(!useCustomColors)}
                      className="w-full px-3 py-2 rounded text-sm font-bold"
                      style={{
                        backgroundColor: useCustomColors ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                        border: `1px solid ${useCustomColors ? currentTheme.accent : currentTheme.border}`,
                        color: useCustomColors ? currentTheme.buttonTextActive : currentTheme.buttonText
                      }}
                    >
                      {useCustomColors ? '✓ Custom Wave Colors Active' : '○ Use Theme Wave Colors'}
                    </button>
                  </div>

                  <div className="space-y-3" style={{ opacity: useCustomColors ? 1 : 0.5, pointerEvents: useCustomColors ? 'auto' : 'none' }}>
                    <div>
                      <label className="block text-sm mb-2" style={{ color: currentTheme.textMuted }}>
                        Mono Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customMonoColor}
                          onChange={(e) => setCustomMonoColor(e.target.value)}
                          className="w-12 h-8 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={customMonoColor}
                          onChange={(e) => setCustomMonoColor(e.target.value)}
                          className="flex-1 px-3 py-1 rounded text-sm outline-none font-mono"
                          style={{
                            backgroundColor: currentTheme.selectBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: customMonoColor
                          }}
                        />
                        <div className="w-16 h-8 rounded" style={{ backgroundColor: customMonoColor, boxShadow: `0 0 10px ${customMonoColor}` }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ color: currentTheme.textMuted }}>
                        Left Channel (L) Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customLColor}
                          onChange={(e) => setCustomLColor(e.target.value)}
                          className="w-12 h-8 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={customLColor}
                          onChange={(e) => setCustomLColor(e.target.value)}
                          className="flex-1 px-3 py-1 rounded text-sm outline-none font-mono"
                          style={{
                            backgroundColor: currentTheme.selectBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: customLColor
                          }}
                        />
                        <div className="w-16 h-8 rounded" style={{ backgroundColor: customLColor, boxShadow: `0 0 10px ${customLColor}` }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ color: currentTheme.textMuted }}>
                        Right Channel (R) Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customRColor}
                          onChange={(e) => setCustomRColor(e.target.value)}
                          className="w-12 h-8 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={customRColor}
                          onChange={(e) => setCustomRColor(e.target.value)}
                          className="flex-1 px-3 py-1 rounded text-sm outline-none font-mono"
                          style={{
                            backgroundColor: currentTheme.selectBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: customRColor
                          }}
                        />
                        <div className="w-16 h-8 rounded" style={{ backgroundColor: customRColor, boxShadow: `0 0 10px ${customRColor}` }} />
                      </div>
                    </div>
                  </div>

                  {/* Color preview */}
                  <div className="p-4 rounded" style={{ backgroundColor: '#000000' }}>
                    <div className="text-xs mb-2" style={{ color: currentTheme.textMuted }}>Preview</div>
                    <div className="flex justify-around items-center">
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: activeWaveColorMono, boxShadow: `0 0 12px ${activeWaveColorMono}` }} />
                        <span className="text-xs" style={{ color: activeWaveColorMono }}>MONO</span>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: activeWaveColorL, boxShadow: `0 0 12px ${activeWaveColorL}` }} />
                        <span className="text-xs" style={{ color: activeWaveColorL }}>LEFT</span>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: activeWaveColorR, boxShadow: `0 0 12px ${activeWaveColorR}` }} />
                        <span className="text-xs" style={{ color: activeWaveColorR }}>RIGHT</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ===== ADVANCED TAB ===== */}
              {settingsTab === 'advanced' && (
                <>
                  {/* Sample Rate Fine Control */}
                  <div className="p-3 rounded" style={{ backgroundColor: currentTheme.bgTertiary }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: currentTheme.accent }}>🎚️ Sample Rate Control</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                          Current Rate: {sampleRate.toLocaleString()} Hz
                        </label>
                        <input
                          type="range"
                          min="100"
                          max="500000"
                          step="100"
                          value={Math.min(sampleRate, 500000)}
                          onChange={(e) => handleSampleRateChange(parseInt(e.target.value))}
                          className="w-full"
                          style={{ accentColor: currentTheme.accent }}
                        />
                        <div className="flex justify-between text-xs mt-1" style={{ color: currentTheme.textMuted }}>
                          <span>100Hz</span>
                          <span>48kHz</span>
                          <span>192kHz</span>
                          <span>500kHz</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={sampleRate}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val === '') return;
                            const num = parseInt(val);
                            if (num > 0 && Number.isFinite(num)) {
                              handleSampleRateChange(num);
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (isNaN(val) || val < 1) handleSampleRateChange(8000);
                          }}
                          className="flex-1 px-3 py-2 rounded text-sm outline-none font-mono text-center"
                          style={{
                            backgroundColor: currentTheme.selectBg,
                            border: `1px solid ${currentTheme.border}`,
                            color: currentTheme.accent
                          }}
                        />
                        <span className="text-sm" style={{ color: currentTheme.textMuted }}>Hz</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[4000, 8000, 11025, 22050, 32000, 44100, 48000, 96000].map(rate => (
                          <button
                            key={rate}
                            onClick={() => handleSampleRateChange(rate)}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: sampleRate === rate ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                              border: `1px solid ${sampleRate === rate ? currentTheme.accent : currentTheme.border}`,
                              color: sampleRate === rate ? currentTheme.buttonTextActive : currentTheme.buttonText
                            }}
                          >
                            {rate >= 1000 ? `${rate/1000}k` : rate}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAutoCompile(!autoCompile)}
                      className="px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: autoCompile ? currentTheme.buttonBgActive : currentTheme.buttonBg,
                        border: `1px solid ${currentTheme.border}`,
                        color: autoCompile ? currentTheme.buttonTextActive : currentTheme.buttonText
                      }}
                    >
                      {autoCompile ? '✓' : '○'} Auto Compile
                    </button>
                  </div>

                  {autoCompile && (
                    <div>
                      <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                        Auto Compile Delay: {autoCompileDelay}ms
                      </label>
                      <input
                        type="range" min="100" max="2000" step="50" value={autoCompileDelay}
                        onChange={(e) => setAutoCompileDelay(parseInt(e.target.value))}
                        className="w-full" style={{ accentColor: currentTheme.accent }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs mb-1" style={{ color: currentTheme.textMuted }}>
                      UI Opacity: {bgOpacity.toFixed(2)}
                    </label>
                    <input
                      type="range" min="0.5" max="1" step="0.01" value={bgOpacity}
                      onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                      className="w-full" style={{ accentColor: currentTheme.accent }}
                    />
                  </div>

                  <div className="pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: currentTheme.accent }}>Keyboard Shortcuts</h3>
                    <div className="space-y-2 text-xs" style={{ color: currentTheme.textMuted }}>
                      <div className="flex justify-between">
                        <span>Play / Stop</span>
                        <kbd className="px-2 py-0.5 rounded" style={{ backgroundColor: currentTheme.bgTertiary, color: currentTheme.accent }}>Ctrl + Enter</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Reset Time</span>
                        <kbd className="px-2 py-0.5 rounded" style={{ backgroundColor: currentTheme.bgTertiary, color: currentTheme.accent }}>Ctrl + R</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Open Projects</span>
                        <kbd className="px-2 py-0.5 rounded" style={{ backgroundColor: currentTheme.bgTertiary, color: currentTheme.accent }}>Ctrl + S</kbd>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: currentTheme.accent }}>About</h3>
                    <p className="text-xs" style={{ color: currentTheme.textMuted }}>
                      Bytebeat Synthesizer Studio — A powerful browser-based bytebeat music synthesizer with 17 audio modes, 12 visualization modes, 12+ UI themes, 12 code themes, and extensive customization options. Write formulas that generate sound from simple math expressions.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects Modal */}
      {showProjectsModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowProjectsModal(false)}
        >
          <div 
            className="rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
            style={{ 
              backgroundColor: currentTheme.bgSecondary,
              border: `2px solid ${currentTheme.border}`
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: currentTheme.accent }}>💾 Projects</h2>
              <button 
                onClick={() => setShowProjectsModal(false)}
                className="text-2xl px-2"
                style={{ color: currentTheme.textMuted }}
              >×</button>
            </div>

            {/* Save New Project */}
            <div className="mb-4 p-3 rounded" style={{ backgroundColor: currentTheme.bgTertiary }}>
              <label className="block text-sm mb-2" style={{ color: currentTheme.textMuted }}>Save Current Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name..."
                  className="flex-1 px-3 py-2 rounded text-sm outline-none"
                  style={{
                    backgroundColor: currentTheme.selectBg,
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.text
                  }}
                />
                <button
                  onClick={saveProject}
                  disabled={!newProjectName.trim()}
                  className="px-4 py-2 rounded font-bold text-sm"
                  style={{
                    backgroundColor: newProjectName.trim() ? currentTheme.accent : currentTheme.buttonBg,
                    color: newProjectName.trim() ? currentTheme.bg : currentTheme.textMuted,
                    opacity: newProjectName.trim() ? 1 : 0.5
                  }}
                >
                  Save
                </button>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-2">
              {projects.length === 0 ? (
                <div className="text-center py-8" style={{ color: currentTheme.textMuted }}>
                  No saved projects yet
                </div>
              ) : (
                projects.sort((a, b) => b.timestamp - a.timestamp).map(project => (
                  <div 
                    key={project.id}
                    className="p-3 rounded flex justify-between items-center"
                    style={{ 
                      backgroundColor: currentTheme.bgTertiary,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate" style={{ color: currentTheme.text }}>{project.name}</div>
                      <div className="text-xs" style={{ color: currentTheme.textMuted }}>
                        {project.mode} @ {project.sampleRate}Hz • {new Date(project.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => loadProject(project)}
                        className="px-3 py-1 rounded text-xs font-bold"
                        style={{
                          backgroundColor: currentTheme.accent,
                          color: currentTheme.bg
                        }}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="px-3 py-1 rounded text-xs font-bold"
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
