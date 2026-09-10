# LLD – AI 3D Family Animation Engine: Character Prototype

> Version: 1.0 | Date: 2026-09-10 | Phase: **Character Runtime Prototype**

---

## 1. Folder Structure

```
family-animation/
│
├── public/
│   └── assets/
│       └── characters/
│           └── dad/
│               └── dad.glb
│
├── src/
│   │
│   ├── engine/
│   │   ├── character/
│   │   │   ├── Character.ts          ← High-level character API
│   │   │   ├── CharacterState.ts     ← Runtime state object
│   │   │   ├── CharacterDefinition.ts← Static definition / identity
│   │   │   └── CharacterManager.ts   ← Factory + registry
│   │   │
│   │   ├── behavior/
│   │   │   ├── BehaviorManager.ts    ← Orchestrates actions
│   │   │   ├── Behavior.ts           ← Individual behavior interface
│   │   │   └── StateMachine.ts       ← State transition logic
│   │   │
│   │   ├── animation/
│   │   │   ├── AnimationController.ts← AnimationMixer abstraction
│   │   │   └── AnimationDefinition.ts← Clip name mappings
│   │   │
│   │   ├── movement/
│   │   │   └── MotionController.ts   ← walkTo, rotation, speed
│   │   │
│   │   ├── emotion/
│   │   │   └── EmotionController.ts  ← Emotion → pose/gesture
│   │   │
│   │   ├── scene/
│   │   │   ├── SceneManager.ts       ← Three.js scene setup
│   │   │   └── SceneGraph.ts         ← Named object registry
│   │   │
│   │   ├── timeline/
│   │   │   ├── Timeline.ts           ← Declarative timeline engine
│   │   │   └── TimelineEvent.ts      ← Event type definition
│   │   │
│   │   └── camera/
│   │       └── CameraController.ts   ← Static / Follow / LookAt
│   │
│   ├── characters/
│   │   └── dad/
│   │       ├── dad.definition.ts     ← Dad's CharacterDefinition
│   │       └── dad.behaviors.ts      ← Dad-specific behavior overrides
│   │
│   ├── scenes/
│   │   └── living-room/
│   │       └── livingRoom.ts         ← Scene builder for living room
│   │
│   ├── ui/
│   │   ├── Viewport.tsx              ← Three.js canvas container
│   │   ├── Timeline.tsx              ← Timeline visualization
│   │   ├── CharacterPanel.tsx        ← State/emotion/position debug
│   │   └── ActionPanel.tsx           ← Behavior trigger buttons
│   │
│   └── App.tsx                       ← Root: mount engine + UI
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 2. Data Models

### 2.1 CharacterDefinition

```typescript
// src/engine/character/CharacterDefinition.ts

export type Personality = string[];

export type CharacterCapability =
  | 'walk'
  | 'sit'
  | 'stand'
  | 'look_at'
  | 'talk'
  | 'laugh'
  | 'set_emotion';

export interface AnimationDefinition {
  name: string;       // internal key, e.g. "idle"
  clipName: string;   // GLB clip name, e.g. "Armature|idle"
  loop: boolean;
  transitionDuration: number; // seconds for crossfade
}

export interface EmotionDefinition {
  name: string;                          // e.g. "embarrassed"
  headRotation?: { x: number; y: number; z: number };
  bodyOffset?: { x: number; y: number; z: number };
  animationOverride?: string;            // optional animation clip
}

export interface CharacterDefinition {
  id: string;
  name: string;
  asset: string;                         // path to GLB, e.g. "/assets/characters/dad/dad.glb"
  personality: Personality;
  capabilities: CharacterCapability[];
  animations: AnimationDefinition[];
  emotions: EmotionDefinition[];
  movementConfig: {
    walkSpeed: number;                   // units/second
    rotationSpeed: number;               // radians/second
    arrivalThreshold: number;            // distance to consider "arrived"
  };
}
```

### 2.2 CharacterState

```typescript
// src/engine/character/CharacterState.ts

export type CharacterStateEnum =
  | 'IDLE'
  | 'WALKING'
  | 'SITTING'
  | 'TALKING'
  | 'LAUGHING';

