import React from 'react';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { Area } from '../../types/layout.types';

export const PropertyInspector: React.FC = () => {
  const { layoutState, selectedAreaId, updateArea, deleteArea, setAreaProperties } = useLayoutContext();
  const selectedArea = layoutState.areas.find((area) => area.id === selectedAreaId) ?? null;

  if (!selectedArea) {
    return (
      <div style={{ padding: '12px 0', color: '#64748b', fontStyle: 'italic' }}>
        Selecciona un área para editar sus propiedades.
      </div>
    );
  }

  const updateField = <K extends keyof Area>(field: K, value: Area[K]) => {
    updateArea(selectedArea.id, { [field]: value } as Partial<Area>);
  };

  return (
    <div className="properties-grid">
      <div>
        <label htmlFor="area-name">Nombre</label>
        <input
          id="area-name"
          value={selectedArea.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="area-type">Tipo</label>
        <input
          id="area-type"
          value={selectedArea.type}
          onChange={(event) => updateField('type', event.target.value)}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        <div>
          <label htmlFor="area-width">Ancho (m)</label>
          <input
            id="area-width"
            type="number"
            value={selectedArea.dimensions.width}
            onChange={(event) => updateField('dimensions', { ...selectedArea.dimensions, width: Number(event.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="area-height">Alto (m)</label>
          <input
            id="area-height"
            type="number"
            value={selectedArea.dimensions.height}
            onChange={(event) => updateField('dimensions', { ...selectedArea.dimensions, height: Number(event.target.value) })}
          />
        </div>
      </div>
      <div>
        <label htmlFor="area-capacity">Capacidad</label>
        <input
          id="area-capacity"
          type="number"
          value={selectedArea.properties.capacity}
          onChange={(event) =>
            setAreaProperties(selectedArea.id, { capacity: Number(event.target.value) })
          }
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        <div>
          <label htmlFor="area-process">Tiempo de proceso (min)</label>
          <input
            id="area-process"
            type="number"
            value={selectedArea.properties.processTime}
            onChange={(event) =>
              setAreaProperties(selectedArea.id, { processTime: Number(event.target.value) })
            }
          />
        </div>
        <div>
          <label htmlFor="area-wait">Espera esperada (min)</label>
          <input
            id="area-wait"
            type="number"
            value={selectedArea.properties.expectedWaitTime}
            onChange={(event) =>
              setAreaProperties(selectedArea.id, { expectedWaitTime: Number(event.target.value) })
            }
          />
        </div>
      </div>
      <div>
        <label htmlFor="area-color">Color</label>
        <input
          id="area-color"
          type="color"
          value={selectedArea.properties.color}
          onChange={(event) => setAreaProperties(selectedArea.id, { color: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor="area-notes">Notas</label>
        <textarea
          id="area-notes"
          rows={3}
          value={selectedArea.notes}
          onChange={(event) => updateField('notes', event.target.value)}
        />
      </div>
      <div>
        <button
          onClick={() => deleteArea(selectedArea.id)}
          style={{
            background: '#ef4444',
            border: 'none',
            color: 'white',
            width: '100%',
            padding: '10px 12px',
            borderRadius: 12,
            cursor: 'pointer'
          }}
        >
          Eliminar área
        </button>
      </div>
    </div>
  );
};
