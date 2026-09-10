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
// STYLIZED PIXAR/3D CARTOON DAD GENERATOR (Accurate Reference Match)
//
// Reference Image Visual Blueprint:
// - Hair: Stylish warm dark brown pompadour with soft quiff & side part
// - Face: Warm peach-cream skin, round black rim modern glasses
// - Beard: Full neat hipster beard & mustache surrounding open warm smile
// - Eyes: Large friendly expressive hazel/dark eyes
// - Torso: Vibrant warm pumpkin orange crewneck / V-neck sweater
// - Inner Shirt: Subtle light grey/white collared shirt peeking out at neck
// - Body: Tall, fit yet cozy family man silhouette (broad shoulders, athletic-lean)
// - Legs: Modern slim-straight slate blue/grey jeans
// - Shoes: Warm tan / camel suede casual sneakers with white sole
// ============================================================

const rootGroup = new THREE.Group();
rootGroup.name = "CharacterRoot";

// --- SKELETON RIG ---
const rootBone = new THREE.Bone();
rootBone.name = "Root";
rootBone.position.set(0, 0, 0);

const spineBone = new THREE.Bone();
spineBone.name = "Spine";
spineBone.position.set(0, 0.95, 0); // Natural hip height
rootBone.add(spineBone);

const headBone = new THREE.Bone();
headBone.name = "Head";
headBone.position.set(0, 0.78, 0); // Neck hinge to head center
spineBone.add(headBone);

const armLeft = new THREE.Bone();
armLeft.name = "Arm_L";
armLeft.position.set(-0.40, 0.44, 0); // Left shoulder socket
spineBone.add(armLeft);

const armRight = new THREE.Bone();
armRight.name = "Arm_R";
armRight.position.set(0.40, 0.44, 0); // Right shoulder socket
spineBone.add(armRight);

const legLeft = new THREE.Bone();
legLeft.name = "Leg_L";
legLeft.position.set(-0.16, 0, 0); // Left hip
spineBone.add(legLeft);

const legRight = new THREE.Bone();
legRight.name = "Leg_R";
legRight.position.set(0.16, 0, 0); // Right hip
spineBone.add(legRight);

// --- COLOR PALETTE FROM REFERENCE IMAGE ---
const orangeSweaterMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 }); // vibrant orange sweater
const innerCollarMat   = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 }); // white/light grey inner shirt
const blueJeansMat     = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }); // slate blue jeans
const tanShoeMat       = new THREE.MeshStandardMaterial({ color: 0xc2783d, roughness: 0.7 }); // camel tan suede shoes
const shoeSoleMat      = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }); // clean white sneaker sole
const skinMat          = new THREE.MeshStandardMaterial({ color: 0xfbd0b7, roughness: 0.65 }); // warm healthy cartoon skin
const brownHairMat     = new THREE.MeshStandardMaterial({ color: 0x3d2012, roughness: 0.85 }); // rich dark chocolate hair
const beardMat         = new THREE.MeshStandardMaterial({ color: 0x422214, roughness: 0.9 }); // full neat beard
const blackGlassesMat  = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.25 }); // modern black matte frame
const whiteTeethMat    = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 }); // bright happy teeth
const mouthMat         = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5 }); // deep warm mouth interior

// ============================================================
// 1. TORSO & SHOULDERS (Orange Sweater + Inner Collar)
// ============================================================
// Main upper torso (Sweater)
const torsoGeo = new THREE.CylinderGeometry(0.32, 0.30, 0.62, 16);
torsoGeo.translate(0, 0.28, 0);
const torsoMesh = new THREE.Mesh(torsoGeo, orangeSweaterMat);
torsoMesh.castShadow = true;
spineBone.add(torsoMesh);

// Soft natural chest taper
const chestGeo = new THREE.SphereGeometry(0.28, 16, 16);
chestGeo.scale(1.15, 0.85, 0.95);
chestGeo.translate(0, 0.32, 0.08);
const chestMesh = new THREE.Mesh(chestGeo, orangeSweaterMat);
chestMesh.castShadow = true;
spineBone.add(chestMesh);

