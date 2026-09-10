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

// ============================================================
// STYLIZED CARTOON DAD GENERATOR
// Character Traits:
// - Friendly, slightly chubby dad belly ("dad bod")
// - Big expressive cartoon eyes with pupils
// - Warm friendly smile & expressive mustache/nose
// - Cozy polo/t-shirt, casual brown khakis, brown loafers
// - Clean stylized low-poly cartoon silhouette
// ============================================================

// --- SKELETON RIG ---
const rootBone = new THREE.Bone();
rootBone.name = "Root";
rootBone.position.set(0, 0, 0);

const spineBone = new THREE.Bone();
spineBone.name = "Spine";
spineBone.position.set(0, 0.85, 0);
rootBone.add(spineBone);

const headBone = new THREE.Bone();
headBone.name = "Head";
headBone.position.set(0, 0.65, 0);
spineBone.add(headBone);

const armLeft = new THREE.Bone();
armLeft.name = "Arm_L";
armLeft.position.set(-0.48, 0.45, 0);
spineBone.add(armLeft);

const armRight = new THREE.Bone();
armRight.name = "Arm_R";
armRight.position.set(0.48, 0.45, 0);
spineBone.add(armRight);

const legLeft = new THREE.Bone();
legLeft.name = "Leg_L";
legLeft.position.set(-0.24, 0, 0);
rootBone.add(legLeft);

const legRight = new THREE.Bone();
legRight.name = "Leg_R";
legRight.position.set(0.24, 0, 0);
rootBone.add(legRight);

const bones = [rootBone, spineBone, headBone, armLeft, armRight, legLeft, legRight];
const skeleton = new THREE.Skeleton(bones);

// --- CARTOON SKINNING BODY (Torso + Belly + Pants) ---
const bodyGeo = new THREE.CylinderGeometry(0.32, 0.36, 1.7, 16, 16);
const bodyPos = bodyGeo.attributes.position;
const skinIndices = [];
const skinWeights = [];

for (let i = 0; i < bodyPos.count; i++) {
  const y = bodyPos.getY(i) + 0.85; // 0 to 1.7
  const x = bodyPos.getX(i);
  const z = bodyPos.getZ(i);

  // Add subtle cartoon belly bulge in the front middle
  if (y > 0.6 && y < 1.3 && z > 0) {
    const bulge = Math.sin(((y - 0.6) / 0.7) * Math.PI) * 0.12;
    bodyPos.setZ(i, z + bulge);
  }

  if (y < 0.75) {
    // Pants / Legs area
    skinIndices.push(0, 5, 6, 0);
    skinWeights.push(0.3, 0.35, 0.35, 0);
  } else if (y < 1.35) {
    // Torso / Belly
    skinIndices.push(1, 0, 0, 0);
    skinWeights.push(1.0, 0, 0, 0);
  } else {
    // Upper shoulders / neck
    skinIndices.push(2, 1, 0, 0);
    skinWeights.push(0.7, 0.3, 0, 0);
  }
}
bodyGeo.computeVertexNormals();
bodyGeo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
bodyGeo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));

// Material with vibrant Pixar/Illumination inspired blue polo shirt
const bodyMat = new THREE.MeshStandardMaterial({
  color: 0x2563eb, // royal blue shirt
  roughness: 0.6,
  metalness: 0.05,
});

const bodyMesh = new THREE.SkinnedMesh(bodyGeo, bodyMat);
bodyMesh.name = "DadBody";
bodyMesh.add(rootBone);
bodyMesh.bind(skeleton);
bodyMesh.castShadow = true;
bodyMesh.receiveShadow = true;

// --- CARTOON ARMS & HANDS (attached to arm bones) ---
const armMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.7 }); // warm peach skin

// Left Arm sleeve & hand
const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.65, 12);
armGeo.translate(0, -0.28, 0);
const armLeftMesh = new THREE.Mesh(armGeo, armMat);
armLeft.add(armLeftMesh);

const handGeo = new THREE.SphereGeometry(0.12, 12, 12);
handGeo.scale(1, 1.2, 0.9);
handGeo.translate(0, -0.62, 0);
const handLeftMesh = new THREE.Mesh(handGeo, skinMat);
armLeft.add(handLeftMesh);

// Right Arm sleeve & hand
const armRightMesh = new THREE.Mesh(armGeo.clone(), armMat);
armRight.add(armRightMesh);

const handRightMesh = new THREE.Mesh(handGeo.clone(), skinMat);
armRight.add(handRightMesh);

// --- CARTOON LEGS & LOAFERS ---
const pantsMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 }); // warm brown khakis
const shoeMat = new THREE.MeshStandardMaterial({ color: 0x3f2719, roughness: 0.5 }); // leather loafers

const legGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.75, 12);
legGeo.translate(0, -0.38, 0);

