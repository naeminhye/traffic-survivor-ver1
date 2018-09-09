var WORLD = WORLD || {};
var sphereShape, sphereBody, physicsMaterial, walls = [], balls = [], ballMeshes = [], boxes = [], boxMeshes = [];
WORLD.world = null;
WORLD.camera = null;
WORLD.scene = null;
WORLD.renderer = null;
WORLD.player = null;
var target = new THREE.Vector3(20, 0, -50);
var isDangerous = false;
var geometry, material, mesh;
var controls, time = Date.now();
var dangerZoneMesh = null;
var dangerZoneGeometry = null;
var dangerZoneBBox = null;

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
        }
    }

    var pointerlockerror = function (event) {
        instructions.style.display = '';
    }

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    instructions.addEventListener('click', function (event) {
        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {

            var fullscreenchange = function (event) {

                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);

                    element.requestPointerLock();
                }

            }

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();
        } else {
            element.requestPointerLock();
        }
    }, false);
} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

WORLD.initCannon = function() {
    // Setup our world
    WORLD.world = new CANNON.World();
    WORLD.world.quatNormalizeSkip = 0;
    WORLD.world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    WORLD.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    WORLD.world.defaultContactMaterial.contactEquationRelaxation = 4;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if (split)
        WORLD.world.solver = new CANNON.SplitSolver(solver);
    else
        WORLD.world.solver = solver;

    WORLD.world.gravity.set(0, -20, 0);
    WORLD.world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
        physicsMaterial,
        0.0, // friction coefficient
        0.3  // restitution
    );
    // We must add the contact materials to the world
    WORLD.world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 1, 100);
    sphereBody.linearDamping = 0.9;
    WORLD.world.add(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    WORLD.world.add(groundBody);
}

WORLD.init = function() {

    WORLD.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

    WORLD.scene = new THREE.Scene();
    WORLD.scene.background = new THREE.Color( 0xcce0ff );
    WORLD.scene.fog = new THREE.Fog(0x000000, 0, 500);

    var ambient = new THREE.AmbientLight(0x111111);
    WORLD.scene.add(ambient);

    light = new THREE.SpotLight(0xffffff);
    light.position.set(10, 30, 20);
    light.target.position.set(0, 0, 0);
    if (true) {
        light.castShadow = true;

        light.shadow.camera.near = 20;
        light.shadow.camera.far = 50;//camera.far;
        light.shadow.camera.fov = 40;

        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadow.mapSize.width = 2 * 512;
        light.shadow.mapSize.height = 2 * 512;

        //light.shadowCameraVisible = true;
    }
    WORLD.scene.add(light);

    controls = new PointerLockControls(WORLD.camera, sphereBody);
    WORLD.player = controls.getObject();
    WORLD.scene.add(WORLD.player);
    WORLD.player.position.set(0, 1, 100);

    WORLD.scene.updateMatrixWorld(true);

    WORLD.drawGround();

    WORLD.renderer = new THREE.WebGLRenderer({ antialias: true });
    WORLD.renderer.shadowMap.enabled = true;
    WORLD.renderer.shadowMapSoft = true;
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.setClearColor(WORLD.scene.fog.color, 1);

    document.body.appendChild(WORLD.renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    // Add boxes
    var halfExtents = new CANNON.Vec3(1, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    for (var i = 0; i < 2; i++) {
        var x = (Math.random()-0.5)*20;
        var y = 1 + (Math.random()-0.5)*1;
        var z = (Math.random()-0.5)*20;
        var boxBody = new CANNON.Body({ mass: 5 });
        boxBody.addShape(boxShape);
        var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        material2 = new THREE.MeshLambertMaterial({ color: randomColor });
        var boxMesh = new THREE.Mesh(boxGeometry, material2);
        WORLD.world.add(boxBody);
        WORLD.scene.add(boxMesh);
        boxBody.position.set(x, y, z);
        boxMesh.position.set(x, y, z);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        boxes.push(boxBody);
        boxMeshes.push(boxMesh);
        boxBody.addEventListener('collide', function(object) {
            // if(object.body.id == 0) 
            //     console.log("Collided!!", object.body);
        });
    }

    dangerZoneGeometry = new THREE.BoxGeometry(20, 20, 20);
    dangerZoneMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    dangerZoneMesh = new THREE.Mesh(
                        new THREE.BoxGeometry(20, 20, 20), 
                        new THREE.MeshBasicMaterial({
                            color: 0xff0000,
                            wireframe: true
                        })
                    );
    dangerZoneMesh.position.set(0, 10, -20);
    dangerZoneMesh.geometry.computeBoundingBox();
    dangerZoneBBox = new THREE.Box3(dangerZoneMesh.geometry.boundingBox.min.add(dangerZoneMesh.position), dangerZoneMesh.geometry.boundingBox.max.add(dangerZoneMesh.position));
    WORLD.scene.add(dangerZoneMesh);

    // poles

    var poleGeo = new THREE.CubeGeometry( .3, 60, .3 );
    var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100, flatShading: false } );

    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.set(20, 0, -50);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    WORLD.scene.add( mesh );
    var meshBody = addPhysicalBody(mesh, { mass: 5 });
    WORLD.world.add(meshBody);


    var gg = new THREE.CubeGeometry( 1, 1, 1 );
    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.set(20, 0, -50);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    WORLD.scene.add( mesh );
    var meshBody = addPhysicalBody(mesh, { mass: 5 });
    WORLD.world.add(meshBody);

}

function onWindowResize() {
    WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    WORLD.camera.updateProjectionMatrix();
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
}

var dt = 1 / 60;
WORLD.animate = function() {
    requestAnimationFrame(WORLD.animate);
    if (controls.enabled) {

        WORLD.world.step(dt);
    }
        
    controls.update(Date.now() - time);
    var windStrength = Math.cos( time / 7000 ) * 20 + 40;
    windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
    windForce.normalize()
    windForce.multiplyScalar( windStrength );

    $("#message").text("You are now " + Math.round(WORLD.player.position.distanceTo(target)) + "m far away from the final place.");

    if(dangerZoneBBox.containsPoint(WORLD.player.position)) {
        if(!isDangerous) {
            toastr.error("You're in the dangerous zone!");
            isDangerous = true;
        }
    }
    else {
        isDangerous = false;
    }


    WORLD.renderer.render(WORLD.scene, WORLD.camera);
    time = Date.now();

}

function addPhysicalBody(mesh, bodyOptions) {
    var shape;
    // create a Sphere shape for spheres and thorus knots,
    // a Box shape otherwise
    // if (mesh.geometry.type === 'SphereGeometry' ||
    // mesh.geometry.type === 'ThorusKnotGeometry') {
    //     mesh.geometry.computeBoundingSphere();
    //     shape = new CANNON.Sphere(mesh.geometry.boundingSphere.radius);
    // }
    // else {
    mesh.geometry.computeBoundingBox();
    var box = mesh.geometry.boundingBox;
    shape = new CANNON.Box(new CANNON.Vec3(
        (box.max.x - box.min.x) / 2,
        (box.max.y - box.min.y) / 2,
        (box.max.z - box.min.z) / 2
    ));
    // }

    var body = new CANNON.Body(bodyOptions);
    body.addShape(shape);
    body.position.copy(mesh.position);
    body.computeAABB();
    // disable collision response so objects don't move when they collide
    // against each other
    body.collisionResponse = false;
    // keep a reference to the mesh so we can update its properties later
    body.mesh = mesh;

    body.addEventListener('collide', function(object) {
        if(object.body.id == 0) 
            console.log("Collided!!", object.body);
    });
    return body;
};