// ============================================================
// ICharacterController — public API for any character
// This is the ONLY interface AI Story Engine will call.
// ============================================================

import type * as THREE from 'three';
import type { CharacterRuntimeState, EmotionType } from './CharacterState.ts';

export interface ICharacterController {
  readonly id: string;
  readonly object3D: THREE.Object3D;

  // --- Behavior API (async = can be awaited in sequence) ---
  idle(): void;
  walkTo(target: THREE.Vector3 | THREE.Object3D): Promise<void>;
  lookAt(target: THREE.Vector3 | THREE.Object3D): Promise<void>;
  sit(): Promise<void>;
  stand(): Promise<void>;
  say(text: string): Promise<void>;
  laugh(): Promise<void>;

  // --- Emotion API (instant, non-blocking) ---
  setEmotion(emotion: EmotionType): void;
  clearEmotion(): void;

  // --- State ---
  getState(): CharacterRuntimeState;

  // --- Lifecycle ---
  update(delta: number): void;
  dispose(): void;
}
