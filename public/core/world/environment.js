var PAVEMENT_ID = "0";
var ROAD_POS_Z = "1"; // VERTICAL
var ROAD_POS_X = "-1";
var DOUBLE_ROAD_POS_Z = "11"; // VERTICAL
var DOUBLE_ROAD_POS_X = "-11";
var HOUSES_ID = "H";
var VILLA_ID = "V";
var RESIDENTAL_BUILDING_ID = "2";
var SMALL_BUILDING_ID = "3";
var NEW_BUILDING_ID = "5";
var OFFICE_BUILDING_ID = "6";
var GRASS_ID = "G";
var COBBLESTONE_ID = "CS"; //cobblestones.jpg
var START_POS_Z = "S";
var START_POS_X = "-S";
var END_POS_Z = "E";
var END_POS_X = "-E";
var BLOCKED_POS_Z = "X";
var BLOCKED_POS_X = "-X";
var INTERSECT_1 = "I1";
var INTERSECT_2 = "I2";
var INTERSECT_3 = "I3";
var INTERSECT_4 = "I4";
var INTERSECT_5 = "I5";
var ZEBRA_CROSSING_TOP = "ZT";
var ZEBRA_CROSSING_BOTTOM = "ZB";
var ZEBRA_CROSSING_LEFT = "ZL";
var ZEBRA_CROSSING_RIGHT = "ZR";
var NORMAL_LAND = "L";
var ROUNDABOUT = "R";

const manager = new THREE.LoadingManager();

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	$("#loading-text").text( 'Quá trình tải sẽ mất mốt ít thời gian, đợi chút nha!' );
};

manager.onProgress = (item, loaded, total) => {
    var percentComplete = loaded / total * 100;
    if(Math.round(percentComplete, 2) === 100) {
        $("#loading-text").text("Hoàn tất thiết lập trong vài giây nữa...")
    }
    else {
        $("#loading-text").text("Đang tải " + Math.round(percentComplete, 2) + "%")
    }
};

manager.onLoad = () => {
    $("#loading-text").text( 'Bắt đầu thôi!' );
    setTimeout(() => {
        $("#loading-text").fadeOut(500);
        WORLD.loaded = true;
        $("#loading").fadeOut(5000);
        GAME.blocker.css("display", "block");
    }, 1000)
}
manager.onError = (xhr) => {
    console.log(xhr);
};

WORLD.fbxLoader = new THREE.FBXLoader(manager);
WORLD.gltfLoader = new THREE.GLTFLoader(manager);
WORLD.objectLoader = new THREE.ObjectLoader(manager);
WORLD.jsonLoader = new THREE.JSONLoader(manager);
WORLD.textureLoader = new THREE.TextureLoader(manager);
WORLD.tdsLoader = new THREE.TDSLoader(manager);
WORLD.objLoader = new THREE.OBJLoader(manager);
WORLD.mtlLoader = new THREE.MTLLoader(manager);

