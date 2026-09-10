// ============================================================
// SceneManager — owns the Three.js render loop
// React does NOT own the render loop; this class does.
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
  private renderer!: THREE.WebGLRenderer;
  private _scene!: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private clock = new THREE.Clock();
  private animFrameId: number | null = null;

  // Registered update callbacks (added by other engine modules)
  private updateCallbacks: Array<(delta: number) => void> = [];

  // Named object registry for scene lookup
  private objectRegistry = new Map<string, THREE.Object3D>();

  get scene(): THREE.Scene { return this._scene; }
  get camera(): THREE.PerspectiveCamera { return this._camera; }

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
    this.renderer.toneMappingExposure = 1.2;

    // Scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color('#1a1a2e');
    this._scene.fog = new THREE.Fog('#1a1a2e', 15, 40);

    // Camera
    this._camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    this._camera.position.set(0, 4, 8);
    this._camera.lookAt(0, 1, 0);

    // Orbit controls (dev only — will be replaced by CameraController in M2.2)
    this.controls = new OrbitControls(this._camera, canvas);
    this.controls.target.set(0, 1, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Default lighting
    this._setupLights();

    // Grid helper
    const grid = new THREE.GridHelper(20, 20, '#333355', '#222244');
    this._scene.add(grid);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => this._onResize(canvas));
    resizeObserver.observe(canvas.parentElement ?? canvas);

    console.log('[SceneManager] setup complete');
  }

  private _setupLights(): void {
    // Ambient — soft fill light
    const ambient = new THREE.AmbientLight('#ffffff', 0.4);
    this._scene.add(ambient);

    // Key light — main directional
    const keyLight = new THREE.DirectionalLight('#fff5e0', 1.5);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.bias = -0.001;
    this._scene.add(keyLight);

    // Fill light — soft opposite side
    const fillLight = new THREE.DirectionalLight('#c0d8ff', 0.5);
    fillLight.position.set(-5, 5, -3);
    this._scene.add(fillLight);
  }

  /** Register a named object for scene lookup */
  registerObject(id: string, object: THREE.Object3D): void {
    this.objectRegistry.set(id, object);
    this._scene.add(object);
  }

  /** Look up a registered scene object by id */
  getObject(id: string): THREE.Object3D | null {
    return this.objectRegistry.get(id) ?? null;
  }

  /** Register an update callback (called every frame) */
  addUpdateCallback(cb: (delta: number) => void): void {
    this.updateCallbacks.push(cb);
  }

  removeUpdateCallback(cb: (delta: number) => void): void {
    this.updateCallbacks = this.updateCallbacks.filter((c) => c !== cb);
  }

  startRenderLoop(): void {
    const loop = () => {
      this.animFrameId = requestAnimationFrame(loop);
      const delta = Math.min(this.clock.getDelta(), 0.05); // cap at 50ms

      this.controls.update();

      // Run all registered update callbacks
      for (const cb of this.updateCallbacks) {
        cb(delta);
      }

      this.renderer.render(this._scene, this._camera);
    };
    this.clock.start();
    loop();
    console.log('[SceneManager] render loop started');
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
    this.controls.dispose();
    this.renderer.dispose();
  }
}

// Singleton
export const sceneManager = new SceneManager();
