/** All maps of chapter 1 */

/** Level 1 */

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

var drawGround = function() {
    var pavementMaterial = new THREE.MeshBasicMaterial({ map: WORLD.textureLoader.load('./images/sidewalk_1.jpg') });
    pavementMaterial.map.wrapS = pavementMaterial.map.wrapT = THREE.RepeatWrapping;
    var grassMaterial = new THREE.MeshBasicMaterial({ map: WORLD.textureLoader.load('./images/grass.jpg') });
    var roadPosXMaterial = new THREE.MeshBasicMaterial({ map: WORLD.textureLoader.load('./images/roadposx.png') });               
    var roadPosZMaterial = new THREE.MeshBasicMaterial({ map: WORLD.textureLoader.load('./images/roadposz.png') });               
    var residentTexture = WORLD.textureLoader.load("/images/residential.jpg");
    var glassTexture = WORLD.textureLoader.load("/images/glass.jpg");

    loadMapFromJSON("./core/chapters/chapter_2/chapter_2.json", (result) => {
        var mapInfo = JSON.parse(result);
        var UNIT_SIZE = mapInfo.size;
    
        /** load pavement and road */
        var roadMap = getMapFromFile(mapInfo.map_url);

        findSubMat(roadMap, ROAD_POS_Z).forEach(function(tile) {
            var PLANE_X = ((2 * tile.x + tile.size - 1) * UNIT_SIZE ) / 2;
            var PLANE_Z = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;

            roadPosZMaterial.map.wrapS = roadPosZMaterial.map.wrapT = THREE.RepeatWrapping;
            roadPosZMaterial.map.repeat.set(1, 1);
            roadPosZMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
            var plane = new THREE.Mesh( 
                            new THREE.PlaneGeometry(tile.size * UNIT_SIZE, tile.size * UNIT_SIZE), 
                            roadPosZMaterial 
                        );
            plane.position.set(PLANE_X, 0, PLANE_Z)
            plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
            WORLD.scene.add( plane );
        });

        findSubMat(roadMap, ROAD_POS_X).forEach(function(tile) {
            var PLANE_X = ((2 * tile.x + tile.size - 1) * UNIT_SIZE ) / 2;
            var PLANE_Z = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;

            roadPosXMaterial.map.wrapS = roadPosXMaterial.map.wrapT = THREE.RepeatWrapping;
            roadPosXMaterial.map.repeat.set(1, 1);
            roadPosXMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
            var plane = new THREE.Mesh( 
                            new THREE.PlaneGeometry(tile.size * UNIT_SIZE, tile.size * UNIT_SIZE), 
                            roadPosXMaterial 
                        );
            plane.position.set(PLANE_X, 0, PLANE_Z)
            plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
            WORLD.scene.add( plane );
        });

        findSubMat(roadMap, INTERSECT_5).forEach(function(tile) {
            var texture = WORLD.textureLoader.load("/images/intersect_5.png");
            var intersectMaterial = new THREE.MeshBasicMaterial({ map: texture });               
            var PLANE_X = ((2 * tile.x + tile.size - 1) * UNIT_SIZE ) / 2;
            var PLANE_Z = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;

            intersectMaterial.map.wrapS = intersectMaterial.map.wrapT = THREE.RepeatWrapping;
            intersectMaterial.map.repeat.set(1, 1);
            intersectMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
            var plane = new THREE.Mesh( 
                            new THREE.PlaneGeometry(tile.size * UNIT_SIZE, tile.size * UNIT_SIZE), 
                            intersectMaterial 
                        );
            plane.position.set(PLANE_X, 0, PLANE_Z)
            plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
            WORLD.scene.add( plane );
        });

        findSubMat(roadMap, PAVEMENT_ID).forEach(function(tile) {
            var PLANE_X = ((2 * tile.x + tile.size - 1) * UNIT_SIZE ) / 2;
            var PLANE_Z = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;

            pavementMaterial.map.wrapS = pavementMaterial.map.wrapT = THREE.RepeatWrapping;
            pavementMaterial.map.repeat.set(1, 1);
            var cube = new THREE.Mesh(
                            new THREE.BoxGeometry(UNIT_SIZE, PAVEMENT_HEIGHT, UNIT_SIZE), 
                            pavementMaterial
                        );
            // Set the cube position
            cube.position.set(PLANE_X, PAVEMENT_HEIGHT / 2, PLANE_Z);

            // Add the cube
            WORLD.scene.add(cube);
            WORLD.world.addBody(createBoxBody(cube, function(object) {
                if(object.body.id == 0) 
                    toastr.error("You're in the PAVEMENT!!! Please go back to the road.");
            }));

        });

        findSubMat(roadMap, RESIDENTAL_BUILDING_ID).forEach(function(tile) {
            /** residental buildings */
            var texture = residentTexture;
            var buildingMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });
            buildingMaterial.map.wrapS = buildingMaterial.map.wrapT = THREE.RepeatWrapping;
            buildingMaterial.map.repeat.set( UNIT_SIZE, 1 );

            buildingMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();

            var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE ) / 2;
            var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2
    
            var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, UNIT_SIZE * 2, tile.size * UNIT_SIZE), buildingMaterial);
            // Set the cube position
            cube.position.set(buildingXWidth, UNIT_SIZE + PAVEMENT_HEIGHT, buildingZWidth);
            // Add the cube
            WORLD.scene.add(cube);
            WORLD.world.addBody(createBoxBody(cube, function(object) {
                if(object.body.id == 0) 
                    console.log("Player collided with walls.");
            }));
        });

    })
}

