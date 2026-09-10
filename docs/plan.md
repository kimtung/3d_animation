# Plan – AI 3D Story Animation Engine

> **Vision:** A programmable 3D character runtime for AI-generated family comedy stories.
> **Nguyên tắc:** Mỗi milestone phải stable và có Definition of Done rõ ràng trước khi sang milestone tiếp theo.

---

## Roadmap Overview

```
AI 3D STORY ANIMATION ENGINE
│
├── PHASE 0 — Foundation
│   ├── M0.1 Project Setup
│   ├── M0.2 Engine Skeleton
│   └── M0.3 Basic 3D Viewport
│
├── PHASE 1 — Character Runtime
│   ├── M1.1 Character Loader
│   ├── M1.2 Animation Controller
│   ├── M1.3 State Machine
│   ├── M1.4 Motion Controller
│   └── M1.5 Emotion System
│
├── PHASE 2 — Scene & Cinematic Runtime
│   ├── M2.1 Living Room
│   ├── M2.2 Camera Controller
│   ├── M2.3 Timeline Engine
│   └── M2.4 Scene Graph
│
├── PHASE 3 — 🚀 PROTOTYPE v0.1
│   └── M3.1 Complete 20–30s Family Scene
│
├── PHASE 4 — Engine Hardening
│   ├── M4.1 Generic Character API
│   ├── M4.2 Data-driven Scene
│   ├── M4.3 Behavior System
│   └── M4.4 Debug / Editor
│
├── PHASE 5 — Family System
│   ├── M5.1 Dad
│   ├── M5.2 Mom
│   ├── M5.3 Son
│   ├── M5.4 Daughter
│   └── M5.5 Relationship System
│
├── PHASE 6 — Story Engine
│   ├── M6.1 Story Graph
│   ├── M6.2 Comedy Engine
│   ├── M6.3 Scene Planner
│   └── M6.4 Story → Timeline
│
└── PHASE 7 — AI Story Generation
    ├── M7.1 Story Agent
    ├── M7.2 Director Agent
    ├── M7.3 Character Behavior Agent
    └── M7.4 Prompt → 3D Animation
```

---

## Status Legend

| Symbol | Ý nghĩa      |
|--------|--------------|
| ⬜     | TODO         |
| 🔄     | IN PROGRESS  |
| ✅     | DONE         |
| 🔴     | BLOCKED      |
| ⏸️     | PAUSED       |

---

# PHASE 0 — Foundation

> **Mục tiêu:** Dựng nền tảng kỹ thuật: project scaffold, engine skeleton, viewport hoạt động.

---

## M0.1 — Project Setup

**Status:** ✅ DONE

**Goal:** Vite + React + TypeScript + Three.js chạy được. Folder structure đúng chuẩn.

### Tasks

- [x] `npm create vite@latest family-animation -- --template react-ts`
- [x] `npm install three zustand`
- [x] `npm install -D @types/three`
- [x] Cấu hình `tsconfig.json` với path aliases:
  - `@engine/*` → `src/engine/*`
  - `@characters/*` → `src/characters/*`
  - `@scenes/*` → `src/scenes/*`
  - `@ui/*` → `src/ui/*`
  - `@store/*` → `src/store/*`
  - `@hooks/*` → `src/hooks/*`
- [x] Cấu hình `vite.config.ts` với aliases + `assetsInclude: ['**/*.glb', '**/*.gltf']`
- [x] Tạo folder structure đầy đủ theo `struct.md`
- [x] Xóa boilerplate mặc định của Vite

### Definition of Done
> ✅ `npm run dev` chạy không lỗi. Folder structure đúng. TypeScript path aliases resolve được.

---

## M0.2 — Engine Skeleton

**Status:** ✅ DONE

**Goal:** Tạo toàn bộ interfaces và type definitions. Code chưa implement, chỉ cần compile được.

### Tasks

