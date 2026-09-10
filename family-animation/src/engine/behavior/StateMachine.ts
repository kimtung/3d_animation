// ============================================================
// StateMachine — validates character state transitions
// ============================================================

import type { BehaviorState } from '@engine/character/CharacterState.ts';

type StateChangeCallback = (from: BehaviorState, to: BehaviorState) => void;

// Valid transitions: key = from, value[] = allowed "to" states
const VALID_TRANSITIONS: Record<BehaviorState, BehaviorState[]> = {
  IDLE:    ['WALKING', 'SITTING', 'TALKING', 'LOOKING'],
  WALKING: ['IDLE', 'LOOKING'],
  SITTING: ['IDLE', 'TALKING', 'LOOKING'],
  TALKING: ['IDLE', 'SITTING', 'LOOKING'],
  LOOKING: ['IDLE', 'WALKING', 'SITTING', 'TALKING'], // LOOKING is parallel
};

export class StateMachine {
  private _state: BehaviorState = 'IDLE';
  private _listeners: StateChangeCallback[] = [];

  getState(): BehaviorState {
    return this._state;
  }

  canTransition(to: BehaviorState): boolean {
    return VALID_TRANSITIONS[this._state]?.includes(to) ?? false;
  }

  transition(to: BehaviorState): boolean {
    if (!this.canTransition(to)) {
      console.warn(`[StateMachine] Invalid transition: ${this._state} → ${to}`);
      return false;
    }
    const from = this._state;
    this._state = to;
    this._listeners.forEach((cb) => cb(from, to));
    return true;
  }

  onStateChange(cb: StateChangeCallback): () => void {
    this._listeners.push(cb);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== cb);
    };
  }

  reset(): void {
    this._state = 'IDLE';
  }
}
