import React from 'react';
import { AreaLibrary } from '../AreaLibrary/AreaLibrary';
import { LayoutCanvas } from './LayoutCanvas';
import { PropertyInspector } from '../PropertyPanel/PropertyInspector';
import { Toolbar } from './Toolbar';

export const LayoutEditorShell: React.FC = () => {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Editor de Layout</h2>
      </div>
      <div className="panel__body" style={{ display: 'grid', gap: 16, gridTemplateColumns: '240px 1fr 260px' }}>
        <AreaLibrary />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Toolbar />
          <LayoutCanvas />
        </div>
        <PropertyInspector />
      </div>
    </section>
  );
};
