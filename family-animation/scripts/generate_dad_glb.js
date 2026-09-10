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
// STYLIZED CARTOON DAD GENERATOR (Seamless Anatomical Structure)
// - Root at Ground Y=0
// - Pelvis & Hip Joint at Y=0.85
// - Left & Right Legs hanging from Hip to Ground (0 to 0.85)
// - Torso (Khakis + Blue Polo + Shoulders + Neck) from Y=0.85 to 1.55
// - Shoulders seamlessly span -0.38 to +0.38
// - Neck naturally arises from chest/collar to Head
// - Head with facial features (eyes, eyebrows, nose, mustache, glasses) at Y=1.55+
// ============================================================

const rootGroup = new THREE.Group();
rootGroup.name = "CharacterRoot";

// --- SKELETON RIG ---
const rootBone = new THREE.Bone();
rootBone.name = "Root";
rootBone.position.set(0, 0, 0);

const spineBone = new THREE.Bone();
spineBone.name = "Spine";
spineBone.position.set(0, 0.85, 0); // Hip/Pelvis height
rootBone.add(spineBone);

const headBone = new THREE.Bone();
headBone.name = "Head";
headBone.position.set(0, 0.65, 0); // Neck base to head center
spineBone.add(headBone);

const armLeft = new THREE.Bone();
armLeft.name = "Arm_L";
armLeft.position.set(-0.38, 0.42, 0); // Left shoulder socket
spineBone.add(armLeft);

const armRight = new THREE.Bone();
armRight.name = "Arm_R";
armRight.position.set(0.38, 0.42, 0); // Right shoulder socket
spineBone.add(armRight);

const legLeft = new THREE.Bone();
legLeft.name = "Leg_L";
legLeft.position.set(-0.18, 0, 0); // Left hip joint
spineBone.add(legLeft);

const legRight = new THREE.Bone();
legRight.name = "Leg_R";
legRight.position.set(0.18, 0, 0); // Right hip joint
spineBone.add(legRight);

// Register skeleton
const bones = [rootBone, spineBone, headBone, armLeft, armRight, legLeft, legRight];

// --- MATERIALS ---
const shirtMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }); // vibrant blue polo
const collarMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
const pantsMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 }); // warm brown khakis
const shoeMat = new THREE.MeshStandardMaterial({ color: 0x29180d, roughness: 0.4 }); // brown leather shoes
const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.7 }); // peach skin
const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
const glassMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 });

// --- 1. TORSO & SHOULDERS & BELLY (attached to spineBone) ---
// Upper torso & shoulders (Polo shirt)
const torsoGeo = new THREE.CylinderGeometry(0.34, 0.38, 0.60, 16);
torsoGeo.translate(0, 0.28, 0);
const torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
torsoMesh.castShadow = true;
spineBone.add(torsoMesh);

// Cartoon dad belly (cute front bulge)
const bellyGeo = new THREE.SphereGeometry(0.28, 16, 16);
bellyGeo.scale(1.2, 0.9, 1.1);
bellyGeo.translate(0, 0.18, 0.16);
const bellyMesh = new THREE.Mesh(bellyGeo, shirtMat);
bellyMesh.castShadow = true;
spineBone.add(bellyMesh);

// Curved Shoulder Pads for natural shoulder line to arms
const shoulderGeo = new THREE.SphereGeometry(0.15, 12, 12);
shoulderGeo.scale(1.1, 0.9, 1.0);
const shoulderL = new THREE.Mesh(shoulderGeo, shirtMat);
shoulderL.position.set(-0.36, 0.42, 0);
spineBone.add(shoulderL);

const shoulderR = new THREE.Mesh(shoulderGeo, shirtMat);
shoulderR.position.set(0.36, 0.42, 0);
spineBone.add(shoulderR);

// Hip / Pelvis base (transition between shirt and legs)
const pelvisGeo = new THREE.CylinderGeometry(0.36, 0.33, 0.18, 16);
pelvisGeo.translate(0, -0.05, 0);
const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMat);
pelvisMesh.castShadow = true;
spineBone.add(pelvisMesh);

// --- 2. SEAMLESS NECK & COLLAR ---
// Solid neck cylinder extending from inside chest right into head
const neckGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.26, 16);
neckGeo.translate(0, 0.52, 0);
const neckMesh = new THREE.Mesh(neckGeo, skinMat);
neckMesh.castShadow = true;
spineBone.add(neckMesh);

// Polo Collar encircling neck at shoulder height
const collarGeo = new THREE.TorusGeometry(0.20, 0.05, 8, 20);
collarGeo.rotateX(Math.PI / 2);
collarGeo.translate(0, 0.50, 0);
const collarMesh = new THREE.Mesh(collarGeo, collarMat);
spineBone.add(collarMesh);

