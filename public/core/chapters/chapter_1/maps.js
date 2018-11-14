
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

    readMapInfoFromJson("./core/chapters/chapter_1/chapter_1.json", (result) => {
        var mapInfo = JSON.parse(result);
        var UNIT_SIZE = mapInfo.size;
        GAME.realMapUnit = UNIT_SIZE;
        var CANVAS_UNIT = 3;
        GAME.miniMapUnit = CANVAS_UNIT;
        var canvas = document.getElementById("miniMap");

        // load player's initial position
        WORLD.player.position.set(mapInfo.player.position.x, mapInfo.player.position.y, mapInfo.player.position.z);
        sphereBody.position.set(mapInfo.player.position.x, mapInfo.player.position.y, mapInfo.player.position.z);
        // player's position on minimap 
        PLAYER.pin = $("#player-pin");
        PLAYER.pin.css( "display", "block" );
        PLAYER.pin.css( "left", (WORLD.player.position.x / GAME.realMapUnit) * GAME.miniMapUnit - 10 );
        PLAYER.pin.css( "top", (WORLD.player.position.z / GAME.realMapUnit) * GAME.miniMapUnit - 10 );

        /** load pavement and road */
        var roadMap = readMapFromFile(mapInfo.map_url);
        GAME.mapContext = canvas.getContext("2d");
        GAME.mapContext.canvas.width  = CANVAS_UNIT * roadMap.length;
        GAME.mapContext.canvas.height = CANVAS_UNIT * roadMap.length;

        loadTextureToGround(ROAD_POS_Z, './images/textures/roadposz_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(ROAD_POS_X, './images/textures/roadposx_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(INTERSECT_1, './images/textures/intersect_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(INTERSECT_2, './images/textures/intersect_2.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(INTERSECT_3, './images/textures/intersect_3.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(INTERSECT_4, './images/textures/intersect_4.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(INTERSECT_5, './images/textures/intersect_5.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(PAVEMENT_ID, './images/textures/pavement.jpg', roadMap, UNIT_SIZE, false, {
            color: "grey"
        });
        loadTextureToGround(ZEBRA_CROSSING_TOP, './images/textures/zebra_crossing_top.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(ZEBRA_CROSSING_BOTTOM, './images/textures/zebra_crossing_bottom.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(ZEBRA_CROSSING_LEFT, './images/textures/zebra_crossing_left.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(ZEBRA_CROSSING_RIGHT, './images/textures/zebra_crossing_right.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(GRASS_ID, './images/grass.jpg', roadMap, UNIT_SIZE, true, {
            color: "green"
        });
        loadTextureToGround(PARKING_LOT, './images/textures/paving-cobblestones.jpg', roadMap, UNIT_SIZE, true, {
            color: "grey"
        });


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
            var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;
            GAME.mapContext.fillStyle = "blue";
            GAME.mapContext.fillRect(tile.x * CANVAS_UNIT, tile.z * CANVAS_UNIT, tile.size * CANVAS_UNIT, tile.size * CANVAS_UNIT);

            var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, UNIT_SIZE * 2, tile.size * UNIT_SIZE), buildingMaterial);
            // Set the cube position
            cube.position.set(buildingXWidth, UNIT_SIZE, buildingZWidth);
            // Add the cube
            WORLD.scene.add(cube);
            // WORLD.world.add(createBoxBody(cube, function (object) {
            //     if (object.body.id == 0)
            //         console.log("Player collided with walls.");
            // }));
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
            // WORLD.world.add(createBoxBody(cube, function (object) {
            //     if (object.body.id == 0)
            //         console.log("Player collided with walls.");
            // }));
        });

        mapInfo.one_ways.forEach(function(child) {
            var pos = child.position;

            var area, areaBBox;
            area = new THREE.Mesh(
                new THREE.BoxGeometry(pos.x_width * UNIT_SIZE, 50, pos.z_width * UNIT_SIZE),
                new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    wireframe: true
                })
            );
            var XWidth = ((2 * pos.x + pos.x_width - 1) * UNIT_SIZE ) / 2;
            var ZWidth = ((2 * pos.z + pos.z_width - 1) * UNIT_SIZE) / 2
            // area.rotation = new THREE.Euler(0, Math.Pi / 2, Math.PI /2, 'XYZ')
            area.position.set(XWidth, 0, ZWidth);
            area.geometry.computeBoundingBox();
            // WORLD.scene.add(area);
            areaBBox = new THREE.Box3(area.geometry.boundingBox.min.add(area.position), area.geometry.boundingBox.max.add(area.position));
            WORLD.dangerZones.push({ box: area, bbox: areaBBox, direction: child.direction, infoImg: "./images/info.png"});
        });
    })
}


