# Plan – AI 3D Family Animation Engine
## Character Prototype Execution Plan

> **Mục tiêu:** Hoàn thành Character Runtime Vertical Slice (Dad + Living Room)
> **Nguyên tắc:** Mỗi milestone phải stable trước khi sang milestone tiếp theo.

---

## Tổng quan Milestones

| #   | Milestone                      | Status     | Ước lượng |
|-----|--------------------------------|------------|-----------|
| M1  | Project Setup                  | ⬜ TODO    | 30 phút   |
| M2  | Load GLB Character             | ⬜ TODO    | 1–2 giờ   |
| M3  | Animation Controller           | ⬜ TODO    | 1–2 giờ   |
| M4  | Character State Machine        | ⬜ TODO    | 1 giờ     |
| M5  | Motion Controller + walkTo     | ⬜ TODO    | 2–3 giờ   |
| M6  | Living Room Scene              | ⬜ TODO    | 1–2 giờ   |
| M7  | Camera Controller              | ⬜ TODO    | 1 giờ     |
| M8  | Timeline Engine                | ⬜ TODO    | 2 giờ     |
| M9  | Emotion Controller             | ⬜ TODO    | 1–2 giờ   |
| M10 | Dialogue / TTS Abstraction     | ⬜ TODO    | 1 giờ     |
| M11 | UI Debug Panel                 | ⬜ TODO    | 2 giờ     |

**Status legend:** ⬜ TODO · 🔄 IN PROGRESS · ✅ DONE · 🔴 BLOCKED

---

## M1 – Project Setup

**Goal:** React + TypeScript + Vite + Three.js chạy được, render một cube xoay.

### Tasks

- [ ] Tạo project bằng Vite: `npm create vite@latest family-animation -- --template react-ts`
- [ ] Install dependencies: `npm install three zustand`
- [ ] Install dev deps: `npm install -D @types/three`
- [ ] Cấu hình `tsconfig.json` với path aliases (`@engine`, `@ui`, `@store`, ...)
- [ ] Cấu hình `vite.config.ts` với aliases + `assetsInclude: ['**/*.glb']`
- [ ] Tạo folder structure theo `struct.md`
- [ ] Tạo `SceneManager.ts` cơ bản: init renderer, scene, camera, render loop
- [ ] Mount canvas trong `Viewport.tsx`
- [ ] Render một rotating cube để xác nhận Three.js hoạt động
- [ ] Xóa cube test, commit

### Definition of Done
> ✅ Mở browser thấy canvas Three.js, không có console error.

---

## M2 – Load GLB Character

**Goal:** Load GLB character model vào scene, hiển thị đúng vị trí, scale.

### Tasks

- [ ] Tìm / chuẩn bị GLB asset (Mixamo hoặc mock humanoid)
- [ ] Đặt file vào `public/assets/characters/dad/dad.glb`
- [ ] Tạo `CharacterDefinition.ts` – interface đầy đủ (xem `data_model.md`)
- [ ] Tạo `dad.definition.ts` – điền thông tin Dad
- [ ] Tạo `CharacterFactory.ts` – method `create(definition)` dùng `GLTFLoader`
- [ ] Add character vào scene tại vị trí (0, 0, 0)
- [ ] Kiểm tra scale, rotation đúng (character đứng thẳng, không bị lật)
- [ ] Setup lighting (AmbientLight + DirectionalLight) để model không bị tối
- [ ] Thêm Grid helper để debug position

### Definition of Done
> ✅ Thấy character 3D đứng trong scene, có lighting cơ bản.

---

## M3 – Animation Controller

**Goal:** Character chạy idle animation, có thể switch sang walk/sit.

### Tasks

- [ ] Tạo `AnimationDefinition.ts` – type `AnimationName`, interface `AnimationDefinition`
- [ ] Tạo `AnimationController.ts`:
  - [ ] Constructor nhận `AnimationMixer` + `AnimationClip[]` + `AnimationDefinition[]`
  - [ ] Method `play(name, options?)` – play/loop animation
  - [ ] Method `crossFadeTo(name, duration?)` – smooth transition
  - [ ] Method `update(delta)` – advance mixer
  - [ ] Method `isPlaying(name)` – check current
- [ ] Map animation clips từ GLB vào `AnimationName` trong `dad.definition.ts`
- [ ] Tích hợp vào `CharacterFactory.create()` – tạo AnimationController cho Dad
- [ ] Test: idle animation loop
- [ ] Test: crossFade idle → walk → idle
- [ ] Test: one-shot sit animation (clampWhenFinished)

### Definition of Done
> ✅ Character chạy idle. Có thể call `animController.crossFadeTo('walk')` và thấy transition mượt.

---

## M4 – Character State Machine

**Goal:** State machine validate transitions, emit events để UI và behaviors phản ứng.

### Tasks

