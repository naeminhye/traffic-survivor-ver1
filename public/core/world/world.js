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
    sphereBody.position.set(0, 1, 10);
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

    WORLD.controls = new PointerLockControls(WORLD.camera, sphereBody);
    WORLD.player = WORLD.controls.getObject();
    WORLD.scene.add(WORLD.player);
    WORLD.player.position.set(0, 1, 10);

    WORLD.scene.updateMatrixWorld(true);
    WORLD.drawGround();

    WORLD.renderer = new THREE.WebGLRenderer({ antialias: true });
    WORLD.renderer.shadowMap.enabled = true;
    WORLD.renderer.shadowMapSoft = true;
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.setClearColor(WORLD.scene.fog.color, 1);

    document.body.appendChild(WORLD.renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    dangerZoneGeometry = new THREE.BoxGeometry(20, 20, 20);
    dangerZoneMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    dangerZoneMesh = new THREE.Mesh(
        dangerZoneGeometry,
        dangerZoneMaterial
    );
    dangerZoneMesh.position.set(0, 10, -20);
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
        {
            name: "sign",
            loader_type: "object",
            url: "./models/json/test_sign.json",
            position: new THREE.Vector3(-10, 10, -20),
            rotation: new THREE.Euler(0, Math.PI / 2, Math.PI, "XYZ"),
            animate: false
        },
        {
            name: "car",
            loader_type: "object",
            url: "./models/json/volkeswagon-vw-beetle.json",
            position: new THREE.Vector3(0, 1.5, 0),
            scale: new THREE.Vector3(.005, .005, 0.005),
            animate: true
        },
        {
            name: "parkingsign",
            loader_type: "fbx",
            url: "./models/fbx/parking-sign/parkingsign.fbx",
            position: new THREE.Vector3(-10, 0, -10),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.025,.025,.025),
            animate: false
        },
        {
            name: "chair",
            loader_type: "fbx",
            url: "./models/fbx/basic-park-bench/chair.fbx",
            position: new THREE.Vector3(-20, 0, -20),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1),
            animate: true
        },
        // {
        //     name: "marine",
        //     loader_type: "object",
        //     url: "./models/json/marine_anims_core.json",
        //     position: new THREE.Vector3(-20, 0, -20),
        //     rotation: new THREE.Euler(0, 0, 0, "XYZ"),
        //     scale: new THREE.Vector3(.05,.05,.05),
        //     animate: false
        // },
        // {
        //     name: "Tree",
        //     loader_type: "fbx",
        //     url: "./models/fbx/tree1/Tree.fbx",
        //     position: new THREE.Vector3(-10, 0, 0),
        //     rotation: new THREE.Euler(0, 0, 0, "XYZ"),
        //     scale: new THREE.Vector3(1,1,1)
        // },
        {
            name: "speedlimitsign",
            loader_type: "fbx",
            url: "./models/fbx/speed-limit-sign/speedlimitsign.fbx",
            position: new THREE.Vector3(-10, 0, -20),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.025,.025,.025)
        },
        {
            name: "traffic-light",
            loader_type: "fbx",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(10, 0, -10),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "road_block",
            loader_type: "gltf",
            url: "./models/gltf/road_block/scene.gltf",
            position: new THREE.Vector3(2, 0, 0),
            rotation: new THREE.Euler(0, -3 * Math.PI / 4, 0),
            scale: new THREE.Vector3(0.1, 0.1, 0.1)
        }
    ];

    // add models to the world
    models.forEach(md => WORLD.loadModelToWorld(md));

    /////////
	// CAR //
    /////////		 
    // var CARS = {
    //     "Porsche":{
    //         name: "Porsche",
    //         url: "models/json/testJson.json",
    //         //init_material: 4,
    //         //body_materials: [ 2 ],

    //         object: null,
    //         buttons: null,
    //         materials: null
    //     }
    // };

    // loader.load(CARS[ "Porsche" ].url, function (carGeometry) { 
    //     /*createScene( geometry, "Veyron" )*/
    //     var carMaterial = new THREE.MeshBasicMaterial({ color: 0x995500, opacity: 1.0, transparent: false });
    //     var carMesh = new THREE.Mesh(carGeometry, carMaterial);
    //     // carMesh.scale.set(10, 10, 10);
    //     carMesh.position.y = 1; 
    //     carMesh.position.z = -10;
    //     carMesh.rotateY(Math.PI);
    //     WORLD.scene.add(carMesh);
    // });
    // loader.load("models/json/testJson.json", function(geometry, materials ) {// onLoad callback
    //     var material = materials[ 0 ];
    //     var object = new THREE.Mesh( geometry, material );
    //     WORLD.scene.add(object);
    
    // }, onProgress, onError);
    // WORLD.fbxLoader.load("./models/sign.fbx", function (object) {
    //     // object instanceof THREE.Group
    //     object.traverse(function (child) {
    //         if (child instanceof THREE.Mesh) {
    //             child.receiveShadow = true;
    //             child.receiveShadow = true;

    //             child.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
    //             if (child.name === "Circle") {
    //                 child.scale.set(2,2,2);
    //                 child.position.set(0, 0, 8);
    //             }
    //             else {
    //                 child.scale.set(.2,4,.2);
    //                 child.position.set(0, 0, 4);
    //             }
    //         }
    //     });
    //     // object.scale.set(.01, .01, .01);
    //     object.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
    //     object.applyMatrix(new THREE.Matrix4().makeRotationY(- Math.PI));
    //     object.position.x = 0;
    //     object.position.y = 0;
    //     object.position.z = -10;
    //     WORLD.scene.add(object);
    // }, onProgress, onError);

    // car model
    // fbxLoader.load("./models/fbx/car/car.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             child.castShadow = true;
    //             child.receiveShadow = true;

    //             child.position.set(10, 0, 10);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    // }, onProgress, onError );

    // bus_stop.fbx
    WORLD.fbxLoader.load("./models/fbx/bus_stop/bus_stop.FBX", function ( object ) {
        // object instanceof THREE.Group
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {

                child.scale.set(.03,.03,.03);
                if(child.name === "sign") {
                    child.position.set(-2, 2, 2);
                    child.rotateZ( Math.PI / 2 )
                }
                else {
                    child.position.set(0, 0, 0);
                }
                console.log("bus_stop:",child)

                if(child.name !== "sign") {
                    var childBody = addPhysicalBody(child, { mass: 0 });
                    WORLD.world.add(childBody);

                }

            }
        } );
        // WORLD.scene.add( object );
        // object.children.forEach(function(child) {
        //     if( child instanceof THREE.Mesh ) {

        //         var childBody = addPhysicalBody(child, { mass: 0 });
        //         WORLD.world.add(childBody);

        //     }
        // });
    }, onProgress, onError );

    // //village-house.fbx
    // fbxLoader.load("./models/fbx/village-house/village-house.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             // child.castShadow = true;
    //             // child.receiveShadow = true;

    //             child.scale.set(.5,.5,.5);
    //             child.position.set(-40, 0, 0);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    // }, onProgress, onError );


    // //Bench.fbx
    // fbxLoader.load("./models/fbx/Bench.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             child.scale.set(.01,.01,.01);
    //             child.position.set(-10, 0, -5);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    // }, onProgress, onError );

    // road-straight
    // fbxLoader.load("./models/fbx/road-straight/road-straight.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh && child.name === "Cylinder012" ) {

    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //             console.log("child",child)
    //             child.scale.set(.1,.1,.1);
    //             child.position.set(0, 0, 0);

    //         }
    //     } );
    //     object.scale.set(.1,.1,.1);
    //     WORLD.scene.add( object );
    // }, onProgress, onError );

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
    // var windStrength = Math.cos(time / 7000) * 20 + 40;
    // windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
    // windForce.normalize()
    // windForce.multiplyScalar(windStrength);

    // $("#message").text(compass(WORLD.camera.getWorldDirection(new THREE.Vector3(0, 0, 0))));
    // $("#message").text("Delta: " + (Date.now() - time));
    // $("#message").text("Velocity: " + WORLD.playerVelocity.length());

    if (dangerZoneBBox.containsPoint(WORLD.player.position)) {
        if (!isDangerous) {
            toastr.error("You're in the dangerous zone!");
            isDangerous = true;
        }
    }
    else {
        isDangerous = false;
    }

    WORLD.collidableObjects.forEach((object) => {
        if(object instanceof THREE.Sphere) {
            if (object.containsPoint(WORLD.player.position)) {
                console.log("Collideddddddd!");
            }
        }
    });
    WORLD.renderer.render(WORLD.scene, WORLD.camera);
    time = Date.now();

}