- [x] `engine/character/CharacterDefinition.ts` — interfaces đầy đủ
- [x] `engine/character/CharacterState.ts` — `BehaviorState`, `CharacterRuntimeState`
- [x] `engine/character/Character.ts` — `ICharacterController` interface
- [x] `engine/behavior/Behavior.ts` — `Behavior`, `BehaviorContext` interfaces
- [x] `engine/animation/AnimationDefinition.ts` — `AnimationName`, `AnimationDefinition`
- [x] `engine/emotion/EmotionDefinition.ts` — `EmotionType`, `EmotionDefinition`, `BoneOverride`
- [x] `engine/scene/SceneObject.ts` — `SceneObjectConfig`, `SceneConfig`
- [x] `engine/timeline/TimelineEvent.ts` — `TimelineEvent`, `ActionType`
- [x] `store/characterStore.ts` — Zustand store (empty state)
- [x] `types/index.ts` — re-export tất cả public types
- [x] Chạy `npm run type-check` — không có lỗi TypeScript

### Definition of Done
> ✅ `tsc --noEmit` pass. Tất cả interfaces được định nghĩa theo `data_model.md`.

---

## M0.3 — Basic 3D Viewport

**Status:** ✅ DONE

**Goal:** Canvas Three.js render được, có lighting, có OrbitControls để debug.

### Tasks

- [x] Tạo `engine/scene/SceneManager.ts`:
  - [x] `setup(canvas)` — init WebGLRenderer, Scene, Camera
  - [x] `startRenderLoop()` — requestAnimationFrame loop với delta
  - [x] `stopRenderLoop()`
  - [x] Resize observer
- [x] `ui/Viewport.tsx` — mount canvas, gọi SceneManager.setup()
- [x] Thêm AmbientLight + DirectionalLight cơ bản
- [x] Thêm GridHelper để debug position
- [x] Thêm OrbitControls (Three.js addons) để xoay camera khi dev
- [x] `App.tsx` — layout skeleton (sidebar + viewport + bottom panel)

### Definition of Done
> ✅ Mở browser thấy canvas với grid, có thể xoay camera bằng chuột. Không có console error.

---

# PHASE 1 — Character Runtime

> **Mục tiêu:** Dad có thể load, animate, di chuyển, và express emotion trong 3D scene.

---

## M1.1 — Character Loader

**Status:** ⬜ TODO

**Goal:** Load GLB character vào scene đúng vị trí, scale, orientation.

### Tasks

- [ ] Chuẩn bị asset:
  - [ ] Option A: Download từ Mixamo (fbx → blender → export glb)
  - [ ] Option B: Mock humanoid (BoxGeometry + SphereGeometry)
  - [ ] Đặt vào `public/assets/characters/dad/dad.glb`
- [ ] `characters/dad/dad.definition.ts` — `dadDefinition: CharacterDefinition`
- [ ] `engine/character/CharacterFactory.ts`:
  - [ ] `create(definition)` → Promise<ICharacterController>
  - [ ] `GLTFLoader.load(asset)` — async load GLB
  - [ ] Add model vào scene
  - [ ] Fix scale/rotation nếu cần
- [ ] Setup lighting cho character rõ mặt (DirectionalLight shadow)
- [ ] Test: character hiển thị đúng tại (0, 0, 0)

### Definition of Done
> ✅ Thấy character 3D đứng trong scene, có shadow, đúng scale và orientation.

---

## M1.2 — Animation Controller

**Status:** ⬜ TODO

**Goal:** Abstraction cho AnimationMixer. Play, crossFade, loop, one-shot.

### Tasks

- [ ] `engine/animation/AnimationController.ts`:
  - [ ] Constructor: `(mixer, clips[], definitions[])`
  - [ ] `play(name, options?)` — play với loop config
  - [ ] `crossFadeTo(name, duration?)` — smooth transition
  - [ ] `stop(name?)`
  - [ ] `isPlaying(name)` — boolean
  - [ ] `update(delta)` — advance mixer
- [ ] Map animation clips từ GLB vào `AnimationName` trong dad.definition.ts
- [ ] Tích hợp vào `CharacterFactory.create()`
- [ ] Test: idle loop
- [ ] Test: crossFade idle ↔ walk (0.3s)
- [ ] Test: one-shot sit (`clampWhenFinished: true`)