export type EmotionEnum =
  | 'neutral'
  | 'happy'
  | 'surprised'
  | 'confused'
  | 'embarrassed'
  | 'angry'
  | 'sleepy';

export interface CharacterState {
  currentState: CharacterStateEnum;
  emotion: EmotionEnum;
  location: string;      // scene zone name, e.g. "living_room"
  energy: number;        // 0–100
  isMoving: boolean;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}
```

### 2.3 TimelineEvent

```typescript
// src/engine/timeline/TimelineEvent.ts

export interface TimelineEvent {
  time: number;          // seconds from timeline start
  actor: string;         // character id, e.g. "dad"
  action: string;        // behavior name, e.g. "walk_to"
  target?: string;       // optional: scene object id
  text?: string;         // for "say" action
  emotion?: string;      // for "set_emotion" action
  params?: Record<string, unknown>;
}
```

### 2.4 Declarative Timeline Format (JSON)

```json
{
  "timeline": [
    { "time": 0,   "actor": "dad", "action": "idle" },
    { "time": 1,   "actor": "dad", "action": "look_at",  "target": "tv" },
    { "time": 2,   "actor": "dad", "action": "walk_to",  "target": "sofa" },
    { "time": 6,   "actor": "dad", "action": "sit" },
    { "time": 8,   "actor": "dad", "action": "look_at",  "target": "tv" },
    { "time": 10,  "actor": "dad", "action": "say",      "text": "Anh chỉ xem một chút thôi." },
    { "time": 13,  "actor": "dad", "action": "laugh" },
    { "time": 18,  "actor": "dad", "action": "set_emotion", "emotion": "embarrassed" },
    { "time": 20,  "actor": "dad", "action": "look_away" }
  ]
}
```

---

## 3. Interface Contracts

### 3.1 Character (High-Level API)

```typescript
// src/engine/character/Character.ts

export interface ICharacter {
  readonly id: string;
  readonly state: CharacterState;

  // Behaviors (return Promise for sequencing)
  idle(): Promise<void>;
  walkTo(target: THREE.Vector3 | string): Promise<void>;
  lookAt(target: THREE.Object3D | string): Promise<void>;
  sit(): Promise<void>;
  stand(): Promise<void>;
  say(text: string): Promise<void>;
  laugh(): Promise<void>;
  setEmotion(emotion: EmotionEnum): void;

  // Lifecycle
  update(delta: number): void;
  dispose(): void;
}
```

### 3.2 StateMachine

```typescript
// src/engine/behavior/StateMachine.ts

export interface IStateMachine {
  currentState: CharacterStateEnum;
  canTransition(to: CharacterStateEnum): boolean;
  transition(to: CharacterStateEnum): void;
  onStateChange(cb: (from: CharacterStateEnum, to: CharacterStateEnum) => void): void;
}

// Valid transitions:
// IDLE     → WALKING, SITTING, TALKING, LAUGHING
// WALKING  → IDLE
// SITTING  → IDLE, TALKING, LAUGHING
// TALKING  → IDLE, SITTING
// LAUGHING → IDLE, SITTING
```

### 3.3 AnimationController

```typescript
// src/engine/animation/AnimationController.ts

export interface IAnimationController {
  play(animName: string, options?: { loop?: boolean; fadeIn?: number }): void;
  crossFadeTo(animName: string, duration: number): void;
  stop(animName: string): void;
  stopAll(): void;
  update(delta: number): void;
}
```

### 3.4 MotionController

```typescript
// src/engine/movement/MotionController.ts

export interface IMotionController {
  walkTo(target: THREE.Vector3): Promise<void>;
  rotateTo(targetRotation: number): Promise<void>;
  stop(): void;
  update(delta: number): void;
}
```

### 3.5 EmotionController

```typescript
// src/engine/emotion/EmotionController.ts

export interface IEmotionController {
  setEmotion(emotion: EmotionEnum): void;
  clearEmotion(): void;
  getCurrentEmotion(): EmotionEnum;
}
```

### 3.6 CameraController

```typescript
// src/engine/camera/CameraController.ts

export type CameraMode = 'static' | 'follow' | 'lookAt';

