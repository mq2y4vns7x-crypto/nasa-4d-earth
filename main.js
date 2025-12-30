// 1. Using a high-performance 1K texture (Still NASA quality, but mobile-safe)
const EARTH_IMG = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const TOPO_IMG = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

// 2. Setup World with low-memory settings
const World = new ThreeGlobe()
  .globeImageUrl(EARTH_IMG)
  .bumpImageUrl(TOPO_IMG)
  .bumpScale(5) // Reduced slightly to save GPU processing
  .showAtmosphere(true)
  .atmosphereColor('lightskyblue')
  .atmosphereAltitude(0.12);

// 3. Renderer with "mediump" (This stops the black screen)
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    precision: 'mediump' // CRUCIAL for mobile
});

renderer.setPixelRatio(1); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(World);
scene.add(new THREE.AmbientLight(0xffffff, 1.2)); 
scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 400;

(function animate() {
  World.rotation.y += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
