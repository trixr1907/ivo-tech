import { loadScript } from '@/lib/loadScript';

export async function ensureDld3dDeps(): Promise<void> {
  // Order matters because some example loaders read globals at evaluation-time.
  await loadScript('/vendor/three/three.min.js');
  await loadScript('/vendor/fflate/index.js');
  await loadScript('/vendor/jszip/jszip.min.js');
  await loadScript('/vendor/three/OrbitControls.js');
  await loadScript('/vendor/three/STLLoader.js');
  await loadScript('/vendor/three/3MFLoader.js');
  await loadScript('/vendor/three/GLTFLoader.js');
  await loadScript('/vendor/dld3d-core/dld3d-core.js');

  const missing: string[] = [];
  if (!window.THREE) missing.push('THREE');
  if (window.THREE) {
    if (!window.THREE.OrbitControls) missing.push('THREE.OrbitControls');
    if (!window.THREE.STLLoader) missing.push('THREE.STLLoader');
    if (!window.THREE.ThreeMFLoader) missing.push('THREE.ThreeMFLoader');
    if (!window.THREE.GLTFLoader) missing.push('THREE.GLTFLoader');
  }
  if (!window.JSZip) missing.push('JSZip');
  if (!window.fflate) missing.push('fflate');
  if (!window.DLD3DConfigurator) missing.push('DLD3DConfigurator');

  if (missing.length > 0) {
    throw new Error(`DLD3D deps missing: ${missing.join(', ')}`);
  }
}

