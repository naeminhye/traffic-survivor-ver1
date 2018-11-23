var PAVEMENT_ID = "0";
var ROAD_POS_Z = "1";
var ROAD_POS_X = "-1";
var RESIDENTAL_BUILDING_ID = "2";
var OFFICE_BUILDING_ID = "3";
var GRASS_ID = "4";
var START_POS_Z = "S";
var START_POS_X = "-S";
var END_POS_Z = "E";
var END_POS_X = "-E";
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

const manager = new THREE.LoadingManager();
manager.onProgress = (item, loaded, total) => {
    var percentComplete = loaded / total * 100;
    if(Math.round(percentComplete, 2) == 100) {
        WORLD.loaded = true;
        $("#loading").css("display", "none");
        $("#blocker").css("display", "block");
    }
};
const onProgress = (xhr) => {
    // if (xhr.lengthComputable) {
    //     var percentComplete = xhr.loaded / xhr.total * 100;
        // console.log(Math.round(percentComplete, 2) + '% downloaded');
        // if(Math.round(percentComplete, 2) == 100) {
        //     WORLD.loaded = true;
        // }
    // }
};
const onError = (xhr) => {
    console.log(xhr);
};
WORLD.fbxLoader = new THREE.FBXLoader(manager);
WORLD.gltfLoader = new THREE.GLTFLoader(manager);
WORLD.objectLoader = new THREE.ObjectLoader(manager);
WORLD.jsonLoader = new THREE.JSONLoader(manager);
WORLD.textureLoader = new THREE.TextureLoader(manager);
WORLD.tdsLoader = new THREE.TDSLoader(manager);

/**
 * 
 * @param {*} type: type of loader
 * @param {*} url: model path 
 */
