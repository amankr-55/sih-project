import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import AlarmBanner from './components/AlarmBanner';
import SpatialMineGrid from './components/SpatialMineGrid';
import TelemetryPanels from './components/TelemetryPanels';
import SimulationControls from './components/SimulationControls';
import EventLog from './components/EventLog';
import Earth3DExplorer from './components/Earth3DExplorer';
import SensorDeepDiveHub from './components/SensorDeepDiveHub';
import DgmsReportModal from './components/DgmsReportModal';

// Dedicated Sensor & Analytics Sections
import TemperatureSection from './components/TemperatureSection';
import MoistureSection from './components/MoistureSection';
import VibrationSection from './components/VibrationSection';
import CrackSection from './components/CrackSection';
import GasSection from './components/GasSection';
import SensorLocationsSection from './components/SensorLocationsSection';
import CameraSection from './components/CameraSection';
import Strata3DVisualizer from './components/Strata3DVisualizer';
import Sensor3DModel from './components/Sensor3DModel';
import InnovationSection from './components/InnovationSection';
import SettingsSection from './components/SettingsSection';
import SensorDiagnosticsSection from './components/SensorDiagnosticsSection';
import CyberBackground from './components/CyberBackground';
import UserAccessLogSection from './components/UserAccessLogSection';

import { 
  LayoutDashboard, 
  Thermometer, 
  Droplets, 
  Activity, 
  Ruler, 
  Wind, 
  MapPin, 
  Camera, 
  Settings, 
  Cpu, 
  Sparkles, 
  Gauge, 
  Globe,
  Users
} from 'lucide-react';