### Transition Table

| From  | To    | Duration | Type        |
|-------|-------|----------|-------------|
| idle  | walk  | 0.3s     | crossFadeTo |
| walk  | idle  | 0.3s     | crossFadeTo |
| idle  | sit   | 0.2s     | crossFadeTo |
| sit   | stand | 0.3s     | crossFadeTo |
| idle  | talk  | 0.1s     | crossFadeTo |
| talk  | idle  | 0.3s     | crossFadeTo |

### Definition of Done
> ✅ Idle animation loop. CrossFade sang walk mượt. Sit không loop (clamp at end).

---

## M1.3 — State Machine

**Status:** ⬜ TODO

**Goal:** Validate state transitions. Emit events khi state change.

### Tasks

- [ ] `engine/behavior/StateMachine.ts`:
  - [ ] Define valid transitions map
  - [ ] `transition(to)` — validate + execute, return boolean
  - [ ] `canTransition(to)` — check only
  - [ ] `getState()` — current `BehaviorState`
  - [ ] `onStateChange(cb)` — event emitter
- [ ] `engine/behavior/BehaviorManager.ts`:
  - [ ] `execute(behavior)` → Promise<void>
  - [ ] `interrupt()`
  - [ ] `getCurrentBehavior()`
- [ ] `engine/character/CharacterController.ts`:
  - [ ] Implement `ICharacterController`
  - [ ] `idle()` — trigger idle behavior
  - [ ] `getState()` — return `CharacterRuntimeState`
- [ ] Tích hợp StateMachine vào BehaviorManager
- [ ] Test: IDLE → WALKING ✅
- [ ] Test: WALKING → SITTING ❌ (phải idle trước)
- [ ] Test: invalid transition bị reject, state không đổi

### State Transitions

```
IDLE      → WALKING   (walkTo)
IDLE      → SITTING   (sit)
IDLE      → TALKING   (say)
WALKING   → IDLE      (arrived)
SITTING   → IDLE      (stand)
TALKING   → IDLE      (speech done)
any       → LOOKING   (lookAt — parallel, không thay đổi primary state)
```

### Definition of Done
> ✅ State machine validate đúng. Invalid transition bị reject, không crash.

---

## M1.4 — Motion Controller

**Status:** ⬜ TODO

**Goal:** `dad.walkTo(target)` → rotate đúng hướng → di chuyển → stop khi tới nơi.

### Tasks

- [ ] `engine/movement/MotionController.ts`:
  - [ ] Constructor: `(object3D, MovementConfig)`
  - [ ] `moveTo(target: Vector3)` → Promise<void>
  - [ ] `rotateTo(direction: Vector3)` → Promise<void>
  - [ ] `stop()`
  - [ ] `update(delta)` — lerp position, lerp rotation, arrival detection
- [ ] `WalkToBehavior` trong `engine/behavior/Behavior.ts`:
  - [ ] `StateMachine.transition('WALKING')`
  - [ ] `AnimationController.crossFadeTo('walk')`
  - [ ] `MotionController.moveTo(target)`
  - [ ] On arrival: crossFade → idle, transition → IDLE
  - [ ] Resolve Promise
- [ ] `CharacterController.walkTo(target)` — delegate to BehaviorManager
- [ ] `CharacterController.lookAt(target)` — LookAtBehavior (parallel)
- [ ] `CharacterController.sit()` — SitBehavior
- [ ] `CharacterController.stand()` — StandBehavior
- [ ] Test: `await dad.walkTo(new Vector3(3, 0, 0))`
- [ ] Test: sequence `await dad.walkTo(sofa); await dad.sit()`

### Definition of Done
> ✅ `await dad.walkTo(target)` → rotate, walk anim, arrive, idle. Promise resolve đúng lúc.

---

## M1.5 — Emotion System

**Status:** ⬜ TODO

**Goal:** `dad.setEmotion('embarrassed')` → bone overrides applied smoothly.

### Tasks

