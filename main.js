// High-res Mirror Textures (Fastest for Mobile)
const EARTH_IMG = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const TOPO_IMG = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const NIGHT_IMG = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';

// Initialize the Globe
const World = new ThreeGlobe()
  .globeImageUrl(EARTH_IMG)
  .bumpImageUrl(TOPO_IMG)
  .showAtmosphere(true)
  .atmosphereColor('lightskyblue')
  .atmosphereAltitude(0.15);

// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('globeViz').appendChild(renderer.domElement);

// Setup Scene
const scene = new THREE.Scene();
scene.add(World);
scene.add(new THREE.AmbientLight(0xbbbbbb));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

// Setup Camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 400;

// Animation Loop
(function animate() {
  World.rotation.y += 0.001; // Slow rotation
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