const loadModelToWorld = (model) => {
    let { 
        loader_type, 
        url = "object", 
        position = new THREE.Vector3(0, 0, 0), 
        rotation = new THREE.Euler(0, 0, 0, 'XYZ' ), 
        scale = new THREE.Vector3(1, 1, 1), 
        name = "Unknown Model",
        animation = null,
        castShadow = false,
        receiveShadow = false,
        children,
        object_type,
        direction, 
        textureUrl,
        info = null,
        path = null,
        velocity,
    } = model;
    
    let loader;

    switch(loader_type) {
        case "fbx":
            loader = WORLD.fbxLoader;
            break;
        case "gltf":
            loader = WORLD.gltfLoader;
            break;
        case "json":
            loader = WORLD.jsonLoader;
            break;
        case "tds":
        case "3ds":
            loader = WORLD.tdsLoader;
            break;
        case "object":
        default:
            loader = WORLD.objectLoader;
            break;
    }

    if(loader_type === "json") {

        loader.load(url, function(geometry, materials) {

            var texture = new THREE.TextureLoader().load(textureUrl);
            texture.anisotropy = WORLD.renderer.getMaxAnisotropy();

            var material = textureUrl ?  
            new THREE.MeshBasicMaterial({
                map: texture
            })
            : materials[0];
    
            // material.map.minFilter = THREE.LinearFilter;
            var mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
            mesh.position.set(0, 3, 0);
            mesh.material.side = THREE.DoubleSide;
            WORLD.scene.add(mesh);
        }, onProgress, onError);
    }
    else {
        loader.load(
            url,
            ( obj ) => {
                if(loader_type === "gltf") {
                    obj = obj.scene;
                }
                
                // if(animate) {
                //     // model is a THREE.Group (THREE.Object3D)                              
                //     const mixer = new THREE.AnimationMixer(obj);
                //     // animations is a list of THREE.AnimationClip                          
                //     mixer.clipAction(obj.animations[0]).play();
                // }
                // Add the loaded object to the scene
                obj.rotation.x = rotation.x; 
                obj.rotation.y = rotation.y; 
                obj.rotation.z = rotation.z;
                obj.position.y = position.y;
                obj.position.x = position.x;
                obj.position.z = position.z;
                obj.scale.x = scale.x;
                obj.scale.y = scale.y;
                obj.scale.z = scale.z;
                obj.name = name;
                obj.castShadow = castShadow;
                obj.receiveShadow = receiveShadow;
                
                if(!direction) {
                    var v = new THREE.Vector3();
                    direction = obj.getWorldDirection(v);
                }

                var storeObj = {
                    object: obj,
                    direction: direction,
                    info: info
                };

                if(object_type === "regulatory_signs") {
                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "yellow";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    storeObj.hasPassed = false;
                    WORLD.regulatorySignList.push(storeObj);
                }
                else if(object_type === "warning_signs") {

                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "orange";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    storeObj.hasPassed = false;
                    WORLD.warningSignList.push(storeObj);
                }
                else if(object_type === "guidance_signs") {
                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "violet";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    storeObj.hasPassed = false;
                    WORLD.guidanceSignList.push(storeObj);
                }
                else if(object_type === "vehicles") {
                    WORLD.vehicle.push(storeObj);
                    if(path) {
                        var control = new CONTROLS.PathControls(obj, new THREE.CatmullRomCurve3(jsonToThreeObject(path)), {"velocity": velocity || 0.02});
                        // control.showPath();
                        WORLD.vehicleControls.push(control);
                    }
                }
                else if(object_type === "traffic_light") {

                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "green";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    storeObj.animation = {
                        type: "skinned",
                        status: [
                            {
                                status_name: "YELLOWLIGHT",
                                texture: "./models/fbx/traffic-light-2/yellowlight-uvmap.png",
                                duration: 150,
                                action: "slowdown"
                            },
                            {
                                status_name: "REDLIGHT",
                                texture: "./models/fbx/traffic-light-2/redlight-uvmap.png",
                                duration: 850,
                                action: "stop"
                            },
                            {
                                status_name: "GREENLIGHT",
                                texture: "./models/fbx/traffic-light-2/greenlight-uvmap.png",
                                duration: 700,
                                action: "stop"
                            }
                        ]
                    }
                    storeObj.ticker = 0;
                    switch(textureUrl.substring(textureUrl.lastIndexOf('/') + 1)) {
                        case "greenlight-uvmap.png":
                            storeObj.currentStatus = "GREENLIGHT"
                            break;
                        case "yellowlight-uvmap.png":
                            storeObj.currentStatus = "YELLOWLIGHT"
                            break;
                        case "redlight-uvmap.png":
                        default:
                            storeObj.currentStatus = "REDLIGHT";
                            break;
                    }
                    WORLD.trafficLightList.push(storeObj);
                }

                WORLD.scene.add( obj );

                var helper = new THREE.BoxHelper(obj, 0xff0000);
                helper.update();

                // If you want a visible bounding box
                // WORLD.scene.add(helper);
                var bbox = new THREE.Box3().setFromObject(helper);
                //WORLD.collidableObjects.push(bbox);

                // WORLD.world.add(createBoxBody(helper, function(object) {
                //     if(object.body.id == 0) 
                //         console.log("Player collided with " + name + "!");
                // }));

                // create a cannon body
                var shape = new CANNON.Box(new CANNON.Vec3(
                    (bbox.max.x - bbox.min.x) / 2,
                    (bbox.max.y - bbox.min.y) / 2,
                    (bbox.max.z - bbox.min.z) / 2
                ));
                var boxBody = new CANNON.Body({ mass: 5 });
                boxBody.addShape(shape);
                boxBody.position.copy(helper.position);
                boxBody.useQuaternion = true;
                boxBody.computeAABB();
                // disable collision response so objects don't move when they collide
                // against each other
                boxBody.collisionResponse = true;
                // keep a reference to the mesh so we can update its properties later
                // boxBody.addEventListener('collide', function(object) {
                //     if(object.body.id == 0) 
                //         console.log("Player collided with object.");
                // });
                // boxBody.angularVelocity.set(0, 0, 3.5);
                // boxBody.angularDamping = 0.1;
                WORLD.world.add(boxBody);

                obj.traverse((child) => {

                    if (child instanceof THREE.Mesh) {
                        child.castShadow = castShadow;
                        child.receiveShadow = receiveShadow;

                        if (textureUrl) {
                            var texture = new THREE.TextureLoader().load(textureUrl);
                            var material = new THREE.MeshBasicMaterial({
                                map: texture,
                                side: THREE.DoubleSide
                            });  
                            material.map.minFilter = THREE.LinearFilter;
                            child.material = material;
                        }
                        if(children) {
                            if(children.hasOwnProperty(child.name)) {
                                
                                if (children[child.name].textureUrl) {
                                    var childTexture = children[child.name].textureUrl;
                                    var texture = new THREE.TextureLoader().load(childTexture);
                                    // texture.anisotropy = WORLD.renderer.getMaxAnisotropy();
                                    var material = new THREE.MeshBasicMaterial({
                                        map: texture,
                                        side: THREE.DoubleSide
                                    });  
                                    material.map.minFilter = THREE.LinearFilter;
                                    child.material = material;
                                }

                                if(children[child.name].rotation) {

                                    child.rotation.x = children[child.name].rotation.x; 
                                    child.rotation.y = children[child.name].rotation.y; 
                                    child.rotation.z = children[child.name].rotation.z;

                                }

                                if(children[child.name].position) {

                                    child.position.y = children[child.name].position.y;
                                    child.position.x = children[child.name].position.x;
                                    child.position.z = children[child.name].position.z;
                                    
                                }

                                if(children[child.name].scale) {
                                    
                                    child.scale.x = children[child.name].scale.x;
                                    child.scale.y = children[child.name].scale.y;
                                    child.scale.z = children[child.name].scale.z;
                                    
                                }
                            }
                        }
                    }
                });
            }, onProgress, onError
        );
    }
}

