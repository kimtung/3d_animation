# Dependencies – AI 3D Family Animation Engine

## Quick Install

```bash
# 1. Tạo project
npm create vite@latest family-animation -- --template react-ts
cd family-animation

# 2. Install dependencies
npm install three zustand

# 3. Install dev dependencies
npm install -D @types/three

# 4. Run
npm run dev
```

---

## Dependencies

### Production

| Package   | Version  | Mục đích                                            |
|-----------|----------|-----------------------------------------------------|
| `three`   | `^0.169` | 3D rendering, WebGL, AnimationMixer, GLTFLoader     |
| `zustand` | `^5.0`   | Lightweight state management để sync engine → React |

### Dev Dependencies

| Package                 | Version  | Mục đích                              |
|-------------------------|----------|---------------------------------------|
| `@types/three`          | `^0.169` | TypeScript definitions cho Three.js   |
| `typescript`            | `^5.6`   | Type checking                         |
| `vite`                  | `^5.4`   | Build tool, HMR dev server            |
| `@vitejs/plugin-react`  | `^4.3`   | React + Vite integration              |

---

## package.json

```json
{
  "name": "family-animation",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "three": "^0.169.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@engine/*":     ["src/engine/*"],
      "@characters/*": ["src/characters/*"],
      "@scenes/*":     ["src/scenes/*"],
      "@ui/*":         ["src/ui/*"],
      "@store/*":      ["src/store/*"],
      "@hooks/*":      ["src/hooks/*"]
    }
  },
  "include": ["src"]
}
```

---

## vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@engine':     resolve(__dirname, 'src/engine'),
      '@characters': resolve(__dirname, 'src/characters'),
      '@scenes':     resolve(__dirname, 'src/scenes'),
      '@ui':         resolve(__dirname, 'src/ui'),
      '@store':      resolve(__dirname, 'src/store'),
      '@hooks':      resolve(__dirname, 'src/hooks'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
});
```

---

## Packages KHÔNG cần trong prototype

| Package              | Lý do bỏ qua                                           |
|----------------------|--------------------------------------------------------|
| `@react-three/fiber` | Engine cần control trực tiếp Three.js                  |
| `@react-three/drei`  | Phụ thuộc R3F                                          |
| `rapier`             | Physics không cần, movement dùng lerp                  |
| `axios`              | Không có backend                                       |
| `redux` / `mobx`     | Zustand đủ nhẹ                                         |
| `gsap` / `tween.js`  | Over-engineered, AnimationMixer + lerp đủ dùng         |

---

## Packages cho tương lai

| Package                   | Khi nào cần                                |
|---------------------------|--------------------------------------------|
| `@dimforge/rapier3d`      | Collision detection, physics               |
| `openai` / `@google/genai`| LLM Story Generator integration           |
| `howler.js`               | Audio / sound effects                      |
| `stats.js`                | FPS counter, performance monitoring        |
| `leva`                    | Debug controls panel (better than custom)  |

---

## Browser Support

> Prototype chạy local – chỉ cần Chrome/Edge/Firefox modern.

| Browser      | Support | Note                         |
|--------------|---------|------------------------------|
| Chrome 120+  | ✅      | Full WebGL2                   |
| Firefox 120+ | ✅      | Full WebGL2                   |
| Edge 120+    | ✅      | Full WebGL2                   |
| Safari 17+   | ✅      | WebGL2 từ Safari 15+          |

**Yêu cầu:** WebGL2 (available trên mọi modern browser từ 2022+)
