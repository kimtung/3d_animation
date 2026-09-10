// ============================================================
// MotionController — handles 3D movement (position + rotation)
// Deliberately separated from AnimationController
// ============================================================

import * as THREE from 'three';

export interface MovementConfig {
  walkSpeed: number;            // units/second
  rotationSpeed: number;        // radians/second
  arrivalThreshold: number;     // distance to consider "arrived"
}

export const DEFAULT_MOVEMENT_CONFIG: MovementConfig = {
  walkSpeed: 2,
  rotationSpeed: 5,
  arrivalThreshold: 0.15,
};

export class MotionController {
  private object3D: THREE.Object3D;
  private config: MovementConfig;

  private _isMoving = false;
  private _targetPosition: THREE.Vector3 | null = null;
  private _moveResolve: (() => void) | null = null;

  private _isRotating = false;
  private _targetRotation: number | null = null; // Y radians
  private _rotateResolve: (() => void) | null = null;

  constructor(object3D: THREE.Object3D, config: MovementConfig = DEFAULT_MOVEMENT_CONFIG) {
    this.object3D = object3D;
    this.config = config;
  }

  get isMoving(): boolean { return this._isMoving; }

  /** Move toward target. Resolves when arrived. */
  moveTo(target: THREE.Vector3): Promise<void> {
    return new Promise((resolve) => {
      this._targetPosition = target.clone();
      this._isMoving = true;
      this._moveResolve = resolve;
    });
  }

  /** Rotate to face direction. Resolves when done. */
  rotateTo(targetPosition: THREE.Vector3): Promise<void> {
    return new Promise((resolve) => {
      const dir = targetPosition.clone().sub(this.object3D.position);
      this._targetRotation = Math.atan2(dir.x, dir.z);
      this._isRotating = true;
      this._rotateResolve = resolve;
    });
  }

  stop(): void {
    this._isMoving = false;
    this._targetPosition = null;
    this._moveResolve?.();
    this._moveResolve = null;
  }

  /** Called every frame by the render loop */
  update(delta: number): void {
    this._updateRotation(delta);
    this._updateMovement(delta);
  }

  private _updateRotation(delta: number): void {
    if (!this._isRotating || this._targetRotation === null) return;

    const current = this.object3D.rotation.y;
    const target = this._targetRotation;
    let diff = target - current;

    // Normalize to [-PI, PI]
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    const step = this.config.rotationSpeed * delta;
    if (Math.abs(diff) <= step) {
      this.object3D.rotation.y = target;
      this._isRotating = false;
      this._targetRotation = null;
      this._rotateResolve?.();
      this._rotateResolve = null;
    } else {
      this.object3D.rotation.y += Math.sign(diff) * step;
    }
  }

  private _updateMovement(delta: number): void {
    if (!this._isMoving || !this._targetPosition) return;

    const current = this.object3D.position;
    const target = this._targetPosition;
    const diff = target.clone().sub(current);
    diff.y = 0; // stay on ground

    const distance = diff.length();
    if (distance <= this.config.arrivalThreshold) {
      this.object3D.position.copy(target);
      this._isMoving = false;
      this._targetPosition = null;
      this._moveResolve?.();
      this._moveResolve = null;
    } else {
      const step = this.config.walkSpeed * delta;
      const move = diff.normalize().multiplyScalar(Math.min(step, distance));
      this.object3D.position.add(move);
    }
  }

  dispose(): void {
    this.stop();
  }
}
