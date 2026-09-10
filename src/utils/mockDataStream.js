// DGMS Statutory Limits and Constants
export const DGMS_THRESHOLDS = {
  TILT_ADVISORY: 2.5,       // degrees (Advisory inspection)
  TILT_CRITICAL: 5.0,       // degrees (Site-wide evacuation)
  CRACK_ADVISORY: 2.0,      // mm dilation
  CRACK_CRITICAL: 4.0,      // mm dilation (Shear rupture imminent)
  CRACK_RATE_CRITICAL: 0.50,// mm/hr dilation rate
  VIBRATION_ADVISORY: 0.30, // g-force peak acceleration (micro-fracture)
  VIBRATION_CRITICAL: 0.65, // g-force (dynamic rock burst / roof rupture)
  MOISTURE_ADVISORY: 70.0,  // % pore-water saturation
  MOISTURE_CRITICAL: 88.0,  // % (liquefaction & loss of shear strength)
  CH4_ADVISORY: 0.75,       // % vol (Ventilation boost)
  CH4_POWER_TRIP: 1.25,     // % vol (Electrical interlock trip & evacuation)
  CO_ADVISORY: 25.0,        // ppm (Spontaneous combustion early warning)
  CO_CRITICAL: 50.0,        // ppm
  O2_MIN_SAFE: 19.5,        // % minimum breathable O2
  TEMP_ADVISORY: 38.0       // °C Wet Bulb
};

export const INITIAL_NODES = [
  {
    id: 'NODE-01',
    name: 'Extraction Face 3-A',
    zone: 'Active Longwall Panel',
    seam: 'Seam #3 (Bituminous)',
    x: 130,
    y: 220,
    depth: '185m Subterranean',
    coords: '22.3582° N, 82.6841° E',
    mounting: 'Roof Anchor Cross-Bolt #12',
    image: '/images/sensor_node.jpg',
    thermalFeed: '/images/thermal_crack.jpg',
    fogFeed: '/images/fog_camera.jpg',
    tiltX: 0.8,
    tiltY: 0.5,
    crackDisplacement: 0.35,
    crackRate: 0.04, // mm/hr
    vibrationG: 0.06, // g
    moisture: 42.5, // %
    ch4: 0.22,
    co: 6.5,
    o2: 20.8,
    temperature: 29.4,
    humidity: 78.2,
    battery: 98,
    rssi: -72,
    status: 'normal',
    lastSeen: 'Just now'
  },
  {
    id: 'NODE-02',
    name: 'Main Intake Trunk',
    zone: 'Gallery North #1',
    seam: 'Seam #3 (Main Haulage)',
    x: 290,
    y: 130,
    depth: '172m Subterranean',
    coords: '22.3590° N, 82.6855° E',
    mounting: 'Pillar Haulage Strut P-04',
    image: '/images/sensor_node.jpg',
    thermalFeed: '/images/thermal_crack.jpg',
    fogFeed: '/images/fog_camera.jpg',
    tiltX: 0.4,
    tiltY: 0.3,
    crackDisplacement: 0.18,
    crackRate: 0.01,
    vibrationG: 0.04,
    moisture: 38.0,
    ch4: 0.14,
    co: 4.2,
    o2: 20.9,
    temperature: 28.1,
    humidity: 74.0,
    battery: 94,
    rssi: -68,
    status: 'normal',
    lastSeen: 'Just now'
  },
  {
    id: 'NODE-03',
    name: 'Central Pillar Cluster',
    zone: 'Pillar 14-B (High Stress)',
    seam: 'Seam #3 (Deep Strata)',
    x: 480,
    y: 130,
    depth: '210m Subterranean',
    coords: '22.3601° N, 82.6870° E',
    mounting: 'Stress Concentration Wedge Anchor',
    image: '/images/sensor_node.jpg',
    thermalFeed: '/images/thermal_crack.jpg',
    fogFeed: '/images/fog_camera.jpg',
    tiltX: 1.1,
    tiltY: 0.7,
    crackDisplacement: 0.45,
    crackRate: 0.05,
    vibrationG: 0.09,
    moisture: 48.0,
    ch4: 0.28,
    co: 8.0,
    o2: 20.7,
    temperature: 30.2,
    humidity: 81.5,
    battery: 91,
    rssi: -76,
    status: 'normal',
    lastSeen: 'Just now'
  },
  {
    id: 'NODE-04',
    name: 'Ventilation Return Shaft',
    zone: 'Shaft 2 Exhaust Face',
    seam: 'Upper Strata Vent',
    x: 650,
    y: 220,
    depth: '160m Subterranean',
    coords: '22.3615° N, 82.6888° E',
    mounting: 'Return Airway Bulkhead Mount',
    image: '/images/sensor_node.jpg',
    thermalFeed: '/images/thermal_crack.jpg',
    fogFeed: '/images/fog_camera.jpg',
    tiltX: 0.6,
    tiltY: 0.4,
    crackDisplacement: 0.22,
    crackRate: 0.02,
    vibrationG: 0.05,
    moisture: 55.0,
    ch4: 0.35,
    co: 9.1,
    o2: 20.5,
    temperature: 31.8,
    humidity: 85.0,
    battery: 89,
    rssi: -81,
    status: 'normal',
    lastSeen: 'Just now'
  },
  {
    id: 'NODE-05',
    name: 'South Dip Gallery',
    zone: 'Sub-Panel South-02',
    seam: 'Seam #4 Overburden',
    x: 480,
    y: 310,
    depth: '198m Subterranean',
    coords: '22.3570° N, 82.6860° E',
    mounting: 'Dip Floor Piezometer Cradle',
    image: '/images/sensor_node.jpg',
    thermalFeed: '/images/thermal_crack.jpg',
    fogFeed: '/images/fog_camera.jpg',
    tiltX: 0.9,
    tiltY: 0.6,
    crackDisplacement: 0.38,
    crackRate: 0.03,
    vibrationG: 0.07,
    moisture: 62.0,
    ch4: 0.19,
    co: 5.4,
    o2: 20.8,
    temperature: 29.8,
    humidity: 79.4,
    battery: 95,
    rssi: -74,
    status: 'normal',
    lastSeen: 'Just now'
  },
  {
    id: 'NODE-06',
    name: 'Surface Datum Reference',
    zone: 'Stable Overburden Benchmark',
    seam: 'Surface Reference Station',
    x: 290,
    y: 310,
    depth: '0m Surface Pillar',
    coords: '22.3550° N, 82.6830° E',
    mounting: 'Bedrock Concrete Surface Monument',
    image: '/images/sensor_node.jpg',
    thermalFeed: '/images/thermal_crack.jpg',
    fogFeed: '/images/fog_camera.jpg',
    tiltX: 0.1,
    tiltY: 0.1,
    crackDisplacement: 0.05,
    crackRate: 0.00,
    vibrationG: 0.01,
    moisture: 24.0,
    ch4: 0.02,
    co: 1.0,
    o2: 20.9,
    temperature: 26.5,
    humidity: 68.0,
    battery: 100,
    rssi: -62,
    status: 'normal',
    lastSeen: 'Just now'
  }
];

