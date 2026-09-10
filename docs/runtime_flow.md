# Runtime Flow – AI 3D Family Animation Engine

## 1. Initialization Flow

```
Browser loads index.html
    ↓
React App.tsx mounts
    ↓
<Viewport> mounts → gets canvas ref
    ↓
SceneManager.setup(canvas)
    ├── Create Three.js WebGLRenderer
    ├── Create Scene
    ├── Create PerspectiveCamera
    └── Setup resize observer
    ↓
SceneManager.loadEnvironment(livingRoomConfig)
    ├── Create Floor (PlaneGeometry)
    ├── Create Sofa (primitive box hoặc GLB)
    ├── Create TV (primitive box hoặc GLB)
    ├── Create CoffeeTable, Lamp
    └── Register all objects với SceneManager (by id)
    ↓
CharacterFactory.create(dadDefinition)
    ├── GLTFLoader.load(dadDefinition.asset)
    ├── Extract AnimationClips từ GLTF
    ├── new AnimationController(mixer, clips, dadDefinition.animations)
    ├── new StateMachine(initial: 'IDLE')
    ├── new MotionController(object3D, dadDefinition.movementConfig)
    ├── new EmotionController(object3D, dadDefinition.emotions)
    ├── new BehaviorManager({ stateMachine, animationController, motionController, emotionController })
    └── return new CharacterController(behaviorManager)
    ↓
Timeline.load(livingRoomTimeline)
    ↓
CameraController.setup(camera)
    ├── CameraController.follow(dad.object3D)
    └── Set initial position
    ↓
AnimationController.play('idle')
    ↓
SceneManager.startRenderLoop()
    ↓
Timeline.play()
```

---

## 2. Per-Frame Update Loop

```typescript
// SceneManager.startRenderLoop()
function renderLoop() {
  requestAnimationFrame(renderLoop);
  const delta = clock.getDelta();

  timeline.update(delta);            // ← dispatch timeline events
  motionController.update(delta);    // ← move character position
  animationController.update(delta); // ← advance AnimationMixer
  cameraController.update(delta);    // ← smooth camera follow

  characterStore.sync(character.getState()); // ← React UI sync

  renderer.render(scene, camera);
}
```

**Update order quan trọng:**
1. `Timeline.update()` — dispatch events trong frame này
2. `MotionController.update()` — xử lý position movement
3. `AnimationController.update()` — advance mixer với delta
4. `CameraController.update()` — smooth follow sau khi character đã move
5. `renderer.render()` — cuối cùng

---

## 3. Behavior Flow – walkTo

```
dad.walkTo(sofa)
    ↓
CharacterController.walkTo(target)
    ↓
BehaviorManager.execute(WalkToBehavior { target })
    ├── [interrupt current behavior nếu có]
    ↓
StateMachine.transition('WALKING')
    ↓
AnimationController.crossFadeTo('walk', 0.3s)
    ↓
MotionController.moveTo(target.position)
    │
    │   [each frame]
    │   ├── Calculate direction = target - current
    │   ├── Rotate character toward direction
    │   ├── Move: position += direction * walkSpeed * delta
    │   └── Check distance < arrivalThreshold?
    ↓ [arrival]
MotionController stops
    ↓
AnimationController.crossFadeTo('idle', 0.3s)
    ↓
StateMachine.transition('IDLE')
    ↓
Promise resolves
```

---

## 4. Behavior Flow – sit

```
dad.sit()
    ↓
BehaviorManager.execute(SitBehavior)
    ↓
StateMachine.transition('SITTING')
    ├── Validate: IDLE → SITTING ✓
    │   (WALKING → SITTING ✗, phải IDLE trước)
    ↓
AnimationController.play('sit', { loop: false, clampWhenFinished: true })
    │   [wait for animation ~1.5s]
    ↓
Promise resolves
```

---

## 5. Behavior Flow – setEmotion

```
dad.setEmotion('embarrassed')
    ↓
EmotionController.setEmotion('embarrassed')
    ↓
Lookup EmotionDefinition by type
    ↓
Apply BoneOverrides (smooth lerp each frame):
    ├── skeleton.getBoneByName('Head') → rotation.x += delta * weight
    └── skeleton.getBoneByName('Spine') → rotation.x += delta * weight
    ↓
Emotion stored in RuntimeState
    └── UI CharacterPanel updates "Emotion: EMBARRASSED"
```

---

## 6. Timeline Dispatch Flow

```
Timeline.play()
    ↓
[each frame: Timeline.update(delta)]
    ├── currentTime += delta
    ├── Find events where event.time <= currentTime && !event.dispatched
    ↓ [event found]
Timeline resolves actor → CharacterController
    ↓
Dispatch action:
    switch (event.action) {
      case 'walk_to':     dad.walkTo(scene.getObject(event.target))
      case 'look_at':     dad.lookAt(scene.getObject(event.target))
      case 'sit':         dad.sit()
      case 'say':         dad.say(event.params.text)
      case 'set_emotion': dad.setEmotion(event.params.emotion)
    }
    ↓
event.dispatched = true
```

---

## 7. UI Action Flow (Debug Button)

```
User clicks [Walk To Sofa]
    ↓
ActionPanel.tsx onClick
    ↓
characterStore.triggerWalkToSofa()
    ↓
dad.walkTo(scene.getObject('sofa'))
    ↓ [walkTo flow...]
    ↓
characterStore.sync() each frame
    ↓
React re-renders CharacterPanel → "State: WALKING"
```

---

## 8. Prototype Sequence – Full 25s

```
t=0s   dad.idle()                           → Animation: idle
t=1s   dad.lookAt(tv)                       → Smooth rotation toward TV
t=2s   dad.walkTo(sofa)                     → State: WALKING, walk animation
t=5s   [arrival detected]                   → State: IDLE, idle animation
t=6s   dad.sit()                            → State: SITTING, sit animation
t=8s   dad.lookAt(tv)                       → Rotation while sitting
t=10s  dad.say("Anh chỉ xem một chút thôi.") → State: TALKING, talk animation
t=13s  dad.laugh()                          → Laugh animation / happy emotion
t=15s  [Mom placeholder spawned at door]
t=17s  dad.lookAt(mom_placeholder)          → Rotate toward door
t=18s  dad.setEmotion("embarrassed")        → Bone overrides applied
t=20s  dad.lookAt("away")                   → Look to side
t=25s  Timeline ends
```
