import { useCallback, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { Area, AreaProperties, HospitalLayout, Position } from '../types/layout.types';
import { snapToGrid, clampDimensions } from '../utils/geometryUtils';

interface UseLayoutEditorResult {
  layout: HospitalLayout;
  selectedAreaId: string | null;
  addArea: (area: Omit<Area, 'id'>) => void;
  updateArea: (id: string, updates: Partial<Area>) => void;
  deleteArea: (id: string) => void;
  moveArea: (id: string, position: Position) => void;
  resizeArea: (id: string, dimensions: Area['dimensions']) => void;
  selectArea: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  duplicateArea: (id: string) => void;
  setAreaProperties: (id: string, properties: Partial<AreaProperties>) => void;
}

const MAX_HISTORY = 40;

const createHistoryEntry = (layout: HospitalLayout) => JSON.parse(JSON.stringify(layout)) as HospitalLayout;

export const useLayoutEditor = (initialLayout: HospitalLayout): UseLayoutEditorResult => {
  const [layout, setLayout] = useState<HospitalLayout>(initialLayout);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const historyRef = useRef<HospitalLayout[]>([createHistoryEntry(initialLayout)]);
  const historyIndexRef = useRef(0);

  const pushHistory = useCallback((nextLayout: HospitalLayout) => {
    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    history.push(createHistoryEntry(nextLayout));
    if (history.length > MAX_HISTORY) {
      history.shift();
    }
    historyRef.current = history;
    historyIndexRef.current = history.length - 1;
  }, []);

  const updateLayout = useCallback(
    (updater: (layout: HospitalLayout) => HospitalLayout) => {
      setLayout((current) => {
        const next = updater(current);
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const addArea = useCallback(
    (area: Omit<Area, 'id'>) => {
      updateLayout((current) => ({
        ...current,
        areas: [
          ...current.areas,
          {
            ...area,
            id: nanoid()
          }
        ],
        metadata: { ...current.metadata, modified: new Date().toISOString() }
      }));
    },
    [updateLayout]
  );

  const updateArea = useCallback(
    (id: string, updates: Partial<Area>) => {
      updateLayout((current) => ({
        ...current,
        areas: current.areas.map((area) => (area.id === id ? { ...area, ...updates } : area)),
        metadata: { ...current.metadata, modified: new Date().toISOString() }
      }));
    },
    [updateLayout]
  );

  const deleteArea = useCallback(
    (id: string) => {
      updateLayout((current) => ({
        ...current,
        areas: current.areas.filter((area) => area.id !== id),
        connections: current.connections.filter((connection) => connection.from !== id && connection.to !== id),
        metadata: { ...current.metadata, modified: new Date().toISOString() }
      }));
      if (selectedAreaId === id) {
        setSelectedAreaId(null);
      }
    },
    [selectedAreaId, updateLayout]
  );

  const moveArea = useCallback(
    (id: string, position: Position) => {
      updateLayout((current) => ({
        ...current,
        areas: current.areas.map((area) =>
          area.id === id
            ? {
                ...area,
                position: {
                  x: snapToGrid(position.x, current.gridSize),
                  y: snapToGrid(position.y, current.gridSize)
                }
              }
            : area
        )
      }));
    },
    [updateLayout]
  );

  const resizeArea = useCallback(
    (id: string, dimensions: Area['dimensions']) => {
      updateLayout((current) => ({
        ...current,
        areas: current.areas.map((area) =>
          area.id === id
            ? { ...area, dimensions: clampDimensions(dimensions, current.gridSize) }
            : area
        )
      }));
    },
    [updateLayout]
  );

  const setAreaProperties = useCallback(
    (id: string, properties: Partial<AreaProperties>) => {
      updateLayout((current) => ({
        ...current,
        areas: current.areas.map((area) => (area.id === id ? { ...area, properties: { ...area.properties, ...properties } } : area))
      }));
    },
    [updateLayout]
  );

  const duplicateArea = useCallback(
    (id: string) => {
      const area = layout.areas.find((item) => item.id === id);
      if (!area) return;
      const { id: _ignored, ...rest } = area;
      addArea({
        ...rest,
        name: `${area.name} copia`
      });
    },
    [addArea, layout.areas]
  );

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const snapshot = historyRef.current[historyIndexRef.current];
    setLayout(snapshot);
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const snapshot = historyRef.current[historyIndexRef.current];
    setLayout(snapshot);
  }, []);

  const selectArea = useCallback((id: string | null) => {
    setSelectedAreaId(id);
  }, []);

  const value = useMemo(
    () => ({
      layout,
      selectedAreaId,
      addArea,
      updateArea,
      deleteArea,
      moveArea,
      resizeArea,
      selectArea,
      undo,
      redo,
      canUndo: historyIndexRef.current > 0,
      canRedo: historyIndexRef.current < historyRef.current.length - 1,
      duplicateArea,
      setAreaProperties
    }),
    [layout, selectedAreaId, addArea, updateArea, deleteArea, moveArea, resizeArea, selectArea, undo, redo, duplicateArea, setAreaProperties]
  );

  return value;
};