// --- 3. FULL LEGS & SHOES (attached to leg bones, hanging down to ground Y=0) ---
// Left Leg
const thighGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.70, 14);
thighGeo.translate(0, -0.38, 0);
const thighLMesh = new THREE.Mesh(thighGeo, pantsMat);
thighLMesh.castShadow = true;
legLeft.add(thighLMesh);

// Left Shoe sitting flat on ground (Y = -0.85 relative to spine)
const shoeGeo = new THREE.BoxGeometry(0.24, 0.16, 0.40);
shoeGeo.translate(0, -0.77, 0.08);
const shoeLMesh = new THREE.Mesh(shoeGeo, shoeMat);
shoeLMesh.castShadow = true;
legLeft.add(shoeLMesh);

// Right Leg
const thighRMesh = new THREE.Mesh(thighGeo.clone(), pantsMat);
thighRMesh.castShadow = true;
legRight.add(thighRMesh);

const shoeRMesh = new THREE.Mesh(shoeGeo.clone(), shoeMat);
shoeRMesh.castShadow = true;
legRight.add(shoeRMesh);

// --- 4. ARMS & HANDS (attached to arm bones) ---
const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.55, 12);
armGeo.translate(0, -0.26, 0);

const handGeo = new THREE.SphereGeometry(0.11, 12, 12);
handGeo.scale(1, 1.2, 0.9);
handGeo.translate(0, -0.55, 0);

// Left Arm
const armLMesh = new THREE.Mesh(armGeo, shirtMat);
const handLMesh = new THREE.Mesh(handGeo, skinMat);
armLMesh.castShadow = true;
armLeft.add(armLMesh);
armLeft.add(handLMesh);

// Right Arm
const armRMesh = new THREE.Mesh(armGeo.clone(), shirtMat);
const handRMesh = new THREE.Mesh(handGeo.clone(), skinMat);
armRMesh.castShadow = true;
armRight.add(armRMesh);
armRight.add(handRMesh);

// --- 5. HEAD & FACIAL FEATURES (attached to headBone) ---
const headGeo = new THREE.SphereGeometry(0.30, 20, 20);
headGeo.scale(1.0, 1.12, 1.02);
headGeo.translate(0, 0.12, 0); // perfectly seated on the neck
const headMesh = new THREE.Mesh(headGeo, skinMat);
headMesh.name = "DadHeadMesh";
headMesh.castShadow = true;
headBone.add(headMesh);

// Hair
const hairGeo = new THREE.SphereGeometry(0.32, 16, 16);
hairGeo.scale(1.04, 0.65, 1.05);
hairGeo.translate(0, 0.32, -0.02);
const hairMesh = new THREE.Mesh(hairGeo, hairMat);
headBone.add(hairMesh);

// Nose
const noseGeo = new THREE.SphereGeometry(0.08, 14, 14);
noseGeo.scale(1.1, 1.0, 1.2);
const noseMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
const noseMesh = new THREE.Mesh(noseGeo, noseMat);
noseMesh.position.set(0, 0.10, 0.33);
headBone.add(noseMesh);

// Eyes
const eyeWhiteGeo = new THREE.SphereGeometry(0.08, 16, 16);
eyeWhiteGeo.scale(0.85, 1.1, 0.6);
const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

const pupilGeo = new THREE.SphereGeometry(0.042, 12, 12);
pupilGeo.scale(0.8, 1.0, 0.4);
const pupilMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.1 });

// Left Eye
const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
eyeL.position.set(-0.10, 0.19, 0.29);
const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
pupilL.position.set(-0.10, 0.19, 0.335);
headBone.add(eyeL);
headBone.add(pupilL);

// Right Eye
const eyeR = new THREE.Mesh(eyeWhiteGeo.clone(), eyeWhiteMat);
eyeR.position.set(0.10, 0.19, 0.29);
const pupilR = new THREE.Mesh(pupilGeo.clone(), pupilMat);
pupilR.position.set(0.10, 0.19, 0.335);
headBone.add(eyeR);
headBone.add(pupilR);

// Eyebrows
const browGeo = new THREE.BoxGeometry(0.12, 0.03, 0.04);
const browMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
const browL = new THREE.Mesh(browGeo, browMat);
browL.position.set(-0.11, 0.30, 0.30);
browL.rotation.z = -0.12;
headBone.add(browL);

const browR = new THREE.Mesh(browGeo.clone(), browMat);
browR.position.set(0.11, 0.30, 0.30);
browR.rotation.z = 0.12;
headBone.add(browR);

