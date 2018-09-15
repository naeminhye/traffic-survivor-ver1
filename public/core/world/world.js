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
const objs = [];
var clock = new THREE.Clock();

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

    WORLD.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

    WORLD.scene = new THREE.Scene();
    WORLD.scene.background = new THREE.Color(0xcce0ff);
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

    // Add boxes
    // var halfExtents = new CANNON.Vec3(1, 1, 1);
    // var boxShape = new CANNON.Box(halfExtents);
    // var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    // for (var i = 0; i < 2; i++) {
    //     var x = (Math.random()-0.5)*20;
    //     var y = 1 + (Math.random()-0.5)*1;
    //     var z = (Math.random()-0.5)*20;
    //     var boxBody = new CANNON.Body({ mass: 5 });
    //     boxBody.addShape(boxShape);
    //     var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    //     material2 = new THREE.MeshLambertMaterial({ color: randomColor });
    //     var boxMesh = new THREE.Mesh(boxGeometry, material2);
    //     WORLD.world.add(boxBody);
    //     WORLD.scene.add(boxMesh);
    //     boxBody.position.set(x, y, z);
    //     boxMesh.position.set(x, y, z);
    //     boxMesh.castShadow = true;
    //     boxMesh.receiveShadow = true;
    //     boxes.push(boxBody);
    //     boxMeshes.push(boxMesh);
    //     boxBody.addEventListener('collide', function(object) {
    //         // if(object.body.id == 0) 
    //         //     console.log("Collided!!", object.body);
    //     });
    // }

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

    var poleGeo = new THREE.CubeGeometry(.3, 60, .3);
    var poleMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 100, flatShading: false });

    var mesh = new THREE.Mesh(poleGeo, poleMat);
    mesh.position.set(20, 0, -50);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    WORLD.scene.add(mesh);
    var meshBody = addPhysicalBody(mesh, { mass: 5 });
    WORLD.world.add(meshBody);


    var gg = new THREE.CubeGeometry(1, 1, 1);
    var mesh = new THREE.Mesh(gg, poleMat);
    mesh.position.set(20, 0, -50);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    WORLD.scene.add(mesh);
    var meshBody = addPhysicalBody(mesh, { mass: 5 });
    WORLD.world.add(meshBody);

    /* fbxLoader */
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
        console.log(xhr);
    };
    var fbxLoader = new THREE.FBXLoader(manager);

    // instantiate a loader
    var loader = new THREE.JSONLoader();

    // load a resource
    loader.load(
        // resource URL
        './models/json/cubetest.json',

        // onLoad callback
        function ( geometry, materials ) {
            var material = materials[ 1 ];
            var object = new THREE.Mesh( geometry, material );
            WORLD.scene.add( object );
        },

        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError callback
        function( err ) {
            console.log( 'An error happened' );
        }
    );
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
    // fbxLoader.load("./models/sign.fbx", function (object) {
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

    // fbxLoader.load("./models/fbx/traffic-light/traffic-light.fbx", function ( object ) {
    //     // model is a THREE.Group (THREE.Object3D)                              
    //     const mixer = new THREE.AnimationMixer(object);
    //     // animations is a list of THREE.AnimationClip                          
    //     mixer.clipAction(object.animations[0]).play();

    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             child.scale.set(.1,.1,.1)
    //             child.position.set(10, 0, -10);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    // }, onProgress, onError );

    // fbxLoader.load("./models/fbx/parking-sign/parkingsign.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             child.scale.set(.025,.025,.025)
    //             child.position.set(-10, 0, -10);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    // }, onProgress, onError );

    // fbxLoader.load("./models/fbx/speed-limit-sign/speedlimitsign.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             // child.castShadow = true;
    //             // child.receiveShadow = true;

    //             child.scale.set(.025,.025,.025)
    //             child.position.set(-10, 0, -20);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    //     objs.push({model, mixer});
    // }, onProgress, onError );

    // fbxLoader.load("./models/fbx/basic-park-bench/chair.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             // child.castShadow = true;
    //             // child.receiveShadow = true;

    //             child.scale.set(.1,.1,.1)
    //             child.position.set(-20, 0, -20);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    // }, onProgress, onError );

    // car model
    fbxLoader.load("./models/fbx/car/car.fbx", function ( object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

                child.position.set(10, 0, 10);

            }
        } );
        WORLD.scene.add( object );
    }, onProgress, onError );

    // // bus_stop.fbx
    // fbxLoader.load("./models/fbx/bus_stop/bus_stop.FBX", function ( object ) {
    //     // object instanceof THREE.Group
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             child.scale.set(.03,.03,.03);
    //             if(child.name === "sign") {
    //                 child.position.set(-2, 2, 2);
    //                 child.rotateZ( Math.PI / 2 )
    //             }
    //             else {
    //                 child.position.set(0, 0, 0);
    //             }
    //             console.log("bus_stop:",child)

    //         }
    //     } );
    //     WORLD.scene.add( object );
    // }, onProgress, onError );

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

    // //trees
    // fbxLoader.load("./models/fbx/tree1/Tree.fbx", function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {

    //             // child.castShadow = true;
    //             // child.receiveShadow = true;

    //             child.position.set(-10, 0, 0);

    //         }
    //     } );
    //     WORLD.scene.add( object );
    //     objs.push({model, mixer});
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

    /* OBJ MODEL */

    // var onProgress = function (xhr) {

    //     if (xhr.lengthComputable) {

    //         var percentComplete = xhr.loaded / xhr.total * 100;
    //         console.log(Math.round(percentComplete, 2) + '% downloaded');

    //     }

    // };

    // var onError = function (xhr) { };

    // THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    // new THREE.MTLLoader()
    //     .setPath('./models/obj/tree3/')
    //     .load('Tree.mtl', function (materials) {

    //         materials.preload();

    //         new THREE.OBJLoader()
    //             .setMaterials(materials)
    //             .setPath('./models/obj/tree3/')
    //             .load('Tree.obj', function (object) {
    //                 object.traverse(function (child) {

    //                     if (child instanceof THREE.Mesh) {
    //                         child.scale.set(.5,.5,.5);
    //                         child.position.set(10, 0, 0);
    //                     }

    //                 });
    //                 object.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    //                 object.scale.x = .05;
    //                 object.scale.y = .05;
    //                 object.scale.z = .05;

    //                 WORLD.scene.add(object);

    //             }, onProgress, onError);

    //     });

    // // texture
    // var manager = new THREE.LoadingManager();
    // manager.onProgress = function (item, loaded, total) {

    //     console.log(item, loaded, total);

    // };

    // var texture = new THREE.Texture();

    // var onProgress = function (xhr) {
    //     if (xhr.lengthComputable) {
    //         var percentComplete = xhr.loaded / xhr.total * 100;
    //         console.log(Math.round(percentComplete, 2) + '% downloaded');
    //     }
    // };

    // var onError = function (xhr) { };

    // var loader = new THREE.ImageLoader(manager);
    // loader.load('data:image/jpg;base64,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', function (image) {

    //     texture.image = image;
    //     texture.needsUpdate = true;

    // });

    // // model
    // var objLoader = new THREE.OBJLoader(manager);
    // objLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/286022/Bulbasaur.obj', function (object) {

    //     object.traverse(function (child) {

    //         if (child instanceof THREE.Mesh) {

    //             child.material.map = texture;

    //         }

    //     });

    //     object.scale.x = 5;
    //     object.scale.y = 5;
    //     object.scale.z = 5;
    //     object.rotation.y = 3;
    //     object.position.y = 0;
    //     WORLD.scene.add(object);

    // }, onProgress, onError);
}

function onWindowResize() {
    WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    WORLD.camera.updateProjectionMatrix();
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
}

var dt = 1 / 60;
WORLD.animate = function () {
    requestAnimationFrame(WORLD.animate);
    if (controls.enabled) {

        WORLD.world.step(dt);
    }

    controls.update(Date.now() - time);
    var windStrength = Math.cos(time / 7000) * 20 + 40;
    windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
    windForce.normalize()
    windForce.multiplyScalar(windStrength);

    $("#message").text("You are now " + Math.round(WORLD.player.position.distanceTo(target)) + "m far away from the final place.");

    if (dangerZoneBBox.containsPoint(WORLD.player.position)) {
        if (!isDangerous) {
            toastr.error("You're in the dangerous zone!");
            isDangerous = true;
        }
    }
    else {
        isDangerous = false;
    }
    // animation with THREE.AnimationMixer.update(timedelta)                
    objs.forEach(({ mixer }) => { mixer.update(clock.getDelta()); });

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

    body.addEventListener('collide', function (object) {
        if (object.body.id == 0)
            console.log("Collided!!", object.body);
    });
    return body;
};