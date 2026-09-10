import React, { useState } from 'react';
import { Camera, Eye, CloudFog, Thermometer, ShieldAlert, RefreshCw, Layers, CheckCircle2, Image as ImageIcon, Download, Flashlight } from 'lucide-react';

export default function CameraSection() {
  const [activeViewMode, setActiveViewMode] = useState('fog'); // 'fog', 'thermal', 'hardware'
  const [isFlashing, setIsFlashing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([
    {
      id: 'SNAP-901',
      title: 'Active Face 3-A Strata Fissure',
      time: '10:22:15 PM',
      type: 'Thermal FLIR',
      image: '/images/thermal_crack.jpg',
      status: 'Advisory Heat Leakage'
    },
    {
      id: 'SNAP-902',
      title: 'Haulage Roadway (0% Visibility Fog)',
      time: '10:24:40 PM',
      type: 'AI Wireframe De-Fog',
      image: '/images/fog_camera.jpg',
      status: 'Path Cleared via AI'
    },
    {
      id: 'SNAP-903',
      title: 'Pillar 14-B Sensor Node Anchor',
      time: '10:27:02 PM',
      type: 'Optical Inspection',
      image: '/images/sensor_node.jpg',
      status: 'Anchor Stable'
    }
  ]);

  function handleCaptureSnapshot() {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newPhoto = {
        id: `SNAP-${Date.now().toString().slice(-4)}`,
        title: activeViewMode === 'thermal' 
          ? 'Thermal Infrared Strata Fissure' 
          : activeViewMode === 'hardware' 
          ? 'Subterranean Sensor Mount Close-Up' 
          : 'Underground Fog-Penetration AI Feed',
        time: timeStr,
        type: activeViewMode === 'thermal' ? 'Thermal FLIR' : activeViewMode === 'hardware' ? 'Optical Anchor' : 'AI De-Fog AR',
        image: activeViewMode === 'thermal' ? '/images/thermal_crack.jpg' : activeViewMode === 'hardware' ? '/images/sensor_node.jpg' : '/images/fog_camera.jpg',
        status: 'Situation Logged'
      };

      setCapturedPhotos(prev => [newPhoto, ...prev.slice(0, 5)]);
    }, 400);
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Shutter camera flash effect */}
      {isFlashing && (
        <div className="fixed inset-0 bg-white/80 z-50 pointer-events-none transition-opacity duration-300 animate-fade-out" />
      )}

      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Camera className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
              MINE AREA SURVEILLANCE & FOG-PENETRATION PHOTOS
              <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-3 py-1 rounded-full font-mono font-bold">
                REAL-TIME SITUATION RECON
              </span>
            </h2>
            <p className="text-sm text-slate-300">
              Live automated area photography, thermal heat cameras, and AI wireframe vision through dense coal fog
            </p>
          </div>
        </div>

        {/* Capture Snapshot Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xl shadow-orange-600/30 transition-all cursor-pointer transform hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            <span>Take Area Photo (Snap Now)</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveViewMode('fog')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeViewMode === 'fog' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CloudFog className="w-4 h-4" />
          <span>1. AI Fog-Penetration Camera</span>
        </button>

        <button
          onClick={() => setActiveViewMode('thermal')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeViewMode === 'thermal' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>2. Thermal Infrared Fissure Feed</span>
        </button>

        <button
          onClick={() => setActiveViewMode('hardware')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeViewMode === 'hardware' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>3. Physical Node Anchor View</span>
        </button>
      </div>

      {/* Main Viewport */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-black text-white flex items-center gap-2 font-mono">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse inline-block" />
            {activeViewMode === 'fog' ? 'LIVE FEED: MINE-CAM 08 (HAULAGE ROADWAY — AI DE-FOG & DUST WIREFRAME)' :
             activeViewMode === 'thermal' ? 'LIVE FEED: MINE-CAM 01 (SEAM 3-A STRATA THERMAL INFRARED)' :
             'LIVE FEED: MINE-CAM 03 (PHYSICAL HARDWARE ANCHOR ON ROCK FACE)'}
          </span>
          <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            Resolution: 1080p 60FPS • Subterranean Fiber/LoRa
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black min-h-[420px] flex items-center justify-center">
          <img
            src={
              activeViewMode === 'fog' ? '/images/fog_camera.jpg' :
              activeViewMode === 'thermal' ? '/images/thermal_crack.jpg' :
              '/images/sensor_node.jpg'
            }
            alt="Mine Surveillance Feed"
            className="w-full h-full object-cover max-h-[500px]"
          />

          {/* On-Screen HUD Overlay */}
          <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md border border-white/20 p-3.5 rounded-xl text-xs font-mono text-white space-y-1">
            <div className="text-cyan-400 font-bold text-sm">SURVEILLANCE HUD ACTIVE</div>
            <div>STATUS: <strong className="text-emerald-400">NORMAL STREAMING</strong></div>
            <div>VISIBILITY THROUGH FOG: <strong className="text-amber-300">RESTORED TO 45 METRES</strong></div>
            <div>LOCATION: <strong className="text-slate-200">SECL Korba Colliery • Panel 3-A</strong></div>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>AI Situational Recognition: PATHWAY SECURED</span>
          </div>
        </div>
      </div>

      {/* Recent Surveillance Area Photos Gallery */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            Recent Area Photos & Incident Snapshot Ledger
          </h3>
          <span className="text-xs text-slate-400 font-mono">Total Stored: {capturedPhotos.length} Frames</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capturedPhotos.map((photo) => (
            <div key={photo.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group hover:border-cyan-500/60 transition-all">
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={photo.image} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/80 font-mono font-bold text-[11px] text-cyan-400 px-2.5 py-1 rounded-lg">
                  {photo.id}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-slate-900/80 font-mono text-[10px] text-slate-300 px-2 py-0.5 rounded">
                  {photo.time}
                </span>
              </div>
              <div className="p-3.5 space-y-1">
                <h4 className="text-sm font-bold text-white leading-tight">{photo.title}</h4>
                <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                  <span>Type: <strong className="text-cyan-300">{photo.type}</strong></span>
                  <span className="text-emerald-400 font-bold">{photo.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
