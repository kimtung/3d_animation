import type { CharacterDefinition } from "@engine/character/CharacterDefinition.ts";

export const dadDefinition: CharacterDefinition = {
  id: "dad",
  name: "Dad",
  role: "Father",
  asset: "/assets/characters/dad/dad.glb",

  personality: {
    traits: [
      "funny",
      "kind",
      "relaxed",
      "slightly_lazy",
      "easy_going",
      "avoids_conflict",
      "playful",
    ],
  },

  appearance: {
    bodyType: "adult_male_stylized",
    ageGroup: "mid_40s",
    clothing: ["blue_tshirt", "casual_slacks", "retro_glasses"],
  },

  defaultEmotion: "neutral",

  capabilities: ["walk", "sit", "stand", "look_at", "talk", "laugh", "idle"],

  animations: [
    { name: "idle", clipName: "idle", loop: true, defaultTransitionDuration: 0.3 },
    { name: "walk", clipName: "walk", loop: true, defaultTransitionDuration: 0.3 },
    { name: "sit", clipName: "sit", loop: false, defaultTransitionDuration: 0.2 },
    { name: "stand", clipName: "stand", loop: false, defaultTransitionDuration: 0.3 },
    { name: "talk", clipName: "talk", loop: true, defaultTransitionDuration: 0.1 },
  ],

  emotions: [
    { type: "neutral", boneOverrides: [] },
    {
      type: "happy",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: -0.1, y: 0, z: 0 }, weight: 1.0 },
        { boneName: "Spine", rotationDelta: { x: -0.05, y: 0, z: 0 }, weight: 0.7 },
      ],
    },
    {
      type: "embarrassed",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: 0.25, y: 0.2, z: 0 }, weight: 1.0 },
        { boneName: "Spine", rotationDelta: { x: 0.1, y: 0, z: 0 }, weight: 0.8 },
      ],
    },
    {
      type: "surprised",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: -0.2, y: 0, z: 0 }, weight: 1.0 },
        { boneName: "Spine", rotationDelta: { x: -0.1, y: 0, z: 0 }, weight: 0.5 },
      ],
    },
    {
      type: "angry",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: 0.2, y: 0, z: 0 }, weight: 1.0 },
        { boneName: "Spine", rotationDelta: { x: 0.15, y: 0, z: 0 }, weight: 0.9 },
      ],
    },
    {
      type: "confused",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: 0, y: 0.1, z: 0.25 }, weight: 1.0 },
      ],
    },
    {
      type: "sleepy",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: 0.3, y: 0, z: 0.1 }, weight: 1.0 },
        { boneName: "Spine", rotationDelta: { x: 0.2, y: 0, z: 0 }, weight: 0.9 },
      ],
    },
  ],

  movementConfig: {
    walkSpeed: 2.0,
    rotationSpeed: 5.0,
    arrivalThreshold: 0.15,
  },
};
