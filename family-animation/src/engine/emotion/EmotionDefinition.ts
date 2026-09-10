// ============================================================
// EmotionDefinition — bone/morph configs per emotion
// ============================================================

import type { EmotionType, Vector3Like } from '@engine/character/CharacterState.ts';

export type { EmotionType };

export interface BoneOverride {
  boneName: string;
  rotationDelta: Vector3Like;    // Euler delta in radians
  weight: number;                // 0–1 blend weight
}

export interface MorphTargetConfig {
  meshName: string;
  targetName: string;            // blend shape name in GLB
  value: number;                 // 0–1
}

export interface EmotionDefinition {
  type: EmotionType;
  boneOverrides?: BoneOverride[];
  morphTargets?: MorphTargetConfig[];
  gestureAnimation?: string;    // optional AnimationName
}