- [ ] Tạo `CharacterState.ts` – type `BehaviorState`, interface `CharacterRuntimeState`
- [ ] Tạo `StateMachine.ts`:
  - [ ] Define valid transitions map
  - [ ] Method `transition(to)` – validate + execute
  - [ ] Method `canTransition(to)` – check without executing
  - [ ] Method `getState()` – current state
  - [ ] Event emitter: `onStateChange(cb)`
- [ ] Tạo `Behavior.ts` – interface `Behavior`, interface `BehaviorContext`
- [ ] Tạo `BehaviorManager.ts`:
  - [ ] Method `execute(behavior)` → Promise
  - [ ] Method `interrupt()`
  - [ ] Property `currentBehavior`
- [ ] Tạo `CharacterController.ts` – implement `ICharacterController` interface:
  - [ ] `idle()` → BehaviorManager
  - [ ] `getState()` → CharacterRuntimeState

### Definition of Done
> ✅ Gọi `stateMachine.transition('WALKING')` từ IDLE thành công. Transition invalid bị reject.

---

## M5 – Motion Controller + walkTo

**Goal:** `dad.walkTo(target)` → character rotate đúng hướng, đi tới, stop.

### Tasks

- [ ] Tạo `MotionController.ts`:
  - [ ] Constructor nhận `Object3D` + `MovementConfig`
  - [ ] Method `moveTo(target: Vector3)` → Promise
  - [ ] Method `rotateTo(direction: Vector3)` → Promise
  - [ ] Method `stop()`
  - [ ] Method `update(delta)` – lerp position, lerp rotation, detect arrival
- [ ] Implement `WalkToBehavior` trong `Behavior.ts`:
  - [ ] Transition state: IDLE → WALKING
  - [ ] Call `AnimationController.crossFadeTo('walk')`
  - [ ] Call `MotionController.moveTo(target)`
  - [ ] On arrival: crossFade → idle, transition WALKING → IDLE
- [ ] Implement `CharacterController.walkTo(target)` – delegate to BehaviorManager
- [ ] Test: `await dad.walkTo(new Vector3(3, 0, 0))`
- [ ] Test: character rotate đúng hướng trước khi đi
- [ ] Test: arrival detection chính xác

### Definition of Done
> ✅ `await dad.walkTo(sofa)` → character rotate, walk animation, dừng đúng chỗ, return idle.

---

## M6 – Living Room Scene

**Goal:** Living room với Floor, Sofa, TV, CoffeeTable, Lamp. Objects có named IDs.

### Tasks

- [ ] Tạo `SceneObject.ts` – interface `SceneObjectConfig`, `PrimitiveConfig`
- [ ] Cập nhật `SceneManager.ts`:
  - [ ] Method `loadEnvironment(config: SceneConfig)`
  - [ ] Method `getObject(id: string)` → `Object3D | null`
  - [ ] Method `addCharacter(id, object3D)`
  - [ ] Registry: `Map<string, Object3D>`
- [ ] Tạo `livingRoom.ts` – `SceneConfig` với positions:
  - [ ] Floor: PlaneGeometry 10×10, position (0,0,0)
  - [ ] Sofa: Box primitive, position (3, 0, 1)
  - [ ] TV: Box primitive, position (0, 1, -4) – mounted on wall
  - [ ] CoffeeTable: Box primitive, position (2, 0, -1)
  - [ ] Lamp: Cylinder primitive, position (-3, 0, 2)
- [ ] Load scene trong App.tsx startup
- [ ] Test: `sceneManager.getObject('sofa')` trả về đúng object
- [ ] Test: `dad.walkTo(sceneManager.getObject('sofa'))` – đi đúng tới sofa

### Definition of Done
> ✅ Thấy living room với các object. Dad đi được tới sofa khi gọi walkTo.

---

## M7 – Camera Controller

**Goal:** Camera static, follow, lookAt. Smooth transition.

### Tasks

- [ ] Tạo `CameraController.ts`:
  - [ ] Constructor nhận `PerspectiveCamera`
  - [ ] Method `setStatic(position, lookAt)`
  - [ ] Method `follow(target: Object3D, offset?: Vector3)` – smooth follow
  - [ ] Method `lookAt(target: Object3D | Vector3)` – smooth lookAt
  - [ ] Method `setMode(mode: CameraMode)`
  - [ ] Method `update(delta)` – lerp camera position/rotation
- [ ] Default mode: `follow` với Dad, offset (0, 3, 6)
- [ ] Test: camera follow Dad khi walkTo
- [ ] Test: `camera.setStatic(pos, lookAt)` – fixed cinematic shot
- [ ] Test: `camera.lookAt(dad)` – camera xoay smooth

### Definition of Done
> ✅ Camera follow Dad khi di chuyển. Có thể switch sang static mode.

---

## M8 – Timeline Engine

**Goal:** Load JSON timeline, dispatch character API calls đúng thời điểm.

### Tasks

- [ ] Tạo `TimelineEvent.ts` – interface `TimelineEvent`, type `ActionType`
- [ ] Tạo `Timeline.ts`:
  - [ ] Method `load(events: TimelineEvent[])`
  - [ ] Method `play()`
  - [ ] Method `pause()`
  - [ ] Method `seek(time: number)`
  - [ ] Method `reset()`
  - [ ] Method `update(delta)` – advance time, dispatch events
  - [ ] Event dispatch: resolve actor → CharacterController → call API
