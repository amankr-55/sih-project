import React, { useState } from 'react';
import { 
  Camera, 
  Eye, 
  CloudFog, 
  Thermometer, 
  ShieldAlert, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Image as ImageIcon, 
  Download, 
  Flashlight, 
  Activity, 
  Waves, 
  Droplet, 
  AlertTriangle,
  Maximize2,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';
import ImageLightboxModal from './ImageLightboxModal';

export default function CameraSection() {
  const [activeViewMode, setActiveViewMode] = useState('extensometer');
  const [isFlashing, setIsFlashing] = useState(false);
  const [lightboxData, setLightboxData] = useState(null);

  const [capturedPhotos, setCapturedPhotos] = useState([
    {
      id: 'GEO-EXT-101',
      title: 'Underground Rock Rib Extensometer Sensor',
      time: '11:15:32 PM',
      type: 'Physical Hardware Macro',
      image: getAssetUrl('images/real_mine_crack.jpg'),
      location: 'Seam 3-A Longwall Face Rib',
      status: 'Caliper Dilation Normal (0.24mm)'
    },
    {
      id: 'GEO-SURF-102',
      title: 'Surface Overburden Subsidence Depression Road Trough',
      time: '11:18:45 PM',
      type: 'Surface Hazard Recon',
      image: getAssetUrl('images/road_subsidence.jpg'),
      location: 'Overburden Surface Sector-B (Chainage 14+200)',
      status: 'Warning Cordon Deployed'
    },
    {
      id: 'GEO-SUMP-103',
      title: 'Subterranean Drainage Sump & Dewatering Pumps',
      time: '11:20:10 PM',
      type: 'Hydraulic Surveillance',
      image: getAssetUrl('images/mine_water_sump.jpg'),
      location: 'Shaft 2 Bottom Water Collection Sump',
      status: 'Water Level 4.2m (Normal)'
    },
    {
      id: 'GEO-SEIS-104',
      title: '3D Seismic Wave Propagation & Spectral Density',
      time: '11:22:04 PM',
      type: 'Geophone Micro-Seismic',
      image: getAssetUrl('images/seismic_vibration.jpg'),
      location: 'Strata Acoustic Geophone Array',
      status: 'Energy Signature 0.08 mm/s'
    },
    {
      id: 'GEO-FOG-105',
      title: 'Haulage Roadway (AI De-Fog Wireframe)',
      time: '11:24:40 PM',
      type: 'AI Computer Vision',
      image: getAssetUrl('images/fog_camera.jpg'),
      location: 'Haulage Roadway Gallery 4',
      status: '45m Penetration Secured'
    },
    {
      id: 'GEO-FLIR-106',
      title: 'Active Working Face 3-A FLIR Thermal Heat',
      time: '11:26:15 PM',
      type: 'Thermal Infrared',
      image: getAssetUrl('images/thermal_crack.jpg'),
      location: 'Ventilation Return Face 3',
      status: 'Heat Gradient Normal'
    }
  ]);

  const viewModes = [
    { 
      id: 'extensometer', 
      label: '1. Mine Rib Extensometer Photo', 
      img: getAssetUrl('images/real_mine_crack.jpg'), 
      icon: Camera, 
      location: 'Seam 3-A Longwall Face Rib', 
      desc: 'High-tensile rock anchor bolt and digital linear potentiometer tracking micro-crack shear.' 
    },
    { 
      id: 'road', 
      label: '2. Surface Road Subsidence Trough', 
      img: getAssetUrl('images/road_subsidence.jpg'), 
      icon: AlertTriangle, 
      location: 'Overburden Surface Sector-B (Chainage 14+200)', 
      desc: 'Asphalt surface tensile fracture trough caused by subterranean longwall roof extraction.' 
    },
    { 
      id: 'sump', 
      label: '3. Drainage Sump & Dewatering', 
      img: getAssetUrl('images/mine_water_sump.jpg'), 
      icon: Droplet, 
      location: 'Shaft 2 Bottom Water Collection Sump', 
      desc: 'Heavy-duty submersible dewatering pumps and continuous staff gauge monitoring ingress.' 
    },
    { 
      id: 'seismic', 
      label: '4. 3D Micro-Seismic Wavefield', 
      img: getAssetUrl('images/seismic_vibration.jpg'), 
      icon: Waves, 
      location: 'Strata Acoustic Geophone Array', 
      desc: '3D wave propagation velocity and frequency spectrogram tracking rock burst precursors.' 
    },
    { 
      id: 'fog', 
      label: '5. AI Fog-Penetration Camera', 
      img: getAssetUrl('images/fog_camera.jpg'), 
      icon: CloudFog, 
      location: 'Haulage Roadway Gallery 4', 
      desc: 'Dual-spectrum computer vision wireframing mine roadway through zero-visibility dust fog.' 
    },
    { 
      id: 'thermal', 
      label: '6. FLIR Thermal Infrared Heat', 
      img: getAssetUrl('images/thermal_crack.jpg'), 
      icon: Thermometer, 
      location: 'Ventilation Return Face 3', 
      desc: 'Calibrated radiometric FLIR thermal imaging detecting latent strata heat and spontaneous combustion.' 
    },
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
        location: currentModeObj.location,
        status: 'Real-Time Verification Logged'
      };

      setCapturedPhotos(prev => [newPhoto, ...prev.slice(0, 7)]);
    }, 400);
  }

  return (
    <div className="space-y-6 animate-fade-in relative text-white">
      
      {/* Lightbox Modal for 100% Unobstructed Full Screen View */}
      {lightboxData && (
        <ImageLightboxModal 
          isOpen={!!lightboxData}
          onClose={() => setLightboxData(null)}
          imageSrc={lightboxData.image}
          title={lightboxData.title}
          subtitle={lightboxData.desc}
          location={lightboxData.location}
          badge={lightboxData.badge}
        />
      )}

      {/* Shutter camera flash effect */}
      {isFlashing && (
        <div className="fixed inset-0 bg-white/90 z-50 pointer-events-none transition-opacity duration-300 animate-fade-out" />
      )}

      {/* Header Banner - High Contrast */}
      <div className="bg-[#152238] border-2 border-cyan-500/50 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Camera className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>MINE AREA SURVEILLANCE & FIELD ENGINEERING RECON</span>
              <span className="text-xs bg-cyan-500 text-slate-950 font-black px-3.5 py-1 rounded-full font-mono uppercase">
                REAL-TIME PHOTOGRAPHIC PROOF
              </span>
            </h2>
            <p className="text-base text-slate-100 font-bold mt-1">
              Live automated area photography, high-resolution optical calipers, thermal heat FLIR, and surface road subsidence trough surveillance.
            </p>
          </div>
        </div>

        {/* Capture Snapshot Button */}
        <div className="flex items-center gap-3 shrink-0">
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
      <div className="flex flex-wrap items-center gap-2.5 bg-[#0f192b] p-3 rounded-2xl border-2 border-slate-700 w-full shadow-xl">
        {viewModes.map(m => {
          const Icon = m.icon;
          const isActive = activeViewMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveViewMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 scale-102' 
                  : 'bg-[#152238] text-slate-100 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Viewport Card - Clean, Unobstructed Image Presentation */}
      <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Top Viewport Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-700/80">
          <div className="flex items-center gap-3 font-mono">
            <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse inline-block shadow-[0_0_12px_#ef4444]" />
            <span className="text-base sm:text-lg font-black text-white">
              LIVE OPTICAL FEED: <strong className="text-cyan-400">{currentModeObj.location}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLightboxData({
                image: currentModeObj.img,
                title: currentModeObj.label.replace(/^\d+\.\s*/, ''),
                desc: currentModeObj.desc,
                location: currentModeObj.location,
                badge: 'FULL-HD FEED'
              })}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>View Fullscreen (100% Zoom)</span>
            </button>
            <span className="text-xs font-mono font-black text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-500/50">
              SYNCHRONIZED REAL-TIME
            </span>
          </div>
        </div>

        {/* The Image Viewport - FULL VISIBILITY with ZERO dark overlays covering it */}
        <div 
          className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-black min-h-[440px] flex items-center justify-center group cursor-pointer shadow-2xl"
          onClick={() => setLightboxData({
            image: currentModeObj.img,
            title: currentModeObj.label.replace(/^\d+\.\s*/, ''),
            desc: currentModeObj.desc,
            location: currentModeObj.location,
            badge: 'HD SURVEILLANCE'
          })}
        >
          <img
            src={currentModeObj.img}
            alt={currentModeObj.label}
            className="w-full h-auto max-h-[540px] object-cover transition-transform duration-700 group-hover:scale-103 brightness-105 contrast-105"
          />

          {/* Minimal non-intrusive corner click hint */}
          <div className="absolute top-4 right-4 bg-black/75 backdrop-blur px-3 py-1.5 rounded-xl border border-white/30 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to Enlarge</span>
          </div>
        </div>

        {/* Dedicated High-Contrast Telemetry Strip directly BELOW the image */}
        <div className="bg-[#0f192b] border-2 border-slate-700/80 rounded-2xl p-5 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-wider block">
              SURVEILLANCE SECTOR
            </span>
            <p className="text-base font-black text-white">{currentModeObj.location}</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider block">
              INSTRUMENTATION DETAILS
            </span>
            <p className="text-sm font-bold text-slate-100 leading-relaxed">{currentModeObj.desc}</p>
          </div>
        </div>

      </div>

      {/* Photographic Ledger & Incident Archive Gallery */}
      <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-cyan-400" />
            <span>Field Surveillance Photographic Ledger & Incident Archive</span>
          </h3>
          <span className="text-xs text-white font-mono font-black bg-[#0f192b] px-4 py-1.5 rounded-xl border border-slate-700">
            Stored Frames: {capturedPhotos.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capturedPhotos.map((photo) => (
            <div 
              key={photo.id} 
              onClick={() => setLightboxData({
                image: photo.image,
                title: photo.title,
                desc: photo.status,
                location: photo.location || 'Subterranean Working Seam',
                badge: photo.id
              })}
              className="bg-[#0f192b] border-2 border-slate-700/90 rounded-2xl overflow-hidden group hover:border-cyan-400 transition-all shadow-xl flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden bg-black">
                <img 
                  src={photo.image} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-105 contrast-105"
                />
                <span className="absolute top-3 left-3 bg-black/85 font-mono font-black text-xs text-cyan-300 px-3 py-1 rounded-lg shadow-lg border border-cyan-500/40">
                  {photo.id}
                </span>
                <span className="absolute top-3 right-3 bg-black/85 font-mono font-bold text-xs text-slate-200 px-2.5 py-1 rounded-lg shadow-lg border border-slate-700">
                  {photo.time}
                </span>
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-cyan-400 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Click to Enlarge
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <h4 className="text-base font-black text-white leading-snug">{photo.title}</h4>
                <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-slate-700 text-slate-200 font-bold">
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
