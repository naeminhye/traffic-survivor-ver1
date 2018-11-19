
// var PAVEMENT_ID = "0";
// var ROAD_POS_Z = "1";
// var ROAD_POS_X = "-1";
// var RESIDENTAL_BUILDING_ID = "2";
// var OFFICE_BUILDING_ID = "3";
// var GRASS_ID = "4";
// var START = "S";
// var END = "E";
// var BLOCKED_POS_Z = "X";
// var BLOCKED_POS_X = "-X";
// var PAVEMENT_HEIGHT = 0.1;
// var INTERSECT_1 = "I1";
// var INTERSECT_2 = "I2";
// var INTERSECT_3 = "I3";
// var INTERSECT_4 = "I4";
// var INTERSECT_5 = "I5";
// var ZEBRA_CROSSING_TOP = "ZT";
// var ZEBRA_CROSSING_BOTTOM = "ZB";
// var ZEBRA_CROSSING_LEFT = "ZL";
// var ZEBRA_CROSSING_RIGHT = "ZR";
// var PARKING_LOT = "P";

// var drawGround = function () {
//     var residentTexture = WORLD.textureLoader.load("/images/residential.jpg");
//     var glassTexture = WORLD.textureLoader.load("/images/glass.jpg");

//     readMapInfoFromJson("./core/chapters/chapter_2/chapter_2.json", (result) => {
//         var mapInfo = JSON.parse(result);
//         var UNIT_SIZE = mapInfo.size;
//         var CANVAS_UNIT = 2;
//         var canvas = document.getElementById("miniMap");

//         // load player's initial position
//         WORLD.player.position.set(mapInfo.player.position.x, mapInfo.player.position.y, mapInfo.player.position.z);
//         sphereBody.position.set(mapInfo.player.position.x, mapInfo.player.position.y, mapInfo.player.position.z);
//         // player's position on minimap 
//         PLAYER.pin = $("#player-pin");
//         PLAYER.pin.css( "display", "block" );
//         PLAYER.pin.css( "left", (WORLD.player.position.x / 5) * 2 - 10 );
//         PLAYER.pin.css( "top", (WORLD.player.position.z / 5) * 2 - 10 );

//         /** load pavement and road */
//         var roadMap = readMapFromFile(mapInfo.map_url);
//         GAME.mapContext = canvas.getContext("2d");
//         GAME.mapContext.canvas.width  = CANVAS_UNIT * roadMap.length;
//         GAME.mapContext.canvas.height = CANVAS_UNIT * roadMap.length;

//         loadTextureToGround(ROAD_POS_Z, './images/textures/roadposz_1.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(ROAD_POS_X, './images/textures/roadposx_1.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(INTERSECT_1, './images/textures/intersect_1.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(INTERSECT_2, './images/textures/intersect_2.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(INTERSECT_3, './images/textures/intersect_3.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(INTERSECT_4, './images/textures/intersect_4.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(INTERSECT_5, './images/textures/intersect_5.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(PAVEMENT_ID, './images/textures/pavement.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "grey"
//         });
//         loadTextureToGround(ZEBRA_CROSSING_TOP, './images/textures/zebra_crossing_top.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(ZEBRA_CROSSING_BOTTOM, './images/textures/zebra_crossing_bottom.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(ZEBRA_CROSSING_LEFT, './images/textures/zebra_crossing_left.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(ZEBRA_CROSSING_RIGHT, './images/textures/zebra_crossing_right.jpg', roadMap, UNIT_SIZE, false, {
//             canvas_unit: CANVAS_UNIT,
//             color: "red"
//         });
//         loadTextureToGround(GRASS_ID, './images/grass.jpg', roadMap, UNIT_SIZE, true, {
//             canvas_unit: CANVAS_UNIT,
//             color: "green"
//         });
//         loadTextureToGround(PARKING_LOT, './images/textures/paving-cobblestones.jpg', roadMap, UNIT_SIZE, true, {
//             canvas_unit: CANVAS_UNIT,
//             color: "grey"
//         });


