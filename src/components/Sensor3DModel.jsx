import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, RotateCw, ZoomIn, ZoomOut, ShieldCheck, Cpu, Battery, Radio, Usb, Sliders, Activity } from 'lucide-react';

export default function Sensor3DModel({ 
  status = 'normal',
  node = null,
  allNodes = [],
  selectedNodeId = 'NODE-01',
  onSelectNodeId,
  serialConnected = false,
  hardwareMode = 'simulation',
  effect3DTheme = 'sensor-sync'
}) {
  const mountRef = useRef(null);
  const [syncMode, setSyncMode] = useState('sensor'); // 'sensor' | 'manual' | 'orbit'
  const [manualPitch, setManualPitch] = useState(0); // -60 to +60 deg
  const [manualRoll, setManualRoll] = useState(0); // -60 to +60 deg
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (effect3DTheme === 'cad') {
      setSyncMode('manual');
      setManualPitch(0);
      setManualRoll(0);
    } else {
      setSyncMode('sensor');
    }
  }, [effect3DTheme]);

  const activeNode = node || allNodes.find(n => n.id === selectedNodeId) || allNodes[0] || {
    id: 'NODE-01',
    name: 'Master Sensor Unit',
    tiltX: 0,
    tiltY: 0,
    vibrationG: 0.01,
    temperature: 28.5
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 360;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 38);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x10b981, 3, 50);
    pointLight.position.set(-15, 10, 15);
    scene.add(pointLight);

    // Root model group
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    // 1. Heavy-duty IP67 Enclosure Body (Yellow-charcoal industrial)
    const bodyGeo = new THREE.BoxGeometry(14, 16, 7);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    nodeGroup.add(bodyMesh);

    // 2. Yellow Corner Bumpers / Protective Edges
    const bumperMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Hazard yellow
      metalness: 0.4,
      roughness: 0.4
    });

    const b1 = new THREE.Mesh(new THREE.BoxGeometry(14.4, 2, 7.4), bumperMat);
    b1.position.y = 8;
    nodeGroup.add(b1);

    const b2 = new THREE.Mesh(new THREE.BoxGeometry(14.4, 2, 7.4), bumperMat);
    b2.position.y = -8;
    nodeGroup.add(b2);

    // 3. Faceplate Screen / Label Area
    const faceGeo = new THREE.BoxGeometry(11, 11, 0.4);
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.2
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = 3.6;
    nodeGroup.add(faceMesh);

    // 4. Glowing Status LED Light (Green/Amber/Red)
    const ledGeo = new THREE.SphereGeometry(0.8, 32, 32);
    let ledColor = 0x10b981; // Green
    if (status === 'critical') ledColor = 0xef4444;
    else if (status === 'advisory') ledColor = 0xf59e0b;

    const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(4, 3.5, 4);
    nodeGroup.add(ledMesh);

    // 5. LoRa Sub-GHz Whip Antenna on top
    const antBaseGeo = new THREE.CylinderGeometry(0.9, 1.1, 2, 16);
    const antMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const antBase = new THREE.Mesh(antBaseGeo, antMat);
    antBase.position.set(-4, 9, 0);
    nodeGroup.add(antBase);

    const whipGeo = new THREE.CylinderGeometry(0.35, 0.45, 16, 16);
    const whipMesh = new THREE.Mesh(whipGeo, antMat);
    whipMesh.position.set(-4, 18, 0);
    nodeGroup.add(whipMesh);

    // 6. Stainless Steel Mounting Bracket (Rear)
    const bracketGeo = new THREE.BoxGeometry(18, 20, 0.6);
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Steel
      metalness: 0.9,
      roughness: 0.2
    });
    const bracketMesh = new THREE.Mesh(bracketGeo, bracketMat);
    bracketMesh.position.z = -3.8;
    nodeGroup.add(bracketMesh);

    // 7. Linear Potentiometer Crack Probe Cable & Rod extending from bottom
    const probeCylinder = new THREE.CylinderGeometry(0.7, 0.7, 10, 16);
    const probeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 });
    const probeMesh = new THREE.Mesh(probeCylinder, probeMat);
    probeMesh.rotation.z = Math.PI / 2;
    probeMesh.position.set(11, -5, 0);
    nodeGroup.add(probeMesh);

    // Mouse Interaction for 3D Drag
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      setSyncMode('manual');
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      nodeGroup.rotation.y += deltaX * 0.015;
      nodeGroup.rotation.x += deltaY * 0.015;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (syncMode === 'sensor' && !isDragging) {
        // Map real MPU-6050 angles: Pitch (tiltX) and Roll (tiltY)
        const targetRotX = THREE.MathUtils.degToRad(activeNode.tiltX || 0);
        const targetRotZ = THREE.MathUtils.degToRad(activeNode.tiltY || (activeNode.tiltX ? activeNode.tiltX * 0.5 : 0));
        
        nodeGroup.rotation.x += (targetRotX - nodeGroup.rotation.x) * 0.18;
        nodeGroup.rotation.z += (targetRotZ - nodeGroup.rotation.z) * 0.18;
        nodeGroup.rotation.y += 0.003;
      } else if (syncMode === 'manual' && !isDragging) {
        const targetRotX = THREE.MathUtils.degToRad(manualPitch);
        const targetRotZ = THREE.MathUtils.degToRad(manualRoll);
        nodeGroup.rotation.x += (targetRotX - nodeGroup.rotation.x) * 0.2;
        nodeGroup.rotation.z += (targetRotZ - nodeGroup.rotation.z) * 0.2;
      } else if (syncMode === 'orbit' && !isDragging) {
        nodeGroup.rotation.y += 0.015;
      }

      // Dynamic vibration jitter on 3D twin
      const vibG = activeNode.vibrationG || 0.01;
      if (vibG > 0.08) {
        nodeGroup.position.x = (Math.random() - 0.5) * Math.min(2.5, vibG * 3.5);
        nodeGroup.position.y = (Math.random() - 0.5) * Math.min(2.5, vibG * 3.5);
        nodeGroup.position.z = (Math.random() - 0.5) * Math.min(2.5, vibG * 3.5);
      } else {
        nodeGroup.position.y = Math.sin(Date.now() * 0.002) * 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [status, syncMode, manualPitch, manualRoll, activeNode.tiltX, activeNode.tiltY, activeNode.vibrationG]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden text-white space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-10 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            3D DIGITAL TWIN: GEOSENTINEL IOT SENSOR NODE
            {serialConnected && (
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                <Usb className="w-3 h-3" /> HARDWARE SYNCED
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-300">
            Interactive 3D Hardware CAD Render • Real-Time Physical MPU-6050 Orientation Tracking
          </p>
        </div>

        {/* 3D Motion Modes */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSyncMode('sensor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              syncMode === 'sensor' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Sensor Sync</span>
          </button>

          <button
            onClick={() => setShowControls(!showControls)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showControls ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual 3D</span>
          </button>

          <button
            onClick={() => setSyncMode(syncMode === 'orbit' ? 'sensor' : 'orbit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              syncMode === 'orbit' ? 'bg-purple-600 text-white shadow-md font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${syncMode === 'orbit' ? 'animate-spin' : ''}`} />
            <span>Orbit</span>
          </button>
        </div>
      </div>

      {/* Manual Controls Drawer if opened */}
      {showControls && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-amber-500/40 text-xs font-mono animate-fade-in">
          <div>
            <div className="flex justify-between text-slate-300 font-bold mb-1">
              <span>Manual Pitch Angle:</span>
              <span className="text-cyan-400 font-black">{manualPitch}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              value={manualPitch}
              onChange={(e) => {
                setManualPitch(parseInt(e.target.value));
                setSyncMode('manual');
              }}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-bold mb-1">
              <span>Manual Roll Angle:</span>
              <span className="text-amber-400 font-black">{manualRoll}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              value={manualRoll}
              onChange={(e) => {
                setManualRoll(parseInt(e.target.value));
                setSyncMode('manual');
              }}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* 3D Viewport Container */}
      <div 
        ref={mountRef} 
        className="w-full h-84 relative rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border border-slate-800/80 cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
      >
        {/* Real-time MPU-6050 Orientation HUD */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700/80 px-4 py-2 rounded-2xl text-xs font-mono text-slate-200 space-y-1 pointer-events-none shadow-xl">
          <div className="text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            STATION: {activeNode.id}
          </div>
          <div>PITCH (X): <strong className="text-white">{(activeNode.tiltX || 0).toFixed(2)}°</strong></div>
          <div>ROLL (Y): <strong className="text-amber-400">{(activeNode.tiltY || ((activeNode.tiltX || 0) * 0.5)).toFixed(2)}°</strong></div>
          <div>VIBRATION: <strong className="text-emerald-400">{(activeNode.vibrationG || 0.01).toFixed(3)}g</strong></div>
        </div>

        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700/80 px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 pointer-events-none hidden sm:block">
          ENCLOSURE: <strong>IP67 Die-Cast Steel + PC</strong>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700/80 px-3 py-1 rounded-xl text-[10px] font-mono text-cyan-400 pointer-events-none">
          💡 Click & Drag to Orbit 3D Model • Move Physical Sensor to Tilt Live
        </div>
      </div>

      {/* Hardware Specifications Badges below 3D Model */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[10px] block">Microcontroller</span>
          <span className="font-bold text-white">ESP32-S3 Dual Core</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[10px] block">Radio Frequency</span>
          <span className="font-bold text-cyan-400">868 MHz LoRa SX1278</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[10px] block">Power Supply</span>
          <span className="font-bold text-emerald-400">3.7V 4000mAh LiFePO4</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[10px] block">Displacement Probe</span>
          <span className="font-bold text-amber-400">100mm Potentiometric Ext</span>
        </div>
      </div>

    </div>
  );
}