// Smooth rounded shoulders
const shoulderGeo = new THREE.SphereGeometry(0.14, 12, 12);
const shoulderL = new THREE.Mesh(shoulderGeo, orangeSweaterMat);
shoulderL.position.set(-0.38, 0.44, 0);
spineBone.add(shoulderL);

const shoulderR = new THREE.Mesh(shoulderGeo, orangeSweaterMat);
shoulderR.position.set(0.38, 0.44, 0);
spineBone.add(shoulderR);

// Sweater waist ribbing & Pelvis (waist band of orange sweater + top of jeans)
const waistGeo = new THREE.CylinderGeometry(0.30, 0.28, 0.12, 16);
waistGeo.translate(0, -0.04, 0);
const waistMesh = new THREE.Mesh(waistGeo, orangeSweaterMat);
waistMesh.castShadow = true;
spineBone.add(waistMesh);

const pelvisGeo = new THREE.CylinderGeometry(0.28, 0.27, 0.14, 16);
pelvisGeo.translate(0, -0.12, 0);
const pelvisMesh = new THREE.Mesh(pelvisGeo, blueJeansMat);
pelvisMesh.castShadow = true;
spineBone.add(pelvisMesh);

// ============================================================
// 2. CLEAR VISIBLE NECK & LAYERED COLLAR (Shirt under Sweater)
// ============================================================
// Visible Neck Column
const neckGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.28, 16);
neckGeo.translate(0, 0.62, 0);
const neckMesh = new THREE.Mesh(neckGeo, skinMat);
neckMesh.castShadow = true;
spineBone.add(neckMesh);

// Inner white/grey collared shirt peaking out
const innerShirtGeo = new THREE.TorusGeometry(0.17, 0.035, 8, 20);
innerShirtGeo.rotateX(Math.PI / 2);
innerShirtGeo.translate(0, 0.58, 0);
const innerShirtMesh = new THREE.Mesh(innerShirtGeo, innerCollarMat);
innerShirtMesh.castShadow = true;
spineBone.add(innerShirtMesh);

// V-neck / Crewneck sweater border
const sweaterTrimGeo = new THREE.TorusGeometry(0.20, 0.04, 8, 20);
sweaterTrimGeo.rotateX(Math.PI / 2);
sweaterTrimGeo.translate(0, 0.54, 0);
const sweaterTrimMesh = new THREE.Mesh(sweaterTrimGeo, orangeSweaterMat);
spineBone.add(sweaterTrimMesh);

// ============================================================
// 3. SLIM SLATE BLUE JEANS & TAN SNEAKERS (Hanging to Floor Y=0)
// ============================================================
// Long slim legs matching cartoon reference
const legGeo = new THREE.CylinderGeometry(0.13, 0.10, 0.85, 14);
legGeo.translate(0, -0.44, 0);

// Left Leg
const legLMesh = new THREE.Mesh(legGeo, blueJeansMat);
legLMesh.castShadow = true;
legLeft.add(legLMesh);

// Right Leg
const legRMesh = new THREE.Mesh(legGeo.clone(), blueJeansMat);
legRMesh.castShadow = true;
legRight.add(legRMesh);

// Tan Suede Shoes with White Soles
const shoeUpperGeo = new THREE.BoxGeometry(0.20, 0.14, 0.36);
shoeUpperGeo.translate(0, -0.85, 0.08);

const soleGeo = new THREE.BoxGeometry(0.21, 0.05, 0.38);
soleGeo.translate(0, -0.92, 0.08);

// Left Shoe
const shoeL = new THREE.Mesh(shoeUpperGeo, tanShoeMat);
const soleL = new THREE.Mesh(soleGeo, shoeSoleMat);
shoeL.castShadow = true;
legLeft.add(shoeL);
legLeft.add(soleL);

