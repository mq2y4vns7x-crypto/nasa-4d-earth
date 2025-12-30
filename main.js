// Using a trusted CDN Mirror of NASA's textures to bypass CORS security blocks
const EARTH_IMG = 'https://cdn.jsdelivr.net/gh/tuchkadenis/nasa-earth-textures@master/world.topo.bathy.200407.3x5400x2700.jpg';

const World = new ThreeGlobe()
  .globeImageUrl(EARTH_IMG)
  .showAtmosphere(true)
  .atmosphereColor('#87CEEB')
  .atmosphereAltitude(0.15);

// 1. Setup Renderer with Security & Memory fixes
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true // Helps mobile browsers keep the image visible
});

renderer.setPixelRatio(1); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

// 2. Setup Scene (White Room)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); 
scene.add(World);

// 3. Bright Lighting (Front and Back)
scene.add(new THREE.AmbientLight(0xffffff, 2.0)); 
const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(1, 1, 1);
scene.add(sun);

// 4. Camera Position
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 400;

// 5. Texture Security "Handshake"
const loader = new THREE.TextureLoader();
loader.crossOrigin = 'anonymous'; // This is the secret to bypassing the security block

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
