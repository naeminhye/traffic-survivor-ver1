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

    loadMapFromJSON("./core/chapters/chapter_1/map_info.json", (result) => {
        var mapInfo = JSON.parse(result);
        var UNIT_SIZE = mapInfo.size;
    
        /** load pavement and road */
        var roadMap = getMapFromFile(mapInfo.map_url);
        var mapWidth = roadMap.length;
        var mapHeight = roadMap[0].length;
    
        // THIN LINES OF ROAD AND PAVEMENT
        for(var i = 0; i < mapHeight; i++) {
            for(var j = 0; j < mapWidth; j++) {

                /** Draw Pavement */
                if(roadMap[i][j] === PAVEMENT_ID) {
                    pavementMaterial.map.repeat.set(UNIT_SIZE, UNIT_SIZE);
                    var cube = new THREE.Mesh(
                                    new THREE.BoxGeometry(UNIT_SIZE, PAVEMENT_HEIGHT, UNIT_SIZE), 
                                    pavementMaterial
                                );
                    // Set the cube position
                    cube.position.set(UNIT_SIZE * j, PAVEMENT_HEIGHT / 2, UNIT_SIZE * i);

                    // Add the cube
                    WORLD.scene.add(cube);
                    WORLD.world.addBody(createBoxBody(cube, function(object) {
                        if(object.body.id == 0) 
                            toastr.error("You're in the PAVEMENT!!! Please go back to the road.");
                    }));

                }
                /** Draw Grass */
                if(roadMap[i][j] === GRASS_ID) {
                    grassMaterial.map.repeat.set(1, 1);
                    var cube = new THREE.Mesh(
                                    new THREE.BoxGeometry(UNIT_SIZE, PAVEMENT_HEIGHT, UNIT_SIZE), 
                                    grassMaterial
                                );
                    // Set the cube position
                    cube.position.set(UNIT_SIZE * j, PAVEMENT_HEIGHT / 4, UNIT_SIZE * i);

                    // Add the cube
                    WORLD.scene.add(cube);
                    WORLD.world.addBody(createBoxBody(cube, function(object) {
                        if(object.body.id == 0) 
                            toastr.error("You're in the GRASS!!! Please go back to the road.");
                    }));
                }
                /** Draw Road */
                else if(roadMap[i][j] === ROAD_POS_Z || roadMap[i][j] === BLOCKED_POS_Z) {
                    roadPosZMaterial.map.wrapS = roadPosZMaterial.map.wrapT = THREE.RepeatWrapping;
                    roadPosZMaterial.map.repeat.set(1, 1);
                    roadPosZMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
                    var plane = new THREE.Mesh( 
                                    new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), 
                                    roadPosZMaterial 
                                );
                    plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                    WORLD.scene.add( plane );

                }
                else if(roadMap[i][j] === ROAD_POS_X || roadMap[i][j] === BLOCKED_POS_X) {
                    roadPosXMaterial.map.wrapS = roadPosXMaterial.map.wrapT = THREE.RepeatWrapping;
                    roadPosXMaterial.map.repeat.set(1, 1);
                    roadPosXMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
                    var plane = new THREE.Mesh( 
                                    new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), 
                                    roadPosXMaterial 
                                );
                    plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                    WORLD.scene.add( plane );
                }
                else if(roadMap[i][j] === START) {
                    var plane = new THREE.Mesh( 
                        new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), 
                        new THREE.MeshBasicMaterial({ color: 0x123435})  
                    );

                    plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                    WORLD.scene.add( plane );
                }
                else if(roadMap[i][j] === END) {
                    var plane = new THREE.Mesh( 
                        new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), 
                        new THREE.MeshBasicMaterial({ color: 0x4682B4})  
                    );

                    plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                    WORLD.scene.add( plane );
                }
                else if(roadMap[i][j] === INTERSECT_1 || roadMap[i][j] === INTERSECT_2 || roadMap[i][j] === INTERSECT_3 || roadMap[i][j] === INTERSECT_4 || roadMap[i][j] === INTERSECT_5) {
                    var texture;
                    switch(roadMap[i][j]) {
                        case INTERSECT_1:
                            texture = WORLD.textureLoader.load("/images/intersect_1.png");
                            break;
                        case INTERSECT_2: 
                            texture = WORLD.textureLoader.load("/images/intersect_2.png");
                            break;
                        case INTERSECT_3: 
                            texture = WORLD.textureLoader.load("/images/intersect_3.png");
                            break;
                        case INTERSECT_4:
                            texture = WORLD.textureLoader.load("/images/intersect_4.png");
                            break; 
                        case INTERSECT_5: 
                        default:
                            texture = WORLD.textureLoader.load("/images/intersect_5.png");
                            break;
                    }

                    var intersectMaterial = new THREE.MeshBasicMaterial({ map: texture });               
                    
                    intersectMaterial.map.wrapS = roadPosXMaterial.map.wrapT = THREE.RepeatWrapping;
                    intersectMaterial.map.repeat.set(1, 1);
                    intersectMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
                    var plane = new THREE.Mesh( 
                                    new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), 
                                    intersectMaterial 
                                );
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                    plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i);
                    WORLD.scene.add( plane );
                    WORLD.world.addBody(createBoxBody(plane, function(object) {
                        // if(object.body.id == 0) 
                            // toastr.error("Intersection");
                    }));

                }
            }
        }

        // BUILDING BLOCKS
        Object.keys(mapInfo.blocks).forEach(function(key) {
            var block = mapInfo.blocks[key];
            var nameOfBlock = block.name;

            block.positions.forEach(function(pos) {
                if(key === GRASS_ID) {
                    // var plane = new THREE.Mesh( 
                    //                 new THREE.PlaneGeometry(pos.x_width * UNIT_SIZE, pos.z_width * UNIT_SIZE), 
                    //                 grassMaterial 
                    //             );
                    // plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                    // WORLD.scene.add( plane );
                }
                else {
                    // Cubes are on behalf of building blocks
                    var texture;
                    if (key === RESIDENTAL_BUILDING_ID) {
                        /** residental buildings */
                        texture = residentTexture;
                    } 
                    else if (key === OFFICE_BUILDING_ID) {
                        /** office buildings */
                        texture = glassTexture;
                    }
                    var buildingMaterial = new THREE.MeshBasicMaterial({
                        map: texture
                    });
                    buildingMaterial.map.wrapS = buildingMaterial.map.wrapT = THREE.RepeatWrapping;
                    buildingMaterial.map.repeat.set( pos.x_width, 1 );

                    buildingMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();

                    var buildingXWidth = ((2 * pos.x + pos.x_width - 1) * UNIT_SIZE ) / 2;
                    var buildingZWidth = ((2 * pos.z + pos.z_width - 1) * UNIT_SIZE) / 2
            
                    var cube = new THREE.Mesh(new THREE.BoxGeometry(pos.x_width * UNIT_SIZE, UNIT_SIZE, pos.z_width * UNIT_SIZE), buildingMaterial);
                    // Set the cube position
                    cube.position.set(buildingXWidth, UNIT_SIZE / 2 + PAVEMENT_HEIGHT, buildingZWidth);
                    // Add the cube
                    WORLD.scene.add(cube);
                    WORLD.world.addBody(createBoxBody(cube, function(object) {
                        if(object.body.id == 0) 
                            console.log("Player collided with walls.");
                    }));

                    // // Used later for collision detection
                    // var bbox = new THREE.Box3().setFromObject(cube);
                    // WORLD.collidableObjects.push(bbox);

                    // // create a cannon body
                    // var shape = new CANNON.Box(new CANNON.Vec3(
                    //     (bbox.max.x - bbox.min.x) / 2,
                    //     (bbox.max.y - bbox.min.y) / 2,
                    //     (bbox.max.z - bbox.min.z) / 2
                    // ));
                    // var boxBody = new CANNON.Body({ mass: 5 });
                    // boxBody.addShape(shape);
                    // boxBody.position.copy(cube.position);
                    // boxBody.useQuaternion = true;
                    // boxBody.computeAABB();
                    // // disable collision response so objects don't move when they collide
                    // // against each other
                    // boxBody.collisionResponse = true;
                    // // keep a reference to the mesh so we can update its properties later
                    // boxBody.addEventListener('collide', function(object) {
                    //     if(object.body.id == 0) 
                    //         console.log("Player collided with walls.");
                    // });
                    // WORLD.world.addBody(boxBody);
                }
            });
        });

        // WARNING_AREAS
        mapInfo.warning_areas.forEach(function(child) {
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
        })
    });
}

