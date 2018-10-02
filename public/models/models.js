exports.MODELS = [
    {
        name: "sign",
        loader_type: "object",
        object_type: "street_sign",
        url: "./models/json/test_sign.json",
        // position: new THREE.Vector3(-10, 10, -20),
        position: new THREE.Vector3(0, 10, 0),
        rotation: new THREE.Euler(0, Math.PI, Math.PI, "XYZ"),
        animate: false,
        angle: 90
    },
    {
        name: "car",
        loader_type: "object",
        object_type: "vehicle",
        url: "./models/json/volkeswagon-vw-beetle.json",
        position: new THREE.Vector3(10, 1.5, 0),
        rotation: new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
        scale: new THREE.Vector3(.005, .005, 0.005),
        animate: true
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
    // {
    //     name: "stripes-uv",
    //     loader_type: "object",
    //     object_type: "sign",
    //     url: "./models/stripes-uv.json",
    //     textureUrl: './models/stripes2.png',
    //     animate: false
    // },
    {
        name: "land_ocean_ice_small",
        loader_type: "json",
        object_type: "sign",
        url: "./models/earth.json",
        textureUrl: './models/land_ocean_ice_small.png',
        animate: false
    }
];