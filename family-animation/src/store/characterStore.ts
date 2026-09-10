// ============================================================
// characterStore — Zustand store bridging engine → React UI
// Tracks all family characters (Dad, Mom, Son, Daughter)
// ============================================================

import { create } from "zustand";
import type {
  BehaviorState,
  EmotionType,
  Vector3Like,
} from "@engine/character/CharacterState.ts";

export interface CharacterInfo {
  id: string;
  name: string;
  role: string;
  behaviorState: BehaviorState;
  emotion: EmotionType;
  position: Vector3Like;
  rotation: number;
  isTalking: boolean;
  currentDialogue: string | null;
}

export interface CharacterActionSet {
  walkToSofa: () => void;
  lookAtTV: () => void;
  lookAtDoor: () => void;
  sit: () => void;
  stand: () => void;
  talk: (text: string) => void;
  laugh: () => void;
  setEmotion: (emotion: EmotionType) => void;
  idle: () => void;
  focusCamera: () => void;
}

export interface CharacterStoreState {
  selectedCharacterId: string;
  characters: Record<string, CharacterInfo>;

  // Convenience getters for inspected character
  behaviorState: BehaviorState;
  emotion: EmotionType;
  position: Vector3Like;
  rotation: number;
  isTalking: boolean;
  speakerName: string | null;
  currentDialogue: string | null;

  // Character switching
  setSelectedCharacterId: (id: string) => void;

  // Engine sync hooks
  _syncCharacter: (id: string, patch: Partial<CharacterInfo>) => void;
  _syncDialogue: (speaker: string | null, dialogue: string | null) => void;
  _registerActions: (id: string, actions: CharacterActionSet) => void;

  // Selected character actions proxy
  _actions: CharacterActionSet | null;
}

const defaultCharacters: Record<string, CharacterInfo> = {
  dad: {
    id: "dad",
    name: "Dad (Bố)",
    role: "Father",
    behaviorState: "IDLE",
    emotion: "neutral",
    position: { x: -4.5, y: 0, z: -2.0 },
    rotation: 0,
    isTalking: false,
    currentDialogue: null,
  },
  mom: {
    id: "mom",
    name: "Mom (Mẹ)",
    role: "Mother",
    behaviorState: "IDLE",
    emotion: "happy",
    position: { x: -2.2, y: 0, z: -0.6 },
    rotation: 0.8,
    isTalking: false,
    currentDialogue: null,
  },
  son: {
    id: "son",
    name: "Son (Con trai)",
    role: "Son",
    behaviorState: "IDLE",
    emotion: "happy",
    position: { x: 0.4, y: 0, z: 0.6 },
    rotation: -0.8,
    isTalking: false,
    currentDialogue: null,
  },
  daughter: {
    id: "daughter",
    name: "Daughter (Con gái)",
    role: "Daughter",
    behaviorState: "IDLE",
    emotion: "happy",
    position: { x: -1.5, y: 0, z: 0.4 },
    rotation: 0.4,
    isTalking: false,
    currentDialogue: null,
  },
};

const actionRegistry: Record<string, CharacterActionSet> = {};

export const useCharacterStore = create<CharacterStoreState>()((set, get) => ({
  selectedCharacterId: "dad",
  characters: defaultCharacters,

  behaviorState: "IDLE",
  emotion: "neutral",
  position: { x: -4.5, y: 0, z: -2.0 },
  rotation: 0,
  isTalking: false,
  speakerName: null,
  currentDialogue: null,
  _actions: null,

  setSelectedCharacterId: (id: string) => {
    const char = get().characters[id];
    if (!char) return;
    set({
      selectedCharacterId: id,
      behaviorState: char.behaviorState,
      emotion: char.emotion,
      position: char.position,
      rotation: char.rotation,
      _actions: actionRegistry[id] ?? null,
    });
  },

  _syncCharacter: (id: string, patch: Partial<CharacterInfo>) => {
    set((state) => {
      const existing = state.characters[id] ?? defaultCharacters[id];
      const updated = { ...existing, ...patch };
      const updatedChars = { ...state.characters, [id]: updated };

      if (id === state.selectedCharacterId) {
        return {
          characters: updatedChars,
          behaviorState: updated.behaviorState,
          emotion: updated.emotion,
          position: updated.position,
          rotation: updated.rotation,
        };
      }
      return { characters: updatedChars };
    });
  },

  _syncDialogue: (speakerName: string | null, currentDialogue: string | null) => {
    set({
      speakerName,
      currentDialogue,
      isTalking: !!currentDialogue,
    });
  },

  _registerActions: (id: string, actions: CharacterActionSet) => {
    actionRegistry[id] = actions;
    if (get().selectedCharacterId === id) {
      set({ _actions: actions });
    }
  },
}));
