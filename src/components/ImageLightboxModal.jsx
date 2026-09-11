import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, Download, Maximize2, ShieldCheck, MapPin } from 'lucide-react';

export default function ImageLightboxModal({ isOpen, onClose, imageSrc, title, subtitle, location, badge }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full bg-slate-900 border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-snug flex items-center gap-2">
                <span>{title || 'High-Resolution Photographic Reconnaissance'}</span>
                {badge && (
                  <span className="text-xs bg-cyan-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase">
                    {badge}
                  </span>
                )}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-200 font-medium mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={imageSrc} 
              download 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Open full resolution in new tab"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 transition-all cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Image Area - 100% Unobstructed Full Clarity */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-auto min-h-[350px] max-h-[70vh] p-2 sm:p-4">
          <img 
            src={imageSrc} 
            alt={title || 'Mine Safety Reconnaissance'} 
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl brightness-105 contrast-105"
          />
        </div>

        {/* Modal Bottom Metadata Strip */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-200">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Station Location: <strong className="text-white font-bold">{location || 'Subterranean Sector'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>DGMS High-Fidelity Geological Record Verified</span>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
