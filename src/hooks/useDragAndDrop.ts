import { useCallback, useState } from 'react';
import { Position } from '../types/layout.types';

interface DragState {
  isDragging: boolean;
  origin: Position | null;
  delta: Position;
}

export const useDragAndDrop = () => {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    origin: null,
    delta: { x: 0, y: 0 }
  });

  const onStart = useCallback((position: Position) => {
    setState({ isDragging: true, origin: position, delta: { x: 0, y: 0 } });
  }, []);

  const onMove = useCallback((position: Position) => {
    setState((prev) => {
      if (!prev.origin) return prev;
      return {
        ...prev,
        delta: {
          x: position.x - prev.origin.x,
          y: position.y - prev.origin.y
        }
      };
    });
  }, []);

  const onEnd = useCallback(() => {
    setState((prev) => ({ ...prev, isDragging: false, origin: null, delta: { x: 0, y: 0 } }));
  }, []);

  return {
    dragState: state,
    onStart,
    onMove,
    onEnd
  };
};