// Right Shoe
const shoeR = new THREE.Mesh(shoeUpperGeo.clone(), tanShoeMat);
const soleR = new THREE.Mesh(soleGeo.clone(), shoeSoleMat);
shoeR.castShadow = true;
legRight.add(shoeR);
legRight.add(soleR);

// ============================================================
// 4. ARMS & HANDS (Orange Sweater Sleeves)
// ============================================================
const armGeo = new THREE.CylinderGeometry(0.10, 0.08, 0.62, 12);
armGeo.translate(0, -0.28, 0);

const handGeo = new THREE.SphereGeometry(0.095, 12, 12);
handGeo.scale(1, 1.25, 0.85);
handGeo.translate(0, -0.62, 0);

// Left Arm
const armL = new THREE.Mesh(armGeo, orangeSweaterMat);
const handL = new THREE.Mesh(handGeo, skinMat);
armL.castShadow = true;
armLeft.add(armL);
armLeft.add(handL);

// Right Arm
const armR = new THREE.Mesh(armGeo.clone(), orangeSweaterMat);
const handR = new THREE.Mesh(handGeo.clone(), skinMat);
armR.castShadow = true;
armRight.add(armR);
armRight.add(handR);

// ============================================================
// 5. CARTOON HEAD, STYLISH HAIR, BEARD & GLASSES
// ============================================================
// Stylized Head Mesh
const headGeo = new THREE.SphereGeometry(0.28, 20, 20);
headGeo.scale(1.0, 1.15, 1.05);
headGeo.translate(0, 0.14, 0);
const headMesh = new THREE.Mesh(headGeo, skinMat);
headMesh.name = "DadHeadMesh";
headMesh.castShadow = true;
headBone.add(headMesh);

// Signature Pompadour Hair (Full brown hair with volume on top)
const hairBaseGeo = new THREE.SphereGeometry(0.30, 16, 16);
hairBaseGeo.scale(1.03, 0.85, 1.05);
hairBaseGeo.translate(0, 0.32, -0.02);
const hairBase = new THREE.Mesh(hairBaseGeo, brownHairMat);
headBone.add(hairBase);

// Front Quiff / Swag Volume
const quiffGeo = new THREE.SphereGeometry(0.18, 14, 14);
quiffGeo.scale(1.3, 0.8, 1.1);
quiffGeo.translate(0, 0.42, 0.14);
const quiffMesh = new THREE.Mesh(quiffGeo, brownHairMat);
headBone.add(quiffMesh);

// Side Hair Left & Right
const sideHairGeo = new THREE.BoxGeometry(0.08, 0.22, 0.18);
const sideHairL = new THREE.Mesh(sideHairGeo, brownHairMat);
sideHairL.position.set(-0.27, 0.22, 0.02);
headBone.add(sideHairL);

const sideHairR = new THREE.Mesh(sideHairGeo.clone(), brownHairMat);
sideHairR.position.set(0.27, 0.22, 0.02);
headBone.add(sideHairR);

// Full Hipster Beard & Jaw contour
const beardJawGeo = new THREE.SphereGeometry(0.27, 16, 16);
beardJawGeo.scale(1.02, 0.75, 1.02);
beardJawGeo.translate(0, 0.02, 0.08);
const beardJawMesh = new THREE.Mesh(beardJawGeo, beardMat);
headBone.add(beardJawMesh);

// Prominent Neat Mustache
const stacheGeo = new THREE.CapsuleGeometry(0.042, 0.16, 8, 12);
stacheGeo.rotateZ(Math.PI / 2);
const stacheMesh = new THREE.Mesh(stacheGeo, beardMat);
stacheMesh.position.set(0, 0.09, 0.33);
stacheMesh.scale.set(1.15, 0.85, 1.0);
headBone.add(stacheMesh);

