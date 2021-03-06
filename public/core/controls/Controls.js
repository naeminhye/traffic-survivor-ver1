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
    KEY_Q: 81,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72
};

var Controls = function (camera, cannonBody) {

    var eyeYPos = 2; // eyes are 2 meters above the ground
    const INITIAL_SPEED = 0.2;
    var velocityFactor = INITIAL_SPEED;
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
    var rotateLeftFast = false;
    var rotateRight = false;
    var rotateRightFast = false;
    var speedup = false;
    var leftSignal = false;
    var rightSignal = false;
    var lightOn = false;

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
        
        if( GAME.cameraMode !== 0 ) return;

        if (scope.enabled === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.0002;
        pitchObject.rotation.x = (pitchObject.rotation.x - movementY * 0.002 < 0.5 && pitchObject.rotation.x - movementY * 0.002 > -0.5) ? (pitchObject.rotation.x - movementY * 0.002) : pitchObject.rotation.x;

        pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, pitchObject.rotation.x));
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
                rotateRight = false;
                break;
            case keys.KEY_DOWN: // down
            case keys.KEY_S: // s
                moveBackward = true;
                break;
            case keys.KEY_RIGHT: // right
            case keys.KEY_D: // d
                // moveRight = true;
                rotateRight = true;
                rotateLeft = false;
                break;
            /** keep moving forward without holding key W or arrow up */
            case keys.KEY_Z:
                moveForward = true;
                break;
            /** stop */
            case keys.KEY_X:
                if ( moveForward === true )
                    moveForward = false;
                break;
            case keys.KEY_SPACE: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;
            case keys.KEY_Q:
                if ( leftSignal === true ) {
                    leftSignal = false;
                }
                else {
                    if(rightSignal) {
                        rightSignal = false;
                    }
                    leftSignal = true;
                }
                break;
            case keys.KEY_E:
                if ( rightSignal === true )
                    rightSignal = false;
                else {
                    if(leftSignal) {
                        leftSignal = false;
                    }
                    rightSignal = true;
                }
            break;
            case keys.KEY_G:
                // rotateLeftFast = true;
	            GAME.audio.sfx.horn.play();
                // GAME.hornSound.play();
                $("#horn-led").addClass("active");
                break;
            case keys.KEY_F:
                // rotateRightFast = true;
                lightOn = !lightOn;
                break;
            /** accelerate */
            case keys.KEY_SHIFT:
                if(!speedup) {
                    speedup = true;
                    velocityFactor += 0.1;
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
                // velocityFactor = INITIAL_SPEED;
                break;
            case keys.KEY_G:
                $("#horn-led").removeClass("active");
                break;
            case keys.KEY_F:
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
        var rotateAngle = Math.PI / 2 * 0.02;

        inputVelocity.set(0, 0, 0);

        if(leftSignal) {
            $("#left-led").addClass("active");
        }
        else {
            $("#left-led").removeClass("active");
        }
        if(rightSignal) {
            $("#right-led").addClass("active");
        }
        else {
            $("#right-led").removeClass("active");
        }

        /** Rotation */
        if(rotateLeft) {
            yawObject.rotation.y += rotateAngle;
            // WORLD.verticalMirror.rotation.y += rotateAngle;
            if(PLAYER.bike) {
                var v = new THREE.Vector3();
                var angleToPlayerDelta = calculateAngleToPlayer(PLAYER.bike.getWorldDirection(v));
                if(Math.abs(angleToPlayerDelta) > 160) {
                    PLAYER.bike.rotation.y += rotateAngle * 1.2;
                }
                // if (Math.abs(angleToPlayerDelta) < 170 && !leftSignal) {
                //     GAME.handleFining("Không bật si nhang!!", 100);
                // }
            }
        }
        else if(rotateRight) {
            yawObject.rotation.y -= rotateAngle;
            // WORLD.verticalMirror.rotation.y -= rotateAngle;
            if(PLAYER.bike) {
                var v = new THREE.Vector3();
                var angleToPlayerDelta = calculateAngleToPlayer(PLAYER.bike.getWorldDirection(v));
                if(Math.abs(angleToPlayerDelta) > 160) {
                    PLAYER.bike.rotation.y -= rotateAngle * 1.2;
                }
                // if (Math.abs(angleToPlayerDelta) < 170 && !rightSignal) {
                //     GAME.handleFining("Không bật si nhang!!", 100);
                // }
            }
        }
        else {
            if(PLAYER.bike) {
                PLAYER.bike.rotation.set(
                    WORLD.player.rotation.x,
                    WORLD.player.rotation.y - Math.PI,
                    WORLD.player.rotation.z
                );
            }

            if (moveForward) {
                inputVelocity.z = -velocityFactor * delta;
            }
            if (moveBackward) {
                inputVelocity.z = velocityFactor * delta;
                // PLAYER.status.moving = true;
            }

            if (moveLeft) {
                inputVelocity.x = -velocityFactor * delta;
                // PLAYER.status.moving = true;
            }
            if (moveRight) {
                inputVelocity.x = velocityFactor * delta;
                // PLAYER.status.moving = true;
            }
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
        
        var speed = Math.sqrt((velocity.x)*(velocity.x) + (velocity.z)*(velocity.z));
        PLAYER.status.speed = (3.6 * (speed / 60) * 0.5); // convert mps to kph
    
        yawObject.position.copy(cannonBody.position);
        if(WORLD.player) {
            PLAYER.position.set(WORLD.player.position.x, WORLD.player.position.y, WORLD.player.position.z);
        }
    
        if(PLAYER.bike) {
            // position the bike in front of the camera
            PLAYER.bike.position.set(
                WORLD.player.position.x - Math.sin(WORLD.player.rotation.y) * 0.45,
                0,
                WORLD.player.position.z - Math.cos(WORLD.player.rotation.y) * 0.45
            );
        }
        // if(WORLD.verticalMirror) {
        //     WORLD.verticalMirror.position.set(
        //         WORLD.player.position.x - Math.sin(WORLD.player.rotation.y) * 3,
        //         WORLD.player.position.y,// + Math.sin(delta*4 + WORLD.player.position.x + WORLD.player.position.z)*0.01,
        //         WORLD.player.position.z - Math.cos(WORLD.player.rotation.y) * 3
        //     );
        // }


        if(lightOn) {
            $("#headlight-led").addClass("active");
        }
        else {
            $("#headlight-led").removeClass("active");
        }
        // if(lightOn) {
        //     if(!PLAYER.headLight) {
        //         PLAYER.headLight = new THREE.SpotLight( 0xffffff , 4, 40);
        //         PLAYER.headLight.position.set(
        //             WORLD.player.position.x,
        //             WORLD.player.position.y,// + Math.sin(delta*4 + WORLD.player.position.x + WORLD.player.position.z)*0.01,
        //             WORLD.player.position.z
        //         );
        //         PLAYER.headLight.rotation.set(
        //             WORLD.player.rotation.x,
        //             WORLD.player.rotation.y,
        //             WORLD.player.rotation.z
        //         );
        //         WORLD.camera.add(PLAYER.headLight);
        //         PLAYER.headLight.target = WORLD.camera;
    
        //         PLAYER.headLight.castShadow = true;
    
        //         PLAYER.headLight.shadow.mapSize.width = 100;
        //         PLAYER.headLight.shadow.mapSize.height = 100;
    
        //         PLAYER.headLight.shadow.camera.near = 500;
        //         PLAYER.headLight.shadow.camera.far = 4000;
        //         PLAYER.headLight.shadow.camera.fov = 30;
        //         PLAYER.headLight.name = "headlight";
    
        //         WORLD.scene.add( PLAYER.headLight );
        //     }
        // }
        // else {
        //     var headlight = WORLD.scene.getObjectByName("headlight");
        //     if(headlight) {
        //         WORLD.scene.remove( headlight );
        //         PLAYER.headLight = null
        //     }
        // }
    };

    this.detectCollision = () => {
        var flag = 0;
        WORLD.collidableObjects.forEach((mesh) => {

            var helper = new THREE.BoxHelper(mesh, 0xff0000);
            helper.update();

            // If you want a visible bounding box
            // WORLD.scene.add(helper);
            var object = new THREE.Box3().setFromObject(helper);

            // if (object instanceof THREE.Sphere || object instanceof THREE.Box3) {
            if (PLAYER.bike) {

                if (object.containsPoint(PLAYER.bike.position)) {
                    console.log("Collided ---", object);
                    flag++;
                }
            }
            else {
                if (object.containsPoint(scope.getObject().position)) {
                    console.log("Collided ---", object);
                    flag++;
                }
            }
            // }
        });
        return flag;
    }
};