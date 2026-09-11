import React from 'react';

/**
 * Pure CSS High-Contrast Command Center Ambient Background.
 * Free of GPU canvas loops or opacity overlays, guaranteeing
 * 100% crisp text readability and crystal-clear image viewing.
 */
export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none bg-[#090f1f]">
      {/* Top subtle ambient command lighting aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-cyan-500/12 via-blue-600/8 to-transparent blur-3xl rounded-full" />
      
      {/* Subtle deep blue radial wash in center */}
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[400px] bg-blue-500/5 blur-3xl rounded-full" />
      
      {/* High-tech geological coordinate grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{
          backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #38bdf8 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Subtle vignette border at screen edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(5,9,18,0.7)_100%)]" />
    </div>
  );
}
