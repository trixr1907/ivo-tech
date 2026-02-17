import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyFileRelative(srcRel, destRel) {
  const src = path.resolve(repoRoot, srcRel);
  const dest = path.resolve(repoRoot, destRel);

  if (!(await fileExists(src))) {
    throw new Error(`copy-vendor: missing source: ${srcRel}`);
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function main() {
  const copies = [
    // Three.js core (pinned to r128 via three@0.128.0)
    ['node_modules/three/build/three.min.js', 'public/vendor/three/three.min.js'],

    // Three.js legacy example scripts (global THREE.*)
    ['node_modules/three/examples/js/controls/OrbitControls.js', 'public/vendor/three/OrbitControls.js'],
    ['node_modules/three/examples/js/loaders/STLLoader.js', 'public/vendor/three/STLLoader.js'],
    ['node_modules/three/examples/js/loaders/3MFLoader.js', 'public/vendor/three/3MFLoader.js'],
    ['node_modules/three/examples/js/loaders/GLTFLoader.js', 'public/vendor/three/GLTFLoader.js'],

    // 3MF dependencies
    ['node_modules/jszip/dist/jszip.min.js', 'public/vendor/jszip/jszip.min.js'],
    ['node_modules/fflate/umd/index.js', 'public/vendor/fflate/index.js'],

    // Shared configurator core (framework-less)
    ['packages/dld3d-core/dist/dld3d-core.js', 'public/vendor/dld3d-core/dld3d-core.js'],
    ['packages/dld3d-core/dist/dld3d-core.css', 'public/vendor/dld3d-core/dld3d-core.css']
  ];

  await Promise.all(copies.map(([src, dest]) => copyFileRelative(src, dest)));
}

await main();

