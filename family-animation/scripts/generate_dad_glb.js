// Polyfill browser globals needed by three/addons/exporters/GLTFExporter in node
class MockFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
}
globalThis.FileReader = MockFileReader;

import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import fs from "fs";
import path from "path";

// Build a rigged humanoid skeleton
const rootBone = new THREE.Bone();
rootBone.name = "Root";
rootBone.position.set(0, 0, 0);

const spineBone = new THREE.Bone();
spineBone.name = "Spine";
spineBone.position.set(0, 0.9, 0);
rootBone.add(spineBone);

const headBone = new THREE.Bone();
headBone.name = "Head";
headBone.position.set(0, 0.6, 0);
spineBone.add(headBone);

const armLeft = new THREE.Bone();
armLeft.name = "Arm_L";
armLeft.position.set(-0.4, 0.4, 0);
spineBone.add(armLeft);

const armRight = new THREE.Bone();
armRight.name = "Arm_R";
armRight.position.set(0.4, 0.4, 0);
spineBone.add(armRight);

const legLeft = new THREE.Bone();
legLeft.name = "Leg_L";
legLeft.position.set(-0.25, 0, 0);
rootBone.add(legLeft);

const legRight = new THREE.Bone();
legRight.name = "Leg_R";
legRight.position.set(0.25, 0, 0);
rootBone.add(legRight);

const bones = [rootBone, spineBone, headBone, armLeft, armRight, legLeft, legRight];
const skeleton = new THREE.Skeleton(bones);

// Create cylinder body mesh
const geometry = new THREE.CylinderGeometry(0.25, 0.25, 1.8, 12, 12);
const position = geometry.attributes.position;

const skinIndices = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  const y = position.getY(i) + 0.9;
  if (y < 0.8) {
    skinIndices.push(0, 5, 6, 0);
    skinWeights.push(0.3, 0.35, 0.35, 0);
  } else if (y < 1.4) {
    skinIndices.push(1, 0, 0, 0);
    skinWeights.push(1, 0, 0, 0);
  } else {
    skinIndices.push(2, 1, 0, 0);
    skinWeights.push(0.8, 0.2, 0, 0);
  }
}

geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));

const material = new THREE.MeshStandardMaterial({
  color: 0x3b82f6,
  roughness: 0.5,
  metalness: 0.1,
});

const skinnedMesh = new THREE.SkinnedMesh(geometry, material);
skinnedMesh.name = "DadBody";
skinnedMesh.add(rootBone);
skinnedMesh.bind(skeleton);

// Add visual head
const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
const headMesh = new THREE.Mesh(headGeo, headMat);
headMesh.name = "DadHeadMesh";
headMesh.position.set(0, 0.15, 0);
headBone.add(headMesh);

// Add hair
const hairGeo = new THREE.BoxGeometry(0.42, 0.12, 0.42);
const hairMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
const hairMesh = new THREE.Mesh(hairGeo, hairMat);
hairMesh.position.set(0, 0.22, 0);
headBone.add(hairMesh);

// Add glasses
const glassGeo = new THREE.BoxGeometry(0.32, 0.08, 0.05);
const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const glassMesh = new THREE.Mesh(glassGeo, glassMat);
glassMesh.position.set(0, 0.12, 0.21);
headBone.add(glassMesh);

// --- ANIMATION CLIPS ---
// 1. Idle Clip
const idleTracks = [
  new THREE.VectorKeyframeTrack("Spine.position", [0, 1, 2], [0, 0.9, 0, 0, 0.92, 0, 0, 0.9, 0]),
  new THREE.QuaternionKeyframeTrack(
    "Arm_L.quaternion",
    [0, 1, 2],
    [0, 0, 0.1, 0.99, 0, 0, 0.13, 0.99, 0, 0, 0.1, 0.99]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 1, 2],
    [0, 0, -0.1, 0.99, 0, 0, -0.13, 0.99, 0, 0, -0.1, 0.99]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Head.quaternion",
    [0, 1, 2],
    [0, 0, 0, 1, 0.02, 0, 0, 0.99, 0, 0, 0, 1]
  ),
];
const idleClip = new THREE.AnimationClip("idle", 2, idleTracks);

