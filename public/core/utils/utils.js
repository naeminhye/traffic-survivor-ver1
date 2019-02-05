// Convert from polar coordinates to Cartesian coordinates using length and radian
function polarToCartesian(vectorLength, vectorDirection) {
    return {
        x: vectorLength * Math.cos(vectorDirection),
        y: vectorLength * Math.sin(vectorDirection)
    };
}

// Convert radians to degrees (1 radian = 57.3 degrees => PI * radian = 180 degrees)
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

// Convert degrees to radians
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

// Generate a random number between a fixedrange
function random(min, max, round) {
    return round ? (Math.floor(Math.random() * (max + 1)) + min) : (Math.random() * max) + min;
}

// Clone an object recursively
// function cloneObject(obj) {
//     var copy;

//     if (obj === null || typeof obj !== "object") {
//         return obj;
//     }

//     if (obj instanceof Date) {
//         copy = new Date();

//         copy.setTime(obj.getTime());

//         return copy;
//     }

//     if (obj instanceof Array) {
//         copy = [];

//         for (var i = 0, len = obj.length; i < len; i++) {
//             copy[i] = cloneObject(obj[i]);
//         }

//         return copy;
//     }

//     if (obj instanceof Object) {
//         copy = {};

//         for (var attr in obj) {
//             if (obj.hasOwnProperty(attr)) {
//                 copy[attr] = cloneObject(obj[attr]);
//             }
//         }

//         return copy;
//     }
// }

function compass(vector) {
    const _north = new THREE.Vector3(0, 0, -1); // North
    const _east = new THREE.Vector3(1, 0, 0); // East
    const _west = new THREE.Vector3(-1, 0, 0); // West
    const _south = new THREE.Vector3(0, 0, 1); // South

    return "Lech voi huong Bac " + THREE.Math.radToDeg(_north.angleTo( vector )) + " do.";
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

const makeTextSprite = ( message, parameters ) => {
	if ( parameters === undefined ) parameters = {};
	var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
	var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
	var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
	var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

	context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
	context.fillText( message, borderThickness, fontsize + borderThickness);

	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
	return sprite;  
}

const objectToBody = (object) => {
	var helper = new THREE.BoxHelper(object, 0xff0000);
	helper.update();

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
	return boxBody;
}

const createLoader = (function () {

    var container = null;
    var progress = null;
    var finished = false;

    var canvas = null;
    var callback = null;

    function setupLoaderElement() {
        container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.transition = 'opacity 1s';

        var text = document.createElement('p');
        text.style.margin = '0 0 10px';
        text.style.paddingLeft = '5px';
        text.style.textAlign = 'center';
        text.style.color = '#fff';
        text.style.fontFamily = 'monospace';
        text.style.fontSize = '16px';
        text.style.letterSpacing = '10px';
        text.textContent = 'LOADING';

        var progressCtn = document.createElement('div');
        progressCtn.style.background = '#555';
        progressCtn.style.width = '250px';
        progressCtn.style.height = '1px';

        progress = document.createElement('div');
        progress.style.background = '#fff';
        progress.style.width = '0%';
        progress.style.height = 'inherit';
        progress.style.margin = '0 auto';
        progress.style.transition = 'width 0.15s';

        progressCtn.appendChild(progress);
        container.appendChild(text);
        container.appendChild(progressCtn);

        document.body.appendChild(container);
    }

    function setupCanvas() {
        canvas.style.transition = 'opacity 1s';
        canvas.style.opacity = '0';
    }

    function updateProgress(rate) {
        progress.style.width = Math.round(rate * 100.0) + '%';
    }

    function hideLoader() {
        container.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(container);
        }, 1000);
    }

    function showCanvas() {
        document.body.appendChild(canvas);
        if (typeof callback === 'function') {
            callback();
        }
        setTimeout(function () {
            canvas.style.opacity = '1';
        }, 0);
    }

    return function (_canvas, _callback) {
        var manager = new THREE.LoadingManager();

        canvas = _canvas;
        callback = _callback;

        setupLoaderElement();
        setupCanvas();

        manager.onProgress = function (item, loaded, total) {
            updateProgress(loaded / total);
            if (loaded === total && !finished) {
                finished = true;
                hideLoader();
                setTimeout(function () {
                    showCanvas();
                }, 1000);
            }
        };

        return manager;
    }

})();

