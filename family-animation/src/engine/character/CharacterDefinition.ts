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

export interface CharacterAppearance {
  bodyType: string;
  ageGroup: string;
  clothing: string[];
}

export interface CharacterDefinition {
  id: string;
  name: string;
  role: string;                        // e.g. "Father", "Mother", "Son", "Daughter"
  asset: string;                       // path to canonical GLB
  personality: Personality;
  appearance: CharacterAppearance;
  defaultEmotion: EmotionType;
  capabilities: CharacterCapability[];
  animations: AnimationDefinition[];
  emotions: EmotionDefinition[];
  movementConfig: MovementConfig;
}

import type { EmotionType } from './CharacterState.ts';
import type { AnimationDefinition } from '@engine/animation/AnimationDefinition.ts';
import type { EmotionDefinition } from '@engine/emotion/EmotionDefinition.ts';
import type { MovementConfig } from '@engine/movement/MotionController.ts';

export type { AnimationDefinition, EmotionDefinition, MovementConfig, EmotionType };
