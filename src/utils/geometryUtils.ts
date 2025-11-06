import { Dimensions, Position } from '../types/layout.types';

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const clampDimensions = (dimensions: Dimensions, minSize = 1): Dimensions => ({
  width: Math.max(dimensions.width, minSize),
  height: Math.max(dimensions.height, minSize)
});

export const calculateDistance = (a: Position, b: Position): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const rectsOverlap = (
  a: Position,
  aDim: Dimensions,
  b: Position,
  bDim: Dimensions
): boolean => {
  return !(
    a.x + aDim.width <= b.x ||
    a.x >= b.x + bDim.width ||
    a.y + aDim.height <= b.y ||
    a.y >= b.y + bDim.height
  );
};

export const getBoundingBox = (points: Position[]): { position: Position; dimensions: Dimensions } => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return {
    position: { x: minX, y: minY },
    dimensions: { width: maxX - minX, height: maxY - minY }
  };
};
