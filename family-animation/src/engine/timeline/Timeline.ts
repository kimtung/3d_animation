import type { TimelineEvent, StoryTimeline } from "./TimelineEvent.ts";
import type { ICharacterController } from "@engine/character/Character.ts";
import type { CameraController } from "@engine/camera/CameraController.ts";
import type { SceneManager } from "@engine/scene/SceneManager.ts";
import * as THREE from "three";

export class Timeline {
  private events: TimelineEvent[] = [];
  private currentTime = 0;
  private duration = 25;
  private isPlaying = false;
  private dispatchedEvents = new Set<TimelineEvent>();

  // Actor & system registries
  private actors = new Map<string, ICharacterController>();
  private cameraController: CameraController | null = null;
  private sceneManager: SceneManager | null = null;

  // Listeners
  private onTimeUpdateCbs: Array<(time: number, isPlaying: boolean) => void> = [];

  load(timeline: StoryTimeline | TimelineEvent[]): void {
    if (Array.isArray(timeline)) {
      this.events = [...timeline].sort((a, b) => a.time - b.time);
      this.duration = this.events[this.events.length - 1]?.time ?? 25;
    } else {
      this.events = [...timeline.events].sort((a, b) => a.time - b.time);
      this.duration = timeline.duration;
    }
    this.reset();
  }

  registerActor(id: string, controller: ICharacterController): void {
    this.actors.set(id, controller);
  }

  setCameraController(controller: CameraController): void {
    this.cameraController = controller;
  }

  setSceneManager(manager: SceneManager): void {
    this.sceneManager = manager;
  }

  play(): void {
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
  }

  reset(): void {
    this.currentTime = 0;
    this.isPlaying = false;
    this.dispatchedEvents.clear();
    this.notifyTimeUpdate();
  }

  seek(time: number): void {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    // Re-evaluate dispatched events based on new time
    this.dispatchedEvents.clear();
    for (const event of this.events) {
      if (event.time < this.currentTime) {
        this.dispatchedEvents.add(event);
      }
    }
    this.notifyTimeUpdate();
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getDuration(): number {
    return this.duration;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  onTimeUpdate(cb: (time: number, isPlaying: boolean) => void): () => void {
    this.onTimeUpdateCbs.push(cb);
    return () => {
      this.onTimeUpdateCbs = this.onTimeUpdateCbs.filter((c) => c !== cb);
    };
  }

  private notifyTimeUpdate(): void {
    for (const cb of this.onTimeUpdateCbs) {
      cb(this.currentTime, this.isPlaying);
    }
  }

  update(delta: number): void {
    if (!this.isPlaying) return;

    this.currentTime += delta;
    this.notifyTimeUpdate();

    // Check & dispatch events
    for (const event of this.events) {
      if (event.time <= this.currentTime && !this.dispatchedEvents.has(event)) {
        this.dispatchedEvents.add(event);
        this.dispatchEvent(event);
      }
    }

    if (this.currentTime >= this.duration) {
      this.isPlaying = false;
      this.notifyTimeUpdate();
    }
  }

  private async dispatchEvent(event: TimelineEvent): Promise<void> {
    // Camera event
    if (event.actor === "camera" && this.cameraController) {
      if (event.action === "set_camera_mode" && event.params?.cameraMode) {
        if (event.params.cameraMode === "static") {
          this.cameraController.setStatic(
            new THREE.Vector3(-1.5, 2.5, 5.0),
            new THREE.Vector3(1.5, 1.0, 0)
          );
        } else if (event.params.cameraMode === "follow") {
          const dad = this.actors.get("dad");
          if (dad) this.cameraController.follow(dad.object3D);
        }
      }
      return;
    }

    // Character event
    const actor = this.actors.get(event.actor);
    if (!actor) {
      console.warn(`[Timeline] Actor not found: ${event.actor}`);
      return;
    }

    let targetObj: THREE.Object3D | null = null;
    if (event.target && this.sceneManager) {
      targetObj = this.sceneManager.getObject(event.target);
    }

    switch (event.action) {
      case "idle":
        actor.idle();
        break;
      case "walk_to":
        if (targetObj) {
          await actor.walkTo(targetObj);
        }
        break;
      case "look_at":
        if (targetObj) {
          await actor.lookAt(targetObj);
        }
        break;
      case "sit":
        await actor.sit();
        break;
      case "stand":
        await actor.stand();
        break;
      case "say":
        if (event.params?.text) {
          await actor.say(event.params.text);
        }
        break;
      case "laugh":
        await actor.laugh();
        break;
      case "set_emotion":
        if (event.params?.emotion) {
          actor.setEmotion(event.params.emotion);
        }
        break;
      default:
        console.warn(`[Timeline] Unhandled action: ${event.action}`);
    }
  }
}

export const timelineEngine = new Timeline();
