import { useEffect, useRef } from "react";
import { sceneManager } from "@engine/scene/SceneManager.ts";
import { characterFactory } from "@engine/character/CharacterFactory.ts";
import { dadDefinition } from "@characters/dad/dad.definition.ts";
import { momDefinition } from "@characters/mom/mom.definition.ts";
import { sonDefinition } from "@characters/son/son.definition.ts";
import { daughterDefinition } from "@characters/daughter/daughter.definition.ts";
import { livingRoomConfig } from "@scenes/living-room/livingRoom.ts";
import livingRoomTimelineData from "@scenes/living-room/livingRoom.timeline.json";
import type { StoryTimeline } from "@engine/timeline/TimelineEvent.ts";
import { CameraController } from "@engine/camera/CameraController.ts";
import { timelineEngine } from "@engine/timeline/Timeline.ts";
import { useCharacterStore, type CharacterActionSet } from "@store/characterStore.ts";
import { useTimelineStore } from "@store/timelineStore.ts";
import type { ICharacterController } from "@engine/character/Character.ts";
import type { EmotionType } from "@engine/character/CharacterState.ts";

export function Viewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Setup SceneManager & Load Living Room Environment
    sceneManager.setup(canvas);
    sceneManager.loadEnvironment(livingRoomConfig);

    // 2. Camera Controller
    const cameraController = new CameraController(sceneManager.camera);
    sceneManager.addUpdateCallback((delta) => cameraController.update(delta));

    // 3. Timeline Engine Setup
    timelineEngine.setSceneManager(sceneManager);
    timelineEngine.setCameraController(cameraController);
    timelineEngine.load(livingRoomTimelineData as unknown as StoryTimeline);
    sceneManager.addUpdateCallback((delta) => timelineEngine.update(delta));

    // Sync timeline state to store
    timelineEngine.onTimeUpdate((currentTime, isPlaying) => {
      useTimelineStore.getState()._sync({
        currentTime,
        isPlaying,
        duration: timelineEngine.getDuration(),
      });
    });

    useTimelineStore.setState({
      _controls: {
        play: () => timelineEngine.play(),
        pause: () => timelineEngine.pause(),
        seek: (t) => timelineEngine.seek(t),
        reset: () => timelineEngine.reset(),
      },
    });

    sceneManager.startRenderLoop();

    let isDisposed = false;
    const loadedCharacters: ICharacterController[] = [];

    // Helper to build action set for UI
    const createActionSet = (actor: ICharacterController): CharacterActionSet => ({
      walkToSofa: () => {
        const sofa = sceneManager.getObject("sofa");
        if (sofa) actor.walkTo(sofa);
      },
      lookAtTV: () => {
        const tv = sceneManager.getObject("tv");
        if (tv) actor.lookAt(tv);
      },
      lookAtDoor: () => {
        const door = sceneManager.getObject("door_entrance");
        if (door) actor.lookAt(door);
      },
      sit: () => {
        const sofa = sceneManager.getObject("sofa");
        actor.sit(sofa ?? undefined);
      },
      stand: () => actor.stand(),
      talk: (text: string) => actor.say(text),
      laugh: () => actor.laugh(),
      setEmotion: (emotion: EmotionType) => actor.setEmotion(emotion),
      idle: () => actor.idle(),
      focusCamera: () => cameraController.follow(actor.object3D),
    });

    // 4. Load all 4 Family Members: Dad, Mom, Son, Daughter
    Promise.all([
      characterFactory.create(dadDefinition),
      characterFactory.create(momDefinition),
      characterFactory.create(sonDefinition),
      characterFactory.create(daughterDefinition),
    ]).then(([dad, mom, son, daughter]) => {
      if (isDisposed) {
        dad.dispose();
        mom.dispose();
        son.dispose();
        daughter.dispose();
        return;
      }

      loadedCharacters.push(dad, mom, son, daughter);

      // Initial positions & rotations
      dad.object3D.position.set(-4.5, 0, -2.0);
      dad.object3D.rotation.y = 0.5;

      mom.object3D.position.set(-2.2, 0, -0.6);
      mom.object3D.rotation.y = 0.8;

      son.object3D.position.set(0.4, 0, 0.6);
      son.object3D.rotation.y = -0.8;

      daughter.object3D.position.set(-1.5, 0, 0.4);
      daughter.object3D.rotation.y = 0.4;

      // Register characters with SceneManager & Timeline
      const roster: Array<{ id: string; name: string; ctrl: ICharacterController }> = [
        { id: "dad", name: "Dad", ctrl: dad },
        { id: "mom", name: "Mom", ctrl: mom },
        { id: "son", name: "Son", ctrl: son },
        { id: "daughter", name: "Daughter", ctrl: daughter },
      ];

      for (const item of roster) {
        sceneManager.registerCharacter(item.id, item.ctrl.object3D);
        timelineEngine.registerActor(item.id, item.ctrl);
        useCharacterStore.getState()._registerActions(item.id, createActionSet(item.ctrl));
      }

      // Default camera follow Dad
      cameraController.follow(dad.object3D);

      // Frame update callback for all family members
      const onUpdate = (delta: number) => {
        let activeSpeaker: string | null = null;
        let activeDialogue: string | null = null;

        for (const item of roster) {
          item.ctrl.update(delta);
          const state = item.ctrl.getState();

          useCharacterStore.getState()._syncCharacter(item.id, {
            behaviorState: state.behaviorState,
            emotion: state.emotion,
            position: state.position,
            rotation: state.rotation,
            isTalking: state.isTalking,
            currentDialogue: state.currentDialogue,
          });

          if (state.isTalking && state.currentDialogue) {
            activeSpeaker = item.name;
            activeDialogue = state.currentDialogue;
          }
        }

        useCharacterStore.getState()._syncDialogue(activeSpeaker, activeDialogue);
      };

      sceneManager.addUpdateCallback(onUpdate);

      // Initialize default active character actions
      const dadActions = createActionSet(dad);
      useCharacterStore.setState({ _actions: dadActions });
    });

    return () => {
      isDisposed = true;
      for (const c of loadedCharacters) {
        c.dispose();
      }
      sceneManager.stopRenderLoop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