const readMapFromFile = (file) => {
    var map = [];

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                // console.log(allText);
                // By lines
                var lines = allText.split('\n');
                
                for(var line = 0; line < lines.length; line++){
                    map[line] = lines[line].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                }
            }
        }
    }
    rawFile.send(null);

    return map;
}

const readMapInfoFromJson = (path, callback) => {

    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', path, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == "200") {
            callback(xhr.responseText);
        } 
    }
    xhr.send();
}

const createBoxBody = (object, callback) => {
    // WORLD.scene.add(object);
    // Used later for collision detection
    var helper = new THREE.BoxHelper(object, 0xff0000);
    helper.update();

    // If you want a visible bounding box
    WORLD.scene.add(helper);

    var bbox = new THREE.Box3().setFromObject(object);
    // WORLD.collidableObjects.push(bbox);

    // create a cannon body
    var shape = new CANNON.Box(new CANNON.Vec3(
        (bbox.max.x - bbox.min.x) / 2,
        (bbox.max.y - bbox.min.y) / 2,
        (bbox.max.z - bbox.min.z) / 2
    ));
    var boxBody = new CANNON.Body({ mass: 5 });
    boxBody.addShape(shape);
    boxBody.position.copy(object.position);
    boxBody.useQuaternion = true;
    boxBody.computeAABB();
    // disable collision response so objects don't move when they collide
    // against each other
    boxBody.collisionResponse = true;
    boxBody.addEventListener('collide', callback);

    // boxBody.angularVelocity.set(0, 0, 3.5);
    // boxBody.angularDamping = 0.1;

    return boxBody;
}

const minifyAngle = (num) => {
    var angle = num;
    if(Math.abs(angle / 180) > 1) {
        angle = angle % 180 - 180;
    }
    return angle;
}

const calculateAngle = (vectorA, vectorB) => {
    var angleA  = THREE.Math.radToDeg(Math.atan2(vectorA.x, vectorA.z));
    var angleB  = THREE.Math.radToDeg(Math.atan2(vectorB.x, vectorB.z));
    return angleB - angleA;
}

const calculateAngleToPlayer = (vector) => {
    var v = new THREE.Vector3();
    var playerVector = WORLD.player.getWorldDirection(v);
    return calculateAngle(playerVector, vector);
}

function allEqual(arr, target) {
    return arr.every(function (v) {
        return v === target;
    });
}

function allEqual2D(arr, target) {
    for (var i = 0; i < arr.length; i++) {
        var check = allEqual(arr[i], target);
        if (!check)
            return false;
    }
    return true;
}

var map = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 2, 2]
];

/**
 * @param {*} mat Ma trận của map 
 * @param {*} target ID của object 
 */
const findSquareSubMap = (mat, target) => {
	var results = [];
    var n = mat.length;
  
    var flagMat = [];
    for(var temp = 0; temp < mat.length; temp++){
      flagMat[temp] = new Array(mat.length); 
      flagMat[temp].fill(0);
    }
    k = n;

    while (k <= n && k > 0) {
        // row number of first cell in current sub-square of size k x k 
        for (var i = 0; i < n - k + 1; i++) {
            // column of first cell in current sub-square of size k x k 
            for (var j = 0; j < n - k + 1; j++) {
                if (flagMat[i][j] != 1) {
                    // Current sub-square 
                    var submat = [];
                    var existed = false;

                    for (var p = i; p < k + i; p++) {
                        submat[p - i] = [];
                        for (var q = j; q < k + j; q++) {
                            submat[p - i][q - j] = mat[p][q];
                            if(flagMat[p][q] === 1) {
                                existed = true;
                            }
                        }
                    }
                    if (allEqual2D(submat, target) && existed === false) {
                        var info = {
                            z: i,
                            x: j,
                            size: k
                        }
                        
                        results.push(info)

                        for (var p2 = i; p2 < k + i; p2++) {
                            for (var q2 = j; q2 < k + j; q2++) {
                                flagMat[p2][q2] = 1;
                            }
                        }
                    }
                }

            }
        }
        k--;
    }
  return results;
}

