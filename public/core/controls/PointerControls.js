/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
 
/** GLOBAL keysS */
const keys = {
    KEY_SHIFT: 16,
    KEY_SPACE: 32,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_A: 65,
    KEY_D: 68,
    KEY_S: 83,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Z: 90,
};

var PointerControls = function (camera, cannonBody) {

    var eyeYPos = 2; // eyes are 2 meters above the ground
    const INITIAL_SPEED = 0.1;
    var velocityFactor = INITIAL_SPEED;
    var jumpVelocity = 20;
    var scope = this;

    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 1;
    yawObject.add(pitchObject);

    var quat = new THREE.Quaternion();

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var rotateLeft = false;
    var rotateRight = false;
    var speedup = false;

    var canJump = false;

    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0, 1, 0);
    cannonBody.addEventListener("collide", function (e) {
        var contact = e.contact;

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if (contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
        {
            contact.ni.negate(contactNormal);
            // console.log("collided!!!");
        }
        else
            contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        // if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
        //     canJump = true;
    });

    var velocity = cannonBody.velocity;

    var PI_2 = Math.PI / 2;

    var onMouseMove = function (event) {

        if (scope.enabled === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        // var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.0002;
        // pitchObject.rotation.x -= movementY * 0.002;

        // pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, pitchObject.rotation.x));
    };

    /** Keyboard events */
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case keys.KEY_UP:
            case keys.KEY_W: 
                moveForward = true;
                break;
            case keys.KEY_LEFT:
            case keys.KEY_A:
                // moveLeft = true; 
                rotateLeft = true;
                break;
            case keys.KEY_DOWN: // down
            case keys.KEY_S: // s
                moveBackward = true;
                break;
            case keys.KEY_RIGHT: // right
            case keys.KEY_D: // d
                // moveRight = true;
                rotateRight = true;
                break;
            /** keep moving forward without holding key W or arrow up */
            case keys.KEY_Z:
                moveForward = true;
                break;
            /** stop */
            case keys.KEY_X:
            // TODO: inertia
                if ( moveForward === true )
                    moveForward = false;
                break;
            case keys.KEY_SPACE: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;
            /** accelerate */
            case keys.KEY_SHIFT:
                if(!speedup) {
                    speedup = true;
                }
                break;
        }
    };
    var onKeyUp = function ( event ) {
        switch( event.keyCode ) {
            case keys.KEY_UP: // up
            case keys.KEY_W: // w
                moveForward = false;
                break;
            case keys.KEY_LEFT: // left
            case keys.KEY_A: // a
                // moveLeft = false;
                rotateLeft = false;
                break;
            case keys.KEY_DOWN: // down
            case keys.KEY_S: // s
                moveBackward = false;
                break;
            case keys.KEY_RIGHT: // right
            case keys.KEY_D: // d
                // moveRight = false;
                rotateRight = false;
                break;
            case keys.KEY_SHIFT:
                speedup = false;
                velocityFactor = INITIAL_SPEED;
                break;
        }
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    this.enabled = false;

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function (targetVec) {
        targetVec.set(0, 0, -1);
        quat.multiplyVector3(targetVec);
    }

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();
    this.update = function (delta) {

        if (scope.enabled === false) return;

        delta *= 0.1;
        var rotateAngle = Math.PI / 2 * 0.005;

        inputVelocity.set(0, 0, 0);
        if(speedup) {
            velocityFactor += 0.1;
        }

        if(WORLD.detectCollision() !== 0){
            // TODO: Handle collision event
            console.log("collision")
        }

        if (moveForward) {
            inputVelocity.z = -velocityFactor * delta;
        }
        if (moveBackward) {
            inputVelocity.z = velocityFactor * delta;
        }

        if (moveLeft) {
            inputVelocity.x = -velocityFactor * delta;
        }
        if (moveRight) {
            inputVelocity.x = velocityFactor * delta;
        }

        // Convert velocity to world coordinates
        euler.x = pitchObject.rotation.x;
        euler.y = yawObject.rotation.y;
        euler.order = "XYZ";
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        //quat.multiplyVector3(inputVelocity);
        // Add to the object
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;
        
        yawObject.position.copy(cannonBody.position);

        /** Rotation */
        if(rotateLeft) {
            yawObject.rotation.y += rotateAngle;
        }
        else if(rotateRight) {
            yawObject.rotation.y -= rotateAngle;
        }
    };
};

