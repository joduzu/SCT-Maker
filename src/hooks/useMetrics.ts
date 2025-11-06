import { useCallback, useMemo, useState } from 'react';
import { Area } from '../types/layout.types';
import { MetricsSnapshot } from '../types/metrics.types';
import { Bottleneck, Patient, SystemMetrics } from '../types/simulation.types';

export const useMetrics = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [history, setHistory] = useState<MetricsSnapshot[]>([]);
  const [snapshot, setSnapshot] = useState<MetricsSnapshot | null>(null);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);

  const refresh = useCallback((metrics: SystemMetrics, detectedBottlenecks: Bottleneck[]) => {
    const nextSnapshot: MetricsSnapshot = { ...metrics, generatedAt: Date.now() };
    setSnapshot(nextSnapshot);
    setHistory((prev) => [...prev.slice(-49), nextSnapshot]);
    setBottlenecks(detectedBottlenecks);
  }, []);

  const value = useMemo(
    () => ({
      metrics: snapshot ?? {
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
        byPatientType: new Map(),
        generatedAt: Date.now()
      },
      bottlenecks,
      setAreas,
      setPatients,
      refresh,
      history,
      setSnapshot,
      setHistory
    }),
    [snapshot, bottlenecks, history]
  );

  return value;
};
