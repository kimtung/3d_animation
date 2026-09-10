import * as THREE from "three";
import type { EmotionDefinition, EmotionType } from "./EmotionDefinition.ts";

export class EmotionController {
  private object3D: THREE.Object3D;
  private definitions = new Map<EmotionType, EmotionDefinition>();
  private currentEmotion: EmotionType = "neutral";
  private bones = new Map<string, THREE.Bone>();

  // Stores target and current euler angles for smooth interpolation
  private currentRotations = new Map<string, THREE.Euler>();
  private targetRotations = new Map<string, THREE.Euler>();
  private baseRotations = new Map<string, THREE.Euler>();

  constructor(object3D: THREE.Object3D, definitions: EmotionDefinition[]) {
    this.object3D = object3D;
    for (const def of definitions) {
      this.definitions.set(def.type, def);
    }

    // Cache all bones in the hierarchy
    this.object3D.traverse((child) => {
      if (child instanceof THREE.Bone) {
        this.bones.set(child.name, child);
        this.baseRotations.set(child.name, child.rotation.clone());
        this.currentRotations.set(child.name, child.rotation.clone());
        this.targetRotations.set(child.name, child.rotation.clone());
      }
    });
  }

  getCurrentEmotion(): EmotionType {
    return this.currentEmotion;
  }

  setEmotion(emotion: EmotionType): void {
    this.currentEmotion = emotion;
    const def = this.definitions.get(emotion);

    // Reset targets to base rotations first
    for (const [name, base] of this.baseRotations.entries()) {
      const target = this.targetRotations.get(name);
      if (target) target.copy(base);
    }

    if (!def || !def.boneOverrides) return;

    // Apply target overrides
    for (const override of def.boneOverrides) {
      const base = this.baseRotations.get(override.boneName);
      const target = this.targetRotations.get(override.boneName);
      if (base && target) {
        target.x = base.x + (override.rotationDelta.x ?? 0) * override.weight;
        target.y = base.y + (override.rotationDelta.y ?? 0) * override.weight;
        target.z = base.z + (override.rotationDelta.z ?? 0) * override.weight;
      }
    }
  }

  clearEmotion(): void {
    this.setEmotion("neutral");
  }

  update(delta: number): void {
    const lerpFactor = Math.min(delta * 8.0, 1.0); // smooth responsive transition

    for (const [name, bone] of this.bones.entries()) {
      const target = this.targetRotations.get(name);
      const current = this.currentRotations.get(name);
      if (target && current) {
        current.x = THREE.MathUtils.lerp(current.x, target.x, lerpFactor);
        current.y = THREE.MathUtils.lerp(current.y, target.y, lerpFactor);
        current.z = THREE.MathUtils.lerp(current.z, target.z, lerpFactor);

        // Apply additive offset to bone
        bone.rotation.x = current.x;
        bone.rotation.y = current.y;
        bone.rotation.z = current.z;
      }
    }
  }
}
