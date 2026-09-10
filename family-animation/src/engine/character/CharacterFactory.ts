import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { CharacterDefinition } from "./CharacterDefinition.ts";
import type { ICharacterController } from "./Character.ts";
import { CharacterController } from "./CharacterController.ts";

export class CharacterFactory {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
  }

  async create(definition: CharacterDefinition): Promise<ICharacterController> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        definition.asset,
        (gltf) => {
          const model = gltf.scene;
          model.name = `Character_${definition.id}`;

          // Enable shadows
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const controller = new CharacterController(
            definition,
            model,
            gltf.animations
          );

          resolve(controller);
        },
        undefined,
        (error) => {
          console.error(`[CharacterFactory] Failed to load ${definition.asset}:`, error);
          reject(error);
        }
      );
    });
  }
}

export const characterFactory = new CharacterFactory();
