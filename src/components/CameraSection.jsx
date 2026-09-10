import React, { useState } from 'react';
import { Camera, Eye, CloudFog, Thermometer, ShieldAlert, RefreshCw, Layers, CheckCircle2, Image as ImageIcon, Download, Flashlight, Activity, Waves, Droplet, AlertTriangle } from 'lucide-react';

export default function CameraSection() {
  const [activeViewMode, setActiveViewMode] = useState('extensometer'); // 'extensometer', 'road', 'sump', 'seismic', 'fog', 'thermal'
  const [isFlashing, setIsFlashing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([
    {
      id: 'GEO-EXT-101',
      title: 'Underground Rock Rib Extensometer Sensor',
      time: '11:15:32 PM',
      type: 'Physical Hardware Macro',
      image: './images/real_mine_crack.jpg',
      status: 'Caliper Dilation Normal (0.24mm)'
    },
    {
      id: 'GEO-SURF-102',
      title: 'Surface Overburden Subsidence Depression Road Trough',
      time: '11:18:45 PM',
      type: 'Surface Hazard Recon',
      image: './images/road_subsidence.jpg',
      status: 'Warning Cordon Deployed'
    },
    {
      id: 'GEO-SUMP-103',
      title: 'Subterranean Drainage Sump & Dewatering Pumps',
      time: '11:20:10 PM',
      type: 'Hydraulic Surveillance',
      image: './images/mine_water_sump.jpg',
      status: 'Water Level 4.2m (Normal)'
    },
    {
      id: 'GEO-SEIS-104',
      title: '3D Seismic Wave Propagation & Spectral Density',
      time: '11:22:04 PM',
      type: 'Geophone Micro-Seismic',
      image: './images/seismic_vibration.jpg',
      status: 'Energy Signature 0.08 mm/s'
    },
    {
      id: 'GEO-FOG-105',
      title: 'Haulage Roadway (AI De-Fog Wireframe)',
      time: '11:24:40 PM',
      type: 'AI Computer Vision',
      image: './images/fog_camera.jpg',
      status: '45m Penetration Secured'
    },
    {
      id: 'GEO-FLIR-106',
      title: 'Active Working Face 3-A FLIR Thermal Heat',
      time: '11:26:15 PM',
      type: 'Thermal Infrared',
      image: './images/thermal_crack.jpg',
      status: 'Heat Gradient Normal'
    }
  ]);

  const viewModes = [
    { id: 'extensometer', label: '1. Mine Rib Extensometer Photo', img: './images/real_mine_crack.jpg', icon: Camera, location: 'Seam 3-A Longwall Face Rib', desc: 'High-tensile rock anchor bolt and digital linear potentiometer tracking micro-crack shear.' },
    { id: 'road', label: '2. Surface Road Subsidence Trough', img: './images/road_subsidence.jpg', icon: AlertTriangle, location: 'Overburden Surface Sector-B (Chainage 14+200)', desc: 'Asphalt surface tensile fracture trough caused by subterranean longwall roof extraction.' },
    { id: 'sump', label: '3. Drainage Sump & Dewatering', img: './images/mine_water_sump.jpg', icon: Droplet, location: 'Shaft 2 Bottom Water Collection Sump', desc: 'Heavy-duty submersible dewatering pumps and continuous staff gauge monitoring ingress.' },
    { id: 'seismic', label: '4. 3D Micro-Seismic Wavefield', img: './images/seismic_vibration.jpg', icon: Waves, location: 'Strata Acoustic Geophone Array', desc: '3D wave propagation velocity and frequency spectrogram tracking rock burst precursors.' },
    { id: 'fog', label: '5. AI Fog-Penetration Camera', img: './images/fog_camera.jpg', icon: CloudFog, location: 'Haulage Roadway Gallery 4', desc: 'Dual-spectrum computer vision wireframing mine roadway through zero-visibility dust fog.' },
    { id: 'thermal', label: '6. FLIR Thermal Infrared Heat', img: './images/thermal_crack.jpg', icon: Thermometer, location: 'Ventilation Return Face 3', desc: 'Calibrated radiometric FLIR thermal imaging detecting latent strata heat and spontaneous combustion.' },
  ];

  const currentModeObj = viewModes.find(m => m.id === activeViewMode) || viewModes[0];

  function handleCaptureSnapshot() {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newPhoto = {
        id: `SNAP-${Date.now().toString().slice(-4)}`,
        title: currentModeObj.label.replace(/^\d+\.\s*/, ''),
        time: timeStr,
        type: 'On-Demand Field Telemetry',
        image: currentModeObj.img,
        status: 'Real-Time Verification Logged'
      };

      setCapturedPhotos(prev => [newPhoto, ...prev.slice(0, 7)]);
    }, 400);
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Shutter camera flash effect */}
      {isFlashing && (
        <div className="fixed inset-0 bg-white/90 z-50 pointer-events-none transition-opacity duration-300 animate-fade-out" />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-2 border-cyan-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-950/80 text-cyan-300 border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Camera className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
              MINE AREA SURVEILLANCE & FIELD ENGINEERING RECON
              <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-500/50 px-3 py-1 rounded-full font-mono font-bold">
                REAL-TIME PHOTOGRAPHIC PROOF
              </span>
            </h2>
            <p className="text-sm font-semibold text-slate-200">
              Live automated area photography, high-resolution optical calipers, thermal heat FLIR, and surface road subsidence trough surveillance.
            </p>
          </div>
        </div>

        {/* Capture Snapshot Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xl shadow-orange-600/40 transition-all cursor-pointer transform hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            <span>Take Area Photo (Snap Now)</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/90 p-2.5 rounded-2xl border-2 border-slate-700 w-full shadow-xl">
        {viewModes.map(m => {
          const Icon = m.icon;
          const isActive = activeViewMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveViewMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40' 
                  : 'bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Viewport */}
      <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <span className="text-base font-black text-white flex items-center gap-2.5 font-mono">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse inline-block shadow-[0_0_10px_#ef4444]" />
            <span>FEED ACTIVE: {currentModeObj.location}</span>
          </span>
          <span className="text-xs font-mono font-black text-cyan-300 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-700">
            Field Resolution: High-Definition Sensor Stream • Synchronized Real-Time
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black min-h-[440px] flex items-center justify-center group">
          <img
            src={currentModeObj.img}
            alt={currentModeObj.label}
            className="w-full h-full object-cover max-h-[520px] transition-transform duration-700 group-hover:scale-105"
          />

          {/* On-Screen HUD Overlay */}
          <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-xs font-mono text-white space-y-1.5 shadow-2xl max-w-sm">
            <div className="text-cyan-300 font-black text-sm tracking-wider">GEOSENTINEL FIELD TELEMETRY HUD</div>
            <div className="text-slate-200">STATION: <strong className="text-white font-bold">{currentModeObj.location}</strong></div>
            <div className="text-slate-200">DESCRIPTION: <strong className="text-amber-300 font-bold">{currentModeObj.desc}</strong></div>
            <div className="text-emerald-300 font-bold flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SENSOR SYNCHRONIZATION 100%</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs font-mono text-emerald-300 font-bold flex items-center gap-2 shadow-2xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>AI Situational Recognition: NORMAL PATROL ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Recent Surveillance Area Photos Gallery */}
      <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-cyan-400" />
            <span>Field Surveillance Photographic Ledger & Incident Archive</span>
          </h3>
          <span className="text-xs text-slate-200 font-mono font-bold bg-slate-950 px-3 py-1 rounded-lg border border-slate-700">
            Total Stored: {capturedPhotos.length} Frames
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capturedPhotos.map((photo) => (
            <div key={photo.id} className="bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden group hover:border-cyan-400 transition-all shadow-xl flex flex-col">
              <div className="relative h-48 overflow-hidden bg-black">
                <img 
                  src={photo.image} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/85 font-mono font-black text-xs text-cyan-300 px-2.5 py-1 rounded-lg shadow-lg">
                  {photo.id}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-slate-900/90 font-mono font-bold text-[11px] text-slate-200 px-2.5 py-1 rounded-lg shadow-lg">
                  {photo.time}
                </span>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <h4 className="text-sm font-black text-white leading-snug">{photo.title}</h4>
                <div className="flex justify-between text-xs font-mono pt-2 border-t border-slate-800 text-slate-300 font-bold">
                  <span>Type: <strong className="text-cyan-300">{photo.type}</strong></span>
                  <span className="text-emerald-300">{photo.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
