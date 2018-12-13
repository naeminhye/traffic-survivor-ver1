var WORLD = WORLD || {};
var PLAYER = PLAYER || {
    status: {
        moving: false,
        health: 100,
        violation: 0,
        speed: 0
    }, 
    headLight: null
};
var UNITWIDTH = 9; // Width of a cubes in the maze
var UNITHEIGHT = 9; // Height of the cubes in the maze
var sphereShape, sphereBody, physicsMaterial, walls = [],
    balls = [],
    ballMeshes = [],
    boxes = [],
    boxMeshes = [];
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
WORLD.vehicleControls = [];
var dangerZoneMesh = null;
var dangerZoneGeometry = null;
WORLD.one_ways = [];
WORLD.intersects = [];
WORLD.roundabouts = [];
WORLD.speed_restriction_ways = [];
WORLD.endZone = [];
const objs = [];
var clock = new THREE.Clock();
WORLD.collidableObjects = [];
WORLD.regulatorySignList = [];
WORLD.warningSignList = [];
WORLD.guidanceSignList = [];
WORLD.trafficLightList = [];
WORLD.vehicle = [];
var initialPosition;
var infoBoxToggle = false;
WORLD.loaded = false;
WORLD.warningFlag = false;
WORLD.mapSize = 0;

var blocker = $('#blocker');
var instructions = $('#instructions');
GAME.menu = $("#game-menu");
GAME.controllers = $("#controllers");

GAME.hornSound = new Audio('/audio/horn/horn.mp3');

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            WORLD.controls.enabled = true;
            blocker.css("display", "none");
        } else {
            WORLD.controls.enabled = false;
            if (GAME.status !== "END") {
                blocker.css("display", "-webkit-box");
                blocker.css("display", "-moz-box");
                blocker.css("display", "box");
                // instructions.style.display = '';
                GAME.menu.css("display", "block");
            }
            if (GAME.status === "READY") {
                $("#restart-btn").css("display", "none");
                $("#instruction-btn").css("display", "inline-block");
            } else {
                $("#restart-btn").css("display", "inline-block");
                $("#instruction-btn").css("display", "none");
            }
            GAME.controllers.css("display", "none");
        }
    }

    var pointerlockerror = (event) => {
        // instructions.style.display = '';
        GAME.menu.css("display", "block");
        if (GAME.status === "READY") {
            $("#restart-btn").css("display", "none");
            $("#instruction-btn").css("display", "inline-block");
        } else {
            $("#restart-btn").css("display", "inline-block");
            $("#instruction-btn").css("display", "none");
        }
        GAME.controllers.css("display", "none");
    }

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    var resumeGame = (event) => {
        GAME.menu.css("display", "none");
        GAME.controllers.css("display", "block");
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
    };

    $("#start-btn").click(() => {
        if (GAME.status === "READY") {
            $("#start-btn").text("Resume");
            GAME.status = "PLAYING";
        }
        resumeGame();
    });

    $("#cancel-exit").click(() => {
        GAME.menu.css("display", "block");
        $("#exit-dialog").css("display", "none");
    });

    $("#exit-btn").click(() => {
        if (GAME.status !== "READY") {
            
            $("#exit-dialog").css("display", "block");
            GAME.menu.css("display", "none");
        } else {
            window.location.href = "/"
        }
    });

    $("#instruction-btn").click(() => {
        GAME.menu.css("display", "none");
        $("#key-instruction").css("display",  "block");
    });

    $("#instruction-close").click(() => {
        $("#key-instruction").css("display", "none");
        GAME.menu.css("display", "block");
    });

    // instructions.addEventListener('click', function (event) {
    //     instructions.style.display = 'none';

    //     // Ask the browser to lock the pointer
    //     element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    //     if (/Firefox/i.test(navigator.userAgent)) {

    //         var fullscreenchange = function (event) {

    //             if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

    //                 document.removeEventListener('fullscreenchange', fullscreenchange);
    //                 document.removeEventListener('mozfullscreenchange', fullscreenchange);

    //                 element.requestPointerLock();
    //             }

    //         }

    //         document.addEventListener('fullscreenchange', fullscreenchange, false);
    //         document.addEventListener('mozfullscreenchange', fullscreenchange, false);

    //         element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

    //         element.requestFullscreen();
    //     } else {
    //         element.requestPointerLock();
    //     }
    // }, false);
} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

