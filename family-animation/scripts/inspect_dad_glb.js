import fs from "fs";
import path from "path";

const glbPath = path.resolve("public/assets/characters/dad/dad.glb");
const data = fs.readFileSync(glbPath);

// Parse GLB Header
const magic = data.readUInt32LE(0);
const version = data.readUInt32LE(4);
const length = data.readUInt32LE(8);

console.log("=== GLB ASSET INSPECTION REPORT ===");
console.log("File:", glbPath);
console.log("Magic:", magic.toString(16) === "46546c67" ? "glTF (valid)" : "invalid");
console.log("Version:", version);
console.log("Total Size:", length, "bytes");

// Chunk 0 is JSON
const chunk0Length = data.readUInt32LE(12);
const chunk0Type = data.readUInt32LE(16);
const jsonString = data.toString("utf8", 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonString);

console.log("\nNodes in Hierarchy:", gltf.nodes?.length ?? 0);
gltf.nodes?.forEach((node, i) => {
  console.log(`  [Node ${i}] ${node.name || "unnamed"} (children: ${node.children?.length ?? 0})`);
});

console.log("\nSkins / Skeletons:", gltf.skins?.length ?? 0);
gltf.skins?.forEach((skin, i) => {
  console.log(`  [Skin ${i}] ${skin.name || "unnamed"} (joints: ${skin.joints?.length ?? 0})`);
});

console.log("\nMeshes:", gltf.meshes?.length ?? 0);
gltf.meshes?.forEach((mesh, i) => {
  console.log(`  [Mesh ${i}] ${mesh.name || "unnamed"}`);
});

console.log("\nAnimation Clips:", gltf.animations?.length ?? 0);
gltf.animations?.forEach((anim, i) => {
  console.log(`  [Clip ${i}] ${anim.name || "unnamed"} (channels: ${anim.channels?.length ?? 0})`);
});
