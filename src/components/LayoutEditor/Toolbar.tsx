import React from 'react';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { exportLayoutToJson } from '../../utils/exportUtils';

export const Toolbar: React.FC = () => {
  const { undo, redo, canUndo, canRedo, layoutState } = useLayoutContext();

  return (
    <div className="toolbar">
      <button onClick={undo} disabled={!canUndo}>
        Deshacer
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Rehacer
      </button>
      <button onClick={() => exportLayoutToJson(layoutState)}>Exportar Layout</button>
    </div>
  );
};
