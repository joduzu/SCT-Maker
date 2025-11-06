import { calculateDistance } from './geometryUtils';
import {
  Area,
  Connection
} from '../types/layout.types';
import {
  Bottleneck,
  Patient,
  PatientType,
  SimulationConfig,
  SystemMetrics,
  AreaMetrics,
  PatientTypeMetrics
} from '../types/simulation.types';
import { detectBottlenecks } from './bottleneckDetector';
import { calculateMetrics } from './metricsCalculator';

const MOVEMENT_SPEED = 1.2; // metros por segundo base

export class BasicSimulationEngine {
  private patients: Map<string, Patient> = new Map();
  private areas: Map<string, Area> = new Map();
  private connections: Connection[] = [];
  private currentTime = 0;

  constructor(private layoutAreas: Area[], private layoutConnections: Connection[], private config: SimulationConfig) {
    this.setAreas(layoutAreas);
    this.connections = layoutConnections;
  }

  public setAreas(areas: Area[]): void {
    this.areas.clear();
    areas.forEach((area) => this.areas.set(area.id, area));
  }

  public update(deltaTime: number): void {
    this.currentTime += deltaTime;
    const deltaSeconds = deltaTime / 1000;

    for (const patient of this.patients.values()) {
      if (patient.status === 'moving' && patient.targetArea) {
        this.movePatient(patient, deltaSeconds);
      }

      if (patient.status === 'waiting' && patient.currentArea) {
        const area = this.areas.get(patient.currentArea);
        if (!area) continue;

        patient.metrics.totalWaitTime += deltaTime;
        const occupancy = this.getAreaOccupancy(area.id);
        if (occupancy < area.properties.capacity || !this.config.constraints.enforceCapacity) {
          patient.status = 'in-service';
          patient.timestamps.serviceStart = this.currentTime;
        }
      }

      if (patient.status === 'in-service' && patient.currentArea) {
        const area = this.areas.get(patient.currentArea);
        if (!area) continue;

        const elapsed = this.currentTime - (patient.timestamps.serviceStart ?? this.currentTime);
        const expected = area.properties.processTime * 60 * 1000;
        if (elapsed >= expected) {
          patient.metrics.totalServiceTime += expected;
          this.advancePatient(patient, area);
        }
      }
    }
  }

  public addPatient(type: PatientType): void {
    const entryArea = this.findEntryArea(type);
    if (!entryArea) return;

    const now = this.currentTime;
    const patient: Patient = {
      id: `patient-${now}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      status: 'waiting',
      currentArea: entryArea.id,
      targetArea: null,
      position: { ...entryArea.position },
      timestamps: {
        entry: now,
        currentAreaEntry: now,
        serviceStart: null,
        exit: null
      },
      path: [],
      metrics: {
        totalWaitTime: 0,
        totalServiceTime: 0,
        totalSystemTime: 0
      }
    };

    this.patients.set(patient.id, patient);
  }

  public reset(): void {
    this.patients.clear();
    this.currentTime = 0;
  }

  public getMetrics(): SystemMetrics {
    return calculateMetrics({ patients: Array.from(this.patients.values()), areas: Array.from(this.areas.values()) }, this.currentTime);
  }

  public getPatients(): Patient[] {
    return Array.from(this.patients.values());
  }

  public getBottlenecks(): Bottleneck[] {
    const metrics = this.getMetrics();
    return detectBottlenecks(Array.from(this.areas.values()), metrics.byArea, {
      utilization: 0.85,
      waitTimeRatio: 1.5,
      queueFactor: 1.0
    });
  }

  private movePatient(patient: Patient, deltaSeconds: number): void {
    if (!patient.targetArea) return;
    const target = this.areas.get(patient.targetArea);
    const currentArea = patient.currentArea ? this.areas.get(patient.currentArea) : undefined;
    if (!target || !currentArea) return;

    const distance = calculateDistance(patient.position, target.position);
    const speed = MOVEMENT_SPEED * (1 + patient.type.priority * 0.15);
    const step = speed * deltaSeconds;

    if (distance <= step) {
      patient.position = { ...target.position };
      patient.currentArea = target.id;
      patient.targetArea = null;
      patient.status = 'waiting';
      patient.timestamps.currentAreaEntry = this.currentTime;
    } else {
      const ratio = step / distance;
      patient.position = {
        x: patient.position.x + (target.position.x - patient.position.x) * ratio,
        y: patient.position.y + (target.position.y - patient.position.y) * ratio
      };
    }
  }

  private advancePatient(patient: Patient, area: Area): void {
    const nextArea = this.decideNextArea(patient, area);
    patient.path.push({
      area: area.id,
      entryTime: patient.timestamps.currentAreaEntry,
      exitTime: this.currentTime,
      waitTime: (patient.timestamps.serviceStart ?? this.currentTime) - patient.timestamps.currentAreaEntry,
      serviceTime: this.currentTime - (patient.timestamps.serviceStart ?? this.currentTime)
    });

    if (nextArea) {
      patient.status = 'moving';
      patient.targetArea = nextArea.id;
    } else {
      patient.status = 'completed';
      patient.timestamps.exit = this.currentTime;
      patient.metrics.totalSystemTime = this.currentTime - patient.timestamps.entry;
    }
  }

  private decideNextArea(patient: Patient, area: Area): Area | null {
    const paths = patient.type.flowPath.filter((path) => path.from === area.id);
    if (paths.length === 0) return null;

    const roll = Math.random();
    let cumulative = 0;
    for (const path of paths) {
      cumulative += path.probability;
      if (roll <= cumulative) {
        const target = this.areas.get(path.to);
        if (target) return target;
      }
    }
    return null;
  }

  private getAreaOccupancy(areaId: string): number {
    let occupancy = 0;
    for (const patient of this.patients.values()) {
      if (patient.currentArea === areaId && patient.status !== 'moving') {
        occupancy += 1;
      }
    }
    return occupancy;
  }

  private findEntryArea(type: PatientType): Area | undefined {
    const entryPath = type.flowPath.find((path) => path.from === 'ENTRY');
    if (!entryPath) return undefined;
    return this.areas.get(entryPath.to);
  }
}

export const mapMetricsRecord = (metrics: SystemMetrics): {
  byArea: AreaMetrics[];
  byPatientType: PatientTypeMetrics[];
} => ({
  byArea: Array.from(metrics.byArea.values()),
  byPatientType: Array.from(metrics.byPatientType.values())
});
