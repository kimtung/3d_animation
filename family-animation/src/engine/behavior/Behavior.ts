import type { BehaviorState } from "@engine/character/CharacterState.ts";
import type { StateMachine } from "./StateMachine.ts";
import type { AnimationController } from "@engine/animation/AnimationController.ts";
import type { MotionController } from "@engine/movement/MotionController.ts";
import type { EmotionController } from "@engine/emotion/EmotionController.ts";
import type * as THREE from "three";

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
    // LookAt is parallel, does not force leave sitting/idle
    await ctx.motionController.rotateTo(this.target);
  }
}

export class SitBehavior implements Behavior {
  readonly id = "sit";
  readonly targetState: BehaviorState = "SITTING";

  async execute(ctx: BehaviorContext): Promise<void> {
    if (!ctx.stateMachine.canTransition("SITTING")) {
      console.warn("[SitBehavior] Cannot transition to SITTING");
      return;
    }

    ctx.stateMachine.transition("SITTING");
    ctx.animationController.play("sit", { loop: false, clampWhenFinished: true });
    // Wait for sit animation duration (~1s)
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
