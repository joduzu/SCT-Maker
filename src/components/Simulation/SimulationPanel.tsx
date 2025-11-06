import React from 'react';
import { useSimulationContext } from '../../contexts/SimulationContext';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { exportMetricsToJson } from '../../utils/exportUtils';

export const SimulationPanel: React.FC = () => {
  const { patients, metrics, bottlenecks, isRunning, start, pause, reset, injectPatient, setSpeed, config } =
    useSimulationContext();
  const { layoutState } = useLayoutContext();

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Simulación en Tiempo Real</h2>
      </div>
      <div className="panel__body" style={{ display: 'grid', gap: 16 }}>
        <div className="toolbar">
          <button onClick={isRunning ? pause : start}>{isRunning ? 'Pausar' : 'Iniciar'}</button>
          <button onClick={reset}>Reiniciar</button>
          <button onClick={() => injectPatient(getDefaultPatientType())}>Inyectar paciente</button>
          <button onClick={() => exportMetricsToJson(metrics)}>Exportar métricas</button>
        </div>
        <div>
          <label htmlFor="speed">Velocidad de simulación (x{config.speed.toFixed(1)})</label>
          <input
            id="speed"
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={config.speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
        </div>
        <div className="metrics-grid">
          <MetricCard title="Pacientes activos" value={metrics.global.activePatients.toString()} />
          <MetricCard title="Procesados" value={metrics.global.totalProcessed.toString()} />
          <MetricCard title="Espera Prom." value={`${metrics.global.avgWaitTime.toFixed(1)} min`} />
          <MetricCard title="Tiempo en sistema" value={`${metrics.global.avgSystemTime.toFixed(1)} min`} />
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Área</th>
                <th>Ocupación</th>
                <th>Cola</th>
                <th>Utilización</th>
              </tr>
            </thead>
            <tbody>
              {layoutState.areas.map((area) => {
                const areaMetrics = metrics.byArea.get(area.id);
                if (!areaMetrics) return null;
                return (
                  <tr key={area.id}>
                    <td>{area.name}</td>
                    <td>
                      {areaMetrics.currentOccupancy}/{area.properties.capacity}
                    </td>
                    <td>{areaMetrics.queueLength}</td>
                    <td>{(areaMetrics.utilizationRate * 100).toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Cuellos de botella</h3>
          {bottlenecks.length === 0 && <p style={{ color: '#64748b' }}>Sin cuellos de botella detectados</p>}
          {bottlenecks.map((bottleneck) => (
            <div key={bottleneck.areaId} className={`badge badge--${severityToBadge(bottleneck.severity)}`} style={{ marginBottom: 8 }}>
              <span>{layoutState.areas.find((area) => area.id === bottleneck.areaId)?.name}</span>
              <span>· {bottleneck.severity.toUpperCase()}</span>
            </div>
          ))}
        </div>
        <div>
          <h3>Pacientes en sistema</h3>
          <ul style={{ maxHeight: 160, overflowY: 'auto', margin: 0, paddingLeft: 18 }}>
            {patients.map((patient) => (
              <li key={patient.id} style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                <strong>{patient.type.name}</strong> · {patient.status} · {patient.currentArea ?? 'Sin asignar'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const getDefaultPatientType = () => ({
  id: 'triage',
  name: 'Paciente general',
  description: 'Paciente estándar para simulación',
  priority: 2,
  color: '#60a5fa',
  avgProcessTime: 20,
  flowPath: [
    { from: 'ENTRY', to: 'triage', probability: 1, avgTransitionTime: 5 },
    { from: 'triage', to: 'consulta', probability: 0.6, avgTransitionTime: 8 },
    { from: 'triage', to: 'emergencia', probability: 0.2, avgTransitionTime: 5 },
    { from: 'triage', to: 'salida', probability: 0.2, avgTransitionTime: 4 },
    { from: 'consulta', to: 'salida', probability: 1, avgTransitionTime: 6 },
    { from: 'emergencia', to: 'salida', probability: 1, avgTransitionTime: 6 }
  ]
});

const severityToBadge = (severity: string) => {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    default:
      return 'success';
  }
};

const MetricCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="metric-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);
