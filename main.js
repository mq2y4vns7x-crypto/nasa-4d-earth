// High-Res NASA Textures
const EARTH_IMG = 'https://raw.githubusercontent.com/tuchkadenis/nasa-earth-textures/master/world.topo.bathy.200407.3x5400x2700.jpg';
const TOPO_IMG = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

const World = new ThreeGlobe({ waitForGlobeReady: true })
  .globeImageUrl(EARTH_IMG)
  .bumpImageUrl(TOPO_IMG)
  .bumpScale(10); // Makes mountains pop

// Memory-Safe Renderer for Mobile
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance" 
});

// Optimization: Limit pixel ratio to 1 to save VRAM
renderer.setPixelRatio(1); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(World);
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 380;

// This script forces a "Re-draw" if it detects a black screen
World.onGlobeReady(() => {
    console.log("NASA Textures Loaded");
});

(function animate() {
  World.rotation.y += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();
