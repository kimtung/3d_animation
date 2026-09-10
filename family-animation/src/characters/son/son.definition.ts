import type { CharacterDefinition } from "@engine/character/CharacterDefinition.ts";

export const sonDefinition: CharacterDefinition = {
  id: "son",
  name: "Son",
  role: "Son",
  asset: "/assets/characters/son/son.glb",

  personality: {
    traits: [
      "cheerful",
      "curious",
      "energetic",
      "playful",
      "mischievous",
    ],
  },

  appearance: {
    bodyType: "stylized_toddler_boy",
    ageGroup: "child_3_4",
    clothing: [
      "olive_green_crew_tshirt",
      "blue_denim_jeans",
      "white_sneakers",
      "messy_brown_hair",
    ],
  },

  defaultEmotion: "happy",

  capabilities: ["look_at", "talk", "laugh", "idle"],

  animations: [
    { name: "idle", clipName: "idle", loop: true, defaultTransitionDuration: 0.3 },
  ],

  emotions: [
    { type: "neutral", boneOverrides: [] },
    {
      type: "happy",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: -0.08, y: 0, z: 0.05 }, weight: 1.0 },
      ],
    },
    {
      type: "surprised",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: -0.2, y: 0, z: 0 }, weight: 1.0 },
      ],
    },
  ],

  movementConfig: {
    walkSpeed: 1.5,
    rotationSpeed: 5.0,
    arrivalThreshold: 0.15,
  },
};