//         findSubMap(roadMap, RESIDENTAL_BUILDING_ID).forEach(function (tile) {
//             /** residental buildings */
//             var texture = residentTexture;
//             var buildingMaterial = new THREE.MeshBasicMaterial({
//                 map: texture
//             });
//             buildingMaterial.map.wrapS = buildingMaterial.map.wrapT = THREE.RepeatWrapping;
//             buildingMaterial.map.repeat.set(UNIT_SIZE, 1);

//             buildingMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();

//             var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE) / 2;
//             var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;
//             GAME.mapContext.fillStyle = "blue";
//             GAME.mapContext.fillRect(tile.x * CANVAS_UNIT, tile.z * CANVAS_UNIT, tile.size * CANVAS_UNIT, tile.size * CANVAS_UNIT);

//             var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, UNIT_SIZE * 2, tile.size * UNIT_SIZE), buildingMaterial);
//             // Set the cube position
//             cube.position.set(buildingXWidth, UNIT_SIZE, buildingZWidth);
//             // Add the cube
//             WORLD.scene.add(cube);
//             WORLD.world.add(createBoxBody(cube, function (object) {
//                 if (object.body.id == 0)
//                     console.log("Player collided with walls.");
//             }));
//         });

//         findSubMap(roadMap, OFFICE_BUILDING_ID).forEach(function (tile) {
//             /** residental buildings */
//             var texture = glassTexture;
//             var buildingMaterial = new THREE.MeshBasicMaterial({
//                 map: texture
//             });
//             buildingMaterial.map.wrapS = buildingMaterial.map.wrapT = THREE.RepeatWrapping;
//             buildingMaterial.map.repeat.set(UNIT_SIZE, 1);

//             buildingMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();

//             var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE) / 2;
//             var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2

//             var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, UNIT_SIZE * 4, tile.size * UNIT_SIZE), buildingMaterial);
//             // Set the cube position
//             cube.position.set(buildingXWidth, UNIT_SIZE * 2, buildingZWidth);
//             // Add the cube
//             WORLD.scene.add(cube);
//             WORLD.world.add(createBoxBody(cube, function (object) {
//                 if (object.body.id == 0)
//                     console.log("Player collided with walls.");
//             }));
//         });
//     })
// }

// /**
//  * 
//  * @param {*} id // ID of each texture type
//  * @param {*} url // Texture url
//  * @param {*} map 
//  */
// const loadTextureToGround = (id, url, map, unit_size, isMultiple, minimap, callback) => {
//     findSubMap(map, id).forEach(function (tile) {
        
//         if(minimap) {
//             var canvas_unit = minimap.canvas_unit;
//             var color = minimap.color;

//             GAME.mapContext.fillStyle = color;
//             GAME.mapContext.fillRect(tile.x * canvas_unit, tile.z * canvas_unit, tile.size * canvas_unit, tile.size * canvas_unit);
//         }

//         var PLANE_X = ((2 * tile.x + tile.size - 1) * unit_size) / 2;
//         var PLANE_Z = ((2 * tile.z + tile.size - 1) * unit_size) / 2;
//         var material = new THREE.MeshBasicMaterial({
//             map: WORLD.textureLoader.load(url)
//         });
//         material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
//         if (isMultiple) {
//             material.map.repeat.set(tile.size, tile.size);
//         }
//         else {
//             material.map.repeat.set(1, 1);
//         }
//         material.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
//         var plane = new THREE.Mesh(
//             new THREE.PlaneGeometry(tile.size * unit_size, tile.size * unit_size),
//             material
//         );
//         plane.position.set(PLANE_X, 0, PLANE_Z)
//         plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
//         WORLD.scene.add(plane);

//         if (callback) {
//             WORLD.world.add(createBoxBody(plane, callback));
//         }
//     });
// }

// function loadModels() {

