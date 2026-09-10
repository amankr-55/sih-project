import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Terminal, CheckCircle2, History } from 'lucide-react';

export default function EventLog({ events }) {
  const [filter, setFilter] = useState('all');

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    return e.severity === filter;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">
              IMMUTABLE EVENT AUDIT LOG
            </h3>
            <p className="text-[10px] text-slate-400">
              Chronological Strata Records • DGMS Rule 112 Compliance Ledger
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('advisory')}
            className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
              filter === 'advisory' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Advisories
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
              filter === 'critical' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-red-400'
            }`}
          >
            Critical
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto max-h-52 space-y-2 pr-1 font-mono text-xs">
        {filteredEvents.map(evt => {
          let severityBadge = (
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
              SAFE
            </span>
          );
          if (evt.severity === 'critical') {
            severityBadge = (
              <span className="bg-red-950 text-red-400 border border-red-500/50 px-1.5 py-0.5 rounded text-[9px] font-bold animate-pulse">
                CRITICAL
              </span>
            );
          } else if (evt.severity === 'advisory') {
            severityBadge = (
              <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                ADVISORY
              </span>
            );
          }

          return (
            <div 
              key={evt.id} 
              className={`p-2 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
                evt.severity === 'critical'
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : evt.severity === 'advisory'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px] whitespace-nowrap">{evt.time}</span>
                {severityBadge}
                <span className="text-cyan-400 font-bold text-[11px]">[{evt.nodeId}]</span>
                <span className="text-xs">{evt.message}</span>
              </div>
              <div className="text-[10px] text-slate-500 whitespace-nowrap self-end sm:self-auto">
                Sig: {evt.signature}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
