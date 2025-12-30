// --- 1. CORE CONFIGURATION ---
// These are the "OnEarth" layers from NASA's official repositories
const NASA_LAYERS = {
    tiles: (x, y, l) => `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/${l}/${y}/${x}.jpg`,
    topology: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
    fallback: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
};

// --- 2. INITIALIZE 3D ENVIRONMENT ---
const World = new ThreeGlobe()
    .showAtmosphere(true)
    .atmosphereColor('#4af')
    .atmosphereDayLightIntensity(1.5);

const scene = new THREE.Scene();
scene.add(World);
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 400;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- 3. THE 100Hz HYPER-LOADER (The "000000" Logic) ---
let cycleCount = 0;
const MAX_CYCLES = 100;
const streamEl = document.getElementById('stream');
const barEl = document.getElementById('progress-bar');
const statusEl = document.getElementById('status');

// This runs every 10 milliseconds (100 times per second)
const rapidAccess = setInterval(() => {
    cycleCount++;

    // UPDATE NUMBERS: Creates a 14-digit random string that mutates 100x a second
    const dataStream = Math.random().toString().substring(2, 16).padStart(14, '0');
    streamEl.innerText = dataStream;
    
    // UPDATE BAR
    barEl.style.width = `${cycleCount}%`;

    // LAYER COMBINATION TRIGGERS
    if (cycleCount === 10) {
        statusEl.innerText = "REQUESTING_GIBS_DATA_STREAM...";
        World.globeTileEngineUrl(NASA_LAYERS.tiles);
    }
    
    if (cycleCount === 40) {
        statusEl.innerText = "MERGING_TOPOLOGY_HEIGHTMAPS...";
        World.bumpImageUrl(NASA_LAYERS.topology);
    }

    if (cycleCount === 75) {
        statusEl.innerText = "INJECTING_BLUE_MARBLE_TRUECOLOR...";
        // If tiles fail, this layer ensures the Earth is visible
        World.globeImageUrl(NASA_LAYERS.fallback);
    }

    if (cycleCount >= MAX_CYCLES) {
        clearInterval(rapidAccess);
        streamEl.innerText = "CONNECTION_STABLE";
        statusEl.innerText = "NASA_GIBS_v2_ACTIVE";
        
        // Final fade out of the loader
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => document.getElementById('loader').remove(), 600);
        }, 300);
    }
}, 10); 

// --- 4. ANIMATION LOOP ---
const animate = () => {
    World.rotation.y += 0.0012; // The slow "4D" spin
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

// Resizing logic for mobile responsiveness
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
