import { HospitalLayout } from '../types/layout.types';

export const EMPTY_LAYOUT: HospitalLayout = {
  id: 'layout-1',
  name: 'Hospital de Campaña',
  description: 'Plano base para planificación de flujo de pacientes',
  dimensions: { width: 40, height: 30 },
  scale: 1,
  gridSize: 1,
  areas: [],
  connections: [],
  metadata: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    author: 'Equipo HFA',
    version: '0.1.0'
  }
};
