# Dad Canonical Asset Report

| Thuộc tính | Chi tiết |
|---|---|
| **Canonical Asset Path** | `public/assets/characters/dad/dad.glb` |
| **Format** | Binary glTF 2.0 (GLB) |
| **Asset Size** | ~43.5 KB |
| **Rig / Skeleton** | Humanoid Rig (7 primary joints: Root, Spine, Head, Arm_L, Arm_R, Leg_L, Leg_R) |
| **World Coordinate Convention** | Y-up, X-right, Z-depth (Character root defines world translation) |
| **Facial & Mesh Details** | Stylized cartoon silhouette: Da màu ấm, tóc nâu gia đình, kính gọng đen retro, áo phông xanh |
| **Bones Hierarchy** | `Root` → `Spine` (with `Arm_L`, `Arm_R`) → `Head` (with HeadMesh, Hair, Glasses); `Root` → `Leg_L`, `Leg_R` |
| **Animation Clips** | `idle` (2.0s loop), `walk` (1.0s loop), `sit` (1.0s clamp), `stand` (1.0s clamp), `talk` (1.5s loop) |
| **Emotion Channels** | Bone Overrides trên `Head` (pitch/yaw/tilt) & `Spine` (posture slouch/straighten) |

> **Quy tắc tính nhất quán**: Mọi phân cảnh và tập phim (Episode 001..100) sẽ tham chiếu duy nhất tới Asset và Definition này.