// Friendly Warm Open Smile with Teeth
const mouthGeo = new THREE.BoxGeometry(0.16, 0.07, 0.04);
const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
mouthMesh.position.set(0, 0.03, 0.32);
headBone.add(mouthMesh);

const teethGeo = new THREE.BoxGeometry(0.13, 0.035, 0.02);
const teethMesh = new THREE.Mesh(teethGeo, whiteTeethMat);
teethMesh.position.set(0, 0.05, 0.33);
headBone.add(teethMesh);

// Rounded Friendly Cartoon Nose
const noseGeo = new THREE.SphereGeometry(0.075, 14, 14);
noseGeo.scale(1.1, 1.0, 1.25);
const noseMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
const noseMesh = new THREE.Mesh(noseGeo, noseMat);
noseMesh.position.set(0, 0.15, 0.34);
headBone.add(noseMesh);

// Large Expressive Eyes
const eyeWhiteGeo = new THREE.SphereGeometry(0.075, 16, 16);
eyeWhiteGeo.scale(0.9, 1.1, 0.6);
const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 });

const pupilGeo = new THREE.SphereGeometry(0.040, 12, 12);
pupilGeo.scale(0.85, 1.0, 0.4);
const pupilMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.1 });

// Left Eye
const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
eyeL.position.set(-0.11, 0.24, 0.28);
const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
pupilL.position.set(-0.11, 0.24, 0.325);
headBone.add(eyeL);
headBone.add(pupilL);

// Right Eye
const eyeR = new THREE.Mesh(eyeWhiteGeo.clone(), eyeWhiteMat);
eyeR.position.set(0.11, 0.24, 0.28);
const pupilR = new THREE.Mesh(pupilGeo.clone(), pupilMat);
pupilR.position.set(0.11, 0.24, 0.325);
headBone.add(eyeR);
headBone.add(pupilR);

// Friendly Eyebrows
const browGeo = new THREE.BoxGeometry(0.12, 0.035, 0.04);
const browL = new THREE.Mesh(browGeo, brownHairMat);
browL.position.set(-0.12, 0.34, 0.29);
browL.rotation.z = -0.12;
headBone.add(browL);

const browR = new THREE.Mesh(browGeo.clone(), brownHairMat);
browR.position.set(0.12, 0.34, 0.29);
browR.rotation.z = 0.12;
headBone.add(browR);

// Modern Rounded Black Frame Glasses (Like in reference)
const glassRimGeo = new THREE.TorusGeometry(0.09, 0.016, 8, 24);
const glassRimL = new THREE.Mesh(glassRimGeo, blackGlassesMat);
glassRimL.position.set(-0.11, 0.24, 0.32);
headBone.add(glassRimL);

const glassRimR = new THREE.Mesh(glassRimGeo, blackGlassesMat);
glassRimR.position.set(0.11, 0.24, 0.32);
headBone.add(glassRimR);

const glassBridge = new THREE.BoxGeometry(0.06, 0.016, 0.02);
const bridgeMesh = new THREE.Mesh(glassBridge, blackGlassesMat);
bridgeMesh.position.set(0, 0.24, 0.33);
headBone.add(bridgeMesh);

// Add bone hierarchy to scene
rootGroup.add(rootBone);

// ============================================================
// NATURAL & EXPRESSIVE CARTOON ANIMATION CLIPS
// ============================================================
function makeRotTrack(boneName, times, eulers) {
  const values = [];
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (const [x, y, z] of eulers) {
    e.set(x, y, z);
    q.setFromEuler(e);
    values.push(q.x, q.y, q.z, q.w);
  }
  return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
}

