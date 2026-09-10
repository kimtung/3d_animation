// ============================================================
// Public type re-exports
// ============================================================

export type { CharacterDefinition, PersonalityTrait, CharacterCapability, Personality } from '@engine/character/CharacterDefinition.ts';
export type { CharacterRuntimeState, BehaviorState, EmotionType, Vector3Like, SceneLocationId } from '@engine/character/CharacterState.ts';
export type { ICharacterController } from '@engine/character/Character.ts';
export type { AnimationDefinition, AnimationName, PlayOptions } from '@engine/animation/AnimationDefinition.ts';
export type { EmotionDefinition, BoneOverride, MorphTargetConfig } from '@engine/emotion/EmotionDefinition.ts';
export type { MovementConfig } from '@engine/movement/MotionController.ts';
export type { Behavior, BehaviorContext } from '@engine/behavior/Behavior.ts';
export type { SceneObjectConfig, SceneConfig, LightConfig, CameraConfig, PrimitiveConfig } from '@engine/scene/SceneObject.ts';
export type { TimelineEvent, StoryTimeline, ActionType, ActionParams } from '@engine/timeline/TimelineEvent.ts';
