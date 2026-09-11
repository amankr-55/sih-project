import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Layers, 
  Ruler, 
  Activity, 
  TrendingDown, 
  AlertTriangle, 
  Droplets, 
  Compass, 
  Maximize2, 
  Eye, 
  Info,
  ShieldAlert,
  HardHat,
  ArrowDown
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';
import ImageLightboxModal from './ImageLightboxModal';

export default function Earth3DExplorer() {
  const [faceAdvance, setFaceAdvance] = useState(185); // meters into panel
  const [voidHeight, setVoidHeight] = useState(3.2); // meters seam thickness
  const [depthOfCover, setDepthOfCover] = useState(180); // meters overburden depth
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState('strata'); // 'strata', 'subsidence-curve', 'aquifer'
  const [lightboxData, setLightboxData] = useState(null);
  
  const canvasRef = useRef(null);

  // Subsidence Calculations (NCB & DGMS Empirical Formulas)
  const subsidenceFactor = 0.72; // a = 0.72 for caving longwall in Indian coalfields
  const sMax = (subsidenceFactor * voidHeight * (faceAdvance / 250)).toFixed(2); // meters max sag
  const sMaxMm = (sMax * 1000).toFixed(0);
  const angleOfDraw = 28.5; // degrees
  const influenceWidth = Math.round(faceAdvance + 2 * (depthOfCover * Math.tan((angleOfDraw * Math.PI) / 180)));
  const tensileStrain = ((sMax / depthOfCover) * 1000).toFixed(1); // mm/m

  // Interactive 3D Canvas Rendering of Geological Earth Cross-Section
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Coordinate centers
      const cx = w * 0.5;
      const cy = h * 0.46;

      if (isRotating) rotation += 0.008;

      // 3D Isometric Projection Helper
      const isoX = (x, y, z) => cx + (x - y) * Math.cos(0.48) + Math.sin(rotation * 0.5) * 8;
      const isoY = (x, y, z) => cy + (x + y) * Math.sin(0.28) - z;

      // Draw Strata Blocks from bottom to top
      // 1. Lower Bedrock Floor (Dark Charcoal Granite)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      // 2. Active Coal Seam #3 (Black with Glowing Extraction Void)
      const seamZ = 50;
      const seamHeight = 28;

      // Draw Unmined Coal & Void
      const voidX = Math.min(200, (faceAdvance / 350) * 220);

      // Draw Subterranean Strata Layers (Cross Section)
      const strataLayers = [
        { name: 'Lower Floor Sandstone', depth: '185m - 240m', color: '#1a2234', stroke: '#334155', h: 30, z: 20 },
        { name: 'Coal Seam #3 (Bituminous)', depth: '170m - 185m', color: '#090d16', stroke: '#06b6d4', h: seamHeight, z: seamZ, isCoal: true },
        { name: 'Immediate Sandstone Roof', depth: '120m - 170m', color: '#243048', stroke: '#475569', h: 35, z: 80 },
        { name: 'Fractured Aquifer (Water Table)', depth: '70m - 120m', color: '#16314f', stroke: '#38bdf8', h: 30, z: 115, isWater: true },
        { name: 'Upper Sandstone & Shale', depth: '20m - 70m', color: '#283955', stroke: '#64748b', h: 35, z: 145 },
        { name: 'Alluvium & Topsoil (Surface)', depth: '0m - 20m', color: '#334960', stroke: '#22c55e', h: 22, z: 170, isSurface: true }
      ];

      strataLayers.forEach((layer) => {
        const baseZ = layer.z;
        const topZ = layer.z + layer.h;

        ctx.fillStyle = layer.color;
        ctx.strokeStyle = layer.stroke;
        ctx.lineWidth = 1.5;

        // Draw isometric sliced box
        const x1 = -180, x2 = 180;
        const y1 = -90, y2 = 90;

        // Front Face
        ctx.beginPath();
        ctx.moveTo(isoX(x1, y2, baseZ), isoY(x1, y2, baseZ));
        ctx.lineTo(isoX(x2, y2, baseZ), isoY(x2, y2, baseZ));
        ctx.lineTo(isoX(x2, y2, topZ), isoY(x2, y2, topZ));
        ctx.lineTo(isoX(x1, y2, topZ), isoY(x1, y2, topZ));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Side Face
        ctx.beginPath();
        ctx.moveTo(isoX(x2, y2, baseZ), isoY(x2, y2, baseZ));
        ctx.lineTo(isoX(x2, y1, baseZ), isoY(x2, y1, baseZ));
        ctx.lineTo(isoX(x2, y1, topZ), isoY(x2, y1, topZ));
        ctx.lineTo(isoX(x2, y2, topZ), isoY(x2, y2, topZ));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top Face (with dynamic subsidence sag on surface layer!)
        if (layer.isSurface) {
          ctx.beginPath();
          // Draw Surface with Sag Trough Depression in Center
          const sagAmount = parseFloat(sMax) * 14;
          for (let sx = x1; sx <= x2; sx += 15) {
            const distFromVoid = Math.abs(sx - (voidX - 100));
            const sag = Math.max(0, sagAmount * Math.exp(-(distFromVoid * distFromVoid) / 3800));
            const py = isoY(sx, y2, topZ - sag);
            const px = isoX(sx, y2, topZ - sag);
            if (sx === x1) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          for (let sx = x2; sx >= x1; sx -= 15) {
            const distFromVoid = Math.abs(sx - (voidX - 100));
            const sag = Math.max(0, sagAmount * Math.exp(-(distFromVoid * distFromVoid) / 3800));
            const py = isoY(sx, y1, topZ - sag);
            const px = isoX(sx, y1, topZ - sag);
            ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = '#2f4356';
          ctx.fill();
          ctx.stroke();

          // Draw Surface Road and Surface Crack Lines
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const crackX = isoX(voidX - 90, 0, topZ - sagAmount * 0.8);
          const crackY = isoY(voidX - 90, 0, topZ - sagAmount * 0.8);
          ctx.moveTo(crackX - 40, crackY - 15);
          ctx.lineTo(crackX, crackY);
          ctx.lineTo(crackX + 35, crackY + 12);
          ctx.stroke();

          // Surface Road Marking (White Dashed Line)
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(isoX(x1, 0, topZ), isoY(x1, 0, topZ));
          ctx.lineTo(isoX(x2, 0, topZ), isoY(x2, 0, topZ));
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Highlight extraction void in coal seam
        if (layer.isCoal) {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
          const vX1 = isoX(-80, 40, baseZ + 4);
          const vY1 = isoY(-80, 40, baseZ + 4);
          const vX2 = isoX(voidX - 80, 40, baseZ + 4);
          const vY2 = isoY(voidX - 80, 40, baseZ + 4);
          ctx.beginPath();
          ctx.arc(vX2, vY2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Groundwater Flow Indicator in Aquifer
        if (layer.isWater) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('💧 WATER TABLE (-42m) • SEEPAGE TO SUMP', isoX(x1 + 20, y2, baseZ + 12), isoY(x1 + 20, y2, baseZ + 12));
        }
      });

      // Overlay text HUD on 3D Viewport
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`LONGWALL FACE ADVANCE: ${faceAdvance}m`, 24, 32);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`SEAM VOID HEIGHT: ${voidHeight}m`, 24, 52);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`MAX SURFACE SAG: ${sMax}m (${sMaxMm} mm)`, 24, 72);
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`TENSILE STRAIN: ${tensileStrain} mm/m (ROAD CRACKING LIMIT)`, 24, 92);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [faceAdvance, voidHeight, depthOfCover, isRotating, sMax, tensileStrain]);

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Top Banner Header */}
      <div className="bg-[#18253f] border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Globe className="w-10 h-10 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex items-center gap-3">
              3D SUBTERRANEAN EARTH & SUBSIDENCE DEPTH EXPLORER
              <span className="text-xs bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase">
                DGMS CMR-111 COMPLIANT
              </span>
            </h2>
            <p className="text-base text-slate-200 font-medium mt-1">
              Geological strata cross-section, real-time ground depression trough, active mining face advance & aquifer tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0d1627] p-2 rounded-2xl border border-slate-700">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              isRotating ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-200'
            }`}
          >
            {isRotating ? '3D Motion: ON' : '3D Motion: PAUSED'}
          </button>
        </div>
      </div>

      {/* Main Grid: Left 3D Viewport (7 cols) + Right Geotechnical Depth Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 3D Isometric Strata Viewport */}
        <div className="lg:col-span-7 bg-[#142036] border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-cyan-300 flex items-center gap-2 font-mono">
                <Layers className="w-5 h-5 text-cyan-400" />
                REAL-TIME 3D STRATA CROSS-SECTION & SURFACE SAG TROUGH
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700">
                Scale: 1:100 Metric
              </span>
            </div>

            {/* Interactive 3D Canvas */}
            <div className="relative h-[420px] rounded-2xl overflow-hidden border border-slate-700 bg-[#091120] shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={420}
                className="w-full h-full block select-none"
              />
              
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur border border-white/20 px-3.5 py-1.5 rounded-xl text-xs font-mono text-emerald-400 font-bold">
                Dynamic 3D Strata Mesh Active
              </div>
            </div>
          </div>

          {/* Simulation Controls for Mining Advance & Void Height */}
          <div className="mt-5 bg-[#0b1424] p-4 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider block font-mono">
              ⚡ Live Mining Advance Simulation Sliders:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-white font-bold mb-1">
                  <span>Longwall Face Advance:</span>
                  <span className="text-cyan-400 font-mono font-black text-sm">{faceAdvance} meters</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="350"
                  step="5"
                  value={faceAdvance}
                  onChange={(e) => setFaceAdvance(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-300 block mt-1">Panel length: 450m • Advance rate: 4.5m/day</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-white font-bold mb-1">
                  <span>Coal Seam Void Height:</span>
                  <span className="text-amber-400 font-mono font-black text-sm">{voidHeight} meters</span>
                </div>
                <input
                  type="range"
                  min="1.8"
                  max="4.5"
                  step="0.1"
                  value={voidHeight}
                  onChange={(e) => setVoidHeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-300 block mt-1">Seam #3 thickness: 3.2m Bituminous</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Geotechnical Subsidence & Crack Data (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* 4 Big High-Contrast Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Max Ground Sag (Smax)</span>
              <div className="text-3xl font-black font-mono text-red-400">
                {sMax} <span className="text-sm font-bold text-slate-300">meters</span>
              </div>
              <span className="text-xs text-amber-300 font-bold block mt-1 font-mono">({sMaxMm} mm total sag)</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Tensile Surface Strain</span>
              <div className="text-3xl font-black font-mono text-amber-400">
                {tensileStrain} <span className="text-sm font-bold text-slate-300">mm/m</span>
              </div>
              <span className="text-xs text-red-400 font-bold block mt-1 font-mono">Crack Threshold: &gt;3.0 mm/m</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Angle of Draw</span>
              <div className="text-3xl font-black font-mono text-cyan-400">
                {angleOfDraw}°
              </div>
              <span className="text-xs text-slate-200 font-medium block mt-1">Limit of Surface Impact</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Influence Basin Width</span>
              <div className="text-3xl font-black font-mono text-emerald-400">
                {influenceWidth} <span className="text-sm font-bold text-slate-300">m</span>
              </div>
              <span className="text-xs text-slate-200 font-medium block mt-1">Surface Trough Area</span>
            </div>

          </div>

          {/* Subterranean Geological Strata Depth Breakdown Card */}
          <div className="bg-[#182642] border border-slate-700 p-5 rounded-3xl shadow-xl flex-1 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
              <span>Strata Cross-Section & Depth Schedule</span>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/40">
                Total Depth: 240m
              </span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-emerald-400 text-sm block">0m - 20m: Surface Topsoil & Alluvium</strong>
                  <span className="text-slate-300 font-sans">Village road, railway embankment, residential structures</span>
                </div>
                <span className="text-xs font-bold text-red-400 font-mono">HIGH CRACK RISK</span>
              </div>

              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-blue-300 text-sm block">20m - 120m: Upper Sandstone & Aquifer</strong>
                  <span className="text-slate-300 font-sans">Groundwater table at -42m • Seepage rate: 120 L/min</span>
                </div>
                <span className="text-xs font-bold text-cyan-400 font-mono">PIEZOMETER OK</span>
              </div>

              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-amber-300 text-sm block">120m - 170m: Massive Main Roof Sandstone</strong>
                  <span className="text-slate-300 font-sans">Caving cantilever overhang • Periodic weighting: 18.5m</span>
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">HIGH STRESS</span>
              </div>

              <div className="bg-[#0e172a] p-3 rounded-xl border border-cyan-500/50 flex items-center justify-between">
                <div>
                  <strong className="text-cyan-300 text-sm block">170m - 185m: Active Working Coal Seam #3</strong>
                  <span className="text-slate-200 font-sans">Extraction void height: {voidHeight}m • Face advance: {faceAdvance}m</span>
                </div>
                <span className="text-xs font-black text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500">ACTIVE WORKINGS</span>
              </div>
            </div>
          </div>

        </div>

      </div>

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

      {/* Realistic Real-World Photographic Evidence & Surveillance Section */}
      <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl space-y-5">
        <div>
          <h3 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2.5">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span>REAL-WORLD STRATA SUBSIDENCE EVIDENCE & PHYSICAL DAMAGE SURVEILLANCE</span>
          </h3>
          <p className="text-base text-slate-100 font-bold mt-1">
            Actual physical field photographs showing why real-time early warning subsidence monitoring is mandatory for Indian underground coalfields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Surface Road Fissure */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/road_subsidence.jpg'),
              title: 'Surface Highway & Road Shear Fissures',
              desc: 'Surface highway collapsing due to underground roof caving. Tensile strains exceed 3.0 mm/m, causing asphalt buckling and structural severance.',
              location: 'Overburden Surface Sector-B (Chainage 14+200)',
              badge: 'SURFACE DAMAGE'
            })}
            className="bg-[#0f192b] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl group hover:border-red-500 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/road_subsidence.jpg')}
                alt="Surface Road Collapse from Subsidence"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                SURFACE SUBSIDENCE TROUGH
              </div>
              <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-red-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400" /> Click to Enlarge
                </span>
              </div>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black text-white">Surface Highway & Road Shear Fissures</h4>
                <p className="text-sm text-slate-100 leading-relaxed font-normal mt-1.5">
                  Surface highway collapsing due to underground roof caving. Tensile strains exceed 3.0 mm/m, causing complete asphalt buckling and structural severance.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 text-xs font-mono font-bold text-red-400">
                CRITICAL THRESHOLD: BREACHED (&gt;3.0 mm/m)
              </div>
            </div>
          </div>

          {/* Card 2: Underground Extensometer Monitoring */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/real_mine_crack.jpg'),
              title: 'Underground Strata Crack Dilatometer',
              desc: 'Linear LVDT / Potentiometric extensometer bolted into fractured rock roof. Directly measures micro-fissure dilation in real-time before catastrophic roof falls.',
              location: 'Seam 3-A Longwall Face Rib',
              badge: 'FRACTURE GAUGING'
            })}
            className="bg-[#0f192b] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl group hover:border-cyan-400 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/real_mine_crack.jpg')}
                alt="Underground Crack Extensometer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-cyan-600 text-slate-950 font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                SUBTERRANEAN EXTENSOMETER
              </div>
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-cyan-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Click to Enlarge
                </span>
              </div>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black text-white">Underground Strata Crack Dilatometer</h4>
                <p className="text-sm text-slate-100 leading-relaxed font-normal mt-1.5">
                  Linear LVDT / Potentiometric extensometer bolted into fractured rock roof. Directly measures micro-fissure dilation in real-time before catastrophic roof falls.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 text-xs font-mono font-bold text-cyan-300">
                MICRON RESOLUTION: ±0.01 mm
              </div>
            </div>
          </div>

          {/* Card 3: Water Inrush & Drainage Sump */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/mine_water_sump.jpg'),
              title: 'Aquifer Water Seepage & Reservoir',
              desc: 'Subterranean water retention sump with staff gauge and submersible dewatering pumps. Monitors pore pressure to prevent quicksand strata liquefaction.',
              location: 'Shaft 2 Bottom Dewatering Sump #04',
              badge: 'AQUIFER SURVEILLANCE'
            })}
            className="bg-[#0f192b] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl group hover:border-blue-400 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/mine_water_sump.jpg')}
                alt="Underground Mine Water Sump"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-blue-600 text-white font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                AQUIFER & DEWATERING SUMP
              </div>
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-blue-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-400" /> Click to Enlarge
                </span>
              </div>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black text-white">Aquifer Water Seepage & Reservoir</h4>
                <p className="text-sm text-slate-100 leading-relaxed font-normal mt-1.5">
                  Subterranean water retention sump with staff gauge and submersible dewatering pumps. Monitors pore pressure to prevent quicksand strata liquefaction.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 text-xs font-mono font-bold text-blue-300">
                AQUIFER PORE INGRESS: STABLE
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
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

    </div>
  );
}