- [ ] `engine/emotion/EmotionController.ts`:
  - [ ] Constructor: `(object3D, EmotionDefinition[])`
  - [ ] `setEmotion(type)` — apply config
  - [ ] `clearEmotion()` — reset to neutral
  - [ ] `getCurrentEmotion()`
  - [ ] `update(delta)` — lerp bone rotations toward target
- [ ] Implementation priority:
  1. Morph targets nếu asset có blend shapes
  2. Bone rotation overrides (head, spine, shoulder)
  3. Fallback: UI icon overlay
- [ ] Update `dad.definition.ts` — thêm emotion bone configs
- [ ] `CharacterController.setEmotion(type)` — delegate to EmotionController
- [ ] Test: `neutral` → `happy` → `embarrassed` → `neutral`
- [ ] Kiểm tra lerp smooth (không snap)

### Emotions

| Emotion     | Bone Overrides                                |
|-------------|-----------------------------------------------|
| neutral     | Reset all                                     |
| happy       | Slight chest up, chin up                      |
| surprised   | Head back, shoulders up                       |
| confused    | Head tilt left                                |
| embarrassed | Head down, body slightly back, look away      |
| angry       | Head forward, shoulders tense                 |
| sleepy      | Head forward/down, shoulders drooped          |

### Definition of Done
> ✅ Gọi `setEmotion()` thấy pose character thay đổi rõ ràng với smooth transition.

---

# PHASE 2 — Scene & Cinematic Runtime

> **Mục tiêu:** Living room đầy đủ, camera cinematic, timeline declarative hoạt động.

---

## M2.1 — Living Room

**Status:** ⬜ TODO

**Goal:** Scene living room với các objects có named IDs. SceneManager có object registry.

### Tasks

- [ ] Cập nhật `engine/scene/SceneManager.ts`:
  - [ ] `loadEnvironment(config: SceneConfig)` — load tất cả objects
  - [ ] `getObject(id: string)` → Object3D | null
  - [ ] `addCharacter(id, object3D)`
  - [ ] Object registry: `Map<string, Object3D>`
- [ ] `scenes/living-room/livingRoom.ts` — `SceneConfig`:

| Object      | Position          | Type             |
|-------------|-------------------|------------------|
| floor       | (0, 0, 0)         | PlaneGeometry    |
| sofa        | (3, 0.4, 1)       | Box primitive    |
| tv          | (0, 1.2, -4)      | Box primitive    |
| coffee_table| (1.5, 0.3, -0.5)  | Box primitive    |
| lamp        | (-3, 0, 2)        | Cylinder prim.   |

- [ ] Thêm màu sắc cho từng object (không để grey tất cả)
- [ ] Test: `sceneManager.getObject('sofa')` → đúng Object3D
- [ ] Test: `await dad.walkTo(sceneManager.getObject('sofa'))` → Dad đi tới sofa

### Definition of Done
> ✅ Thấy living room với 5 objects màu sắc khác nhau. Dad đi đúng tới sofa.

---

## M2.2 — Camera Controller

**Status:** ⬜ TODO

**Goal:** Static / follow / lookAt camera với smooth transitions.

### Tasks

- [ ] `engine/camera/CameraController.ts`:
  - [ ] Constructor: `(PerspectiveCamera)`
  - [ ] `setMode(mode: CameraMode)`
  - [ ] `setStatic(position, lookAt)` — fixed cinematic shot
  - [ ] `follow(target, offset?)` — smooth follow cam
  - [ ] `lookAt(target)` — smooth lookAt
  - [ ] `update(delta)` — lerp camera position và rotation
- [ ] Default: follow Dad với offset `(0, 3, 6)`
- [ ] Test: camera follow khi `dad.walkTo()`
- [ ] Test: `camera.setStatic()` — camera không di chuyển
- [ ] Test: switch giữa các modes không glitch

### Camera Modes

```
static   → Fixed position, fixed lookAt
follow   → Position lerps behind character, lookAt character
look_at  → Position cố định, rotation lerps toward target
```

### Definition of Done
> ✅ Camera follow Dad mượt. `setStatic()` lock camera. Không có camera jump khi switch mode.

---

## M2.3 — Timeline Engine

**Status:** ⬜ TODO

