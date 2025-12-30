    // 1. SETTINGS & BACKUPS
    const backupImg = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
    let loaded = false;

    const World = new ThreeGlobe()
        // NASA GIBS TILE ENGINE (The "Pro" Way)
        .globeTileEngineUrl((x, y, l) => 
            `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/${l}/${y}/${x}.jpg`
        )
        .showAtmosphere(true)
        .atmosphereColor('#3a228a');

    // 2. THE AUTO-FIX TIMER
    // If tiles don't load in 5 seconds, switch to the reliable backup image
    setTimeout(() => {
        if (!loaded) {
            console.log("NASA GIBS too slow, switching to backup...");
            World.globeImageUrl(backupImg);
            hideLoader("STABLE (BACKUP)");
        }
    }, 5000);

    // 3. SCENE SETUP
    const scene = new THREE.Scene();
    scene.add(World);
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('globeViz').appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 2000);
    camera.position.z = 400;
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 4. THE LOADER HIDER
    function hideLoader(statusText) {
        loaded = true;
        document.getElementById('status').innerText = statusText;
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 1000);
    }

    function animate() {
        World.rotation.y += 0.001;
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Trigger loader removal when the window thinks everything is ready
    window.onload = () => { if(!loaded) hideLoader("LIVE_FEED_ACTIVE"); };
