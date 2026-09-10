import * as THREE from "three";
import type { ICharacterController } from "./Character.ts";
import type { CharacterRuntimeState, EmotionType } from "./CharacterState.ts";
import type { CharacterDefinition } from "./CharacterDefinition.ts";
import { StateMachine } from "@engine/behavior/StateMachine.ts";
import { AnimationController } from "@engine/animation/AnimationController.ts";
import { MotionController } from "@engine/movement/MotionController.ts";
import { EmotionController } from "@engine/emotion/EmotionController.ts";
import {
  BehaviorManager,
} from "@engine/behavior/BehaviorManager.ts";
import {
  IdleBehavior,
  WalkToBehavior,
  LookAtBehavior,
  SitBehavior,
  StandBehavior,
  TalkBehavior,
} from "@engine/behavior/Behavior.ts";

export class CharacterController implements ICharacterController {
  readonly id: string;
  readonly object3D: THREE.Object3D;
  readonly definition: CharacterDefinition;
  private stateMachine: StateMachine;
  private animationController: AnimationController;
  private motionController: MotionController;
  private emotionController: EmotionController;
  private behaviorManager: BehaviorManager;

  private currentDialogue: string | null = null;
  private isTalking = false;

  constructor(
    definition: CharacterDefinition,
    object3D: THREE.Object3D,
    clips: THREE.AnimationClip[]
  ) {
    this.definition = definition;
    this.id = definition.id;
    this.object3D = object3D;

    // Subsystems
    this.stateMachine = new StateMachine();

    const mixer = new THREE.AnimationMixer(object3D);
    this.animationController = new AnimationController(
      mixer,
      clips,
      definition.animations
    );

    this.motionController = new MotionController(
      object3D,
      definition.movementConfig
    );

    this.emotionController = new EmotionController(
      object3D,
      definition.emotions
    );

    const context = {
      characterId: this.id,
      object3D: this.object3D,
      stateMachine: this.stateMachine,
      animationController: this.animationController,
      motionController: this.motionController,
      emotionController: this.emotionController,
    };

    this.behaviorManager = new BehaviorManager(context);

    // Initial state
    this.idle();
  }

  idle(): void {
    this.behaviorManager.execute(new IdleBehavior());
  }

  async walkTo(target: THREE.Vector3 | THREE.Object3D): Promise<void> {
    const pos = target instanceof THREE.Vector3 ? target : target.position;
    await this.behaviorManager.execute(new WalkToBehavior(pos));
  }

  async lookAt(target: THREE.Vector3 | THREE.Object3D): Promise<void> {
    const pos = target instanceof THREE.Vector3 ? target : target.position;
    await this.behaviorManager.execute(new LookAtBehavior(pos));
  }

  async sit(seatTarget?: THREE.Object3D): Promise<void> {
    await this.behaviorManager.execute(new SitBehavior(seatTarget));
  }

  async stand(): Promise<void> {
    await this.behaviorManager.execute(new StandBehavior());
  }

  async say(text: string): Promise<void> {
    this.currentDialogue = text;
    this.isTalking = true;
    try {
      await this.behaviorManager.execute(new TalkBehavior(2.5));
    } finally {
      this.currentDialogue = null;
      this.isTalking = false;
    }
  }

  private lifeTime = Math.random() * 10;

  async laugh(): Promise<void> {
    this.setEmotion("happy");
    this.animationController.play("laugh", { loop: true });
    await new Promise((resolve) => setTimeout(resolve, 1600));
    this.animationController.crossFadeTo("idle", 0.3);
    this.clearEmotion();
  }

  setEmotion(emotion: EmotionType): void {
    this.emotionController.setEmotion(emotion);
  }

  clearEmotion(): void {
    this.emotionController.clearEmotion();
  }

  getState(): CharacterRuntimeState {
    return {
      characterId: this.id,
      behaviorState: this.stateMachine.getState(),
      position: {
        x: this.object3D.position.x,
        y: this.object3D.position.y,
        z: this.object3D.position.z,
      },
      rotation: this.object3D.rotation.y,
      location: "living_room",
      emotion: this.emotionController.getCurrentEmotion(),
      energy: 90,
      isTalking: this.isTalking,
      currentDialogue: this.currentDialogue,
    };
  }

  update(delta: number): void {
    this.lifeTime += delta;
    this.motionController.update(delta);
    this.animationController.update(delta);
    this.emotionController.update(delta);

    // Living micro-motion layer: natural breathing & organic soft sway
    if (this.stateMachine.getState() === "IDLE") {
      const breath = Math.sin(this.lifeTime * 2.4);
      const sway = Math.cos(this.lifeTime * 1.2);

      const spine = this.object3D.getObjectByName("Spine");
      if (spine) {
        spine.position.y += breath * 0.003;
      }

      const head = this.object3D.getObjectByName("Head");
      if (head && this.emotionController.getCurrentEmotion() === "neutral") {
        head.rotation.z += sway * 0.006;
      }
    }
  }

  dispose(): void {
    this.behaviorManager.interrupt();
    this.motionController.dispose();
  }
}
