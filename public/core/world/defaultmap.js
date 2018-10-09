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
    // dangerZoneBBox = new THREE.Box3(dangerZoneMesh.geometry.boundingBox.min.add(dangerZoneMesh.position), dangerZoneMesh.geometry.boundingBox.max.add(dangerZoneMesh.position));
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