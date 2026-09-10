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

function exportModel(scene, clips, outRelPath) {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (gltf) => {
      const outFile = path.resolve(outRelPath);
      const outDir = path.dirname(outFile);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFile, Buffer.from(gltf));
      console.log("Saved GLB:", outRelPath, "Size:", gltf.byteLength, "bytes");
    },
    (err) => console.error("Export error:", err),
    { binary: true, animations: clips }
  );
}

// ============================================================
// 1. GENERATE MOM (Mẹ - Áo len cam/vàng, tóc nâu dài bồng bềnh, quần xám ôm)
// ============================================================
function generateMom() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "CharacterRoot";

  const rootBone = new THREE.Bone();
  rootBone.name = "Root";
  rootBone.position.set(0, 0, 0);

  const spineBone = new THREE.Bone();
  spineBone.name = "Spine";
  spineBone.position.set(0, 0.88, 0);
  rootBone.add(spineBone);

  const headBone = new THREE.Bone();
  headBone.name = "Head";
  headBone.position.set(0, 0.68, 0);
  spineBone.add(headBone);

  const armLeft = new THREE.Bone();
  armLeft.name = "Arm_L";
  armLeft.position.set(-0.32, 0.38, 0);
  spineBone.add(armLeft);

  const armRight = new THREE.Bone();
  armRight.name = "Arm_R";
  armRight.position.set(0.32, 0.38, 0);
  spineBone.add(armRight);

  const legLeft = new THREE.Bone();
  legLeft.name = "Leg_L";
  legLeft.position.set(-0.13, 0, 0);
  spineBone.add(legLeft);

  const legRight = new THREE.Bone();
  legRight.name = "Leg_R";
  legRight.position.set(0.13, 0, 0);
  spineBone.add(legRight);

  // Materials
  const topMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }); // yellow-orange sweater
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 }); // slate leggings
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde2d2, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x542616, roughness: 0.85 }); // rich flowing brown hair
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });

  // Torso - Feminine slim waist and yellow/orange sweater
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.54, 16);
  torsoGeo.translate(0, 0.24, 0);
  const torsoMesh = new THREE.Mesh(torsoGeo, topMat);
  spineBone.add(torsoMesh);

  // Tunic/Sweater Flare at bottom
  const flareGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.16, 16);
  flareGeo.translate(0, -0.06, 0);
  const flareMesh = new THREE.Mesh(flareGeo, topMat);
  spineBone.add(flareMesh);

  // Shoulders
  const shoulderGeo = new THREE.SphereGeometry(0.11, 12, 12);
  const shoulderL = new THREE.Mesh(shoulderGeo, topMat);
  shoulderL.position.set(-0.30, 0.38, 0);
  spineBone.add(shoulderL);
  const shoulderR = new THREE.Mesh(shoulderGeo, topMat);
  shoulderR.position.set(0.30, 0.38, 0);
  spineBone.add(shoulderR);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.10, 0.12, 0.24, 14);
  neckGeo.translate(0, 0.55, 0);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  spineBone.add(neckMesh);

  // Legs & Shoes (Slim leggings)
  const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.82, 12);
  legGeo.translate(0, -0.42, 0);
  const shoeGeo = new THREE.BoxGeometry(0.15, 0.10, 0.28);
  shoeGeo.translate(0, -0.84, 0.05);

  const legL = new THREE.Mesh(legGeo, pantsMat);
  const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
  legLeft.add(legL);
  legLeft.add(shoeL);

  const legR = new THREE.Mesh(legGeo.clone(), pantsMat);
  const shoeR = new THREE.Mesh(shoeGeo.clone(), shoeMat);
  legRight.add(legR);
  legRight.add(shoeR);

  // Arms & Hands
  const armGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.52, 12);
  armGeo.translate(0, -0.24, 0);
  const handGeo = new THREE.SphereGeometry(0.075, 10, 10);
  handGeo.translate(0, -0.52, 0);

  const armL = new THREE.Mesh(armGeo, topMat);
  const handL = new THREE.Mesh(handGeo, skinMat);
  armLeft.add(armL);
  armLeft.add(handL);

  const armR = new THREE.Mesh(armGeo.clone(), topMat);
  const handR = new THREE.Mesh(handGeo.clone(), skinMat);
  armRight.add(armR);
  armRight.add(handR);

  // Head
  const headGeo = new THREE.SphereGeometry(0.24, 18, 18);
  headGeo.scale(1.0, 1.15, 1.0);
  headGeo.translate(0, 0.14, 0);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headBone.add(headMesh);

  // Long Flowing Hair (Back & Sides)
  const hairTopGeo = new THREE.SphereGeometry(0.27, 16, 16);
  hairTopGeo.scale(1.04, 0.9, 1.08);
  hairTopGeo.translate(0, 0.28, -0.02);
  const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
  headBone.add(hairTop);

  // Hair strands falling over shoulders
  const strandGeo = new THREE.CapsuleGeometry(0.08, 0.50, 6, 10);
  strandGeo.translate(0, -0.10, 0.06);
  const strandL = new THREE.Mesh(strandGeo, hairMat);
  strandL.position.set(-0.22, 0.12, 0.05);
  headBone.add(strandL);

  const strandR = new THREE.Mesh(strandGeo.clone(), hairMat);
  strandR.position.set(0.22, 0.12, 0.05);
  headBone.add(strandR);

  // Big joyful eyes
  const eyeWhiteGeo = new THREE.SphereGeometry(0.07, 14, 14);
  eyeWhiteGeo.scale(0.85, 1.1, 0.5);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b });
  const pupilGeo = new THREE.SphereGeometry(0.038, 10, 10);
  pupilGeo.scale(0.8, 1.0, 0.3);

  const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeMat);
  eyeL.position.set(-0.09, 0.21, 0.23);
  const pL = new THREE.Mesh(pupilGeo, pupilMat);
  pL.position.set(-0.09, 0.21, 0.27);
  headBone.add(eyeL);
  headBone.add(pL);

  const eyeR = new THREE.Mesh(eyeWhiteGeo.clone(), eyeMat);
  eyeR.position.set(0.09, 0.21, 0.23);
  const pR = new THREE.Mesh(pupilGeo.clone(), pupilMat);
  pR.position.set(0.09, 0.21, 0.27);
  headBone.add(eyeR);
  headBone.add(pR);

  // Rosy cheeks & nose
  const cheekMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
  const cheekGeo = new THREE.SphereGeometry(0.045, 10, 10);
  cheekGeo.scale(1.2, 0.7, 0.4);
  const cheekL = new THREE.Mesh(cheekGeo, cheekMat);
  cheekL.position.set(-0.14, 0.13, 0.22);
  const cheekR = new THREE.Mesh(cheekGeo.clone(), cheekMat);
  cheekR.position.set(0.14, 0.13, 0.22);
  headBone.add(cheekL);
  headBone.add(cheekR);

  const noseGeo = new THREE.SphereGeometry(0.045, 10, 10);
  const noseMesh = new THREE.Mesh(noseGeo, skinMat);
  noseMesh.position.set(0, 0.15, 0.27);
  headBone.add(noseMesh);

  // Warm wide smile
  const smileGeo = new THREE.TorusGeometry(0.07, 0.016, 6, 12, Math.PI);
  smileGeo.rotateX(Math.PI);
  const smileMat = new THREE.MeshStandardMaterial({ color: 0x9f1239 });
  const smileMesh = new THREE.Mesh(smileGeo, smileMat);
  smileMesh.position.set(0, 0.08, 0.25);
  headBone.add(smileMesh);

  rootGroup.add(rootBone);

  // Animations
  const idleTracks = [
    new THREE.VectorKeyframeTrack("Spine.position", [0, 1, 2], [0, 0.88, 0, 0, 0.89, 0, 0, 0.88, 0]),
    new THREE.QuaternionKeyframeTrack("Arm_L.quaternion", [0, 1, 2], [0, 0, 0.05, 0.99, 0, 0, 0.08, 0.99, 0, 0, 0.05, 0.99]),
    new THREE.QuaternionKeyframeTrack("Arm_R.quaternion", [0, 1, 2], [0, 0, -0.05, 0.99, 0, 0, -0.08, 0.99, 0, 0, -0.05, 0.99]),
    new THREE.QuaternionKeyframeTrack("Head.quaternion", [0, 1, 2], [0, 0, 0, 1, 0.02, 0, 0, 0.99, 0, 0, 0, 1])
  ];
  const idleClip = new THREE.AnimationClip("idle", 2, idleTracks);

  const walkTracks = [
    new THREE.VectorKeyframeTrack("Root.position", [0, 0.25, 0.5, 0.75, 1], [0, 0, 0, 0, 0.06, 0, 0, 0, 0, 0, 0.06, 0, 0, 0, 0]),
    new THREE.QuaternionKeyframeTrack("Leg_L.quaternion", [0, 0.25, 0.5, 0.75, 1], [0.28, 0, 0, 0.96, 0, 0, 0, 1, -0.28, 0, 0, 0.96, 0, 0, 0, 1, 0.28, 0, 0, 0.96]),
    new THREE.QuaternionKeyframeTrack("Leg_R.quaternion", [0, 0.25, 0.5, 0.75, 1], [-0.28, 0, 0, 0.96, 0, 0, 0, 1, 0.28, 0, 0, 0.96, 0, 0, 0, 1, -0.28, 0, 0, 0.96]),
    new THREE.QuaternionKeyframeTrack("Arm_L.quaternion", [0, 0.25, 0.5, 0.75, 1], [-0.22, 0, 0.05, 0.97, 0, 0, 0.05, 0.99, 0.22, 0, 0.05, 0.97, 0, 0, 0.05, 0.99, -0.22, 0, 0.05, 0.97]),
    new THREE.QuaternionKeyframeTrack("Arm_R.quaternion", [0, 0.25, 0.5, 0.75, 1], [0.22, 0, -0.05, 0.97, 0, 0, -0.05, 0.99, -0.22, 0, -0.05, 0.97, 0, 0, -0.05, 0.99, 0.22, 0, -0.05, 0.97])
  ];
  const walkClip = new THREE.AnimationClip("walk", 1, walkTracks);

  const scene = new THREE.Scene();
  scene.add(rootGroup);
  exportModel(scene, [idleClip, walkClip], "public/assets/characters/mom/mom.glb");
}

