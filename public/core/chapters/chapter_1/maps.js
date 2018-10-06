/** All maps of chapter 1 */

/** Level 1 */

//getMapFromFile()

var PAVEMENT_ID = 0;
var STREET_ID = 1;
var RESIDENTAL_BUILDING_ID = 2;
var OFFICE_BUILDING_ID = 3;
var GRASS_ID = 4;

WORLD.drawGround = function() {
    var floorTexture = WORLD.textureLoader.load('./images/grass.jpg');
    var roadTexture = WORLD.textureLoader.load('./images/road.jpg');
    var pavementTexture = WORLD.textureLoader.load('./images/sidewalk_1.jpg');
    var residentTexture = WORLD.textureLoader.load("/images/residential.jpg");
    var glassTexture = WORLD.textureLoader.load("/images/glass.jpg");
    var PAVEMENT_HEIGHT = 0.1;
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
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ];

    var mapWidth = roadMap.length;
    var mapHeight = roadMap[0].length;
    var roadTexture = WORLD.textureLoader.load('./images/road.jpg');
    var roadMaterial = new THREE.MeshBasicMaterial({ map: roadTexture });
    var UNIT_SIZE = 10;

    for(var i = 0 - (mapHeight / 2); i < mapHeight / 2; i++) {
        for(var j = 0 - (mapWidth / 2); j < mapWidth / 2; j++) {
            if(roadMap[i + mapHeight / 2][j + mapWidth / 2] === PAVEMENT_ID) {

                // Cubes are on behalf of pavement
                pavementMaterial.map.wrapS = pavementMaterial.map.wrapT = THREE.RepeatWrapping;
                pavementMaterial.map.repeat.set( 4, 4 );
                var cube = new THREE.Mesh(new THREE.BoxGeometry(UNIT_SIZE, PAVEMENT_HEIGHT, UNIT_SIZE), pavementMaterial);
                cube.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                // Set the cube position
                cube.position.y = PAVEMENT_HEIGHT / 2;
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
            else if (roadMap[i + mapHeight / 2][j + mapWidth / 2] === STREET_ID) {
                var plane = new THREE.Mesh( new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), roadMaterial );

                plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                WORLD.scene.add( plane );
            }
            else if (roadMap[i + mapHeight / 2][j + mapWidth / 2] === GRASS_ID) {

                var plane = new THREE.Mesh( new THREE.PlaneGeometry(UNIT_SIZE, UNIT_SIZE), grassMaterial );

                plane.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
                WORLD.scene.add( plane );

            }
            else {

                // Cubes are on behalf of building blocks
                var texture;
                if (roadMap[i + mapHeight / 2][j + mapWidth / 2] === RESIDENTAL_BUILDING_ID) {
                    /** residental buildings */
                    texture = residentTexture;
                } 
                else if (roadMap[i + mapHeight / 2][j + mapWidth / 2] === OFFICE_BUILDING_ID) {
                    /** office buildings */
                    texture = glassTexture;
                }
                 
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 1, 1 );
                var buildingMaterial = new THREE.MeshPhongMaterial({
                    map: texture
                });

                var cube = new THREE.Mesh(new THREE.BoxGeometry(UNIT_SIZE, UNIT_SIZE, UNIT_SIZE), buildingMaterial);
                cube.position.set(UNIT_SIZE * j, 0, UNIT_SIZE * i)
                // Set the cube position
                cube.position.y = UNIT_SIZE / 2 + PAVEMENT_HEIGHT;
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

WORLD.loadMap = () => {
    WORLD.drawGround();

    dangerZoneGeometry = new THREE.BoxGeometry(80, 40, 80);
    dangerZoneMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    dangerZoneMesh = new THREE.Mesh(
        dangerZoneGeometry,
        dangerZoneMaterial
    );
    dangerZoneMesh.position.set(-10, 20, 0);
    dangerZoneMesh.geometry.computeBoundingBox();
    dangerZoneBBox = new THREE.Box3(dangerZoneMesh.geometry.boundingBox.min.add(dangerZoneMesh.position), dangerZoneMesh.geometry.boundingBox.max.add(dangerZoneMesh.position));
    // WORLD.scene.add(dangerZoneMesh);

    // /* fbxLoader */
    // var manager = new THREE.LoadingManager();
    // manager.onProgress = function (item, loaded, total) {
    //     console.log(item, loaded, total);
    // };
    // var onProgress = function (xhr) {
    //     if (xhr.lengthComputable) {
    //         var percentComplete = xhr.loaded / xhr.total * 100;
    //         console.log(Math.round(percentComplete, 2) + '% downloaded');
    //     }
    // };
    // var onError = function (xhr) {
    //     console.log(xhr);
    // };

    var models = [
        // {
        //     name: "sign",
        //     loader_type: "object",
        //     object_type: "street_sign",
        //     url: "./models/json/test_sign.json",
        //     // position: new THREE.Vector3(-10, 10, -20),
        //     position: new THREE.Vector3(0, 10, 0),
        //     rotation: new THREE.Euler(0, Math.PI, Math.PI, "XYZ"),
        //     animate: false,
        //     angle: 90
        // },
        {
            name: "car",
            loader_type: "object",
            object_type: "vehicle",
            url: "./models/json/volkeswagon-vw-beetle.json",
            position: new THREE.Vector3(0, 1.5, 100),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.005, .005, 0.005),
            animate: true
        },
        {
            name: "bus_2", 
            loader_type: "gltf", 
            object_type: "vehicle",
            scale: new THREE.Vector3(.25,.25,.25),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            position: new THREE.Vector3(0, 0, 150),
            url: "./models/gltf/bus/scene.gltf",
            animate: false
        },
        {
            name: "traffic-light-1",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(6, 0, 6),
            rotation: new THREE.Euler(0, 0, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "traffic-light-2",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(-16, 0, -16),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "traffic-light-3",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(-16, 0, 6),
            rotation: new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "traffic-light-4",
            loader_type: "fbx",
            object_type: "traffic_light",
            url: "./models/fbx/traffic-light/traffic-light.fbx",
            position: new THREE.Vector3(6, 0, -16),
            rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            scale: new THREE.Vector3(.1,.1,.1)
        },
        {
            name: "bus_stop",
            loader_type: "fbx",
            url: "./models/fbx/bus_stop/bus_stop.FBX",
            position: new THREE.Vector3(-45, 0, -23),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(.05,.05,.05),
            children: {
                "sign": {
                    position: new THREE.Vector3(0, 60, 100),
                    rotation: new THREE.Euler( - Math.PI / 2, 0, Math.PI, "XYZ"),
                }
            }
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 20),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        // {
        //     name: "tree2",
        //     loader_type: "object",
        //     url: "./models/trees/tree2/tree2.json",
        //     position: new THREE.Vector3(-25, 0, 35),
        //     rotation: new THREE.Euler(0, 0, 0),
        //     textureUrl: './models/json/leaves1.png',
        //     scale: new THREE.Vector3(.2,.2,.2),
        // },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 35),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 50),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-45, -3, 65),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 65),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 50),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),            
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 20),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        {
            name: "tree1",
            loader_type: "object",
            url: "./models/trees/tree1/tree1.json",
            position: new THREE.Vector3(-60, -3, 35),
            rotation: new THREE.Euler(0, 0, 0),
            textureUrl: './models/json/leaves1.png',
            scale: new THREE.Vector3(.5,.5,.5),
        },
        {
            name: "bus", 
            loader_type: "gltf", 
            object_type: "vehicle",
            position: new THREE.Vector3(-10, 0, -80),
            scale: new THREE.Vector3(.015,.015,.015),
            url: "./models/gltf/fortnitecity_bus/scene.gltf",
            animate: false
        },
        {
            name: "car2",
            loader_type: "object",
            object_type: "vehicle",
            url: "./models/json/volkeswagon-vw-beetle.json",
            position: new THREE.Vector3(-10, 1.5, -130),
            rotation: new THREE.Euler(0, Math.PI, 0, "XYZ"),
            scale: new THREE.Vector3(.005, .005, 0.005),
            animate: true
        },
        {
            name: "bus_2", 
            loader_type: "gltf", 
            object_type: "vehicle",
            scale: new THREE.Vector3(.25,.25,.25),
            position: new THREE.Vector3(-35, 0, -2),
            url: "./models/gltf/bus/scene.gltf",
            animate: false
        },
        {
            name: "camquaydau", 
            loader_type: "object", 
            object_type: "sign",
            url: "./models/signs/traffic-sign.json",
            textureUrl: "./models/signs/camquaydau-uvmap.png",
            animate: false,
            children: {
                "sign": {
                    textureUrl: "./models/signs/camquaydau-uvmap.png"
                },
                "pole": {
                    textureUrl: "./models/signs/pole-uvmap.png"
                }
            }
        }
        // {
        //     name: "stripes-uv",
        //     loader_type: "object",
        //     object_type: "sign",
        //     url: "./models/stripes-uv.json",
        //     textureUrl: './models/stripes2.png',
        //     animate: false
        // },
        // {
        //     name: "land_ocean_ice_small",
        //     loader_type: "json",
        //     object_type: "sign",
        //     url: "./models/earth.json",
        //     textureUrl: './models/land_ocean_ice_small.png',
        //     animate: false
        // },
        // {
        //     name: "SignN281107",
        //     loader_type: "object",
        //     object_type: "sign",
        //     url: "./models/tds/SignN281107.json",
        //     textureUrl: './models/tds/perexod.jpg',
        //     scale: new THREE.Vector3(10, 10, 10),
        //     rotation: new THREE.Euler( - Math.PI / 2, 0, 0, "XYZ"),
        //     animate: false
        // }
    ];

    // add models to the world
    models.forEach(md => loadModelToWorld(md));
}