// 1. Lively Idle Clip (Breathing chest, gentle weight shift, arm sway, soft head tilt)
const idleTracks = [
  new THREE.VectorKeyframeTrack("Spine.position", [0, 1.0, 2.0], [
    0, 0.95, 0,
    0, 0.98, 0,
    0, 0.95, 0
  ]),
  makeRotTrack("Arm_L", [0, 1.0, 2.0], [
    [0, 0, 0.08],
    [0.05, 0, 0.14],
    [0, 0, 0.08]
  ]),
  makeRotTrack("Arm_R", [0, 1.0, 2.0], [
    [0, 0, -0.08],
    [0.05, 0, -0.14],
    [0, 0, -0.08]
  ]),
  makeRotTrack("Head", [0, 0.7, 1.4, 2.0], [
    [0, 0, 0],
    [0.04, 0.05, 0.02],
    [-0.03, -0.04, -0.02],
    [0, 0, 0]
  ]),
  makeRotTrack("Spine", [0, 1.0, 2.0], [
    [0, 0, 0],
    [0.02, 0.02, 0],
    [0, 0, 0]
  ])
];
const idleClip = new THREE.AnimationClip("idle", 2.0, idleTracks);

// 2. Energetic Cartoon Walk Clip (Big strides, arm counter-swings, vertical bounce, spine twist)
const walkTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.25, 0.5, 0.75, 1.0], [
    0, 0, 0,
    0, 0.10, 0,
    0, 0, 0,
    0, 0.10, 0,
    0, 0, 0
  ]),
  makeRotTrack("Leg_L", [0, 0.25, 0.5, 0.75, 1.0], [
    [0.60, 0, 0],
    [0, 0, 0],
    [-0.55, 0, 0],
    [0, 0, 0],
    [0.60, 0, 0]
  ]),
  makeRotTrack("Leg_R", [0, 0.25, 0.5, 0.75, 1.0], [
    [-0.55, 0, 0],
    [0, 0, 0],
    [0.60, 0, 0],
    [0, 0, 0],
    [-0.55, 0, 0]
  ]),
  makeRotTrack("Arm_L", [0, 0.25, 0.5, 0.75, 1.0], [
    [-0.45, 0, 0.12],
    [0, 0, 0.08],
    [0.45, 0, 0.12],
    [0, 0, 0.08],
    [-0.45, 0, 0.12]
  ]),
  makeRotTrack("Arm_R", [0, 0.25, 0.5, 0.75, 1.0], [
    [0.45, 0, -0.12],
    [0, 0, -0.08],
    [-0.45, 0, -0.12],
    [0, 0, -0.08],
    [0.45, 0, -0.12]
  ]),
  makeRotTrack("Spine", [0, 0.25, 0.5, 0.75, 1.0], [
    [0.05, 0.06, -0.03],
    [0.02, 0, 0],
    [0.05, -0.06, 0.03],
    [0.02, 0, 0],
    [0.05, 0.06, -0.03]
  ]),
];
const walkClip = new THREE.AnimationClip("walk", 1.0, walkTracks);

// 3. Relaxed Sit Clip (Couch seating)
const sitTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1.0], [
    0, 0, 0,
    0, -0.22, -0.12,
    0, -0.45, -0.22
  ]),
  makeRotTrack("Leg_L", [0, 1.0], [
    [0, 0, 0],
    [1.50, 0, 0]
  ]),
  makeRotTrack("Leg_R", [0, 1.0], [
    [0, 0, 0],
    [1.50, 0, 0]
  ]),
  makeRotTrack("Spine", [0, 1.0], [
    [0, 0, 0],
    [-0.12, 0, 0]
  ]),
  makeRotTrack("Arm_L", [0, 1.0], [
    [0, 0, 0.08],
    [0.35, 0.2, 0.15]
  ]),
  makeRotTrack("Arm_R", [0, 1.0], [
    [0, 0, -0.08],
    [0.35, -0.2, -0.15]
  ]),
];
const sitClip = new THREE.AnimationClip("sit", 1.0, sitTracks);

