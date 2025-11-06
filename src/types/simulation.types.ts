import { Dispatch, SetStateAction } from 'react';
import { Area } from './layout.types';

export interface FlowPathCondition {
  key: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
  value: number | string;
}

export interface FlowPath {
  from: string;
  to: string;
  probability: number;
  conditions?: FlowPathCondition[];
  avgTransitionTime: number;
}

export interface PatientType {
  id: string;
  name: string;
  description: string;
  priority: number;
  color: string;
  avgProcessTime: number;
  flowPath: FlowPath[];
}

export type PatientStatus = 'waiting' | 'in-service' | 'moving' | 'completed';

export interface PatientTimestamps {
  entry: number;
  currentAreaEntry: number;
  serviceStart: number | null;
  exit: number | null;
}

export interface PathHistory {
  area: string;
  entryTime: number;
  exitTime: number;
  waitTime: number;
  serviceTime: number;
}

export interface PatientMetrics {
  totalWaitTime: number;
  totalServiceTime: number;
  totalSystemTime: number;
}

export interface Patient {
  id: string;
  type: PatientType;
  status: PatientStatus;
  currentArea: string | null;
  targetArea: string | null;
  position: { x: number; y: number };
  timestamps: PatientTimestamps;
  path: PathHistory[];
  metrics: PatientMetrics;
}

export interface SimulationConfig {
  duration: number;
  speed: number;
  patientGeneration: {
    enabled: boolean;
    patterns: PatientGenerationPattern[];
  };
  randomness: {
    processingTimeVariance: number;
    arrivalTimeVariance: number;
    pathDecisionRandomness: number;
  };
  constraints: {
    maxPatientsPerArea: boolean;
    enforceCapacity: boolean;
    allowQueueing: boolean;
  };
}

export interface PatientGenerationPattern {
  patientType: string;
  rate: number;
  distribution: 'constant' | 'poisson' | 'normal';
  timeWindows?: TimeWindow[];
}

export interface TimeWindow {
  start: number;
  end: number;
  rateMultiplier: number;
}

export interface AreaMetrics {
  areaId: string;
  currentOccupancy: number;
  capacity: number;
  utilizationRate: number;
  avgWaitTime: number;
  avgServiceTime: number;
  queueLength: number;
  throughput: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface PatientTypeMetrics {
  type: string;
  count: number;
  avgSystemTime: number;
  avgWaitTime: number;
  completionRate: number;
}

export interface SystemMetrics {
  timestamp: number;
  global: {
    activePatients: number;
    totalProcessed: number;
    avgWaitTime: number;
    avgSystemTime: number;
    throughput: number;
    utilizationRate: number;
  };
  byArea: Map<string, AreaMetrics>;
  byPatientType: Map<string, PatientTypeMetrics>;
}

export interface Bottleneck {
  areaId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: {
    utilization: number;
    waitTimeRatio: number;
    queueLength: number;
    throughputDeficit: number;
  };
  recommendations: string[];
  impactedPatientTypes: string[];
  timestamp: number;
}

export interface SimulationState {
  patients: Patient[];
  isRunning: boolean;
  currentTime: number;
  metrics: SystemMetrics;
  bottlenecks: Bottleneck[];
}

export type SimulationUpdate = {
  patients: Patient[];
  metrics: SystemMetrics;
  bottlenecks: Bottleneck[];
};

export interface SimulationEngine {
  update(deltaTime: number): void;
  addPatient(type: PatientType): void;
  getMetrics(): SystemMetrics;
  getPatients(): Patient[];
  getBottlenecks(): Bottleneck[];
  reset(): void;
}

export type SimulationContextValue = SimulationState & {
  config: SimulationConfig;
  setConfig: Dispatch<SetStateAction<SimulationConfig>>;
  start: () => void;
  pause: () => void;
  reset: () => void;
  injectPatient: (type: PatientType) => void;
  setSpeed: (speed: number) => void;
};

export interface LayoutEditorContextValue {
  layout: Area[];
}

export interface LayoutAware {
  layoutAreas: Area[];
}

export interface BottleneckThreshold {
  utilization: number;
  waitTimeRatio: number;
  queueFactor: number;
}

export interface MetricsCalculatorInput {
  patients: Patient[];
  areas: Area[];
}

export interface MetricsCalculator {
  calculate(input: MetricsCalculatorInput): SystemMetrics;
}

export type AreaResolver = (areaId: string) => Area | undefined;

export type NextAreaDecider = (patient: Patient, areas: Area[]) => Area | null;

export interface LayoutAwareEngine extends SimulationEngine {
  setAreas(areas: Area[]): void;
}
