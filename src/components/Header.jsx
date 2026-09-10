import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Radio, 
  Volume2, 
  VolumeX, 
  FileDown, 
  Activity,
  Layers,
  Clock,
  Sparkles,
  LogOut,
  UserCheck
} from 'lucide-react';

export default function Header({ 
  cmsi, 
  status, 
  activeMiners, 
  isSirenActive, 
  onToggleSiren, 
  onExportReport,
  currentShift,
  onChangeShift,
  currentUser,
  onLogout
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cmsi / 100) * circumference;

  let cmsiColor = '#10b981'; // green
  let statusBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let statusText = 'SAFE & STABLE';

  if (status === 'critical') {
    cmsiColor = '#ef4444'; // red
    statusBadgeBg = 'bg-red-500/25 text-red-300 border-red-500/60 animate-pulse';
    statusText = 'CRITICAL DANGER';
  } else if (status === 'advisory') {
    cmsiColor = '#f59e0b'; // yellow
    statusBadgeBg = 'bg-amber-500/25 text-amber-300 border-amber-500/50';
    statusText = 'ADVISORY WARNING';
  }

  return (
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
        
        {/* Left: Brand & Green ThinkerX Badge */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`p-3 rounded-2xl border ${
              status === 'critical' 
                ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse' 
                : 'bg-slate-900 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}>
              <Layers className="w-8 h-8" />
            </div>
            {status === 'critical' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl font-black tracking-wider text-white flex items-center gap-1.5">
                GEO<span className="text-cyan-400">SENTINEL</span>
              </h1>
              
              {/* Green ThinkerX Brand Badge */}
              <span className="px-2.5 py-0.5 text-xs font-black bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.5)] tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> GREEN THINKERX
              </span>

              <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-purple-300 border border-purple-500/40 rounded-lg">
                SIH26025
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium flex items-center gap-2 mt-0.5">
              <span>AI Mine Subsidence Early Warning System</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono font-bold tracking-wide">DGMS COMPLIANT</span>
            </p>
          </div>
        </div>

        {/* Center: Big Bold CMSI Radial Gauge */}
        <div className="flex items-center gap-5 bg-slate-900/90 border border-slate-700/80 px-5 py-2.5 rounded-2xl shadow-xl">
          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#1e293b"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={cmsiColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white leading-none font-mono">
                {cmsi}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                INDEX
              </span>
            </div>
          </div>

          <div className="text-left">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-300">
              Mine Safety Health Index
            </div>
            <div className={`text-sm font-black px-3 py-1 rounded-lg border inline-block mt-1 ${statusBadgeBg}`}>
              {statusText}
            </div>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Manpower */}
          <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-xl">
            <Users className="w-5 h-5 text-cyan-400" />
            <div className="text-left leading-tight">
              <div className="text-sm font-black text-white font-mono">{activeMiners} Miners</div>
              <div className="text-[10px] text-slate-400 font-bold">Underground</div>
            </div>
          </div>

          {/* Shift selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-xl text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <select 
              value={currentShift} 
              onChange={(e) => onChangeShift(e.target.value)}
              className="bg-transparent text-slate-100 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="Shift-A" className="bg-slate-900 text-white">Shift A (06:00 - 14:00)</option>
              <option value="Shift-B" className="bg-slate-900 text-white">Shift B (14:00 - 22:00)</option>
              <option value="Shift-C" className="bg-slate-900 text-white">Shift C (22:00 - 06:00)</option>
            </select>
          </div>

          {/* Emergency Siren Actuator Button */}
          <button
            onClick={onToggleSiren}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg cursor-pointer ${
              isSirenActive
                ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce shadow-red-600/50'
                : status === 'critical'
                ? 'bg-red-700 text-white animate-pulse border border-red-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
            }`}
          >
            {isSirenActive ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                <span>MUTE SIREN</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-red-400" />
                <span>TEST SIREN</span>
              </>
            )}
          </button>

          {/* Export DGMS Report Button */}
          <button
            onClick={onExportReport}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-cyan-900/40 shadow-xl cursor-pointer transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span>DGMS REPORT (PDF)</span>
          </button>

          {/* User Profile & Sign-Out */}
          {currentUser && (
            <div className="flex items-center gap-2.5 bg-slate-900/95 border-2 border-slate-700/90 pl-3 pr-2 py-1.5 rounded-2xl shadow-lg">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                currentUser.role === 'admin' 
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                  : 'bg-cyan-700 text-white'
              }`}>
                {currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <span>{currentUser.name || currentUser.email.split('@')[0]}</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/60 px-1.5 py-0.2 rounded font-black">
                      👑 OWNER
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {currentUser.role === 'admin' ? 'Master Admin (Aman Kumar)' : 'Mine Inspector'}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Logout from portal"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/60 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
