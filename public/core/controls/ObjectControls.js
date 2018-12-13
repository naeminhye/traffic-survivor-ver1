var CONTROLS = CONTROLS || {};

CONTROLS.PathControls = function (object, path, prop) {
	this.path = path;
	this._object = object;
	// this._oldRotation = object.rotation.y;
	this._pos = 0;
	this.velocity = 1; //unidades por segundo
	if (prop && prop.velocity) {
		this.velocity = prop.velocity;
	}
	this._factor = this.velocity / this.path.getLength();
	// this._object.add( WORLD.bgSound )

};

CONTROLS.PathControls.prototype.update = function (delta) {
	var flag = false;
	this._object.position.copy(this.path.getPointAt(this._pos));

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
		// && (WORLD.intersects.findIndex((child) => child.bbox.containsPoint(this._object.position)) === -1) // --> 
		&& (Math.abs(minifyAngle(angleToPlayerDelta)) > 120))
	}) === -1);
	if (canGo) {
		this._pos += (this._factor * delta);
		if (this._pos > 1) { this._pos = 0; };
		this._object.lookAt(this.path.getPointAt(this._pos));
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
