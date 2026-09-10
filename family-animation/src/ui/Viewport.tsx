// ============================================================
// Viewport — React component that owns the canvas
// Mounts Three.js engine; does NOT contain 3D logic.
// ============================================================

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sceneManager } from "@engine/scene/SceneManager.ts";
import { characterFactory } from "@engine/character/CharacterFactory.ts";
import { dadDefinition } from "@characters/dad/dad.definition.ts";
import { useCharacterStore } from "@store/characterStore.ts";

export function Viewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sceneManager.setup(canvas);
    sceneManager.startRenderLoop();

    let isDisposed = false;

    // Load Dad character
    characterFactory.create(dadDefinition).then((dad) => {
      if (isDisposed) {
        dad.dispose();
        return;
      }

      sceneManager.registerObject("dad", dad.object3D);

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
          walkToSofa: () => dad.walkTo(new THREE.Vector3(2.5, 0, 1.0)),
          lookAtTV: () => dad.lookAt(new THREE.Vector3(0, 1.2, -4.0)),
          sit: () => dad.sit(),
          stand: () => dad.stand(),
          talk: (text: string) => dad.say(text),
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
