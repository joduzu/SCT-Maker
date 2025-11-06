import React from 'react';
import { LayoutProvider } from './contexts/LayoutContext';
import { SimulationProvider } from './contexts/SimulationContext';
import { LayoutEditorShell } from './components/LayoutEditor/LayoutEditorShell';
import { SimulationPanel } from './components/Simulation/SimulationPanel';
import { AnalyticsPanel } from './components/Analytics/AnalyticsPanel';
import { ImageImportPanel } from './components/ImageImport/ImageImportPanel';
import './app.css';

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <SimulationProvider>
        <div className="app">
          <header className="app__header">
            <div>
              <h1>Hospital Flow Analyzer</h1>
              <p>
                Planifica, simula y analiza flujos de pacientes en hospitales de campaña combinando diseño espacial con métricas
                operativas en tiempo real.
              </p>
            </div>
            <ImageImportPanel />
          </header>
          <main className="app__body">
            <LayoutEditorShell />
            <SimulationPanel />
            <AnalyticsPanel />
          </main>
        </div>
      </SimulationProvider>
    </LayoutProvider>
  );
};

export default App;
