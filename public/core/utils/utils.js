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