import { 
  INITIAL_NODES, 
  calculateCMSI, 
  evaluateNodeStatus, 
  generateInitialChartHistory,
  DGMS_THRESHOLDS 
} from './utils/mockDataStream';
import { sirenEngine } from './utils/audioSiren';
import { generateDGMSReport } from './utils/dgmsReportGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [currentUser, setCurrentUser] = useState({
    id: 'USR-CHIEF-01',
    name: 'Aman Kumar (Chief Officer)',
    role: 'admin',
    email: 'Chief Safety Officer'
  });

  function handleLogout() {
    // Reset to default session
    setActiveTab('overview');
  }

  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [historyData, setHistoryData] = useState(generateInitialChartHistory());
  const [selectedNode, setSelectedNode] = useState(INITIAL_NODES[0]);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [currentShift, setCurrentShift] = useState('Shift-A');
  const [activeMiners, setActiveMiners] = useState(48);
  const [hardwareMode, setHardwareMode] = useState('simulation');
  const [isDgmsModalOpen, setIsDgmsModalOpen] = useState(false);

  const [events, setEvents] = useState([
    {
      id: 'EVT-101',
      time: '09:15:20',
      nodeId: 'NODE-01',
      severity: 'normal',
      message: 'Node synchronized over LoRa 868MHz mesh (RSSI: -72 dBm)',
      signature: '0x9E4F...A102'
    },
    {
      id: 'EVT-102',
      time: '09:18:45',
      nodeId: 'NODE-03',
      severity: 'advisory',
      message: 'Micro-seismic acoustic activity recorded (0.18g peak acc)',
      signature: '0x3C8B...F944'
    },
    {
      id: 'EVT-103',
      time: '09:22:10',
      nodeId: 'NODE-06',
      severity: 'normal',
      message: 'Surface reference benchmark zeroed and locked',
      signature: '0x7D11...E328'
    }
  ]);

  // Overall calculations
  const cmsi = calculateCMSI(nodes);
  
  // Calculate max metrics across all nodes
  let maxTilt = 0;
  let maxCrack = 0;
  let maxCH4 = 0;
  let maxCO = 0;
  let maxVibration = 0;
  let maxMoisture = 0;
  let maxTemp = 0;

  nodes.forEach(n => {
    const totalTilt = Math.sqrt(n.tiltX * n.tiltX + n.tiltY * n.tiltY);
    if (totalTilt > maxTilt) maxTilt = totalTilt;
    if (n.crackDisplacement > maxCrack) maxCrack = n.crackDisplacement;
    if (n.ch4 > maxCH4) maxCH4 = n.ch4;
    if (n.co > maxCO) maxCO = n.co;
    if ((n.vibrationG || 0.05) > maxVibration) maxVibration = n.vibrationG || 0.05;
    if ((n.moisture || 40) > maxMoisture) maxMoisture = n.moisture || 40;
    if ((n.temperature || 28) > maxTemp) maxTemp = n.temperature || 28;
  });

  const overallStatus = 
    maxTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || 
    maxCrack >= DGMS_THRESHOLDS.CRACK_CRITICAL || 
    maxCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP || 
    maxCO >= DGMS_THRESHOLDS.CO_CRITICAL ||
    maxVibration >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ||
    maxMoisture >= DGMS_THRESHOLDS.MOISTURE_CRITICAL ||
    maxTemp >= 45.0
      ? 'critical'
      : maxTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || 
        maxCrack >= DGMS_THRESHOLDS.CRACK_ADVISORY || 
        maxCH4 >= DGMS_THRESHOLDS.CH4_ADVISORY || 
        maxCO >= DGMS_THRESHOLDS.CO_ADVISORY ||
        maxVibration >= DGMS_THRESHOLDS.VIBRATION_ADVISORY ||
        maxMoisture >= DGMS_THRESHOLDS.MOISTURE_ADVISORY ||
        maxTemp >= DGMS_THRESHOLDS.TEMP_ADVISORY
      ? 'advisory'
      : 'normal';

  // Automated siren trigger on critical status
  const prevStatusRef = useRef(overallStatus);
  useEffect(() => {
    if (overallStatus === 'critical' && prevStatusRef.current !== 'critical') {
      sirenEngine.startSiren();
      setIsSirenActive(true);
      logEvent('CRITICAL', 'NODE-01', 'CRITICAL STRATA RUPTURE DETECTED - AUTOMATED EVACUATION ENGAGED');
    } else if (overallStatus === 'advisory' && prevStatusRef.current === 'normal') {
      sirenEngine.playAdvisoryChime();
      logEvent('advisory', 'NODE-01', 'Strata parameter exceeded advisory threshold. Safety inspection advisory.');
    } else if (overallStatus === 'normal' && prevStatusRef.current === 'critical') {
      sirenEngine.stopSiren();
      setIsSirenActive(false);
      logEvent('normal', 'SYS', 'All underground workings restored to stable statutory limits.');
    }
    prevStatusRef.current = overallStatus;
  }, [overallStatus]);

  function logEvent(severity, nodeId, message) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const newEvt = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      time: timeStr,
      nodeId,
      severity: severity.toLowerCase(),
      message,
      signature: `0x${randomHex}...${Date.now().toString().slice(-4)}`
    };
    setEvents(prev => [newEvt, ...prev.slice(0, 49)]);
  }

  // Periodic subtle jitter / streaming data tick
  useEffect(() => {
    const interval = setInterval(() => {
      setHistoryData(prevHistory => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const newPoint = {
          time: timeStr,
          tilt: +(maxTilt + (Math.random() * 0.08 - 0.04)).toFixed(2),
          crack: +(maxCrack + (Math.random() * 0.04 - 0.02)).toFixed(2),
          ch4: +(maxCH4 + (Math.random() * 0.02 - 0.01)).toFixed(2),
          co: +(maxCO + (Math.random() * 0.4 - 0.2)).toFixed(1)
        };
        return [...prevHistory.slice(1), newPoint];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [maxTilt, maxCrack, maxCH4, maxCO]);

  // Siren toggle handler
  function handleToggleSiren() {
    if (isSirenActive) {
      sirenEngine.stopSiren();
      setIsSirenActive(false);
      logEvent('normal', 'OPERATOR', 'Emergency siren manually silenced by safety operator.');
    } else {
      sirenEngine.startSiren();
      setIsSirenActive(true);
      logEvent('critical', 'OPERATOR', 'Manual acoustic siren test activated from command console.');
    }
  }

  // Quick scenario triggers for demo
  function handleTriggerScenario(scenario) {
    if (scenario === 'normal') {
      setNodes(INITIAL_NODES.map(n => ({ ...n, status: 'normal' })));
      logEvent('normal', 'ALL', 'Reset to normal operational baseline.');
    } else if (scenario === 'advisory') {
      setNodes(prev => prev.map(n => {
        if (n.id === 'NODE-01') {
          return {
            ...n,
            tiltX: 2.8,
            tiltY: 2.0,
            crackDisplacement: 1.8,
            status: 'advisory'
          };
        }
        return n;
      }));
      logEvent('advisory', 'NODE-01', 'Sand-tray tilt simulation active: Angle 3.44° (Exceeds 2.5° limit).');
    } else if (scenario === 'critical') {
      setNodes(prev => prev.map(n => {
        if (n.id === 'NODE-01') {
          return {
            ...n,
            tiltX: 4.8,
            tiltY: 3.5,
            crackDisplacement: 4.2,
            vibrationG: 0.72,
            status: 'critical'
          };
        }
        return n;
      }));
      logEvent('critical', 'NODE-01', 'Sudden strata collapse simulation active: Angle 5.94° & Crack 4.2mm!');
    } else if (scenario === 'gas') {
      setNodes(prev => prev.map(n => {
        if (n.id === 'NODE-01') {
          return {
            ...n,
            ch4: 1.45,
            co: 42.0,
            status: 'critical'
          };
        }
        return n;
      }));
      logEvent('critical', 'NODE-01', 'Gas strata fissure simulation: CH4 1.45% (Interlock Power Trip Limit Breached).');
    }
  }

  // Manual slider modification
  function handleManualSliderChange(nodeId, param, value) {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        let updated = { ...n };
        if (param === 'tilt') {
          updated.tiltX = +(value * 0.8).toFixed(2);
          updated.tiltY = +(value * 0.6).toFixed(2);
        } else if (param === 'crack') {
          updated.crackDisplacement = +value.toFixed(2);
        } else if (param === 'ch4') {
          updated.ch4 = +value.toFixed(2);
        }
        updated.status = evaluateNodeStatus(updated);
        return updated;
      }
      return n;
    }));
  }

  // Tremor injection from Vibration section
  function handleInjectTremor(nodeId, gVal) {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, vibrationG: gVal } : n));
    if (gVal >= 0.3) {
      logEvent('critical', nodeId, `Simulated seismic micro-tremor: Resultant peak ${gVal}g`);
    }
  }

  // PDF Export
  function handleDirectPdfExport() {
    generateDGMSReport({
      nodes,
      cmsi,
      status: overallStatus,
      activeMiners,
      shiftName: currentShift
    });
    logEvent('normal', 'SYSTEM', `Statutory DGMS Shift Audit Report PDF exported for ${currentShift}.`);
  }

  const isAdmin = currentUser?.role === 'admin';

  // Base navigation tabs accessible to all verified mine safety inspectors
  const baseTabs = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'earth3d', label: '3D Earth & Subsidence Depth', icon: Globe },
    { id: 'sensorhub', label: 'Sensor Deep-Dive & Health', icon: Cpu },
    { id: 'temperature', label: 'Temperature & Heat', icon: Thermometer },
    { id: 'moisture', label: 'Moisture & Water Sump', icon: Droplets },
    { id: 'vibration', label: 'Seismic Vibration & Waves', icon: Activity },
    { id: 'cracks', label: 'Strata Fissures & Cracks', icon: Ruler },
    { id: 'gas', label: 'Gas Safety (CH4/CO)', icon: Wind },
    { id: 'sensor3d', label: '3D Hardware Twin', icon: Gauge },
    { id: 'locations', label: 'Sensor Locations', icon: MapPin },
    { id: 'cameras', label: 'Surveillance & Fog CAMs', icon: Camera },
    { id: 'innovation', label: 'Why Green ThinkerX Wins', icon: Sparkles },
  ];

  // Restricted admin tabs (Visible ONLY to Owner / Master Admin Aman Kumar)
  const adminTabs = [
    { id: 'users', label: '👑 Visitor & User Logins', icon: Users },
    { id: 'settings', label: '👑 Hardware & Settings', icon: Settings },
  ];

  const navTabs = isAdmin ? [...baseTabs, ...adminTabs] : baseTabs;

  // Security guard: redirect if non-admin attempts to view restricted tabs
  useEffect(() => {
    if (!isAdmin && (activeTab === 'users' || activeTab === 'settings')) {
      setActiveTab('overview');
    }
  }, [isAdmin, activeTab]);

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans relative transition-colors duration-500 ${
      overallStatus === 'critical' ? 'ring-8 ring-inset ring-red-600/40' : ''
    }`}>
      
      {/* Animated Subterranean Particle Cyber Background */}
      <CyberBackground />
      
      {/* Top Header with Brand, CMSI Radial Meter, User Profile & Logout */}
      <Header
        cmsi={cmsi}
        status={overallStatus}
        activeMiners={activeMiners}
        isSirenActive={isSirenActive}
        onToggleSiren={handleToggleSiren}
        onExportReport={() => setIsDgmsModalOpen(true)}
        currentShift={currentShift}
        onChangeShift={setCurrentShift}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Tri-State Alarm Banner */}
      <AlarmBanner
        status={overallStatus}
        maxTilt={maxTilt}
        maxCrack={maxCrack}
        maxCH4={maxCH4}
        maxCO={maxCO}
      />

      {/* Modern High-Contrast Navigation Tab Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/90 sticky top-[76px] z-30 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-3">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/60 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area based on Selected Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Row: 2D Spatial Map + Dual Real-Time Telemetry Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 min-h-[480px]">
                <SpatialMineGrid
                  nodes={nodes}
                  onSelectNode={(node) => {
                    setSelectedNode(node);
                    setActiveTab('sensorhub');
                  }}
                  selectedNodeId={selectedNode ? selectedNode.id : nodes[0]?.id}
                />
              </div>

              <div className="lg:col-span-5 min-h-[480px]">
                <TelemetryPanels
                  historyData={historyData}
                  status={overallStatus}
                />
              </div>
            </div>

            {/* Middle Row: 3D Geological Strata Model */}
            <Strata3DVisualizer
              maxTilt={maxTilt}
              maxCrack={maxCrack}
            />

            {/* Bottom Row: Simulation Controls + Event Audit Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7">
                <SimulationControls
                  nodes={nodes}
                  onTriggerScenario={handleTriggerScenario}
                  onManualSliderChange={handleManualSliderChange}
                  hardwareMode={hardwareMode}
                  onToggleHardwareMode={setHardwareMode}
                />
              </div>

              <div className="lg:col-span-5">
                <EventLog events={events} />
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: 3D SUBTERRANEAN EARTH & SUBSIDENCE DEPTH */}
        {activeTab === 'earth3d' && (
          <Earth3DExplorer />
        )}

        {/* TAB 3: DEDICATED SENSOR DEEP-DIVE & HEALTH HUB */}
        {activeTab === 'sensorhub' && (
          <SensorDeepDiveHub
            selectedNode={selectedNode || nodes[0]}
            allNodes={nodes}
            onSelectNodeId={(id) => {
              const target = nodes.find(n => n.id === id);
              if (target) setSelectedNode(target);
            }}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* TAB 2: TEMPERATURE */}
        {activeTab === 'temperature' && (
          <TemperatureSection
            nodes={nodes}
          />
        )}

        {/* TAB 3: MOISTURE */}
        {activeTab === 'moisture' && (
          <MoistureSection
            nodes={nodes}
          />
        )}

        {/* TAB 4: VIBRATION */}
        {activeTab === 'vibration' && (
          <VibrationSection
            nodes={nodes}
            onInjectTremor={handleInjectTremor}
          />
        )}

        {/* TAB 5: CRACKS */}
        {activeTab === 'cracks' && (
          <CrackSection
            nodes={nodes}
            maxCrack={maxCrack}
          />
        )}

        {/* TAB 6: GAS */}
        {activeTab === 'gas' && (
          <GasSection
            nodes={nodes}
            maxCH4={maxCH4}
            maxCO={maxCO}
          />
        )}

        {/* TAB 7: 3D HARDWARE TWIN */}
        {activeTab === 'sensor3d' && (
          <Sensor3DModel
            status={overallStatus}
          />
        )}

        {/* TAB 8: SENSOR DIAGNOSTICS & RATIOS */}
        {activeTab === 'diagnostics' && (
          <SensorDiagnosticsSection
            nodes={nodes}
          />
        )}

        {/* TAB 9: SENSOR LOCATIONS */}
        {activeTab === 'locations' && (
          <SensorLocationsSection
            nodes={nodes}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('sensorhub');
            }}
          />
        )}

        {/* TAB 9: CAMERAS & SURVEILLANCE */}
        {activeTab === 'cameras' && (
          <CameraSection />
        )}

        {/* TAB 10: INNOVATION & RESEARCH */}
        {activeTab === 'innovation' && (
          <InnovationSection />
        )}

        {/* TAB 11: SETTINGS & HARDWARE BRIDGE (OWNER / ADMIN EXCLUSIVE) */}
        {activeTab === 'settings' && isAdmin && (
          <SettingsSection />
        )}

        {/* TAB 12: VISITOR & USER LOGINS AUDIT (OWNER / ADMIN EXCLUSIVE) */}
        {activeTab === 'users' && isAdmin && (
          <UserAccessLogSection currentUser={currentUser} />
        )}

      </main>

      {/* Footer bar */}
      <footer className="bg-slate-950/90 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">Team Green ThinkerX</span>
            <span className="text-slate-600">•</span>
            <span>Smart India Hackathon 2026 (SIH26025)</span>
          </div>
          <div className="font-mono text-xs text-emerald-400 font-bold">
            DGMS Compliant • Offline LoRa Sub-GHz • 3D Digital Twin Active
          </div>
        </div>
      </footer>

      {/* DGMS Shift Audit Exporter Modal Preview */}
      <DgmsReportModal
        isOpen={isDgmsModalOpen}
        onClose={() => setIsDgmsModalOpen(false)}
        nodes={nodes}
        cmsi={cmsi}
        status={overallStatus}
        activeMiners={activeMiners}
        shiftName={currentShift}
        onDownloadPdf={handleDirectPdfExport}
      />

    </div>
  );
}
