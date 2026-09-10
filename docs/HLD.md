# HLD – AI 3D Family Animation Engine (Character Prototype)

## 1. Vision

Xây dựng một **programmable 3D character runtime** dùng để sau này render tự động các bộ phim hài gia đình 3D ngắn. Nhân vật là một gia đình 4 người (Bố, Mẹ, Con trai, Con gái).

> **Scope hiện tại:** Character Prototype – chỉ Dad, chỉ Living Room.

---

## 2. Mục tiêu Prototype

Chứng minh toàn bộ vertical slice của Character Runtime:

| #  | Mục tiêu                                    |
|----|---------------------------------------------|
| 1  | Load GLB character vào Three.js scene        |
| 2  | Character có skeleton/rig                    |
| 3  | Character có animation (idle/walk/sit/talk)  |
| 4  | Character có State Machine                   |
| 5  | Character có Behavior API (async)            |
| 6  | Character di chuyển trong 3D scene           |
| 7  | Character lookAt một object                  |
| 8  | Character ngồi xuống                         |
| 9  | Character có emotion cơ bản                  |
| 10 | Character nói một câu (text/TTS)             |
| 11 | Camera follow character                      |
| 12 | Timeline điều khiển sequence                |
| 13 | Kiến trúc mở rộng cho Mom/Son/Daughter       |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      React UI Layer                      │
│  Viewport | CharacterPanel | TimelinePanel | ActionPanel │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   Character API                          │
│  dad.walkTo() | dad.sit() | dad.say() | dad.setEmotion() │
└──────┬──────────────┬──────────────────┬────────────────┘
       │              │                  │
┌──────▼──────┐ ┌─────▼──────┐ ┌────────▼──────┐
│  Behavior   │ │  Timeline  │ │    Camera     │
│  Manager    │ │  Engine    │ │  Controller   │
└──────┬──────┘ └─────┬──────┘ └───────────────┘
       │              │
┌──────▼──────┐       │
│   State     │       │
│  Machine    │       │
└──────┬──────┘       │
       │              │
┌──────▼──────────────▼──────────────────────────┐
│           Motion Controller                     │
│  (translate, rotate, arrive detection)          │
└──────┬──────────────────────────────────────────┘
       │
┌──────▼──────┐  ┌─────────────────┐  ┌──────────────┐
│  Animation  │  │   Emotion       │  │    Scene     │
│ Controller  │  │  Controller     │  │   Manager    │
└──────┬──────┘  └─────────────────┘  └──────┬───────┘
       │                                      │
┌──────▼──────────────────────────────────────▼───────┐
│                Three.js 3D Runtime                   │
│         GLB Loader | AnimationMixer | Renderer        │
└──────────────────────────────────────────────────────┘
```

---

## 4. Phân lớp hệ thống

### Layer 1 – UI (React/TSX)
Hiển thị viewport, debug panel, action buttons. Không chứa logic engine.

### Layer 2 – Character API
API công khai, async/Promise-based. Đây là interface mà sau này AI Story Engine sẽ gọi.

### Layer 3 – Engine Modules
Các module độc lập: BehaviorManager, StateMachine, MotionController, AnimationController, EmotionController, Timeline, CameraController, SceneManager.

### Layer 4 – Three.js Runtime
Renderer thực sự. Không được để các layer trên access trực tiếp Three.js objects ngoài layer này.

---

## 5. Luồng dữ liệu tổng quát

```
TimelineEvent
    ↓
Character API call (dad.walkTo / dad.sit / ...)
    ↓
BehaviorManager.execute(behavior)
    ↓
StateMachine.transition(newState)
    ↓
MotionController.moveTo() + AnimationController.play()
    ↓
Three.js scene update (each frame via requestAnimationFrame)
    ↓
Renderer.render()
```

---

## 6. Milestone Plan

| Milestone | Nội dung                        |
|-----------|---------------------------------|
| M1        | React + Vite + Three.js setup   |
| M2        | Load GLB character              |
| M3        | AnimationController             |
| M4        | Character State Machine         |
| M5        | MotionController + walkTo       |
| M6        | Living Room Scene               |
| M7        | CameraController                |
| M8        | Timeline Engine                 |
| M9        | EmotionController               |
| M10       | Dialogue / TTS abstraction      |
| M11       | UI Debug Panel                  |

---

## 7. Constraints & Out-of-Scope

**Out of scope cho prototype:**
- Backend, database, auth, cloud
- LLM / AI story generation
- AI-generated 3D model
- Multiplayer, physics phức tạp
- Full house, advanced facial animation
- Video export pipeline

**Non-negotiable:**
- Không hard-code logic trong React components
- Mọi thao tác với Three.js phải qua engine layer
- Character API phải async/awaitable
- Engine phải load bất kỳ `CharacterDefinition` nào, không gắn cứng với Dad