**Goal:** Load JSON timeline, dispatch Character API calls đúng thời điểm.

### Tasks

- [ ] `engine/timeline/Timeline.ts`:
  - [ ] `load(events: TimelineEvent[])` hoặc `loadFromJson(json)`
  - [ ] `play()`
  - [ ] `pause()`
  - [ ] `seek(time: number)`
  - [ ] `reset()`
  - [ ] `update(delta)` — advance time, dispatch events
  - [ ] `onEvent(cb)` — hook cho UI
  - [ ] `registerActor(id, controller)` — link character id → controller
- [ ] Action dispatcher: switch `event.action` → gọi đúng Character API
- [ ] `scenes/living-room/livingRoom.timeline.json` — prototype story 25s
- [ ] Test: `timeline.play()` → Dad tự thực hiện sequence
- [ ] Test: `timeline.pause()` → dừng đúng chỗ
- [ ] Test: `timeline.seek(10)` → jump đến t=10s

### Definition of Done
> ✅ Load JSON timeline, play, Dad tự thực hiện toàn bộ 25s sequence không cần gọi API thủ công.

---

## M2.4 — Scene Graph

**Status:** ⬜ TODO

**Goal:** Scene graph có cấu trúc rõ ràng, hỗ trợ named lookup, parent-child relationships.

### Tasks

- [ ] Refactor `SceneManager` thành scene graph có hierarchy:
  ```
  Scene
  ├── Environment
  │   ├── floor
  │   ├── sofa
  │   ├── tv
  │   ├── coffee_table
  │   └── lamp
  ├── Characters
  │   └── dad
  ├── Lights
  └── Camera
  ```
- [ ] `SceneGraph.ts` — typed wrapper cho Three.js scene hierarchy
- [ ] Hỗ trợ `getNode(path)` → Object3D, ví dụ `getNode('Environment/sofa')`
- [ ] Hỗ trợ `getAllCharacters()` → Character list
- [ ] Position anchors: define named positions (sofa_sit_pos, tv_look_pos, ...)

### Definition of Done
> ✅ Scene có hierarchy rõ ràng. Named lookup hoạt động. Position anchors đúng.

---

# PHASE 3 — 🚀 PROTOTYPE v0.1

> **Mục tiêu:** Demo hoàn chỉnh 20–30s. Chứng minh toàn bộ Character Runtime hoạt động.

---

## M3.1 — Complete 20–30s Family Scene

**Status:** ⬜ TODO

**Goal:** Full story sequence chạy tự động. UI debug panel đầy đủ. Definition of Done từ `required.txt`.

### Tasks

#### Story Sequence (25s)
- [ ] `t=0s` Dad đứng, idle animation
- [ ] `t=1s` Dad nhìn TV (`lookAt`)
- [ ] `t=2s` Dad đi tới sofa (`walkTo`)
- [ ] `t=5.5s` Dad quay về phía sofa
- [ ] `t=6s` Dad ngồi xuống (`sit`)
- [ ] `t=8s` Dad nhìn TV (`lookAt`)
- [ ] `t=10s` Dad nói: *"Anh chỉ xem một chút thôi."*
- [ ] `t=13s` Dad cười (`laugh`)
- [ ] `t=15s` Mom placeholder xuất hiện ở cửa phòng
- [ ] `t=17s` Dad nhìn Mom (`lookAt`)
- [ ] `t=18s` Dad chuyển emotion → `embarrassed`
- [ ] `t=20s` Dad nhìn sang hướng khác

#### UI Debug Panel
- [ ] `CharacterPanel.tsx` — State, Emotion, Position X/Y/Z
- [ ] `ActionPanel.tsx` — buttons: Walk To Sofa, Look At TV, Sit, Stand, Talk, Laugh
- [ ] Emotion buttons: Happy, Surprised, Embarrassed, Neutral
- [ ] `TimelinePanel.tsx` — Play/Pause, time scrubber, current time

#### Dialogue System
- [ ] Text bubble UI overlay khi Dad nói
- [ ] Optional: Web Speech API TTS
- [ ] Duration: text hiển thị đủ lâu để đọc được

