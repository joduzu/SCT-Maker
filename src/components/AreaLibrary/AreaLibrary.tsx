import React, { useMemo, useState } from 'react';
import { AREA_CATEGORIES } from '../../constants/areaCategories';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { Area } from '../../types/layout.types';

export const AreaLibrary: React.FC = () => {
  const { addArea, layoutState } = useLayoutContext();
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    if (!search) return AREA_CATEGORIES;
    return AREA_CATEGORIES.map((category) => ({
      ...category,
      areas: category.areas.filter((area) => area.type.toLowerCase().includes(search.toLowerCase()))
    })).filter((category) => category.areas.length > 0);
  }, [search]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData('application/json');
    if (!payload) return;
    const template = JSON.parse(payload) as { category: string; type: string; color: string };
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * layoutState.dimensions.width;
    const y = ((event.clientY - rect.top) / rect.height) * layoutState.dimensions.height;
    createArea(template.category, template.type, template.color, x, y);
  };

  const createArea = (categoryId: string, type: string, color: string, x = 2, y = 2) => {
    const category = AREA_CATEGORIES.find((cat) => cat.id === categoryId);
    const template = category?.areas.find((area) => area.type === type);
    if (!category || !template) return;

    const area: Omit<Area, 'id'> = {
      name: template.type,
      category: category.id,
      type: template.type,
      position: { x, y },
      dimensions: { width: template.defaultWidth, height: template.defaultHeight },
      properties: {
        capacity: template.defaultCapacity,
        processTime: template.defaultProcessTime,
        expectedWaitTime: template.defaultWaitTime,
        priority: 3,
        staffRequired: 1,
        equipmentList: [],
        color
      },
      status: 'active',
      notes: ''
    };

    addArea(area);
  };

  return (
    <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Buscar áreas"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #cbd5f5' }}
        />
      </div>
      <div style={{ display: 'grid', gap: 12, maxHeight: 420, overflowY: 'auto', paddingRight: 6 }}>
        {filteredCategories.map((category) => (
          <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: category.color
                }}
              />
              {category.name}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {category.areas.map((area) => (
                <button
                  key={area.type}
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData(
                      'application/json',
                      JSON.stringify({ category: category.id, type: area.type, color: category.color })
                    )
                  }
                  onClick={() => createArea(category.id, area.type, category.color)}
                  style={{
                    borderRadius: 10,
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    padding: '8px 10px',
                    background: '#f8fafc',
                    textAlign: 'left',
                    cursor: 'grab'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{area.type}</strong>
                  <small style={{ display: 'block', color: '#475569' }}>
                    {area.defaultWidth}×{area.defaultHeight} m · Cap {area.defaultCapacity}
                  </small>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
