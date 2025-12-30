import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

// THE FORCE BUTTON
window.forceStart = () => document.getElementById('loading-overlay').style.display = 'none';

// EARTH SYSTEM WITH SEASONAL TILT
const earthGroup = new THREE.Group();
earthGroup.rotation.z = 23.5 * Math.PI / 180; 
scene.add(earthGroup);

// TEXTURES
const modernDay = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
const pangeaMap = loader.load('https://raw.githubusercontent.com/turban/three.js-earth/master/assets/earth_blue_marble_all_2048.jpg'); // Placeholder for Pangea
const topoMap = loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');

const earthMat = new THREE.MeshPhongMaterial({
    map: modernDay,
    bumpMap: topoMap,
    bumpScale: 0.15, // High resolution zoom detail
    shininess: 5
});

const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMat);
earthGroup.add(earth);

// LIGHTING
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(5, 3, 5);
scene.add(sun);
scene.add(new THREE.AmbientLight(0x222222));

// ERA SLIDER LOGIC
document.getElementById('time-slider').addEventListener('input', (e) => {
    const isModern = e.target.value == 1;
    earthMat.map = isModern ? modernDay : pangeaMap;
    document.getElementById('era-label').innerText = isModern ? "Modern Day" : "Pangea Era";
});

camera.position.z = 3;
new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    earthGroup.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();
