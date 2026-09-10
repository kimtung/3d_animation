// ============================================================
// TimelineEvent — declarative story format
// AI Story Engine will generate arrays of these
// ============================================================

import type { EmotionType } from '@engine/character/CharacterState.ts';

export type ActionType =
  | 'idle'
  | 'walk_to'
  | 'look_at'
  | 'sit'
  | 'stand'
  | 'say'
  | 'laugh'
  | 'set_emotion'
  | 'set_camera_mode'
  | 'spawn';

export interface ActionParams {
  text?: string;
  emotion?: EmotionType;
  cameraMode?: string;
  offset?: { x: number; y: number; z: number };
  [key: string]: unknown;
}

export interface TimelineEvent {
  time: number;            // trigger time in seconds
  actor: string;           // character id or 'camera'
  action: ActionType;
  target?: string;         // scene object id or character id
  params?: ActionParams;
}

export interface StoryTimeline {
  id: string;
  title: string;
  duration: number;
  events: TimelineEvent[];
}