/**
 * @param {*} mat Ma trận của map 
 * @param {*} target ID của object 
 * @param {*} size kích thước khối vuông
 */
const findSquareSubMapWithSize = (mat, target, size) => {

	var results = [];
    var n = mat.length;
  
    var flagMat = [];
    for(var temp = 0; temp < mat.length; temp++){
      flagMat[temp] = new Array(mat.length); 
      flagMat[temp].fill(0);
    }
    k = size;

    // row number of first cell in current sub-square of size k x k 
    for (var i = 0; i < n - k + 1; i++) {
        // column of first cell in current sub-square of size k x k 
        for (var j = 0; j < n - k + 1; j++) {
            if (flagMat[i][j] != 1) {
                // Current sub-square 
                var submat = [];
                var existed = false;

                for (var p = i; p < k + i; p++) {
                    submat[p - i] = [];
                    for (var q = j; q < k + j; q++) {
                        submat[p - i][q - j] = mat[p][q];
                        if(flagMat[p][q] === 1) {
                            existed = true;
                        }
                    }
                }
                if (allEqual2D(submat, target) && existed === false) {
                    var info = {
                        z: i,
                        x: j,
                        size: k
                    }
                    
                    results.push(info)

                    for (var p2 = i; p2 < k + i; p2++) {
                        for (var q2 = j; q2 < k + j; q2++) {
                            flagMat[p2][q2] = 1;
                        }
                    }
                }
            }

        }
    }
    return results;
}

const findDoubledRoadByDirection = (id, direction, sourceArray) => {
    var result = [];
    
    if (direction === "VERTICAL") {
    
      let flagMat = [];
      for(let temp = 0; temp < sourceArray.length; temp++){
        flagMat[temp] = new Array(sourceArray.length); 
        flagMat[temp].fill(0);
      }
      
      for(let j = 0; j < sourceArray.length; j++) {
        for(let i = 0; i < sourceArray[j].length - 1; i++) {
          
          if(sourceArray[j][i] === id && flagMat[j][i] === 0 && sourceArray[j][i + 1] === id && flagMat[j][i + 1] === 0) {
            flagMat[j][i] = 1;
            flagMat[j][i + 1] = 1;
            
            let count = 1;
            for (let k = j + 1; k < sourceArray.length; k++) {
              if (sourceArray[k][i] === id && sourceArray[k][i + 1] === id) {
                count++;
                flagMat[k][i] = 1;
                flagMat[k][i + 1] = 1;
              }
              else {
                break;
              }
            }
            
            result.push({
              x: i,
              z: j,
              x_width: 2,
              z_width: count
            });
          }
          
        }
      }
      
    }
    else { 
        // direction === "HORIZONTAL"
    
      let flagMat = [];
      for(let temp = 0; temp < sourceArray.length; temp++){
        flagMat[temp] = new Array(sourceArray.length); 
        flagMat[temp].fill(0);
      }
      
      for(let j = 0; j < sourceArray.length - 1; j++) {
        for(let i = 0; i < sourceArray[j].length; i++) {
          if(sourceArray[i][j] === id && flagMat[i][j] === 0 && sourceArray[i + 1][j] === id && flagMat[i + 1][j] === 0) {
  
            flagMat[i][j] = 1;
            flagMat[i + 1][j] = 1;
            
            let count = 1;
            for (let k = j + 1; k < sourceArray.length; k++) {
              if (sourceArray[i][k] === id && sourceArray[i + 1][k] === id) {
                count++;
                flagMat[i][k] = 1;
                flagMat[i + 1][k] = 1;
              }
              else {
                break;
              }
            }
            
            
            result.push({
              x: j,
              z: i,
              x_width: count,
              z_width: 2
            });
          }
        }
      }
      
    }
    
    return result;
}