const updateSkinnedAnimation = (_object) => {
    var storedObject = _object;
    if(storedObject.animation) {

        if(storedObject.object.children[0].material.map.image) {
            // change skin

            var ticker = storedObject.ticker;
            var nextIndex = 0;
            var duration = 0;

            /** get the current skin */
            var currentFile = storedObject.object.children[0].material.map.image.currentSrc.substring(storedObject.object.children[0].material.map.image.currentSrc.lastIndexOf('/')+1);
            /** get the current status */
            var currentIndex  = storedObject.animation.status.findIndex(function (_status) {
                return _status.texture.substring(_status.texture.lastIndexOf('/') + 1) === currentFile;
            });
            var currentStatus = storedObject.animation.status[currentIndex];

            duration = currentStatus.duration;
            /** last tick --> move to the next status */
            if(ticker === duration) {

                nextIndex = (currentIndex === (storedObject.animation.status.length - 1)) ? 0 : (currentIndex + 1);
                storedObject.object.children[0].material.map = WORLD.textureLoader.load(storedObject.animation.status[nextIndex].texture);
                storedObject.currentStatus = storedObject.animation.status[nextIndex].status_name;
                storedObject.duration = storedObject.animation.status[nextIndex].duration;
                // if(storedObject.object.name === "traffic-light-31-36") {
                //     console.log("storedObject.currentStatus", storedObject.currentStatus);
                // }
                ticker = 0;
            }
            else {
                duration = currentStatus.duration;
                ticker = ticker + 1;
            }
            storedObject.ticker = ticker; 
        }
    }
    return storedObject;
}

/**
 * 
 * @param {*} file the link to the JSON file
 */
