var WORLD = WORLD || {};
var UNITWIDTH = 9;                 // Width of a cubes in the maze
var UNITHEIGHT = 9;                // Height of the cubes in the maze
var sphereShape, sphereBody, physicsMaterial, walls = [], balls = [], ballMeshes = [], boxes = [], boxMeshes = [];
WORLD.world = null;
WORLD.camera = null;
WORLD.scene = null;
WORLD.renderer = null;
WORLD.player = null;
var target = new THREE.Vector3(20, 0, -50);
var isDangerous = false;
var geometry, material, mesh;
var time = Date.now();
WORLD.controls = null;
var dangerZoneMesh = null;
var dangerZoneGeometry = null;
var dangerZoneBBox = null;
const objs = [];
var clock = new THREE.Clock();
WORLD.collidableObjects = [];
WORLD.streetSignList = [];
WORLD.vehicle = [];
var initialPosition 

// Flag to determine if the player lost the game
var gameOver = false;

// Velocity vectors for the player and dino
WORLD.playerVelocity = new THREE.Vector3();
var carVelocity = new THREE.Vector3();

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            WORLD.controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            WORLD.controls.enabled = false;
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

WORLD.initCannon = function () {
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
    sphereBody.position.set(40, 2, -10);
    sphereBody.linearDamping = 0.9;
    WORLD.world.add(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    WORLD.world.add(groundBody);
}

WORLD.init = function () {

    // WORLD.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    WORLD.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);

    WORLD.scene = new THREE.Scene();
    WORLD.scene.background = new THREE.Color(0xcce0ff);
    WORLD.scene.fog = new THREE.Fog(0x000000, 0, 500);

    var ambient = new THREE.AmbientLight(0x111111);
    // WORLD.scene.add(ambient);

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
    // WORLD.scene.add(light);
    addSunlight(WORLD.scene);

    WORLD.controls = new PointerControls(WORLD.camera, sphereBody);
    WORLD.player = WORLD.controls.getObject();
    WORLD.scene.add(WORLD.player);
    WORLD.player.position.set(40, 2, -10);
    WORLD.player.rotateY(Math.PI / 2);

    WORLD.scene.updateMatrixWorld(true);
    WORLD.drawGround();

    WORLD.renderer = new THREE.WebGLRenderer({ antialias: true });
    WORLD.renderer.shadowMap.enabled = true;
    WORLD.renderer.shadowMapSoft = true;
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.setClearColor(WORLD.scene.fog.color, 1);

    document.body.appendChild(WORLD.renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    dangerZoneGeometry = new THREE.BoxGeometry(80, 40, 80);
    dangerZoneMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    dangerZoneMesh = new THREE.Mesh(
        dangerZoneGeometry,
        dangerZoneMaterial
    );
    dangerZoneMesh.position.set(-10, 20, 0);
    dangerZoneMesh.geometry.computeBoundingBox();
    dangerZoneBBox = new THREE.Box3(dangerZoneMesh.geometry.boundingBox.min.add(dangerZoneMesh.position), dangerZoneMesh.geometry.boundingBox.max.add(dangerZoneMesh.position));
    // WORLD.scene.add(dangerZoneMesh);

    // /* fbxLoader */
    // var manager = new THREE.LoadingManager();
    // manager.onProgress = function (item, loaded, total) {
    //     console.log(item, loaded, total);
    // };
    // var onProgress = function (xhr) {
    //     if (xhr.lengthComputable) {
    //         var percentComplete = xhr.loaded / xhr.total * 100;
    //         console.log(Math.round(percentComplete, 2) + '% downloaded');
    //     }
    // };
    // var onError = function (xhr) {
    //     console.log(xhr);
    // };

    var models = [
        // {
        //     name: "sign",
        //     loader_type: "object",
        //     object_type: "street_sign",
        //     url: "./models/json/test_sign.json",
        //     // position: new THREE.Vector3(-10, 10, -20),
        //     position: new THREE.Vector3(0, 10, 0),
        //     rotation: new THREE.Euler(0, Math.PI, Math.PI, "XYZ"),
        //     animate: false,
        //     angle: 90
        // },
        {
            name: "car",
            loader_type: "object",
            object_type: "vehicle",
            url: "./models/json/volkeswagon-vw-beetle.json",
            position: new THREE.Vector3(0, 1.5, 100),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.005, .005, 0.005),
            animate: true
        },
        {
            name: "traffic-light-1",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(6, 0, 6),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "traffic-light-2",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(-16, 0, -16),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "traffic-light-3",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(-16, 0, 6),
            rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "traffic-light-4",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(6, 0, -16),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "bus_stop",
            loader_type: "fbx",
            url: "./models/fbx/bus_stop/bus_stop.FBX",
            position: new THREE.Vector3(-45, 0, -23),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(.05,.05,.05),
            children: {
                "sign": {
                    position: new THREE.Vector3(0, 60, 100),
                    rotation: new THREE.Euler( - Math.PI / 2, 0, Math.PI, "XYZ"),
                }
            }
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 20),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        // {
        //     name: "tree2",
        //     loader_type: "object",
        //     url: "./models/trees/tree2/tree2.json",
        //     position: new THREE.Vector3(-25, 0, 35),
        //     rotation: new THREE.Euler(0, 0, 0),
        //     textureUrl: './models/json/leaves1.png',
        //     scale: new THREE.Vector3(.2,.2,.2),
        // },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 35),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 50),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 65),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 65),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 50),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 20),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 35),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        {
            name: "bus", 
            loader_type: "gltf", 
            object_type: "vehicle",
            position: new THREE.Vector3(-10, 0, -80),
            scale: new THREE.Vector3(.015,.015,.015),
            url: "./models/gltf/fortnitecity_bus/scene.gltf",
            animate: false
        },
        {
            name: "bus_2", 
            loader_type: "gltf", 
            object_type: "vehicle",
            scale: new THREE.Vector3(.25,.25,.25),
            position: new THREE.Vector3(-35, 0, -2),
            url: "./models/gltf/bus/scene.gltf",
            animate: false
        }
        // {
        //     name: "stripes-uv",
        //     loader_type: "object",
        //     object_type: "sign",
        //     url: "./models/stripes-uv.json",
        //     textureUrl: './models/stripes2.png',
        //     animate: false
        // },
        // {
        //     name: "land_ocean_ice_small",
        //     loader_type: "json",
        //     object_type: "sign",
        //     url: "./models/earth.json",
        //     textureUrl: './models/land_ocean_ice_small.png',
        //     animate: false
        // },
        // {
        //     name: "SignN281107",
        //     loader_type: "object",
        //     object_type: "sign",
        //     url: "./models/tds/SignN281107.json",
        //     textureUrl: './models/tds/perexod.jpg',
        //     scale: new THREE.Vector3(10, 10, 10),
        //     rotation: new THREE.Euler( - Math.PI / 2, 0, 0, "XYZ"),
        //     animate: false
        // }
    ];

    // add models to the world
    models.forEach(md => loadModelToWorld(md));

}

