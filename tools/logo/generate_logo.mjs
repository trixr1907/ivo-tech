import fs from 'fs';
import path from 'path';
import * as THREE from 'three';

// Minimal browser-ish globals for GLTFExporter
if (!globalThis.window) globalThis.window = globalThis;
if (!globalThis.FileReader) {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onload = null;
      this.onloadend = null;
      this.onerror = null;
    }
    _finishSuccess() {
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }
    _finishError(err) {
      if (this.onerror) this.onerror(err);
      if (this.onloadend) this.onloadend({ target: this });
    }
    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          this.result = buf;
          this._finishSuccess();
        })
        .catch((err) => {
          this._finishError(err);
        });
    }
    readAsDataURL(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          const b64 = Buffer.from(buf).toString('base64');
          this.result = 'data:application/octet-stream;base64,' + b64;
          this._finishSuccess();
        })
        .catch((err) => {
          this._finishError(err);
        });
    }
  };
}

const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(scriptDir, '..', '..');

const group = new THREE.Group();

group.name = 'IVO_TECH_LOGO';

const matCore = new THREE.MeshPhysicalMaterial({
  color: 0x101018,
  metalness: 0.9,
  roughness: 0.22,
  clearcoat: 0.7,
  clearcoatRoughness: 0.12,
  emissive: 0x05050a,
  emissiveIntensity: 0.35
});

const matCyan = new THREE.MeshPhysicalMaterial({
  color: 0x00f3ff,
  metalness: 0.7,
  roughness: 0.18,
  clearcoat: 0.8,
  clearcoatRoughness: 0.1,
  emissive: 0x00f3ff,
  emissiveIntensity: 0.9
});

const matMagenta = new THREE.MeshPhysicalMaterial({
  color: 0xff00ff,
  metalness: 0.65,
  roughness: 0.2,
  clearcoat: 0.75,
  clearcoatRoughness: 0.1,
  emissive: 0xff00ff,
  emissiveIntensity: 0.85
});

const addGlow = (mesh, color, scale = 1.04, opacity = 0.25) => {
  const glowMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const glow = new THREE.Mesh(mesh.geometry, glowMat);
  glow.position.copy(mesh.position);
  glow.rotation.copy(mesh.rotation);
  glow.scale.copy(mesh.scale).multiplyScalar(scale);
  group.add(glow);
};

// I
const iGeo = new THREE.BoxGeometry(20, 90, 14);
const iMesh = new THREE.Mesh(iGeo, matCyan);
 iMesh.position.set(-90, 45, 0);
 group.add(iMesh);
 addGlow(iMesh, 0x00f3ff, 1.06, 0.22);

// V (two bars)
const vGeo = new THREE.BoxGeometry(20, 100, 14);
const vL = new THREE.Mesh(vGeo, matCyan);
const vR = new THREE.Mesh(vGeo, matCyan);
 vL.position.set(-15, 48, 0);
 vR.position.set(15, 48, 0);
 vL.rotation.z = 0.48;
 vR.rotation.z = -0.48;
 group.add(vL);
 group.add(vR);
 addGlow(vL, 0x00f3ff, 1.05, 0.2);
 addGlow(vR, 0x00f3ff, 1.05, 0.2);

// O
const oGeo = new THREE.TorusGeometry(38, 7.5, 24, 96);
const oMesh = new THREE.Mesh(oGeo, matMagenta);
 oMesh.position.set(90, 46, 0);
 oMesh.rotation.x = Math.PI / 2;
 group.add(oMesh);
 addGlow(oMesh, 0xff00ff, 1.05, 0.18);

// TECH plaque
const plaqueGeo = new THREE.BoxGeometry(190, 24, 10);
const plaque = new THREE.Mesh(plaqueGeo, matCore);
 plaque.position.set(0, -18, 0);
 group.add(plaque);

// TECH word as geometric segments
const makeLetter = (type, mat) => {
  const g = new THREE.Group();
  const w = 18;
  const h = 22;
  const d = 6;
  const t = 4;
  const addBar = (bw, bh, x, y) => {
    const geo = new THREE.BoxGeometry(bw, bh, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, 0);
    g.add(mesh);
  };

  if (type === 'T') {
    addBar(w, t, 0, h / 2 - t / 2);
    addBar(t, h, 0, 0);
  } else if (type === 'E') {
    addBar(t, h, -w / 2 + t / 2, 0);
    addBar(w, t, 0, h / 2 - t / 2);
    addBar(w * 0.8, t, -w * 0.1, 0);
    addBar(w, t, 0, -h / 2 + t / 2);
  } else if (type === 'C') {
    addBar(w, t, 0, h / 2 - t / 2);
    addBar(t, h, -w / 2 + t / 2, 0);
    addBar(w, t, 0, -h / 2 + t / 2);
  } else if (type === 'H') {
    addBar(t, h, -w / 2 + t / 2, 0);
    addBar(t, h, w / 2 - t / 2, 0);
    addBar(w, t, 0, 0);
  }
  return g;
};

const techGroup = new THREE.Group();
const letters = ['T', 'E', 'C', 'H'];
const spacing = 22;
letters.forEach((letter, idx) => {
  const g = makeLetter(letter, matCyan);
  g.position.x = (idx - 1.5) * spacing;
  techGroup.add(g);
  g.traverse((child) => {
    if (child.isMesh) addGlow(child, 0x00f3ff, 1.03, 0.18);
  });
});
techGroup.position.set(0, -22, 8);
 group.add(techGroup);

// Center group and align to floor
const box = new THREE.Box3().setFromObject(group);
const center = box.getCenter(new THREE.Vector3());
 group.position.sub(center);
const box2 = new THREE.Box3().setFromObject(group);
 group.position.y -= box2.min.y;

const exporter = new GLTFExporter();
const outPath = path.resolve(repoRoot, 'assets/brand/ivo-tech-logo.glb');
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const toBuffer = async (result) => {
  if (result instanceof ArrayBuffer) return Buffer.from(result);
  if (ArrayBuffer.isView(result)) return Buffer.from(result.buffer);
  if (result && typeof result.arrayBuffer === 'function') {
    const buf = await result.arrayBuffer();
    return Buffer.from(buf);
  }
  if (typeof result === 'string') return Buffer.from(result);
  return Buffer.from(JSON.stringify(result));
};

await new Promise((resolve, reject) => {
  exporter.parse(
    group,
    async (result) => {
      try {
        const buffer = await toBuffer(result);
        fs.writeFileSync(outPath, buffer);
        console.log(`GLB geschrieben: ${outPath} (${buffer.length} bytes)`);
        resolve();
      } catch (err) {
        reject(err);
      }
    },
    (error) => {
      console.error('GLTF Export Fehler', error);
      reject(error);
    },
    { binary: true, trs: true }
  );
});
