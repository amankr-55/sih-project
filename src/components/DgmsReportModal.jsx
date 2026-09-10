import React from 'react';
import { X, FileDown, CheckCircle2, AlertTriangle, ShieldCheck, Printer } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function DgmsReportModal({ 
  isOpen, 
  onClose, 
  nodes, 
  cmsi, 
  status, 
  activeMiners, 
  shiftName, 
  onDownloadPdf 
}) {
  if (!isOpen) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-950 text-blue-400 border border-blue-500/30 rounded-xl">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                DGMS Statutory Shift Safety Audit Exporter
              </h3>
              <p className="text-xs text-slate-400">
                Format complies with DGMS Circular No. 04 of 2021 & CMR 2017
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Printable Sheet Preview */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-950/50">
          
          {/* Official Letterhead Header Preview */}
          <div className="bg-white text-slate-900 p-6 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center border-b border-slate-300 pb-3 mb-4">
              <h2 className="text-base font-black tracking-wider text-slate-900">
                DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
              </h2>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                STRATA CONTROL & MINE SUBSIDENCE REAL-TIME COMPLIANCE AUDIT
              </p>
              <p className="text-[10px] text-slate-500 italic">
                Statutory Record under Coal Mines Regulations (CMR) 2017 - Regulation 111 & 112
              </p>
            </div>

            {/* Mine details grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
              <div>
                <p><strong>Colliery / Mine:</strong> SECL - Rajgamar Colliery (Korba)</p>
                <p><strong>Underground Seam:</strong> Seam #3 (Bituminous Horizon)</p>
                <p><strong>Working Panel:</strong> Panel 3-A Overburden Influence Zone</p>
              </div>
              <div>
                <p><strong>Audit Date:</strong> {dateStr} | {timeStr}</p>
                <p><strong>Working Shift:</strong> {shiftName}</p>
                <p><strong>Active Personnel:</strong> {activeMiners} Miners Underground</p>
              </div>
            </div>

            {/* Safety Index Summary Box */}
            <div className={`p-3 rounded-lg text-center font-bold text-xs mb-4 text-white ${
              status === 'critical' ? 'bg-red-600' : status === 'advisory' ? 'bg-amber-600' : 'bg-emerald-600'
            }`}>
              COMPOSITE MINE SAFETY INDEX (CMSI): {cmsi} / 100 — {
                status === 'critical' ? 'CRITICAL EVACUATION THRESHOLD BREACHED' :
                status === 'advisory' ? 'ADVISORY ANOMALOUS STRATA DRIFT' :
                'ALL STRATA PARAMETERS WITHIN STATUTORY DGMS LIMITS'
              }
            </div>

            {/* Table preview */}
            <table className="w-full text-[11px] text-left border-collapse border border-slate-300 mb-4">
              <thead>
                <tr className="bg-slate-800 text-white text-center">
                  <th className="border border-slate-300 p-1.5">Node ID</th>
                  <th className="border border-slate-300 p-1.5">Gallery Location</th>
                  <th className="border border-slate-300 p-1.5">Biaxial Tilt</th>
                  <th className="border border-slate-300 p-1.5">Crack (mm)</th>
                  <th className="border border-slate-300 p-1.5">CH4 (%)</th>
                  <th className="border border-slate-300 p-1.5">LoRa Bat</th>
                  <th className="border border-slate-300 p-1.5">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(node => {
                  const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
                  const isCrit = totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
                  const isAdv = !isCrit && (totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY);

                  return (
                    <tr key={node.id} className="border-b border-slate-200 text-center">
                      <td className="border border-slate-300 p-1 font-mono font-bold">{node.id}</td>
                      <td className="border border-slate-300 p-1 text-left">{node.name}</td>
                      <td className="border border-slate-300 p-1 font-mono">{totalTilt.toFixed(2)}°</td>
                      <td className="border border-slate-300 p-1 font-mono">{node.crackDisplacement.toFixed(2)} mm</td>
                      <td className="border border-slate-300 p-1 font-mono">{node.ch4.toFixed(2)}%</td>
                      <td className="border border-slate-300 p-1 font-mono">{node.battery}%</td>
                      <td className={`border border-slate-300 p-1 font-bold ${
                        isCrit ? 'text-red-600' : isAdv ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {isCrit ? 'CRITICAL' : isAdv ? 'ADVISORY' : 'COMPLIANT'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-[10px] text-slate-700 font-bold border-t border-slate-300">
              <div>
                <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                <span>Mine Safety Officer</span>
              </div>
              <div>
                <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                <span>Strata Control Engineer</span>
              </div>
              <div>
                <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                <span>Colliery Manager / Agent</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 px-6 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Digital signature timestamp ready for export</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onDownloadPdf();
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Signed Official PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
