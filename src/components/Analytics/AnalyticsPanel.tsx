import React from 'react';
import { useSimulationContext } from '../../contexts/SimulationContext';

export const AnalyticsPanel: React.FC = () => {
  const { metrics, bottlenecks } = useSimulationContext();

  const historyItems = Array.from(metrics.byArea.values()).slice(0, 5);

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Analítica Operativa</h2>
      </div>
      <div className="panel__body" style={{ display: 'grid', gap: 16 }}>
        <div className="metrics-grid">
          <AnalyticsCard title="Throughput" value={`${metrics.global.throughput.toFixed(2)} pac/h`} />
          <AnalyticsCard title="Utilización global" value={`${(metrics.global.utilizationRate * 100).toFixed(0)}%`} />
          <AnalyticsCard title="Bottlenecks" value={bottlenecks.length.toString()} />
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Área</th>
                <th>Utilización</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((area) => (
                <tr key={area.areaId}>
                  <td>{area.areaId}</td>
                  <td>{(area.utilizationRate * 100).toFixed(0)}%</td>
                  <td>
                    <span className={`badge badge--${statusToBadge(area.status)}`}>{area.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Generar informe</h3>
          <p style={{ color: '#475569', marginTop: 4 }}>
            Exporta un resumen en JSON con todas las métricas actuales y los indicadores de cuello de botella detectados para
            documentación o análisis posterior.
          </p>
          <button
            onClick={() => {
              const payload = {
                generatedAt: new Date().toISOString(),
                metrics,
                bottlenecks
              };
              const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement('a');
              anchor.href = url;
              anchor.download = `reporte-${Date.now()}.json`;
              anchor.click();
              URL.revokeObjectURL(url);
            }}
            style={{
              border: 'none',
              background: '#0f766e',
              color: 'white',
              padding: '10px 16px',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
              width: 'fit-content'
            }}
          >
            Exportar informe JSON
          </button>
        </div>
      </div>
    </section>
  );
};

const statusToBadge = (status: string) => {
  switch (status) {
    case 'critical':
      return 'danger';
    case 'warning':
      return 'warning';
    default:
      return 'success';
  }
};

const AnalyticsCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="metric-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);
