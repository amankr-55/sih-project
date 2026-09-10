import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, RotateCw, ZoomIn, ZoomOut, ShieldCheck, Cpu, Battery, Radio } from 'lucide-react';

export default function Sensor3DModel({ status = 'normal' }) {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 340;

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
      setIsRotating(false);
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

      if (isRotating && !isDragging) {
        nodeGroup.rotation.y += 0.012;
      }

      // Gentle floating bob
      nodeGroup.position.y = Math.sin(Date.now() * 0.002) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight || 340;
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
  }, [status, isRotating]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            3D DIGITAL TWIN: GEOSENTINEL IOT SENSOR NODE
          </h3>
          <p className="text-xs text-slate-400">
            Interactive 3D Hardware CAD Render • Drag with mouse to inspect 360°
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isRotating ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Auto Orbit' : 'Rotate Manual'}</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport Container */}
      <div 
        ref={mountRef} 
        className="w-full h-80 relative rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border border-slate-800/80 cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
      >
        {/* Dimensions overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700/80 px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 space-y-0.5 pointer-events-none">
          <div>SCALE: <strong>1:1 Form Factor</strong></div>
          <div>ENCLOSURE: <strong>IP67 Polycarbonate + Die-Cast Steel</strong></div>
          <div>DIMENSIONS: <strong>140 × 160 × 70 mm</strong></div>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700/80 px-3 py-1 rounded-xl text-[10px] font-mono text-cyan-400 pointer-events-none">
          💡 Click & Drag to Orbit 3D Model
        </div>
      </div>

      {/* Hardware Specifications Badges below 3D Model */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
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
