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
};

CONTROLS.PathControls.prototype.update = function (delta) {
	var flag = false;
	this._object.position.copy(this.path.getPointAt(this._pos));

	WORLD.trafficLightList.forEach((light) => {
        
        if (light.object.position.distanceTo(WORLD.player.position) < 5) {

            var v = new THREE.Vector3();
            var objectVector = this._object.getWorldDirection(v);
            var signVector = new THREE.Vector3(light.direction.x, light.direction.y, light.direction.z);
            var objectAngle  = THREE.Math.radToDeg(Math.atan2(objectVector.x, objectVector.z));
            var signAngle  = THREE.Math.radToDeg(Math.atan2(signVector.x, signVector.z));
            var angleDelta = signAngle - objectAngle;
            if(!(Math.abs(minifyAngle(angleDelta)) <= 90) && light.currentStatus === "REDLIGHT") {
				flag = true;
			}
        } 
    });

	// if(!flag) {
	// 	if(this._object.position.distanceTo(WORLD.player.position) > 10) {
			this._pos += (this._factor * delta);
			if (this._pos > 1) { this._pos = 0; };
			this._object.lookAt(this.path.getPointAt(this._pos));
			// this._object.rotateY(-Math.PI / 2)
	// 	}
	// }

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
