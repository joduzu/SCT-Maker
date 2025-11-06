import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HospitalLayout } from '../types/layout.types';
import {
  Bottleneck,
  Patient,
  PatientType,
  SimulationConfig,
  SimulationContextValue,
  SystemMetrics
} from '../types/simulation.types';
import { BasicSimulationEngine } from '../utils/simulationEngine';
import { calculateMetrics } from '../utils/metricsCalculator';

const INITIAL_METRICS: SystemMetrics = {
  timestamp: 0,
  global: {
    activePatients: 0,
    totalProcessed: 0,
    avgWaitTime: 0,
    avgSystemTime: 0,
    throughput: 0,
    utilizationRate: 0
  },
  byArea: new Map(),
  byPatientType: new Map()
};

export const useSimulation = (layout: HospitalLayout, config: SimulationConfig): SimulationContextValue => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [simulationConfig, setSimulationConfig] = useState(config);
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(performance.now());
  const engineRef = useRef(new BasicSimulationEngine(layout.areas, layout.connections, simulationConfig));

  useEffect(() => {
    engineRef.current = new BasicSimulationEngine(layout.areas, layout.connections, simulationConfig);
    setPatients([]);
    setMetrics(INITIAL_METRICS);
    setBottlenecks([]);
    setCurrentTime(0);
  }, [layout, simulationConfig]);

  const step = useCallback(() => {
    const now = performance.now();
    const delta = now - lastUpdateRef.current;
    lastUpdateRef.current = now;

    engineRef.current.update(delta * simulationConfig.speed);
    const nextPatients = engineRef.current.getPatients();
    const nextMetrics = engineRef.current.getMetrics();
    const nextBottlenecks = engineRef.current.getBottlenecks();

    setPatients(nextPatients);
    setMetrics(nextMetrics);
    setBottlenecks(nextBottlenecks);
    setCurrentTime(nextMetrics.timestamp);

    animationRef.current = requestAnimationFrame(step);
  }, [simulationConfig.speed]);

  useEffect(() => {
    if (!isRunning) return;
    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, step]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    engineRef.current.reset();
    setPatients([]);
    setMetrics(INITIAL_METRICS);
    setBottlenecks([]);
    setCurrentTime(0);
    setIsRunning(false);
  }, []);

  const injectPatient = useCallback((type: PatientType) => {
    engineRef.current.addPatient(type);
    const updatedPatients = engineRef.current.getPatients();
    setPatients(updatedPatients);
    setMetrics(calculateMetrics({ patients: updatedPatients, areas: layout.areas }, currentTime));
  }, [currentTime, layout.areas]);

  const setSpeed = useCallback((speed: number) => {
    setSimulationConfig((prev) => ({
      ...prev,
      speed
    }));
  }, []);

  const value = useMemo<SimulationContextValue>(
    () => ({
      patients,
      metrics,
      bottlenecks,
      isRunning,
      currentTime,
      config: simulationConfig,
      setConfig: setSimulationConfig,
      start,
      pause,
      reset,
      injectPatient,
      setSpeed
    }),
    [patients, metrics, bottlenecks, isRunning, currentTime, simulationConfig, start, pause, reset, injectPatient, setSpeed]
  );

  return value;
};
