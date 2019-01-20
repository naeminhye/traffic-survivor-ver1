var WORLD = WORLD || {};
var PLAYER = PLAYER || {
    status: {
        moving: false,
        health: 100,
        violation: 0,
        speed: 0
    }, 
    headLight: null,
    position: new THREE.Vector3(0, 0, 0)
};
var UNITWIDTH = 9; // Width of a cubes in the maze
var UNITHEIGHT = 9; // Height of the cubes in the maze
var sphereShape, sphereBody, physicsMaterial, walls = [];
WORLD.world = null;
WORLD.camera = null;
WORLD.scene = null;
WORLD.renderer = null;
WORLD.player = null;
var target = new THREE.Vector3(20, 0, -50);
var geometry, material, mesh;
var time = Date.now();
WORLD.controls = null;
WORLD.vehicleControls = [];
WORLD.one_ways = [];
WORLD.intersects = [];
WORLD.roundabouts = [];
WORLD.speed_restriction_ways = [];
WORLD.endZone = [];
var clock = new THREE.Clock();
WORLD.collidableObjects = [];
WORLD.regulatorySignList = [];
WORLD.warningSignList = [];
WORLD.guidanceSignList = [];
WORLD.trafficLightList = [];
WORLD.vehicle = [];
WORLD.loaded = false;
WORLD.warningFlag = false;
WORLD.mapSize = 0;
GAME.cameraMode = 0;
// 0 rider's view
// 1 the view after the rider
// 2 the upper view

$("#start-btn").click(() => {
    if (GAME.status === "READY") {
        $("#start-btn").text("Tiếp tục");
        GAME.startTime = new Date();

        // save passed lesson
        var learningLessons = localStorage.getObject("learningLessons") ? localStorage.getObject("learningLessons") : [];
        if(!learningLessons.includes(currentChapter)){
            learningLessons.push(currentChapter)
            localStorage.setObject("learningLessons", learningLessons);
        }

    }
    GAME.resumeGame();
});

$("#cancel-exit").click(() => {
    GAME.menu.css("display", "block");
    $("#exit-dialog").css("display", "none");
});

