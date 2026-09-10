# Component Architecture – AI 3D Family Animation Engine

## Overview

```
┌──────────────────────────────────────────────────────────────┐
│  UI Layer                                                    │
│  ┌──────────┐ ┌───────────────┐ ┌────────────┐ ┌─────────┐  │
│  │ Viewport │ │ CharacterPanel│ │TimelineUI  │ │ActionUI │  │
│  └──────────┘ └───────────────┘ └────────────┘ └─────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │ React hooks / store subscription
┌──────────────────────────▼───────────────────────────────────┐
│  Character API (Public Interface)                            │
│  CharacterController { walkTo, sit, stand, lookAt,           │
│                        say, setEmotion, idle }               │
└───┬──────────────┬─────────────┬────────────┬───────────────┘
    │              │             │            │
    ▼              ▼             ▼            ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
│Behavior│  │ Timeline │  │  Camera  │  │   Scene      │
│Manager │  │ Engine   │  │Controller│  │  Manager     │
└───┬────┘  └──────────┘  └──────────┘  └──────────────┘
    │
    ▼
┌────────────┐
│  State     │
│  Machine   │
└─────┬──────┘
      │
      ▼
┌─────────────────────┐
│  Motion Controller  │
└──────┬──────────────┘
       │
  ┌────┴──────────────┐
  ▼                   ▼
┌──────────────┐  ┌──────────────┐
│  Animation   │  │  Emotion     │
│  Controller  │  │  Controller  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 ▼
┌────────────────────────────────┐
│      Three.js GLB Renderer     │
│  (AnimationMixer, Scene Graph) │
└────────────────────────────────┘
```

---

## Components

### 1. `CharacterController` — Public API

**Trách nhiệm:** Cổng giao tiếp duy nhất với một character.

```typescript
interface ICharacterController {
  walkTo(target: Vector3 | SceneObject): Promise<void>;
  lookAt(target: Vector3 | SceneObject): Promise<void>;
  sit(): Promise<void>;
  stand(): Promise<void>;
  idle(): void;
  say(text: string): Promise<void>;
  setEmotion(emotion: EmotionType): void;
  getState(): CharacterRuntimeState;
}
```

**Quan hệ:** Orchestrates BehaviorManager, nhận events từ Timeline.

---

### 2. `BehaviorManager`

**Trách nhiệm:** Nhận behavior request, resolve conflict, queue hoặc interrupt behaviors.

```typescript
class BehaviorManager {
  execute(behavior: Behavior): Promise<void>;
  interrupt(): void;
  getCurrentBehavior(): Behavior | null;
}
```

**Quan hệ:** → StateMachine (transition), → MotionController (movement), → AnimationController (play anim), → EmotionController (emotion pose)

---

### 3. `StateMachine`

**Trách nhiệm:** Quản lý trạng thái hợp lệ của character. Validate transition.

```
States: IDLE | WALKING | SITTING | TALKING | LOOKING

Transitions:
  IDLE      → WALKING  (walkTo called)
  IDLE      → SITTING  (sit called)
  IDLE      → TALKING  (say called)
  WALKING   → IDLE     (arrived)
  WALKING   → SITTING  (arrived + sit)
  SITTING   → IDLE     (stand called)
  TALKING   → IDLE     (speech done)
  any       → LOOKING  (lookAt, parallel)
```

---

### 4. `MotionController`

**Trách nhiệm:** Xử lý movement vật lý trong 3D space. Tách biệt khỏi animation.

```typescript
interface MovementConfig {
  walkSpeed: number;        // default: 2 units/s
  rotationSpeed: number;    // default: 5 rad/s
  arrivalThreshold: number; // default: 0.1 units
}
```

---

### 5. `AnimationController`

**Trách nhiệm:** Quản lý Three.js `AnimationMixer`. Abstraction cho play/crossfade.

```typescript
type AnimationName = 'idle' | 'walk' | 'sit' | 'stand' | 'talk' | 'laugh';
```

**Transitions được hỗ trợ:**
```
idle → walk    (crossfade 0.3s)
walk → idle    (crossfade 0.3s)
idle → sit     (crossfade 0.2s)
sit  → stand   (crossfade 0.3s)
idle → talk    (crossfade 0.1s)
```

---

### 6. `EmotionController`

**Trách nhiệm:** Apply emotion state lên character (body pose, bone overrides, facial nếu có).

```typescript
type EmotionType = 
  | 'neutral' | 'happy' | 'surprised' 
  | 'confused' | 'embarrassed' | 'angry' | 'sleepy';
```

**Implementation strategy (prototype):**
- Nếu asset có facial blend shapes → dùng morph targets
- Fallback: bone rotation overrides (head tilt, shoulder pose)
- Fallback 2: UI icon overlay

---

### 7. `Timeline Engine`

**Trách nhiệm:** Đọc declarative JSON timeline, dispatch actions đúng thời điểm.

```json
{
  "timeline": [
    { "time": 0,  "actor": "dad", "action": "idle" },
    { "time": 1,  "actor": "dad", "action": "look_at", "target": "tv" },
    { "time": 2,  "actor": "dad", "action": "walk_to", "target": "sofa" },
    { "time": 6,  "actor": "dad", "action": "sit" }
  ]
}
```

---

### 8. `CameraController`

**Trách nhiệm:** Quản lý Three.js camera. Hỗ trợ static / follow / lookAt modes.

```typescript
type CameraMode = 'static' | 'follow' | 'look_at';
```

---

### 9. `SceneManager`

**Trách nhiệm:** Setup Three.js scene, load environment objects, manage scene graph, provide named object lookup.

---

### 10. `CharacterFactory`

**Trách nhiệm:** Load `CharacterDefinition`, khởi tạo toàn bộ stack cho một character.

```typescript
class CharacterFactory {
  create(definition: CharacterDefinition): Promise<ICharacterController>;
}

const dad = await characterFactory.create(dadDefinition);
const mom = await characterFactory.create(momDefinition); // tương lai
```

---

## Dependency Graph

```
CharacterController
  └── BehaviorManager
        ├── StateMachine
        ├── MotionController
        │     └── AnimationController
        │           └── Three.js AnimationMixer
        └── EmotionController
              └── Three.js Skeleton/Bones

Timeline ──────────────────→ CharacterController
CameraController ──────────→ Three.js PerspectiveCamera
SceneManager ──────────────→ Three.js Scene + Renderer
```
