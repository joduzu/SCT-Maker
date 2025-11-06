export type AreaCategory = 'WASH' | 'IPC' | 'LOGISTICS' | 'CLINICAL';

export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface AreaProperties {
  capacity: number;
  processTime: number;
  expectedWaitTime: number;
  priority: number;
  staffRequired: number;
  equipmentList: string[];
  color: string;
}

export interface Area {
  id: string;
  name: string;
  category: AreaCategory;
  type: string;
  position: Position;
  dimensions: Dimensions;
  properties: AreaProperties;
  status: 'active' | 'inactive' | 'maintenance';
  notes: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  bidirectional: boolean;
  distance: number;
  type: 'primary' | 'secondary' | 'emergency';
}

export interface HospitalLayoutMetadata {
  created: string;
  modified: string;
  author: string;
  version: string;
}

export interface HospitalLayoutDimensions {
  width: number;
  height: number;
}

export interface HospitalLayout {
  id: string;
  name: string;
  description: string;
  dimensions: HospitalLayoutDimensions;
  scale: number;
  gridSize: number;
  areas: Area[];
  connections: Connection[];
  metadata: HospitalLayoutMetadata;
}
