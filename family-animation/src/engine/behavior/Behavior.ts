import type { BehaviorState } from "@engine/character/CharacterState.ts";
import type { StateMachine } from "./StateMachine.ts";
import type { AnimationController } from "@engine/animation/AnimationController.ts";
import type { MotionController } from "@engine/movement/MotionController.ts";
import type { EmotionController } from "@engine/emotion/EmotionController.ts";
import * as THREE from "three";

export interface BehaviorContext {
  characterId: string;
  object3D: THREE.Object3D;
  stateMachine: StateMachine;
  animationController: AnimationController;
  motionController: MotionController;
  emotionController: EmotionController;
}

export interface Behavior {
  readonly id: string;
  readonly targetState: BehaviorState;

  execute(context: BehaviorContext): Promise<void>;
  interrupt?(): void;
}

// Built-in Behaviors
export class IdleBehavior implements Behavior {
  readonly id = "idle";
  readonly targetState: BehaviorState = "IDLE";

  async execute(ctx: BehaviorContext): Promise<void> {
    if (ctx.stateMachine.transition("IDLE")) {
      ctx.animationController.crossFadeTo("idle", 0.3);
    }
  }
}

export class WalkToBehavior implements Behavior {
  readonly id = "walk_to";
  readonly targetState: BehaviorState = "WALKING";
  private target: THREE.Vector3;
  private isInterrupted = false;

  constructor(target: THREE.Vector3) {
    this.target = target;
  }

  async execute(ctx: BehaviorContext): Promise<void> {
    if (!ctx.stateMachine.canTransition("WALKING")) {
      console.warn("[WalkToBehavior] Cannot transition to WALKING");
      return;
    }

    ctx.stateMachine.transition("WALKING");
    ctx.animationController.crossFadeTo("walk", 0.25);

    // First rotate to face direction
    await ctx.motionController.rotateTo(this.target);
    if (this.isInterrupted) return;

    // Then walk to target
    await ctx.motionController.moveTo(this.target);
    if (this.isInterrupted) return;

    // Arrived
    if (ctx.stateMachine.transition("IDLE")) {
      ctx.animationController.crossFadeTo("idle", 0.3);
    }
  }

  interrupt(): void {
    this.isInterrupted = true;
  }
}

export class LookAtBehavior implements Behavior {
  readonly id = "look_at";
  readonly targetState: BehaviorState = "LOOKING";
  private target: THREE.Vector3;

  constructor(target: THREE.Vector3) {
    this.target = target;
  }

  async execute(ctx: BehaviorContext): Promise<void> {
    // If character is sitting, look with head and spine rather than moving full body
    if (ctx.stateMachine.getState() === "SITTING") {
      const charPos = ctx.object3D.position;
      const dir = this.target.clone().sub(charPos);
      const angle = Math.atan2(dir.x, dir.z) - ctx.object3D.rotation.y;
      const normalizedAngle = Math.atan2(Math.sin(angle), Math.cos(angle));

      // Tilt head toward target
      ctx.emotionController.setEmotion("neutral");
      const head = ctx.object3D.getObjectByName("Head");
      if (head) {
        head.rotation.y = THREE.MathUtils.clamp(normalizedAngle * 0.8, -1.2, 1.2);
      }
    } else {
      await ctx.motionController.rotateTo(this.target);
    }
  }
}

export class SitBehavior implements Behavior {
  readonly id = "sit";
  readonly targetState: BehaviorState = "SITTING";
  private targetObject?: THREE.Object3D;

  constructor(targetObject?: THREE.Object3D) {
    this.targetObject = targetObject;
  }

  async execute(ctx: BehaviorContext): Promise<void> {
    if (!ctx.stateMachine.canTransition("SITTING")) {
      console.warn("[SitBehavior] Cannot transition to SITTING");
      return;
    }

    // Check if semantic seatAnchor exists on target object
    const anchor = this.targetObject?.userData?.seatAnchor;
    if (anchor) {
      // 1. Move to entry position right in front of seat
      const entryVec = new THREE.Vector3(
        anchor.entryPosition.x,
        anchor.entryPosition.y,
        anchor.entryPosition.z
      );
      await ctx.motionController.moveTo(entryVec);

      // 2. Rotate to face away from sofa (out towards room / TV)
      await ctx.motionController.rotateToAngle(anchor.seatRotationY);

      // 3. Step back into seat smoothly
      const seatVec = new THREE.Vector3(
        anchor.seatPosition.x,
        anchor.seatPosition.y,
        anchor.seatPosition.z
      );
      await ctx.motionController.moveTo(seatVec);
    }

    // 4. Trigger sit animation & transition state
    ctx.stateMachine.transition("SITTING");
    ctx.animationController.play("sit", { loop: false, clampWhenFinished: true });
    await new Promise((resolve) => setTimeout(resolve, 950));
  }
}

export class StandBehavior implements Behavior {
  readonly id = "stand";
  readonly targetState: BehaviorState = "IDLE";

  async execute(ctx: BehaviorContext): Promise<void> {
    if (!ctx.stateMachine.canTransition("IDLE")) {
      console.warn("[StandBehavior] Cannot transition from current state to IDLE");
      return;
    }

    ctx.animationController.play("stand", { loop: false, clampWhenFinished: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    ctx.stateMachine.transition("IDLE");
    ctx.animationController.crossFadeTo("idle", 0.2);
  }
}

export class TalkBehavior implements Behavior {
  readonly id = "talk";
  readonly targetState: BehaviorState = "TALKING";
  private duration: number;

  constructor(duration: number = 2.5) {
    this.duration = duration;
  }

  async execute(ctx: BehaviorContext): Promise<void> {
    if (!ctx.stateMachine.canTransition("TALKING")) {
      console.warn("[TalkBehavior] Cannot transition to TALKING");
      return;
    }

    ctx.stateMachine.transition("TALKING");
    ctx.animationController.play("talk", { loop: true });

    await new Promise((resolve) => setTimeout(resolve, this.duration * 1000));

    if (ctx.stateMachine.transition("IDLE")) {
      ctx.animationController.crossFadeTo("idle", 0.3);
    }
  }
}
