// Plato's Laundry - Three.js Scene
class PlatosLaundry {
    constructor() {
        this.config = {
            drum_radius: 3,
            drum_depth: 4,
            film_count: 12,
            light_intensity: 2.5,
            animation_speed: 0.002
        };
        
        this.materials = {
            drum_color: "#C0C0C0",
            film_opacity: 0.4,
            light_color: "#FFFFFF"
        };
        
        this.filmStrips = [];
        this.time = 0;
        
        this.init();
    }
    
    init() {
        try {
            this.setupScene();
            this.createDrum();
            this.createFilmStrips();
            this.setupLighting();
            this.setupControls();
            this.animate();
            this.hideLoading();
        } catch (error) {
            console.error('Failed to initialize scene:', error);
            this.showError();
        }
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        // Camera - positioned as if looking through washing machine door
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 6);
        
        // Renderer
        this.canvas = document.getElementById('laundry-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Enable shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    createDrum() {
        // Main drum cylinder
        const drumGeometry = new THREE.CylinderGeometry(
            this.config.drum_radius, 
            this.config.drum_radius, 
            this.config.drum_depth, 
            32, 
            1, 
            true
        );
        
        const drumMaterial = new THREE.MeshStandardMaterial({
            color: this.materials.drum_color,
            metalness: 0.8,
            roughness: 0.3,
            side: THREE.DoubleSide
        });
        
        this.drum = new THREE.Mesh(drumGeometry, drumMaterial);
        this.drum.rotation.z = Math.PI / 2; // Rotate to be horizontal like a front-loader
        this.drum.castShadow = true;
        this.drum.receiveShadow = true;
        this.scene.add(this.drum);
        
        // Add perforated holes to drum walls
        this.createDrumHoles();
        
        // Drum back wall
        const backWallGeometry = new THREE.CircleGeometry(this.config.drum_radius, 32);
        const backWall = new THREE.Mesh(backWallGeometry, drumMaterial);
        backWall.position.z = -this.config.drum_depth / 2;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
    }
    
