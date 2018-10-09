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

var createLoader = (function () {

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

var getMapFromFile = (file) => {
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

const loadMapFromJSON = (path, callback) => {

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

function createBoxBody(cube, callback) {

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
    boxBody.addEventListener('collide', callback);
    //WORLD.world.addBody(boxBody);

    return boxBody;
}