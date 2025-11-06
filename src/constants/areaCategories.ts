import { AreaCategory } from '../types/layout.types';

export interface AreaTemplate {
  type: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultCapacity: number;
  defaultProcessTime: number;
  defaultWaitTime: number;
}

export interface AreaCategoryDefinition {
  id: AreaCategory;
  name: string;
  color: string;
  areas: AreaTemplate[];
}

export const AREA_CATEGORIES: AreaCategoryDefinition[] = [
  {
    id: 'WASH',
    name: 'WASH (Agua, Saneamiento e Higiene)',
    color: '#60A5FA',
    areas: [
      { type: 'Área de tratamiento de agua', defaultWidth: 6, defaultHeight: 6, defaultCapacity: 4, defaultProcessTime: 20, defaultWaitTime: 15 },
      { type: 'Letrinas personal', defaultWidth: 3, defaultHeight: 3, defaultCapacity: 2, defaultProcessTime: 5, defaultWaitTime: 3 },
      { type: 'Letrinas hospitalizados', defaultWidth: 4, defaultHeight: 3, defaultCapacity: 3, defaultProcessTime: 7, defaultWaitTime: 5 },
      { type: 'Letrinas ambulatorios', defaultWidth: 4, defaultHeight: 3, defaultCapacity: 4, defaultProcessTime: 5, defaultWaitTime: 4 },
      { type: 'Gestión de lodos fecales', defaultWidth: 5, defaultHeight: 4, defaultCapacity: 2, defaultProcessTime: 25, defaultWaitTime: 10 },
      { type: 'Estación de lavado de manos', defaultWidth: 3, defaultHeight: 2, defaultCapacity: 6, defaultProcessTime: 2, defaultWaitTime: 1 },
      { type: 'Duchas personal', defaultWidth: 5, defaultHeight: 3, defaultCapacity: 4, defaultProcessTime: 10, defaultWaitTime: 6 },
      { type: 'Duchas pacientes', defaultWidth: 6, defaultHeight: 3, defaultCapacity: 6, defaultProcessTime: 12, defaultWaitTime: 7 },
      { type: 'Gestión de residuos', defaultWidth: 5, defaultHeight: 5, defaultCapacity: 3, defaultProcessTime: 20, defaultWaitTime: 10 },
      { type: 'Almacenamiento de residuos', defaultWidth: 4, defaultHeight: 4, defaultCapacity: 2, defaultProcessTime: 15, defaultWaitTime: 8 },
      { type: 'Segregación de residuos', defaultWidth: 4, defaultHeight: 4, defaultCapacity: 3, defaultProcessTime: 18, defaultWaitTime: 9 },
      { type: 'Lavandería', defaultWidth: 6, defaultHeight: 4, defaultCapacity: 5, defaultProcessTime: 30, defaultWaitTime: 12 },
      { type: 'Sala de limpieza', defaultWidth: 4, defaultHeight: 4, defaultCapacity: 3, defaultProcessTime: 15, defaultWaitTime: 7 },
      { type: 'Morgue', defaultWidth: 5, defaultHeight: 4, defaultCapacity: 6, defaultProcessTime: 45, defaultWaitTime: 20 }
    ]
  },
  {
    id: 'IPC',
    name: 'IPC (Control de Infecciones)',
    color: '#34D399',
    areas: [
      { type: 'Área de reprocesamiento', defaultWidth: 5, defaultHeight: 4, defaultCapacity: 4, defaultProcessTime: 25, defaultWaitTime: 10 },
      { type: 'Esterilización', defaultWidth: 6, defaultHeight: 4, defaultCapacity: 4, defaultProcessTime: 35, defaultWaitTime: 15 },
      { type: 'Almacenamiento IPC', defaultWidth: 4, defaultHeight: 4, defaultCapacity: 3, defaultProcessTime: 10, defaultWaitTime: 5 },
      { type: 'Donning (Colocación EPP)', defaultWidth: 4, defaultHeight: 3, defaultCapacity: 6, defaultProcessTime: 8, defaultWaitTime: 4 },
      { type: 'Doffing (Retirada EPP)', defaultWidth: 4, defaultHeight: 3, defaultCapacity: 6, defaultProcessTime: 8, defaultWaitTime: 4 }
    ]
  },
  {
    id: 'LOGISTICS',
    name: 'Logística',
    color: '#FBBF24',
    areas: [
      { type: 'Comedor', defaultWidth: 8, defaultHeight: 6, defaultCapacity: 30, defaultProcessTime: 45, defaultWaitTime: 10 },
      { type: 'Cocina', defaultWidth: 8, defaultHeight: 6, defaultCapacity: 10, defaultProcessTime: 60, defaultWaitTime: 15 },
      { type: 'Almacenamiento general', defaultWidth: 6, defaultHeight: 6, defaultCapacity: 8, defaultProcessTime: 20, defaultWaitTime: 10 },
      { type: 'Sala de energía', defaultWidth: 5, defaultHeight: 5, defaultCapacity: 4, defaultProcessTime: 30, defaultWaitTime: 15 },
      { type: 'Almacén', defaultWidth: 5, defaultHeight: 5, defaultCapacity: 6, defaultProcessTime: 20, defaultWaitTime: 10 },
      { type: 'Almacén de medicamentos', defaultWidth: 5, defaultHeight: 4, defaultCapacity: 6, defaultProcessTime: 15, defaultWaitTime: 8 }
    ]
  },
  {
    id: 'CLINICAL',
    name: 'Clínica',
    color: '#F87171',
    areas: [
      { type: 'Área de espera', defaultWidth: 8, defaultHeight: 6, defaultCapacity: 24, defaultProcessTime: 20, defaultWaitTime: 15 },
      { type: 'Screening / Detección', defaultWidth: 6, defaultHeight: 5, defaultCapacity: 12, defaultProcessTime: 15, defaultWaitTime: 10 },
      { type: 'Triage', defaultWidth: 6, defaultHeight: 5, defaultCapacity: 10, defaultProcessTime: 12, defaultWaitTime: 10 },
      { type: 'Consulta externa', defaultWidth: 6, defaultHeight: 6, defaultCapacity: 8, defaultProcessTime: 20, defaultWaitTime: 15 },
      { type: 'Sala de hospitalización', defaultWidth: 10, defaultHeight: 8, defaultCapacity: 16, defaultProcessTime: 120, defaultWaitTime: 30 },
      { type: 'Sala de emergencias', defaultWidth: 8, defaultHeight: 8, defaultCapacity: 12, defaultProcessTime: 60, defaultWaitTime: 20 },
      { type: 'Reanimación', defaultWidth: 6, defaultHeight: 6, defaultCapacity: 6, defaultProcessTime: 40, defaultWaitTime: 15 },
      { type: 'Quirófano', defaultWidth: 7, defaultHeight: 7, defaultCapacity: 4, defaultProcessTime: 90, defaultWaitTime: 30 },
      { type: 'Sala de partos', defaultWidth: 7, defaultHeight: 6, defaultCapacity: 4, defaultProcessTime: 120, defaultWaitTime: 40 },
      { type: 'UCI', defaultWidth: 8, defaultHeight: 6, defaultCapacity: 6, defaultProcessTime: 240, defaultWaitTime: 45 },
      { type: 'Farmacia', defaultWidth: 6, defaultHeight: 4, defaultCapacity: 6, defaultProcessTime: 18, defaultWaitTime: 12 },
      { type: 'Laboratorio', defaultWidth: 6, defaultHeight: 5, defaultCapacity: 6, defaultProcessTime: 35, defaultWaitTime: 15 },
      { type: 'Radiología', defaultWidth: 7, defaultHeight: 6, defaultCapacity: 5, defaultProcessTime: 45, defaultWaitTime: 20 },
      { type: 'Área de recuperación', defaultWidth: 7, defaultHeight: 6, defaultCapacity: 8, defaultProcessTime: 60, defaultWaitTime: 25 }
    ]
  }
];
