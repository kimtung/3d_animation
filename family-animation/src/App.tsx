import { Viewport } from "@ui/Viewport.tsx";
import { useCharacterStore } from "@store/characterStore.ts";
import "./App.css";

function App() {
  const { behaviorState, emotion, position, isTalking, currentDialogue, _actions } =
    useCharacterStore();

  const stateClass = `status-${behaviorState.toLowerCase()}`;

  return (
    <div className="app-layout">
      {/* Sidebar — Character Panel */}
      <aside className="sidebar">
        <h2 className="sidebar-title">🎬 Family Studio</h2>
        <div className="panel">
          <p className="panel-label">Character</p>
          <p className="panel-value">Dad (Prototype)</p>
        </div>
        <div className="panel">
          <p className="panel-label">State</p>
          <p className={`panel-value ${stateClass}`}>{behaviorState}</p>
        </div>
        <div className="panel">
          <p className="panel-label">Emotion</p>
          <p className="panel-value">{emotion}</p>
        </div>
        <div className="panel">
          <p className="panel-label">Position</p>
          <p className="panel-value mono">
            {position.x.toFixed(2)} / {position.y.toFixed(2)} / {position.z.toFixed(2)}
          </p>
        </div>
        {isTalking && (
          <div className="panel" style={{ borderColor: "var(--accent)" }}>
            <p className="panel-label">Dialogue</p>
            <p className="panel-value" style={{ fontStyle: "italic" }}>
              "{currentDialogue}"
            </p>
          </div>
        )}
      </aside>

      {/* Main area */}
      <main className="main-area">
        {/* 3D Viewport */}
        <div className="viewport-container">
          <Viewport />
          <div className="viewport-label">Phase 1 · Character Runtime Active</div>
          {isTalking && (
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(0, 0, 0, 0.75)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "16px",
                border: "1px solid #6c63ff",
                fontSize: "14px",
                fontWeight: "bold",
                pointerEvents: "none",
              }}
            >
              💬 Dad: "{currentDialogue}"
            </div>
          )}
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
          <button disabled={!_actions} onClick={() => _actions?.walkToSofa()}>
            🚶 Walk To Target
          </button>
          <button disabled={!_actions} onClick={() => _actions?.lookAtTV()}>
            👀 Look At TV
          </button>
          <button disabled={!_actions} onClick={() => _actions?.sit()}>
            🪑 Sit Down
          </button>
          <button disabled={!_actions} onClick={() => _actions?.stand()}>
            🧍 Stand Up
          </button>
          <button
            disabled={!_actions}
            onClick={() => _actions?.talk("Anh chỉ xem một chút thôi!")}
          >
            🗣️ Say Dialogue
          </button>
          <button disabled={!_actions} onClick={() => _actions?.idle()}>
            ⏸️ Idle
          </button>
          <div style={{ marginTop: "6px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <button
              style={{ flex: 1, padding: "4px", fontSize: "10px" }}
              disabled={!_actions}
              onClick={() => _actions?.setEmotion("happy")}
            >
              😊 Happy
            </button>
            <button
              style={{ flex: 1, padding: "4px", fontSize: "10px" }}
              disabled={!_actions}
              onClick={() => _actions?.setEmotion("embarrassed")}
            >
              😳 Embarrassed
            </button>
            <button
              style={{ flex: 1, padding: "4px", fontSize: "10px" }}
              disabled={!_actions}
              onClick={() => _actions?.setEmotion("neutral")}
            >
              😐 Neutral
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
