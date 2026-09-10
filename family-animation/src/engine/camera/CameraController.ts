import * as THREE from "three";

export type CameraMode = "static" | "follow" | "look_at";

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private mode: CameraMode = "follow";

  // Target object to follow/look at
  private targetObject: THREE.Object3D | null = null;

  // Offset when in follow mode
  private followOffset: THREE.Vector3 = new THREE.Vector3(0, 3.2, 5.8);

  // Smooth lerp states
  private currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private desiredLookAt: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

  // Static pose parameters
  private staticPosition: THREE.Vector3 = new THREE.Vector3(0, 3.5, 6.5);
  private staticLookAt: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.currentLookAt.copy(camera.position).add(new THREE.Vector3(0, 0, -1));
  }

  getMode(): CameraMode {
    return this.mode;
  }

  setMode(mode: CameraMode): void {
    this.mode = mode;
  }

  setStatic(position: THREE.Vector3, lookAt: THREE.Vector3): void {
    this.mode = "static";
    this.staticPosition.copy(position);
    this.staticLookAt.copy(lookAt);
    this.desiredLookAt.copy(lookAt);
  }

  follow(target: THREE.Object3D, offset?: THREE.Vector3): void {
    this.mode = "follow";
    this.targetObject = target;
    if (offset) {
      this.followOffset.copy(offset);
    }
  }

  lookAtTarget(target: THREE.Object3D | THREE.Vector3): void {
    this.mode = "look_at";
    if (target instanceof THREE.Object3D) {
      this.targetObject = target;
      this.desiredLookAt.copy(target.position);
    } else {
      this.desiredLookAt.copy(target);
    }
  }

  update(delta: number): void {
    const lerpFactor = Math.min(delta * 4.0, 1.0); // smooth cinematic damping

    if (this.mode === "follow" && this.targetObject) {
      const targetPos = this.targetObject.position;

      // Calculate desired camera position relative to target
      const idealPosition = new THREE.Vector3(
        targetPos.x + this.followOffset.x,
        targetPos.y + this.followOffset.y,
        targetPos.z + this.followOffset.z
      );

      this.camera.position.lerp(idealPosition, lerpFactor);
      this.desiredLookAt.set(targetPos.x, targetPos.y + 1.1, targetPos.z);
    } else if (this.mode === "static") {
      this.camera.position.lerp(this.staticPosition, lerpFactor);
      this.desiredLookAt.copy(this.staticLookAt);
    } else if (this.mode === "look_at" && this.targetObject) {
      this.desiredLookAt.copy(this.targetObject.position).add(new THREE.Vector3(0, 1.1, 0));
    }

    this.currentLookAt.lerp(this.desiredLookAt, lerpFactor);
    this.camera.lookAt(this.currentLookAt);
  }
}