// ============================================================
// 2. GENERATE SON (Con trai lớn - Áo thun xanh olive, quần jean, tinh nghịch)
// ============================================================
function generateSon() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "CharacterRoot";

  const rootBone = new THREE.Bone();
  rootBone.name = "Root";
  rootBone.position.set(0, 0, 0);

  const spineBone = new THREE.Bone();
  spineBone.name = "Spine";
  spineBone.position.set(0, 0.55, 0); // Child proportion
  rootBone.add(spineBone);

  const headBone = new THREE.Bone();
  headBone.name = "Head";
  headBone.position.set(0, 0.44, 0);
  spineBone.add(headBone);

  const armLeft = new THREE.Bone();
  armLeft.name = "Arm_L";
  armLeft.position.set(-0.24, 0.26, 0);
  spineBone.add(armLeft);

  const armRight = new THREE.Bone();
  armRight.name = "Arm_R";
  armRight.position.set(0.24, 0.26, 0);
  spineBone.add(armRight);

  const legLeft = new THREE.Bone();
  legLeft.name = "Leg_L";
  legLeft.position.set(-0.11, 0, 0);
  spineBone.add(legLeft);

  const legRight = new THREE.Bone();
  legRight.name = "Leg_R";
  legRight.position.set(0.11, 0, 0);
  spineBone.add(legRight);

  // Materials
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.6 }); // cute olive green t-shirt
  const jeansMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.7 }); // blue jeans
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde2d2, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }); // brown sneakers

  // Torso
  const torsoGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.36, 14);
  torsoGeo.translate(0, 0.18, 0);
  const torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
  spineBone.add(torsoMesh);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.14, 12);
  neckGeo.translate(0, 0.38, 0);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  spineBone.add(neckMesh);

  // Legs & Shoes
  const legGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.50, 12);
  legGeo.translate(0, -0.25, 0);
  const shoeGeo = new THREE.BoxGeometry(0.14, 0.09, 0.24);
  shoeGeo.translate(0, -0.52, 0.04);

  const legL = new THREE.Mesh(legGeo, jeansMat);
  const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
  legLeft.add(legL);
  legLeft.add(shoeL);

  const legR = new THREE.Mesh(legGeo.clone(), jeansMat);
  const shoeR = new THREE.Mesh(shoeGeo.clone(), shoeMat);
  legRight.add(legR);
  legRight.add(shoeR);

  // Arms & Hands
  const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.36, 12);
  armGeo.translate(0, -0.16, 0);
  const handGeo = new THREE.SphereGeometry(0.065, 10, 10);
  handGeo.translate(0, -0.36, 0);

  const armL = new THREE.Mesh(armGeo, shirtMat);
  const handL = new THREE.Mesh(handGeo, skinMat);
  armLeft.add(armL);
  armLeft.add(handL);

  const armR = new THREE.Mesh(armGeo.clone(), shirtMat);
  const handR = new THREE.Mesh(handGeo.clone(), skinMat);
  armRight.add(armR);
  armRight.add(handR);

  // Big cute toddler head (Chibi proportions)
  const headGeo = new THREE.SphereGeometry(0.23, 16, 16);
  headGeo.scale(1.05, 1.08, 1.02);
  headGeo.translate(0, 0.12, 0);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headBone.add(headMesh);

  // Messy boy haircut
  const hairGeo = new THREE.SphereGeometry(0.245, 16, 16);
  hairGeo.scale(1.04, 0.8, 1.05);
  hairGeo.translate(0, 0.24, -0.01);
  const hairMesh = new THREE.Mesh(hairGeo, hairMat);
  headBone.add(hairMesh);

  // Big happy eyes
  const eyeWhiteGeo = new THREE.SphereGeometry(0.065, 12, 12);
  eyeWhiteGeo.scale(0.85, 1.1, 0.4);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x1c1917 });
  const pupilGeo = new THREE.SphereGeometry(0.038, 10, 10);
  pupilGeo.scale(0.8, 1.0, 0.3);

  const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeMat);
  eyeL.position.set(-0.08, 0.16, 0.22);
  const pL = new THREE.Mesh(pupilGeo, pupilMat);
  pL.position.set(-0.08, 0.16, 0.25);
  headBone.add(eyeL);
  headBone.add(pL);

  const eyeR = new THREE.Mesh(eyeWhiteGeo.clone(), eyeMat);
  eyeR.position.set(0.08, 0.16, 0.22);
  const pR = new THREE.Mesh(pupilGeo.clone(), pupilMat);
  pR.position.set(0.08, 0.16, 0.25);
  headBone.add(eyeR);
  headBone.add(pR);

  // Happy open smile
  const smileGeo = new THREE.TorusGeometry(0.06, 0.014, 6, 12, Math.PI);
  smileGeo.rotateX(Math.PI);
  const smileMesh = new THREE.Mesh(smileGeo, new THREE.MeshStandardMaterial({ color: 0x881337 }));
  smileMesh.position.set(0, 0.06, 0.23);
  headBone.add(smileMesh);

  rootGroup.add(rootBone);

  const idleTracks = [
    new THREE.VectorKeyframeTrack("Spine.position", [0, 1, 2], [0, 0.55, 0, 0, 0.56, 0, 0, 0.55, 0]),
    new THREE.QuaternionKeyframeTrack("Arm_L.quaternion", [0, 1, 2], [0, 0, 0.1, 0.99, 0, 0, 0.15, 0.99, 0, 0, 0.1, 0.99]),
    new THREE.QuaternionKeyframeTrack("Arm_R.quaternion", [0, 1, 2], [0, 0, -0.1, 0.99, 0, 0, -0.15, 0.99, 0, 0, -0.1, 0.99]),
    new THREE.QuaternionKeyframeTrack("Head.quaternion", [0, 1, 2], [0, 0, 0, 1, 0.04, 0, 0, 0.99, 0, 0, 0, 1])
  ];
  const idleClip = new THREE.AnimationClip("idle", 2, idleTracks);

  const scene = new THREE.Scene();
  scene.add(rootGroup);
  exportModel(scene, [idleClip], "public/assets/characters/son/son.glb");
}