const attachedHouseList = [
    {
        name: "attached_01",
        url: "/images/textures/houses/attached/attached_01.jpg",
        width: 1024 ,
        height:  1024
    },
    {
        name: "attached_02",
        url: "/images/textures/houses/attached/attached_02.jpg",
        width: 256 ,
        height: 128
    },
    {
        name: "attached_03",
        url: "/images/textures/houses/attached/attached_03.jpg",
        width: 512 ,
        height: 512 
    },
    {
        name: "attached_04",
        url: "/images/textures/houses/attached/attached_04.jpg",
        width: 512 ,
        height: 512 
    },
    {
        name: "attached_05",
        url: "/images/textures/houses/attached/attached_05.jpg",
        width: 296 ,
        height: 400
    },
    {
        name: "attached_06",
        url: "/images/textures/houses/attached/attached_06.jpg",
        width: 256,
        height: 256
    },
    {
        name: "attached_07",
        url: "/images/textures/houses/attached/attached_07.jpg",
        width: 451 ,
        height:  383
    },
    {
        name: "attached_08",
        url: "/images/textures/houses/attached/attached_08.jpg",
        width: 542 ,
        height:  418
    },
    {
        name: "attached_09",
        url: "/images/textures/houses/attached/attached_09.jpg",
        width: 453 ,
        height:  418
    },
    {
        name: "attached_10",
        url: "/images/textures/houses/attached/attached_10.jpg",
        width: 434 ,
        height:  540
    },
    {
        name: "attached_11",
        url: "/images/textures/houses/attached/attached_11.jpg",
        width: 1250,
        height: 1250
    },
    {
        name: "attached_12",
        url: "/images/textures/houses/attached/attached_12.jpg",
        width: 388 ,
        height: 355
    },
    {
        name: "attached_13",
        url: "/images/textures/houses/attached/attached_13.jpg",
        width: 774,
        height:  506
    },
    {
        name: "attached_14",
        url: "/images/textures/houses/attached/attached_14.jpg",
        width: 563 ,
        height:  324
    }
]

const terraceHouseList = [
    {
        name: "terrace_01",
        url: "/images/textures/houses/terrace/terrace_01.jpg",
        width: 1024,
        height: 512 
    },
    {
        name: "terrace_02",
        url: "/images/textures/houses/terrace/terrace_02.jpg",
        width: 2279,
        height: 1350 
    },
    {
        name: "terrace_03",
        url: "/images/textures/houses/terrace/terrace_03.jpg",
        width: 530 ,
        height: 400
    }
]

/**
 * 
 * @param {*} type: 
 * @param {*} url: model path 
 */
