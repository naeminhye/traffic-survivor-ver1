const loadModels = () => {

    var models = [
        // vehicles
        {
            "name": "simple-car",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 32 * 5, "y": 1.3, "z": 0 * 5},//new THREE.Vector3(32 * 5, 1.3, 0 * 5),
            "rotation": {"x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ"},//new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "path": {
                "arcLengthDivisions": 200,
                "closed": false,
                "curveType": "centripetal",
                "points": [
                    {"x":160,"y":1.3,"z":0},
                    {"x":160,"y":1.3,"z":330}
                ],
                "tension": 0.5,
                "type": "CatmullRomCurve3",
            },
            "velocity": 0.01
        },
        {
            "name": "simple-car",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 32 * 5, "y": 1.3, "z": 0 * 5},
            "rotation": {"x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ"},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "path": {
                "arcLengthDivisions": 200,
                "closed": false,
                "curveType": "centripetal",
                "points": [
                    {"x":160,"y":1.3,"z":20},
                    {"x":160,"y":1.3,"z":330}
                ],
                "tension": 0.5,
                "type": "CatmullRomCurve3",
            },
            "velocity": 0.03
        },
        {
            "name": "simple-car2",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 60 * 5, "y": 1.3, "z": 8 * 5},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": {
                "arcLengthDivisions": 200,
                "closed": false,
                "curveType": "centripetal",
                "points": [{"x":300,"y":1.3,"z":40},{"x":240,"y":1.3,"z":40},{"x":235,"y":1.3,"z":40},{"x":235,"y":1.3,"z":45},{"x":235,"y":1.3,"z":225},{"x":235,"y":1.3,"z":230},{"x":240,"y":1.3,"z":230},{"x":275,"y":1.3,"z":230}],
                "tension": 0.5,
                "type": "CatmullRomCurve3",
            },
            "velocity": 0.01
        },
        {
            "name": "simple-car2",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 60 * 5, "y": 1.3, "z": 8 * 5},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": {
                "arcLengthDivisions": 200,
                "closed": false,
                "curveType": "centripetal",
                "points": [{"x":300,"y":1.3,"z":40},{"x":240,"y":1.3,"z":40},{"x":235,"y":1.3,"z":40},{"x":235,"y":1.3,"z":45},{"x":235,"y":1.3,"z":225},{"x":235,"y":1.3,"z":230},{"x":240,"y":1.3,"z":230},{"x":275,"y":1.3,"z":230}],
                "tension": 0.5,
                "type": "CatmullRomCurve3",
            },
            "velocity": 0.02
        },
        {
            "name": "simple-car3",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 65 * 5, "y": 1.3, "z": 8 * 5},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(65 * 5, 1.3, 8 * 5),
                new THREE.Vector3(33 * 5, 1.3, 8 * 5),
                new THREE.Vector3(32 * 5, 1.3, 8 * 5),
                new THREE.Vector3(32 * 5, 1.3, 9 * 5),
                new THREE.Vector3(32 * 5, 1.3, 33 * 5),
                new THREE.Vector3(32 * 5, 1.3, 34 * 5),
                new THREE.Vector3(31 * 5, 1.3, 34 * 5),
                new THREE.Vector3(19 * 5, 1.3, 34 * 5),
                new THREE.Vector3(18 * 5, 1.3, 34 * 5),
                new THREE.Vector3(18 * 5, 1.3, 35 * 5),
                new THREE.Vector3(18 * 5, 1.3, 62 * 5),
            ]),
            "velocity": 0.02
        },
        {
            "name": "simple-car4",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 1 * 5, "y": 1.3, "z": 35 * 5},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(1 * 5, 1.3, 35 * 5),
                new THREE.Vector3(18 * 5, 1.3, 35 * 5),
                new THREE.Vector3(19 * 5, 1.3, 35 * 5),
                new THREE.Vector3(19 * 5, 1.3, 34 * 5),
                new THREE.Vector3(19 * 5, 1.3, 10 * 5),
                new THREE.Vector3(19 * 5, 1.3, 9 * 5),
                new THREE.Vector3(20 * 5, 1.3, 9 * 5),
                new THREE.Vector3(45 * 5, 1.3, 9 * 5),
                new THREE.Vector3(46 * 5, 1.3, 9 * 5),
                new THREE.Vector3(46 * 5, 1.3, 10 * 5),
                new THREE.Vector3(46 * 5, 1.3, 45 * 5),
            ]),
            "velocity": 0.03
        },
        {
            "name": "simple-car5",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 5, "y": 1.3, "z": 35 * 5},
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(1 * 5, 1.3, 35 * 5),
                new THREE.Vector3(18 * 5, 1.3, 35 * 5),
                new THREE.Vector3(19 * 5, 1.3, 35 * 5),
                new THREE.Vector3(19 * 5, 1.3, 34 * 5),
                new THREE.Vector3(19 * 5, 1.3, 10 * 5),
                new THREE.Vector3(19 * 5, 1.3, 9 * 5),
                new THREE.Vector3(20 * 5, 1.3, 9 * 5),
                new THREE.Vector3(45 * 5, 1.3, 9 * 5),
                new THREE.Vector3(46 * 5, 1.3, 9 * 5),
                new THREE.Vector3(46 * 5, 1.3, 10 * 5),
                new THREE.Vector3(46 * 5, 1.3, 45 * 5),
            ]),
            "velocity": 0.03
        },
        {
            "name": "simple-car6",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 0 * 5, "y": 1.3, "z": 9 * 5},//new THREE.Vector3(0 * 5, 1.3, 9 * 5),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(0 * 5, 1.3, 9 * 5),
                new THREE.Vector3(30 * 5, 1.3, 9 * 5),
                new THREE.Vector3(32 * 5, 1.3, 9 * 5),
                new THREE.Vector3(32 * 5, 1.3, 1 * 5),
                new THREE.Vector3(32 * 5, 1.3, 64 * 5)
            ]),
            "velocity": 0.02
        },
        {
            "name": "simple-car7",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 7 * 5, "y": 1.3, "z": 9 * 5},//new THREE.Vector3(7 * 5, 1.3, 9 * 5),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(7 * 5, 1.3, 9 * 5),
                new THREE.Vector3(30 * 5, 1.3, 9 * 5),
                new THREE.Vector3(32 * 5, 1.3, 9 * 5),
                new THREE.Vector3(32 * 5, 1.3, 1 * 5),
                new THREE.Vector3(32 * 5, 1.3, 64 * 5)
            ]),
            "velocity": 0.02
        },
        {
            "name": "simple-car8",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 0 * 5, "y": 1.3, "z": 35 * 5},//new THREE.Vector3(0 * 5, 1.3, 35 * 5),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(0 * 5, 1.3, 35 * 5),
                new THREE.Vector3(65 * 5, 1.3, 35 * 5)
            ]),
            "velocity": 0.01
        },
        {
            "name": "simple-car-13-35",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 13 * 5, "y": 1.3, "z": 35 * 5},//new THREE.Vector3(13 * 5, 1.3, 35 * 5),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(13 * 5, 1.3, 35 * 5),
                new THREE.Vector3(65 * 5, 1.3, 35 * 5)
            ]),
            "velocity": 0.02
        },
        {
            "name": "simple-car9",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 33 * 5, "y": 1.3, "z": 64 * 5},//new THREE.Vector3(33 * 5, 1.3, 64 * 5),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(33 * 5, 1.3, 64 * 5),
                new THREE.Vector3(33 * 5, 1.3, 36 * 5),
                new THREE.Vector3(33 * 5, 1.3, 34 * 5),
                new THREE.Vector3(31 * 5, 1.3, 34 * 5),
                new THREE.Vector3(6 * 5, 1.3, 34 * 5),
                new THREE.Vector3(4 * 5, 1.3, 34 * 5),
                new THREE.Vector3(4 * 5, 1.3, 36 * 5),
                new THREE.Vector3(4 * 5, 1.3, 35 * 5),
                new THREE.Vector3(4 * 5, 1.3, 51 * 5),
                new THREE.Vector3(6 * 5, 1.3, 53 * 5),
                new THREE.Vector3(16 * 5, 1.3, 53 * 5),
                new THREE.Vector3(18 * 5, 1.3, 53 * 5),
                new THREE.Vector3(18 * 5, 1.3, 55 * 5),
                new THREE.Vector3(18 * 5, 1.3, 60 * 5),
            ]),
            "velocity": 0.01
        },
        {
            "name": "simple-car10",
            "loader_type": "fbx",
            "object_type": "vehicle",
            "position": {"x": 65 * 5, "y": 1.3, "z": 34 * 5},//new THREE.Vector3(65 * 5, 1.3, 34 * 5),
            "url": "./models/fbx/simple-car/simple-car.fbx",
            "textureUrl": "./models/fbx/simple-car/simplecar-uvmap.png",
            "castShadow": true,
            "receiveShadow": true,
            "path": new THREE.CatmullRomCurve3([
                new THREE.Vector3(65 * 5, 1.3, 34 * 5),
                new THREE.Vector3(48 * 5, 1.3, 34 * 5),
                new THREE.Vector3(46 * 5, 1.3, 34 * 5),
                new THREE.Vector3(46 * 5, 1.3, 36 * 5),
                new THREE.Vector3(46 * 5, 1.3, 44 * 5),
                new THREE.Vector3(46 * 5, 1.3, 46 * 5),
                new THREE.Vector3(44 * 5, 1.3, 46 * 5),
                new THREE.Vector3(34 * 5, 1.3, 46 * 5),
                new THREE.Vector3(32 * 5, 1.3, 46 * 5),
                new THREE.Vector3(32 * 5, 1.3, 48 * 5),
                new THREE.Vector3(32 * 5, 1.3, 64 * 5),
            ]),
            "velocity": 0.01
        },

        // traffic lights
        {
            "name": "traffic-light-31-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 7 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 7 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
            "direction": { "x": 1, "y": 0, "z": 1 },
        },
        {
            "name": "traffic-light-31-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 10 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 10 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        // traffic lights
        {
            "name": "traffic-light-31-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 7 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-7",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 7 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
            "direction": { "x": 1, "y": 0, "z": 1 },
        },
        {
            "name": "traffic-light-31-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 10 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-10",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 10 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-31-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 15 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 15 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 18 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 18 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-31-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 155, "y": 0, "z": 75},
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 170, "y": 0, "z": 75},
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 18 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 18 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-31-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 15 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-15",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 15 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 18 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-18",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 18 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-17-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(17 * 5, 0, 33 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(20 * 5, 0, 33 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(20 * 5, 0, 36 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-17-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(17 * 5, 0, 36 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-31-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 33 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 33 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-34-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": new THREE.Vector3(34 * 5, 0, 36 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-31-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": new THREE.Vector3(31 * 5, 0, 36 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-45-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 45 * 5, "y": 0, "z": 33 * 5},//new THREE.Vector3(45 * 5, 0, 33 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-48-33",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 48 * 5, "y": 0, "z": 33 * 5},//new THREE.Vector3(48 * 5, 0, 33 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-48-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 48 * 5, "y": 0, "z": 36 * 5},//new THREE.Vector3(48 * 5, 0, 36 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-45-36",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 45 * 5, "y": 0, "z": 36 * 5},//new THREE.Vector3(45 * 5, 0, 36 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        //
        {
            "name": "traffic-light-17-51",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 17 * 5, "y": 0, "z": 51 * 5},//new THREE.Vector3(17 * 5, 0, 51 * 5),
            "rotation": {"order": "XYZ", "x": 0, "y": 0, "z": 0},//new THREE.Euler(0, 0, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-51",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 20 * 5, "y": 0, "z": 51 * 5},//new THREE.Vector3(20 * 5, 0, 51 * 5),
            "rotation": new THREE.Euler(0, - Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-20-54",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/redlight-uvmap.png",
            "position": {"x": 20 * 5, "y": 0, "z": 54 * 5},//new THREE.Vector3(20 * 5, 0, 54 * 5),
            "rotation": new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },
        {
            "name": "traffic-light-17-54",
            "loader_type": "fbx",
            "object_type": "traffic_light",
            "url": "./models/fbx/traffic-light-2/trafficlight.fbx",
            "textureUrl": "./models/fbx/traffic-light-2/greenlight-uvmap.png",
            "position": {"x": 17 * 5, "y": 0, "z": 54 * 5},//new THREE.Vector3(17 * 5, 0, 54 * 5),
            "rotation": new THREE.Euler(0, Math.PI, 0, "XYZ"),
            "scale": {"x": 0.4, "y": 0.4, "z": 0.4},//new THREE.Vector3(.4, .4, .4),
            "castShadow": true,
            "receiveShadow": true,
        },

        // signs
        {
            "name": "hieulenhphai-20-11",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhphai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 100, "y": 0, "z": 55},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ"},
            "direction": { "x": 0, "y": 0, "z": -1 },
            "info": "Turn Right"
        },
        {
            "name": "vongxuyen-28-10",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 140, "y": 0, "z": 50},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 0, "z": 0, "order": "XYZ"},
            "direction": { "x": 1, "y": 0, "z": 0 },
            "info": "You are going to meet a roundabout"
        },     
        {
            "name": "hieulenhthangphai-44-10",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhthangphai-uvmap.png",
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 220, "y": 0, "z": 50},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 0, "z": 0, "order": "XYZ"},
            "direction": { "x": 1, "y": 0, "z": 0 }
        },       
        {
            "name": "vongxuyen-55-13",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 275, "y": 0, "z": 65},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ"},
            "direction": { "x": 0, "y": 0, "z": 1 },
            "info": "You are going to meet a roundabout"
        },
        {
            "name": "vongxuyen-31-5",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 155, "y": 0, "z": 25},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ"},
            "direction": { "x": 0, "y": 0, "z": 1 },
            "info": "You are going to meet a roundabout"
        },
        {
            "name": "vongxuyen-36-7",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 180, "y": 0, "z": 35},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ"},
            "direction": { "x": -1, "y": 0, "z": 0 },
            "info": "You are going to meet a roundabout"
        },
        {
            "name": "vongxuyen-34-12",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 170, "y": 0, "z": 60},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ"},
            "direction": { "x": 0, "y": 0, "z": -1 },
            "info": "You are going to meet a roundabout"
        },
        {
            "name": "vongxuyen-58-20",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 290, "y": 0, "z": 100},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ"},
            "direction": { "x": 0, "y": 0, "z": -1 },
            "info": "You are going to meet a roundabout"
        },
        {
            "name": "vongxuyen-53-18",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 265, "y": 0, "z": 90},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 0, "z": 0, "order": "XYZ"},
            "direction": { "x": 1, "y": 0, "z": 0 },
            "info": "You are going to meet a roundabout"
        },
        {
            "name": "vongxuyen-60-15",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/vongxuyen-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 300, "y": 0, "z": 75},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ"},
            "direction": { "x": -1, "y": 0, "z": 0 },
            "info": "You are going to meet a roundabout"
        },
        {
            "name": "huongphaiditheo-301b-20-7",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhthang-uvmap.png",
                    "rotation": {"x": 0, "y": 0, "z": 3.141592653589793, "order": "XYZ"}
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 100, "y": 0, "z": 35},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 0, "z": 0, "order": "XYZ"},
            "direction": { "x": 0, "y": 0, "z": -1 }
        },{
            "name": "hieulenhthangphai-301f-55-32",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhthangphai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 275, "y": 0, "z": 160},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": -1.5707963267948966, "z": 0, "order": "XYZ"},
            "direction": { "x": 0, "y": 0, "z": 1 }
        },
        {
            "name": "hieulenhthangtrai-301h-49-33",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhthangtrai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 245, "y": 0, "z": 165},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ"},
            "direction": { "x": -1, "y": 0, "z": 0 }
        },
        {
            "name": "hieulenhhaiben-301i-31-33",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhhaiben-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 155, "y": 0, "z": 165},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ"},
            "direction": { "x": -1, "y": 0, "z": 0 }
        },
        {
            "name": "hieulenhtrai-301e-31-44",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhtrai-uvmap.png"
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 155, "y": 0, "z": 220},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 3.141592653589793, "z": 0, "order": "XYZ"},
            "direction": { "x": -1, "y": 0, "z": 0 }
        },
        {
            "name": "huongphaiditheo-301c-31-48",
            "loader_type": "object",
            "object_type": "guide_signs",
            "url": "./models/signs/round-info-sign.json",
            "animate": false,
            "castShadow": true,
            "receiveShadow": true,
            "children": {
                "sign": {
                    "textureUrl": "./models/signs/hieulenhthang-uvmap.png",
                    "rotation": {"x": 0, "y": 0, "z": 0, "order": "XYZ"}
                },
                "pole": {
                    "textureUrl": "./models/signs/pole-uvmap.png"
                }
            },
            "position": {"x": 155, "y": 0, "z": 240},
            "scale": {"x": 0.3, "y": 0.3, "z": 0.3},
            "rotation": {"x": 0, "y": 1.5707963267948966, "z": 0, "order": "XYZ"},
            "direction": { "x": -1, "y": 0, "z": 0 }
        },
    ];

    // add models to the world
    models.forEach(md => loadModelToWorld(md));
}

WORLD.loadMap = () => {
    environmentInit("./core/chapters/chapter_3/chapter_3.json");
    loadModels();
    
}