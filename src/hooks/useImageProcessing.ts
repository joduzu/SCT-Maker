import { useCallback, useState } from 'react';
import { Area } from '../types/layout.types';
import { getBoundingBox } from '../utils/geometryUtils';

interface CalibrationPoint {
  start: { x: number; y: number } | null;
  end: { x: number; y: number } | null;
  distance: number;
}

export const useImageProcessing = () => {
  const [image, setImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [calibration, setCalibration] = useState<CalibrationPoint>({ start: null, end: null, distance: 1 });

  const loadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
  }, []);

  const calibrate = useCallback((pixelDistance: number, realDistance: number) => {
    if (realDistance === 0) return;
    setScale(pixelDistance / realDistance);
  }, []);

  const traceRectangle = useCallback(
    (points: { start: { x: number; y: number }; end: { x: number; y: number } }): Area => {
      const position = {
        x: Math.min(points.start.x, points.end.x) / scale,
        y: Math.min(points.start.y, points.end.y) / scale
      };
      const dimensions = {
        width: Math.abs(points.end.x - points.start.x) / scale,
        height: Math.abs(points.end.y - points.start.y) / scale
      };
      return {
        id: 'temp-area',
        name: 'Área importada',
        category: 'CLINICAL',
        type: 'General',
        position,
        dimensions,
        properties: {
          capacity: Math.max(1, Math.round((dimensions.width * dimensions.height) / 10)),
          processTime: 15,
          expectedWaitTime: 10,
          priority: 3,
          staffRequired: 1,
          equipmentList: [],
          color: '#F87171'
        },
        status: 'active',
        notes: ''
      };
    },
    [scale]
  );

  const tracePolygon = useCallback(
    (points: { x: number; y: number }[]): Area => {
      const { position, dimensions } = getBoundingBox(points.map((point) => ({ x: point.x / scale, y: point.y / scale })));
      return {
        id: 'temp-area',
        name: 'Área importada',
        category: 'CLINICAL',
        type: 'General',
        position,
        dimensions,
        properties: {
          capacity: Math.max(1, Math.round((dimensions.width * dimensions.height) / 10)),
          processTime: 15,
          expectedWaitTime: 10,
          priority: 3,
          staffRequired: 1,
          equipmentList: [],
          color: '#F87171'
        },
        status: 'active',
        notes: ''
      };
    },
    [scale]
  );

  return {
    image,
    scale,
    calibration,
    loadImage,
    calibrate,
    traceRectangle,
    tracePolygon,
    setCalibration
  };
};