$("#exit-btn").click(() => {
    if (GAME.status !== "READY") {
        GAME.menu.css("display", "none");
        $("#exit-dialog").css("display", "block");
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

if (!WORLD.loaded) {
    GAME.blocker.css("display", "none");
    $("#loading").css("display", "block");
} else {
    GAME.blocker.css("display", "block");
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
    WORLD.scene.fog = new THREE.Fog(0x000000, 0, 300);

    var ambient = new THREE.AmbientLight(0x111111);
    // WORLD.scene.add(ambient);

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
    // addSunlight(WORLD.scene);

    WORLD.controls = new Controls(WORLD.camera, sphereBody);
    WORLD.player = WORLD.controls.getObject();
    WORLD.scene.add(WORLD.player);

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
    
    const gameOptions = localStorage.getObject("gameOptions") ? localStorage.getObject("gameOptions") : [];
    if( gameOptions.hasOwnProperty("webvrMode") && gameOptions["webvrMode"] ) {
        document.body.appendChild( WEBVR.createButton( WORLD.renderer ) );
        WORLD.renderer.vr.enabled = true;
    }

    //////////////////////////////////////////////////////////////////////////////////
	//		use THREEx.RendererStats					//
	//////////////////////////////////////////////////////////////////////////////////
	GAME.rendererStats	= new THREEx.RendererStats()
	GAME.rendererStats.domElement.style.position	= 'absolute'
	GAME.rendererStats.domElement.style.left	= '0px'
	GAME.rendererStats.domElement.style.bottom	= '0px'
	// document.body.appendChild( GAME.rendererStats.domElement )
    
    GAME.stats = new Stats();
    GAME.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild( GAME.stats.dom );

    // $("#music").play();

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('vrdisplayactivate', () => {
        WORLD.renderer.vr.getDevice().requestPresent( [ { source: WORLD.renderer.domElement } ] );
    }, false);

    document.addEventListener('keydown', ( event ) => {
        if(event.keyCode === 27 && GAME.status === "PLAYING") { // ESC
            GAME.status = "PAUSED";
        }
        else if((event.keyCode === 48 || event.keyCode === 96) && GAME.status === "PLAYING" && GAME.enableCameraChange) {
            GAME.cameraMode = 0;
            
            WORLD.camera.position.set(0, 0, 0);
            WORLD.camera.rotation.set(0, 0, 0);
        }
        else if((event.keyCode === 49 || event.keyCode === 97) && GAME.status === "PLAYING" && GAME.enableCameraChange) {
            GAME.cameraMode = 1;

            WORLD.camera.position.set(0, 0, 10);
            WORLD.camera.rotation.set(0, 0, 0);
        }
        else if((event.keyCode === 50 || event.keyCode === 98) && GAME.status === "PLAYING" && GAME.enableCameraChange) {
            GAME.cameraMode = 2;

            WORLD.camera.position.set(0, 10, 20);
            WORLD.camera.rotation.set(- Math.PI/8, 0, 0);
        }
        else if((event.keyCode === 51 || event.keyCode === 99) && GAME.status === "PLAYING" && GAME.enableCameraChange) {
            GAME.cameraMode = 3;

            WORLD.camera.position.set(0, 20, 20);
            WORLD.camera.rotation.set(- Math.PI/4, 0, 0);
        }
        else if((event.keyCode === 52 || event.keyCode === 100) && GAME.status === "PLAYING" && GAME.enableCameraChange) {
            GAME.cameraMode = 4;

            WORLD.camera.position.set(0, 20, -8);
            WORLD.camera.rotation.set(- Math.PI/2, 0, 0);
        }
    }, false);
    window.onblur = function() { 
        if(GAME.status === "PLAYING") {
            GAME.status = "PAUSED"; 
        }
    }
}

const onWindowResize = () => {
    WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    WORLD.camera.updateProjectionMatrix();
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
}

var dt = 1 / 60;
WORLD.animate = () => {
    
    setTimeout( function() {
        
        requestAnimationFrame(WORLD.animate);

    }, 1000 / 30 );

    GAME.updateStatusChange();
    if(GAME.status !== "END") {
        GAME.stats.begin();

        WORLD.warningFlag = false;
        var playerX = WORLD.player.position.x;
        var playerY = WORLD.player.position.y;
        var playerZ = WORLD.player.position.z;
        if (WORLD.player.position.x > WORLD.mapSize) {
            playerX = WORLD.player.position.x - WORLD.mapSize;
        } else if (WORLD.player.position.x < 0) {
            playerX = WORLD.player.position.x + WORLD.mapSize;
        }

        if (WORLD.player.position.z > WORLD.mapSize) {
            playerZ = WORLD.player.position.z - WORLD.mapSize;
        } else if (WORLD.player.position.z < 0) {
            playerZ = WORLD.player.position.z + WORLD.mapSize;
        }
        WORLD.player.position.set(playerX, playerY, playerZ);
        sphereBody.position.set(playerX, playerY, playerZ);

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
            // WORLD.controls.detectCollision()
            checkViolation();
            if (!WORLD.warningFlag) {
                $("#message").css("display", "none");
            }

            $("#speed").text((PLAYER.status.speed * GAME.stats.getFPS()).toFixed(1));
        }

        GAME.stats.end();
        // GAME.rendererStats.update(WORLD.renderer);
        WORLD.renderer.render(WORLD.scene, WORLD.camera);
        // if(GAME.stats.getFPS() > 40)
            // console.log("_fps ---", GAME.stats.getFPS())
        time = Date.now();
    }
}

const addMirror = () => {
    // reflectors/mirrors

    var geometry = new THREE.PlaneBufferGeometry( 1, 0.5 );
    WORLD.verticalMirror = new THREE.Reflector( geometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x889999,
        recursion: 1
    } );
    WORLD.verticalMirror.position.y = 5;
    WORLD.scene.add( WORLD.verticalMirror );

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

const checkViolation = () => {

    handleSignPassing(WORLD.warningSignList);
    handleSignPassing(WORLD.regulatorySignList);
    handleSignPassing(WORLD.guidanceSignList);

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

const handleSignPassing = (list) => {

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
                GAME.status = "STOP";

                //todo: show info 
                $("#signImg").attr("src", "./images/sign_info/" + sign.sign_id + ".png")
                $("#signDetail").show();
                $("#controllers").hide();
                document.addEventListener('keydown', (event) => {
                    let keyName = event.code;
                    if (keyName === 'Space') {
                        GAME.status = "PLAYING";
                        $("#signDetail").hide();
                        $("#controllers").show();
                    return;
                    }
                }, false);
            }
            GAME.passedSignList.push({sign: sign, time: new Date()});

            GAME.mapContext.fillStyle = "lightgreen";
            GAME.mapContext.beginPath(); //Start path
            GAME.mapContext.arc((sign.object.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (sign.object.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 4, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
            GAME.mapContext.fill();
            sign.hasPassed = true;
            GAME.numOfSign ++;
            $("#health-number").text(GAME.numOfSign + "/" + GAME.totalNumOfSign);
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
        GAME.handleFining("Bạn vừa vượt đèn đỏ!", 100);
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
            GAME.handleFining(message, 100);
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
            GAME.handleFining("Đi sai đường tại vòng xuyến!", 100000);
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
            GAME.handleFining("Bạn vừa đi vào đường một chiều, vui lòng thay đổi hướng đi!", 300);
            violationFlag = true;
        }
    }
}