//     var models = [
//         // vehicles
//         {
//             name: "simple-car",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(32 * 5, 1.3, 0 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             animate: false,
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(32 * 5, 1.3, 0 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 66 * 5)
//             ]),
//             velocity: 0.01
//         },
//         {
//             name: "simple-car",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(32 * 5, 1.3, 0 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             animate: false,
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(32 * 5, 1.3, 4 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 66 * 5)
//             ]),
//             velocity: 0.03
//         },
//         {
//             name: "simple-car2",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(60 * 5, 1.3, 8 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(60 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(48 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 45 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(48 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(55 * 5, 1.3, 46 * 5),
//             ]),
//             velocity: 0.01
//         },
//         {
//             name: "simple-car2",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(60 * 5, 1.3, 8 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(60 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(48 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 45 * 5),
//                 new THREE.Vector3(47 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(48 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(55 * 5, 1.3, 46 * 5),
//             ]),
//             velocity: 0.02
//         },
//         {
//             name: "simple-car3",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(65 * 5, 1.3, 8 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(65 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(33 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 8 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 33 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(31 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 62 * 5),
//             ]),
//             velocity: 0.02
//         },
//         {
//             name: "simple-car4",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(1 * 5, 1.3, 35 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(1 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 10 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(20 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(45 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 10 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 45 * 5),
//             ]),
//             velocity: 0.03
//         },
//         {
//             name: "simple-car5",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(1 * 5, 1.3, 35 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(1 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 10 * 5),
//                 new THREE.Vector3(19 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(20 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(45 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 10 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 45 * 5),
//             ]),
//             velocity: 0.03
//         },
//         {
//             name: "simple-car6",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(0 * 5, 1.3, 9 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(0 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(30 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 1 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 64 * 5)
//             ]),
//             velocity: 0.02
//         },
//         {
//             name: "simple-car7",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(7 * 5, 1.3, 9 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(7 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(30 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 9 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 1 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 64 * 5)
//             ]),
//             velocity: 0.03
//         },
//         {
//             name: "simple-car8",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(0 * 5, 1.3, 35 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(0 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(65 * 5, 1.3, 35 * 5)
//             ]),
//             velocity: 0.01
//         },
//         {
//             name: "simple-car-13-35",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(13 * 5, 1.3, 35 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(13 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(65 * 5, 1.3, 35 * 5)
//             ]),
//             velocity: 0.02
//         },
//         {
//             name: "simple-car9",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(33 * 5, 1.3, 64 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(33 * 5, 1.3, 64 * 5),
//                 new THREE.Vector3(33 * 5, 1.3, 36 * 5),
//                 new THREE.Vector3(33 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(31 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(6 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(4 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(4 * 5, 1.3, 36 * 5),
//                 new THREE.Vector3(4 * 5, 1.3, 35 * 5),
//                 new THREE.Vector3(4 * 5, 1.3, 51 * 5),
//                 new THREE.Vector3(6 * 5, 1.3, 53 * 5),
//                 new THREE.Vector3(16 * 5, 1.3, 53 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 53 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 55 * 5),
//                 new THREE.Vector3(18 * 5, 1.3, 60 * 5),
//             ]),
//             velocity: 0.01
//         },
//         {
//             name: "simple-car10",
//             loader_type: "fbx",
//             object_type: "vehicle",
//             position: new THREE.Vector3(65 * 5, 1.3, 34 * 5),
//             url: "./models/fbx/simple-car/simple-car.fbx",
//             textureUrl: "./models/fbx/simple-car/simplecar-uvmap.png",
//             castShadow: true,
//             receiveShadow: true,
//             path: new THREE.CatmullRomCurve3([
//                 new THREE.Vector3(65 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(48 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 34 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 36 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 44 * 5),
//                 new THREE.Vector3(46 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(44 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(34 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 46 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 48 * 5),
//                 new THREE.Vector3(32 * 5, 1.3, 64 * 5),
//             ]),
//             velocity: 0.01
//         },