function onWindowResize() {
    WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    WORLD.camera.updateProjectionMatrix();
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
}

var dt = 1 / 60;
WORLD.animate = function () {
    requestAnimationFrame(WORLD.animate);
    if (WORLD.controls.enabled) {

        WORLD.world.step(dt);
    }
    
    WORLD.controls.update(Date.now() - time);
    animateVehicle(Date.now() - time);
    checkDistance();
    // var windStrength = Math.cos(time / 7000) * 20 + 40;
    // windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
    // windForce.normalize()
    // windForce.multiplyScalar(windStrength);

    // $("#message").text(compass(WORLD.camera.getWorldDirection(new THREE.Vector3(0, 0, 0))));
    // $("#message").text("Delta: " + (Date.now() - time));
    // $("#message").text("Velocity: " + WORLD.playerVelocity);


    WORLD.renderer.render(WORLD.scene, WORLD.camera);
    time = Date.now();

}

WORLD.detectCollision = () => {
    var flag = 0;
    WORLD.collidableObjects.forEach((object) => {
        if(object instanceof THREE.Sphere || object instanceof THREE.Box3) {
            if (object.containsPoint(WORLD.player.position)) {
                toastr.error("Collided!");
                flag ++;
            }
        }
    });
    return flag;
}

// Takes a ray and sees if it's colliding with anything from the list of collidable objects
// Returns true if certain distance away from object
function rayIntersect(ray, distance) {
    var intersects = ray.intersectObjects(WORLD.collidableObjects);
    for (var i = 0; i < intersects.length; i++) {
        if (intersects[i].distance < distance) {
            return true;
        }
    }
    return false;
}

