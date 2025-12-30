/** * NASA 4D Earth - Mobile Optimized High-Res Edition
 */

// 1. High-Resolution NASA Textures
const EARTH_IMG = 'https://raw.githubusercontent.com/tuchkadenis/nasa-earth-textures/master/world.topo.bathy.200407.3x5400x2700.jpg';
const TOPO_IMG = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

// 2. Initialize Globe with "Wait for Load"
const World = new ThreeGlobe({ waitForGlobeReady: true })
  .globeImageUrl(EARTH_IMG)
  .bumpImageUrl(TOPO_IMG)
  .bumpScale(10) // Makes mountains look 3D
  .showAtmosphere(true)
  .atmosphereColor('lightskyblue')
  .atmosphereAltitude(0.15);

// 3. Setup Renderer (Mobile Performance Fixes)
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance" // Tells phone to use full GPU
});

// IMPORTANT: Limit resolution to 1x to prevent "Black Screen" crash on mobile
renderer.setPixelRatio(1); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

// 4. Setup Scene & Lighting
const scene = new THREE.Scene();
scene.add(World);
scene.add(new THREE.AmbientLight(0xffffff, 0.7)); // Base brightness
scene.add(new THREE.DirectionalLight(0xffffff, 0.8)); // Sun light

// 5. Setup Camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 400; // Distance from Earth

// 6. Animation & Interaction Loop
(function animate() {
  World.rotation.y += 0.0012; // Slow spin
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();

// 7. Auto-Resize for Phone Rotation
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 8. Mobile "Touch to Wake"
window.addEventListener('touchstart', () => {
    console.log("Interactive Mode Engaged");
}, { once: true });
