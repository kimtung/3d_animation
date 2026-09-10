// ============================================================
// characterStore — Zustand store bridging engine → React UI
// Engine updates this store; React components subscribe to it
// ============================================================

import { create } from 'zustand';
import type { BehaviorState, EmotionType, Vector3Like } from '@engine/character/CharacterState.ts';

export interface CharacterStoreState {
  // Runtime state (synced from engine each frame)
  behaviorState: BehaviorState;
  emotion: EmotionType;
  position: Vector3Like;
  rotation: number;
  isTalking: boolean;
  currentDialogue: string | null;

  // Setters (called by engine)
  _sync: (patch: Partial<Omit<CharacterStoreState, '_sync' | '_actions'>>) => void;

  // UI-triggered actions (set by engine bootstrap, called by UI)
  _actions: {
    walkToSofa: () => void;
    lookAtTV: () => void;
    lookAtDoor: () => void;
    sit: () => void;
    stand: () => void;
    talk: (text: string) => void;
    laugh: () => void;
    setEmotion: (emotion: EmotionType) => void;
    idle: () => void;
  } | null;
}

export const useCharacterStore = create<CharacterStoreState>()((set) => ({
  // Initial state
  behaviorState: 'IDLE',
  emotion: 'neutral',
  position: { x: 0, y: 0, z: 0 },
  rotation: 0,
  isTalking: false,
  currentDialogue: null,

  _actions: null,

  _sync: (patch) => set((state) => ({ ...state, ...patch })),
}));