function box() {
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
}

function addSunlight(scene) {
    var sunlight = new THREE.DirectionalLight();
    sunlight.position.set(250, 250, 250);
    sunlight.intensity = 0.5;
    sunlight.castShadow = true;
    // sunlight.shadowDarkness = 0.9;
    sunlight.shadow.mapSize.width = sunlight.shadow.mapSize.height = 2048;
    sunlight.shadow.camera.near = 250;
    sunlight.shadow.camera.far = 600;
    sunlight.shadow.camera.left = -200;
    sunlight.shadow.camera.right = 200;
    sunlight.shadow.camera.top = 200;
    sunlight.shadow.camera.bottom = -200;

    scene.add(sunlight);
  }
  // Make the dino chase the player
function checkDistance() {
    WORLD.streetSignList.forEach((sign) => {
        // Check if in dino agro range
        if (sign.object.position.distanceTo(WORLD.player.position) < 20) {
            // Adject the target's y value. We only care about x and z for movement.
            // var lookTarget = new THREE.Vector3();
            // lookTarget.copy(WORLD.player.position);
            // lookTarget.y = sign.position.y;

            // Make dino face camera
            // sign.lookAt(lookTarget);

            // Get distance between dino and camera with a 120 unit offset
            // Game over when dino is the value of CATCHOFFSET units away from camera
            var distanceFrom = (sign.object.position.distanceTo(WORLD.player.position));

            var vector = WORLD.player.getWorldDirection();
            var theta = Math.atan2(vector.x,vector.z);
            var playerAngle  = THREE.Math.radToDeg(theta);
            if(sign.angle - playerAngle <= 90 && sign.angle - playerAngle >= -90) {
                // console.log("sds")
            }
            // Alert and display distance between camera and dino
            // $("#message").text("Sign's distance from you: " + distanceFrom);
            // Not in agro range, don't start distance countdown
        } 
    });
    
    if (dangerZoneBBox.containsPoint(WORLD.player.position)) {
        if (!isDangerous) {
            toastr.error("You're about to meet the intersection!");
            isDangerous = true;
        }
    }
    else {
        isDangerous = false;
    }
}

function animateVehicle(delta) {
    // WORLD.vehicle.forEach((sign) => {
        // console.log("object:", sign.object)
        // sign.object.position.x += 0.5;
    // });

    WORLD.scene.getObjectByName("bus_2") ? WORLD.scene.getObjectByName("bus_2").position.x += 0.2 : null;
    WORLD.scene.getObjectByName("bus") ? WORLD.scene.getObjectByName("bus").position.z += 0.2 : null;
    WORLD.scene.getObjectByName("car") ? WORLD.scene.getObjectByName("car").position.z -= 0.2 : null;
    

    // // If no collision, apply movement velocity
    // if (detectDinoCollision() == false) {
    //     dinoVelocity.z += DINOSPEED * delta;
    //     // Move the dino
    //     dino.translateZ(dinoVelocity.z * delta);

    // } else {
    //     // Collision. Adjust direction
    //     var directionMultiples = [-1, 1, 2];
    //     var randomIndex = getRandomInt(0, 2);
    //     var randomDirection = degreesToRadians(90 * directionMultiples[randomIndex]);

    //     dinoVelocity.z += DINOSPEED * delta;
    //     dino.rotation.y += randomDirection;
    // }
}