function startSignal(counter, dir){
    var $light;
    if (dir === 0) { //left
        $light = $("#left-led");
    }
    else {
        $light = $("#right-led");

    }
    if(counter < 2){
      setTimeout(function(){
        counter++;
        if(!$light.hasClass("active")) {
          $light.addClass("active");
        }
        else {
          $light.removeClass("active");
        }
        startSignal(counter, dir);
      }, 750);
    }
  }

function loadCubemap(path, format) {
    var urls = [
      path + 'px' + '.' + format, path + 'nx' + '.' + format,
      path + 'py' + '.' + format, path + 'ny' + '.' + format,
      path + 'pz' + '.' + format, path + 'nz' + '.' + format
    ];
    var loader = new THREE.CubeTextureLoader();
    loader.setCrossOrigin('');
    var cubeMap = loader.load(urls);
    cubeMap.format = THREE.RGBFormat;
    //WORLD.textureCube = THREE.TextureLoader.load(urls, new THREE.CubeReflectionMapping());
    return cubeMap;
}

const jsonToThreeObject = (json) => {
    var temp = [];
    json.forEach((obj) => {
        temp.push(new THREE.Vector3(obj.x, obj.y, obj.z));        
    });
    return temp;
}

const createBBox = (pos, UNIT_SIZE) => {
    var area, areaBBox;
    area = new THREE.Mesh(
        new THREE.BoxGeometry(pos.x_width * UNIT_SIZE, 50, pos.z_width * UNIT_SIZE),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        })
    );
    var XWidth = ((2 * pos.x + pos.x_width - 1) * UNIT_SIZE ) / 2;
    var ZWidth = ((2 * pos.z + pos.z_width - 1) * UNIT_SIZE) / 2
    // area.rotation = new THREE.Euler(0, Math.Pi / 2, Math.PI /2, 'XYZ')
    area.position.set(XWidth, 0, ZWidth);
    area.geometry.computeBoundingBox();
    areaBBox = new THREE.Box3(area.geometry.boundingBox.min.add(area.position), area.geometry.boundingBox.max.add(area.position));
    return {
        area: area,
        areaBBox: areaBBox
    }
}

const createBSphere = (pos, UNIT_SIZE) => {
    center = new THREE.Vector3((pos.x + pos.x_width / 2) * UNIT_SIZE, 0, (pos.z + pos.z_width / 2) * UNIT_SIZE)
    radius = (pos.x_width / 4) * UNIT_SIZE;

    return new THREE.Sphere(center, radius);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

/* Get the documentElement (<html>) to display the page in fullscreen */
const elem = document.documentElement;

/* View in fullscreen */
const openFullscreen = () => {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
const closeFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

// Converts degrees to radians
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Converts radians to degrees
function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}

const pathGenerator = (_xzArray, _y, UNIT_SIZE) => {
    var path = [];
    _xzArray.forEach(function(sub) {
        var temp = sub.map(function(x) { return x * UNIT_SIZE; })
        path.push({"x":temp[0],"y":_y,"z":temp[1]});
    })
    return path;
}

const vehicleGenerator = (data) => {
    let {
        velocity,
        xzArray,
        y,
        unit_size,
        url,
        textureUrl,
        name,
        loader_type,
        object_type = "vehicles",
        animate = false,
        castShadow = true,
        receiveShadow = true
    } = data;

    let vehicleObject = {
        name: name + "-" + xzArray[0][0] + "-" + xzArray[0][1],
        loader_type,
        position: { "x": xzArray[0][0] * unit_size, "y": y, "z": xzArray[0][1] * unit_size },
        object_type: object_type,
        path: pathGenerator(xzArray, y, unit_size),
        velocity: velocity,
        url: url,
        animate: animate,
        castShadow: castShadow,
        receiveShadow: receiveShadow
    }
    if(textureUrl) {
        vehicleObject.textureUrl = textureUrl;
    }

    return vehicleObject;
}
