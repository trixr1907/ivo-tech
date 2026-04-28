// IVO TECH - 3D Hintergrund: dezentes Grid + Partikel (Maus-Parallax übernimmt der CSS-Layer)
const VisualsEngine = {
  scene: null,
  camera: null,
  renderer: null,
  terrain: null,
  topGrid: null,
  particles: null,
  clock: new THREE.Clock(),

  init() {
    if (this.renderer) return;

    const canvas = document.getElementById("bg-canvas");
    if (!canvas) {
      console.error("Canvas #bg-canvas not found!");
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030913, 0.024);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 20);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createGrid();
    this.createParticles();
    window.addEventListener("resize", () => this.onResize());
    this.animate();
  },

  createGrid() {
    const geometry = new THREE.PlaneGeometry(200, 200, 40, 40);
    const material = new THREE.MeshBasicMaterial({
      color: 0x5fa8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.075
    });

    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.position.y = -2;
    this.scene.add(this.terrain);

    const topGrid = this.terrain.clone();
    topGrid.position.y = 10;
    topGrid.material = material.clone();
    topGrid.material.opacity = 0.03;
    this.topGrid = topGrid;
    this.scene.add(this.topGrid);
  },

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 50 + 10,
        (Math.random() - 0.5) * 200
      );
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x78c6ff, size: 0.13, transparent: true, opacity: 0.32 });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  },

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  animate() {
    requestAnimationFrame(() => this.animate());
    const time = this.clock.getElapsedTime();

    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
      this.particles.rotation.x = Math.sin(time * 0.08) * 0.03;
    }

    this.renderer.render(this.scene, this.camera);
  }
};

window.startVisuals = () => VisualsEngine.init();

if (!document.getElementById("cinematic-intro") || document.getElementById("cinematic-intro").style.display === "none") {
  VisualsEngine.init();
}
