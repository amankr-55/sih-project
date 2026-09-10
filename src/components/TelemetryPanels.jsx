import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Activity, Wind, AlertCircle } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs font-mono">
        <p className="text-slate-400 font-bold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TelemetryPanels({ historyData, status }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Panel A: Geotechnical Subsidence Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col flex-1 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">
                PANEL A: GEOTECHNICAL TELEMETRY (TILT & CRACK DILATION)
              </h3>
              <p className="text-[10px] text-slate-400">
                MPU6050 Inclinometer Biaxial Vector vs. Linear Potentiometric Crack Gauge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
              Tilt (°)
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span>
              Crack (mm)
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 'dataMax + 1']} />
              <Tooltip content={<CustomTooltip />} />

              {/* DGMS Threshold Reference Lines */}
              <ReferenceLine 
                y={DGMS_THRESHOLDS.TILT_ADVISORY} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                label={{ value: 'Tilt Advisory (2.5°)', fill: '#f59e0b', fontSize: 9, position: 'right' }} 
              />
              <ReferenceLine 
                y={DGMS_THRESHOLDS.TILT_CRITICAL} 
                stroke="#ef4444" 
                strokeDasharray="4 4" 
                label={{ value: 'Critical Evac (5.0°)', fill: '#ef4444', fontSize: 9, position: 'right' }} 
              />

              <Line
                type="monotone"
                dataKey="tilt"
                name="Tilt Angle (°)"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="crack"
                name="Crack Width (mm)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Panel B: Atmospheric Gas Levels */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col flex-1 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">
                PANEL B: ATMOSPHERIC HAZARDS (METHANE CH4 & CARBON MONOXIDE CO)
              </h3>
              <p className="text-[10px] text-slate-400">
                Strata Fracture Gas Release • Automatic Electrical Power Trip Interlock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
              CH4 (% vol)
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-2.5 h-0.5 bg-purple-400 inline-block"></span>
              CO (ppm)
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />

              {/* Thresholds */}
              <ReferenceLine 
                y={DGMS_THRESHOLDS.CH4_POWER_TRIP} 
                stroke="#dc2626" 
                strokeDasharray="4 4" 
                label={{ value: 'CH4 Trip (1.25%)', fill: '#dc2626', fontSize: 9, position: 'right' }} 
              />

              <Line
                type="monotone"
                dataKey="ch4"
                name="CH4 Methane (%)"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="co"
                name="CO (ppm)"
                stroke="#c084fc"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
