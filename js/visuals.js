// IVO TECH - 3D BACKGROUND ENGINE
// "The Grid" - Infinite Terrain

const VisualsEngine = {
    scene: null,
    camera: null,
    renderer: null,
    terrain: null,
    clock: new THREE.Clock(),

    init() {
        console.log("Initializing Visuals Engine...");
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) {
            console.error("Canvas #bg-canvas not found!");
            return;
        }

        // Scene Setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.03); // Deep fog

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 20);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Objects
        this.createGrid();
        this.createParticles();

        // Events
        window.addEventListener('resize', () => this.onResize());

        // Start Loop
        this.animate();
    },

    createGrid() {
        // Moving Grid Terrain
        const geometry = new THREE.PlaneGeometry(200, 200, 40, 40);
        
        // Displace vertices for terrain effect
        const count = geometry.attributes.position.count;
        // for(let i=0; i<count; i++) {
        //     // basic flat grid for now, or use noise later
        // }

        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00f3ff, // Neon Cyan
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });

        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.y = -2;
        this.scene.add(this.terrain);

        // Top Grid (Ceiling reflection)
        const topGrid = this.terrain.clone();
        topGrid.position.y = 10;
        topGrid.material = material.clone();
        topGrid.material.opacity = 0.05;
        this.scene.add(topGrid);
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
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0xff00ff, size: 0.2, transparent: true, opacity: 0.6 });
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

        // Move Terrain
        // seamless loop simulation
        const speed = 2;
        // In a real infinite grid, we'd offset UVs or position modulo
        // Simple visual trick: just move particles and oscillate grid
        
        if(this.particles) {
            this.particles.rotation.y = time * 0.05;
            this.particles.position.z = (time * 2) % 20; 
        }

        if(this.terrain) {
             // Warping effect
             // this.terrain.position.z = (time * 5) % 5; // Jerky if not perfect
             // Let's just rotate gently
             // this.terrain.rotation.z = Math.sin(time * 0.1) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }
};

// Global Exposure
window.startVisuals = () => VisualsEngine.init();

// Auto-start if not triggered by intro (dev mode or intro disabled)
if (!document.getElementById('cinematic-intro') || document.getElementById('cinematic-intro').style.display === 'none') {
    VisualsEngine.init();
}