/**
 * 
 * @param {*} id // ID of each texture type
 * @param {*} url // Texture url
 * @param {*} map 
 */
const loadTextureToGround = (id, url, map, unit_size, isMultiple, minimap, callback) => {
    findSubMap(map, id).forEach(function (tile) {

        if(minimap) {
            var color = minimap.color;

            GAME.mapContext.fillStyle = color;
            GAME.mapContext.fillRect(tile.x * GAME.miniMapUnit, tile.z * GAME.miniMapUnit, tile.size * GAME.miniMapUnit, tile.size * GAME.miniMapUnit);
        }

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
        // vehicles
        {
            "name": "simple-car",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 32 * 5, "y": 1.3, "z": 0 * 5},
            "rotation": {"x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ"},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "path": [{"x":160,"y":1.3,"z":0},{"x":160,"y":1.3,"z":330}],
            "velocity": 0.01
        },
        {
            "name": "simple-car",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 32 * 5, "y": 1.3, "z": 0 * 5},
            "rotation": {"x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ"},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "path": [
                { "x": 160, "y": 1.3, "z": 20 },
                { "x": 160, "y": 1.3, "z": 330 }
            ],
            "velocity": 0.03
        },
        {
            "name": "simple-car2",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 60 * 5, "y": 1.3, "z": 8 * 5},//new THREE.Vector3(60 * 5, 1.3, 8 * 5),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": [{"x":300,"y":1.3,"z":40},{"x":240,"y":1.3,"z":40},{"x":235,"y":1.3,"z":40},{"x":235,"y":1.3,"z":45},{"x":235,"y":1.3,"z":225},{"x":235,"y":1.3,"z":230},{"x":240,"y":1.3,"z":230},{"x":275,"y":1.3,"z":230}],
            "velocity": 0.01
        },
        {
            "name": "simple-car2",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 300, "y": 1.3, "z": 40},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": [{"x":300,"y":1.3,"z":40},{"x":240,"y":1.3,"z":40},{"x":235,"y":1.3,"z":40},{"x":235,"y":1.3,"z":45},{"x":235,"y":1.3,"z":225},{"x":235,"y":1.3,"z":230},{"x":240,"y":1.3,"z":230},{"x":275,"y":1.3,"z":230}],
            "velocity": 0.02
        },
        {
            "name": "simple-car3",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 325, "y": 1.3, "z": 40},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": [
                { "x": 325, "y": 1.3, "z": 40 },
                { "x": 165, "y": 1.3, "z": 40 },
                { "x": 160, "y": 1.3, "z": 40 },
                { "x": 160, "y": 1.3, "z": 45 },
                { "x": 160, "y": 1.3, "z": 165 },
                { "x": 160, "y": 1.3, "z": 170 },
                { "x": 155, "y": 1.3, "z": 170 },
                { "x": 95, "y": 1.3, "z": 170 },
                { "x": 90, "y": 1.3, "z": 170 },
                { "x": 90, "y": 1.3, "z": 175 },
                { "x": 90, "y": 1.3, "z": 310 }
            ],
            "velocity": 0.02
        },
        {
            "name": "simple-car4",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 5, "y": 1.3, "z": 175},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": [
                { "x": 5, "y": 1.3, "z": 175 },
                { "x": 90, "y": 1.3, "z": 175 },
                { "x": 95, "y": 1.3, "z": 175 },
                { "x": 95, "y": 1.3, "z": 170 },
                { "x": 95, "y": 1.3, "z": 50 },
                { "x": 95, "y": 1.3, "z": 45 },
                { "x": 100, "y": 1.3, "z": 45 },
                { "x": 225, "y": 1.3, "z": 45 },
                { "x": 230, "y": 1.3, "z": 45 },
                { "x": 230, "y": 1.3, "z": 50 },
                { "x": 230, "y": 1.3, "z": 225 }
            ],
            "velocity": 0.03
        },
        {
            "name": "simple-car5",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 5, "y": 1.3, "z": 175},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": [
                new THREE.Vector3(1 * 5, 1.3, 35 * 5),
                new THREE.Vector3(18 * 5, 1.3, 35 * 5),
                new THREE.Vector3(19 * 5, 1.3, 35 * 5),
                new THREE.Vector3(19 * 5, 1.3, 34 * 5),
                new THREE.Vector3(19 * 5, 1.3, 10 * 5),
                new THREE.Vector3(19 * 5, 1.3, 9 * 5),
                new THREE.Vector3(20 * 5, 1.3, 9 * 5),
                new THREE.Vector3(45 * 5, 1.3, 9 * 5),
                new THREE.Vector3(46 * 5, 1.3, 9 * 5),
                new THREE.Vector3(46 * 5, 1.3, 10 * 5),
                new THREE.Vector3(46 * 5, 1.3, 45 * 5),
            ],
            "velocity": 0.03
        },
        {
            "name": "simple-car6",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 0, "y": 1.3, "z": 45},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": [
                {"x": 0, "y": 1.3, "z": 45},
                {"x": 150, "y": 1.3, "z": 45},
                {"x": 160, "y": 1.3, "z": 45},
                {"x": 160, "y": 1.3, "z": 5},
                {"x": 160, "y": 1.3, "z": 320}
            ],
            "velocity": 0.02
        },
        {
            "name": "simple-car7",
            "loader_type": "fbx",
            "object_type": "vehicle",
            // "position": {"x": 7 * 5, "y": 1.3, "z": "bts"},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": [
                {"x": 35, "y":1.3, "z": 45},
                {"x": 150, "y": 1.3, "z": 45},
                {"x": 160, "y": 1.3, "z": 45},
                {"x": 160, "y": 1.3, "z": 5},
                {"x": 160, "y": 1.3, "z": 320}
            ],
            "velocity": 0.02
        },
        {
            "name": "simple-car8",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 0, "y": 1.3, "z": 175},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(0 * 5, 1.3, 35 * 5),
                new THREE.Vector3(65 * 5, 1.3, 35 * 5)
            ]),
            "velocity": 0.01
        },
        {
            "name": "simple-car-13-35",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 65, "y": 1.3, "z": 175},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(13 * 5, 1.3, 35 * 5),
                new THREE.Vector3(65 * 5, 1.3, 35 * 5)
            ]),
            "velocity": 0.02
        },
        {
            "name": "simple-car9",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 165, "y": 1.3, "z": 320},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(33 * 5, 1.3, 64 * 5),
                new THREE.Vector3(33 * 5, 1.3, 36 * 5),
                new THREE.Vector3(33 * 5, 1.3, 34 * 5),
                new THREE.Vector3(31 * 5, 1.3, 34 * 5),
                new THREE.Vector3(6 * 5, 1.3, 34 * 5),
                new THREE.Vector3(4 * 5, 1.3, 34 * 5),
                new THREE.Vector3(4 * 5, 1.3, 36 * 5),
                new THREE.Vector3(4 * 5, 1.3, 35 * 5),
                new THREE.Vector3(4 * 5, 1.3, 51 * 5),
                new THREE.Vector3(6 * 5, 1.3, 53 * 5),
                new THREE.Vector3(16 * 5, 1.3, 53 * 5),
                new THREE.Vector3(18 * 5, 1.3, 53 * 5),
                new THREE.Vector3(18 * 5, 1.3, 55 * 5),
                new THREE.Vector3(18 * 5, 1.3, 60 * 5),
            ]),
            "velocity": 0.01
        },
        {
            "name": "simple-car10",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 325, "y": 1.3, "z": 170},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(65 * 5, 1.3, 34 * 5),
                new THREE.Vector3(48 * 5, 1.3, 34 * 5),
                new THREE.Vector3(46 * 5, 1.3, 34 * 5),
                new THREE.Vector3(46 * 5, 1.3, 36 * 5),
                new THREE.Vector3(46 * 5, 1.3, 44 * 5),
                new THREE.Vector3(46 * 5, 1.3, 46 * 5),
                new THREE.Vector3(44 * 5, 1.3, 46 * 5),
                new THREE.Vector3(34 * 5, 1.3, 46 * 5),
                new THREE.Vector3(32 * 5, 1.3, 46 * 5),
                new THREE.Vector3(32 * 5, 1.3, 48 * 5),
                new THREE.Vector3(32 * 5, 1.3, 64 * 5),
            ]),
            "velocity": 0.01
        },
        {
            "name": "traffic-light-31-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": { "x": 155, "y": 0, "z": 35 },
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": { "x": 170, "y": 0, "z": 35 },
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
            "direction": { "x": 1, "y": 0, "z": 1 },
        },
        {
            "name": "traffic-light-31-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": { "x": 155, "y": 0, "z": 50 },
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": { "x": 170, "y": 0, "z": 50 },
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },

        // traffic lights
        {
            "name": "traffic-light-31-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 7 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 7 * 5),
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
            "direction": { "x": 1, "y": 0, "z": 1 },
        },
        {
            "name": "traffic-light-31-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 10 * 5),
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 10 * 5),
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 15 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 15 * 5),
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 18 * 5),
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": { "x": 170, "y": 0, "z": 90 },
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        //
        {
            "name": "traffic-light-31-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 31 * 5, "y": 0, "z": 15 * 5},//new THREE.Vector3(31 * 5, 0, 15 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 170, "y": 0, "z": 75},//new THREE.Vector3(34 * 5, 0, 15 * 5),
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 155, "y": 0, "z": 90},
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 170, "y": 0, "z": 90},
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-17-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 85, "y": 0, "z": 165},
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 100, "y": 0, "z": 165},
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": { "x": 100, "y": 0, "z": 180 },
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-17-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": { "x": 85, "y": 0, "z": 180 },
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": { "x": 155, "y": 0, "z": 165 },
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": { "x": 170, "y": 0, "z": 165 },
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": { "x": 170, "y": 0, "z": 180 },
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": { "x": 155, "y": 0, "z": 180 },
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-45-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 225, "y": 0, "z": 165},
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-48-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 240, "y": 0, "z": 165},
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-48-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 240, "y": 0, "z": 180},
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-45-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 225, "y": 0, "z": 180},
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-17-51",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 85, "y": 0, "z": 255},
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-51",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 100, "y": 0, "z": 255},
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-54",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 100, "y": 0, "z": 270},
            "rotation": { "x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-17-54",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 85, "y": 0, "z": 270},
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },

        // signs
        {
            "name": "camretrai-20-11",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camretrai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": { "x": 100, "y": 0, "z": 55 },
            "scale": { "x": 0.3, "y": 0.3, "z": 0.3 },
            "rotation": {"order": "XYZ", "x": 0, "y": 1.57079632679, "z": 0},
            "direction": { "x": 0, "y": 0, "z": - 1 },
            "info": "Regulatory Sign: No Left Turn!!"
        },
        {
            "name": "camretrai-31-44",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camretrai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 155, "y": 0, "z": 220},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "direction": { "x": 0, "y": 0, "z": 1 },
            "info": "Regulatory Sign: No Left Turn!!"
        },
        {
            "name": "camretrai-45-44",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camretrai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 225, "y": 0, "z": 220},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": { "x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ" },
            "direction": { "x": 0, "y": 0, "z": 1 },
            "info": "Regulatory Sign: No Left Turn!!"
        },
        {
            "name": "camrephai-34-49",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camrephai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 170, "y": 0, "z": 245},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"order": "XYZ", "x": 0, "y": 1.57079632679, "z": 0},
            "direction": { "x": 0, "y": 0, "z": - 1 },
            "info": "Regulatory Sign: No Right Turn!!"
        },
        {
            "name": "camrephai-7-51",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camrephai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 35, "y": 0, "z": 255},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"order": "XYZ", "x": 0, "y": 1.57079632679, "z": 0},
            "direction": { "x": - 1, "y": 0, "z": 0 },
            "info": "Regulatory Sign: No Right Turn!!"
        },
        {
            "name": "camrephai-7-61",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camrephai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": { "x": 35, "y": 0, "z": 305 },
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "direction": { "x": - 1, "y": 0, "z": 0 },
            "info": "Regulatory Sign: No Right Turn!!"
        },
        {
            "name": "nguocchieu-30-7",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/nguocchieu-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": { "x": 150, "y": 0, "z": 35 },
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": { "x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ" },
            "direction": { "x": - 1, "y": 0, "z": 0 },
            "info": "Regulatory Sign: Do Not Enter!!"
        },
        {
            "name": "camquaydau-30-10",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camquaydau-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": { "x": 150, "y": 0, "z": 50 },
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "direction": { "x": 1, "y": 0, "z": 0 },
            "info": "Regulatory Sign: No U Turn!!"
        },
        {
            "name": "camquaydau-31-32",
            "loader_type": "object",
            "object_type": "regulatory-sign",
            "url": "./models/signs/regulatory-sign.json",
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/camquaydau-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": { "x": 155, "y": 0, "z": 160 },
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "direction": { "x": 0, "y": 0, "z": 1 },
            "info": "Regulatory Sign: No U Turn!!"
        },
    ];

    // add models to the world
    models.forEach(md => loadModelToWorld(md));
}

WORLD.loadMap = () => {
    drawGround();
    loadModels();
}