if (!WORLD.loaded) {
    $("#blocker").css("display", "none");
    $("#loading").css("display", "block");
} else {
    $("#blocker").css("display", "block");
    $("#loading").css("display", "none");
}

WORLD.initCannon = () => {
    // Setup our world
    WORLD.world = new CANNON.World();
    WORLD.world.quatNormalizeSkip = 0;
    WORLD.world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    WORLD.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    WORLD.world.defaultContactMaterial.contactEquationRelaxation = 4;

    solver.iterations = 10;
    solver.tolerance = 0.1;
    var split = true;
    if (split)
        WORLD.world.solver = new CANNON.SplitSolver(solver);
    else
        WORLD.world.solver = solver;

    WORLD.world.gravity.set(0, -9.82, 0);
    WORLD.world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
        physicsMaterial,
        0.0, // friction coefficient
        0.3 // restitution
    );
    // We must add the contact materials to the world
    WORLD.world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
    var mass = 5,
        radius = 1.8;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({
        mass: mass
    });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(46, 1.8, 55);
    sphereBody.linearDamping = 0.9;
    WORLD.world.add(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({
        mass: 0
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    WORLD.world.add(groundBody);
}

WORLD.init = () => {

    WORLD.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    // WORLD.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);

    WORLD.scene = new THREE.Scene();
    // WORLD.scene.background = new THREE.Color(0xcce0ff);
    var cubeMap = loadCubemap('./images/textures/cubemap/', 'png');
    WORLD.scene.background = cubeMap;
    // WORLD.scene.fog = new THREE.Fog(0xffffff, 0, 300);

    // audio
    // var audioLoader = new THREE.AudioLoader();
    // var listener = new THREE.AudioListener();
    // WORLD.camera.add( listener );
    // WORLD.bgSound = new THREE.PositionalAudio( listener );
    // audioLoader.load( '/audio/motorcycle/motorcycleSound.mp3', function ( buffer ) {
    //         WORLD.bgSound.setBuffer( buffer );
    //         WORLD.bgSound.setRefDistance( 20 );
    //         WORLD.bgSound.setLoop( true );
    //         WORLD.bgSound.play();
    //     } );

    var ambient = new THREE.AmbientLight(0x111111);
    WORLD.scene.add(ambient);

    light = new THREE.SpotLight(0xffffff);
    light.position.set(10, 30, 20);
    light.target.position.set(0, 0, 0);

    if (true) {
        light.castShadow = true;

        light.shadow.camera.near = 20;
        light.shadow.camera.far = 50; //camera.far;
        light.shadow.camera.fov = 40;

        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadow.mapSize.width = 2 * 512;
        light.shadow.mapSize.height = 2 * 512;

        //light.shadowCameraVisible = true;
    }
    addSunlight(WORLD.scene);

    WORLD.controls = new PointerControls(WORLD.camera, sphereBody);
    WORLD.player = WORLD.controls.getObject();
    WORLD.scene.add(WORLD.player);
    WORLD.player.position.set(46, 1.3, 55);

    WORLD.scene.updateMatrixWorld(true);

    WORLD.loadMap();
    // addMirror();

    WORLD.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    // WORLD.renderer.gammaFactor = 2.2;
    // WORLD.renderer.gammaOutput = true;
    WORLD.renderer.shadowMap.enabled = true;
    WORLD.renderer.shadowMapSoft = true;
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    // WORLD.renderer.setClearColor(WORLD.scene.fog.color, 1);

    document.body.appendChild(WORLD.renderer.domElement);
    document.body.appendChild( WEBVR.createButton( WORLD.renderer ) );
    WORLD.renderer.vr.enabled = true;

    // $("#music").play();

    window.addEventListener('resize', onWindowResize, false);
}
 
function evolveSmoke(delta) {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}

function onWindowResize() {
    WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    WORLD.camera.updateProjectionMatrix();
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
}

var dt = 1 / 60;
WORLD.animate = () => {
    if(GAME.status !== "END") {
        WORLD.warningFlag = false;
        var playX = WORLD.player.position.x;
        var playY = WORLD.player.position.y;
        var playZ = WORLD.player.position.z;
        if (WORLD.player.position.x > WORLD.mapSize) {
            playX = WORLD.player.position.x - WORLD.mapSize;
        } else if (WORLD.player.position.x < 0) {
            playX = WORLD.player.position.x + WORLD.mapSize;
        }

        if (WORLD.player.position.z > WORLD.mapSize) {
            playZ = WORLD.player.position.z - WORLD.mapSize;
        } else if (WORLD.player.position.z < 0) {
            playZ = WORLD.player.position.z + WORLD.mapSize;
        }
        WORLD.player.position.set(playX, playY, playZ);
        sphereBody.position.set(playX, playY, playZ);

        requestAnimationFrame(WORLD.animate);

        if(GAME.status === "PLAYING") {
            if (WORLD.controls.enabled) {

                WORLD.world.step(dt);

                if (WORLD.vehicleControls.length > 0) {
                    WORLD.vehicleControls.forEach(function (control) {
                        // moving vehicles
                        control.update(Date.now() - time);
                    });
                }

                if (WORLD.trafficLightList.length > 0) {
                    WORLD.trafficLightList.forEach(function (light) {
                        // moving vehicles
                        light = updateSkinnedAnimation(light);
                    });
                }


            }

            PLAYER.pin = $("#player-pin");
            PLAYER.pin.css("left", (WORLD.player.position.x / GAME.realMapUnit) * GAME.miniMapUnit - 10);
            PLAYER.pin.css("top", (WORLD.player.position.z / GAME.realMapUnit) * GAME.miniMapUnit - 10);

            WORLD.controls.update(Date.now() - time);
            checkViolation();
            if (!WORLD.warningFlag) {
                $("#message").css("display", "none");
            }

            $("#speed").text(PLAYER.status.speed);
        }
        if(PLAYER.cubeCamera) {
            PLAYER.cubeCamera.update(WORLD.renderer, WORLD.scene);

            // position the camera in front of the camera
            
        }

        // THREE.GLTFLoader.Shaders.update(WORLD.scene, WORLD.camera);
        //evolveSmoke(Date.now() - time);
        WORLD.renderer.render(WORLD.scene, WORLD.camera);
        time = Date.now();
    }
}

const addMirror = () => {
    var geometry    = new THREE.SphereGeometry(0.5, 32, 16)
    var material    = new THREE.MeshPhongMaterial({
        color   : 'gold'
    })
    var mesh    = new THREE.Mesh(geometry, material)
    WORLD.scene.add( mesh )

    PLAYER.cubeCamera = new THREEx.CubeCamera(mesh)
    PLAYER.cubeCamera.object3d.position.set(
        25,
        1.7995464019372356,
        165
    );
    WORLD.scene.add(PLAYER.cubeCamera.object3d);
    material.envMap	= PLAYER.cubeCamera.textureCube
}

WORLD.detectCollision = () => {
    var flag = 0;
    WORLD.collidableObjects.forEach((object) => {
        if (object instanceof THREE.Sphere || object instanceof THREE.Box3) {
            if (object.containsPoint(WORLD.player.position)) {
                toastr.error("Collided!");
                flag++;
            }
        }
    });
    return flag;
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

function checkViolation() {

    signViolation(WORLD.warningSignList);
    signViolation(WORLD.regulatorySignList);
    signViolation(WORLD.guidanceSignList);

    if (WORLD.trafficLightList) {
        updateTrafficLights();
    }
    if (WORLD.one_ways) {
        checkOneWayViolation();
    }
    if (WORLD.speed_restriction_ways) {
        checkSpeedViolation();
    }

    if (WORLD.endZone) {
        WORLD.endZone.forEach((zone) => {
            if(zone.bbox.containsPoint(WORLD.player.position) /**  && GAME.numOfSign === 0 */) {
                setTimeout(function(){ 
                    GAME.endGame();
                }, 2000);
            }
        });
    }

    if(WORLD.roundabouts) {
        checkRoundaboutViolation();
    }

}

const signViolation = (list) => {

    var newList = list.filter((sign) => !sign.hasPassed);
    newList.forEach((sign) => {
            var angleDelta = calculateAngleToPlayer(new THREE.Vector3(
                sign.direction.x, 
                sign.direction.y, 
                sign.direction.z));

        var level = getUrlParameter('level');

        if (sign.object.position.distanceTo(WORLD.player.position) < 10 && !(Math.abs(minifyAngle(angleDelta)) <= 90)) {
            if (level === "easy") {
                console.log("--- " + new Date() + " --- Passed " + sign.object.name + "---");
                GAME.status = "PAUSED";

                $("#signDetail").show();
                document.addEventListener('keydown', (event) => {
                    let keyName = event.code;
                    if (keyName === 'Space') {
                        GAME.status = "PLAYING";
                        $("#signDetail").hide();
                    return;
                    }
                }, false);
            }
            //todo: show info 
            // $("#signImg").attr("src", "./images/sign_info/" + sign.sign_id + ".png")
            // GAME.passedSignList.push({sign: sign, time: new Date()});

            GAME.mapContext.fillStyle = "lightgreen";
            GAME.mapContext.beginPath(); //Start path
            GAME.mapContext.arc((sign.object.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (sign.object.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 4, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
            GAME.mapContext.fill();
            sign.hasPassed = true;
            GAME.numOfSign ++;

        }

    });
}

var trafficLightViolation = false;
var isInIntersectArea = false;
var isViolating = false;
const updateTrafficLights = () => {
    /** 
     * check Red Light violation
     */
    trafficLightViolation = (WORLD.trafficLightList.findIndex((light) => {
        var angleDelta = calculateAngleToPlayer(new THREE.Vector3(light.direction.x,
            light.direction.y,
            light.direction.z));
        return ((light.object.position.distanceTo(WORLD.player.position) < 10) 
        && (trafficLightViolation === false) 
        && (Math.abs(minifyAngle(angleDelta)) > 120)
        && light.currentStatus === "REDLIGHT");
    }) !== -1);

    /** kiểm tra xe player có đang ở trong vùng intersect nào không */
    isInIntersectArea = (WORLD.intersects.findIndex((child) => child.bbox.containsPoint(WORLD.player.position)) !== -1)

    /** _flag = true nếu đang ở trong vùng intersect */
    if (isInIntersectArea && trafficLightViolation && !isViolating) {
        GAME.handleFining("You have just blown through a red light!!", 100000);
        isViolating = true;
    }
    if (!isInIntersectArea && isViolating) {
        trafficLightViolation = false;
        isViolating = false;
    }
}

var speedViolating = false;
var speedRestrictionIndex = -1;
const checkSpeedViolation = () => {
    var newIndex = WORLD.speed_restriction_ways.findIndex((child) => child.bbox.containsPoint(WORLD.player.position));
    if(speedRestrictionIndex !== newIndex && newIndex !== -1 && !speedViolating) {
        var thisRoad = WORLD.speed_restriction_ways[newIndex];
        var angleDelta = calculateAngleToPlayer(new THREE.Vector3(thisRoad.direction.x,
            thisRoad.direction.y,
            thisRoad.direction.z));
        var message = null;
        if(((Math.abs(minifyAngle(angleDelta)) < 20) || (Math.abs(minifyAngle(angleDelta)) > 150))
        && thisRoad.max_speed !== null 
        && PLAYER.status.speed > thisRoad.max_speed) {
            speedViolating = true;
            speedRestrictionIndex = newIndex;

            message = "Vuot qua toc do toi da " + thisRoad.max_speed
        }
        if(((Math.abs(minifyAngle(angleDelta)) < 20) || (Math.abs(minifyAngle(angleDelta)) > 150))
        && thisRoad.min_speed !== null 
        && PLAYER.status.speed < thisRoad.min_speed) {
            speedViolating = true;
            speedRestrictionIndex = newIndex

            message = "Cham hon toc do toi thieu " + thisRoad.min_speed;
        }
        if (message) {
            GAME.handleFining(message, 100000);
        }

    }
    /** khi đi ra khỏi vùng cần xét tốc độ */
    else if (newIndex === -1 && speedViolating) {
        speedViolating = false;
        speedRestrictionIndex = newIndex;
    }
}

var roundaboutViolationFlag = false;
var roundaboutIndex = -1;
const checkRoundaboutViolation = () => {

    var oldIndex = roundaboutIndex;
    roundaboutIndex = WORLD.roundabouts.findIndex((sphere) => sphere.containsPoint(WORLD.player.position));

    if(oldIndex !== roundaboutIndex) {
        /** đi vào đường khác */
        roundaboutViolationFlag = false;
    }

    if ( roundaboutIndex === -1 ) {
        /** Không đi vào vòng xoay nào nên không cần xét */
        roundaboutViolationFlag = false;
    }
    else {
        if (!roundaboutViolationFlag) {
            GAME.handleFining("Riding violations performed within the roundabout!", 100000);
            roundaboutViolationFlag = true;
        }
    }
}

var violationFlag = false;
var oneWayIndex = -1;
const checkOneWayViolation = () => {

    var oldWay = oneWayIndex;
    /** kiểm tra xe player có đang ở trong vùng one way nào không */
    oneWayIndex = WORLD.one_ways.findIndex((child) => child.bbox.containsPoint(WORLD.player.position));

    if(oldWay !== oneWayIndex) {
        /** đi vào đường khác */
        violationFlag = false;
    }

    if ( oneWayIndex === -1 ) {
        /** Không đi vào đường ngược chiều nào nên không cần xét */
        violationFlag = false;
    }
    else {
        var thisRoad = WORLD.one_ways[oneWayIndex];
        var angleDelta = calculateAngleToPlayer(new THREE.Vector3(
            thisRoad.direction.x, 
            thisRoad.direction.y, 
            thisRoad.direction.z));

        if (!violationFlag && (Math.abs(minifyAngle(angleDelta)) > 90)) {
            toastr.error("You made a wrong turn and have entered a one way road!");
            $("#floating-info").addClass("shown");
            $("#floating-info").append("<span>-300000VNĐ</span>");
            $('#floating-info').animateCss('fadeOutUp', function () {
                // hide after animation
                var oldNum = Number($($(".money-number")[0]).text());
                var newNum = -300000;
                $($(".money-number")[0]).text(oldNum + newNum);
                $("#floating-info").empty();
                $("#floating-info").removeClass("shown");
            });
            violationFlag = true;
        }
    }

    // WORLD.one_ways.forEach(function (child) {
    //     var angleDelta = calculateAngleToPlayer(new THREE.Vector3(
    //                                                 child.direction.x, 
    //                                                 child.direction.y, 
    //                                                 child.direction.z));
    //     if (!violationFlag && child.bbox.containsPoint(WORLD.player.position) && (Math.abs(minifyAngle(angleDelta)) > 90)) {
    //         // var v = new THREE.Vector3();
    //         // var playerVector = WORLD.player.getWorldDirection(v);
    //         // var zoneVector = new THREE.Vector3(child.direction.x, child.direction.y, child.direction.z);
    //         // var playerAngle = THREE.Math.radToDeg(Math.atan2(playerVector.x, playerVector.z));
    //         // var zoneAngle = THREE.Math.radToDeg(Math.atan2(zoneVector.x, zoneVector.z));
    //         // var angleDelta = zoneAngle - playerAngle;
    //         console.log("Đi vào đường ngược chiều - Phạt tiền từ 300.000 đồng đến 400.000 đồng.");
    //         violationFlag = true;
    //         toastr.error("You made a wrong turn and have entered a one way road!");
    //     }
    //     else {
    //         // if (violationFlag) {
    //         //     violationFlag === false;
    //         // }
    //     }
    // });
}