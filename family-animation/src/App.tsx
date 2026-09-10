import { Viewport } from "@ui/Viewport.tsx";
import { useCharacterStore } from "@store/characterStore.ts";
import { useTimelineStore } from "@store/timelineStore.ts";
import "./App.css";

const CHARACTER_TABS = [
  { id: "dad", label: "👨 Bố (Dad)" },
  { id: "mom", label: "👩 Mẹ (Mom)" },
  { id: "son", label: "👦 Con trai" },
  { id: "daughter", label: "👧 Con gái" },
];

function App() {
  const {
    selectedCharacterId,
    characters,
    behaviorState,
    emotion,
    position,
    isTalking,
    speakerName,
    currentDialogue,
    setSelectedCharacterId,
    _actions,
  } = useCharacterStore();

  const { currentTime, duration, isPlaying, _controls } = useTimelineStore();

  const selectedChar = characters[selectedCharacterId];
  const stateClass = `status-${behaviorState.toLowerCase()}`;

  return (
    <div className="app-layout">
      {/* Sidebar — Character Panel */}
      <aside className="sidebar">
        <div className="sidebar-title">
          <span>🎬 Gia đình 3D</span>
          <span style={{ fontSize: "10px", color: "var(--text-dim)" }}>Prototype v0.2</span>
        </div>

        {/* Character Selector */}
        <div className="panel-label" style={{ marginTop: "4px" }}>Chọn nhân vật</div>
        <div className="char-selector">
          {CHARACTER_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`char-tab ${selectedCharacterId === tab.id ? "active" : ""}`}
              onClick={() => setSelectedCharacterId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="panel">
          <p className="panel-label">Nhân vật đang chọn</p>
          <p className="panel-value">{selectedChar?.name ?? selectedCharacterId}</p>
        </div>

        <div className="panel">
          <p className="panel-label">Trạng thái (State)</p>
          <p className={`panel-value ${stateClass}`}>{behaviorState}</p>
        </div>

        <div className="panel">
          <p className="panel-label">Cảm xúc (Emotion)</p>
          <p className="panel-value">{emotion}</p>
        </div>

        <div className="panel">
          <p className="panel-label">Vị trí (Position)</p>
          <p className="panel-value mono">
            {position.x.toFixed(2)} / {position.y.toFixed(2)} / {position.z.toFixed(2)}
          </p>
        </div>

        <button
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--accent)",
            color: "var(--text)",
            padding: "6px 8px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "bold",
          }}
          onClick={() => _actions?.focusCamera()}
        >
          🎥 Focus Camera vào {selectedChar?.name}
        </button>
      </aside>

      {/* Main area */}
      <main className="main-area">
        {/* 3D Viewport */}
        <div className="viewport-container">
          <Viewport />
          <div className="viewport-label">
            👨‍👩‍👧‍👦 Family Cast Active: Dad · Mom · Son · Daughter
          </div>

          {/* Dialogue balloon for active speaker */}
          {isTalking && (
            <div className="speech-bubble">
              <span>💬</span>
              <span>
                <strong>{speakerName}:</strong> "{currentDialogue}"
              </span>
            </div>
          )}
        </div>

        {/* Bottom — Interactive Timeline Bar */}
        <div className="timeline-bar">
          <button
            style={{
              background: isPlaying ? "#ef4444" : "#10b981",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
            }}
            onClick={() => (isPlaying ? _controls?.pause() : _controls?.play())}
          >
            {isPlaying ? "⏸️ Pause" : "▶️ Play Tập Phim Gia Đình"}
          </button>
          <button
            style={{
              background: "#374151",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "12px",
            }}
            onClick={() => _controls?.reset()}
          >
            🔄 Reset
          </button>
          <span className="timeline-label">Tiến trình</span>
          <input
            type="range"
            min={0}
            max={duration || 25}
            step={0.1}
            value={currentTime}
            onChange={(e) => _controls?.seek(parseFloat(e.target.value))}
            style={{ flex: 1, cursor: "pointer", accentColor: "var(--accent)" }}
          />
          <span className="timeline-time">
            {currentTime.toFixed(1)}s / {duration.toFixed(0)}s
          </span>
        </div>
      </main>

      {/* Action panel — bottom right */}
      <div className="action-panel">
        <p className="panel-label">Hành động ({selectedChar?.name})</p>
        <div className="action-buttons">
          <button disabled={!_actions} onClick={() => _actions?.walkToSofa()}>
            🚶 Đến Sofa
          </button>
          <button disabled={!_actions} onClick={() => _actions?.lookAtTV()}>
            👀 Nhìn TV
          </button>
          <button disabled={!_actions} onClick={() => _actions?.lookAtDoor()}>
            🚪 Nhìn Cửa ra vào
          </button>
          <button disabled={!_actions} onClick={() => _actions?.sit()}>
            🪑 Ngồi Sofa
          </button>
          <button disabled={!_actions} onClick={() => _actions?.stand()}>
            🧍 Đứng dậy
          </button>
          <button
            disabled={!_actions}
            onClick={() => {
              const dialogues: Record<string, string> = {
                dad: "Anh chỉ xem một chút thôi!",
                mom: "Em về từ lúc anh bật TV đấy nhé!",
                son: "Bố ơi mẹ bắt quả tang rồi kìa haha!",
                daughter: "Bố xem hoạt hình với con nha!",
              };
              _actions?.talk(dialogues[selectedCharacterId] || "Xin chào cả nhà!");
            }}
          >
            🗣️ Nói thoại
          </button>
          <button disabled={!_actions} onClick={() => _actions?.laugh()}>
            😂 Cười đùa
          </button>
          <button disabled={!_actions} onClick={() => _actions?.idle()}>
            ⏸️ Đứng chờ (Idle)
          </button>
          <div style={{ marginTop: "4px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <button
              style={{ flex: 1, padding: "4px", fontSize: "10px" }}
              disabled={!_actions}
              onClick={() => _actions?.setEmotion("happy")}
            >
              😊 Vui
            </button>
            <button
              style={{ flex: 1, padding: "4px", fontSize: "10px" }}
              disabled={!_actions}
              onClick={() => _actions?.setEmotion("embarrassed")}
            >
              😳 Ngại ngùng
            </button>
            <button
              style={{ flex: 1, padding: "4px", fontSize: "10px" }}
              disabled={!_actions}
              onClick={() => _actions?.setEmotion("neutral")}
            >
              😐 Bình thường
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
