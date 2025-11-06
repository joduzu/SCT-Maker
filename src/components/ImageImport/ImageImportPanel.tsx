import React, { useRef } from 'react';
import { useImageProcessing } from '../../hooks/useImageProcessing';
import { useLayoutContext } from '../../contexts/LayoutContext';

export const ImageImportPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadImage, calibrate, image, scale } = useImageProcessing();
  const { addArea } = useLayoutContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 10,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)'
          }}
        >
          Importar plano
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,.pdf" hidden onChange={handleFileChange} />
      </div>
      {image && (
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
          Plano cargado · Escala actual: 1:{scale.toFixed(2)}
        </div>
      )}
      <button
        onClick={() => {
          calibrate(100, 10);
          addArea({
            name: 'Área importada',
            category: 'CLINICAL',
            type: 'Importada',
            position: { x: 2, y: 2 },
            dimensions: { width: 6, height: 5 },
            properties: {
              capacity: 8,
              processTime: 20,
              expectedWaitTime: 10,
              priority: 3,
              staffRequired: 2,
              equipmentList: [],
              color: '#2563eb'
            },
            status: 'active',
            notes: 'Generada desde importación'
          });
        }}
        style={{
          border: 'none',
          background: 'rgba(15,118,110,0.25)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: 10,
          cursor: 'pointer'
        }}
      >
        Calibrar + generar ejemplo
      </button>
    </div>
  );
};