// function addModelToScene( geometry, materials ) 
// {
// 	// for preparing animation
// 	for (var i = 0; i < materials.length; i++)
// 		materials[i].morphTargets = true;

// 	var material = new THREE.MeshFaceMaterial( materials );
// 	mesh = new THREE.Mesh( geometry, material );
// 	mesh.scale.set(10,10,10);
// 	WORLD.scene.add( mesh );
// }

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

function addPhysicalBody(mesh, bodyOptions) {
    console.log("addPhysicalBody")
    var shape;
    // create a Sphere shape for spheres and thorus knots,
    // a Box shape otherwise
    if(mesh.geometry.boundingSphere !== null) {
        console.log("computeBoundingSphere")

        mesh.geometry.computeBoundingSphere();
        shape = new CANNON.Sphere(mesh.geometry.boundingSphere.radius);
    }
    else if(mesh.geometry.boundingBox) {
        console.log("computeBoundingBox")
        mesh.geometry.computeBoundingBox();
        var box = mesh.geometry.boundingBox;
        shape = new CANNON.Box(new CANNON.Vec3(
            (box.max.x - box.min.x) / 2,
            (box.max.y - box.min.y) / 2,
            (box.max.z - box.min.z) / 2
        ));
    }

    console.log("body")
    var body = new CANNON.Body(bodyOptions);
    body.addShape(shape);
    body.position.copy(mesh.position);
    body.computeAABB();
    // disable collision response so objects don't move when they collide
    // against each other
    body.collisionResponse = false;
    // keep a reference to the mesh so we can update its properties later
    body.mesh = mesh;

    body.addEventListener('collide', function (object) {
        console.log("addEventListener")
        if (object.body.id == 0)
            console.log("Collided!!", object.body);
    });
    return body;
};

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