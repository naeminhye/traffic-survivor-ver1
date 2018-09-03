// var sphereShape, sphereBody, world, physicsMaterial, walls = [], balls = [], ballMeshes = [], boxes = [], boxMeshes = [];

// var camera, scene, renderer;
// var geometry, material, mesh;
// var controls, time = Date.now();

// var blocker = document.getElementById('blocker');
// var instructions = document.getElementById('instructions');

// var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

// if (havePointerLock) {

//     var element = document.body;

//     var pointerlockchange = function (event) {

//         if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

//             controls.enabled = true;

//             blocker.style.display = 'none';

//         } else {

//             controls.enabled = false;

//             blocker.style.display = '-webkit-box';
//             blocker.style.display = '-moz-box';
//             blocker.style.display = 'box';

//             instructions.style.display = '';

//         }

//     }

//     var pointerlockerror = function (event) {
//         instructions.style.display = '';
//     }

//     // Hook pointer lock state change events
//     document.addEventListener('pointerlockchange', pointerlockchange, false);
//     document.addEventListener('mozpointerlockchange', pointerlockchange, false);
//     document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

//     document.addEventListener('pointerlockerror', pointerlockerror, false);
//     document.addEventListener('mozpointerlockerror', pointerlockerror, false);
//     document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

//     instructions.addEventListener('click', function (event) {
//         instructions.style.display = 'none';

//         // Ask the browser to lock the pointer
//         element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

//         if (/Firefox/i.test(navigator.userAgent)) {

//             var fullscreenchange = function (event) {

//                 if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

//                     document.removeEventListener('fullscreenchange', fullscreenchange);
//                     document.removeEventListener('mozfullscreenchange', fullscreenchange);

//                     element.requestPointerLock();
//                 }

//             }

//             document.addEventListener('fullscreenchange', fullscreenchange, false);
//             document.addEventListener('mozfullscreenchange', fullscreenchange, false);

//             element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

//             element.requestFullscreen();

//         } else {

//             element.requestPointerLock();

//         }

//     }, false);

// } else {

//     instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

// }

initCannon();
init();
animate();

// function initCannon() {
//     // Setup our world
//     world = new CANNON.World();
//     world.quatNormalizeSkip = 0;
//     world.quatNormalizeFast = false;

//     var solver = new CANNON.GSSolver();

//     world.defaultContactMaterial.contactEquationStiffness = 1e9;
//     world.defaultContactMaterial.contactEquationRelaxation = 4;

//     solver.iterations = 7;
//     solver.tolerance = 0.1;
//     var split = true;
//     if (split)
//         world.solver = new CANNON.SplitSolver(solver);
//     else
//         world.solver = solver;

//     world.gravity.set(0, -20, 0);
//     world.broadphase = new CANNON.NaiveBroadphase();

//     // Create a slippery material (friction coefficient = 0.0)
//     physicsMaterial = new CANNON.Material("slipperyMaterial");
//     var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
//         physicsMaterial,
//         0.0, // friction coefficient
//         0.3  // restitution
//     );
//     // We must add the contact materials to the world
//     world.addContactMaterial(physicsContactMaterial);

//     // Create a sphere
//     var mass = 5, radius = 1.3;
//     sphereShape = new CANNON.Sphere(radius);
//     sphereBody = new CANNON.Body({ mass: mass });
//     sphereBody.addShape(sphereShape);
//     sphereBody.position.set(0, 5, 0);
//     sphereBody.linearDamping = 0.9;
//     world.add(sphereBody);

//     // Create a plane
//     var groundShape = new CANNON.Plane();
//     var groundBody = new CANNON.Body({ mass: 0 });
//     groundBody.addShape(groundShape);
//     groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
//     world.add(groundBody);
// }

// function init() {

//     camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

//     scene = new THREE.Scene();
//     scene.fog = new THREE.Fog(0x000000, 0, 500);

//     var ambient = new THREE.AmbientLight(0x111111);
//     scene.add(ambient);

//     light = new THREE.SpotLight(0xffffff);
//     light.position.set(10, 30, 20);
//     light.target.position.set(0, 0, 0);
//     if (true) {
//         light.castShadow = true;

//         light.shadow.camera.near = 20;
//         light.shadow.camera.far = 50;//camera.far;
//         light.shadow.camera.fov = 40;

//         light.shadowMapBias = 0.1;
//         light.shadowMapDarkness = 0.7;
//         light.shadow.mapSize.width = 2 * 512;
//         light.shadow.mapSize.height = 2 * 512;

//         //light.shadowCameraVisible = true;
//     }
//     scene.add(light);

//     controls = new PointerLockControls(camera, sphereBody);
//     scene.add(controls.getObject());

//     var floorTexture = new THREE.TextureLoader().load('./images/floor.jpg');
//     floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
//     floorTexture.repeat.set(256, 256);

//     // floor
//     geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
//     geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

//     // material = new THREE.MeshLambertMaterial( { color: 0xeeee00 } );
//     material = new THREE.MeshBasicMaterial({ map: floorTexture });

//     mesh = new THREE.Mesh(geometry, material);
//     mesh.castShadow = true;
//     mesh.receiveShadow = true;
//     scene.add(mesh);

//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMapSoft = true;
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(scene.fog.color, 1);

//     document.body.appendChild(renderer.domElement);

//     window.addEventListener('resize', onWindowResize, false);

//     // Add boxes
//     var halfExtents = new CANNON.Vec3(1, 1, 1);
//     var boxShape = new CANNON.Box(halfExtents);
//     var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
//     for (var i = 0; i < 1; i++) {
//         var x = 20;
//         var y = 1;
//         var z = 20;
//         var boxBody = new CANNON.Body({ mass: 5 });
//         boxBody.addShape(boxShape);
//         // var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
//         material2 = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
//         var boxMesh = new THREE.Mesh(boxGeometry, material2);
//         world.add(boxBody);
//         scene.add(boxMesh);
//         boxBody.position.set(x, y, z);
//         boxMesh.position.set(x, y, z);
//         boxMesh.castShadow = true;
//         boxMesh.receiveShadow = true;
//         boxes.push(boxBody);
//         boxMeshes.push(boxMesh);
//     }
// }

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// }

// var dt = 1 / 60;
// function animate() {
//     requestAnimationFrame(animate);
//     if (controls.enabled) {
//         world.step(dt);

//         // Update ball positions
//         for (var i = 0; i < balls.length; i++) {
//             ballMeshes[i].position.copy(balls[i].position);
//             ballMeshes[i].quaternion.copy(balls[i].quaternion);
//         }

//         // Update box positions
//         for (var i = 0; i < boxes.length; i++) {
//             boxMeshes[i].position.copy(boxes[i].position);
//             boxMeshes[i].quaternion.copy(boxes[i].quaternion);
//         }
//     }

//     controls.update(Date.now() - time);
//     renderer.render(scene, camera);
//     time = Date.now();

// }