// 2. Walk Clip
const walkTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.25, 0.5, 0.75, 1], [
    0, 0, 0,
    0, 0.08, 0,
    0, 0, 0,
    0, 0.08, 0,
    0, 0, 0
  ]),
  new THREE.QuaternionKeyframeTrack(
    "Leg_L.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [0.2, 0, 0, 0.98, 0, 0, 0, 1, -0.2, 0, 0, 0.98, 0, 0, 0, 1, 0.2, 0, 0, 0.98]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Leg_R.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [-0.2, 0, 0, 0.98, 0, 0, 0, 1, 0.2, 0, 0, 0.98, 0, 0, 0, 1, -0.2, 0, 0, 0.98]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_L.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [-0.25, 0, 0.1, 0.96, 0, 0, 0.1, 0.99, 0.25, 0, 0.1, 0.96, 0, 0, 0.1, 0.99, -0.25, 0, 0.1, 0.96]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [0.25, 0, -0.1, 0.96, 0, 0, -0.1, 0.99, -0.25, 0, -0.1, 0.96, 0, 0, -0.1, 0.99, 0.25, 0, -0.1, 0.96]
  ),
];
const walkClip = new THREE.AnimationClip("walk", 1, walkTracks);

// 3. Sit Clip
const sitTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1], [0, 0, 0, 0, -0.2, -0.1, 0, -0.42, -0.2]),
  new THREE.QuaternionKeyframeTrack("Leg_L.quaternion", [0, 1], [0, 0, 0, 1, 0.65, 0, 0, 0.75]),
  new THREE.QuaternionKeyframeTrack("Leg_R.quaternion", [0, 1], [0, 0, 0, 1, 0.65, 0, 0, 0.75]),
  new THREE.QuaternionKeyframeTrack("Spine.quaternion", [0, 1], [0, 0, 0, 1, -0.05, 0, 0, 0.99]),
];
const sitClip = new THREE.AnimationClip("sit", 1, sitTracks);

// 4. Stand Clip
const standTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1], [0, -0.42, -0.2, 0, -0.2, -0.1, 0, 0, 0]),
  new THREE.QuaternionKeyframeTrack("Leg_L.quaternion", [0, 1], [0.65, 0, 0, 0.75, 0, 0, 0, 1]),
  new THREE.QuaternionKeyframeTrack("Leg_R.quaternion", [0, 1], [0.65, 0, 0, 0.75, 0, 0, 0, 1]),
  new THREE.QuaternionKeyframeTrack("Spine.quaternion", [0, 1], [-0.05, 0, 0, 0.99, 0, 0, 0, 1]),
];
const standClip = new THREE.AnimationClip("stand", 1, standTracks);

// 5. Talk Clip
const talkTracks = [
  new THREE.QuaternionKeyframeTrack(
    "Head.quaternion",
    [0, 0.3, 0.6, 0.9, 1.2, 1.5],
    [0, 0, 0, 1, 0.08, 0.04, 0, 0.99, -0.05, -0.03, 0, 0.99, 0.06, 0, 0, 0.99, -0.03, 0.05, 0, 0.99, 0, 0, 0, 1]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 0.4, 0.8, 1.2, 1.5],
    [0, 0, -0.1, 0.99, 0.2, 0.2, -0.2, 0.95, 0.4, 0.1, -0.15, 0.9, 0.1, 0.2, -0.2, 0.95, 0, 0, -0.1, 0.99]
  ),
];
const talkClip = new THREE.AnimationClip("talk", 1.5, talkTracks);

// Scene wrapper
const scene = new THREE.Scene();
scene.add(skinnedMesh);

// Export GLB
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (gltf) => {
    const outDir = path.resolve("public/assets/characters/dad");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, "dad.glb");
    fs.writeFileSync(outFile, Buffer.from(gltf));
    console.log("Successfully generated dad.glb at:", outFile, "Size:", gltf.byteLength, "bytes");
  },
  (err) => {
    console.error("Export error:", err);
  },
  {
    binary: true,
    animations: [idleClip, walkClip, sitClip, standClip, talkClip],
  }
);
