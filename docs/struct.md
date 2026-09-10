# Folder Structure – AI 3D Family Animation Engine

```
family-animation/
│
├── public/
│   └── assets/
│       ├── characters/
│       │   └── dad/
│       │       └── dad.glb              # GLB model + animations
│       └── scenes/
│           └── living-room/
│               └── props.glb            # Sofa, TV, Table, Lamp (optional)
│
├── src/
│   │
│   ├── engine/                          # Pure engine, không import React
│   │   │
│   │   ├── character/
│   │   │   ├── Character.ts             # ICharacterController interface
│   │   │   ├── CharacterController.ts   # Concrete implementation
│   │   │   ├── CharacterDefinition.ts   # CharacterDefinition interface + types
│   │   │   ├── CharacterFactory.ts      # Factory: create() từ definition
│   │   │   └── CharacterState.ts        # CharacterRuntimeState type
│   │   │
│   │   ├── behavior/
│   │   │   ├── BehaviorManager.ts       # Orchestrate behaviors, queue/interrupt
│   │   │   ├── Behavior.ts              # Behavior interface + built-in behaviors
│   │   │   └── StateMachine.ts          # State machine (IDLE/WALKING/SITTING/...)
│   │   │
│   │   ├── animation/
│   │   │   ├── AnimationController.ts   # Wrapper cho Three.js AnimationMixer
│   │   │   └── AnimationDefinition.ts   # AnimationName type + clip mapping
│   │   │
│   │   ├── movement/
│   │   │   └── MotionController.ts      # moveTo, rotateTo, arrival detection
│   │   │
│   │   ├── emotion/
│   │   │   ├── EmotionController.ts     # setEmotion, bone overrides
│   │   │   └── EmotionDefinition.ts     # EmotionType + EmotionConfig
│   │   │
│   │   ├── scene/
│   │   │   ├── SceneManager.ts          # Three.js scene setup, renderer, loop
│   │   │   └── SceneObject.ts           # SceneObject type (id, position, object3D)
│   │   │
│   │   ├── timeline/
│   │   │   ├── Timeline.ts              # Timeline engine (play/pause/seek)
│   │   │   └── TimelineEvent.ts         # TimelineEvent interface + ActionType
│   │   │
│   │   └── camera/
│   │       └── CameraController.ts      # CameraMode: static | follow | lookAt
│   │
│   ├── characters/                      # Character definitions (data, không phải logic)
│   │   └── dad/
│   │       ├── dad.definition.ts        # dadDefinition: CharacterDefinition
│   │       └── dad.behaviors.ts         # Custom behaviors đặc trưng của Dad (nếu cần)
│   │
│   ├── scenes/                          # Scene configs
│   │   └── living-room/
│   │       ├── livingRoom.ts            # LivingRoom scene config + object positions
│   │       └── livingRoom.timeline.json # Declarative timeline cho prototype story
│   │
│   ├── ui/                              # React components (chỉ display + dispatch)
│   │   ├── Viewport.tsx                 # Canvas container, init SceneManager
│   │   ├── CharacterPanel.tsx           # Hiển thị state, emotion, position
│   │   ├── TimelinePanel.tsx            # Timeline scrubber + play/pause
│   │   └── ActionPanel.tsx              # Debug buttons: Walk/Sit/Stand/Look/Talk
│   │
│   ├── hooks/
│   │   ├── useCharacter.ts              # React hook subscribe to character state
│   │   └── useTimeline.ts               # React hook for timeline controls
│   │
│   ├── store/
│   │   └── characterStore.ts            # Zustand store: character state for UI sync
│   │
│   ├── types/
│   │   └── index.ts                     # Re-export all public types
│   │
│   └── App.tsx                          # Root layout only, không có logic engine
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## Giải thích tổ chức

### `src/engine/` — Engine Core

> **Nguyên tắc:** Không import bất cứ gì từ React. Có thể chạy độc lập.

| Folder       | Trách nhiệm                                        |
|--------------|----------------------------------------------------|
| `character/` | Public API + Factory để tạo character              |
| `behavior/`  | Logic behavior + state machine                     |
| `animation/` | Abstraction cho Three.js AnimationMixer            |
| `movement/`  | Di chuyển vật lý trong 3D space                    |
| `emotion/`   | Emotion state → bone/morph transforms              |
| `scene/`     | Three.js scene, renderer, render loop              |
| `timeline/`  | Declarative timeline engine                        |
| `camera/`    | Camera modes và smooth transitions                 |

### `src/characters/` — Character Data

> Chứa **data**, không chứa logic engine. Mỗi character là một folder.

### `src/ui/` — React Components

> **Chỉ hiển thị và dispatch commands**. Không chứa 3D logic.

### `src/store/` — State Sync

> Bridge giữa engine (vanilla TS) và React (component re-render).

---

## Quy tắc import

```
UI → hooks → store → engine API (CharacterController)
engine/* → KHÔNG được import từ ui/ hoặc store/
```

---

## Files quan trọng nhất (theo priority)

1. `engine/character/CharacterDefinition.ts` — Core data model
2. `engine/character/CharacterFactory.ts` — Khởi tạo toàn bộ stack
3. `engine/behavior/StateMachine.ts` — State logic
4. `engine/animation/AnimationController.ts` — Animation abstraction
5. `engine/movement/MotionController.ts` — Walk logic
6. `engine/timeline/Timeline.ts` — Sequence engine
7. `characters/dad/dad.definition.ts` — Dad config
