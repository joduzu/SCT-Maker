import { Area } from '../types/layout.types';
import { AreaMetrics, Bottleneck } from '../types/simulation.types';

const severityScore = (score: number): Bottleneck['severity'] => {
  if (score >= 7) return 'critical';
  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  if (score > 0) return 'low';
  return 'low';
};

export const detectBottlenecks = (
  areas: Area[],
  metrics: Map<string, AreaMetrics>,
  threshold: { utilization: number; waitTimeRatio: number; queueFactor: number }
): Bottleneck[] => {
  const result: Bottleneck[] = [];

  areas.forEach((area) => {
    const areaMetrics = metrics.get(area.id);
    if (!areaMetrics) return;

    const indicators = {
      utilization: areaMetrics.utilizationRate,
      waitTimeRatio: area.properties.expectedWaitTime
        ? areaMetrics.avgWaitTime / area.properties.expectedWaitTime
        : 0,
      queueLength: areaMetrics.queueLength,
      throughputDeficit: area.properties.capacity
        ? Math.max(0, 1 - areaMetrics.throughput / area.properties.capacity)
        : 0
    };

    let score = 0;
    if (indicators.utilization >= threshold.utilization) score += 2;
    if (indicators.waitTimeRatio >= threshold.waitTimeRatio) score += 3;
    if (indicators.queueLength >= area.properties.capacity * threshold.queueFactor) score += 2;
    if (indicators.throughputDeficit >= 0.5) score += 1;

    if (score > 0) {
      result.push({
        areaId: area.id,
        severity: severityScore(score),
        indicators,
        recommendations: generateRecommendations(area, indicators),
        impactedPatientTypes: [],
        timestamp: Date.now()
      });
    }
  });

  return result.sort((a, b) => {
    const order: Record<Bottleneck['severity'], number> = {
      critical: 3,
      high: 2,
      medium: 1,
      low: 0
    };
    return order[b.severity] - order[a.severity];
  });
};

const generateRecommendations = (
  area: Area,
  indicators: Bottleneck['indicators']
): string[] => {
  const suggestions: string[] = [];
  if (indicators.utilization > 0.9) {
    suggestions.push(`Revisar capacidad de ${area.name}`);
    suggestions.push('Evaluar refuerzo de personal');
  }
  if (indicators.waitTimeRatio > 2) {
    suggestions.push('Optimizar protocolos de atención');
    suggestions.push('Analizar rutas alternativas de flujo');
  }
  if (indicators.queueLength > area.properties.capacity) {
    suggestions.push('Habilitar área de espera auxiliar');
  }
  if (indicators.throughputDeficit > 0.3) {
    suggestions.push('Reevaluar asignación de equipos y recursos críticos');
  }
  return suggestions;
};
