// ============================================================
// Viewport — React component that owns the canvas
// Mounts Three.js engine; does NOT contain 3D logic.
// ============================================================

import { useEffect, useRef } from "react";
import { sceneManager } from "@engine/scene/SceneManager.ts";

export function Viewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sceneManager.setup(canvas);
    sceneManager.startRenderLoop();

    return () => {
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
