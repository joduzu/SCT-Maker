import { SimulationConfig } from '../types/simulation.types';

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  duration: 8 * 60,
  speed: 1,
  patientGeneration: {
    enabled: true,
    patterns: []
  },
  randomness: {
    processingTimeVariance: 0.2,
    arrivalTimeVariance: 0.15,
    pathDecisionRandomness: 0.1
  },
  constraints: {
    maxPatientsPerArea: true,
    enforceCapacity: true,
    allowQueueing: true
  }
};
