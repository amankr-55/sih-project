import React from 'react';
import { 
  Lightbulb, 
  Target, 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Cpu,
  Clock,
  Radio,
  DollarSign,
  Briefcase,
  Zap,
  HardHat,
  Eye
} from 'lucide-react';

export default function InnovationSection() {
  const comparisonData = [
    {
      feature: 'Real-Time Latency',
      traditional: '6 to 12 Days (Satellite InSAR Revisit Delay)',
      pastSih: '10 to 30 Seconds (WiFi lag / Cloud polling)',
      greenThinkerX: 'Sub-Second (< 850 ms) via LoRa Sub-GHz RF Mesh',
      winner: true
    },
    {
      feature: 'False Alarm Rejection',
      traditional: 'Manual inspection required for every anomaly',
      pastSih: 'Frequent false alarms from coal dumpers & trucks',
      greenThinkerX: 'Multi-Sensor AI Fusion (Tilt + Crack + Vibration + Gas) filters 98% false trips',
      winner: true
    },
    {
      feature: 'Underground Fog / Dust Performance',
      traditional: 'Optical Total Stations blind in dust/fog',
      pastSih: 'Standard webcams fail completely in 0-visibility',
      greenThinkerX: 'Dual LWIR Thermal Infrared + AI Wireframe De-Haze restores 45m line-of-sight',
      winner: true
    },
    {
      feature: 'Offline Operation (No Internet)',
      traditional: 'Proprietary satellite telemetry required',
      pastSih: 'Crashes without active 4G / Wi-Fi internet',
      greenThinkerX: '100% Offline-First. Local Edge SQLite buffer + On-Premises Command Station',
      winner: true
    },
    {
      feature: 'DGMS Statutory Compliance',
      traditional: 'Manual paperwork by surveyors (hours of delay)',
      pastSih: 'Generic UI graphs without legal compliance',
      greenThinkerX: 'Automated 1-Click DGMS Form IV Shift Audit PDF (CMR 2017 Regulations 111 & 112)',
      winner: true
    },
    {
      feature: 'Deployment Cost per Panel',
      traditional: '₹15 Lakhs to ₹50 Lakhs (GNSS & Boreholes)',
      pastSih: '₹25,000 to ₹40,000 (Fragile single nodes)',
      greenThinkerX: '₹1,200 to ₹1,800 per node (Dense grid of 30-50 nodes covering entire trough)',
      winner: true
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Hero Banner with Slide Launch Button */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SIH26025 RESEARCH & COMPETITIVE MATRIX
              </span>
              <span className="bg-purple-950 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-bold">
                TEAM GREEN THINKERX
              </span>
              <a 
                href="./impact-and-benefits-slide.html" 
                target="_blank" 
                rel="noreferrer"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-md hover:scale-105"
              >
                <Eye className="w-3.5 h-3.5" /> VIEW 16:9 HD SLIDE PRESENTATION
              </a>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
              IMPACT, BENEFITS & STRATEGIC ADVANTAGE
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Complete synthesized presentation matrix combining unique hardware features, societal impacts, miner safety economics, 4-phase early warning timelines, and commercial GTM strategy.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/40 p-5 rounded-2xl text-center min-w-[200px] shadow-xl">
            <Award className="w-8 h-8 text-amber-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white font-mono">10x - 50x</div>
            <div className="text-xs text-slate-400">Cost Disruption vs GNSS</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">98.4% False-Alarm Rejection</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MASTER IMPACT AND BENEFITS OVERVIEW (Exact from Image 1) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Core Solution Matrix: Unique Features, Impacts & Benefits
          </h3>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            DGMS Statutory Safety Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Unique Features (Left Column) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              🔥 UNIQUE FEATURES:
            </h4>

            <div className="space-y-2.5">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 p-3 rounded-2xl">
                <div className="font-bold text-white text-xs">Sub-GHz LoRa Mesh Telemetry</div>
                <div className="text-[11px] text-slate-300">Operates 100% offline underground with zero internet reliance.</div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 p-3 rounded-2xl">
                <div className="font-bold text-white text-xs">Dual Fixed & Rover Sensing</div>
                <div className="text-[11px] text-slate-300">Covers continuous pillar monitoring and hard-to-reach void areas.</div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 p-3 rounded-2xl">
                <div className="font-bold text-white text-xs">Edge FFT Harmonic Filtering</div>
                <div className="text-[11px] text-slate-300">Isolates routine mining drill noise from true micro-seismic shear.</div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 p-3 rounded-2xl">
                <div className="font-bold text-white text-xs">Sub-Second Hardware Actuation</div>
                <div className="text-[11px] text-slate-300">Instantly triggers 85dB local sirens and statutory power trips.</div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 p-3 rounded-2xl">
                <div className="font-bold text-white text-xs">3D Digital Twin & DGMS Engine</div>
                <div className="text-[11px] text-slate-300">Real-time Three.js spatial strata model and automated shift PDF audits.</div>
              </div>
            </div>
          </div>

          {/* Impacts & Benefits (Right Column) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Impacts */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                🌱 SOCIETAL & SAFETY IMPACTS:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30">
                  <div className="font-bold text-emerald-300">Zero-Fatality Goal</div>
                  <div className="text-[11px] text-slate-300 mt-1">Enables pre-collapse evacuation, directly supporting DGMS India's Zero Harm mission.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30">
                  <div className="font-bold text-emerald-300">Infrastructure Protection</div>
                  <div className="text-[11px] text-slate-300 mt-1">Prevents surface troughs, protecting roads, railways, and dwellings.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30">
                  <div className="font-bold text-emerald-300">Miners' Life Safety</div>
                  <div className="text-[11px] text-slate-300 mt-1">Gives subterranean workers critical early warning minutes before roof rupture.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30">
                  <div className="font-bold text-emerald-300">Continuous Production</div>
                  <div className="text-[11px] text-slate-300 mt-1">Eliminates unpredicted roof collapse downtime, boosting extraction efficiency.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30 sm:col-span-2">
                  <div className="font-bold text-emerald-300">Disaster Resilience</div>
                  <div className="text-[11px] text-slate-300 mt-1">Self-healing sub-surface emergency network operating through power cuts.</div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                💼 STRATEGIC & OPERATIONAL BENEFITS:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30">
                  <div className="font-bold text-cyan-300">Low-Cost Scalability</div>
                  <div className="text-[11px] text-slate-300 mt-1">Built under ₹3,500/node vs ₹2-5 Lakhs for imported seismic stations.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30">
                  <div className="font-bold text-cyan-300">High Morale & Trust</div>
                  <div className="text-[11px] text-slate-300 mt-1">Boosts workforce confidence knowing strata movement is guarded 24/7.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30">
                  <div className="font-bold text-cyan-300">Statutory Compliance</div>
                  <div className="text-[11px] text-slate-300 mt-1">Automates Coal Mine Safety Index (CMSI) tracking and one-click PDF audits.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30">
                  <div className="font-bold text-cyan-300">Rapid Deployment</div>
                  <div className="text-[11px] text-slate-300 mt-1">Plug-and-play anchor mounting deploys in minutes across active seams.</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30 sm:col-span-2">
                  <div className="font-bold text-cyan-300">Long-Term Asset Value</div>
                  <div className="text-[11px] text-slate-300 mt-1">Saves mining companies crores of rupees in equipment and subsidence claims.</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: 4-PHASE PRE-COLLAPSE WARNING TIMELINE (Details from Image 2) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            4-Phase Pre-Collapse Warning Timeline & Edge Advantage
          </h3>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
              ⚡ &lt;5ms Local Response
            </span>
            <span className="bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded">
              📡 0s Cloud Lag
            </span>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
              🎯 100Hz MPU Sampling
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between font-mono font-bold text-cyan-400 text-xs">
              <span>Phase 1</span>
              <span className="text-[10px] text-slate-400">2–24 Hours Before</span>
            </div>
            <div className="font-bold text-white text-sm">Micro-cracks & Stress Build-up</div>
            <p className="text-xs text-slate-400">
              Normal Baseline Monitoring • Continuous acoustic strain & tilt tracking.
            </p>
            <div className="text-[11px] font-mono font-bold text-emerald-400 pt-1 border-t border-slate-800">
              🟢 Status: Normal Baseline
            </div>
          </div>

          <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between font-mono font-bold text-amber-400 text-xs">
              <span>Phase 2</span>
              <span className="text-[10px] text-slate-400">30–60 Mins Before</span>
            </div>
            <div className="font-bold text-white text-sm">Bed Separation & Roof Sagging</div>
            <p className="text-xs text-slate-400">
              0.01° Precision Tilt Detection • Extensometer dilation across sedimentary roof beds.
            </p>
            <div className="text-[11px] font-mono font-bold text-amber-400 pt-1 border-t border-slate-800">
              🟡 Alert: Yellow Advisory Alert
            </div>
          </div>

          <div className="bg-slate-950 border-2 border-orange-500/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between font-mono font-bold text-orange-400 text-xs">
              <span>Phase 3</span>
              <span className="text-[10px] text-slate-400">2–15 Mins Before</span>
            </div>
            <div className="font-bold text-white text-sm">High-Frequency Micro-Tremors</div>
            <p className="text-xs text-slate-400">
              100Hz MPU-6050 Vibration Anomaly • Rapid shear stress and micro-fissure release.
            </p>
            <div className="text-[11px] font-mono font-bold text-orange-400 pt-1 border-t border-slate-800">
              🟠 Alert: Orange Critical Alert
            </div>
          </div>

          <div className="bg-slate-950 border-2 border-red-500/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between font-mono font-bold text-red-400 text-xs">
              <span>Phase 4</span>
              <span className="text-[10px] text-slate-400">1–2 Sec Failure</span>
            </div>
            <div className="font-bold text-white text-sm">Catastrophic Fall</div>
            <p className="text-xs text-slate-400">
              Sub-5ms Edge Buzzer & LoRa Mesh Evacuation Trigger • Miners evacuated in Phase 2 & 3.
            </p>
            <div className="text-[11px] font-mono font-bold text-red-400 pt-1 border-t border-slate-800">
              🔴 Action: Automated Evacuation
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: BUSINESS MODEL, TAM/SAM/SOM & GTM STRATEGY (Details from Image 3) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Revenue Model, Unit Economics (TAM/SAM/SOM) & Go-To-Market Plan
          </h3>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
              74% Gross Margin
            </span>
            <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
              90% Cost Reduction vs Imports
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Revenue Streams */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
              <span>💰</span> Revenue Streams & Pricing
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div><strong class="text-white">Fixed Node:</strong> ₹12,500/unit <span className="text-[10px] text-slate-500">(BOM ₹3,200)</span></div>
              <div><strong class="text-white">Inspection Rover:</strong> ₹85,000/unit</div>
              <div><strong class="text-white">SaaS AI Cloud:</strong> ₹2.5 Lakh/Mine/Year</div>
              <div><strong class="text-white">AMC & Calibration:</strong> 15% Annual</div>
            </div>
          </div>

          {/* Target Market */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-indigo-400 text-sm flex items-center gap-1.5">
              <span>🏢</span> Target Market (B2G & B2B)
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div><strong class="text-white">Coal India (CIL):</strong> BCCL, ECL, CMPDI, WCL</div>
              <div><strong class="text-white">Singareni (SCCL):</strong> State coal operator</div>
              <div><strong class="text-white">Private Miners:</strong> Tata Steel, Adani, Vedanta</div>
              <div><strong class="text-white">Regulatory:</strong> DGMS Statutory Sandbox</div>
            </div>
          </div>

          {/* Market Size */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <span>📊</span> Unit Economics & Market
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div><strong class="text-white">TAM:</strong> ₹2,400 Crores (Total Market)</div>
              <div><strong class="text-white">SAM:</strong> ₹850 Crores (Indian Underground)</div>
              <div><strong class="text-white">SOM:</strong> ₹120 Crores (450+ Active Seams)</div>
              <div className="text-emerald-400 font-bold text-[11px]">74% Gross Margin</div>
            </div>
          </div>

          {/* GTM Strategy */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <span>🚀</span> Go-To-Market Strategy
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div><strong class="text-white">GeM Portal:</strong> Government listing</div>
              <div><strong class="text-white">DGMS Pilot:</strong> Sandbox compliance</div>
              <div><strong class="text-white">CSIR-CIMFR:</strong> Collaborative testing</div>
              <div><strong class="text-white">CIL E-Tenders:</strong> Fast procurement scale</div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: SYSTEMATIC MARKET GAP & INNOVATION MATRIX TABLE */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Systematic Market Gap & Competitive Advantage Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-bold">
                <th className="p-3.5">Key Challenge & Capability</th>
                <th className="p-3.5 text-slate-400">Existing Commercial (InSAR/GNSS)</th>
                <th className="p-3.5 text-slate-400">Past SIH Hackathon Attempts</th>
                <th className="p-3.5 text-emerald-400 bg-emerald-950/30">Green ThinkerX (Our Solution)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {comparisonData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white font-sans">{item.feature}</td>
                  <td className="p-3.5 text-slate-400 flex items-start gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{item.traditional}</span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    <div className="flex items-start gap-1.5">
                      <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item.pastSih}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-emerald-200 bg-emerald-950/20 font-bold">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.greenThinkerX}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
