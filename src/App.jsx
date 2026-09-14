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
import ThemeCustomizerModal from './components/ThemeCustomizerModal';

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
  const [themeMode, setThemeMode] = useState('dark');
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
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const [dashboardTheme, setDashboardTheme] = useState('cyber');
  const [fontTheme, setFontTheme] = useState('inter');
  const [effect3DTheme, setEffect3DTheme] = useState('sensor-sync');
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [isSimStreamActive, setIsSimStreamActive] = useState(false);
  const activeSelectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [currentShift, setCurrentShift] = useState('Shift-A');
  const [activeMiners, setActiveMiners] = useState(48);
  const [hardwareMode, setHardwareMode] = useState('simulation');
  const [isDgmsModalOpen, setIsDgmsModalOpen] = useState(false);
  const [serialConnected, setSerialConnected] = useState(false);
  const [serialLogs, setSerialLogs] = useState([
    '[INIT] Web Serial Controller ready.',
    '[READY] Plug ESP32 via USB (COM Port) or pair via Bluetooth SPP. Click Connect.'
  ]);
  const [thresholds, setThresholds] = useState({ ...DGMS_THRESHOLDS });

  // WebSerial API handler for live physical ESP32 streaming
  async function handleConnectSerial() {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        setSerialConnected(true);
        setHardwareMode('hardware');
        setSerialLogs(prev => [
          ...prev.slice(-25),
          `[SUCCESS] Connected to USB Serial Port at 115200 baud!`,
          `[HARDWARE] Subterranean Node live streaming active.`
        ]);
        logEvent('normal', 'USB', 'ESP32 Subterranean Node connected via WebSerial (COM Port 115200 baud)');

        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        let lineBuffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            break;
          }
          if (value) {
            lineBuffer += value;
            const lines = lineBuffer.split('\n');
            lineBuffer = lines.pop();
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed) {
                setSerialLogs(prev => [...prev.slice(-25), `[RX] ${trimmed}`]);
                if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                  try {
                    const data = JSON.parse(trimmed);
                    handleHardwareTelemetry(data);
                  } catch (e) {
                    // ignore incomplete JSON
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Serial port error:', err);
        setSerialConnected(false);
        setSerialLogs(prev => [...prev.slice(-25), `[ERROR] Serial Port: ${err.message}`]);
        logEvent('advisory', 'USB', `WebSerial connection: ${err.message}`);
      }
    } else {
      alert('WebSerial is natively supported in Google Chrome, Microsoft Edge, and Opera!');
    }
  }

  function handleHardwareTelemetry(data) {
    // Expected packet: {"id":"NODE-01","location":"Seam 3-A Longwall Face","tilt":0.00,"vibration":0.01,"freq":0.0,"mining_thresh":0.22,"crack":0.00,"ch4":0.00,"temp":24.5,"moisture":15.0,"status":"normal","timestamp":123}
    
    // Geotechnical rock strata propagation factors:
    // ALL subterranean nodes link directly to the physical hardware MPU-6050 sensor stream!
    const NODE_PROPAGATION = {
      'NODE-01': { tiltMul: 1.00, vibMul: 1.00, crackMul: 1.00, tempOff: 0.0 },  // Extraction Face 3-A (Master Physical Node)
      'NODE-02': { tiltMul: 0.88, vibMul: 0.85, crackMul: 0.82, tempOff: -0.8 }, // Main Intake Trunk
      'NODE-03': { tiltMul: 1.08, vibMul: 0.98, crackMul: 1.04, tempOff: +1.2 }, // Central Pillar Cluster (Stress Concentration)
      'NODE-04': { tiltMul: 0.78, vibMul: 0.75, crackMul: 0.72, tempOff: -1.4 }, // Ventilation Return Shaft
      'NODE-05': { tiltMul: 0.82, vibMul: 0.80, crackMul: 0.79, tempOff: -0.5 }, // South Dip Gallery
      'NODE-06': { tiltMul: 0.65, vibMul: 0.60, crackMul: 0.58, tempOff: -2.1 }, // Surface Datum Reference Monument
    };

    const baseTilt = typeof data.tilt === 'number' ? data.tilt : 0.0;
    const baseVib = typeof data.vibration === 'number' ? data.vibration : 0.01;
    const baseCrack = typeof data.crack === 'number' ? data.crack : 0.0;
    // MPU-6050 internal die runs ~19°C hotter than ambient room temperature
    const rawTemp = typeof data.temp === 'number' ? data.temp : 28.5;
    const baseTemp = +(rawTemp > 40 ? rawTemp - 19.5 : rawTemp).toFixed(1);

    setNodes(prevNodes => prevNodes.map(n => {
      const prop = NODE_PROPAGATION[n.id] || { tiltMul: 1.0, vibMul: 1.0, crackMul: 1.0, tempOff: 0 };
      const nodeTilt = +(baseTilt * prop.tiltMul).toFixed(2);
      const nodeVib = +(baseVib * prop.vibMul).toFixed(2);
      const nodeCrack = +(baseCrack * prop.crackMul).toFixed(2);
      const nodeTemp = +(baseTemp + prop.tempOff).toFixed(1);

      const nodeStatus = (
        nodeTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || 
        nodeCrack >= DGMS_THRESHOLDS.CRACK_CRITICAL || 
        nodeVib >= DGMS_THRESHOLDS.VIBRATION_CRITICAL
      ) ? 'critical' : (
        nodeTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || 
        nodeCrack >= DGMS_THRESHOLDS.CRACK_ADVISORY || 
        nodeVib >= DGMS_THRESHOLDS.VIBRATION_ADVISORY
      ) ? 'advisory' : 'normal';

      return {
        ...n,
        tiltX: nodeTilt,
        tiltY: +(nodeTilt * 0.5).toFixed(2),
        vibrationG: nodeVib,
        crackDisplacement: nodeCrack,
        temperature: nodeTemp,
        status: nodeStatus,
        lastSeen: 'Live Hardware'
      };
    }));

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const tiltVal = +(data.tilt || 0).toFixed(2);
    const vibVal = +(data.vibration || 0.01).toFixed(2);
    const crackVal = +(data.crack || 0).toFixed(2);
    const tempVal = +(data.temp > 40 ? data.temp - 19.5 : (data.temp || 28.5)).toFixed(1);
    const freqVal = +(data.freq || 0).toFixed(1);
    const ch4Val = +(data.ch4 || 0.22).toFixed(2);
    const coVal = +(data.co || 6.5).toFixed(1);

    setHistoryData(prev => [
      ...prev.slice(1),
      {
        time: timeStr,
        tilt: tiltVal,
        vibration: vibVal,
        crack: crackVal,
        temp: tempVal,
        freq: freqVal,
        ch4: ch4Val,
        co: coVal
      }
    ]);
  }

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

  // In hardware mode, evaluate exclusively NODE-01 (the physical device)
  const activeNodesForStatus = hardwareMode === 'hardware'
    ? nodes.filter(n => n.id === 'NODE-01')
    : nodes;

  activeNodesForStatus.forEach(n => {
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
    maxVibration >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ||
    (hardwareMode !== 'hardware' && (
      maxCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP || 
      maxCO >= DGMS_THRESHOLDS.CO_CRITICAL ||
      maxMoisture >= DGMS_THRESHOLDS.MOISTURE_CRITICAL ||
      maxTemp >= 48.0
    ))
      ? 'critical'
      : maxTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || 
        maxCrack >= DGMS_THRESHOLDS.CRACK_ADVISORY || 
        maxVibration >= DGMS_THRESHOLDS.VIBRATION_ADVISORY
      ? 'advisory'
      : 'normal';

  // Automated siren trigger: starts on critical, and AUTOMATICALLY stops as soon as normal/advisory
  useEffect(() => {
    if (overallStatus === 'critical') {
      if (!isSirenActive) {
        sirenEngine.startSiren();
        setIsSirenActive(true);
        logEvent('critical', 'NODE-01', 'CRITICAL STRATA RUPTURE DETECTED - AUTOMATED EVACUATION ENGAGED');
      }
    } else {
      // Auto-silence whenever readings return to safe/advisory
      if (isSirenActive) {
        sirenEngine.stopSiren();
        setIsSirenActive(false);
        logEvent('normal', 'SYS', 'Working strata stabilized - Emergency siren silenced automatically.');
      }
    }
  }, [overallStatus, isSirenActive]);

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

  // Periodic subtle jitter / streaming data tick (ONLY active if user explicitly clicks "Test with Simulation", and sensor is not connected)
  useEffect(() => {
    if (serialConnected || !isSimStreamActive) return;

    const interval = setInterval(() => {
      setHistoryData(prevHistory => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const newPoint = {
          time: timeStr,
          tilt: +(maxTilt + (Math.random() * 0.08 - 0.04)).toFixed(2),
          vibration: +(maxVibration + (Math.random() * 0.02 - 0.01)).toFixed(2),
          crack: +(maxCrack + (Math.random() * 0.04 - 0.02)).toFixed(2),
          temp: +(maxTemp + (Math.random() * 0.2 - 0.1)).toFixed(1),
          freq: +(12.0 + (Math.random() * 2.0 - 1.0)).toFixed(1),
          ch4: +(maxCH4 + (Math.random() * 0.02 - 0.01)).toFixed(2),
          co: +(maxCO + (Math.random() * 0.4 - 0.2)).toFixed(1)
        };
        return [...prevHistory.slice(1), newPoint];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [maxTilt, maxCrack, maxCH4, maxCO, serialConnected, isSimStreamActive]);

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
    const NODE_PROP = {
      'NODE-01': { tiltMul: 1.00, vibMul: 1.00, crackMul: 1.00 },
      'NODE-02': { tiltMul: 0.88, vibMul: 0.85, crackMul: 0.82 },
      'NODE-03': { tiltMul: 1.08, vibMul: 0.98, crackMul: 1.04 },
      'NODE-04': { tiltMul: 0.78, vibMul: 0.75, crackMul: 0.72 },
      'NODE-05': { tiltMul: 0.82, vibMul: 0.80, crackMul: 0.79 },
      'NODE-06': { tiltMul: 0.65, vibMul: 0.60, crackMul: 0.58 },
    };

    if (scenario === 'normal') {
      setNodes(INITIAL_NODES.map(n => ({ ...n, status: 'normal' })));
      logEvent('normal', 'ALL', 'Reset all nodes to normal operational baseline.');
    } else if (scenario === 'advisory') {
      setNodes(prev => prev.map(n => {
        const p = NODE_PROP[n.id] || { tiltMul: 1, vibMul: 1, crackMul: 1 };
        return {
          ...n,
          tiltX: +(2.8 * p.tiltMul).toFixed(2),
          tiltY: +(2.0 * p.tiltMul).toFixed(2),
          crackDisplacement: +(1.8 * p.crackMul).toFixed(2),
          vibrationG: +(0.16 * p.vibMul).toFixed(2),
          status: 'advisory'
        };
      }));
      logEvent('advisory', 'ALL', 'Sand-tray tilt simulation active: Seam tilt ~3.44° (Exceeds 2.5° limit across seam).');
    } else if (scenario === 'critical') {
      setNodes(prev => prev.map(n => {
        const p = NODE_PROP[n.id] || { tiltMul: 1, vibMul: 1, crackMul: 1 };
        return {
          ...n,
          tiltX: +(4.8 * p.tiltMul).toFixed(2),
          tiltY: +(3.5 * p.tiltMul).toFixed(2),
          crackDisplacement: +(4.2 * p.crackMul).toFixed(2),
          vibrationG: +(0.72 * p.vibMul).toFixed(2),
          status: 'critical'
        };
      }));
      logEvent('critical', 'ALL', 'Sudden strata collapse simulation active: Angle ~5.94° & Crack ~4.2mm!');
    } else if (scenario === 'gas') {
      setNodes(prev => prev.map(n => {
        const p = NODE_PROP[n.id] || { tiltMul: 1, vibMul: 1, crackMul: 1 };
        return {
          ...n,
          ch4: +(1.45 * p.tiltMul).toFixed(2),
          co: +(42.0 * p.tiltMul).toFixed(1),
          status: 'critical'
        };
      }));
      logEvent('critical', 'ALL', 'Gas strata fissure simulation: CH4 1.45% (Interlock Power Trip Limit Breached).');
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

  const fontClass = fontTheme === 'mono' 
    ? 'font-theme-mono'
    : fontTheme === 'orbitron'
    ? 'font-theme-orbitron'
    : fontTheme === 'roboto'
    ? 'font-theme-roboto'
    : fontTheme === 'space'
    ? 'font-theme-space'
    : 'font-theme-inter';

  return (
    <div className={`min-h-screen ${
      themeMode === 'light' 
        ? 'bg-slate-200 text-slate-900' 
        : dashboardTheme === 'amber'
        ? 'bg-[#180f08] text-amber-100'
        : dashboardTheme === 'emerald'
        ? 'bg-[#05170f] text-emerald-100'
        : dashboardTheme === 'midnight'
        ? 'bg-[#000000] text-slate-100'
        : dashboardTheme === 'titanium'
        ? 'bg-[#11161f] text-slate-100'
        : 'bg-[#090f1f] text-slate-100'
    } flex flex-col ${fontClass} relative transition-colors duration-500 ${
      overallStatus === 'critical' ? 'ring-8 ring-inset ring-red-600/40' : ''
    }`}>
      
      {/* Animated Subterranean Particle Cyber Background */}
      {themeMode === 'dark' && <CyberBackground />}
      
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
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
        dashboardTheme={dashboardTheme}
        onSelectTheme={setDashboardTheme}
        fontTheme={fontTheme}
        onSelectFontTheme={setFontTheme}
        effect3DTheme={effect3DTheme}
        onSelect3DEffectTheme={setEffect3DTheme}
        onOpenCustomizer={() => setIsThemeCustomizerOpen(true)}
        serialConnected={serialConnected}
        onConnectSerial={handleConnectSerial}
        onNavigateHome={() => setActiveTab('overview')}
      />

      {/* Tri-State Alarm Banner */}
      <div className="relative z-10">
        <AlarmBanner
          status={overallStatus}
          maxTilt={maxTilt}
          maxCrack={maxCrack}
          maxCH4={maxCH4}
          maxCO={maxCO}
        />
      </div>

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
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Industrial 3-Light Mine Safety Indicator Bar */}
            <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 bg-black/80 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
                  {/* Red Light */}
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      overallStatus === 'critical'
                        ? 'bg-red-500 border-red-200 shadow-[0_0_22px_rgba(239,68,68,1)] animate-pulse ring-4 ring-red-500/50 scale-110'
                        : 'bg-red-950/40 border-red-900/50 opacity-25'
                    }`} />
                    <span className={`text-xs font-mono font-black ${overallStatus === 'critical' ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                      RED (DANGER)
                    </span>
                  </div>

                  <div className="w-[1px] h-6 bg-slate-700 mx-1" />

                  {/* Yellow Light */}
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      overallStatus === 'advisory'
                        ? 'bg-amber-400 border-amber-100 shadow-[0_0_22px_rgba(245,158,11,1)] animate-pulse ring-4 ring-amber-400/50 scale-110'
                        : 'bg-amber-950/40 border-amber-900/50 opacity-25'
                    }`} />
                    <span className={`text-xs font-mono font-black ${overallStatus === 'advisory' ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                      YELLOW (ADVISORY)
                    </span>
                  </div>

                  <div className="w-[1px] h-6 bg-slate-700 mx-1" />

                  {/* Green Light */}
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      overallStatus === 'normal'
                        ? 'bg-emerald-400 border-emerald-100 shadow-[0_0_22px_rgba(16,185,129,1)] ring-4 ring-emerald-400/50 scale-110'
                        : 'bg-emerald-950/40 border-emerald-900/50 opacity-25'
                    }`} />
                    <span className={`text-xs font-mono font-black ${overallStatus === 'normal' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      GREEN (SAFE)
                    </span>
                  </div>
                </div>

                <div className="leading-tight">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">
                    DGMS STATUTORY SAFETY LEVEL
                  </span>
                  <span className={`text-sm font-black font-mono tracking-wide ${
                    overallStatus === 'critical' ? 'text-red-400 animate-pulse' : overallStatus === 'advisory' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {overallStatus === 'critical' 
                      ? '🔴 CRITICAL HAZARD: STRATA RUPTURE / ROOF FALL DANGER — EVACUATE' 
                      : overallStatus === 'advisory' 
                      ? '🟡 ADVISORY STRAIN: MONITOR SHEAR DISPLACEMENT & TILT' 
                      : '🟢 ALL CLEAR: STRATA HOMOGENEOUS & FULLY SECURE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {serialConnected ? (
                  <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-xs font-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                    LIVE HARDWARE SYNC ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={handleConnectSerial}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>CONNECT PHYSICAL ESP32</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Top Row: 2D Spatial Mine Grid + 3D Geological Strata Model */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 min-h-[460px]">
                <SpatialMineGrid
                  nodes={nodes}
                  onSelectNode={(node) => {
                    setSelectedNodeId(node.id);
                    setActiveTab('sensorhub');
                  }}
                  selectedNodeId={selectedNodeId}
                />
              </div>

              <div className="lg:col-span-5 min-h-[460px]">
                <Strata3DVisualizer
                  maxTilt={maxTilt}
                  maxCrack={maxCrack}
                />
              </div>
            </div>

            {/* Middle Row: Full-Width Multi-Parametric Telemetry Arrays (All 6 Separated Graphs) */}
            <div className="w-full">
              <TelemetryPanels
                historyData={historyData}
                status={overallStatus}
                serialConnected={serialConnected}
                isSimStreamActive={isSimStreamActive}
                onToggleSimStream={() => setIsSimStreamActive(prev => !prev)}
              />
            </div>

            {/* Bottom Row: Simulation Controls + Event Audit Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7">
                <SimulationControls
                  nodes={nodes}
                  onTriggerScenario={handleTriggerScenario}
                  onManualSliderChange={handleManualSliderChange}
                  hardwareMode={hardwareMode}
                  onToggleHardwareMode={setHardwareMode}
                  serialConnected={serialConnected}
                  onConnectSerial={handleConnectSerial}
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
          <Earth3DExplorer
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
            serialConnected={serialConnected}
            hardwareMode={hardwareMode}
            maxTilt={maxTilt}
            maxCrack={maxCrack}
            maxVibration={maxVibration}
            effect3DTheme={effect3DTheme}
          />
        )}

        {/* TAB 3: DEDICATED SENSOR DEEP-DIVE & HEALTH HUB */}
        {activeTab === 'sensorhub' && (
          <SensorDeepDiveHub
            selectedNode={activeSelectedNode}
            allNodes={nodes}
            serialConnected={serialConnected}
            hardwareMode={hardwareMode}
            onSelectNodeId={setSelectedNodeId}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* TAB 2: TEMPERATURE */}
        {activeTab === 'temperature' && (
          <TemperatureSection
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
          />
        )}

        {/* TAB 3: MOISTURE */}
        {activeTab === 'moisture' && (
          <MoistureSection
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
          />
        )}

        {/* TAB 4: VIBRATION */}
        {activeTab === 'vibration' && (
          <VibrationSection
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
            serialConnected={serialConnected}
            hardwareMode={hardwareMode}
            onInjectTremor={handleInjectTremor}
          />
        )}

        {/* TAB 5: CRACKS */}
        {activeTab === 'cracks' && (
          <CrackSection
            nodes={nodes}
            maxCrack={maxCrack}
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
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
            node={activeSelectedNode}
            allNodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
            serialConnected={serialConnected}
            hardwareMode={hardwareMode}
            effect3DTheme={effect3DTheme}
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
              setSelectedNodeId(node.id);
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
          <SettingsSection 
            serialConnected={serialConnected}
            onConnectSerial={handleConnectSerial}
            serialLogs={serialLogs}
            thresholds={thresholds}
            onUpdateThresholds={(newThresh) => {
              setThresholds(newThresh);
              logEvent('normal', 'ADMIN', 'DGMS Statutory Thresholds updated.');
            }}
          />
        )}

        {/* TAB 12: VISITOR & USER LOGINS AUDIT (OWNER / ADMIN EXCLUSIVE) */}
        {activeTab === 'users' && isAdmin && (
          <UserAccessLogSection currentUser={currentUser} />
        )}

      </main>

      {/* Footer bar */}
      <footer className="relative z-10 bg-slate-950/90 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 backdrop-blur-lg">
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

      {/* Theme, Font & 3D Effect Studio Customizer (5x5x5) */}
      <ThemeCustomizerModal
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
        currentColorTheme={dashboardTheme}
        onSelectColorTheme={setDashboardTheme}
        currentFontTheme={fontTheme}
        onSelectFontTheme={setFontTheme}
        current3DEffectTheme={effect3DTheme}
        onSelect3DEffectTheme={setEffect3DTheme}
      />

    </div>
  );
}
