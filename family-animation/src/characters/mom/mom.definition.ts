import type { CharacterDefinition } from "@engine/character/CharacterDefinition.ts";

export const momDefinition: CharacterDefinition = {
  id: "mom",
  name: "Mom",
  role: "Mother",
  asset: "/assets/characters/mom/mom.glb",

  personality: {
    traits: [
      "caring",
      "energetic",
      "organized",
      "warm",
      "expressive",
      "patient",
    ],
  },

  appearance: {
    bodyType: "stylized_family_mom",
    ageGroup: "early_30s",
    clothing: [
      "golden_orange_knit_sweater",
      "dark_slate_leggings",
      "taupe_slip_on_shoes",
      "middle_parted_long_brown_hair",
    ],
  },

  defaultEmotion: "happy",

  capabilities: ["walk", "look_at", "talk", "laugh", "idle"],

  animations: [
    { name: "idle", clipName: "idle", loop: true, defaultTransitionDuration: 0.3 },
    { name: "walk", clipName: "walk", loop: true, defaultTransitionDuration: 0.3 },
    { name: "talk", clipName: "talk", loop: true, defaultTransitionDuration: 0.1 },
    { name: "laugh", clipName: "laugh", loop: true, defaultTransitionDuration: 0.2 },
    { name: "sit", clipName: "sit", loop: false, defaultTransitionDuration: 0.2 },
    { name: "stand", clipName: "stand", loop: false, defaultTransitionDuration: 0.3 },
  ],

  emotions: [
    { type: "neutral", boneOverrides: [] },
    {
      type: "happy",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: -0.05, y: 0.05, z: 0.05 }, weight: 1.0 },
      ],
    },
    {
      type: "surprised",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: -0.15, y: 0, z: 0 }, weight: 1.0 },
        { boneName: "Spine", rotationDelta: { x: -0.05, y: 0, z: 0 }, weight: 0.6 },
      ],
    },
    {
      type: "angry",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: 0.15, y: 0, z: 0 }, weight: 1.0 },
      ],
    },
    {
      type: "confused",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: 0, y: 0.1, z: 0.2 }, weight: 1.0 },
      ],
    },
  ],

  movementConfig: {
    walkSpeed: 2.1,
    rotationSpeed: 5.5,
    arrivalThreshold: 0.15,
  },
};
