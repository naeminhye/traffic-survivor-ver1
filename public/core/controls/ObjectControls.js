var CONTROLS = CONTROLS || {};

CONTROLS.PathControls = function (object, body, path, prop) {
	this.path = path;
	this._object = object;
	this._objectBody = body;
	this._pos = 0;
	this.velocity = 1; //unidades por segundo
	if (prop && prop.velocity) {
		this.velocity = prop.velocity;
	}
	this._factor = this.velocity / this.path.getLength();
	// this._object.add( WORLD.bgSound )
	var contactNormal = new CANNON.Vec3(); 
	this._objectBody.addEventListener("collide", function (e) {

        var contact = e.contact;

        // // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // // We do not yet know which one is which! Let's check.
        if (contact.bi.id == sphereBody.id)  // bi is the player body, flip the contact normal
        {
        //     contact.ni.negate(contactNormal);
			toastr.options = {
				"closeButton": false,
				"newestOnTop": true,
				"positionClass": "toast-top-right",
				"preventDuplicates": true
			}
			toastr.error("Va cham với phương tiện giao thông khác!");
        }
        // else
        //     contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

    });
};

CONTROLS.PathControls.prototype.update = function (delta) {

	this._object.position.copy(this.path.getPointAt(this._pos));
	this._objectBody.position.copy(this.path.getPointAt(this._pos));

	var canGo = (WORLD.trafficLightList.findIndex((light) => {
		var v = new THREE.Vector3();
        var angleDelta = calculateAngle(this._object.getWorldDirection(v), new THREE.Vector3(light.direction.x,
            light.direction.y,
			light.direction.z));
		var angleToPlayerDelta = calculateAngleToPlayer(this._object.getWorldDirection(v));

        return (
		((light.object.position.distanceTo(this._object.position) < 10)
        && (Math.abs(minifyAngle(angleDelta)) <= 1)
		&& light.currentStatus === "REDLIGHT")
		// || (this._object.position.distanceTo(WORLD.player.position) < 10)
		&& (WORLD.intersects.findIndex((child) => child.bbox.containsPoint(this._object.position)) === -1) // --> 
		// && (Math.abs(minifyAngle(angleToPlayerDelta)) > 120)
		)
	}) === -1);

	if (canGo) {
		this._pos += (this._factor * delta);
		if (this._pos > 1) { this._pos = 0; };
		this._object.lookAt(this.path.getPointAt(this._pos));
		this._objectBody.position.copy(this.path.getPointAt(this._pos));
	}

}

CONTROLS.PathControls.prototype.showPath = function () {
	var geometry = new THREE.Geometry();
	var points = this.path.getPoints(50);

	var material = new THREE.LineBasicMaterial({
		color: 0xff00f0
	});

	geometry.vertices = points;
	var line = new THREE.Line(geometry, material);
	line.position.set(0, 0.25, 0)
	WORLD.scene.add(line);
}

CONTROLS.PathControls.prototype.getPosition = function () {
	return this._object.position;
}

CONTROLS.PathControls.prototype.detectCollision = function (mesh) {
	if (this._object && this._object.geometry) {
		var sphere = new THREE.Sphere(this._object.position, this._object.geometry.boundingSphere.radius);
		
		if(sphere.containsPoint(mesh.position)) {
			toastr.options = {
				"closeButton": false,
				"newestOnTop": true,
				"positionClass": "toast-top-right",
				"preventDuplicates": true
			}
			toastr.error("Va cham với phương tiện giao thông khác!");
		}

	}
}