var environmentInit = function (file) {
    var squareHouseTexture = WORLD.textureLoader.load("/images/h2.jpg");
    var smallHouseTexture = WORLD.textureLoader.load("/images/h2.jpg");
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
        
        if(mapInfo.player.rotateY) {
            WORLD.player.rotateY(mapInfo.player.rotateY);
        }
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
        WORLD.mapSize = UNIT_SIZE * roadMap.length;

        loadTextureToGround(ROAD_POS_Z, './images/textures/roadposz_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(START_POS_Z, './images/textures/roadposz_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(END_POS_Z, './images/textures/roadposz_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "blue"
        });
        loadTextureToGround(ROAD_POS_X, './images/textures/roadposx_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(START_POS_X, './images/textures/roadposx_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "red"
        });
        loadTextureToGround(END_POS_X, './images/textures/roadposx_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "blue"
        });
        loadTextureToGround(INTERSECT_1, './images/textures/intersect_1.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(INTERSECT_2, './images/textures/intersect_2.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(INTERSECT_3, './images/textures/intersect_3.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(INTERSECT_4, './images/textures/intersect_4.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(INTERSECT_5, './images/textures/intersect_5.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(PAVEMENT_ID, './images/textures/pavement.jpg', roadMap, UNIT_SIZE, false, {
            color: "grey"
        });
        loadTextureToGround(ZEBRA_CROSSING_TOP, './images/textures/zebra_crossing_top.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(ZEBRA_CROSSING_BOTTOM, './images/textures/zebra_crossing_bottom.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(ZEBRA_CROSSING_LEFT, './images/textures/zebra_crossing_left.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
        });
        loadTextureToGround(ZEBRA_CROSSING_RIGHT, './images/textures/zebra_crossing_right.jpg', roadMap, UNIT_SIZE, false, {
            color: "orange"
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
            var texture = squareHouseTexture;
            var buildingMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });
            buildingMaterial.map.wrapS = buildingMaterial.map.wrapT = THREE.RepeatWrapping;
            buildingMaterial.map.repeat.set(UNIT_SIZE, UNIT_SIZE);

            buildingMaterial.map.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();

            var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE) / 2;
            var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;
            GAME.mapContext.fillStyle = "blue";
            GAME.mapContext.fillRect(tile.x * CANVAS_UNIT, tile.z * CANVAS_UNIT, tile.size * CANVAS_UNIT, tile.size * CANVAS_UNIT);

            var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, UNIT_SIZE * 6, tile.size * UNIT_SIZE), buildingMaterial);
            // Set the cube position
            cube.position.set(buildingXWidth, UNIT_SIZE * 3, buildingZWidth);
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
                mapInfo.models[type].forEach((md) => {
                    loadModelToWorld(md);
                });
            });
        }

        if(mapInfo.simple_loading && mapInfo.signs) {
            Object.keys(mapInfo.signs).forEach((type) => {
                mapInfo.signs[type].forEach((sign) => {
                    loadModelToWorld(mappingSigns(sign, UNIT_SIZE));
                    // console.log(mappingSigns(md, UNIT_SIZE))
                });
            });
        }
        else {
            Object.keys(mapInfo.signs).forEach((type) => {
                mapInfo.signs[type].forEach((sign) => {
                    loadModelToWorld(sign)
                });
            });
        }
        
        /** load intersect areas */
        if(mapInfo.intersects) {
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

                var x1 = pos.x - 1; var z1 = pos.z - 1;
                var x2 = pos.x + pos.x_width; var z2 = pos.z - 1;
                var x3 = pos.x + pos.x_width; var z3 = pos.z + pos.z_width;
                var x4 = pos.x - 1; var z4 = pos.z + pos.z_width;

                var traffic_lights = [];
                traffic_lights.push({
                    "name": "traffic-light-" + x1 + "-" + z1,
                    "loader_type": "fbx",
                    "object_type": "traffic_light",
                    "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
                    "position": {
                        "x": x1 * UNIT_SIZE,
                        "y": 0,
                        "z": z1 * UNIT_SIZE
                    },
                    "rotation": {
                        "x": 0,
                        "y": 0,
                        "z": 0,
                        "order": "XYZ"
                    },
                    "scale": {
                        "x": 0.4,
                        "y": 0.4,
                        "z": 0.4
                    },
                    "direction": { "x": 0, "y": 0, "z": 1 },
                    "castShadow": true,
                    "receiveShadow": true
                });
                traffic_lights.push({
                    "name": "traffic-light-" + x2 + "-" + z2,
                    "loader_type": "fbx",
                    "object_type": "traffic_light",
                    "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
                    "position": {
                        "x": x2 * UNIT_SIZE,
                        "y": 0,
                        "z": z2 * UNIT_SIZE
                    },
                    "rotation": {
                        "x": 0,
                        "y": -1.5707963267948966,
                        "z": 0,
                        "order": "XYZ"
                    },
                    "scale": {
                        "x": 0.4,
                        "y": 0.4,
                        "z": 0.4
                    },
                    "direction": { "x": -1, "y": 0, "z": 0 },
                    "castShadow": true,
                    "receiveShadow": true
                });
                traffic_lights.push({
                    "name": "traffic-light-" + x3 + "-" + z3,
                    "loader_type": "fbx",
                    "object_type": "traffic_light",
                    "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
                    "position": {
                        "x": x3 * UNIT_SIZE,
                        "y": 0,
                        "z": z3 * UNIT_SIZE
                    },
                    "rotation": {
                        "x": 0,
                        "y": 3.141592653589793,
                        "z": 0,
                        "order": "XYZ"
                    },
                    "scale": {
                        "x": 0.4,
                        "y": 0.4,
                        "z": 0.4
                    },
                    "direction": { "x": 0, "y": 0, "z": -1 },
                    "castShadow": true,
                    "receiveShadow": true
                });
                traffic_lights.push({
                    "name": "traffic-light-" + x4 + "-" + z4,
                    "loader_type": "fbx",
                    "object_type": "traffic_light",
                    "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
                    "position": {
                        "x": x4 * UNIT_SIZE,
                        "y": 0,
                        "z": z4 * UNIT_SIZE
                    },
                    "rotation": {
                        "x": 0,
                        "y": 1.5707963267948966,
                        "z": 0,
                        "order": "XYZ"
                    },
                    "scale": {
                        "x": 0.4,
                        "y": 0.4,
                        "z": 0.4
                    },
                    "direction": { "x": 1, "y": 0, "z": 0 },
                    "castShadow": true,
                    "receiveShadow": true
                });

                traffic_lights.forEach((light) => loadModelToWorld(light));
                
            });
        }
        
        /** load one way areas */
        if(mapInfo.one_ways) {
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
                WORLD.one_ways.push({ box: area, bbox: areaBBox, direction: child.direction, infoImg: "./images/info.png"});
            });
        }
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

