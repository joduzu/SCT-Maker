import React, { createContext, useContext, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { DEFAULT_SIMULATION_CONFIG } from '../constants/simulationDefaults';
import { SimulationContextValue } from '../types/simulation.types';
import { useLayoutContext } from './LayoutContext';

const SimulationContext = createContext<SimulationContextValue | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { layoutState } = useLayoutContext();
  const simulation = useSimulation(layoutState, DEFAULT_SIMULATION_CONFIG);

  const value = useMemo<SimulationContextValue>(() => simulation, [simulation]);

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulationContext = (): SimulationContextValue => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within SimulationProvider');
  }
  return context;
};
