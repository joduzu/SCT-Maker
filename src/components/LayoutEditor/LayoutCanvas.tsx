import React, { useMemo, useState } from 'react';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { Area } from '../../types/layout.types';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface DraggingState {
  area: Area;
  offsetX: number;
  offsetY: number;
}

export const LayoutCanvas: React.FC = () => {
  const { layoutState, moveArea, selectArea, selectedAreaId, resizeArea } = useLayoutContext();
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [resizing, setResizing] = useState<{ areaId: string; anchor: 'se'; originWidth: number; originHeight: number } | null>(
    null
  );
  const { onEnd } = useDragAndDrop();

  const canvasSize = useMemo(() => ({
    width: layoutState.dimensions.width * layoutState.gridSize * 20,
    height: layoutState.dimensions.height * layoutState.gridSize * 20
  }), [layoutState.dimensions.width, layoutState.dimensions.height, layoutState.gridSize]);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (dragging) {
      const svg = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - svg.left) / 20;
      const y = (event.clientY - svg.top) / 20;
      moveArea(dragging.area.id, {
        x: x - dragging.offsetX,
        y: y - dragging.offsetY
      });
    }

    if (resizing) {
      const svg = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - svg.left) / 20;
      const y = (event.clientY - svg.top) / 20;
      const area = layoutState.areas.find((item) => item.id === resizing.areaId);
      if (!area) return;
      resizeArea(resizing.areaId, {
        width: Math.max(1, x - area.position.x),
        height: Math.max(1, y - area.position.y)
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
    onEnd();
  };

  const handleDragStart = (event: React.MouseEvent<SVGRectElement>, area: Area) => {
    const svg = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!svg) return;
    const offsetX = (event.clientX - svg.left) / 20 - area.position.x;
    const offsetY = (event.clientY - svg.top) / 20 - area.position.y;
    setDragging({ area, offsetX, offsetY });
  };

  const handleResizeStart = (event: React.MouseEvent<SVGCircleElement>, area: Area) => {
    event.stopPropagation();
    setResizing({ areaId: area.id, anchor: 'se', originWidth: area.dimensions.width, originHeight: area.dimensions.height });
  };

  return (
    <div className="canvas-container">
      <svg
        className="layout-canvas"
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {layoutState.areas.map((area) => (
          <g key={area.id} transform={`translate(${area.position.x * 20}, ${area.position.y * 20})`}>
            <rect
              className="area-rect"
              width={area.dimensions.width * 20}
              height={area.dimensions.height * 20}
              fill={area.properties.color}
              opacity={selectedAreaId === area.id ? 0.85 : 0.65}
              stroke={selectedAreaId === area.id ? '#1d4ed8' : 'rgba(15,23,42,0.35)'}
              strokeWidth={2}
              rx={8}
              onMouseDown={(event) => {
                handleDragStart(event, area);
                selectArea(area.id);
              }}
            />
            <text x={12} y={20} fill="#0f172a" fontSize={12} fontWeight={600} pointerEvents="none">
              {area.name}
            </text>
            <text x={12} y={36} fill="#1f2937" fontSize={10} opacity={0.8} pointerEvents="none">
              {area.type}
            </text>
            {selectedAreaId === area.id && (
              <circle
                className="resize-handle"
                cx={area.dimensions.width * 20}
                cy={area.dimensions.height * 20}
                r={6}
                onMouseDown={(event) => handleResizeStart(event, area)}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