const loadModelToWorld = (model) => {
    let { 
        loader_type, // type of loader
        url, 
        position = new THREE.Vector3(0, 0, 0), 
        rotation = new THREE.Euler(0, 0, 0, 'XYZ' ), 
        scale = new THREE.Vector3(1, 1, 1), 
        name = "Unknown Model", 
        animation = null,
        castShadow = false,
        receiveShadow = false,
        children,
        object_type,
        mtl,
        texturePath,
        direction,  // hướng xoay mặt của model
        textureUrl, // link của texture
        info = null,
        path = null, // đường đi (dành cho vehicles)
        velocity, // tốc độ di chuyển (dành cho vehicles)
        sign_id // id của biển báo nếu model là biển báo
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
        case "obj":
            loader = WORLD.objLoader;
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
    
            var mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
            mesh.position.set(0, 3, 0);
            mesh.material.side = THREE.DoubleSide;
            WORLD.scene.add(mesh);
        });
    }
    else if(loader_type === "obj" && mtl) {
        var mtlLoader = WORLD.mtlLoader;
        mtlLoader.setTexturePath(texturePath);
        mtlLoader.load(mtl, function(materials){
            materials.preload();
            loader.setMaterials(materials);
            loader.load(url, function(object) {
                object.traverse(function(child){
                    if( child instanceof THREE.Mesh ){
                        child.castShadow = castShadow;
                        child.receiveShadow = receiveShadow;
                    }
                });
                WORLD.scene.add(object);
                object.rotation.set(rotation.x, rotation.y, rotation.z);
                object.position.set(position.x, position.y, position.z)
                object.scale.set(scale.x, scale.y, scale.z);
                object.name = name;
            });
        });
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
                    obj.matrixAutoUpdate = false;
                    obj.updateMatrix();
                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "red";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    storeObj.hasPassed = false;
                    storeObj.sign_id = sign_id;
                    WORLD.regulatorySignList.push(storeObj);
                    GAME.totalNumOfSign++;
                }
                else if(object_type === "warning_signs") {
                    obj.matrixAutoUpdate = false;
                    obj.updateMatrix();
                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "red";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    storeObj.hasPassed = false;
                    storeObj.sign_id = sign_id;
                    WORLD.warningSignList.push(storeObj);
                    GAME.totalNumOfSign++;
                }
                else if(object_type === "guidance_signs") {
                    obj.matrixAutoUpdate = false;
                    obj.updateMatrix();
                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "red";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    storeObj.hasPassed = false;
                    storeObj.sign_id = sign_id;
                    WORLD.guidanceSignList.push(storeObj);
                    GAME.totalNumOfSign++;
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

                    // if(GAME.mapContext) {
                    //     GAME.mapContext.fillStyle = "green";
                    //     GAME.mapContext.beginPath(); //Start path
                    //     GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                    //     GAME.mapContext.fill();
                    // }
                    storeObj.animation = {
                        type: "skinned",
                        status: [
                            {
                                status_name: "YELLOWLIGHT",
                                texture: "/models/fbx/traffic-light-2/yellowlight-uvmap.png",
                                duration: 150,
                                action: "slowdown"
                            },
                            {
                                status_name: "REDLIGHT",
                                texture: "/models/fbx/traffic-light-2/redlight-uvmap.png",
                                duration: 850,
                                action: "stop"
                            },
                            {
                                status_name: "GREENLIGHT",
                                texture: "/models/fbx/traffic-light-2/greenlight-uvmap.png",
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
                // WORLD.world.add(boxBody);

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
            }
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

WORLD.loadMap = () => {
    var chapterNumber = getUrlParameter('chapter');
    environmentInit("./core/chapters/chapter_" + chapterNumber + "/chapter_" + chapterNumber + ".json");
}

/**
 * 
 * @param {*} file the link to the JSON file
 */
const environmentInit = function (file) {

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
        /** vị trí người chơi trên mini map */  
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

        const groundTextures = [
            {
                id: ROAD_POS_X,
                url: './images/textures/roadposx_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: ROAD_POS_Z, 
                url: './images/textures/roadposz_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: DOUBLE_ROAD_POS_Z, 
                url: './images/textures/roadposz_2.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: START_POS_Z, 
                url: './images/textures/roadposz_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "red"
                },
                callback: null
            },
            {
                id: END_POS_Z, 
                url: './images/textures/roadposz_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "red"
                },
                callback: null
            },
            {
                id: ROAD_POS_X, 
                url: './images/textures/roadposx_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: DOUBLE_ROAD_POS_X, 
                url: './images/textures/roadposx_2.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: START_POS_X, 
                url: './images/textures/roadposx_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "red"
                },
                callback: null
            },
            {
                id: END_POS_X, 
                url: './images/textures/roadposx_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "red"
                },
                callback: null
            },
            {
                id: INTERSECT_1, 
                url: './images/textures/intersect_1.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: INTERSECT_2, 
                url: './images/textures/intersect_2.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: INTERSECT_3, 
                url: './images/textures/intersect_3.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE,
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: INTERSECT_4, 
                url: './images/textures/intersect_4.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: INTERSECT_5, 
                url: './images/textures/intersect_5.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: PAVEMENT_ID, 
                url: './images/textures/pavement.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "grey"
                },
                callback: null
            },
            {
                id: ZEBRA_CROSSING_TOP, 
                url: './images/textures/zebra_crossing_top.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: ZEBRA_CROSSING_BOTTOM, 
                url: './images/textures/zebra_crossing_bottom.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: ZEBRA_CROSSING_LEFT, 
                url: './images/textures/zebra_crossing_left.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                },
                callback: null
            },
            {
                id: ZEBRA_CROSSING_RIGHT, 
                url: './images/textures/zebra_crossing_right.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                }
            },
            {
                id: GRASS_ID, 
                url: './images/grassdark.jpg', 
                map: roadMap,
                unit_size: UNIT_SIZE, 
                isMultiple: true, 
                minimap: {
                    color: "green"
                }
            },
            {
                id: COBBLESTONE_ID, 
                url: './images/textures/cobblestones.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "grey"
                }
            },
            {
                id: NORMAL_LAND, 
                url: './images/textures/street.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: true, 
                minimap: {
                    color: "grey"
                }
            },
            {
                id: ROUNDABOUT, 
                url: './images/textures/roundabout.jpg', 
                map: roadMap, 
                unit_size: UNIT_SIZE, 
                isMultiple: false, 
                minimap: {
                    color: "orange"
                }
            }
        ]

        /** VẼ TEXTURE LÊN MẶT ĐẤT LÀM ĐƯỜNG, VỈA HÈ ... */
        if (groundTextures) {
            groundTextures.forEach((texture) => {
                loadTextureToGround(texture.id, 
                                    texture.url, 
                                    texture.map, 
                                    texture.unit_size, 
                                    texture.isMultiple, 
                                    texture.minimap, 
                                    texture.callback);
            });
        }

        //
        // ─── HOUSE MESHES AND MATERIALS ──────────────────────────────────
        //
            let houseMeshes = [];
            let houseMaterials = [];
            let materialIndex = 0;
            findSquareSubMapWithSize(roadMap, HOUSES_ID, 2).forEach(function (tile) {
                
                /** Vẽ trên map */
                GAME.mapContext.fillStyle = "gray";
                GAME.mapContext.fillRect(tile.x * CANVAS_UNIT, tile.z * CANVAS_UNIT, tile.size * CANVAS_UNIT, tile.size * CANVAS_UNIT);

                /** residental buildings */
                var houseTexture;
                var randomSize = 0;//= Math.random();
                var randomHeight = Math.floor((Math.random()) * 4) + 1; 
                var randomHouse = Math.floor((Math.random()) * attachedHouseList.length) + 0; 

                var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE) / 2;
                var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;

                houseTexture = WORLD.textureLoader.load(attachedHouseList[randomHouse].url, function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.offset.set( 0, 0 );
                    texture.repeat.set( 1, 1 );
                    texture.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
                });
                var ratio = attachedHouseList[randomHouse].width / attachedHouseList[randomHouse].height;

                var buildingMaterial = new THREE.MeshBasicMaterial({
                    map: houseTexture
                });
                
                for(var i = 0; i < randomHeight; i++) {
                    var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE - randomSize , (UNIT_SIZE * tile.size) / ratio, tile.size * UNIT_SIZE - randomSize), buildingMaterial);
                    // Set the cube position
                    cube.position.set(buildingXWidth, ((UNIT_SIZE * tile.size) / (ratio * 2)) + (UNIT_SIZE * tile.size * i) / ratio, buildingZWidth);
                    // Add the cube
                    // WORLD.scene.add(cube);
                    WORLD.collidableObjects.push(cube);
                    houseMeshes.push({mesh: cube, materialIndex: materialIndex});
                    houseMaterials.push(buildingMaterial);
                    materialIndex ++;
                }

                // WORLD.world.add(createBoxBody(cube, function (object) {
                //     if (object.body.id == 0)
                //         console.log("Player collided with walls.");
                // }));
            });

            // Geometry of the combined mesh
            var totalGeometry = new THREE.Geometry();
            for(var i = 0; i < houseMeshes.length; i++)
            {
                houseMeshes[i].mesh.updateMatrix();
                totalGeometry.merge(houseMeshes[i].mesh.geometry, houseMeshes[i].mesh.matrix, houseMeshes[i].materialIndex);
            }
            
            // Create the combined mesh
            var combinedMesh = new THREE.Mesh(totalGeometry, houseMaterials);
            combinedMesh.matrixAutoUpdate = false;
            combinedMesh.updateMatrix();
            WORLD.scene.add(combinedMesh);

            findSquareSubMapWithSize(roadMap, VILLA_ID, 4).forEach(function (tile) {

                /** Vẽ trên map */
                GAME.mapContext.fillStyle = "gray";
                GAME.mapContext.fillRect(tile.x * CANVAS_UNIT, tile.z * CANVAS_UNIT, tile.size * CANVAS_UNIT, tile.size * CANVAS_UNIT);

                /** residental buildings */
                var houseTexture;
                var randomHouse = Math.floor((Math.random()) * terraceHouseList.length) + 0; 
                /** residental buildings */
                var houseTexture;

                var buildingXWidth = ((2 * tile.x + tile.size - 1) * UNIT_SIZE) / 2;
                var buildingZWidth = ((2 * tile.z + tile.size - 1) * UNIT_SIZE) / 2;

                
                houseTexture = WORLD.textureLoader.load(terraceHouseList[randomHouse].url, function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.offset.set( 0, 0 );
                    texture.repeat.set( 1, 1 );
                    texture.anisotropy = WORLD.renderer.capabilities.getMaxAnisotropy();
                });
                var ratio = terraceHouseList[randomHouse].width / terraceHouseList[randomHouse].height;

                var buildingMaterial = new THREE.MeshBasicMaterial({
                    map: houseTexture
                });
                // houseMaterials.push(buildingMaterial);
                
                var cube = new THREE.Mesh(new THREE.BoxGeometry(tile.size * UNIT_SIZE, (UNIT_SIZE * tile.size) / ratio, tile.size * UNIT_SIZE), buildingMaterial);
                // Set the cube position
                cube.position.set(buildingXWidth, ((UNIT_SIZE * tile.size) / (ratio * 2)), buildingZWidth);
                // Add the cube
                WORLD.scene.add(cube);
                WORLD.collidableObjects.push(cube);
                // houseMeshes.push({mesh: cube, materialIndex: materialIndex});
                // materialIndex ++;
                // WORLD.world.add(createBoxBody(cube, function (object) {
                //     if (object.body.id == 0)
                //         console.log("Player collided with walls.");
                // }));
            });

    // ─────────────────────────────────────────────────────────────────


        /** load models */
        if(mapInfo.models) {
            Object.keys(mapInfo.models).forEach((type) => {
                mapInfo.models[type].forEach((md) => {
                    loadModelToWorld(md);
                });
            });
        }

        GAME.numOfSign = 0;
        GAME.totalNumOfSign = 0;
        /** load các biển báo */
        if(mapInfo.signs) {
            Object.keys(mapInfo.signs).forEach((type) => {
                mapInfo.signs[type].forEach((sign) => {
                    loadModelToWorld(mappingSigns(sign, UNIT_SIZE));
                });
            });
        }
        
        /** load intersect areas */
        if(mapInfo.intersects) {
            mapInfo.intersects.forEach(function(child) {
                var pos = child;
                var box = createBBox(pos, UNIT_SIZE);
                WORLD.intersects.push({ box: box.area, bbox: box.areaBBox });

                var x1 = pos.x - 1; var z1 = pos.z - 1;
                var x2 = pos.x + pos.x_width; var z2 = pos.z - 1;
                var x3 = pos.x + pos.x_width; var z3 = pos.z + pos.z_width;
                var x4 = pos.x - 1; var z4 = pos.z + pos.z_width;

                var traffic_lights = [];
                traffic_lights.push({
                    "name": "traffic-light-" + x1 + "-" + z1,
                    "loader_type": "fbx",
                    "object_type": "traffic_light",
                    "url": "/models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "/models/fbx/traffic-light-2/greenlight-uvmap.png",
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
                    "url": "/models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "/models/fbx/traffic-light-2/redlight-uvmap.png",
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
                    "url": "/models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "/models/fbx/traffic-light-2/greenlight-uvmap.png",
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
                    "url": "/models/fbx/traffic-light-2/trafficlight.fbx",
                    "textureUrl": "/models/fbx/traffic-light-2/redlight-uvmap.png",
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
        
        /** load roundabout areas */
        if(mapInfo.roundabouts) {
            mapInfo.roundabouts.forEach(function(child) {
                var pos = child;

                var sphere = createBSphere(pos, UNIT_SIZE);
        
                WORLD.roundabouts.push(sphere);

                var x1 = pos.x + 1; var z1 = pos.z - 1;
                var x2 = pos.x + pos.x_width; var z2 = pos.z + 1;
                var x3 = pos.x + pos.x_width - 2; var z3 = pos.z + pos.z_width;
                var x4 = pos.x - 1; var z4 = pos.z + pos.z_width - 2;

                var roundabout_signs = [];
                roundabout_signs.push({
                    "x": x1,
                    "z": z1,
                    "loader_type": "object",
                    "object_type": "guidance_signs",
                    "sign_id": "303",
                    "name": "vongxuyen",
                    "url": "/models/signs/round-info-sign.json",
                    "directionToMap": "up",
                    "children": {
                        "sign": {
                            "textureUrl": "/models/signs/vongxuyen-uvmap.png"
                        },
                        "pole": {
                            "textureUrl": "/models/signs/pole-uvmap.png"
                        }
                    },
                    "info": "Guide Sign: You are going to meet a roundabout!!"
                });
                roundabout_signs.push({
                    "x": x2,
                    "z": z2,
                    "loader_type": "object",
                    "object_type": "guidance_signs",
                    "sign_id": "303",
                    "name": "vongxuyen",
                    "url": "/models/signs/round-info-sign.json",
                    "directionToMap": "right",
                    "children": {
                        "sign": {
                            "textureUrl": "/models/signs/vongxuyen-uvmap.png"
                        },
                        "pole": {
                            "textureUrl": "/models/signs/pole-uvmap.png"
                        }
                    },
                    "info": "Guide Sign: You are going to meet a roundabout!!"
                });
                roundabout_signs.push({
                    "x": x3,
                    "z": z3,
                    "loader_type": "object",
                    "object_type": "guidance_signs",
                    "sign_id": "303",
                    "name": "vongxuyen",
                    "url": "/models/signs/round-info-sign.json",
                    "directionToMap": "down",
                    "children": {
                        "sign": {
                            "textureUrl": "/models/signs/vongxuyen-uvmap.png"
                        },
                        "pole": {
                            "textureUrl": "/models/signs/pole-uvmap.png"
                        }
                    },
                    "info": "Guide Sign: You are going to meet a roundabout!!"
                });
                roundabout_signs.push({
                    "x": x4,
                    "z": z4,
                    "loader_type": "object",
                    "object_type": "guidance_signs",
                    "sign_id": "303",
                    "name": "vongxuyen",
                    "url": "/models/signs/round-info-sign.json",
                    "directionToMap": "left",
                    "children": {
                        "sign": {
                            "textureUrl": "/models/signs/vongxuyen-uvmap.png"
                        },
                        "pole": {
                            "textureUrl": "/models/signs/pole-uvmap.png"
                        }
                    },
                    "info": "Guide Sign: You are going to meet a roundabout!!"
                });

                roundabout_signs.forEach((sign) => loadModelToWorld(mappingSigns(sign, UNIT_SIZE)));
                
            });
        }
        
        /** load one way areas */
        if(mapInfo.one_ways) {
            mapInfo.one_ways.forEach(function(child) {
                var pos = child.position;
                var box = createBBox(pos, UNIT_SIZE);
                WORLD.one_ways.push({ box: box.area, bbox: box.areaBBox, direction: child.direction, infoImg: "./images/info.png"});
            });
        }
        
        /** load speed restricted way areas */
        if(mapInfo.speed_restriction) {
            mapInfo.speed_restriction.forEach(function(child) {
                var pos = child.position;
                var box = createBBox(pos, UNIT_SIZE);
                WORLD.speed_restriction_ways.push({ box: box.area, bbox: box.areaBBox, min_speed: child.min_speed, max_speed: child.max_speed, direction: child.direction});
            });
        }
        
        /** load end zone */
        if(mapInfo.end_zone) {
            mapInfo.end_zone.forEach(function(child) {
                var pos = child.position;
                var box = createBBox(pos, UNIT_SIZE);
                WORLD.endZone.push({ box: box.area, bbox: box.areaBBox });

                var XWidth = ((2 * pos.x + pos.x_width - 1) * UNIT_SIZE ) / 2;
                var ZWidth = ((2 * pos.z + pos.z_width - 1) * UNIT_SIZE) / 2
                // translucent blue sphere with additive blending for "glow" effect
                
                var mat = new THREE.MeshBasicMaterial( { color: 0x3498db, transparent: true, opacity: 0.5, flatShading: THREE.FlatShading } );
                var square = new THREE.Mesh(new THREE.BoxGeometry(pos.x_width * UNIT_SIZE, pos.x_width * UNIT_SIZE, pos.z_width * UNIT_SIZE), mat );
                square.position.set(XWidth, 0, ZWidth);
                //WORLD.scene.add( square );
            });
        }

        /** load parks */
        if(mapInfo.parks) {
            mapInfo.parks.forEach((child) => {

                for( let i = child.x + 2; i < child.x + child.x_width; i += 2 ) {
                    for( let j = child.z + 2; j < child.z + child.z_width; j += 2 ) {
                    
                        let data = { 
                            "loader_type": "object", 
                            "url": "/models/trees/tree/tree.json", 
                            "name": "tree-" + i + "-" + j, 
                            "object_type": "trees",
                            "position": {"x": i * UNIT_SIZE,"y": 0,"z": j * UNIT_SIZE},
                        };
                        // let data = { 
                        //     "loader_type": "fbx", 
                        //     "url": "/models/trees/tree/tree.fbx", 
                        //     "name": "tree-" + i + "-" + j, 
                        //     "textureUrl": "public/models/trees/tree/tree-uvmap.png",
                        //     "object_type": "trees",
                        //     "position": {"x": i * UNIT_SIZE,"y": 0,"z": j * UNIT_SIZE},
                        //     "scale": {"x": 0.01,"y": 0.01,"z": 0.01}
                        // };
    
                        loadModelToWorld(data);

                    }   
                }

            });
        }

        // bike model
        WORLD.objectLoader.load("/models/fbx/bike/bike.json", ( obj ) => {
            obj.position.x = WORLD.player.position.x;
            obj.position.y = WORLD.player.position.y - 6;
            obj.position.z = WORLD.player.position.z;
            //obj.rotation.y = Math.PI;
            var v = new THREE.Vector3();
            obj.lookAt(WORLD.player.getWorldDirection(v));
            obj.name = "xe"
            obj.traverse((child) => {

                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    var texture = new THREE.TextureLoader().load("/models/fbx/bike/bike-uvmap.png");
                    var material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide
                    });  
                    child.material = material;
                }
            });
            PLAYER.bike = obj;

            if(PLAYER.bike) {
                PLAYER.bike.scale.set(0.003, 0.003, 0.003);
                // position the bike in front of the camera
                PLAYER.bike.position.set(
                    WORLD.player.position.x - Math.sin(WORLD.player.rotation.y) * 0.75,
                    0, 
                    WORLD.player.position.z - Math.cos(WORLD.player.rotation.y) * 0.75
                );
                PLAYER.bike.rotation.set(
                    WORLD.player.rotation.x,
                    WORLD.player.rotation.y - Math.PI,
                    WORLD.player.rotation.z
                );
            }
            WORLD.scene.add(PLAYER.bike);
        });
    });
}

const loadTextureToGround = (id, url, map, unit_size, isMultiple, minimap, callback) => {
    findSquareSubMap(map, id).forEach(function (tile) {

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