/**
 * 
 * @param {*} sign 
 * sign:
 * x
 * z
 * object_type
 * sign_id
 * name
 * url
 * directionToMap
 * children
 */
const mappingSigns = (sign, UNIT_SIZE) => {
    var data = {
      castShadow: true,
      receiveShadow: true
    };
	
    data.loader_type = sign.loader_type;
    data.object_type = sign.object_type;
	data.sign_id = sign.sign_id;
    data.name = sign.name + "-" + sign.x + "-" + sign.z;
    data.url = sign.url;
    data.info = sign.info;
	
	switch(sign.directionToMap) {
		case "up":
			data.direction = new THREE.Vector3(0, 0, 1);
            data.rotation = new THREE.Euler(0, -Math.PI/2, 0, "XYZ");
			break;
		case "down":
			data.direction = new THREE.Vector3(0, 0, -1);
            data.rotation = new THREE.Euler(0, Math.PI/2, 0, "XYZ");
			break;
		case "left":
			data.direction = new THREE.Vector3(1, 0, 0);
            data.rotation = new THREE.Euler(0, 0, 0, "XYZ");
			break;
		case "right":
			data.direction = new THREE.Vector3(-1, 0, 0);
            data.rotation = new THREE.Euler(0, Math.PI, 0, "XYZ");
			break;
    }
	if(sign.children) {
		data.children = sign.children;
	}
    if (sign.name === "hieulenhthang") {
        var rotationY= data.rotation.y - Math.PI/2;
        data.rotation = new THREE.Euler(0, rotationY, 0, "XYZ");
        // children rotation.z = Math.PI
        data.children.sign.rotation = new THREE.Euler(0, 0, -Math.PI/2, "XYZ");

    }
    else if (sign.name === "huongphaiditheo-phai") {
        var rotationY= data.rotation.y - Math.PI/2;
        data.rotation = new THREE.Euler(0, rotationY, 0, "XYZ");
        // rotation.y = ROTATIONY - MathPI/2 = 0
        // children rotation.z = Math.PI
        data.children.sign.rotation = new THREE.Euler(0, 0, Math.PI, "XYZ");
    }
    else if (sign.name === "huongphaiditheo-trai") {
        var rotationY= data.rotation.y - Math.PI/2;
        data.rotation = new THREE.Euler(0, rotationY, 0, "XYZ");
        // children rotation.z = Math.PI
        data.children.sign.rotation = new THREE.Euler(0, 0, 0, "XYZ");
    }
	
	data.scale = new THREE.Vector3(0.3, 0.3, 0.3);
    data.position = new THREE.Vector3(sign.x * UNIT_SIZE, 0, sign.z * UNIT_SIZE);    
	
	return data;
}