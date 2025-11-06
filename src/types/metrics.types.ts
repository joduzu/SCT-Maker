import { Area } from './layout.types';
import { AreaMetrics, Bottleneck, Patient, PatientTypeMetrics, SystemMetrics } from './simulation.types';

export interface MetricsCalculatorOptions {
  smoothingFactor: number;
}

export interface MetricsSnapshot extends SystemMetrics {
  generatedAt: number;
}

export interface MetricsContextValue {
  metrics: MetricsSnapshot;
  bottlenecks: Bottleneck[];
  setPatients: (patients: Patient[]) => void;
  setAreas: (areas: Area[]) => void;
  refresh: () => void;
  history: MetricsSnapshot[];
}

export interface MetricsByAreaRecord extends AreaMetrics {
  name: string;
  category: string;
}

export interface MetricsByPatientTypeRecord extends PatientTypeMetrics {
  typeName: string;
}
