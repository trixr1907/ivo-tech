'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/cn';

type ThreeModule = typeof import('three');
type Object3D = import('three').Object3D;

function disposeHierarchy(obj: Object3D) {
  obj.traverse((child) => {
    const m = child as import('three').Mesh & { geometry?: import('three').BufferGeometry; material?: import('three').Material | import('three').Material[] };
    if (m.geometry) m.geometry.dispose();
    const mat = m.material;
    if (!mat) return;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat.dispose();
  });
}

function buildScene(THREE: ThreeModule) {
  const group = new THREE.Group();

  const blueMid = 0x2563eb;
  const blueHi = 0x60a5fa;
  const white = 0xe2e8f0;
  const blueDeep = 0x1e3a8a;

  const tiers = 18;
  for (let tier = 0; tier < tiers; tier++) {
    const t = tier / Math.max(1, tiers - 1);
    const radius = 2.4 + t * 4.2;
    const y = t * 1.35 - 0.25;
    const tube = 0.028 + t * 0.022;
    const ringSegs = tier % 3 === 0 ? 96 : 64;
    const geo = new THREE.TorusGeometry(radius, tube, 8, ringSegs);
    const wire = tier % 2 === 0;
    const mat = new THREE.MeshBasicMaterial({
      color: wire ? blueHi : blueMid,
      wireframe: wire,
      transparent: true,
      opacity: wire ? 0.22 : 0.08,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = y;
    group.add(mesh);
  }

  const meridians = 14;
  for (let i = 0; i < meridians; i++) {
    const angle = (i / meridians) * Math.PI * 2;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(Math.cos(angle) * 6.2, 0.1, Math.sin(angle) * 6.2),
      new THREE.Vector3(Math.cos(angle) * 3.4, 4.2, Math.sin(angle) * 3.4),
      new THREE.Vector3(Math.cos(angle) * 0.5, 0.4, Math.sin(angle) * 0.5)
    );
    const pts = curve.getPoints(48);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color: blueHi, transparent: true, opacity: 0.28 })
    );
    group.add(line);
  }

  const pitch = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 13.5, 1, 1),
    new THREE.MeshBasicMaterial({
      color: blueDeep,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide
    })
  );
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.y = -0.42;
  group.add(pitch);

  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 13.5, 18, 12),
    new THREE.MeshBasicMaterial({
      color: white,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide
    })
  );
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -0.41;
  group.add(grid);

  const particleCount = 900;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = 4 + Math.random() * 5.5;
    const yp = 0.5 + Math.random() * 5;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 0.95;
    positions[i * 3 + 1] = yp;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.95;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: white,
      size: 0.045,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      sizeAttenuation: true
    })
  );
  group.add(points);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(6.45, 0.06, 8, 128),
    new THREE.MeshBasicMaterial({ color: blueHi, transparent: true, opacity: 0.45 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.05;
  group.add(rim);

  return { group, points, basePositions: new Float32Array(positions) };
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type HomeMannheimStadiumMeshProps = {
  className?: string;
  reducedMessage: string;
};

export function HomeMannheimStadiumMesh({ className, reducedMessage }: HomeMannheimStadiumMeshProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
  const [noWebgl, setNoWebgl] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let raf = 0;
    const teardownFns: (() => void)[] = [];

    const start = (THREE: ThreeModule) => {
      if (destroyed || !host) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
      } catch {
        setNoWebgl(true);
        return;
      }

      const w0 = host.clientWidth || 800;
      const h0 = Math.max(380, Math.min(620, Math.round(w0 * 0.52)));

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w0, h0, false);
      renderer.setClearColor(0x000000, 0);

      const canvas = renderer.domElement;

      canvas.className = 'home-mannheim-gl-canvas block h-full w-full';
      canvas.setAttribute('aria-hidden', 'true');
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x020617, 0.035);

      const camera = new THREE.PerspectiveCamera(42, w0 / h0, 0.1, 120);
      camera.position.set(14, 9.5, 14);
      camera.lookAt(0, 2.2, 0);

      const amb = new THREE.AmbientLight(0x64748b, 0.55);
      scene.add(amb);
      const spot = new THREE.PointLight(0x38bdf8, 1.1, 80, 2);
      spot.position.set(-8, 14, 6);
      scene.add(spot);
      const spot2 = new THREE.PointLight(0xc4b5fd, 0.65, 70, 2);
      spot2.position.set(10, 10, -8);
      scene.add(spot2);

      const built = buildScene(THREE);
      scene.add(built.group);

      const clock = new THREE.Clock();
      const base = built.basePositions;

      const onResize = () => {
        if (destroyed || !host) return;
        const nw = host.clientWidth || 800;
        const nh = Math.max(380, Math.min(620, Math.round(nw * 0.52)));
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(nw, nh, false);
      };

      const loop = () => {
        if (destroyed) return;
        const t = clock.getElapsedTime();
        built.group.rotation.y = t * 0.12;
        built.group.position.y = Math.sin(t * 0.35) * 0.06;
        const pos = built.points.geometry.attributes.position;
        if (pos && base) {
          const arr = pos.array as Float32Array;
          for (let i = 0; i < base.length; i += 3) {
            arr[i + 1] = base[i + 1] + Math.sin(t * 1.2 + i * 0.01) * 0.14;
          }
          pos.needsUpdate = true;
        }
        camera.position.x = 14 + Math.sin(t * 0.25) * 0.55;
        camera.position.z = 14 + Math.cos(t * 0.22) * 0.45;
        camera.lookAt(0, 2.1 + Math.sin(t * 0.15) * 0.08, 0);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      window.addEventListener('resize', onResize);
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      teardownFns.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        ro.disconnect();
        disposeHierarchy(built.group);
        renderer.dispose();
        if (host.contains(canvas)) host.removeChild(canvas);
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || destroyed) return;
        io.disconnect();
        void import('three').then((THREE) => {
          if (destroyed) return;
          start(THREE);
        });
      },
      { rootMargin: '200px 0px', threshold: 0.02 }
    );
    io.observe(host);

    return () => {
      destroyed = true;
      io.disconnect();
      teardownFns.forEach((f) => f());
    };
  }, [reduced]);

  return (
    <div
      ref={hostRef}
      className={cn(
        'home-mannheim-canvas-host relative min-h-[min(52vw,28rem)] w-full overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-950/80 shadow-[0_0_0_1px_rgba(14,165,233,0.08),0_24px_80px_rgba(0,0,0,0.45)]',
        className
      )}
    >
      {reduced ? (
        <div className="flex min-h-[22rem] items-center justify-center bg-slate-950/90 px-6 text-center text-sm leading-relaxed text-slate-500">
          {reducedMessage}
        </div>
      ) : null}
      {noWebgl && !reduced ? (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-gradient-to-b from-slate-900/90 to-slate-950/95 px-4 text-center text-sm text-slate-500">
          WebGL — nicht verfügbar
        </div>
      ) : null}
    </div>
  );
}