#### Final Checklist (từ `required.txt` section 22)
- [ ] 1. Living room 3D hiển thị
- [ ] 2. Dad xuất hiện trong scene
- [ ] 3. Dad có idle animation
- [ ] 4. Dad có walk animation
- [ ] 5. Dad có sit animation
- [ ] 6. Dad đi được tới sofa
- [ ] 7. Dad tự quay đúng hướng sofa
- [ ] 8. Dad ngồi xuống
- [ ] 9. Dad nhìn TV (lookAt)
- [ ] 10. Dad thay đổi emotion
- [ ] 11. Dad nói một câu
- [ ] 12. Camera follow Dad
- [ ] 13. Timeline điều khiển sequence
- [ ] 14. UI hiển thị state hiện tại
- [ ] 15. Buttons trigger behaviors
- [ ] 16. Code chia module rõ ràng
- [ ] 17. Không có logic quan trọng trong React UI
- [ ] 18. Có thể thêm Mom mà không sửa engine

### Definition of Done
> ✅ Mở browser → Play → xem 25s scene chạy tự động. 18/18 checklist pass.

---

# PHASE 4 — Engine Hardening

> **Mục tiêu:** Engine production-ready. Generic, data-driven, debuggable.

---

## M4.1 — Generic Character API

**Status:** ⬜ TODO

- [ ] Hoàn thiện `CharacterFactory` — load bất kỳ CharacterDefinition
- [ ] Unit test cho `CharacterFactory.create()`
- [ ] Test: `factory.create(momDefinition)` → Mom controller hoạt động (chưa cần asset)
- [ ] Error handling: asset không tìm thấy, animation clip thiếu

---

## M4.2 — Data-driven Scene

**Status:** ⬜ TODO

- [ ] Scene hoàn toàn từ JSON config (không hardcode trong TS)
- [ ] Hỗ trợ load GLB prop assets (sofa.glb, tv.glb, ...)
- [ ] Hot-reload scene config trong dev mode

---

## M4.3 — Behavior System

**Status:** ⬜ TODO

- [ ] Behavior queue (không chỉ interrupt)
- [ ] Behavior priority (urgent behaviors interrupt thấp hơn)
- [ ] Composite behaviors: `WalkThenSit`, `LookThenTalk`
- [ ] Custom behaviors per character (dad.behaviors.ts)

---

## M4.4 — Debug / Editor

**Status:** ⬜ TODO

- [ ] Scene hierarchy viewer trong UI
- [ ] Real-time bone inspector
- [ ] Animation timeline scrubber per animation clip
- [ ] Performance stats (FPS, draw calls)
- [ ] Hot-reload timeline JSON trong dev mode

---

# PHASE 5 — Family System

> **Mục tiêu:** 4 characters với personalities riêng biệt. Multi-character interaction.

---

## M5.1 — Dad ✅ (từ Phase 1–3)

- [ ] Polish asset chất lượng cao hơn
- [ ] Thêm animations: sneak, scratch_head, look_away
- [ ] Mở rộng emotion set

---

## M5.2 — Mom

**Status:** ⬜ TODO

- [ ] `mom.definition.ts` — traits: `strict`, `principled`, `caring`
- [ ] Mom GLB asset (rigged, animations)
- [ ] Mom-specific behaviors: `scold`, `assign_chore`, `approve`, `disapprove`
- [ ] `factory.create(momDefinition)` → Mom controller

---

## M5.3 — Son

**Status:** ⬜ TODO

- [ ] `son.definition.ts` — traits: `loyal_to_dad`, `playful`, `easily_influenced`
- [ ] Son GLB asset (child proportions)
- [ ] Son-specific behaviors: `defend_dad`, `agree_with_dad`, `play`

---

## M5.4 — Daughter

**Status:** ⬜ TODO

- [ ] `daughter.definition.ts` — traits: `smart`, `mischievous`, `observant`
- [ ] Daughter GLB asset (child proportions)
- [ ] Daughter-specific behaviors: `tattle_on_dad`, `observe`, `giggle`

---

## M5.5 — Relationship System

