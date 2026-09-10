// ============================================================
// Behavior — interface for all character behaviors
// ============================================================

import type { BehaviorState } from '@engine/character/CharacterState.ts';

export interface BehaviorContext {
  characterId: string;
  // Will be populated with concrete controllers in M1.x
  // Defined loosely here to avoid circular deps at skeleton stage
  [key: string]: unknown;
}

export interface Behavior {
  readonly id: string;
  readonly targetState: BehaviorState;

  execute(context: BehaviorContext): Promise<void>;
  interrupt?(): void;
}
