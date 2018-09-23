const manager = new THREE.LoadingManager();
manager.onProgress = (item, loaded, total) => {
    console.log(item, loaded, total);
};
const onProgress = (xhr) => {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};
const onError = (xhr) => {
    console.log(xhr);
};
WORLD.fbxLoader = new THREE.FBXLoader(WORLD.manager);
WORLD.gltfLoader = new THREE.GLTFLoader(WORLD.manager);
WORLD.objectLoader = new THREE.ObjectLoader(WORLD.manager);
WORLD.textureLoader = new THREE.TextureLoader();

/**
 * 
 * @param {*} type: type of loader
 * @param {*} url: model path 
 */
WORLD.loadModelToWorld = (model) => {
    let { 
        loader_type, 
        url = "object", 
        position = new THREE.Vector3(0, 0, 0), 
        rotation = new THREE.Euler(0, 0, 0, 'XYZ' ), 
        scale = new THREE.Vector3(1, 1, 1), 
        name = "Unknown Model",
        animate = false,
        castShadow = false,
        receiveShadow = false
    } = model;
    
    let loader;

    switch(loader_type) {
        case "fbx":
            loader = WORLD.fbxLoader
            break;
        case "gltf":
            loader = WORLD.gltfLoader
            break;
        case "object":
        default:
            loader = WORLD.objectLoader
            break;
    }

    loader.load(
        url,
        ( obj ) => {
            if(loader_type === "gltf") {
                obj = obj.scene;
            }
            
            if(animate) {
                // model is a THREE.Group (THREE.Object3D)                              
                const mixer = new THREE.AnimationMixer(obj);
                // animations is a list of THREE.AnimationClip                          
                mixer.clipAction(obj.animations[0]).play();
            }
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
                // WORLD.scene.add( sprite );

            WORLD.scene.add( obj );
            console.log("obj:",obj);

            /**
             *  get boundingSphere of obj's children 
             */
            obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = castShadow;
                    child.receiveShadow = receiveShadow;
                    if( child.geometry ) {
                        if(child.geometry.boundingSphere) {
                            // console.log("boundingSphere:",child.geometry.boundingSphere);
                            var childMesh = new THREE.Mesh(
                                child.geometry,
                                new THREE.MeshBasicMaterial({
                                    color: 0xff0000,
                                    wireframe: true
                                })
                            );
                            childMesh.rotation.y = Math.PI; 
                            childMesh.rotation.x = Math.PI / 2;
                            childMesh.position.y = position.y;
                            childMesh.position.x = position.x;
                            childMesh.position.z = position.z;
                            childMesh.scale.x = scale.x;
                            childMesh.scale.y = scale.y;
                            childMesh.scale.z = scale.z;

                            // WORLD.scene.add(childMesh);
                            // var mass = 5;
                            // var sphereShape = new CANNON.Sphere(radius);
                            // var sphereBody = new CANNON.Body({ mass: mass });
                            // sphereBody.addShape(sphereShape);
                            // sphereBody.position.y = position.y;
                            // sphereBody.position.x = position.z;
                            // sphereBody.position.z = position.x;
                            // sphereBody.linearDamping = 0.9;
                            // WORLD.world.add(sphereBody);
                            var center = childMesh.geometry.boundingSphere.center;
                            var radius = childMesh.geometry.boundingSphere.radius * scale.x;
                            var sphere = new THREE.Sphere(center, radius);
                            sphere.position = position;
                            WORLD.collidableObjects.push(sphere);
                        }
                    }
                }
            });
        }, onProgress, onError
    );
}