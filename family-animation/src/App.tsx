// ============================================================
// App — root layout only, no engine logic here
// ============================================================

import { Viewport } from "@ui/Viewport.tsx";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      {/* Sidebar — Character Panel (M0.3: placeholder) */}
      <aside className="sidebar">
        <h2 className="sidebar-title">🎬 Family Animation</h2>
        <div className="panel">
          <p className="panel-label">Character</p>
          <p className="panel-value">—</p>
        </div>
        <div className="panel">
          <p className="panel-label">State</p>
          <p className="panel-value status-idle">IDLE</p>
        </div>
        <div className="panel">
          <p className="panel-label">Emotion</p>
          <p className="panel-value">neutral</p>
        </div>
        <div className="panel">
          <p className="panel-label">Position</p>
          <p className="panel-value mono">0.00 / 0.00 / 0.00</p>
        </div>
      </aside>

      {/* Main area */}
      <main className="main-area">
        {/* 3D Viewport */}
        <div className="viewport-container">
          <Viewport />
          <div className="viewport-label">Phase 0 · M0.3 — Basic Viewport</div>
        </div>

        {/* Bottom — Timeline placeholder */}
        <div className="timeline-bar">
          <span className="timeline-label">Timeline</span>
          <div className="timeline-track">
            <div className="timeline-playhead" />
          </div>
          <span className="timeline-time">0.0s</span>
        </div>
      </main>

      {/* Action panel — bottom right */}
      <div className="action-panel">
        <p className="panel-label">Actions</p>
        <div className="action-buttons">
          <button disabled>Walk</button>
          <button disabled>Sit</button>
          <button disabled>Stand</button>
          <button disabled>Look</button>
          <button disabled>Talk</button>
        </div>
      </div>
    </div>
  );
}

export default App;
