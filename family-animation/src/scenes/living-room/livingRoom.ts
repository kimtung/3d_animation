import type { SceneConfig } from "@engine/scene/SceneObject.ts";

export const livingRoomConfig: SceneConfig = {
  id: "living_room",
  name: "Family Living Room",
  objects: [
    // ============================================================
    // 1. FLOOR & ARCHITECTURE
    // ============================================================
    // Warm Oak Parquet Floor
    {
      id: "floor",
      type: "primitive",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      primitive: {
        geometry: "plane",
        width: 16,
        height: 16,
        color: "#6b4226", // rich warm oak wood
        roughness: 0.45,
        metalness: 0.05,
      },
      receiveShadow: true,
    },
    // Back Accent Wall (Modern slate teal-blue)
    {
      id: "wall_back",
      type: "compound",
      position: { x: 0, y: 2.5, z: -5.0 },
      primitive: {
        geometry: "box",
        width: 16,
        height: 5.0,
        depth: 0.2,
        color: "#273849", // stylish modern blue-grey wall
        roughness: 0.85,
      },
      receiveShadow: true,
      children: [
        // Crisp white baseboard molding
        {
          id: "baseboard_back",
          type: "primitive",
          position: { x: 0, y: -2.35, z: 0.12 },
          primitive: {
            geometry: "box",
            width: 16,
            height: 0.3,
            depth: 0.05,
            color: "#f8fafc",
            roughness: 0.3,
          },
        },
      ],
    },
    // Left Wall (Soft cream off-white with doorway cutout)
    {
      id: "wall_left",
      type: "compound",
      position: { x: -6.0, y: 2.5, z: 0 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      primitive: {
        geometry: "box",
        width: 14,
        height: 5.0,
        depth: 0.2,
        color: "#f1f5f9",
        roughness: 0.8,
      },
      receiveShadow: true,
      children: [
        {
          id: "baseboard_left",
          type: "primitive",
          position: { x: 0, y: -2.35, z: 0.12 },
          primitive: {
            geometry: "box",
            width: 14,
            height: 0.3,
            depth: 0.05,
            color: "#e2e8f0",
            roughness: 0.3,
          },
        },
      ],
    },
    // Right Wall with Window (Soft sunlight)
    {
      id: "wall_right",
      type: "compound",
      position: { x: 6.0, y: 2.5, z: 0 },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
      primitive: {
        geometry: "box",
        width: 14,
        height: 5.0,
        depth: 0.2,
        color: "#f8fafc",
        roughness: 0.8,
      },
      receiveShadow: true,
      children: [
        // Large bright window frame
        {
          id: "window_frame",
          type: "primitive",
          position: { x: -0.5, y: 0.4, z: 0.12 },
          primitive: {
            geometry: "box",
            width: 2.4,
            height: 2.6,
            depth: 0.08,
            color: "#ffffff",
            roughness: 0.3,
          },
        },
        // Bright sky glass with daylight glow
        {
          id: "window_glass",
          type: "primitive",
          position: { x: -0.5, y: 0.4, z: 0.15 },
          primitive: {
            geometry: "box",
            width: 2.1,
            height: 2.3,
            depth: 0.02,
            color: "#bae6fd",
            emissive: "#7dd3fc",
            emissiveIntensity: 0.4,
            roughness: 0.1,
          },
        },
        // Window curtain rod
        {
          id: "curtain_rod",
          type: "primitive",
          position: { x: -0.5, y: 1.85, z: 0.25 },
          primitive: {
            geometry: "cylinder",
            radius: 0.03,
            height: 3.2,
            color: "#d97706",
            metalness: 0.8,
            roughness: 0.2,
          },
          rotation: { x: 0, y: 0, z: Math.PI / 2 },
        },
      ],
    },

    // ============================================================
    // 2. ENTRANCE DOORWAY (Where Mom & Dad enter)
    // ============================================================
    {
      id: "door_entrance",
      type: "compound",
      position: { x: -4.5, y: 1.6, z: -2.0 },
      primitive: {
        geometry: "box",
        width: 1.3,
        height: 3.2,
        depth: 0.08,
        color: "#334155", // modern charcoal door frame
      },
      children: [
        // Door panel
        {
          id: "door_panel",
          type: "primitive",
          position: { x: 0, y: 0, z: 0.02 },
          primitive: {
            geometry: "box",
            width: 1.15,
            height: 3.0,
            depth: 0.06,
            color: "#475569",
            roughness: 0.5,
          },
        },
        // Polished golden brass handle
        {
          id: "door_handle",
          type: "primitive",
          position: { x: 0.42, y: -0.2, z: 0.08 },
          primitive: {
            geometry: "cylinder",
            radius: 0.025,
            height: 0.18,
            color: "#fbbf24",
            metalness: 0.9,
            roughness: 0.15,
          },
        },
        // Welcome doormat
        {
          id: "doormat",
          type: "primitive",
          position: { x: 0, y: -1.58, z: 0.4 },
          primitive: {
            geometry: "box",
            width: 1.1,
            height: 0.02,
            depth: 0.6,
            color: "#b45309",
            roughness: 0.9,
          },
        },
      ],
    },

    // ============================================================
    // 3. COZY STYLIZED SOFA (With Cushions, Pillows & Legs)
    // ============================================================
    {
      id: "sofa",
      type: "compound",
      position: { x: 2.5, y: 0.35, z: 0.8 },
      castShadow: true,
      receiveShadow: true,
      seatAnchor: {
        entryPosition: { x: 2.1, y: 0, z: 0.0 }, // Stand in front of sofa facing room
        seatPosition: { x: 2.5, y: 0.0, z: 0.8 },  // Exact sit location
        seatRotationY: -Math.PI / 2, // Sit facing West toward TV (-X)
      },
      primitive: {
        // Sofa base frame
        geometry: "box",
        width: 1.7,
        height: 0.32,
        depth: 1.1,
        color: "#ca8a04", // warm mustard yellow fabric
        roughness: 0.7,
      },
      children: [
        // High cozy backrest
        {
          id: "sofa_backrest",
          type: "primitive",
          position: { x: 0.68, y: 0.42, z: 0 },
          primitive: {
            geometry: "box",
            width: 0.32,
            height: 0.75,
            depth: 1.1,
            color: "#d97706",
            roughness: 0.7,
          },
          castShadow: true,
        },
        // Left Armrest
        {
          id: "sofa_arm_left",
          type: "primitive",
          position: { x: 0.05, y: 0.28, z: -0.58 },
          primitive: {
            geometry: "box",
            width: 1.4,
            height: 0.45,
            depth: 0.22,
            color: "#b45309",
            roughness: 0.75,
          },
          castShadow: true,
        },
        // Right Armrest
        {
          id: "sofa_arm_right",
          type: "primitive",
          position: { x: 0.05, y: 0.28, z: 0.58 },
          primitive: {
            geometry: "box",
            width: 1.4,
            height: 0.45,
            depth: 0.22,
            color: "#b45309",
            roughness: 0.75,
          },
          castShadow: true,
        },
        // Soft Plush Seat Cushion 1
        {
          id: "sofa_cushion_1",
          type: "primitive",
          position: { x: 0.05, y: 0.18, z: -0.26 },
          primitive: {
            geometry: "box",
            width: 0.95,
            height: 0.16,
            depth: 0.48,
            color: "#eab308",
            roughness: 0.65,
          },
        },
        // Soft Plush Seat Cushion 2
        {
          id: "sofa_cushion_2",
          type: "primitive",
          position: { x: 0.05, y: 0.18, z: 0.26 },
          primitive: {
            geometry: "box",
            width: 0.95,
            height: 0.16,
            depth: 0.48,
            color: "#eab308",
            roughness: 0.65,
          },
        },
        // Decorative Throw Pillow (Turquoise Blue)
        {
          id: "pillow_blue",
          type: "primitive",
          position: { x: 0.42, y: 0.36, z: -0.38 },
          rotation: { x: 0.2, y: 0.4, z: -0.2 },
          primitive: {
            geometry: "box",
            width: 0.28,
            height: 0.28,
            depth: 0.12,
            color: "#0284c7",
            roughness: 0.6,
          },
        },
        // Decorative Throw Pillow (Cream Peach)
        {
          id: "pillow_peach",
          type: "primitive",
          position: { x: 0.42, y: 0.36, z: 0.38 },
          rotation: { x: -0.2, y: -0.4, z: -0.2 },
          primitive: {
            geometry: "box",
            width: 0.28,
            height: 0.28,
            depth: 0.12,
            color: "#fed7aa",
            roughness: 0.6,
          },
        },
        // 4 Wooden Sofa Legs
        {
          id: "sofa_leg_1",
          type: "primitive",
          position: { x: -0.65, y: -0.24, z: -0.45 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.04,
            radiusBottom: 0.025,
            height: 0.18,
            color: "#78350f",
          },
        },
        {
          id: "sofa_leg_2",
          type: "primitive",
          position: { x: 0.65, y: -0.24, z: -0.45 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.04,
            radiusBottom: 0.025,
            height: 0.18,
            color: "#78350f",
          },
        },
        {
          id: "sofa_leg_3",
          type: "primitive",
          position: { x: -0.65, y: -0.24, z: 0.45 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.04,
            radiusBottom: 0.025,
            height: 0.18,
            color: "#78350f",
          },
        },
        {
          id: "sofa_leg_4",
          type: "primitive",
          position: { x: 0.65, y: -0.24, z: 0.45 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.04,
            radiusBottom: 0.025,
            height: 0.18,
            color: "#78350f",
          },
        },
      ],
    },

    // ============================================================
    // 4. SMART TV & HOME THEATER CONSOLE
    // ============================================================
    {
      id: "tv",
      type: "compound",
      position: { x: 0, y: 2.0, z: -4.8 },
      castShadow: true,
      primitive: {
        // Slim dark titanium TV bezel
        geometry: "box",
        width: 2.4,
        height: 1.4,
        depth: 0.08,
        color: "#0f172a",
        metalness: 0.8,
        roughness: 0.25,
      },
      children: [
        // Bright Vibrant Glowing TV Screen (Football broadcast / Cartoon movie)
        {
          id: "tv_screen",
          type: "primitive",
          position: { x: 0, y: 0, z: 0.045 },
          primitive: {
            geometry: "box",
            width: 2.3,
            height: 1.3,
            depth: 0.01,
            color: "#0284c7",
            emissive: "#0284c7",
            emissiveIntensity: 0.65,
            roughness: 0.1,
          },
        },
        // Power LED indicator
        {
          id: "tv_led",
          type: "primitive",
          position: { x: 1.05, y: -0.64, z: 0.05 },
          primitive: {
            geometry: "sphere",
            radius: 0.015,
            color: "#22c55e",
            emissive: "#22c55e",
            emissiveIntensity: 2.0,
          },
        },
        // Wall Mount Bracket
        {
          id: "tv_mount",
          type: "primitive",
          position: { x: 0, y: 0, z: -0.06 },
          primitive: {
            geometry: "box",
            width: 0.6,
            height: 0.6,
            depth: 0.06,
            color: "#1e293b",
          },
        },
      ],
    },

    // TV Media Console / Scandinavian Oak Credenza
    {
      id: "tv_stand",
      type: "compound",
      position: { x: 0, y: 0.45, z: -4.4 },
      castShadow: true,
      receiveShadow: true,
      primitive: {
        // Main wooden body
        geometry: "box",
        width: 3.0,
        height: 0.65,
        depth: 0.65,
        color: "#78350f", // warm walnut/oak wood
        roughness: 0.6,
      },
      children: [
        // Center Media shelf cavity
        {
          id: "console_center",
          type: "primitive",
          position: { x: 0, y: 0, z: 0.05 },
          primitive: {
            geometry: "box",
            width: 1.1,
            height: 0.45,
            depth: 0.58,
            color: "#1e1e1e",
          },
        },
        // Game console / Blu-ray player in center shelf
        {
          id: "game_console",
          type: "primitive",
          position: { x: 0, y: -0.12, z: 0.1 },
          primitive: {
            geometry: "box",
            width: 0.5,
            height: 0.08,
            depth: 0.35,
            color: "#0f172a",
            metalness: 0.5,
            roughness: 0.3,
          },
        },
        // Sleek Soundbar on top of console
        {
          id: "soundbar",
          type: "primitive",
          position: { x: 0, y: 0.36, z: 0.05 },
          primitive: {
            geometry: "box",
            width: 1.8,
            height: 0.09,
            depth: 0.14,
            color: "#1e293b",
            roughness: 0.4,
          },
        },
        // Decorative Ceramic Vase with dried plant
        {
          id: "decor_vase",
          type: "primitive",
          position: { x: -1.2, y: 0.46, z: 0 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.06,
            radiusBottom: 0.10,
            height: 0.26,
            color: "#f472b6",
            roughness: 0.4,
          },
        },
        // 4 Angled Wooden Legs
        {
          id: "console_leg_1",
          type: "primitive",
          position: { x: -1.3, y: -0.4, z: -0.22 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.22,
            color: "#451a03",
          },
        },
        {
          id: "console_leg_2",
          type: "primitive",
          position: { x: 1.3, y: -0.4, z: -0.22 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.22,
            color: "#451a03",
          },
        },
        {
          id: "console_leg_3",
          type: "primitive",
          position: { x: -1.3, y: -0.4, z: 0.22 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.22,
            color: "#451a03",
          },
        },
        {
          id: "console_leg_4",
          type: "primitive",
          position: { x: 1.3, y: -0.4, z: 0.22 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.22,
            color: "#451a03",
          },
        },
      ],
    },

    // ============================================================
    // 5. MID-CENTURY COFFEE TABLE (With Mugs & TV Remote)
    // ============================================================
    {
      id: "coffee_table",
      type: "compound",
      position: { x: 1.3, y: 0.28, z: -0.6 },
      castShadow: true,
      receiveShadow: true,
      primitive: {
        // Tabletop (Beveled round-edged oak)
        geometry: "box",
        width: 1.3,
        height: 0.06,
        depth: 0.75,
        color: "#92400e",
        roughness: 0.5,
      },
      children: [
        // 4 Flared Wooden Legs
        {
          id: "table_leg_1",
          type: "primitive",
          position: { x: -0.52, y: -0.16, z: -0.28 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.32,
            color: "#78350f",
          },
          rotation: { x: 0.1, y: 0, z: -0.1 },
        },
        {
          id: "table_leg_2",
          type: "primitive",
          position: { x: 0.52, y: -0.16, z: -0.28 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.32,
            color: "#78350f",
          },
          rotation: { x: 0.1, y: 0, z: 0.1 },
        },
        {
          id: "table_leg_3",
          type: "primitive",
          position: { x: -0.52, y: -0.16, z: 0.28 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.32,
            color: "#78350f",
          },
          rotation: { x: -0.1, y: 0, z: -0.1 },
        },
        {
          id: "table_leg_4",
          type: "primitive",
          position: { x: 0.52, y: -0.16, z: 0.28 },
          primitive: {
            geometry: "cylinder",
            radiusTop: 0.035,
            radiusBottom: 0.02,
            height: 0.32,
            color: "#78350f",
          },
          rotation: { x: -0.1, y: 0, z: 0.1 },
        },
        // Dad's Coffee Mug (Warm Mustard Yellow)
        {
          id: "mug_dad",
          type: "primitive",
          position: { x: -0.25, y: 0.09, z: 0.12 },
          primitive: {
            geometry: "cylinder",
            radius: 0.05,
            height: 0.11,
            color: "#f59e0b",
            roughness: 0.3,
          },
        },
        // Mom's Tea Mug (Pastel Sky Blue)
        {
          id: "mug_mom",
          type: "primitive",
          position: { x: -0.12, y: 0.09, z: 0.14 },
          primitive: {
            geometry: "cylinder",
            radius: 0.045,
            height: 0.10,
            color: "#38bdf8",
            roughness: 0.3,
          },
        },
        // TV Remote Control
        {
          id: "tv_remote",
          type: "primitive",
          position: { x: 0.25, y: 0.04, z: -0.05 },
          rotation: { x: 0, y: 0.35, z: 0 },
          primitive: {
            geometry: "box",
            width: 0.18,
            height: 0.02,
            depth: 0.06,
            color: "#0f172a",
            roughness: 0.4,
          },
        },
      ],
    },

    // ============================================================
    // 6. MODERN ARC FLOOR LAMP (With Warm Glow)
    // ============================================================
    {
      id: "lamp",
      type: "compound",
      position: { x: -3.2, y: 1.5, z: 1.8 },
      castShadow: true,
      primitive: {
        // Weighted Marble Base
        geometry: "cylinder",
        radius: 0.32,
        height: 0.08,
        color: "#e2e8f0",
        roughness: 0.2,
      },
      children: [
        // Golden brass vertical pole
        {
          id: "lamp_pole",
          type: "primitive",
          position: { x: 0, y: 1.1, z: 0 },
          primitive: {
            geometry: "cylinder",
            radius: 0.03,
            height: 2.2,
            color: "#d97706",
            metalness: 0.85,
            roughness: 0.2,
          },
        },
        // Arced cantilever neck
        {
          id: "lamp_neck",
          type: "primitive",
          position: { x: 0.25, y: 2.15, z: -0.2 },
          rotation: { x: 0.3, y: 0, z: -0.4 },
          primitive: {
            geometry: "cylinder",
            radius: 0.025,
            height: 0.7,
            color: "#d97706",
            metalness: 0.85,
            roughness: 0.2,
          },
        },
        // Warm Cozy Glowing Lampshade
        {
          id: "lamp_shade",
          type: "primitive",
          position: { x: 0.45, y: 1.95, z: -0.35 },
          primitive: {
            geometry: "cone",
            radius: 0.26,
            height: 0.32,
            color: "#fef3c7",
            emissive: "#fbbf24",
            emissiveIntensity: 0.9,
            roughness: 0.5,
          },
        },
      ],
    },

    // ============================================================
    // 7. COZY SCANDINAVIAN AREA RUG
    // ============================================================
    {
      id: "rug",
      type: "primitive",
      position: { x: 1.5, y: 0.015, z: 0.1 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      primitive: {
        geometry: "plane",
        width: 4.8,
        height: 3.8,
        color: "#f1f5f9", // soft cream wool rug
        roughness: 0.9,
      },
      receiveShadow: true,
    },

    // ============================================================
    // 8. INDOOR HOUSEPLANT (Fiddle Leaf Fig in Ceramic Stand)
    // ============================================================
    {
      id: "plant",
      type: "compound",
      position: { x: 4.5, y: 0.55, z: -3.8 },
      castShadow: true,
      primitive: {
        // Ceramic Pot
        geometry: "cylinder",
        radiusTop: 0.24,
        radiusBottom: 0.18,
        height: 0.45,
        color: "#ffffff",
        roughness: 0.2,
      },
      children: [
        // Wooden tripod stand
        {
          id: "pot_stand",
          type: "primitive",
          position: { x: 0, y: -0.32, z: 0 },
          primitive: {
            geometry: "cylinder",
            radius: 0.26,
            height: 0.22,
            color: "#78350f",
          },
        },
        // Plant Soil
        {
          id: "plant_soil",
          type: "primitive",
          position: { x: 0, y: 0.21, z: 0 },
          primitive: {
            geometry: "cylinder",
            radius: 0.22,
            height: 0.05,
            color: "#29170e",
          },
        },
        // Stylized Cartoon Leaves (Lush green)
        {
          id: "leaf_1",
          type: "primitive",
          position: { x: 0.12, y: 0.52, z: 0.08 },
          rotation: { x: 0.4, y: 0.3, z: -0.3 },
          primitive: {
            geometry: "sphere",
            radius: 0.22,
            color: "#16a34a",
            roughness: 0.4,
          },
        },
        {
          id: "leaf_2",
          type: "primitive",
          position: { x: -0.14, y: 0.65, z: -0.05 },
          rotation: { x: -0.3, y: -0.5, z: 0.4 },
          primitive: {
            geometry: "sphere",
            radius: 0.25,
            color: "#15803d",
            roughness: 0.4,
          },
        },
        {
          id: "leaf_3",
          type: "primitive",
          position: { x: 0.02, y: 0.85, z: 0.02 },
          primitive: {
            geometry: "sphere",
            radius: 0.24,
            color: "#22c55e",
            roughness: 0.4,
          },
        },
      ],
    },

    // ============================================================
    // 9. KIDS CORNER & BOOKSHELF (Books, Toys & Family Details)
    // ============================================================
    {
      id: "bookshelf",
      type: "compound",
      position: { x: -4.8, y: 1.1, z: 0.8 },
      castShadow: true,
      primitive: {
        // Shelf frame
        geometry: "box",
        width: 0.4,
        height: 1.8,
        depth: 1.2,
        color: "#f8fafc",
        roughness: 0.4,
      },
      children: [
        // Colorful Books on middle shelf
        {
          id: "book_red",
          type: "primitive",
          position: { x: 0.05, y: 0.15, z: -0.28 },
          primitive: {
            geometry: "box",
            width: 0.26,
            height: 0.28,
            depth: 0.06,
            color: "#ef4444",
          },
        },
        {
          id: "book_blue",
          type: "primitive",
          position: { x: 0.05, y: 0.15, z: -0.21 },
          primitive: {
            geometry: "box",
            width: 0.26,
            height: 0.26,
            depth: 0.07,
            color: "#3b82f6",
          },
        },
        {
          id: "book_yellow",
          type: "primitive",
          position: { x: 0.05, y: 0.15, z: -0.13 },
          primitive: {
            geometry: "box",
            width: 0.26,
            height: 0.24,
            depth: 0.07,
            color: "#eab308",
          },
        },
        // Son's Toy Robot on top shelf
        {
          id: "toy_robot",
          type: "primitive",
          position: { x: 0, y: 0.72, z: 0.2 },
          primitive: {
            geometry: "box",
            width: 0.15,
            height: 0.22,
            depth: 0.12,
            color: "#06b6d4",
          },
        },
        // Daughter's Cute Teddy Bear
        {
          id: "toy_bear",
          type: "primitive",
          position: { x: 0, y: -0.45, z: 0.15 },
          primitive: {
            geometry: "sphere",
            radius: 0.16,
            color: "#d97706",
          },
        },
      ],
    },

    // ============================================================
    // 10. FRAMED FAMILY PORTRAIT (On Back Wall)
    // ============================================================
    {
      id: "family_portrait",
      type: "compound",
      position: { x: 0, y: 3.4, z: -4.85 },
      primitive: {
        // Wooden gold frame
        geometry: "box",
        width: 1.8,
        height: 1.0,
        depth: 0.04,
        color: "#b45309",
        roughness: 0.4,
      },
      children: [
        // Art Canvas (Warm golden family painting)
        {
          id: "portrait_canvas",
          type: "primitive",
          position: { x: 0, y: 0, z: 0.025 },
          primitive: {
            geometry: "box",
            width: 1.65,
            height: 0.85,
            depth: 0.01,
            color: "#fef3c7",
            emissive: "#fed7aa",
            emissiveIntensity: 0.2,
          },
        },
      ],
    },
  ],

  // ============================================================
  // LIGHTING & AMBIENT ATMOSPHERE
  // ============================================================
  lights: [
    // Soft overall ambient fill
    {
      type: "ambient",
      color: "#f8fafc",
      intensity: 0.65,
    },
    // Warm natural sunlight streaming from window
    {
      type: "directional",
      color: "#fffbeb",
      intensity: 1.8,
      position: { x: 7, y: 9, z: 5 },
      castShadow: true,
    },
    // Cozy warm point light inside floor lamp
    {
      type: "point",
      color: "#f59e0b",
      intensity: 2.2,
      position: { x: -2.8, y: 2.2, z: 1.5 },
    },
    // TV Screen ambient bounce glow
    {
      type: "point",
      color: "#38bdf8",
      intensity: 0.9,
      position: { x: 0, y: 1.9, z: -4.2 },
    },
  ],

  defaultCamera: {
    position: { x: 0, y: 3.5, z: 6.8 },
    lookAt: { x: 0, y: 1.0, z: 0 },
    fov: 55,
  },
};