WORLD.loadMap = () => {
    drawGround();
    var models = [
        // {
        //     name: "car",
        //     loader_type: "object",
        //     object_type: "vehicle",
        //     url: "./models/json/volkeswagon-vw-beetle.json",
        //     position: new THREE.Vector3(0, 1.5, 100),
        //     rotation: new THREE.Euler(0, 0, 0, "XYZ"),
        //     scale: new THREE.Vector3(.005, .005, 0.005),
        //     animate: true
        // },
        // {
        //     name: "bus_2", 
        //     loader_type: "gltf", 
        //     object_type: "vehicle",
        //     scale: new THREE.Vector3(.25,.25,.25),
        //     rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
        //     position: new THREE.Vector3(0, 0, 150),
        //     url: "./models/gltf/bus/scene.gltf",
        //     animate: false
        // },
        {
            name: "bus_stop",
            loader_type: "fbx",
            url: "./models/fbx/bus_stop/bus_stop.FBX",
            position: new THREE.Vector3(100, 0, 34),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(.03,.03,.03),
            children: {
                "sign": {
                    position: new THREE.Vector3(0, 60, 100),
                    rotation: new THREE.Euler( - Math.PI / 2, 0, Math.PI, "XYZ"),
                }
            }
        },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-45, -3, 20),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),
        // // },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-45, -3, 35),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),
        // // },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-45, -3, 50),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),            
        // // },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-45, -3, 65),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),            
        // // },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-60, -3, 65),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),            
        // // },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-60, -3, 50),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),            
        // // },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-60, -3, 20),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),
        // // },
        // // {
        // //     name: "tree1",
        // //     loader_type: "object",
        // //     url: "./models/trees/tree1/tree1.json",
        // //     position: new THREE.Vector3(-60, -3, 35),
        // //     rotation: new THREE.Euler(0, 0, 0),
        // //     textureUrl: './models/json/leaves1.png',
        // //     scale: new THREE.Vector3(.5,.5,.5),
        // // },
        // {
        //     name: "bus", 
        //     loader_type: "gltf", 
        //     object_type: "vehicle",
        //     position: new THREE.Vector3(-10, 0, -80),
        //     scale: new THREE.Vector3(.015,.015,.015),
        //     url: "./models/gltf/fortnitecity_bus/scene.gltf",
        //     animate: false
        // },
        // {
        //     name: "car2",
        //     loader_type: "object",
        //     object_type: "vehicle",
        //     url: "./models/json/volkeswagon-vw-beetle.json",
        //     position: new THREE.Vector3(-10, 1.5, -130),
        //     rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
        //     scale: new THREE.Vector3(.005, .005, 0.005),
        //     animate: true
        // },
        // {
        //     name: "bus_2", 
        //     loader_type: "gltf", 
        //     object_type: "vehicle",
        //     scale: new THREE.Vector3(.25,.25,.25),
        //     position: new THREE.Vector3(-35, 0, -2),
        //     url: "./models/gltf/bus/scene.gltf",
        //     animate: false
        // },
        // // {
        // //     name: "camquaydau", 
        // //     loader_type: "object", 
        // //     object_type: "sign",
        // //     url: "./models/signs/traffic-sign.json",
        // //     textureUrl: "./models/signs/camquaydau-uvmap.png",
        // //     animate: false,
        // //     children: {
        // //         "sign": {
        // //             textureUrl: "./models/signs/camquaydau-uvmap.png"
        // //         },
        // //         "pole": {
        // //             textureUrl: "./models/signs/pole-uvmap.png"
        // //         }
        // //     },
        // //     scale: new THREE.Vector3(.5,.5,.5),
        // //     rotation: new THREE.Euler(0, Math.PI, 0, "XYZ")
        // // },
        // {
        //     name: "camrephai", 
        //     loader_type: "object", 
        //     object_type: "sign",
        //     url: "./models/signs/traffic-sign.json",
        //     animate: false,
        //     children: {
        //         "sign": {
        //             textureUrl: "./models/signs/camrephai-uvmap.png"
        //         },
        //         "pole": {
        //             textureUrl: "./models/signs/pole-uvmap.png"
        //         }
        //     },
        //     scale: new THREE.Vector3(.5,.5,.5),
        //     rotation: new THREE.Euler(0, Math.PI, 0, "XYZ")
        // },
        {
            name: "camretrai", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camretrai-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(48, 0, 30),
            scale: new THREE.Vector3(.3,.3,.3),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            infoImg: "./images/info.png",
            direction: {x: 0, y: 0, z: -1}
        },
        {
            name: "camretrai2", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camretrai-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(75, 0, 28),
            scale: new THREE.Vector3(.3,.3,.3),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            infoImg: "./images/info.png",
            direction: {x: 1, y: 0, z: 0}
        },
        {
            name: "camretrai3", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camretrai-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(75, 0, 88),
            scale: new THREE.Vector3(.3,.3,.3),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            infoImg: "./images/info.png"
        },
        {
            name: "camretrai4", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camretrai-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(75, 0, 133),
            scale: new THREE.Vector3(.3,.3,.3),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            infoImg: "./images/info.png"
        },
        {
            name: "camrephai", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camrephai-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(85, 0, 36),
            scale: new THREE.Vector3(.3,.3,.3),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            infoImg: "./images/info.png"
        },
        {
            name: "camrephai2", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camrephai-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(85, 0, 81),
            scale: new THREE.Vector3(.3,.3,.3),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            infoImg: "./images/info.png"
        },
        {
            name: "camrephai3", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camrephai-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            },
            position: new THREE.Vector3(85, 0, 111),
            scale: new THREE.Vector3(.3,.3,.3),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            infoImg: "./images/info.png",
        },
        // {
        //     name: "duongcam", 
        //     loader_type: "object", 
        //     object_type: "sign",
        //     url: "./models/signs/traffic-sign.json",
        //     animate: false,
        //     children: {
        //         "sign": {
        //             textureUrl: "./models/signs/duongcam-uvmap.png"
        //         },
        //         "pole": {
        //             textureUrl: "./models/signs/pole-uvmap.png"
        //         }
        //     },
        //     position: new THREE.Vector3(48, 0, 22.5),
        //     scale: new THREE.Vector3(.3,.3,.3),
        //     rotation: new THREE.Euler(0, Math.PI, 0, "XYZ")
        // },
        {
            name: "traffic-light-1",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(77, 0, 82),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            scale: new THREE.Vector3(.05,.05,.05)
        },
        {
            name: "traffic-light-2",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(77, 0, 88),
            rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05,.05,.05)
        },
        {
            name: "traffic-light-3",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(83, 0, 82),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05,.05,.05)
        },
        {
            name: "traffic-light-4",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(118, 0, 88),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.05,.05,.05)
        },
        {
            name: "traffic-light-5",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(112, 0, 82),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            scale: new THREE.Vector3(.05,.05,.05)
        },
        {
            name: "traffic-light-6",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(112, 0, 88),
            rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05,.05,.05)
        },
        {
            name: "traffic-light-7",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(118, 0, 82),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.05,.05,.05)
        }
    ];

    // add models to the world
    models.forEach(md => loadModelToWorld(md));
}