export interface ICameraController {
  setMode(mode: CameraMode): void;
  lookAt(target: THREE.Object3D | THREE.Vector3): void;
  follow(target: THREE.Object3D, offset?: THREE.Vector3): void;
  update(delta: number): void;
}
```

### 3.7 Timeline

```typescript
// src/engine/timeline/Timeline.ts

export interface ITimeline {
  add(event: TimelineEvent): void;
  loadFromJSON(data: { timeline: TimelineEvent[] }): void;
  play(): void;
  pause(): void;
  reset(): void;
  seek(time: number): void;
  update(delta: number): void;
  readonly currentTime: number;
  readonly isPlaying: boolean;
}
```

### 3.8 SceneManager

```typescript
// src/engine/scene/SceneManager.ts

export interface ISceneManager {
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  addObject(name: string, object: THREE.Object3D): void;
  getObject(name: string): THREE.Object3D | undefined;
  removeObject(name: string): void;
  getPosition(name: string): THREE.Vector3 | undefined;
  update(delta: number): void;
  dispose(): void;
}
```

---

## 4. State Machine Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                         STATE MACHINE                       │
│                                                             │
│                      ┌──────────┐                           │
│              ┌───────►   IDLE   ◄───────┐                   │
│              │        └──┬───┬──┘        │                   │
│              │           │   │           │                   │
│         arrived      walkTo() sit()    stand()               │
│              │           │   │           │                   │
│              │        ┌──▼───▼──┐   ┌───┴────┐              │
│              └────────┤ WALKING │   │SITTING │              │
│                       └─────────┘   └───┬────┘              │
│                                         │                   │
│                              talk() / laugh()               │
│                                         │                   │
│                                   ┌─────▼──────┐            │
│                                   │  TALKING / │            │
│                                   │  LAUGHING  │            │
│                                   └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. walkTo() Flow (MotionController)

```
walkTo(targetPosition)
    │
    ▼
StateMachine.transition(WALKING)
    │
    ▼
AnimationController.crossFadeTo("walk", 0.3)
    │
    ▼
[Each frame update(delta)]
    │
    ├── Calculate direction to target
    ├── Rotate character toward target (rotationSpeed config)
    ├── Move character forward (walkSpeed config)
    └── Check distance < arrivalThreshold?
            │ No → continue
            ▼ Yes
        Stop movement
        StateMachine.transition(IDLE)
        AnimationController.crossFadeTo("idle", 0.3)
        Promise.resolve()
```

---

## 6. Emotion Mapping

| Emotion | Head Rotation | Body | Animation Override |
|---------|--------------|------|--------------------|
| neutral | default | default | – |
| happy | slight up | open | laugh clip (optional) |
| surprised | tilt back | step back | – |
| confused | tilt left | scratch head gesture | – |
| embarrassed | down + away | slouch | – |
| angry | forward | tense | – |
| sleepy | drooping | slumped | idle-sleepy clip |

> Implementation: bone rotation offsets on Head/Spine bones via `THREE.Bone.rotation`.

---

## 7. Dad Definition File

```typescript
// src/characters/dad/dad.definition.ts

import { CharacterDefinition } from '../../engine/character/CharacterDefinition';

export const dadDefinition: CharacterDefinition = {
  id: 'dad',
  name: 'Dad',
  asset: '/assets/characters/dad/dad.glb',

  personality: ['funny', 'kind', 'relaxed', 'slightly_lazy', 'loves_children'],

  capabilities: ['walk', 'sit', 'stand', 'look_at', 'talk', 'laugh', 'set_emotion'],

  movementConfig: {
    walkSpeed: 1.5,
    rotationSpeed: 3.0,
    arrivalThreshold: 0.15,
  },

  animations: [
    { name: 'idle', clipName: 'Armature|idle', loop: true,  transitionDuration: 0.3 },
    { name: 'walk', clipName: 'Armature|walk', loop: true,  transitionDuration: 0.3 },
    { name: 'sit',  clipName: 'Armature|sit',  loop: false, transitionDuration: 0.5 },
    { name: 'talk', clipName: 'Armature|talk', loop: true,  transitionDuration: 0.2 },
  ],

  emotions: [
    { name: 'neutral' },
    { name: 'happy',       bodyOffset: { x: 0, y: 0.05, z: 0 } },
    { name: 'embarrassed', headRotation: { x: -0.3, y: 0.4, z: 0 }, bodyOffset: { x: 0, y: -0.05, z: 0 } },
    { name: 'surprised',   headRotation: { x: 0.2, y: 0, z: 0 } },
    { name: 'sleepy',      headRotation: { x: 0.4, y: 0, z: 0 }, bodyOffset: { x: 0, y: -0.1, z: 0 } },
  ],
};
```

---

## 8. Living Room Scene Definition

```typescript
// src/scenes/living-room/livingRoom.ts

