// ============================================================
// CharacterDefinition — immutable blueprint for any character
// ============================================================

export type PersonalityTrait =
  | 'funny'
  | 'kind'
  | 'strict'
  | 'relaxed'
  | 'slightly_lazy'
  | 'easy_going'
  | 'smart'
  | 'mischievous'
  | 'avoids_conflict'
  | 'loyal'
  | 'playful'
  | 'observant';

export type CharacterCapability =
  | 'walk'
  | 'sit'
  | 'stand'
  | 'look_at'
  | 'talk'
  | 'laugh'
  | 'idle';

export interface Personality {
  traits: PersonalityTrait[];
}

export interface CharacterDefinition {
  id: string;
  name: string;
  asset: string;                       // path to GLB, e.g. "/assets/characters/dad/dad.glb"
  personality: Personality;
  capabilities: CharacterCapability[];
  animations: AnimationDefinition[];
  emotions: EmotionDefinition[];
  movementConfig: MovementConfig;
}

import type { AnimationDefinition } from '@engine/animation/AnimationDefinition.ts';
import type { EmotionDefinition } from '@engine/emotion/EmotionDefinition.ts';
import type { MovementConfig } from '@engine/movement/MotionController.ts';

export type { AnimationDefinition, EmotionDefinition, MovementConfig };
