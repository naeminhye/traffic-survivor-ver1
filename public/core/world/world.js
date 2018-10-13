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
WORLD.dangerZones = [];
const objs = [];
var clock = new THREE.Clock();
WORLD.collidableObjects = [];
WORLD.streetSignList = [];
WORLD.vehicle = [];
var initialPosition;
var infoBoxToggle = false; 

// Flag to determine if the player lost the game
var gameOver = false;

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
    sphereBody.position.set(46, 1.3 , 55);
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
    WORLD.player.position.set(46, 1.3 , 55);
    // WORLD.lookAt()
    // WORLD.player.rotateY(Math.PI / 2);

    WORLD.scene.updateMatrixWorld(true);

    WORLD.loadMap();

    WORLD.renderer = new THREE.WebGLRenderer({ antialias: true });
    WORLD.renderer.shadowMap.enabled = true;
    WORLD.renderer.shadowMapSoft = true;
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.setClearColor(WORLD.scene.fog.color, 1);

    document.body.appendChild(WORLD.renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
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
    // animateVehicle(Date.now() - time);
    
    checkDistance();

    // var windStrength = Math.cos(time / 7000) * 20 + 40;
    // windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
    // windForce.normalize()
    // windForce.multiplyScalar(windStrength);

    // $("#message").text(compass(WORLD.camera.getWorldDirection(new THREE.Vector3(0, 0, 0))));
    // $("#message").text("Delta: " + (Date.now() - time));

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
        
        if (sign.object.position.distanceTo(WORLD.player.position) < 5) {

            var v = new THREE.Vector3();
            var playerVector = WORLD.player.getWorldDirection(v);
            var signVector = new THREE.Vector3(sign.direction.x, sign.direction.y, sign.direction.z);
            var playerAngle  = THREE.Math.radToDeg(Math.atan2(playerVector.x, playerVector.z));
            var signAngle  = THREE.Math.radToDeg(Math.atan2(signVector.x, signVector.z));
            var angleDelta = signAngle - playerAngle;
            if(!(Math.abs(minifyAngle(angleDelta)) <= 90)) {
                $("#infoBox").find("img").attr("src", sign.infoImg);
                $("#infoBox").dialog("open");

                // $("#signDetail").find("img").attr("src", sign.infoImg);
                // $("#signDetail").css("display", "block")
            }

        } 

    });
    
    if(WORLD.dangerZones) {
        WORLD.dangerZones.forEach(function(child) {
            if (child.bbox.containsPoint(WORLD.player.position)) {
                var v = new THREE.Vector3();
                var playerVector = WORLD.player.getWorldDirection(v);
                var zoneVector = new THREE.Vector3(child.direction.x, child.direction.y, child.direction.z);
                var playerAngle  = THREE.Math.radToDeg(Math.atan2(playerVector.x, playerVector.z));
                var zoneAngle  = THREE.Math.radToDeg(Math.atan2(zoneVector.x, zoneVector.z));
                var angleDelta = zoneAngle - playerAngle;
                
                if(!(Math.abs(minifyAngle(angleDelta)) <= 90)) {
                    //toastr.error("WRONGGGG!");
                    // $("infoImg").attr("src", child.infoImg);
                    console.log("Phạt tiền từ 300.000 đồng đến 400.000 đồng.");
                }
                else {
                    // $("#infoBox").dialog("close");
                }
                
            }
        });
    }
}

function animateVehicle(delta) {

    WORLD.scene.getObjectByName("bus_2") ? WORLD.scene.getObjectByName("bus_2").position.x += 0.2 : null;
    WORLD.scene.getObjectByName("bus") ? WORLD.scene.getObjectByName("bus").position.z += 0.2 : null;
    WORLD.scene.getObjectByName("car") ? WORLD.scene.getObjectByName("car").position.z -= 0.2 : null;
    WORLD.scene.getObjectByName("car2") ? WORLD.scene.getObjectByName("car2").position.z += 0.2 : null;
    
}