// Scene graph:
// Scene
// ├── Environment
// │   ├── Floor       (PlaneGeometry 10x10, positioned at y=0)
// │   ├── Sofa        (Box proxy or GLB, position: x=-2, y=0.4, z=0)
// │   ├── CoffeeTable (Box proxy, position: x=-1.5, y=0.25, z=1)
// │   ├── TV          (Box proxy, position: x=3, y=1, z=0)
// │   └── Lamp        (point light source, position: x=0, y=3, z=0)
// ├── Characters
// │   └── Dad         (CharacterManager.create(dadDefinition))
// ├── Camera          (PerspectiveCamera, fov=60)
// └── Lights
//     ├── AmbientLight    (intensity 0.4)
//     └── DirectionalLight (position: x=5, y=10, z=5, intensity 0.8)
```

---

## 9. UI Component Breakdown

### 9.1 App.tsx

- Khởi tạo `SceneManager`, `CharacterManager`, `Timeline`, `CameraController`.
- Mount `<Viewport />` và các panel.
- Expose character + engine refs xuống UI components.

### 9.2 Viewport.tsx

- Nhận `ref` canvas từ `SceneManager`.
- Chạy animation loop: `requestAnimationFrame` → `update(delta)` → `renderer.render`.

### 9.3 CharacterPanel.tsx

```
Character: Dad
State:   [IDLE / WALKING / SITTING / TALKING]
Emotion: [neutral / happy / embarrassed / ...]
Position: X: 0.0  Y: 0.0  Z: 0.0
```

- Subscribe vào `CharacterState` (reactive Zustand hoặc polling).

### 9.4 ActionPanel.tsx

Buttons:
- `[Walk To Sofa]` → `dad.walkTo("sofa")`
- `[Look At TV]` → `dad.lookAt("tv")`
- `[Sit]` → `dad.sit()`
- `[Stand]` → `dad.stand()`
- `[Talk]` → `dad.say("Anh chỉ xem một chút thôi.")`
- `[Happy]` / `[Embarrassed]` → `dad.setEmotion(...)`

### 9.5 Timeline.tsx

- Scrubber hiển thị `currentTime`.
- Play / Pause / Reset buttons.
- Visual track mô tả sequence.

---

## 10. CharacterManager (Factory Pattern)

```typescript
// src/engine/character/CharacterManager.ts

export class CharacterManager {
  private characters: Map<string, Character> = new Map();

  async create(definition: CharacterDefinition, scene: THREE.Scene): Promise<Character> {
    const model = await loadGLB(definition.asset);
    const character = new Character(definition, model);
    this.characters.set(definition.id, character);
    scene.add(model.scene);
    return character;
  }

  get(id: string): Character | undefined {
    return this.characters.get(id);
  }

  update(delta: number): void {
    this.characters.forEach(char => char.update(delta));
  }

  dispose(): void {
    this.characters.forEach(char => char.dispose());
    this.characters.clear();
  }
}
```

---

## 11. Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "three": "^0.168",
    "zustand": "^4"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/three": "^0.168",
    "typescript": "^5",
    "vite": "^5",
    "@vitejs/plugin-react": "^4"
  }
}
```

---

## 12. Error Handling & Defensive Design

| Tình huống | Xử lý |
|------------|-------|
| GLB load fail | Fallback sang procedural humanoid mesh |
| Animation clip không tồn tại | Log warning, play "idle" |
| walkTo khi đang SITTING | StateMachine reject, log warning |
| Timeline event actor không tồn tại | Skip event, log warning |
| Emotion không có definition | Apply neutral, log warning |
