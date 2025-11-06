import { Area } from '../types/layout.types';
import {
  AreaMetrics,
  Patient,
  PatientTypeMetrics,
  SystemMetrics
} from '../types/simulation.types';

const toMinutes = (value: number) => value / 60000;

export const calculateMetrics = (
  { patients, areas }: { patients: Patient[]; areas: Area[] },
  currentTime: number
): SystemMetrics => {
  const activePatients = patients.filter((p) => p.status !== 'completed');
  const completedPatients = patients.filter((p) => p.status === 'completed');

  const avgWaitTime = completedPatients.length
    ? completedPatients.reduce((sum, patient) => sum + patient.metrics.totalWaitTime, 0) / completedPatients.length
    : 0;

  const avgSystemTime = completedPatients.length
    ? completedPatients.reduce((sum, patient) => sum + patient.metrics.totalSystemTime, 0) / completedPatients.length
    : 0;

  const byArea = new Map<string, AreaMetrics>();
  areas.forEach((area) => {
    const patientsInArea = activePatients.filter((patient) => patient.currentArea === area.id);
    const waiting = patientsInArea.filter((patient) => patient.status === 'waiting');
    const inService = patientsInArea.filter((patient) => patient.status === 'in-service');

    byArea.set(area.id, {
      areaId: area.id,
      currentOccupancy: patientsInArea.length,
      capacity: area.properties.capacity,
      utilizationRate: area.properties.capacity ? inService.length / area.properties.capacity : 0,
      avgWaitTime: waiting.length
        ? waiting.reduce((sum, patient) => sum + (currentTime - patient.timestamps.currentAreaEntry), 0) / waiting.length / 60000
        : 0,
      avgServiceTime: inService.length
        ? inService.reduce((sum, patient) => sum + (currentTime - (patient.timestamps.serviceStart ?? currentTime)), 0) /
            inService.length /
            60000
        : 0,
      queueLength: waiting.length,
      throughput: completedPatients.filter((patient) => patient.currentArea === area.id).length,
      status: deriveAreaStatus(patientsInArea.length, area.properties.capacity)
    });
  });

  const byType = new Map<string, PatientTypeMetrics>();
  patients.forEach((patient) => {
    const entry = byType.get(patient.type.id) ?? {
      type: patient.type.id,
      count: 0,
      avgSystemTime: 0,
      avgWaitTime: 0,
      completionRate: 0
    };

    entry.count += 1;
    if (patient.status === 'completed') {
      entry.avgSystemTime = (entry.avgSystemTime * (entry.count - 1) + toMinutes(patient.metrics.totalSystemTime)) / entry.count;
      entry.avgWaitTime = (entry.avgWaitTime * (entry.count - 1) + toMinutes(patient.metrics.totalWaitTime)) / entry.count;
      entry.completionRate = (entry.completionRate * (entry.count - 1) + 1) / entry.count;
    }

    byType.set(patient.type.id, entry);
  });

  return {
    timestamp: currentTime,
    global: {
      activePatients: activePatients.length,
      totalProcessed: completedPatients.length,
      avgWaitTime: toMinutes(avgWaitTime),
      avgSystemTime: toMinutes(avgSystemTime),
      throughput: completedPatients.length / (toMinutes(currentTime) || 1),
      utilizationRate: calculateUtilizationRatio(byArea)
    },
    byArea,
    byPatientType: byType
  };
};

const deriveAreaStatus = (occupancy: number, capacity: number): 'normal' | 'warning' | 'critical' => {
  if (!capacity) return 'normal';
  const utilization = occupancy / capacity;
  if (utilization >= 1) return 'critical';
  if (utilization >= 0.75) return 'warning';
  return 'normal';
};

const calculateUtilizationRatio = (metrics: Map<string, AreaMetrics>): number => {
  if (!metrics.size) return 0;
  const sum = Array.from(metrics.values()).reduce((acc, area) => acc + area.utilizationRate, 0);
  return sum / metrics.size;
};
