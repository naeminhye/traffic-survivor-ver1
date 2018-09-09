WORLD.drawGround = function() {
    var floorTexture = new THREE.TextureLoader().load('./images/grasslight-big.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(256, 256);

    // floor
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    // material = new THREE.MeshLambertMaterial( { color: 0xeeee00 } );
    material = new THREE.MeshBasicMaterial({ map: floorTexture });

    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    WORLD.scene.add(mesh);
}

// WORLD.checkDangerArea = function() {
//     console.log("controls.getObject().position:",controls.getObject().position)
// }