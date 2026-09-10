// ============================================================
// CharacterState — runtime state (changes every frame/action)
// ============================================================

export type BehaviorState = 'IDLE' | 'WALKING' | 'SITTING' | 'TALKING' | 'LOOKING';

export interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

export type SceneLocationId = 'living_room' | 'kitchen' | 'bedroom' | string;

export interface CharacterRuntimeState {
  characterId: string;
  behaviorState: BehaviorState;
  position: Vector3Like;
  rotation: number;          // Y-axis in radians
  location: SceneLocationId;
  emotion: EmotionType;
  energy: number;            // 0–100
  isTalking: boolean;
  currentDialogue: string | null;
}

export type EmotionType =
  | 'neutral'
  | 'happy'
  | 'surprised'
  | 'confused'
  | 'embarrassed'
  | 'angry'
  | 'sleepy';
