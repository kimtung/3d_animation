# Technical Decisions – AI 3D Family Animation Engine

## 1. Core Technology Stack

| Layer       | Technology              | Lý do chọn                                           |
|-------------|-------------------------|------------------------------------------------------|
| Framework   | **React 18**            | Component model tốt cho debug UI, hooks đơn giản     |
| Language    | **TypeScript**          | Type safety cho interfaces, bắt lỗi sớm              |
| Build       | **Vite**                | HMR nhanh, zero config cho TS                        |
| 3D Runtime  | **Three.js (vanilla)**  | Standard, AnimationMixer có sẵn, full control        |
| State (UI)  | **Zustand**             | Lightweight, không boilerplate như Redux              |
| 3D Format   | **GLB/GLTF**            | Binary, compact, hỗ trợ skeleton + animation         |

---

## 2. Three.js vanilla vs React Three Fiber

**Chọn: Three.js vanilla**

| Option                | Pro                                  | Con                                         |
|-----------------------|--------------------------------------|---------------------------------------------|
| **Three.js vanilla**  | Full control, no abstraction leak    | Verbose setup                               |
| React Three Fiber     | React-idiomatic, declarative         | Khó control render loop, abstraction leak   |
| Babylon.js            | Built-in physics                     | Heavier bundle, ít tài nguyên hơn           |

**Lý do:** Engine cần full control render loop. Sau này AI Story Engine chạy độc lập với React.

---

## 3. Zustand vs Custom State

**Chọn: Zustand**

- Bridge nhỏ giữa engine (vanilla TS) và React
- Không force re-render toàn bộ component tree
- **Engine tự quản lý state nội bộ** – Zustand chỉ là mirror để UI đọc

---

## 4. Animation – AnimationMixer + crossFade

**Dùng Three.js `AnimationMixer` + `crossFadeTo`**

**Transition table:**

| From  | To    | Duration | Method      |
|-------|-------|----------|-------------|
| idle  | walk  | 0.3s     | crossFadeTo |
| walk  | idle  | 0.3s     | crossFadeTo |
| idle  | sit   | 0.2s     | crossFadeTo |
| sit   | stand | 0.3s     | crossFadeTo |
| idle  | talk  | 0.1s     | crossFadeTo |

---

## 5. Character API – Async/Promise

**Tất cả behaviors phải return Promise**

```typescript
// ✅ Đúng – có thể sequence
await dad.walkTo(sofa);
await dad.sit();
await dad.say("...");

// ❌ Sai – race condition
dad.walkTo(sofa);
dad.sit();
```

**Lý do:** Timeline engine cần await để sequence. Sau này AI generate code `await dad.walkTo(...)`.

---

## 6. Timeline – Declarative JSON

```json
// ✅ JSON – AI có thể generate
{ "time": 2, "actor": "dad", "action": "walk_to", "target": "sofa" }

// ❌ Code – AI khó generate, khó serialize
setTimeout(() => dad.walkTo(sofa), 2000)
```

---

## 7. Emotion – Bone Override Priority

**Prototype: Bone Override trước, Morph Target nếu asset hỗ trợ**

```
Strategy 1 (primary): Bone rotation override
  - Không cần asset có blend shapes
  - Head tilt, shoulder slump, spine forward

Strategy 2 (if asset supports): Morph targets
  - Facial blend shapes

Strategy 3 (fallback): UI overlay
  - Emoji/icon floating above head
```

---

## 8. Physics – Không dùng Rapier

- Movement dùng simple lerp + threshold detection
- Sitting: hardcode position offset
- Add Rapier sau nếu cần collision detection

---

## 9. Asset Strategy – Mixamo First

**Priority:**
1. **Mixamo** – Free, rigged, walk/idle/sit animations, export GLB
2. **Sketchfab** – Search "cartoon character rigged"
3. **Kenney.nl** – Public domain humanoid assets
4. **Mock primitive** – Box body + sphere head nếu không có asset

**Yêu cầu tối thiểu:**
```
✅ Humanoid skeleton
✅ Idle animation
✅ Walk cycle animation
✅ GLB/GLTF format
```

---

## 10. Render Loop Ownership

**SceneManager owns render loop. React không own loop.**

```
SceneManager.startRenderLoop()
  └── requestAnimationFrame → update all systems → render

React chỉ: mount canvas, subscribe store, render HTML UI
```

---

## 11. CharacterFactory – No Hard-code

```typescript
// ✅ Đúng
const dad = await factory.create(dadDefinition);
const mom = await factory.create(momDefinition);  // zero code change

// ❌ Sai
class DadController { ... }
```

---

## 12. Module Boundary Rules

```
Rule 1: engine/* không import từ ui/* hoặc store/*
Rule 2: ui/* không import Three.js trực tiếp
Rule 3: characters/* chỉ chứa data, không chứa logic
Rule 4: Timeline chỉ biết ICharacterController interface
Rule 5: BehaviorManager không import React
```

---

## 13. Bundle Size

| Package     | Size (gzip) | Note                             |
|-------------|-------------|----------------------------------|
| three.js    | ~170KB      | Import chỉ những gì cần         |
| zustand     | ~3KB        | Rất nhỏ                          |
| react+dom   | ~44KB       | Standard                         |
| rapier      | ~500KB      | **Không dùng trong prototype**  |
