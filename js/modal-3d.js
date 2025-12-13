// IVO TECH - SOTA 3D MODAL ENGINE
// "HOLOGRAPHIC TEXT SYSTEM"
// Dependency: Three.js (Global)

const Modal3DEngine = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    requestId: null,
    container: null,
    modelMesh: null, // The loaded STL mesh
    clock: new THREE.Clock(),
    
    // Config
    stlUrl: "assets/ivo-tech.stl",

    init(containerEl) {
        if (!containerEl) return;
        this.container = containerEl;
        console.log("[3D MODAL] Initializing STL Viewer with DLD UI...");

        if (typeof THREE.STLLoader === 'undefined') {
            console.error("[3D MODAL] THREE.STLLoader is missing! Check script tags.");
            this.container.innerHTML = '<div style="color:red; padding:20px;">Error: STLLoader not loaded.</div>';
            return;
        }

        // 1. INJECT UI OVERLAY
        this.container.innerHTML = `
            <div id="dld-3d-scene" style="width:100%; height:100%;"></div>
            <div class="dld-watermark">
                DLD 3D ENGINE <span style="opacity:0.5; font-size:0.9em;">// DEV. IVO</span>
            </div>
            <div class="dld-canvas-controls">
                <button id="dld-reset-view-btn" type="button" class="dld-control-btn" title="Ansicht zurücksetzen">⟲</button>
                <button id="dld-auto-rotate-btn" type="button" class="dld-control-btn active" title="Auto-Rotation an/aus">↻</button>
                <button id="dld-wireframe-btn" type="button" class="dld-control-btn" title="Gittermodell an/aus">#</button>
            </div>
        `;
        const sceneContainer = this.container.querySelector('#dld-3d-scene');

        // 2. Setup Scene
        this.scene = new THREE.Scene();
        this.scene.background = null; 
        
        // 3. Camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(50, 50, 50);

        // 4. Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        sceneContainer.appendChild(this.renderer.domElement);

        // 5. Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2.0;

        // 6. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
        mainLight.position.set(20, 50, 20);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024; 
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.bias = -0.0005; 
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-20, 20, 10);
        this.scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(0, 10, -20);
        this.scene.add(backLight);

        // 7. Grid
        const gridHelper = new THREE.GridHelper(200, 20, 0x444444, 0x222222);
        this.scene.add(gridHelper);

        // 8. Load STL
        this.loadSTL();

        // 9. UI Events
        this.bindUI();

        // 10. Start Loop
        this.onResize = this.onResize.bind(this);
        window.addEventListener('resize', this.onResize);
        
        // Force initial resize check loop (for modal transition delay)
        const checkSize = () => {
            if(!this.container || !this.renderer) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            if(w > 0 && h > 0) {
                this.renderer.setSize(w, h);
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
            } else {
                requestAnimationFrame(checkSize);
            }
        };
        requestAnimationFrame(checkSize);

        this.animate();
    },

    loadSTL() {
        const loader = new THREE.STLLoader();
        loader.load(this.stlUrl, (geometry) => {
            


            // Normalize Geometry (Center & Scale) - ROBUST METHOD
            geometry.center(); // Integrated Three.js method
            geometry.computeBoundingBox();

            const material = new THREE.MeshStandardMaterial({ 
                color: 0xcccccc, 
                roughness: 0.5,
                metalness: 0.1,
                side: THREE.DoubleSide
            });

            this.modelMesh = new THREE.Mesh(geometry, material);
            this.modelMesh.rotation.x = -Math.PI / 2; 
            this.modelMesh.castShadow = true;
            this.modelMesh.receiveShadow = true;
            
            // Fit to view logic snippet
            const box = new THREE.Box3().setFromObject(this.modelMesh);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            let scaleFactor = 60 / maxDim; // Target size INCREASED slightly
            this.modelMesh.scale.setScalar(scaleFactor);
            
            // Re-center Y explicitly to sit nicely on grid
            // We want the BOTTOM of the mesh to be at y=0 or slightly above
            const box2 = new THREE.Box3().setFromObject(this.modelMesh);
            // box2.min.y is the lowest point. We want that at y=5 (hovering slightly)
            const yOffset = -box2.min.y + 5; 
            this.modelMesh.position.y = yOffset;

            this.scene.add(this.modelMesh);
            console.log("[3D MODAL] STL Loaded.");

        }, undefined, (err) => {
            console.error("[3D MODAL] STL Load Error:", err);
        });
    },

    bindUI() {
        const resetBtn = this.container.querySelector('#dld-reset-view-btn');
        const autoRotateBtn = this.container.querySelector('#dld-auto-rotate-btn');
        const wireBtn = this.container.querySelector('#dld-wireframe-btn');

        if(resetBtn) resetBtn.onclick = () => {
            this.controls.reset();
            this.camera.position.set(50, 50, 50);
        };

        if(autoRotateBtn) autoRotateBtn.onclick = () => {
            this.controls.autoRotate = !this.controls.autoRotate;
            autoRotateBtn.classList.toggle('active', this.controls.autoRotate);
        };

        if(wireBtn) wireBtn.onclick = () => {
             if (this.modelMesh) {
                 this.modelMesh.material.wireframe = !this.modelMesh.material.wireframe;
                 wireBtn.classList.toggle('active', this.modelMesh.material.wireframe);
             }
        };
    },

    onResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    },

    animate() {
        this.requestId = requestAnimationFrame(() => this.animate());
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    },

    dispose() {
        console.log("[3D MODAL] Cleanup.");
        if (this.requestId) cancelAnimationFrame(this.requestId);
        this.requestId = null;
        
        window.removeEventListener('resize', this.onResize);
        
        if (this.renderer) {
            this.renderer.dispose();
            // Clear inner HTML to remove canvas and UI buttons overlay
            if (this.container) this.container.innerHTML = '';
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.container = null;
        this.modelMesh = null;
    }
};

window.Modal3DEngine = Modal3DEngine;
