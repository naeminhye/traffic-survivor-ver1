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
var ROUNDABOUT = "R";

/**
 * 
 * @param {*} file the link to the JSON file
 */
var environmentInit = function (file) {
    var residentTexture = WORLD.textureLoader.load("/images/residential.jpg");
    var glassTexture = WORLD.textureLoader.load("/images/glass.jpg");

    readMapInfoFromJson(file, (result) => {
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
        loadTextureToGround(ROUNDABOUT, './images/textures/roundabout.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
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

        /** load models */
        if(mapInfo.models) {
            Object.keys(mapInfo.models).forEach((type) => {
                mapInfo.models[type].forEach(md => loadModelToWorld(md));
            });
        }
        
        /** load intersect areas */
        mapInfo.intersects.forEach(function(child) {
            var pos = child;

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
            area.position.set(XWidth, 0, ZWidth);
            area.geometry.computeBoundingBox();
            areaBBox = new THREE.Box3(area.geometry.boundingBox.min.add(area.position), area.geometry.boundingBox.max.add(area.position));
            WORLD.intersects.push({ box: area, bbox: areaBBox });
        });
    });
}

/**
 * 
 * @param {*} id 
 * @param {*} url 
 * @param {*} map 
 * @param {*} unit_size 
 * @param {*} isMultiple 
 * @param {*} minimap 
 * @param {*} callback 
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