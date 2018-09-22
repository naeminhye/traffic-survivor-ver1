WORLD.manager = new THREE.LoadingManager();
WORLD.manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
};
var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};
var onError = function (xhr) {
    console.log(xhr);
};
WORLD.fbxLoader = new THREE.FBXLoader(WORLD.manager);
WORLD.gltfLoader = new THREE.GLTFLoader(WORLD.manager);
WORLD.objectLoader = new THREE.ObjectLoader(WORLD.manager);

/**
 * 
 * @param {*} type: type of loader
 * @param {*} url: model path 
 */
WORLD.loadModelToWorld = 
function (model) {
    var { 
        loader_type, 
        url, 
        position = new THREE.Vector3(0, 0, 0), 
        rotation = new THREE.Euler( 0, 0, 0, 'XYZ' ), 
        scale = new THREE.Vector3(1, 1, 1), 
        name,
        animate
        //castShadow,
        //receiveShadow
    } = model;
    
    var loader;

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
        function ( obj ) {
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
            WORLD.scene.add( obj );

            WORLD.collidableObjects.push(obj);

            /**
             *  get boundingSphere of obj's children 
             *
                obj.traverse( function ( child ) {
                    if (child instanceof THREE.Mesh) {
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
                                // WORLD.scene.add(childMesh);
                            }
                        }
                    }
                });
             */
        }, onProgress, onError
    );
}