export function calculateCMSI(nodes) {
  // Composite Mine Safety Index: 0 (Deadly/Collapse) to 100 (Pristine Safe)
  let maxTilt = 0;
  let maxCrack = 0;
  let maxCH4 = 0;
  let maxCO = 0;

  nodes.forEach(node => {
    const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
    if (totalTilt > maxTilt) maxTilt = totalTilt;
    if (node.crackDisplacement > maxCrack) maxCrack = node.crackDisplacement;
    if (node.ch4 > maxCH4) maxCH4 = node.ch4;
    if (node.co > maxCO) maxCO = node.co;
  });

  // Calculate penalties
  let penalty = 0;

  // Tilt penalty
  if (maxTilt >= DGMS_THRESHOLDS.TILT_CRITICAL) {
    penalty += 45 + (maxTilt - DGMS_THRESHOLDS.TILT_CRITICAL) * 10;
  } else if (maxTilt >= DGMS_THRESHOLDS.TILT_ADVISORY) {
    penalty += 15 + ((maxTilt - DGMS_THRESHOLDS.TILT_ADVISORY) / (DGMS_THRESHOLDS.TILT_CRITICAL - DGMS_THRESHOLDS.TILT_ADVISORY)) * 25;
  } else {
    penalty += (maxTilt / DGMS_THRESHOLDS.TILT_ADVISORY) * 8;
  }

  // Crack penalty
  if (maxCrack >= DGMS_THRESHOLDS.CRACK_CRITICAL) {
    penalty += 35 + (maxCrack - DGMS_THRESHOLDS.CRACK_CRITICAL) * 12;
  } else if (maxCrack >= DGMS_THRESHOLDS.CRACK_ADVISORY) {
    penalty += 12 + ((maxCrack - DGMS_THRESHOLDS.CRACK_ADVISORY) / (DGMS_THRESHOLDS.CRACK_CRITICAL - DGMS_THRESHOLDS.CRACK_ADVISORY)) * 20;
  } else {
    penalty += (maxCrack / DGMS_THRESHOLDS.CRACK_ADVISORY) * 5;
  }

  // Gas penalties
  if (maxCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP) {
    penalty += 40;
  } else if (maxCH4 >= DGMS_THRESHOLDS.CH4_ADVISORY) {
    penalty += 15;
  }

  if (maxCO >= DGMS_THRESHOLDS.CO_CRITICAL) {
    penalty += 30;
  } else if (maxCO >= DGMS_THRESHOLDS.CO_ADVISORY) {
    penalty += 10;
  }

  const cmsi = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  return cmsi;
}

export function evaluateNodeStatus(node) {
  const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
  if (
    totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL ||
    node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL ||
    node.ch4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP ||
    node.co >= DGMS_THRESHOLDS.CO_CRITICAL
  ) {
    return 'critical';
  }
  if (
    totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY ||
    node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY ||
    node.ch4 >= DGMS_THRESHOLDS.CH4_ADVISORY ||
    node.co >= DGMS_THRESHOLDS.CO_ADVISORY
  ) {
    return 'advisory';
  }
  return 'normal';
}

export function generateInitialChartHistory() {
  const history = [];
  const now = Date.now();
  for (let i = 15; i >= 0; i--) {
    const t = new Date(now - i * 3000);
    const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    history.push({
      time: timeStr,
      tilt: +(0.8 + Math.sin(i * 0.4) * 0.15).toFixed(2),
      crack: +(0.32 + Math.cos(i * 0.3) * 0.05).toFixed(2),
      ch4: +(0.22 + Math.sin(i * 0.2) * 0.03).toFixed(2),
      co: +(6.5 + Math.cos(i * 0.5) * 0.8).toFixed(1)
    });
  }
  return history;
}
