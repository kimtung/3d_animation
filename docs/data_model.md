# Data Model – AI 3D Family Animation Engine

## 1. CharacterDefinition

> Dữ liệu bất biến, mô tả một character. Được load bởi `CharacterFactory`.

```typescript
interface CharacterDefinition {
  id: string;                          // "dad", "mom", "son", "daughter"
  name: string;                        // Display name
  asset: string;                       // Path đến GLB file

  personality: Personality;
  capabilities: CharacterCapability[];
  animations: AnimationDefinition[];
  emotions: EmotionDefinition[];
  movementConfig: MovementConfig;
}

interface Personality {
  traits: PersonalityTrait[];
}

type PersonalityTrait =
  | 'funny' | 'kind' | 'strict' | 'relaxed'
  | 'slightly_lazy' | 'easy_going' | 'smart'
  | 'mischievous' | 'avoids_conflict';

type CharacterCapability =
  | 'walk' | 'sit' | 'stand' | 'look_at'
  | 'talk' | 'laugh' | 'idle';
```

---

## 2. CharacterRuntimeState

> Dữ liệu thay đổi trong runtime.

```typescript
interface CharacterRuntimeState {
  characterId: string;
  behaviorState: BehaviorState;
  position: Vector3Like;
  rotation: number;
  location: SceneLocationId;
  emotion: EmotionType;
  energy: number;                // 0–100
  isTalking: boolean;
  currentDialogue: string | null;
}

type BehaviorState = 'IDLE' | 'WALKING' | 'SITTING' | 'TALKING' | 'LOOKING';

interface Vector3Like {
  x: number;
  y: number;
  z: number;
}
```

---

## 3. AnimationDefinition

```typescript
interface AnimationDefinition {
  name: AnimationName;          // Tên logic trong engine
  clipName: string;             // Tên clip trong GLB
  loop: boolean;
  defaultTransitionDuration: number; // seconds
}

type AnimationName =
  | 'idle' | 'walk' | 'sit'
  | 'stand' | 'talk' | 'laugh' | 'look_around';
```

**Ví dụ Dad animations:**
```typescript
animations: [
  { name: 'idle',  clipName: 'Armature|idle',  loop: true,  defaultTransitionDuration: 0.3 },
  { name: 'walk',  clipName: 'Armature|walk',  loop: true,  defaultTransitionDuration: 0.3 },
  { name: 'sit',   clipName: 'Armature|sit',   loop: false, defaultTransitionDuration: 0.2 },
  { name: 'stand', clipName: 'Armature|stand', loop: false, defaultTransitionDuration: 0.3 },
  { name: 'talk',  clipName: 'Armature|talk',  loop: true,  defaultTransitionDuration: 0.1 },
]
```

---

## 4. EmotionDefinition

```typescript
interface EmotionDefinition {
  type: EmotionType;
  boneOverrides?: BoneOverride[];
  morphTargets?: MorphTargetConfig[];
  gestureAnimation?: AnimationName;
}

type EmotionType =
  | 'neutral' | 'happy' | 'surprised'
  | 'confused' | 'embarrassed' | 'angry' | 'sleepy';

interface BoneOverride {
  boneName: string;
  rotationDelta: Vector3Like;
  weight: number;                // 0–1
}

interface MorphTargetConfig {
  meshName: string;
  targetName: string;
  value: number;                 // 0–1
}
```

---

## 5. MovementConfig

```typescript
interface MovementConfig {
  walkSpeed: number;            // units/s, default: 2
  rotationSpeed: number;        // rad/s, default: 5
  arrivalThreshold: number;     // distance to stop, default: 0.1
}
```

---

## 6. Timeline Data Model

```typescript
interface StoryTimeline {
  id: string;
  title: string;
  duration: number;
  events: TimelineEvent[];
}

interface TimelineEvent {
  time: number;
  actor: string;                // character id
  action: ActionType;
  target?: string;              // scene object id or character id
  params?: ActionParams;
}

type ActionType =
  | 'idle' | 'walk_to' | 'look_at'
  | 'sit' | 'stand' | 'say'
  | 'set_emotion' | 'laugh';

interface ActionParams {
  text?: string;
  emotion?: EmotionType;
  [key: string]: unknown;
}
```

