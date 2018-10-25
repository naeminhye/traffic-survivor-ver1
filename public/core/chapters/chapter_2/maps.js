/** All maps of chapter Test */

/** Level Test */

var PAVEMENT_ID = "0";
var ROAD_POS_Z = "1";
var ROAD_POS_X = "-1";
var RESIDENTAL_BUILDING_ID = "2";
var OFFICE_BUILDING_ID = "3";
var GRASS_ID = "4";
var START = "S";
var END = "E";
var BLOCKED_POS_Z = "X";
var BLOCKED_POS_X = "-X";
var PAVEMENT_HEIGHT = 0.1;
var INTERSECT_1 = "I1";
var INTERSECT_2 = "I2";
var INTERSECT_3 = "I3";
var INTERSECT_4 = "I4";
var INTERSECT_5 = "I5";
var ZEBRA_CROSSING_TOP = "ZT";
var ZEBRA_CROSSING_BOTTOM = "ZB";
var ZEBRA_CROSSING_LEFT = "ZL";
var ZEBRA_CROSSING_RIGHT = "ZR";
var PARKING_LOT = "P";

var drawGround = function () {
    var residentTexture = WORLD.textureLoader.load("/images/residential.jpg");
    var glassTexture = WORLD.textureLoader.load("/images/glass.jpg");

    readMapInfoFromJson("./core/chapters/chapter_2/chapter_2.json", (result) => {
        var mapInfo = JSON.parse(result);
        var UNIT_SIZE = mapInfo.size;

        // load player's initial position
        WORLD.player.position.set(mapInfo.player.position.x, mapInfo.player.position.y, mapInfo.player.position.z);
        sphereBody.position.set(mapInfo.player.position.x, mapInfo.player.position.y, mapInfo.player.position.z);

        /** load pavement and road */
        var roadMap = readMapFromFile(mapInfo.map_url);

        loadTextureToGround(ROAD_POS_Z, './images/textures/roadposz_1.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(ROAD_POS_X, './images/textures/roadposx_1.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(INTERSECT_1, './images/textures/intersect_1.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(INTERSECT_2, './images/textures/intersect_2.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(INTERSECT_3, './images/textures/intersect_3.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(INTERSECT_4, './images/textures/intersect_4.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(INTERSECT_5, './images/textures/intersect_5.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(PAVEMENT_ID, './images/textures/pavement.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(ZEBRA_CROSSING_TOP, './images/textures/zebra_crossing_top.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(ZEBRA_CROSSING_BOTTOM, './images/textures/zebra_crossing_bottom.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(ZEBRA_CROSSING_LEFT, './images/textures/zebra_crossing_left.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(ZEBRA_CROSSING_RIGHT, './images/textures/zebra_crossing_right.jpg', roadMap, UNIT_SIZE, false);
        loadTextureToGround(GRASS_ID, './images/grass.jpg', roadMap, UNIT_SIZE, true);
        loadTextureToGround(PARKING_LOT, './images/textures/paving-cobblestones.jpg', roadMap, UNIT_SIZE, true);


        findSubMap(roadMap, RESIDENTAL_BUILDING_ID).forEach(function (tile) {
            /** residental buildings */
            var texture = residentTexture;
            var buildingMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });
            buildingMaterial.map.wrapS = buildingMaterial.map.wrapT = THREE.RepeatWrapping;
            buildingMaterial.map.repeat.set(UNIT_SIZE, 1);

            buildingMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();

            var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE) / 2;
            var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2

            var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, UNIT_SIZE * 2, tile.size * UNIT_SIZE), buildingMaterial);
            // Set the cube position
            cube.position.set(buildingXWidth, UNIT_SIZE, buildingZWidth);
            // Add the cube
            WORLD.scene.add(cube);
            WORLD.world.add(createBoxBody(cube, function (object) {
                if (object.body.id == 0)
                    console.log("Player collided with walls.");
            }));
        });

        findSubMap(roadMap, OFFICE_BUILDING_ID).forEach(function (tile) {
            /** residental buildings */
            var texture = glassTexture;
            var buildingMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });
            buildingMaterial.map.wrapS = buildingMaterial.map.wrapT = THREE.RepeatWrapping;
            buildingMaterial.map.repeat.set(UNIT_SIZE, 1);

            buildingMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();

            var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE) / 2;
            var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2

            var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, UNIT_SIZE * 4, tile.size * UNIT_SIZE), buildingMaterial);
            // Set the cube position
            cube.position.set(buildingXWidth, UNIT_SIZE * 2, buildingZWidth);
            // Add the cube
            WORLD.scene.add(cube);
            WORLD.world.add(createBoxBody(cube, function (object) {
                if (object.body.id == 0)
                    console.log("Player collided with walls.");
            }));
        });
    })
}

/**
 * 
 * @param {*} id // ID of each texture type
 * @param {*} url // Texture url
 * @param {*} map 
 */
