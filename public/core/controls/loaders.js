const manager = new THREE.LoadingManager();
manager.onProgress = (item, loaded, total) => {
    console.log(item, loaded, total);
};
const onProgress = (xhr) => {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        // console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};
const onError = (xhr) => {
    console.log(xhr);
};
WORLD.fbxLoader = new THREE.FBXLoader(WORLD.manager);
WORLD.gltfLoader = new THREE.GLTFLoader(WORLD.manager);
WORLD.objectLoader = new THREE.ObjectLoader(WORLD.manager);
WORLD.jsonLoader = new THREE.JSONLoader(WORLD.manager);
WORLD.textureLoader = new THREE.TextureLoader();

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
        animate = false,
        castShadow = false,
        receiveShadow = false,
        children,
        object_type,
        angle
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
        case "object":
        default:
            loader = WORLD.objectLoader;
            break;
    }

    if(loader_type === "json") {

        loader.load(url, function(geometry, materials) {

            var material = 
            materials ? materials[0] : 
            new THREE.MeshPhongMaterial({
                color: new THREE.Color(0xd3d3d3),
                specular: new THREE.Color(0xffffff),
                shininess: 100,
                flatShading: THREE.SmoothShading,
                reflectivity: 100,
                map: new THREE.TextureLoader().load('./models/uv.png')
            });
    
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 3, 0);
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

                if(!angle) {

                    var vector = obj.getWorldDirection();
                    var theta = Math.atan2(vector.x,vector.z);
                    angle = THREE.Math.radToDeg(theta);

                }

                var storeObj = {
                    object: obj,
                    angle: angle
                }

                if(object_type === "street_sign") {
                    WORLD.streetSignList.push(storeObj);
                }
                else if(object_type === "vehicle") {
                    WORLD.vehicle.push(storeObj);
                }
                    console.log(name + ": " + angle + " degree")

                var sprite = makeTextSprite("Object: " + obj.name, {
                    fontsize: 24,
                    borderColor: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 1.0
                    },
                    backgroundColor: {
                    r: 255,
                    g: 100,
                    b: 100,
                    a: 0.8
                    }
                });
                sprite.position.set(position.x + 2, position.y, position.z);

                sprite.center.set( 1.0, 0.0 );
                // WORLD.scene.add( sprite );

                WORLD.scene.add( obj );

                // WORLD.world.addBody(objectToBody(obj));

                var helper = new THREE.BoxHelper(obj, 0xff0000);
                helper.update();

                // If you want a visible bounding box
                // WORLD.scene.add(helper);
                var bbox = new THREE.Box3().setFromObject(helper);
                WORLD.collidableObjects.push(bbox);

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
                boxBody.addEventListener('collide', function(object) {
                    if(object.body.id == 0) 
                        console.log("Player collided with object.");
                });
                // WORLD.world.addBody(boxBody);

                obj.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = castShadow;
                        child.receiveShadow = receiveShadow;

                        if(children) {
                            if(children.hasOwnProperty(child.name)) {
                                child.rotation.x = children[child.name].rotation.x || 0; 
                                child.rotation.y = children[child.name].rotation.y || 0; 
                                child.rotation.z = children[child.name].rotation.z || 0;
                                child.position.y = children[child.name].position.y || 0;
                                child.position.x = children[child.name].position.x || 0;
                                child.position.z = children[child.name].position.z || 0;
                                // child.scale.x = children[child.name].scale.x || 1;
                                // child.scale.y = children[child.name].scale.y || 1;
                                // child.scale.z = children[child.name].scale.z || 1;
                            }
                        }
                    }
                });
            }, onProgress, onError
        );
    }
}