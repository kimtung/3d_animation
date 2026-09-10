import * as THREE from "three";

export class SceneGraph {
  readonly root: THREE.Scene;
  readonly environmentNode: THREE.Group;
  readonly charactersNode: THREE.Group;
  readonly lightsNode: THREE.Group;

  private registry = new Map<string, THREE.Object3D>();

  constructor(scene: THREE.Scene) {
    this.root = scene;

    this.environmentNode = new THREE.Group();
    this.environmentNode.name = "Environment";
    this.root.add(this.environmentNode);

    this.charactersNode = new THREE.Group();
    this.charactersNode.name = "Characters";
    this.root.add(this.charactersNode);

    this.lightsNode = new THREE.Group();
    this.lightsNode.name = "Lights";
    this.root.add(this.lightsNode);
  }

  addEnvironmentObject(id: string, object: THREE.Object3D): void {
    object.name = id;
    this.registry.set(id, object);
    this.environmentNode.add(object);
  }

  addCharacter(id: string, object: THREE.Object3D): void {
    object.name = id;
    this.registry.set(id, object);
    this.charactersNode.add(object);
  }

  addLight(light: THREE.Light): void {
    this.lightsNode.add(light);
  }

  getObject(id: string): THREE.Object3D | null {
    return this.registry.get(id) ?? null;
  }

  getAllObjects(): Map<string, THREE.Object3D> {
    return this.registry;
  }
}
