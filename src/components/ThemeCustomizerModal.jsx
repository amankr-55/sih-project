import React from 'react';
import { 
  Palette, 
  Type, 
  Box, 
  X, 
  Check, 
  Sparkles, 
  Activity, 
  Compass, 
  Sliders, 
  Eye, 
  Layers,
  Cpu
} from 'lucide-react';

export const COLOR_THEMES = [
  {
    id: 'cyber',
    name: 'Cyber Cyan',
    desc: 'Neon Cyan & Electric Emerald over Deep Slate (Default)',
    bgPreview: 'from-[#090f1f] via-[#0f172a] to-[#0284c7]/30',
    primary: '#06b6d4',
    accent: '#10b981',
    badge: 'DEFAULT'
  },
  {
    id: 'amber',
    name: 'Volcanic Amber',
    desc: 'Magma Gold & Volcanic Bronze over Warm Coal Stratum',
    bgPreview: 'from-[#180f08] via-[#2a170b] to-[#d97706]/30',
    primary: '#f59e0b',
    accent: '#ea580c',
    badge: 'WARM'
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    desc: 'Bio-luminescent Matrix Green over Subterranean Cavern',
    bgPreview: 'from-[#061912] via-[#0b291d] to-[#10b981]/30',
    primary: '#10b981',
    accent: '#34d399',
    badge: 'MATRIX'
  },
  {
    id: 'midnight',
    name: 'Midnight OLED',
    desc: 'Pure Pitch Black with Razor-Sharp Ice Blue & Monochrome Silver',
    bgPreview: 'from-[#000000] via-[#0a0a0a] to-[#38bdf8]/20',
    primary: '#38bdf8',
    accent: '#94a3b8',
    badge: 'OLED'
  },
  {
    id: 'titanium',
    name: 'Industrial Titanium',
    desc: 'Technical Structural Steel with Deep Cobalt Blue & Platinum',
    bgPreview: 'from-[#121721] via-[#1e293b] to-[#3b82f6]/30',
    primary: '#3b82f6',
    accent: '#e2e8f0',
    badge: 'SCADA'
  }
];

export const FONT_THEMES = [
  {
    id: 'inter',
    name: 'Modern Inter Sans',
    className: 'font-theme-inter',
    desc: 'Clean, crisp corporate typography. Maximum legibility for DGMS reports.',
    sample: 'DGMS CMR-111 • SAFE 99.4% • 0.012g'
  },
  {
    id: 'mono',
    name: 'JetBrains Cyber Mono',
    className: 'font-theme-mono',
    desc: 'High-tech subterranean terminal monospaced code. Control-room feel.',
    sample: '0x9E4F // ADDR:0x68 [MPU6050_OK]'
  },
  {
    id: 'orbitron',
    name: 'Orbitron Sci-Fi HUD',
    className: 'font-theme-orbitron',
    desc: 'Aerospace & futuristic military telemetry HUD display font.',
    sample: 'GEOSENTINEL // AI SEAM TELEMETRY'
  },
  {
    id: 'roboto',
    name: 'Roboto Condensed PLC',
    className: 'font-theme-roboto',
    desc: 'Dense industrial instrument typography for maximum data packing.',
    sample: 'CH4: 0.22% • SAG: 1.4mm • TILT: 0.85°'
  },
  {
    id: 'space',
    name: 'Space Grotesk Modern',
    className: 'font-theme-space',
    desc: 'Geometric cutting-edge engineering font with high aesthetic appeal.',
    sample: 'Smart India Hackathon 2026 • SIH26025'
  }
];

export const EFFECT_3D_THEMES = [
  {
    id: 'sensor-sync',
    name: 'Dynamic MPU-6050 Sync',
    desc: 'Full 1:1 real-time gyroscope pitch, roll, and vibration tremor from physical ESP32.',
    badge: 'HARDWARE LINK',
    icon: Activity
  },
  {
    id: 'wireframe',
    name: 'Cyber Hologram Wireframe',
    desc: 'Neon glowing laser wireframe strata grid with high subterranean transparency.',
    badge: 'HOLOGRAM',
    icon: Layers
  },
  {
    id: 'thermal',
    name: 'Thermal FLIR Heatmap',
    desc: 'Color-graded geothermal stress gradient (blue-to-red) revealing shear hotspots.',
    badge: 'FLIR INFRARED',
    icon: Eye
  },
  {
    id: 'exaggerated',
    name: 'Strata Fault Exaggeration (2.2x)',
    desc: 'Deep subterranean fault chasms, enhanced ground trough dips, and steep fractures.',
    badge: 'DEEP RELIEF',
    icon: Sliders
  },
  {
    id: 'cad',
    name: 'Minimal Orthographic CAD',
    desc: 'Flat architectural blueprint projection with zero distortion and crisp grid lines.',
    badge: 'PRECISION CAD',
    icon: Box
  }
];

export default function ThemeCustomizerModal({
  isOpen,
  onClose,
  currentColorTheme = 'cyber',
  onSelectColorTheme,
  currentFontTheme = 'inter',
  onSelectFontTheme,
  current3DEffectTheme = 'sensor-sync',
  onSelect3DEffectTheme
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
                  DASHBOARD THEME & 3D STUDIO
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-full">
                  5x5x5 CUSTOMIZER
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Customize Dashboard Colors (5 Types), Typography Fonts (5 Types), and 3D Visual Effects (5 Types)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION 1: 5 COLOR THEMES */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
              1. Dashboard Color Theme (5 Types)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COLOR_THEMES.map(theme => {
              const isSelected = currentColorTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onSelectColorTheme(theme.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative bg-gradient-to-br ${theme.bgPreview} ${
                    isSelected 
                      ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]' 
                      : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white">{theme.name}</span>
                    {isSelected ? (
                      <span className="p-1 rounded-full bg-cyan-500 text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-400 border border-slate-700">
                        {theme.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                    {theme.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                    <span className="text-[10px] font-mono text-slate-400">Accent Colors</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: 5 TYPOGRAPHY FONT FAMILIES */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
              2. Typography & Fonts (5 Types)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FONT_THEMES.map(font => {
              const isSelected = currentFontTheme === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => onSelectFontTheme(font.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer bg-slate-950/70 ${
                    isSelected 
                      ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]' 
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-white">{font.name}</span>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-purple-500 text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2.5">
                    {font.desc}
                  </p>
                  <div className={`p-2 rounded-xl bg-black/60 border border-slate-800 text-xs text-purple-300 font-bold ${font.className}`}>
                    {font.sample}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: 5 3D SUBTERRANEAN EFFECT STYLES */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
              3. 3D Subterranean Visual Effect Styles (5 Types)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EFFECT_3D_THEMES.map(effect => {
              const Icon = effect.icon;
              const isSelected = current3DEffectTheme === effect.id;
              return (
                <button
                  key={effect.id}
                  onClick={() => onSelect3DEffectTheme(effect.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer bg-slate-950/70 ${
                    isSelected 
                      ? 'border-emerald-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]' 
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-white">{effect.name}</span>
                    </div>
                    {isSelected ? (
                      <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-400 border border-slate-700">
                        {effect.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {effect.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            Active Configuration: <strong className="text-cyan-400 uppercase">{currentColorTheme}</strong> • <strong className="text-purple-400 uppercase">{currentFontTheme}</strong> • <strong className="text-emerald-400 uppercase">{current3DEffectTheme}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white text-xs font-black shadow-lg transition-all cursor-pointer"
          >
            Apply & Close Studio
          </button>
        </div>

      </div>
    </div>
  );
}