    createDrumHoles() {
        // Create small holes around the drum for realistic washing machine appearance
        const holeGeometry = new THREE.CircleGeometry(0.05, 8);
        const holeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        
        const holesGroup = new THREE.Group();
        
        // Create holes in a pattern around the drum
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 20; j++) {
                const hole = new THREE.Mesh(holeGeometry, holeMaterial);
                const angle = (j / 20) * Math.PI * 2;
                const height = (i / 7 - 0.5) * this.config.drum_depth * 0.8;
                
                hole.position.x = Math.cos(angle) * (this.config.drum_radius + 0.01);
                hole.position.y = Math.sin(angle) * (this.config.drum_radius + 0.01);
                hole.position.z = height;
                
                hole.lookAt(0, 0, height);
                holesGroup.add(hole);
            }
        }
        
        holesGroup.rotation.z = Math.PI / 2;
        this.scene.add(holesGroup);
    }
    
    createFilmStrips() {
        for (let i = 0; i < this.config.film_count; i++) {
            this.createFilmStrip(i);
        }
    }
    
    createFilmStrip(index) {
        // Create film strip geometry - long and thin like 35mm film
        const stripGeometry = new THREE.PlaneGeometry(4, 0.3, 20, 1);
        
        // Make the strip curved and wavy
        const positions = stripGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            // Add some natural curve and wave
            positions.setZ(i, Math.sin(x * 0.5) * 0.1 + Math.sin(y * 3) * 0.05);
        }
        stripGeometry.computeVertexNormals();
        
        // Film material - translucent with some color variation
        const hue = (index / this.config.film_count) * 0.1 + 0.05; // Slight color variation
        const filmMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(hue, 0.3, 0.6),
            transparent: true,
            opacity: this.materials.film_opacity,
            roughness: 0.1,
            metalness: 0.0,
            side: THREE.DoubleSide
        });
        
        const filmStrip = new THREE.Mesh(stripGeometry, filmMaterial);
        
        // Random initial position within the drum
        const angle = (index / this.config.film_count) * Math.PI * 2;
        const radius = Math.random() * (this.config.drum_radius * 0.7);
        const height = (Math.random() - 0.5) * this.config.drum_depth * 0.6;
        
        filmStrip.position.x = Math.cos(angle) * radius;
        filmStrip.position.y = Math.sin(angle) * radius;
        filmStrip.position.z = height;
        
        // Random rotation
        filmStrip.rotation.x = Math.random() * Math.PI * 2;
        filmStrip.rotation.y = Math.random() * Math.PI * 2;
        filmStrip.rotation.z = Math.random() * Math.PI * 2;
        
        filmStrip.castShadow = true;
        filmStrip.receiveShadow = true;
        
        // Store animation properties
        filmStrip.userData = {
            originalPosition: filmStrip.position.clone(),
            originalRotation: filmStrip.rotation.clone(),
            floatSpeed: 0.5 + Math.random() * 0.5,
            rotateSpeed: 0.2 + Math.random() * 0.3,
            waveAmplitude: 0.1 + Math.random() * 0.2,
            phaseOffset: Math.random() * Math.PI * 2
        };
        
        this.filmStrips.push(filmStrip);
        this.scene.add(filmStrip);
    }
    
    setupLighting() {
        // Main back light - the "fire" from Plato's cave
        this.backLight = new THREE.DirectionalLight(this.materials.light_color, this.config.light_intensity);
        this.backLight.position.set(0, 0, -8);
        this.backLight.target.position.set(0, 0, 0);
        
        // Configure shadows
        this.backLight.castShadow = true;
        this.backLight.shadow.mapSize.width = 1024;
        this.backLight.shadow.mapSize.height = 1024;
        this.backLight.shadow.camera.near = 1;
        this.backLight.shadow.camera.far = 20;
        this.backLight.shadow.camera.left = -6;
        this.backLight.shadow.camera.right = 6;
        this.backLight.shadow.camera.top = 6;
        this.backLight.shadow.camera.bottom = -6;
        
        this.scene.add(this.backLight);
        this.scene.add(this.backLight.target);
        
        // Ambient light for subtle fill
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0x4a90a4, 0.5);
        rimLight.position.set(-2, 3, 5);
        this.scene.add(rimLight);
        
        // Add subtle point lights for caustic-like effects
        this.createCausticLights();
    }
    
    createCausticLights() {
        this.causticLights = [];
        
        for (let i = 0; i < 3; i++) {
            const light = new THREE.PointLight(0x88ccdd, 0.3, 5);
            light.position.set(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 2
            );
            
            light.userData = {
                originalPosition: light.position.clone(),
                moveSpeed: 0.3 + Math.random() * 0.4,
                amplitude: 0.5 + Math.random() * 0.5
            };
            
            this.causticLights.push(light);
            this.scene.add(light);
        }
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        
        // Constrain controls to feel like looking through washing machine door
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI * 0.8;
        this.controls.minPolarAngle = Math.PI * 0.2;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += this.config.animation_speed;
        
        // Animate film strips
        this.animateFilmStrips();
        
        // Animate caustic lights
        this.animateCausticLights();
        
        // Update controls
        this.controls.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    animateFilmStrips() {
        this.filmStrips.forEach((strip) => {
            const userData = strip.userData;
            const t = this.time * userData.floatSpeed;
            
            // Floating motion - like suspended in liquid
            strip.position.x = userData.originalPosition.x + Math.sin(t + userData.phaseOffset) * userData.waveAmplitude;
            strip.position.y = userData.originalPosition.y + Math.cos(t * 0.7 + userData.phaseOffset) * userData.waveAmplitude;
            strip.position.z = userData.originalPosition.z + Math.sin(t * 0.5 + userData.phaseOffset) * userData.waveAmplitude * 0.5;
            
            // Gentle rotation
            strip.rotation.x = userData.originalRotation.x + Math.sin(t * userData.rotateSpeed) * 0.2;
            strip.rotation.y = userData.originalRotation.y + Math.cos(t * userData.rotateSpeed * 0.8) * 0.3;
            strip.rotation.z = userData.originalRotation.z + Math.sin(t * userData.rotateSpeed * 0.6) * 0.1;
            
            // Slow orbital motion around drum center
            const orbitalT = this.time * 0.1;
            const currentRadius = Math.sqrt(strip.position.x * strip.position.x + strip.position.y * strip.position.y);
            const currentAngle = Math.atan2(strip.position.y, strip.position.x);
            const newAngle = currentAngle + orbitalT * userData.floatSpeed * 0.1;
            
            strip.position.x = Math.cos(newAngle) * currentRadius;
            strip.position.y = Math.sin(newAngle) * currentRadius;
        });
    }
    
    animateCausticLights() {
        this.causticLights.forEach((light) => {
            const userData = light.userData;
            const t = this.time * userData.moveSpeed;
            
            light.position.x = userData.originalPosition.x + Math.sin(t) * userData.amplitude;
            light.position.y = userData.originalPosition.y + Math.cos(t * 0.8) * userData.amplitude;
            light.position.z = userData.originalPosition.z + Math.sin(t * 0.6) * userData.amplitude * 0.5;
            
            // Subtle intensity flickering
            light.intensity = 0.2 + Math.sin(t * 2) * 0.1;
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    hideLoading() {
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loading');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }, 1000);
    }
    
    showError() {
        const loadingOverlay = document.getElementById('loading');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <p style="color: #ff5555;">Failed to load Three.js scene</p>
                    <p style="color: #cccccc; font-size: 14px;">Please refresh the page to try again</p>
                </div>
            `;
        }
    }
}

// Initialize the scene when Three.js is ready
if (typeof THREE !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        new PlatosLaundry();
    });
} else {
    console.error('Three.js not loaded');
}