const shoeGeo = new THREE.BoxGeometry(0.24, 0.16, 0.42);
shoeGeo.translate(0, -0.74, 0.08);

const legLMesh = new THREE.Mesh(legGeo, pantsMat);
const shoeLMesh = new THREE.Mesh(shoeGeo, shoeMat);
legLeft.add(legLMesh);
legLeft.add(shoeLMesh);

const legRMesh = new THREE.Mesh(legGeo.clone(), pantsMat);
const shoeRMesh = new THREE.Mesh(shoeGeo.clone(), shoeMat);
legRight.add(legRMesh);
legRight.add(shoeRMesh);

// --- CARTOON HEAD & FACIAL FEATURES ---
// Big stylized head (slightly pear/oval shaped)
const headGeo = new THREE.SphereGeometry(0.32, 20, 20);
headGeo.scale(1.0, 1.15, 1.05);
headGeo.translate(0, 0.28, 0);
const headMesh = new THREE.Mesh(headGeo, skinMat);
headMesh.name = "DadHeadMesh";
headMesh.castShadow = true;
headBone.add(headMesh);

// Cartoon Hair (fluffy textured toupee/comb-over)
const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
const hairGeo = new THREE.SphereGeometry(0.34, 16, 16);
hairGeo.scale(1.04, 0.65, 1.06);
hairGeo.translate(0, 0.50, -0.02);
const hairMesh = new THREE.Mesh(hairGeo, hairMat);
headBone.add(hairMesh);

// Friendly rounded cartoon nose
const noseGeo = new THREE.SphereGeometry(0.09, 14, 14);
noseGeo.scale(1.1, 1.0, 1.2);
const noseMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 }); // cute rosy nose
const noseMesh = new THREE.Mesh(noseGeo, noseMat);
noseMesh.position.set(0, 0.26, 0.34);
headBone.add(noseMesh);

// Big Cartoon Eyes (Whites + Pupils)
const eyeWhiteGeo = new THREE.SphereGeometry(0.085, 16, 16);
eyeWhiteGeo.scale(0.85, 1.1, 0.6);
const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

const pupilGeo = new THREE.SphereGeometry(0.045, 12, 12);
pupilGeo.scale(0.8, 1.0, 0.4);
const pupilMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.1 });

// Left Eye
const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
eyeL.position.set(-0.11, 0.35, 0.30);
const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
pupilL.position.set(-0.11, 0.35, 0.345);
headBone.add(eyeL);
headBone.add(pupilL);

// Right Eye
const eyeR = new THREE.Mesh(eyeWhiteGeo.clone(), eyeWhiteMat);
eyeR.position.set(0.11, 0.35, 0.30);
const pupilR = new THREE.Mesh(pupilGeo.clone(), pupilMat);
pupilR.position.set(0.11, 0.35, 0.345);
headBone.add(eyeR);
headBone.add(pupilR);

// Cute Dad Eyebrows
const browGeo = new THREE.BoxGeometry(0.13, 0.035, 0.04);
const browMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
const browL = new THREE.Mesh(browGeo, browMat);
browL.position.set(-0.12, 0.46, 0.32);
browL.rotation.z = -0.15;
headBone.add(browL);

const browR = new THREE.Mesh(browGeo.clone(), browMat);
browR.position.set(0.12, 0.46, 0.32);
browR.rotation.z = 0.15;
headBone.add(browR);

// Stylized Dad Mustache & Smile
const stacheGeo = new THREE.CapsuleGeometry(0.05, 0.16, 8, 12);
stacheGeo.rotateZ(Math.PI / 2);
const stacheMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
const stacheMesh = new THREE.Mesh(stacheGeo, stacheMat);
stacheMesh.position.set(0, 0.18, 0.34);
stacheMesh.scale.set(1.2, 0.7, 0.8);
headBone.add(stacheMesh);

// Retro Dad Glasses
const glassRimGeo = new THREE.TorusGeometry(0.09, 0.016, 8, 20);
const glassMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 });

const glassRimL = new THREE.Mesh(glassRimGeo, glassMat);
glassRimL.position.set(-0.12, 0.35, 0.33);
headBone.add(glassRimL);

const glassRimR = new THREE.Mesh(glassRimGeo, glassMat);
glassRimR.position.set(0.12, 0.35, 0.33);
headBone.add(glassRimR);

const glassBridge = new THREE.BoxGeometry(0.08, 0.016, 0.02);
const bridgeMesh = new THREE.Mesh(glassBridge, glassMat);
bridgeMesh.position.set(0, 0.35, 0.34);
headBone.add(bridgeMesh);