// 4. Stand Clip
const standTracks = [
  new THREE.VectorKeyframeTrack("Root.position", [0, 0.5, 1.0], [
    0, -0.45, -0.22,
    0, -0.22, -0.12,
    0, 0, 0
  ]),
  makeRotTrack("Leg_L", [0, 1.0], [
    [1.50, 0, 0],
    [0, 0, 0]
  ]),
  makeRotTrack("Leg_R", [0, 1.0], [
    [1.50, 0, 0],
    [0, 0, 0]
  ]),
  makeRotTrack("Spine", [0, 1.0], [
    [-0.12, 0, 0],
    [0, 0, 0]
  ]),
  makeRotTrack("Arm_L", [0, 1.0], [
    [0.35, 0.2, 0.15],
    [0, 0, 0.08]
  ]),
  makeRotTrack("Arm_R", [0, 1.0], [
    [0.35, -0.2, -0.15],
    [0, 0, -0.08]
  ]),
];
const standClip = new THREE.AnimationClip("stand", 1.0, standTracks);

// 5. Expressive Talk Clip (Head nods, hand gestures)
const talkTracks = [
  makeRotTrack("Head", [0, 0.3, 0.6, 0.9, 1.2, 1.5], [
    [0, 0, 0],
    [0.15, 0.08, -0.04],
    [-0.08, -0.05, 0.02],
    [0.12, 0.02, 0.03],
    [-0.05, 0.07, -0.02],
    [0, 0, 0]
  ]),
  makeRotTrack("Arm_R", [0, 0.3, 0.7, 1.1, 1.5], [
    [0, 0, -0.08],
    [0.55, 0.20, -0.35],
    [0.35, 0.40, -0.20],
    [0.60, 0.15, -0.30],
    [0, 0, -0.08]
  ]),
  makeRotTrack("Arm_L", [0, 0.5, 1.0, 1.5], [
    [0, 0, 0.08],
    [0.20, -0.10, 0.20],
    [0.10, 0, 0.15],
    [0, 0, 0.08]
  ]),
  makeRotTrack("Spine", [0, 0.6, 1.5], [
    [0, 0, 0],
    [0.05, 0.04, 0],
    [0, 0, 0]
  ])
];
const talkClip = new THREE.AnimationClip("talk", 1.5, talkTracks);

// 6. Joyful Cartoon Laugh Clip (Belly bounce, head toss back, arm shaking)
const laughTracks = [
  new THREE.VectorKeyframeTrack("Spine.position", [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.87, 1.0], [
    0, 0.95, 0,
    0, 0.99, 0,
    0, 0.94, 0,
    0, 0.99, 0,
    0, 0.94, 0,
    0, 0.99, 0,
    0, 0.94, 0,
    0, 0.98, 0,
    0, 0.95, 0
  ]),
  makeRotTrack("Head", [0, 0.25, 0.5, 0.75, 1.0], [
    [0, 0, 0],
    [-0.30, 0.05, 0.03],
    [-0.15, -0.05, -0.02],
    [-0.28, 0.04, 0.02],
    [0, 0, 0]
  ]),
  makeRotTrack("Arm_L", [0, 0.25, 0.5, 0.75, 1.0], [
    [0, 0, 0.08],
    [0.35, 0, 0.30],
    [0.20, 0, 0.22],
    [0.35, 0, 0.30],
    [0, 0, 0.08]
  ]),
  makeRotTrack("Arm_R", [0, 0.25, 0.5, 0.75, 1.0], [
    [0, 0, -0.08],
    [0.35, 0, -0.30],
    [0.20, 0, -0.22],
    [0.35, 0, -0.30],
    [0, 0, -0.08]
  ]),
];
const laughClip = new THREE.AnimationClip("laugh", 1.0, laughTracks);

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
    console.log("Successfully generated reference-matched cartoon Dad at:", outFile, "Size:", gltf.byteLength, "bytes");
  },
  (err) => {
    console.error("Export error:", err);
  },
  {
    binary: true,
    animations: [idleClip, walkClip, sitClip, standClip, talkClip, laughClip],
  }
);
