import * as THREE from "three";
import type {
  AnimationDefinition,
  AnimationName,
  PlayOptions,
} from "./AnimationDefinition.ts";

export class AnimationController {
  private mixer: THREE.AnimationMixer;
  private actions = new Map<AnimationName, THREE.AnimationAction>();
  private definitions = new Map<AnimationName, AnimationDefinition>();
  private currentAction: THREE.AnimationAction | null = null;
  private currentName: AnimationName | null = null;

  constructor(
    mixer: THREE.AnimationMixer,
    clips: THREE.AnimationClip[],
    definitions: AnimationDefinition[]
  ) {
    this.mixer = mixer;

    for (const def of definitions) {
      this.definitions.set(def.name, def);
      const clip = clips.find((c) => c.name === def.clipName);
      if (clip) {
        const action = this.mixer.clipAction(clip);
        if (!def.loop) {
          action.loop = THREE.LoopOnce;
          action.clampWhenFinished = true;
        } else {
          action.loop = THREE.LoopRepeat;
        }
        this.actions.set(def.name, action);
      } else {
        console.warn(`[AnimationController] Clip not found for: ${def.clipName}`);
      }
    }
  }

  getCurrentAnimation(): AnimationName | null {
    return this.currentName;
  }

  isPlaying(name: AnimationName): boolean {
    return this.currentName === name && (this.currentAction?.isRunning() ?? false);
  }

  play(name: AnimationName, options: PlayOptions = {}): void {
    const action = this.actions.get(name);
    if (!action) {
      console.warn(`[AnimationController] Action ${name} not found`);
      return;
    }

    const def = this.definitions.get(name);
    const duration = options.crossFadeDuration ?? def?.defaultTransitionDuration ?? 0.25;

    if (options.loop !== undefined) {
      action.loop = options.loop ? THREE.LoopRepeat : THREE.LoopOnce;
    }
    if (options.clampWhenFinished !== undefined) {
      action.clampWhenFinished = options.clampWhenFinished;
    }

    if (this.currentAction && this.currentAction !== action) {
      action.reset();
      action.enabled = true;
      action.play();
      this.currentAction.crossFadeTo(action, duration, true);
    } else {
      action.reset();
      action.enabled = true;
      action.play();
    }

    this.currentAction = action;
    this.currentName = name;
  }

  crossFadeTo(name: AnimationName, duration?: number): void {
    this.play(name, { crossFadeDuration: duration });
  }

  stop(name?: AnimationName): void {
    if (name) {
      this.actions.get(name)?.stop();
      if (this.currentName === name) {
        this.currentAction = null;
        this.currentName = null;
      }
    } else {
      this.mixer.stopAllAction();
      this.currentAction = null;
      this.currentName = null;
    }
  }

  update(delta: number): void {
    this.mixer.update(delta);
  }
}
