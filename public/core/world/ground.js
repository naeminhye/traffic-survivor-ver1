WORLD.drawGround = function() {
    var floorTexture = WORLD.textureLoader.load('./images/grasslight-big.jpg');
    var roadTexture = WORLD.textureLoader.load('./images/road.jpg');
    var pavementTexture = WORLD.textureLoader.load('./images/pavement.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(400, 400);
    pavementTexture.wrapS = pavementTexture.wrapT = THREE.RepeatWrapping;
    pavementTexture.repeat.set(20, 20);
    roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(20, 20);

    // floor geometry
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    var grassMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
    var pavementMaterial = new THREE.MeshBasicMaterial({ map: pavementTexture });

    mesh = new THREE.Mesh(geometry, grassMaterial );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // WORLD.scene.add(mesh);

    var roadMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ];

    var mapWidth = roadMap.length;
    var mapHeight = roadMap[0].length;
    var roadTexture = WORLD.textureLoader.load('./images/road.jpg');
    var roadMaterial = new THREE.MeshBasicMaterial({ map: roadTexture });
    var UNIT_SIZE = 10;

    for(var i = 0 - (mapHeight / 2); i < mapHeight / 2; i++) {
        for(var j = 0 - (mapWidth / 2); j < mapWidth / 2; j++) {
            if(roadMap[i + mapHeight / 2][j + mapWidth / 2] === 0) {

                var plane = new THREE.Mesh( new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), pavementMaterial );

                plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                WORLD.scene.add( plane );


            }
            else if (roadMap[i + mapHeight / 2][j + mapWidth / 2] === 1) {
                var plane = new THREE.Mesh( new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), roadMaterial );

                plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                WORLD.scene.add( plane );
            }
            else if (roadMap[i + mapHeight / 2][j + mapWidth / 2] === 2) {
                // Cubes are on behalf of building blocks
                var cubeHeight = Math.floor((Math.random() * (UNIT_SIZE)) + (UNIT_SIZE / 2));;
                var cube = new THREE.Mesh(new THREE.BoxGeometry(UNIT_SIZE, UNIT_SIZE, UNIT_SIZE), new THREE.MeshPhongMaterial({
                    color: 0x81cfe0,
                }));
                cube.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                // Set the cube position
                cube.position.y = UNIT_SIZE / 2;
                // Add the cube
                WORLD.scene.add(cube);

                // Used later for collision detection
                var bbox = new THREE.Box3().setFromObject(cube);
                WORLD.collidableObjects.push(bbox);

                // create a cannon body
                var shape = new CANNON.Box(new CANNON.Vec3(
                    (bbox.max.x - bbox.min.x) / 2,
                    (bbox.max.y - bbox.min.y) / 2,
                    (bbox.max.z - bbox.min.z) / 2
                ));
                var boxBody = new CANNON.Body({ mass: 5 });
                boxBody.addShape(shape);
                boxBody.position.copy(cube.position);
                boxBody.useQuaternion = true;
                boxBody.computeAABB();
                // disable collision response so objects don't move when they collide
                // against each other
                boxBody.collisionResponse = true;
                // keep a reference to the mesh so we can update its properties later
                boxBody.addEventListener('collide', function(object) {
                    if(object.body.id == 0) 
                        console.log("Player collided with walls.");
                });
                WORLD.world.addBody(boxBody);
            }
        }

    }
}