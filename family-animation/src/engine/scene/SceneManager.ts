import * as THREE from "three";
import type { SceneConfig, SceneObjectConfig, LightConfig } from "./SceneObject.ts";
import { SceneGraph } from "./SceneGraph.ts";

export class SceneManager {
  private renderer!: THREE.WebGLRenderer;
  private _scene!: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private sceneGraph!: SceneGraph;
  private clock = new THREE.Clock();
  private animFrameId: number | null = null;

  // Registered update callbacks (timeline, camera, character, etc.)
  private updateCallbacks: Array<(delta: number) => void> = [];

  get scene(): THREE.Scene { return this._scene; }
  get camera(): THREE.PerspectiveCamera { return this._camera; }
  get graph(): SceneGraph { return this.sceneGraph; }

  setup(canvas: HTMLCanvasElement): void {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // Scene & Graph Hierarchy
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color("#111827");
    this._scene.fog = new THREE.Fog("#111827", 12, 35);
    this.sceneGraph = new SceneGraph(this._scene);

    // Camera
    this._camera = new THREE.PerspectiveCamera(
      55,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    this._camera.position.set(0, 3.5, 6.5);
    this._camera.lookAt(0, 1.0, 0);

    // Grid helper
    const grid = new THREE.GridHelper(16, 16, "#374151", "#1f2937");
    this._scene.add(grid);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => this._onResize(canvas));
    resizeObserver.observe(canvas.parentElement ?? canvas);
  }

  loadEnvironment(config: SceneConfig): void {
    // 1. Build lights
    for (const lightCfg of config.lights) {
      this._createLight(lightCfg);
    }

    // 2. Build objects
    for (const objCfg of config.objects) {
      this._createObject(objCfg);
    }
  }

  private _createLight(cfg: LightConfig): void {
    let light: THREE.Light;

    if (cfg.type === "ambient") {
      light = new THREE.AmbientLight(cfg.color, cfg.intensity);
    } else if (cfg.type === "directional") {
      const dirLight = new THREE.DirectionalLight(cfg.color, cfg.intensity);
      if (cfg.position) {
        dirLight.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
      }
      if (cfg.castShadow) {
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.set(2048, 2048);
        dirLight.shadow.bias = -0.0005;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 40;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
      }
      light = dirLight;
    } else if (cfg.type === "point") {
      const pointLight = new THREE.PointLight(cfg.color, cfg.intensity, 12, 1.5);
      if (cfg.position) {
        pointLight.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
      }
      light = pointLight;
    } else {
      light = new THREE.AmbientLight(cfg.color, cfg.intensity);
    }

    this.sceneGraph.addLight(light);
  }

  private _createObject(cfg: SceneObjectConfig): void {
    let mesh: THREE.Object3D;

    if (cfg.primitive) {
      let geo: THREE.BufferGeometry;
      const p = cfg.primitive;

      if (p.geometry === "plane") {
        geo = new THREE.PlaneGeometry(p.width ?? 10, p.height ?? 10);
      } else if (p.geometry === "cylinder") {
        geo = new THREE.CylinderGeometry(p.radius ?? 0.5, p.radius ?? 0.5, p.height ?? 2, 16);
      } else {
        // default box
        geo = new THREE.BoxGeometry(p.width ?? 1, p.height ?? 1, p.depth ?? 1);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(p.color),
        roughness: 0.6,
        metalness: 0.1,
      });

      mesh = new THREE.Mesh(geo, mat);
    } else {
      mesh = new THREE.Group();
    }

    mesh.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
    if (cfg.rotation) {
      mesh.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z);
    }
    if (cfg.scale) {
      mesh.scale.set(cfg.scale.x, cfg.scale.y, cfg.scale.z);
    }

    mesh.castShadow = cfg.castShadow ?? false;
    mesh.receiveShadow = cfg.receiveShadow ?? false;

    // Attach semantic data
    mesh.userData = { ...cfg };

    this.sceneGraph.addEnvironmentObject(cfg.id, mesh);
  }

  registerCharacter(id: string, object: THREE.Object3D): void {
    this.sceneGraph.addCharacter(id, object);
  }

  getObject(id: string): THREE.Object3D | null {
    return this.sceneGraph?.getObject(id) ?? null;
  }

  addUpdateCallback(cb: (delta: number) => void): void {
    this.updateCallbacks.push(cb);
  }

  removeUpdateCallback(cb: (delta: number) => void): void {
    this.updateCallbacks = this.updateCallbacks.filter((c) => c !== cb);
  }

  startRenderLoop(): void {
    const loop = () => {
      this.animFrameId = requestAnimationFrame(loop);
      const delta = Math.min(this.clock.getDelta(), 0.05);

      for (const cb of this.updateCallbacks) {
        cb(delta);
      }

      this.renderer.render(this._scene, this._camera);
    };
    this.clock.start();
    loop();
  }

  stopRenderLoop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private _onResize(canvas: HTMLCanvasElement): void {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose(): void {
    this.stopRenderLoop();
    this.renderer.dispose();
  }
}

export const sceneManager = new SceneManager();
