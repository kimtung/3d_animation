import type { SceneConfig } from "@engine/scene/SceneObject.ts";

export const livingRoomConfig: SceneConfig = {
  id: "living_room",
  name: "Family Living Room",
  objects: [
    // Floor
    {
      id: "floor",
      type: "primitive",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      primitive: {
        geometry: "plane",
        width: 14,
        height: 14,
        color: "#2a221b", // warm wooden parquet tone
      },
      receiveShadow: true,
    },
    // Back wall
    {
      id: "wall_back",
      type: "primitive",
      position: { x: 0, y: 2.5, z: -5 },
      primitive: {
        geometry: "box",
        width: 14,
        height: 5,
        depth: 0.2,
        color: "#3d4251", // modern slate blue wall
      },
      receiveShadow: true,
    },
    // Sofa (couch base + backrest + cushions)
    {
      id: "sofa",
      type: "primitive",
      position: { x: 2.6, y: 0.35, z: 0.8 },
      primitive: {
        geometry: "box",
        width: 1.6,
        height: 0.6,
        depth: 1.0,
        color: "#d97706", // warm mustard/amber sofa
      },
      castShadow: true,
      receiveShadow: true,
    },
    // TV (mounted on wall / stand)
    {
      id: "tv",
      type: "primitive",
      position: { x: 0, y: 1.8, z: -4.8 },
      primitive: {
        geometry: "box",
        width: 2.2,
        height: 1.3,
        depth: 0.1,
        color: "#0f172a", // glossy black TV screen
      },
      castShadow: true,
    },
    // TV Stand / Console
    {
      id: "tv_stand",
      type: "primitive",
      position: { x: 0, y: 0.4, z: -4.6 },
      primitive: {
        geometry: "box",
        width: 2.8,
        height: 0.7,
        depth: 0.6,
        color: "#573a27",
      },
      castShadow: true,
      receiveShadow: true,
    },
    // Coffee Table in front of sofa
    {
      id: "coffee_table",
      type: "primitive",
      position: { x: 1.6, y: 0.25, z: -0.6 },
      primitive: {
        geometry: "box",
        width: 1.1,
        height: 0.45,
        depth: 0.7,
        color: "#854d0e",
      },
      castShadow: true,
      receiveShadow: true,
    },
    // Living Room Floor Lamp
    {
      id: "lamp",
      type: "primitive",
      position: { x: -3.2, y: 1.4, z: 1.8 },
      primitive: {
        geometry: "cylinder",
        radius: 0.28,
        height: 2.6,
        color: "#fbbf24", // cozy glowing lampshade
      },
      castShadow: true,
    },
    // Rug under table & sofa
    {
      id: "rug",
      type: "primitive",
      position: { x: 1.5, y: 0.01, z: 0 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      primitive: {
        geometry: "plane",
        width: 4.5,
        height: 3.5,
        color: "#e2e8f0",
      },
      receiveShadow: true,
    },
    // Mom doorway placeholder (where Mom appears in the story at t=15s)
    {
      id: "door_entrance",
      type: "primitive",
      position: { x: -4.5, y: 1.6, z: -2 },
      primitive: {
        geometry: "box",
        width: 1.2,
        height: 3.0,
        depth: 0.15,
        color: "#475569",
      },
    },
  ],
  lights: [
    {
      type: "ambient",
      color: "#ffffff",
      intensity: 0.6,
    },
    {
      type: "directional",
      color: "#fffbeb",
      intensity: 1.6,
      position: { x: 6, y: 10, z: 6 },
      castShadow: true,
    },
    {
      type: "point",
      color: "#f59e0b",
      intensity: 2.0,
      position: { x: -3.2, y: 2.2, z: 1.8 },
    },
  ],
  defaultCamera: {
    position: { x: 0, y: 3.5, z: 6.5 },
    lookAt: { x: 0, y: 1.0, z: 0 },
    fov: 55,
  },
};
