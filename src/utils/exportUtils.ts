import { HospitalLayout } from '../types/layout.types';
import { SystemMetrics } from '../types/simulation.types';

export const exportLayoutToJson = (layout: HospitalLayout): string => {
  const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${layout.name.replace(/\s+/g, '-')}.layout.json`);
  return url;
};

export const exportMetricsToJson = (metrics: SystemMetrics): string => {
  const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `metrics-${new Date().toISOString()}.json`);
  return url;
};

const triggerDownload = (url: string, filename: string) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