- [ ] Tạo `livingRoom.timeline.json` – prototype story 25s (xem `runtime_flow.md`)
- [ ] Test: load JSON, play(), xem Dad thực hiện sequence
- [ ] Test: pause() dừng đúng chỗ, play() resume
- [ ] Test: reset() về t=0

### Definition of Done
> ✅ Play timeline → Dad tự động thực hiện đủ sequence: idle → lookAt TV → walkTo sofa → sit.

---

## M9 – Emotion Controller

**Goal:** `dad.setEmotion('embarrassed')` → bone overrides applied smoothly.

### Tasks

- [ ] Tạo `EmotionDefinition.ts` – type `EmotionType`, interface `EmotionDefinition`, `BoneOverride`
- [ ] Tạo `EmotionController.ts`:
  - [ ] Constructor nhận `SkinnedMesh` + `EmotionDefinition[]`
  - [ ] Method `setEmotion(type: EmotionType)`
  - [ ] Method `clearEmotion()`
  - [ ] Method `update(delta)` – lerp bone rotations
  - [ ] Try: morph targets nếu asset có
  - [ ] Fallback: bone rotation override
- [ ] Update `dad.definition.ts` – thêm emotion definitions đầy đủ
- [ ] Test: `dad.setEmotion('happy')` → thay đổi visible
- [ ] Test: `dad.setEmotion('embarrassed')` → head tilt down, body slightly back
- [ ] Test: `dad.setEmotion('neutral')` → reset về pose mặc định

### Definition of Done
> ✅ Gọi setEmotion() thấy pose character thay đổi rõ ràng.

---

## M10 – Dialogue / TTS Abstraction

**Goal:** `dad.say("text")` → hiển thị text bubble, optional Web Speech API TTS.

### Tasks

- [ ] Tạo interface `DialogueController` trong engine
- [ ] Implement `SayBehavior`:
  - [ ] Transition state → TALKING
  - [ ] `AnimationController.crossFadeTo('talk')`
  - [ ] Hiển thị text (qua store → React UI)
  - [ ] Optional: `window.speechSynthesis.speak(utterance)` (Web Speech API)
  - [ ] On complete (timer hoặc TTS end event): transition → IDLE
- [ ] Update `CharacterStoreState` – thêm `isTalking`, `currentDialogue`
- [ ] Tạo `DialogueBubble.tsx` – floating text trong UI overlay
- [ ] Test: `await dad.say("Anh chỉ xem một chút thôi.")` → text hiện, talk anim, tự hết

### Definition of Done
> ✅ Gọi say() → thấy text trên screen, character talk animation, text tự mất sau khi xong.

---

## M11 – UI Debug Panel

**Goal:** Debug UI hiển thị state, emotion, position. Buttons trigger behaviors.

### Tasks

- [ ] Cập nhật `characterStore.ts` – sync đầy đủ từ engine mỗi frame
- [ ] Tạo `useCharacter.ts` hook – subscribe characterStore
- [ ] Tạo `useTimeline.ts` hook – subscribe timelineStore
- [ ] Implement `CharacterPanel.tsx`:
  - [ ] Character name
  - [ ] State badge (IDLE / WALKING / SITTING / TALKING)
  - [ ] Emotion badge
  - [ ] Position X/Y/Z (2 decimal places)
- [ ] Implement `ActionPanel.tsx` – buttons:
  - [ ] [Walk To Sofa]
  - [ ] [Look At TV]
  - [ ] [Sit]
  - [ ] [Stand]
  - [ ] [Talk]
  - [ ] [Happy] [Embarrassed] [Neutral] (emotion buttons)
- [ ] Implement `TimelinePanel.tsx`:
  - [ ] Play / Pause button
  - [ ] Time scrubber (slider)
  - [ ] Current time display
- [ ] Layout App.tsx theo wireframe trong `required.txt` (section 16)
- [ ] Test tất cả buttons hoạt động
- [ ] Test timeline controls hoạt động

### Definition of Done
> ✅ UI hiển thị đúng state real-time. Mọi button trigger đúng behavior. Timeline có thể play/pause/seek.

---

## Final Check – Definition of Done (Full Prototype)

Theo `required.txt` section 22, prototype thành công khi:

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

---

## Notes

- **Thứ tự ưu tiên:** M1 → M2 → M3 → M4 → M5 (core locomotion). Sau đó M6 → M7 → M8 → M9 → M10 → M11.
- **Không skip milestone.** Nếu M3 (animation) chưa ổn thì M5 (walkTo) sẽ lỗi.
- **Asset blocker:** Nếu không có GLB phù hợp, dùng mock primitive (box + sphere) để unblock M2–M5, sau đó swap asset.
- **Commit sau mỗi milestone** với message: `feat(m1): project setup`, `feat(m2): load glb character`, ...
