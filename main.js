// Reliable Mirror of NASA Blue Marble Textures
const EARTH_IMG = 'https://cdn.jsdelivr.net/gh/tuchkadenis/nasa-earth-textures@master/world.topo.bathy.200407.3x5400x2700.jpg';
const TOPO_IMG = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

// 1. Setup World
const World = new ThreeGlobe({ waitForGlobeReady: true })
  .globeImageUrl(EARTH_IMG)
  .bumpImageUrl(TOPO_IMG)
  .bumpScale(10)
  .showAtmosphere(true)
  .atmosphereColor('lightskyblue')
  .atmosphereAltitude(0.15);

// 2. Setup Renderer (Optimized for Mobile GPU)
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
});
renderer.setPixelRatio(1); // Crucial: Prevents mobile memory crash
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

// 3. Setup Scene
const scene = new THREE.Scene();
scene.add(World);
scene.add(new THREE.AmbientLight(0xffffff, 0.9));
scene.add(new THREE.DirectionalLight(0xffffff, 0.5));

// 4. Setup Camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 400;

// 5. Animation
function animate() {
  World.rotation.y += 0.001; 
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// 6. Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
