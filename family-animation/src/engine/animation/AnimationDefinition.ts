// ============================================================
// AnimationDefinition — maps engine animation names to GLB clips
// ============================================================

export type AnimationName =
  | 'idle'
  | 'walk'
  | 'sit'
  | 'stand'
  | 'talk'
  | 'laugh'
  | 'look_around';

export interface AnimationDefinition {
  name: AnimationName;
  clipName: string;              // exact clip name inside GLB
  loop: boolean;
  defaultTransitionDuration: number; // crossfade duration in seconds
}

export interface PlayOptions {
  loop?: boolean;
  crossFadeDuration?: number;
  clampWhenFinished?: boolean;   // stay on last frame when done
}
