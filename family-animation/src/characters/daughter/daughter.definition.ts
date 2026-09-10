import type { CharacterDefinition } from "@engine/character/CharacterDefinition.ts";

export const daughterDefinition: CharacterDefinition = {
  id: "daughter",
  name: "Daughter",
  role: "Daughter",
  asset: "/assets/characters/daughter/daughter.glb",

  personality: {
    traits: [
      "adorable",
      "bubbly",
      "giggling",
      "innocent",
      "affectionate",
    ],
  },

  appearance: {
    bodyType: "stylized_baby_girl",
    ageGroup: "toddler_1_2",
    clothing: [
      "sky_blue_cotton_romper",
      "barefoot_or_booties",
      "little_curly_brown_ponytail",
    ],
  },

  defaultEmotion: "happy",

  capabilities: ["walk", "look_at", "talk", "laugh", "idle"],

  animations: [
    { name: "idle", clipName: "idle", loop: true, defaultTransitionDuration: 0.3 },
    { name: "walk", clipName: "walk", loop: true, defaultTransitionDuration: 0.3 },
    { name: "talk", clipName: "talk", loop: true, defaultTransitionDuration: 0.1 },
    { name: "laugh", clipName: "laugh", loop: true, defaultTransitionDuration: 0.2 },
  ],

  emotions: [
    { type: "neutral", boneOverrides: [] },
    {
      type: "happy",
      boneOverrides: [
        { boneName: "Head", rotationDelta: { x: -0.05, y: 0.05, z: 0.08 }, weight: 1.0 },
      ],
    },
  ],

  movementConfig: {
    walkSpeed: 1.0,
    rotationSpeed: 4.0,
    arrivalThreshold: 0.15,
  },
};
