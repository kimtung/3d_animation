import { useEffect, useRef } from "react";
import { sceneManager } from "@engine/scene/SceneManager.ts";
import { characterFactory } from "@engine/character/CharacterFactory.ts";
import { dadDefinition } from "@characters/dad/dad.definition.ts";
import { livingRoomConfig } from "@scenes/living-room/livingRoom.ts";
import livingRoomTimelineData from "@scenes/living-room/livingRoom.timeline.json";
import type { StoryTimeline } from "@engine/timeline/TimelineEvent.ts";
import { CameraController } from "@engine/camera/CameraController.ts";
import { timelineEngine } from "@engine/timeline/Timeline.ts";
import { useCharacterStore } from "@store/characterStore.ts";
import { useTimelineStore } from "@store/timelineStore.ts";

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

    // 4. Load Dad character
    characterFactory.create(dadDefinition).then((dad) => {
      if (isDisposed) {
        dad.dispose();
        return;
      }

      sceneManager.registerCharacter("dad", dad.object3D);
      cameraController.follow(dad.object3D);
      timelineEngine.registerActor("dad", dad);

      // Register update loop for Dad
      const onUpdate = (delta: number) => {
        dad.update(delta);
        const state = dad.getState();
        useCharacterStore.getState()._sync({
          behaviorState: state.behaviorState,
          emotion: state.emotion,
          position: state.position,
          rotation: state.rotation,
          isTalking: state.isTalking,
          currentDialogue: state.currentDialogue,
        });
      };
      sceneManager.addUpdateCallback(onUpdate);

      // Expose actions to UI store
      useCharacterStore.setState({
        _actions: {
          walkToSofa: () => {
            const sofa = sceneManager.getObject("sofa");
            if (sofa) dad.walkTo(sofa);
          },
          lookAtTV: () => {
            const tv = sceneManager.getObject("tv");
            if (tv) dad.lookAt(tv);
          },
          lookAtDoor: () => {
            const door = sceneManager.getObject("door_entrance");
            if (door) dad.lookAt(door);
          },
          sit: () => {
            const sofa = sceneManager.getObject("sofa");
            dad.sit(sofa ?? undefined);
          },
          stand: () => dad.stand(),
          talk: (text: string) => dad.say(text),
          laugh: () => dad.laugh(),
          setEmotion: (emotion) => dad.setEmotion(emotion),
          idle: () => dad.idle(),
        },
      });
    });

    return () => {
      isDisposed = true;
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