// Mustache
const stacheGeo = new THREE.CapsuleGeometry(0.045, 0.15, 8, 12);
stacheGeo.rotateZ(Math.PI / 2);
const stacheMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
const stacheMesh = new THREE.Mesh(stacheGeo, stacheMat);
stacheMesh.position.set(0, 0.03, 0.32);
stacheMesh.scale.set(1.2, 0.7, 0.8);
headBone.add(stacheMesh);

// Glasses
const glassRimGeo = new THREE.TorusGeometry(0.085, 0.015, 8, 20);
const glassRimL = new THREE.Mesh(glassRimGeo, glassMat);
glassRimL.position.set(-0.11, 0.19, 0.32);
headBone.add(glassRimL);

const glassRimR = new THREE.Mesh(glassRimGeo, glassMat);
glassRimR.position.set(0.11, 0.19, 0.32);
headBone.add(glassRimR);

const glassBridge = new THREE.BoxGeometry(0.07, 0.015, 0.02);
const bridgeMesh = new THREE.Mesh(glassBridge, glassMat);
bridgeMesh.position.set(0, 0.19, 0.33);
headBone.add(bridgeMesh);

// Add bone hierarchy to scene
rootGroup.add(rootBone);

// --- NATURAL ANIMATION CLIPS ---
// 1. Idle Clip
const idleTracks = [
  new THREE.VectorKeyframeTrack("Spine.position", [0, 1, 2], [0, 0.85, 0, 0, 0.87, 0, 0, 0.85, 0]),
  new THREE.QuaternionKeyframeTrack(
    "Arm_L.quaternion",
    [0, 1, 2],
    [0, 0, 0.08, 0.99, 0, 0, 0.12, 0.99, 0, 0, 0.08, 0.99]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 1, 2],
    [0, 0, -0.08, 0.99, 0, 0, -0.12, 0.99, 0, 0, -0.08, 0.99]
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
    [0.32, 0, 0, 0.95, 0, 0, 0, 1, -0.32, 0, 0, 0.95, 0, 0, 0, 1, 0.32, 0, 0, 0.95]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Leg_R.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [-0.32, 0, 0, 0.95, 0, 0, 0, 1, 0.32, 0, 0, 0.95, 0, 0, 0, 1, -0.32, 0, 0, 0.95]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_L.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [-0.28, 0, 0.08, 0.95, 0, 0, 0.08, 0.99, 0.28, 0, 0.08, 0.95, 0, 0, 0.08, 0.99, -0.28, 0, 0.08, 0.95]
  ),
  new THREE.QuaternionKeyframeTrack(
    "Arm_R.quaternion",
    [0, 0.25, 0.5, 0.75, 1],
    [0.28, 0, -0.08, 0.95, 0, 0, -0.08, 0.99, -0.28, 0, -0.08, 0.95, 0, 0, -0.08, 0.99, 0.28, 0, -0.08, 0.95]
  ),
];
const walkClip = new THREE.AnimationClip("walk", 1, walkTracks);

// 3. Sit Clip
const sitTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1], [0, 0, 0, 0, -0.22, -0.12, 0, -0.42, -0.22]),
  new THREE.QuaternionKeyframeTrack("Leg_L.quaternion", [0, 1], [0, 0, 0, 1, 0.72, 0, 0, 0.69]),
  new THREE.QuaternionKeyframeTrack("Leg_R.quaternion", [0, 1], [0, 0, 0, 1, 0.72, 0, 0, 0.69]),
  new THREE.QuaternionKeyframeTrack("Spine.quaternion", [0, 1], [0, 0, 0, 1, -0.05, 0, 0, 0.99]),
];
const sitClip = new THREE.AnimationClip("sit", 1, sitTracks);

// 4. Stand Clip
const standTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1], [0, -0.42, -0.22, 0, -0.22, -0.12, 0, 0, 0]),
  new THREE.QuaternionKeyframeTrack("Leg_L.quaternion", [0, 1], [0.72, 0, 0, 0.69, 0, 0, 0, 1]),
  new THREE.QuaternionKeyframeTrack("Leg_R.quaternion", [0, 1], [0.72, 0, 0, 0.69, 0, 0, 0, 1]),
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
    [0, 0, -0.08, 0.99, 0.2, 0.2, -0.2, 0.95, 0.4, 0.1, -0.15, 0.9, 0.1, 0.2, -0.2, 0.95, 0, 0, -0.08, 0.99]
  ),
];
const talkClip = new THREE.AnimationClip("talk", 1.5, talkTracks);

// Export GLB
const scene = new THREE.Scene();
scene.add(rootGroup);

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
    console.log("Successfully generated anatomically seamless Dad at:", outFile, "Size:", gltf.byteLength, "bytes");
  },
  (err) => {
    console.error("Export error:", err);
  },
  {
    binary: true,
    animations: [idleClip, walkClip, sitClip, standClip, talkClip],
  }
);
