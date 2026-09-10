import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DGMS_THRESHOLDS } from './mockDataStream';

export function generateDGMSReport({ nodes, cmsi, status, activeMiners = 48, shiftName = 'Shift-A' }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Header Banner
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.rect(0, 0, 210, 32, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DIRECTORATE GENERAL OF MINES SAFETY (DGMS)', 105, 12, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(56, 189, 248); // Neon cyan
  doc.text('STRATA CONTROL & MINE SUBSIDENCE REAL-TIME COMPLIANCE AUDIT', 105, 19, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Statutory Record under Coal Mines Regulations (CMR) 2017 - Regulation 111 & 112', 105, 26, { align: 'center' });

  // Mine & Shift Metadata Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 28, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Colliery / Unit:', 18, 45);
  doc.text('Underground Seam:', 18, 52);
  doc.text('Monitoring Zone:', 18, 59);

  doc.setFont('helvetica', 'normal');
  doc.text('SECL - Rajgamar Underground Colliery (Korba)', 50, 45);
  doc.text('Seam #3 (Bituminous Upper Horizon)', 50, 52);
  doc.text('Panel 3-A & Surrounding Surface Overburden', 50, 59);

  doc.setFont('helvetica', 'bold');
  doc.text('Report Date & Time:', 125, 45);
  doc.text('Working Shift:', 125, 52);
  doc.text('Active Manpower:', 125, 59);

  doc.setFont('helvetica', 'normal');
  doc.text(`${dateStr} | ${timeStr}`, 160, 45);
  doc.text(shiftName, 160, 52);
  doc.text(`${activeMiners} Personnel Tagged`, 160, 59);

  // Executive Safety Summary Card
  const isCritical = status === 'critical';
  const isAdvisory = status === 'advisory';
  const statusColor = isCritical ? [239, 68, 68] : isAdvisory ? [245, 158, 11] : [16, 185, 129];

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(14, 71, 182, 16, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const statusText = isCritical 
    ? 'CRITICAL ALERT - IMMEDIATE EVACUATION ORDER ISSUED'
    : isAdvisory 
    ? 'ADVISORY NOTICE - STRATA ANOMALY DETECTED (INSPECTION REQUIRED)'
    : 'NORMAL OPERATIONAL STATUS - STRATA WITHIN STATUTORY LIMITS';

  doc.text(`CMSI SAFETY SCORE: ${cmsi} / 100  |  STATUS: ${statusText}`, 105, 81, { align: 'center' });

  // Telemetry Data Table
  const tableData = nodes.map(node => {
    const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY).toFixed(2);
    const compliant = totalTilt < DGMS_THRESHOLDS.TILT_ADVISORY && node.crackDisplacement < DGMS_THRESHOLDS.CRACK_ADVISORY;
    const alertLevel = totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL
      ? 'CRITICAL'
      : totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY
      ? 'ADVISORY'
      : 'COMPLIANT';

    return [
      node.id,
      node.name,
      `${totalTilt}°`,
      `${node.crackDisplacement} mm`,
      `${node.ch4}%`,
      `${node.co} ppm`,
      `${node.battery}%`,
      alertLevel
    ];
  });

  autoTable(doc, {
    startY: 93,
    head: [[
      'Node ID', 
      'Zone / Gallery Location', 
      'Biaxial Tilt', 
      'Crack Width', 
      'CH4 (% vol)', 
      'CO (ppm)', 
      'LoRa Bat', 
      'DGMS Status'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      halign: 'center'
    },
    columnStyles: {
      1: { halign: 'left' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 7) {
        if (data.cell.raw === 'CRITICAL') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'ADVISORY') {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [5, 150, 105];
        }
      }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Statutory Limits Reference Note
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Statutory DGMS Trigger Reference Limits:', 14, finalY);
  doc.text('• Strata Tilt Warning: > 2.5° | Strata Tilt Critical: > 5.0°', 14, finalY + 4);
  doc.text('• Crack Dilation Warning: > 2.0 mm | Rate: > 0.5 mm/hr (Immediate Shear Failure Indicator)', 14, finalY + 8);
  doc.text('• Methane (CH4) Advisory: 0.75% vol | Power Trip Limit: 1.25% vol', 14, finalY + 12);
  doc.text('• Carbon Monoxide (CO) Advisory: 25 ppm | Spontaneous Combustion Danger: 50 ppm', 14, finalY + 16);

  // Sign-off section
  const signY = finalY + 28;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, signY, 70, signY);
  doc.line(85, signY, 135, signY);
  doc.line(145, signY, 195, signY);

  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text('Mine Safety Officer', 45, signY + 4, { align: 'center' });
  doc.text('Geotechnical Strata Engineer', 110, signY + 4, { align: 'center' });
  doc.text('Colliery General Manager (Agent)', 170, signY + 4, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('(Digitally Verified via GeoSentinel Telemetry Engine)', 105, signY + 14, { align: 'center' });

  // Save the PDF
  doc.save(`DGMS_Shift_Safety_Report_${shiftName}_${dateStr.replace(/ /g, '_')}.pdf`);
}