// ============================================================
// 3. GENERATE DAUGHTER / TODDLER (Bé gái / em bé út đáng yêu)
// ============================================================
function generateDaughter() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "CharacterRoot";

  const rootBone = new THREE.Bone();
  rootBone.name = "Root";
  rootBone.position.set(0, 0, 0);

  const spineBone = new THREE.Bone();
  spineBone.name = "Spine";
  spineBone.position.set(0, 0.45, 0); // Cute small baby/toddler scale
  rootBone.add(spineBone);

  const headBone = new THREE.Bone();
  headBone.name = "Head";
  headBone.position.set(0, 0.38, 0);
  spineBone.add(headBone);

  const armLeft = new THREE.Bone();
  armLeft.name = "Arm_L";
  armLeft.position.set(-0.20, 0.22, 0);
  spineBone.add(armLeft);

  const armRight = new THREE.Bone();
  armRight.name = "Arm_R";
  armRight.position.set(0.20, 0.22, 0);
  spineBone.add(armRight);

  const legLeft = new THREE.Bone();
  legLeft.name = "Leg_L";
  legLeft.position.set(-0.09, 0, 0);
  spineBone.add(legLeft);

  const legRight = new THREE.Bone();
  legRight.name = "Leg_R";
  legRight.position.set(0.09, 0, 0);
  spineBone.add(legRight);

  // Materials
  const dressMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6 }); // soft baby blue romper
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde2d2, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x542616, roughness: 0.85 }); // dark soft baby hair

  // Torso / Romper
  const bodyGeo = new THREE.SphereGeometry(0.18, 14, 14);
  bodyGeo.scale(1.0, 1.1, 0.95);
  bodyGeo.translate(0, 0.12, 0);
  const bodyMesh = new THREE.Mesh(bodyGeo, dressMat);
  spineBone.add(bodyMesh);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12);
  neckGeo.translate(0, 0.30, 0);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  spineBone.add(neckMesh);

  // Tiny toddler legs & baby shoes
  const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.40, 10);
  legGeo.translate(0, -0.20, 0);
  const shoeGeo = new THREE.BoxGeometry(0.11, 0.08, 0.18);
  shoeGeo.translate(0, -0.42, 0.03);

  const legL = new THREE.Mesh(legGeo, skinMat);
  const shoeL = new THREE.Mesh(shoeGeo, dressMat);
  legLeft.add(legL);
  legLeft.add(shoeL);

  const legR = new THREE.Mesh(legGeo.clone(), skinMat);
  const shoeR = new THREE.Mesh(shoeGeo.clone(), dressMat);
  legRight.add(legR);
  legRight.add(shoeR);

  // Baby Arms
  const armGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.28, 10);
  armGeo.translate(0, -0.12, 0);
  const handGeo = new THREE.SphereGeometry(0.055, 8, 8);
  handGeo.translate(0, -0.28, 0);

  const armL = new THREE.Mesh(armGeo, dressMat);
  const handL = new THREE.Mesh(handGeo, skinMat);
  armLeft.add(armL);
  armLeft.add(handL);

  const armR = new THREE.Mesh(armGeo.clone(), dressMat);
  const handR = new THREE.Mesh(handGeo.clone(), skinMat);
  armRight.add(armR);
  armRight.add(handR);

  // Big cute baby head
  const headGeo = new THREE.SphereGeometry(0.21, 16, 16);
  headGeo.scale(1.06, 1.05, 1.02);
  headGeo.translate(0, 0.10, 0);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headBone.add(headMesh);

  // Cute short toddler hair
  const hairGeo = new THREE.SphereGeometry(0.225, 14, 14);
  hairGeo.scale(1.04, 0.75, 1.05);
  hairGeo.translate(0, 0.18, -0.01);
  const hairMesh = new THREE.Mesh(hairGeo, hairMat);
  headBone.add(hairMesh);

  // Laughing arched eyes (Happy squint)
  const eyeArchGeo = new THREE.TorusGeometry(0.045, 0.012, 6, 10, Math.PI);
  const eyeArchMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b });
  const eyeL = new THREE.Mesh(eyeArchGeo, eyeArchMat);
  eyeL.position.set(-0.07, 0.12, 0.20);
  const eyeR = new THREE.Mesh(eyeArchGeo.clone(), eyeArchMat);
  eyeR.position.set(0.07, 0.12, 0.20);
  headBone.add(eyeL);
  headBone.add(eyeR);

  // Big open giggle mouth
  const mouthGeo = new THREE.SphereGeometry(0.05, 10, 10);
  mouthGeo.scale(1.1, 0.7, 0.4);
  const mouthMesh = new THREE.Mesh(mouthGeo, new THREE.MeshStandardMaterial({ color: 0x9f1239 }));
  mouthMesh.position.set(0, 0.04, 0.21);
  headBone.add(mouthMesh);

  rootGroup.add(rootBone);

  const idleTracks = [
    new THREE.VectorKeyframeTrack("Spine.position", [0, 1, 2], [0, 0.45, 0, 0, 0.46, 0, 0, 0.45, 0]),
    new THREE.QuaternionKeyframeTrack("Arm_L.quaternion", [0, 1, 2], [0, 0, 0.2, 0.98, 0, 0, 0.25, 0.97, 0, 0, 0.2, 0.98]),
    new THREE.QuaternionKeyframeTrack("Arm_R.quaternion", [0, 1, 2], [0, 0, -0.2, 0.98, 0, 0, -0.25, 0.97, 0, 0, -0.2, 0.98]),
    new THREE.QuaternionKeyframeTrack("Head.quaternion", [0, 1, 2], [0, 0, 0, 1, 0.05, 0, 0, 0.99, 0, 0, 0, 1])
  ];
  const idleClip = new THREE.AnimationClip("idle", 2, idleTracks);

  const scene = new THREE.Scene();
  scene.add(rootGroup);
  exportModel(scene, [idleClip], "public/assets/characters/daughter/daughter.glb");
}

console.log("Generating Mom, Son, and Daughter GLB models...");
generateMom();
generateSon();
generateDaughter();
