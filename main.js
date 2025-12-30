<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NASA 4D: OnEarth Engine</title>
    
    <script src="https://unpkg.com/three"></script>
    <script src="https://unpkg.com/three-globe"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js"></script>

    <style>
        /* CSS: MISSION CONTROL UI */
        body { 
            margin: 0; 
            background: radial-gradient(circle at center, #001529 0%, #000 100%); 
            overflow: hidden; 
            color: #4af;
            font-family: 'Courier New', Courier, monospace;
        }

        #ui-layer {
            position: absolute;
            top: 20px;
            left: 20px;
            pointer-events: none;
            z-index: 10;
        }

        .label { font-size: 10px; opacity: 0.7; letter-spacing: 2px; }
        .value { font-size: 18px; font-weight: bold; margin-bottom: 10px; }

        #loader {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 100;
            transition: opacity 1.5s ease;
        }

        .spinner {
            width: 40px; height: 40px;
            border: 2px solid #4af;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    </style>
</head>
<body>

    <div id="ui-layer">
        <div class="label">MISSION_DATA_FEED</div>
        <div class="value">NASA GIBS / ONEARTH</div>
        <div class="label">COORD_SYSTEM</div>
        <div class="value">EPSG:4326 (GEO)</div>
        <div class="label">ENGINE_STATUS</div>
        <div class="value" id="status">CONNECTING...</div>
    </div>

    <div id="loader">
        <div class="spinner"></div>
        <div>STITCHING NASA TILES...</div>
    </div>

    <div id="globeViz"></div>

    <script>
        // JS: 4D ENGINE LOGIC
        const World = new ThreeGlobe()
            // THE TILE ENGINE: This is the "OnEarth" logic from NASA's GitHub
            // It replaces {l}/{y}/{x} with zoom, row, and column automatically
            .globeTileEngineUrl((x, y, l) => 
                `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/${l}/${y}/${x}.jpg`
            )
            .globeTileEngineMaxZoom(8) // NASA's high-res limit
            .showAtmosphere(true)
            .atmosphereColor('#3a228a')
            .atmosphereDayLightIntensity(1.5);

        // STARRY BACKGROUND
        const scene = new THREE.Scene();
        scene.add(World);

        const starGeometry = new THREE.SphereGeometry(900, 64, 64);
        const starMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('https://unpkg.com/three-globe/example/img/night-sky.png'),
            side: THREE.BackSide
        });
        scene.add(new THREE.Mesh(starGeometry, starMaterial));

        // LIGHTING
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const sun = new THREE.DirectionalLight(0xffffff, 1.2);
        sun.position.set(1, 1, 1);
        scene.add(sun);

        // RENDERER
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('globeViz').appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 400;

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.rotateSpeed = 0.5;

        // ANIMATION LOOP
        function animate() {
            World.rotation.y += 0.001; // Auto-spin
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        // HIDE LOADER WHEN READY
        window.onload = () => {
            document.getElementById('status').innerText = 'STABLE';
            const loader = document.getElementById('loader');
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 1500);
        };

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>