function loadModels() {

    var models = [
        // {
        //     name: "car",
        //     loader_type: "object",
        //     object_type: "vehicle",
        //     url: "./models/json/volkeswagon-vw-beetle.json",
        //     position: new THREE.Vector3(48, 0, 30),
        //     rotation: new THREE.Euler(0, 0, 0, "XYZ"),
        //     scale: new THREE.Vector3(.005, .005, 0.005),
        //     animate: true,
        //     path: new THREE.CatmullRomCurve3([
        //         new THREE.Vector3(150, 0, 10),
        //         new THREE.Vector3(150, 0, 14),
        //         new THREE.Vector3(150, 0, 16),
        //         new THREE.Vector3(150, 0, 18),
        //         new THREE.Vector3(150, 0, 22),
        //         new THREE.Vector3(151, 0, 25),
        //         new THREE.Vector3(151, 0, 27),
        //         new THREE.Vector3(151, 0, 30),
        //         new THREE.Vector3(152, 0, 32),
        //         new THREE.Vector3(152, 0, 36),
        //         new THREE.Vector3(152, 0, 39),
        //         new THREE.Vector3(152, 0, 43),
        //         new THREE.Vector3(152, 0, 46),
        //         new THREE.Vector3(152, 0, 48),
        //         new THREE.Vector3(152, 0, 50),
        //         new THREE.Vector3(152, 0, 54),
        //         new THREE.Vector3(152, 0, 57),
        //         new THREE.Vector3(158, 0, 67),
        //         new THREE.Vector3(160, 0, 67),
        //         new THREE.Vector3(162, 0, 67),
        //         new THREE.Vector3(164, 0, 67),
        //         new THREE.Vector3(168, 0, 67),
        //         new THREE.Vector3(172, 0, 67),
        //         new THREE.Vector3(180, 0, 67),
        //         new THREE.Vector3(232, 0, 67)]),
        //     velocity: 0.01
        // },
        {
            name: "bus_2", 
            loader_type: "gltf", 
            object_type: "vehicle",
            scale: new THREE.Vector3(.2,.2,.2),
            position: new THREE.Vector3(48, 0, 30),
            url: "./models/gltf/bus/scene.gltf",
            animate: false,
            path: new THREE.CatmullRomCurve3([
                new THREE.Vector3(150, 0, 10),
                new THREE.Vector3(150, 0, 14),
                new THREE.Vector3(150, 0, 16),
                new THREE.Vector3(150, 0, 18),
                new THREE.Vector3(150, 0, 22),
                new THREE.Vector3(151, 0, 25),
                new THREE.Vector3(151, 0, 27),
                new THREE.Vector3(151, 0, 30),
                new THREE.Vector3(152, 0, 32),
                new THREE.Vector3(152, 0, 36),
                new THREE.Vector3(152, 0, 39),
                new THREE.Vector3(152, 0, 43),
                new THREE.Vector3(152, 0, 46),
                new THREE.Vector3(152, 0, 48),
                new THREE.Vector3(152, 0, 50),
                new THREE.Vector3(152, 0, 54),
                new THREE.Vector3(152, 0, 57),
                new THREE.Vector3(158, 0, 67),
                new THREE.Vector3(160, 0, 67),
                new THREE.Vector3(162, 0, 67),
                new THREE.Vector3(164, 0, 67),
                new THREE.Vector3(168, 0, 67),
                new THREE.Vector3(172, 0, 67),
                new THREE.Vector3(180, 0, 67),
                new THREE.Vector3(232, 0, 67)]),
            velocity: 0.01
        }
    ];

    // add models to the world
    models.forEach(md => loadModelToWorld(md));
}

WORLD.loadMap = () => {
    drawGround();

    loadModels();

    WORLD.player.position.set(56, 1.3 , 65);
    sphereBody.position.set(56, 1.3 , 65);
    WORLD.player.rotateY(- Math.PI / 2);
}