//         // traffic lights
//         {
//             name: "traffic-light-31-7",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 7 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-7",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 7 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//             direction: { x: 1, y: 0, z: 1 },
//         },
//         {
//             name: "traffic-light-31-10",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 10 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-10",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 10 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         //
//         {
//             name: "traffic-light-31-15",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 15 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-15",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 15 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-31-18",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 18 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-18",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 18 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         //
//         {
//             name: "traffic-light-31-15",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 15 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-15",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 15 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-31-18",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 18 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-18",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 18 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         //
//         {
//             name: "traffic-light-31-15",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 15 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-15",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 15 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-31-18",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 18 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-18",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 18 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         //
//         {
//             name: "traffic-light-17-33",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(17 * 5, 0, 33 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-20-33",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(20 * 5, 0, 33 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-20-36",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(20 * 5, 0, 36 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-17-36",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(17 * 5, 0, 36 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         //
//         {
//             name: "traffic-light-31-33",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 33 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-33",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 33 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-34-36",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(34 * 5, 0, 36 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-31-36",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(31 * 5, 0, 36 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         //
//         {
//             name: "traffic-light-45-33",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(45 * 5, 0, 33 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-48-33",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(48 * 5, 0, 33 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-48-36",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(48 * 5, 0, 36 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-45-36",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(45 * 5, 0, 36 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         //
//         {
//             name: "traffic-light-17-51",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(17 * 5, 0, 51 * 5),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-20-51",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(20 * 5, 0, 51 * 5),
//             rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-20-54",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/redlight-uvmap.png",
//             position: new THREE.Vector3(20 * 5, 0, 54 * 5),
//             rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },
//         {
//             name: "traffic-light-17-54",
//             loader_type: "fbx",
//             object_type: "traffic_light",
//             url: "./models/fbx/traffic-light-2/trafficlight.fbx",
//             textureUrl: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
//             position: new THREE.Vector3(17 * 5, 0, 54 * 5),
//             rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
//             scale: new THREE.Vector3(.4, .4, .4),
//             castShadow: true,
//             receiveShadow: true,
//         },

//         /** bien-bao-duong-khong-uu-tien */
//         {
//             name: "bien-bao-duong-khong-uu-tien",
//             loader_type: "object",
//             object_type: "warning_signs",
//             url: "./models/signs/warning-sign.json",
//             animate: false,
//             castShadow: true,
//             receiveShadow: true,
//             children: {
//                 "sign": {
//                     textureUrl: "./models/signs/khonguutien2-uvmap.png"
//                 },
//                 "pole": {
//                     textureUrl: "./models/signs/pole-uvmap.png"
//                 }
//             },
//             position: new THREE.Vector3(15 * 5, 0, 10 * 5),
//             scale: new THREE.Vector3(.3, .3, .3),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             direction: { x: 1, y: 0, z: 1 },
//             info: "Danger Warning Sign: Intersection with minor road"
//         },
//         {
//             name: "bien-bao-duong-uu-tien",
//             loader_type: "object",
//             object_type: "warning_signs",
//             url: "./models/signs/priority-warning-sign.json",
//             animate: false,
//             castShadow: true,
//             receiveShadow: true,
//             children: {
//                 "sign": {
//                     textureUrl: "./models/signs/uutien-uvmap.png"
//                 },
//                 "pole": {
//                     textureUrl: "./models/signs/pole-uvmap.png"
//                 }
//             },
//             position: new THREE.Vector3(28 * 5, 0, 10 * 5),
//             scale: new THREE.Vector3(.3, .3, .3),
//             rotation: new THREE.Euler(0, 0, 0, "XYZ"),
//             direction: { x: 1, y: 0, z: 0 },
//             info: "Danger Warning Sign: Priority road!"
//         },
//     ];

//     // add models to the world
//     models.forEach(md => loadModelToWorld(md));
// }

WORLD.loadMap = () => {
    environmentInit("./core/chapters/chapter_2/chapter_2.json");
    // drawGround();

    // loadModels();

    // WORLD.player.position.set(50, 1.3 , 110);
    // sphereBody.position.set(50, 1.3 , 110);
    // WORLD.player.rotateY(- Math.PI / 2);
}