**Ví dụ prototype story timeline:**
```json
{
  "id": "dad_watches_tv",
  "title": "Bố xem tivi trộm",
  "duration": 25,
  "events": [
    { "time": 0,  "actor": "dad", "action": "idle" },
    { "time": 1,  "actor": "dad", "action": "look_at",     "target": "tv" },
    { "time": 2,  "actor": "dad", "action": "walk_to",     "target": "sofa" },
    { "time": 6,  "actor": "dad", "action": "sit" },
    { "time": 8,  "actor": "dad", "action": "look_at",     "target": "tv" },
    { "time": 10, "actor": "dad", "action": "say",         "params": { "text": "Anh chỉ xem một chút thôi." } },
    { "time": 13, "actor": "dad", "action": "laugh" },
    { "time": 18, "actor": "dad", "action": "set_emotion", "params": { "emotion": "embarrassed" } },
    { "time": 20, "actor": "dad", "action": "look_at",     "target": "away" }
  ]
}
```

---

## 7. Scene Data Model

```typescript
interface SceneConfig {
  id: string;
  name: string;
  objects: SceneObjectConfig[];
  lights: LightConfig[];
  defaultCamera: CameraConfig;
}

interface SceneObjectConfig {
  id: string;                   // "sofa", "tv", "table", "lamp"
  type: 'static_mesh' | 'placeholder';
  asset?: string;
  position: Vector3Like;
  rotation?: Vector3Like;
  scale?: Vector3Like;
  primitive?: PrimitiveConfig;
}

interface PrimitiveConfig {
  geometry: 'box' | 'sphere' | 'cylinder' | 'plane';
  dimensions: Vector3Like;
  color: string;
}

interface LightConfig {
  type: 'ambient' | 'directional' | 'point' | 'spot';
  color: string;
  intensity: number;
  position?: Vector3Like;
  castShadow?: boolean;
}

interface CameraConfig {
  position: Vector3Like;
  lookAt: Vector3Like;
  fov: number;
}
```

---

## 8. Store State (UI Sync – Zustand)

```typescript
interface CharacterStoreState {
  behaviorState: BehaviorState;
  emotion: EmotionType;
  position: Vector3Like;
  isTalking: boolean;
  currentDialogue: string | null;
}

interface TimelineStoreState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}
```

---

## 9. Dad Definition – Full Example

```typescript
export const dadDefinition: CharacterDefinition = {
  id: 'dad',
  name: 'Dad',
  asset: '/assets/characters/dad/dad.glb',

  personality: {
    traits: ['funny', 'kind', 'slightly_lazy', 'easy_going', 'avoids_conflict'],
  },

  capabilities: ['walk', 'sit', 'stand', 'look_at', 'talk', 'laugh', 'idle'],

  animations: [
    { name: 'idle',  clipName: 'idle',  loop: true,  defaultTransitionDuration: 0.3 },
    { name: 'walk',  clipName: 'walk',  loop: true,  defaultTransitionDuration: 0.3 },
    { name: 'sit',   clipName: 'sit',   loop: false, defaultTransitionDuration: 0.2 },
    { name: 'stand', clipName: 'stand', loop: false, defaultTransitionDuration: 0.3 },
    { name: 'talk',  clipName: 'talk',  loop: true,  defaultTransitionDuration: 0.1 },
  ],

  emotions: [
    { type: 'neutral',     boneOverrides: [] },
    { type: 'happy',       boneOverrides: [] },
    { type: 'embarrassed', boneOverrides: [
        { boneName: 'Head',  rotationDelta: { x: 0.2, y: 0.3, z: 0 }, weight: 1 },
        { boneName: 'Spine', rotationDelta: { x: 0.1, y: 0,   z: 0 }, weight: 0.5 },
      ]
    },
  ],

  movementConfig: {
    walkSpeed: 2,
    rotationSpeed: 5,
    arrivalThreshold: 0.15,
  },
};
```
