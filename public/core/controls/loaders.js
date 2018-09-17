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
