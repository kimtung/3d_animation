import * as THREE from "three";
import type { EmotionDefinition, EmotionType } from "./EmotionDefinition.ts";

export class EmotionController {
  private object3D: THREE.Object3D;
  private definitions = new Map<EmotionType, EmotionDefinition>();
  private currentEmotion: EmotionType = "neutral";
  private bones = new Map<string, THREE.Bone>();

  // Additive rotation offsets applied on top of animation
  private currentOffsets = new Map<string, THREE.Vector3>();
  private targetOffsets = new Map<string, THREE.Vector3>();

  constructor(object3D: THREE.Object3D, definitions: EmotionDefinition[]) {
    this.object3D = object3D;
    for (const def of definitions) {
      this.definitions.set(def.type, def);
    }

    // Cache all bones in the hierarchy
    this.object3D.traverse((child) => {
      if (child instanceof THREE.Bone) {
        this.bones.set(child.name, child);
        this.currentOffsets.set(child.name, new THREE.Vector3(0, 0, 0));
        this.targetOffsets.set(child.name, new THREE.Vector3(0, 0, 0));
      }
    });
  }

  getCurrentEmotion(): EmotionType {
    return this.currentEmotion;
  }

  setEmotion(emotion: EmotionType): void {
    this.currentEmotion = emotion;
    const def = this.definitions.get(emotion);

    // Reset target offsets for all bones
    for (const target of this.targetOffsets.values()) {
      target.set(0, 0, 0);
    }

    if (!def || !def.boneOverrides) return;

    // Apply target overrides only to bones specified in this emotion
    for (const override of def.boneOverrides) {
      const target = this.targetOffsets.get(override.boneName);
      if (target) {
        target.x = (override.rotationDelta.x ?? 0) * override.weight;
        target.y = (override.rotationDelta.y ?? 0) * override.weight;
        target.z = (override.rotationDelta.z ?? 0) * override.weight;
      }
    }
  }

  clearEmotion(): void {
    this.setEmotion("neutral");
  }

  update(delta: number): void {
    const lerpFactor = Math.min(delta * 8.0, 1.0);

    for (const [name, target] of this.targetOffsets.entries()) {
      const current = this.currentOffsets.get(name);
      if (!current) continue;

      current.lerp(target, lerpFactor);

      // Only additively modify bones that actually have an active emotion offset
      if (
        Math.abs(current.x) > 0.001 ||
        Math.abs(current.y) > 0.001 ||
        Math.abs(current.z) > 0.001
      ) {
        const bone = this.bones.get(name);
        if (bone) {
          bone.rotation.x += current.x;
          bone.rotation.y += current.y;
          bone.rotation.z += current.z;
        }
      }
    }
  }
}
