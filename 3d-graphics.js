// 3D Graphics with Three.js for Telegram Mini App
let scene, camera, renderer, aiSpheres = [];
let clock = new THREE.Clock();

function init3D() {
    const container = document.querySelector('.threejs-container');
    if (!container) return;

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    scene.fog = new THREE.Fog(0xf5f7fa, 10, 20);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);

    // Create AI-themed 3D objects
    createAISpheres();

    // Add floating elements
    createFloatingElements(container);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function createAISpheres() {
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const materials = [
        new THREE.MeshPhongMaterial({ 
            color: 0x3949ab, 
            transparent: true, 
            opacity: 0.9, 
            shininess: 100,
            emissive: 0x3949ab,
            emissiveIntensity: 0.1
        }),
        new THREE.MeshPhongMaterial({ 
            color: 0x5c6bc0, 
            transparent: true, 
            opacity: 0.9, 
            shininess: 100,
            emissive: 0x5c6bc0,
            emissiveIntensity: 0.1
        }),
        new THREE.MeshPhongMaterial({ 
            color: 0x7986cb, 
            transparent: true, 
            opacity: 0.9, 
            shininess: 100,
            emissive: 0x7986cb,
            emissiveIntensity: 0.1
        })
    ];

    for (let i = 0; i < 3; i++) {  // Reduced number of spheres for better performance on mobile
        const material = materials[i % materials.length];
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        
        // Position spheres in a more dynamic pattern
        const angle = (i / 3) * Math.PI * 2;
        sphere.position.x = Math.cos(angle) * 2;
        sphere.position.y = Math.sin(angle * 1.5) * 0.8;
        sphere.position.z = Math.sin(angle * 2) * 0.5;
        
        // Add pulsing effect
        sphere.userData = { 
            rotationSpeed: { x: 0.005, y: 0.008, z: 0.003 },
            originalScale: sphere.scale.clone(),
            pulseDirection: 1,
            floatOffset: { x: Math.random() * 0.5, y: Math.random() * 0.5 }
        };
        
        scene.add(sphere);
        aiSpheres.push(sphere);
    }
}

function createFloatingElements(container) {
    const elementsContainer = document.createElement('div');
    elementsContainer.className = 'ai-elements';
    
    const elements = ['🤖', '🧠', '💻', '📡', '⚡', '🌐', '🔍', '💡', '📊', '云端'];
    
    for (let i = 0; i < 6; i++) {  // Reduced number of elements for better performance
        const element = document.createElement('div');
        element.className = 'ai-element';
        element.textContent = elements[i % elements.length];
        
        // Random position
        element.style.left = `${Math.random() * 80 + 10}%`;
        element.style.top = `${Math.random() * 70 + 15}%`;
        element.style.animationDelay = `${Math.random() * 8}s`;
        element.style.fontSize = `${Math.random() * 0.8 + 1.5}rem`;
        
        elementsContainer.appendChild(element);
    }
    
    container.appendChild(elementsContainer);
}

function onWindowResize() {
    const container = document.querySelector('.threejs-container');
    if (!container) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate and pulse spheres
    aiSpheres.forEach(sphere => {
        // Rotation
        sphere.rotation.x += sphere.userData.rotationSpeed.x;
        sphere.rotation.y += sphere.userData.rotationSpeed.y;
        sphere.rotation.z += sphere.userData.rotationSpeed.z;
        
        // Pulsing effect
        const pulse = Math.sin(elapsedTime * 2) * 0.1 + 1;
        sphere.scale.set(
            sphere.userData.originalScale.x * pulse,
            sphere.userData.originalScale.y * pulse,
            sphere.userData.originalScale.z * pulse
        );
        
        // Floating motion
        sphere.position.y += Math.sin(elapsedTime + sphere.position.x) * 0.002;
        sphere.position.x += Math.cos(elapsedTime + sphere.position.y) * 0.001;
    });
    
    renderer.render(scene, camera);
}

// Load Three.js dynamically if not already loaded
function loadThreeJS() {
    return new Promise((resolve, reject) => {
        if (window.THREE) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in Telegram Web App
    if (window.Telegram?.WebApp) {
        // Initialize after Telegram Web App is ready
        window.Telegram.WebApp.ready();
        init3D();
    } else {
        // Initialize normally for non-Telegram environments
        loadThreeJS()
            .then(init3D)
            .catch(err => {
                console.error('Failed to load Three.js:', err);
                // Fallback: create a simple 3D-like effect with CSS
                createCSS3DEffect();
            });
    }
});

// Fallback CSS 3D effect if Three.js fails to load
function createCSS3DEffect() {
    const container = document.querySelector('.threejs-container');
    if (!container) return;
    
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.width = '100%';
    fallbackDiv.style.height = '100%';
    fallbackDiv.style.display = 'flex';
    fallbackDiv.style.alignItems = 'center';
    fallbackDiv.style.justifyContent = 'center';
    fallbackDiv.style.fontSize = '4rem';
    fallbackDiv.style.color = '#3949ab';
    fallbackDiv.style.animation = 'pulse 2s infinite';
    fallbackDiv.innerHTML = '🤖';
    
    container.appendChild(fallbackDiv);
    
    // Add pulse animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}