const loadTextureToGround = (id, url, map, unit_size, isMultiple, callback) => {
    findSubMap(map, id).forEach(function (tile) {
        var PLANE_X = ((2 * tile.x + tile.size - 1) * unit_size) / 2;
        var PLANE_Z = ((2 * tile.z + tile.size - 1) * unit_size) / 2;
        var material = new THREE.MeshBasicMaterial({
            map: WORLD.textureLoader.load(url)
        });
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        if (isMultiple) {
            material.map.repeat.set(tile.size, tile.size);
        }
        else {
            material.map.repeat.set(1, 1);
        }
        material.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(tile.size * unit_size, tile.size * unit_size),
            material
        );
        plane.position.set(PLANE_X, 0, PLANE_Z)
        plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
        WORLD.scene.add(plane);

        if (callback) {
            WORLD.world.add(createBoxBody(plane, callback));
        }
    });
}

function loadModels() {

    var models = [
        {
            name: "sedan_car",
            loader_type: "gltf",
            // object_type: "vehicle",
            scale: new THREE.Vector3(.8, .8, .8),
            position: new THREE.Vector3(32 * 5, 0, 0 * 5),
            url: "./models/gltf/cars/sedan_car/scene.gltf",
            animate: false,
            castShadow: true,
            receiveShadow: true,
            // path: new THREE.CatmullRomCurve3([
            //     new THREE.Vector3(32 * 5, 0, 0 * 5),
            //     new THREE.Vector3(32 * 5, 0, 66 * 5)
            // ]),
            // velocity: 0.01
        },
        {
            name: "mobile_diner",
            loader_type: "gltf",
            // object_type: "vehicle",
            position: new THREE.Vector3(32 * 5, 0, 1 * 5),
            url: "./models/gltf/trucks/mobile_diner/scene.gltf",
            animate: false,
            castShadow: true,
            receiveShadow: true,
            // path: new THREE.CatmullRomCurve3([
            //     new THREE.Vector3(32 * 5, 0, 0 * 5),
            //     new THREE.Vector3(32 * 5, 0, 66 * 5)
            // ]),
            // velocity: 0.01
        },
        {
            name: "bus2",
            loader_type: "gltf",
            object_type: "vehicle",
            scale: new THREE.Vector3(.2, .2, .2),
            position: new THREE.Vector3(33 * 5, 0, 66 * 5),
            url: "./models/gltf/bus/scene.gltf",
            animate: false,
            castShadow: true,
            receiveShadow: true,
            path: new THREE.CatmullRomCurve3([
                new THREE.Vector3(33 * 5, 0, 66 * 5),
                new THREE.Vector3(33 * 5, 0, 0 * 5)
            ]),
            velocity: 0.01
        },
        {
            name: "bus3",
            loader_type: "gltf",
            object_type: "vehicle",
            scale: new THREE.Vector3(.2, .2, .2),
            position: new THREE.Vector3(66 * 5, 0, 8 * 5),
            url: "./models/gltf/bus/scene.gltf",
            animate: false,
            castShadow: true,
            receiveShadow: true,
            path: new THREE.CatmullRomCurve3([
                new THREE.Vector3(66 * 5, 0, 8 * 5),
                new THREE.Vector3(0 * 5, 0, 8 * 5)
            ]),
            velocity: 0.01
        },
        {
            name: "traffic-light-20-7",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(20 * 5, 0, 7 * 5),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-17-10",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(17 * 5, 0, 10 * 5),
            rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-20-10",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(20 * 5, 0, 10 * 5),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-31-7",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(31 * 5, 0, 7 * 5),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-34-7",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(34 * 5, 0, 7 * 5),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-31-10",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(31 * 5, 0, 10 * 5),
            rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-34-10",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(34 * 5, 0, 10 * 5),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-31-15",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(31 * 5, 0, 15 * 5),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-34-15",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(34 * 5, 0, 15 * 5),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-31-18",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(31 * 5, 0, 18 * 5),
            rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "traffic-light-34-18",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(34 * 5, 0, 18 * 5),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.05, .05, .05),
            castShadow: true,
            receiveShadow: true,
        },
        {
            name: "bien-bao-duong-khong-uu-tien",
            loader_type: "object",
            object_type: "warning-sign",
            url: "./models/signs/warning-sign.json",
            animate: false,
            castShadow: true,
            receiveShadow: true,
            children: {
                "sign": {
                    textureUrl: "./models/signs/khonguutien2-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(15 * 5, 0, 10 * 5),
            scale: new THREE.Vector3(.3, .3, .3),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            direction: { x: 1, y: 0, z: 1 },
            info: "Danger Warning Sign: Intersection with minor road"
        },
        {
            name: "bien-bao-duong-uu-tien",
            loader_type: "object",
            object_type: "warning-sign",
            url: "./models/signs/priority-warning-sign.json",
            animate: false,
            castShadow: true,
            receiveShadow: true,
            children: {
                "sign": {
                    textureUrl: "./models/signs/uutien-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(28 * 5, 0, 10 * 5),
            scale: new THREE.Vector3(.3, .3, .3),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            direction: { x: 1, y: 0, z: 0 },
            info: "Danger Warning Sign: Priority road!"
        },
    ];

    // add models to the world
    models.forEach(md => loadModelToWorld(md));
}

WORLD.loadMap = () => {
    drawGround();

    loadModels();

    // WORLD.player.position.set(50, 1.3 , 110);
    // sphereBody.position.set(50, 1.3 , 110);
    WORLD.player.rotateY(- Math.PI / 2);
}