// --- NATURAL ANIMATION CLIPS ---
// 1. Idle Clip (Belly breathing & relaxed swaying)
const idleTracks = [
  new THREE.VectorKeyframeTrack("Spine.position", [0, 1, 2], [0, 0.85, 0, 0, 0.87, 0, 0, 0.85, 0]),
  new THREE.QuaternionKeyframeTrack(
    "Arm_L.quaternion",
    [0, 1, 2],
    [0, 0, 0.12, 0.99, 0, 0, 0.16, 0.98, 0, 0, 0.12, 0.99]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 1, 2],
    [0, 0, -0.12, 0.99, 0, 0, -0.16, 0.98, 0, 0, -0.12, 0.99]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Head.quaternion",
    [0, 1, 2],
    [0, 0, 0, 1, 0.03, 0, 0, 0.99, 0, 0, 0, 1]
  ),
];
const idleClip = new THREE.AnimationClip("idle", 2, idleTracks);

// 2. Walk Clip (Bouncy cartoon stroll with arms swinging)
const walkTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.25, 0.5, 0.75, 1], [
    0, 0, 0,
    0, 0.1, 0,
    0, 0, 0,
    0, 0.1, 0,
    0, 0, 0
  ]),
  new THREE.QuaternionKeyframeTrack(
    "Leg_L.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [0.26, 0, 0, 0.96, 0, 0, 0, 1, -0.26, 0, 0, 0.96, 0, 0, 0, 1, 0.26, 0, 0, 0.96]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Leg_R.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [-0.26, 0, 0, 0.96, 0, 0, 0, 1, 0.26, 0, 0, 0.96, 0, 0, 0, 1, -0.26, 0, 0, 0.96]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_L.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [-0.32, 0, 0.1, 0.94, 0, 0, 0.1, 0.99, 0.32, 0, 0.1, 0.94, 0, 0, 0.1, 0.99, -0.32, 0, 0.1, 0.94]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [0.32, 0, -0.1, 0.94, 0, 0, -0.1, 0.99, -0.32, 0, -0.1, 0.94, 0, 0, -0.1, 0.99, 0.32, 0, -0.1, 0.94]
  ),
];
const walkClip = new THREE.AnimationClip("walk", 1, walkTracks);

// 3. Sit Clip
const sitTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1], [0, 0, 0, 0, -0.22, -0.12, 0, -0.45, -0.22]),
  new THREE.QuaternionKeyframeTrack("Leg_L.quaternion", [0, 1], [0, 0, 0, 1, 0.68, 0, 0, 0.73]),
  new THREE.QuaternionKeyframeTrack("Leg_R.quaternion", [0, 1], [0, 0, 0, 1, 0.68, 0, 0, 0.73]),
  new THREE.QuaternionKeyframeTrack("Spine.quaternion", [0, 1], [0, 0, 0, 1, -0.06, 0, 0, 0.99]),
];
const sitClip = new THREE.AnimationClip("sit", 1, sitTracks);

// 4. Stand Clip
const standTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1], [0, -0.45, -0.22, 0, -0.22, -0.12, 0, 0, 0]),
  new THREE.QuaternionKeyframeTrack("Leg_L.quaternion", [0, 1], [0.68, 0, 0, 0.73, 0, 0, 0, 1]),
  new THREE.QuaternionKeyframeTrack("Leg_R.quaternion", [0, 1], [0.68, 0, 0, 0.73, 0, 0, 0, 1]),
  new THREE.QuaternionKeyframeTrack("Spine.quaternion", [0, 1], [-0.06, 0, 0, 0.99, 0, 0, 0, 1]),
];
const standClip = new THREE.AnimationClip("stand", 1, standTracks);

// 5. Talk Clip (Head nodding & enthusiastic arm gesture)
const talkTracks = [
  new THREE.QuaternionKeyframeTrack(
    "Head.quaternion",
    [0, 0.3, 0.6, 0.9, 1.2, 1.5],
    [0, 0, 0, 1, 0.1, 0.05, 0, 0.99, -0.06, -0.04, 0, 0.99, 0.08, 0, 0, 0.99, -0.04, 0.06, 0, 0.99, 0, 0, 0, 1]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 0.4, 0.8, 1.2, 1.5],
    [0, 0, -0.1, 0.99, 0.25, 0.25, -0.25, 0.93, 0.45, 0.15, -0.2, 0.86, 0.15, 0.25, -0.25, 0.93, 0, 0, -0.1, 0.99]
  ),
];
const talkClip = new THREE.AnimationClip("talk", 1.5, talkTracks);

// Scene wrapper
const scene = new THREE.Scene();
scene.add(bodyMesh);

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
    console.log("Successfully generated cartoon dad.glb at:", outFile, "Size:", gltf.byteLength, "bytes");
  },
  (err) => {
    console.error("Export error:", err);
  },
  {
    binary: true,
    animations: [idleClip, walkClip, sitClip, standClip, talkClip],
  }
);
