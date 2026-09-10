// ============================================================
// SceneObject — types for scene configuration
// ============================================================

import type { Vector3Like } from '@engine/character/CharacterState.ts';

export type PrimitiveGeometry = 'box' | 'sphere' | 'cylinder' | 'plane';

export interface PrimitiveConfig {
  geometry: PrimitiveGeometry;
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  color: string;           // hex, e.g. '#8B4513'
}

export interface SemanticSeatAnchor {
  seatPosition: Vector3Like;
  seatRotationY: number; // facing direction when seated
  entryPosition: Vector3Like; // point in front of seat to walk to
}

export interface SceneObjectConfig {
  id: string;
  type: 'static_mesh' | 'primitive' | 'placeholder';
  asset?: string;          // path to GLB (optional)
  position: Vector3Like;
  rotation?: Vector3Like;
  scale?: Vector3Like;
  primitive?: PrimitiveConfig;
  seatAnchor?: SemanticSeatAnchor;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export type LightType = 'ambient' | 'directional' | 'point' | 'spot';

export interface LightConfig {
  type: LightType;
  color: string;
  intensity: number;
  position?: Vector3Like;
  castShadow?: boolean;
}

export interface CameraConfig {
  position: Vector3Like;
  lookAt: Vector3Like;
  fov: number;
  near?: number;
  far?: number;
}

export interface SceneConfig {
  id: string;
  name: string;
  objects: SceneObjectConfig[];
  lights: LightConfig[];
  defaultCamera: CameraConfig;
}
