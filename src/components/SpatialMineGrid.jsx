import React, { useState } from 'react';
import { Layers, Compass, Info, Radio, AlertTriangle } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function SpatialMineGrid({ nodes, onSelectNode, selectedNodeId }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-xl relative overflow-hidden">
      
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              UNDERGROUND MINE SPATIAL TOPOLOGY (GIS GRID)
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal">
                Bord & Pillar Layout • Seam #3
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive 2D Strata Mesh Grid • Click node for instant geotechnical drill-down
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 bg-slate-950/70 px-3 py-1 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            Normal (&lt;2.5°)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            Advisory (≥2.5°)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
            Critical (≥5.0°)
          </span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative flex-1 bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2 min-h-[380px]">
        
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <svg 
          viewBox="0 0 800 450" 
          className="w-full h-full max-h-[440px] select-none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="activeFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <pattern id="coalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Geological strata background / galleries */}
          {/* Main Incline Shaft from Surface */}
          <line x1="60" y1="40" x2="130" y2="130" stroke="#0284c7" strokeWidth="22" strokeLinecap="round" opacity="0.4" />
          <line x1="60" y1="40" x2="130" y2="130" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,4" />
          <text x="50" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold">Main Haulage Incline (Surface Adit)</text>

          {/* Galleries & Roadways (Horizontal & Vertical network) */}
          <g stroke="#1e293b" strokeWidth="28" strokeLinecap="square" opacity="0.85">
            {/* Horizontal galleries */}
            <line x1="120" y1="130" x2="720" y2="130" />
            <line x1="120" y1="220" x2="720" y2="220" />
            <line x1="120" y1="310" x2="720" y2="310" />

            {/* Vertical crosscuts */}
            <line x1="130" y1="130" x2="130" y2="310" />
            <line x1="290" y1="130" x2="290" y2="310" />
            <line x1="480" y1="130" x2="480" y2="310" />
            <line x1="650" y1="130" x2="650" y2="310" />
          </g>

          {/* Airway Direction Arrows */}
          <g fill="#0284c7" opacity="0.6">
            <polygon points="200,126 210,130 200,134" />
            <polygon points="380,126 390,130 380,134" />
            <polygon points="560,126 570,130 560,134" />
            <polygon points="560,306 550,310 560,314" />
            <polygon points="380,306 370,310 380,314" />
          </g>

          {/* Coal Pillars (Bord & Pillar Solid Coal Blocks) */}
          {[
            { x: 155, y: 155, w: 110, h: 40, label: 'Pillar 11' },
            { x: 315, y: 155, w: 140, h: 40, label: 'Pillar 12 (Stress Zone)' },
            { x: 505, y: 155, w: 120, h: 40, label: 'Pillar 13' },
            { x: 155, y: 245, w: 110, h: 40, label: 'Pillar 21' },
            { x: 315, y: 245, w: 140, h: 40, label: 'Pillar 22' },
            { x: 505, y: 245, w: 120, h: 40, label: 'Pillar 23' },
          ].map((pillar, idx) => (
            <g key={idx}>
              <rect
                x={pillar.x}
                y={pillar.y}
                width={pillar.w}
                height={pillar.h}
                fill="url(#pillarGrad)"
                stroke="#334155"
                strokeWidth="1.5"
                rx="4"
              />
              <rect
                x={pillar.x}
                y={pillar.y}
                width={pillar.w}
                height={pillar.h}
                fill="url(#coalHatch)"
                opacity="0.25"
                rx="4"
              />
              <text
                x={pillar.x + pillar.w / 2}
                y={pillar.y + pillar.h / 2 + 3}
                fill="#64748b"
                fontSize="9"
                textAnchor="middle"
                fontWeight="500"
              >
                {pillar.label}
              </text>
            </g>
          ))}

          {/* Extraction Face (Active Caving Zone) */}
          <rect x="110" y="340" width="180" height="35" fill="url(#activeFaceGrad)" stroke="#f59e0b" strokeDasharray="4,4" rx="4" />
          <text x="200" y="362" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">
            ⚠ ACTIVE DEPILLARING FACE (Goaf Edge)
          </text>

          {/* Escape Pathway (Green glowing line) */}
          <path
            d="M 650,310 L 480,310 L 290,310 L 130,310 L 130,130 L 60,40"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="8,6"
            strokeLinecap="round"
            opacity="0.4"
          />
          <text x="670" y="335" fill="#34d399" fontSize="9" fontWeight="bold">Primary Safe Escape Route ➔</text>

          {/* Node Beacons */}
          {nodes.map((node) => {
            const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
            const isCritical = totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
            const isAdvisory = !isCritical && (totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY);

            let beaconColor = '#10b981'; // green
            let ringColor = 'rgba(16, 185, 129, 0.4)';
            if (isCritical) {
              beaconColor = '#ef4444';
              ringColor = 'rgba(239, 68, 68, 0.6)';
            } else if (isAdvisory) {
              beaconColor = '#f59e0b';
              ringColor = 'rgba(245, 158, 11, 0.5)';
            }

            const isSelected = selectedNodeId === node.id;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer pulsing wave */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCritical ? "24" : "18"}
                  fill={ringColor}
                  className={isCritical ? "animate-ping" : "animate-radar-ping"}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />

                {/* Selection indicator ring */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}

                {/* Main Node Body */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCritical ? "11" : "9"}
                  fill={beaconColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="drop-shadow(0px 0px 8px rgba(0,0,0,0.8))"
                />

                {/* Node ID Tag Pill */}
                <rect
                  x={node.x - 30}
                  y={node.y - 30}
                  width="60"
                  height="16"
                  rx="4"
                  fill="#0f172a"
                  stroke={isSelected ? '#38bdf8' : isCritical ? '#ef4444' : isAdvisory ? '#f59e0b' : '#334155'}
                  strokeWidth="1.2"
                />
                <text
                  x={node.x}
                  y={node.y - 19}
                  fill={isCritical ? '#fca5a5' : isAdvisory ? '#fde68a' : '#e2e8f0'}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.id}
                </text>

                {/* Live Telemetry Value Label Below */}
                <rect
                  x={node.x - 32}
                  y={node.y + 14}
                  width="64"
                  height="14"
                  rx="3"
                  fill="#090d16"
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <text
                  x={node.x}
                  y={node.y + 24}
                  fill={isCritical ? '#ef4444' : isAdvisory ? '#f59e0b' : '#38bdf8'}
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {totalTilt.toFixed(1)}° | {node.crackDisplacement.toFixed(1)}mm
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Click drill-down hint banner */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg pointer-events-none">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>LoRa 868MHz Mesh • 6 Surface/Strata Beacons Online</span>
          </div>
          <div className="text-cyan-400 font-medium">
            💡 Click any Node icon on map to view individual sensor breakdown
          </div>
        </div>

      </div>
    </div>
  );
}
