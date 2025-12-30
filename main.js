// 1. Initialize the Globe with the NASA GIBS URL
const World = new ThreeGlobe()
    .globeTileEngineUrl((x, y, l) => 
        // This URL pattern is the standard for NASA's EPSG:4326 (Geographic) grid
        `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/${l}/${y}/${x}.jpg`
    )
    .showAtmosphere(true)
    .atmosphereColor('#3a228a')
    .atmosphereDayLightIntensity(1.5);

// 2. Setup the Starfield (Background)
const scene = new THREE.Scene();
const starGeo = new THREE.SphereGeometry(900, 64, 64);
const starMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('https://unpkg.com/three-globe/example/img/night-sky.png'),
    side: THREE.BackSide
});
scene.add(new THREE.Mesh(starGeo, starMat));
scene.add(World);

// 3. Lighting (Sunlight)
const sun = new THREE.DirectionalLight(0xffffff, 1.3);
sun.position.set(1, 1, 1); // Angle light to show mountain relief
scene.add(new THREE.AmbientLight(0xbbbbbb, 0.8));
scene.add(sun);

// 4. Renderer & Controls
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 400;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Makes rotation feel "heavy" and smooth

// 5. The 4D Loop
function animate() {
    World.rotation.y += 0.0012; // Continuous 4D rotation
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Hide loader when the page finishes connecting
window.onload = () => {
    document.getElementById('loader').style.opacity = '0';
    setTimeout(() => document.getElementById('loader').remove(), 1000);
};