**Status:** ⬜ TODO

- [ ] `RelationshipGraph` — model quan hệ giữa characters
- [ ] Multi-character behaviors: `two_shot_conversation`, `group_reaction`
- [ ] Character nhận biết nhau (Dad nhìn Mom → embarrassed tự động)
- [ ] Proximity detection: characters cách nhau bao nhiêu → trigger reactions

---

# PHASE 6 — Story Engine

> **Mục tiêu:** Tạo story từ high-level script, compile thành Timeline JSON.

---

## M6.1 — Story Graph

**Status:** ⬜ TODO

- [ ] `StoryGraph` — directed graph của story beats
- [ ] Node types: `setup`, `conflict`, `reaction`, `resolution`, `punchline`
- [ ] Story beat → Scene actions mapping
- [ ] Declarative story format (JSON/YAML)

---

## M6.2 — Comedy Engine

**Status:** ⬜ TODO

- [ ] Comedy timing rules (setup → beat → punchline timing)
- [ ] Character personality → behavior selection
- [ ] Surprise / embarrassment reaction chains
- [ ] Comedy beat templates: `caught_red_handed`, `failed_escape`, `innocent_betrayal`

---

## M6.3 — Scene Planner

**Status:** ⬜ TODO

- [ ] Story beats → Camera shots
- [ ] Character positioning cho từng shot
- [ ] Pacing: slow scenes vs fast comedy moments
- [ ] Shot selection: wide, medium, close-up, two-shot

---

## M6.4 — Story → Timeline

**Status:** ⬜ TODO

- [ ] Compiler: `StoryGraph` → `TimelineEvent[]` JSON
- [ ] Auto-calculate timing dựa trên animation durations
- [ ] Multi-character timeline (Dad + Mom + Son + Daughter)

---

# PHASE 7 — AI Story Generation

> **Mục tiêu:** User nhập prompt → AI generate → 3D animation tự động render.

---

## M7.1 — Story Agent

**Status:** ⬜ TODO

- [ ] LLM integration (Gemini API)
- [ ] User prompt → Story beats (JSON)
- [ ] Character personality constraints trong prompt
- [ ] Output schema validation

---

## M7.2 — Director Agent

**Status:** ⬜ TODO

- [ ] Story beats → Scene Plan (camera, timing, character positions)
- [ ] Shot list generation
- [ ] Pacing và comedy timing optimization

---

## M7.3 — Character Behavior Agent

**Status:** ⬜ TODO

- [ ] Story context → Character API calls
- [ ] Personality-consistent behavior selection
- [ ] Dialogue generation cho từng character

---

## M7.4 — Prompt → 3D Animation

**Status:** ⬜ TODO

- [ ] End-to-end pipeline: User types → AI generates → Engine renders
- [ ] `POST /api/generate` → `{ storyGraph, timeline }` → Browser plays
- [ ] Preview mode: xem trước trước khi render
- [ ] Export: record canvas → video file

---

## Commit Convention

```
feat(m0.1): project setup vite + typescript
feat(m0.2): engine skeleton interfaces
feat(m0.3): basic 3d viewport
feat(m1.1): character loader glb
feat(m1.2): animation controller crossfade
feat(m1.3): state machine
feat(m1.4): motion controller walktotarget
feat(m1.5): emotion system bone override
feat(m2.1): living room scene
feat(m2.2): camera controller follow
feat(m2.3): timeline engine json
feat(m2.4): scene graph hierarchy
feat(m3.1): prototype v0.1 complete
...
```

---

## Notes

- **Phase 0–3:** Tập trung hoàn toàn. Đây là foundation của toàn bộ hệ thống.
- **Phase 4:** Không bỏ qua. Nếu engine không generic thì Phase 5 sẽ phải rewrite.
- **Phase 5–7:** Có thể làm parallel nếu đủ resource.
- **Asset strategy:** Dùng Mixamo free assets cho Phase 0–3. Upgrade asset quality ở Phase 4+.
- **Không nhảy sang Phase 7** cho đến khi Phase 3 PROTOTYPE v0.1 chạy stable.
