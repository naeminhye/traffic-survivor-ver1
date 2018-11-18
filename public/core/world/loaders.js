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

                if(object_type === "regulatory-sign") {
                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "yellow";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    WORLD.regulatorySignList.push(storeObj);
                }
                else if(object_type === "warning-sign") {

                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "orange";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    WORLD.warningSignList.push(storeObj);
                }
                else if(object_type === "guide_signs") {
                    if(GAME.mapContext) {
                        GAME.mapContext.fillStyle = "violet";
                        GAME.mapContext.beginPath(); //Start path
                        GAME.mapContext.arc((obj.position.x / GAME.realMapUnit) * GAME.miniMapUnit, (obj.position.z / GAME.realMapUnit) * GAME.miniMapUnit, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
                        GAME.mapContext.fill();
                    }
                    WORLD.warningSignList.push(storeObj);
                }
                else if(object_type === "vehicle") {
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
                WORLD.collidableObjects.push(bbox);

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

const updateSkinnedAnimation = (storedObject) => {
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

}