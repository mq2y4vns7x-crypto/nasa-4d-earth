// High-Res NASA Textures
const EARTH_IMG = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const TOPO_IMG = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

const World = new ThreeGlobe()
  .globeImageUrl(EARTH_IMG)
  .bumpImageUrl(TOPO_IMG)
  .bumpScale(15) // High detail for mountains
  .showAtmosphere(true)
  .atmosphereColor('#87CEEB')
  .atmosphereAltitude(0.15);

// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // THE WHITE ROOM
scene.add(World);

// SUPER LIGHTING: Lights up the Earth from all sides
const light1 = new THREE.AmbientLight(0xffffff, 2.0); // Extreme brightness
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
light2.position.set(1, 1, 1);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 1.5);
light3.position.set(-1, -1, -1); // Light from the back too
scene.add(light3);

const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 350;

(function animate() {
  World.rotation.y += 0.0015;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
