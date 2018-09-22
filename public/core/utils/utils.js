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
function cloneObject(obj) {
    var copy;

    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (obj instanceof Date) {
        copy = new Date();

        copy.setTime(obj.getTime());

        return copy;
    }

    if (obj instanceof Array) {
        copy = [];

        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = cloneObject(obj[i]);
        }

        return copy;
    }

    if (obj instanceof Object) {
        copy = {};

        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = cloneObject(obj[attr]);
            }
        }

        return copy;
    }
}