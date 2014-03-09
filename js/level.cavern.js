Level.Cavern = function(size) {
	this._colors = [];
	this._noise = new ROT.Noise.Simplex();
	this._memory = {};
	
	this._fov = {};

	Level.call(this);
}
Level.Cavern.extend(Level);

Level.Cavern.prototype.drawMemory = function() {
	for (var xy in this._memory) {
		this._drawWeak(xy, this._memory[xy]);
	}
}

Level.Cavern.prototype.draw = function(xy) {
	/* draw only when in player's FOV */
	if (xy in this._fov) { return Level.prototype.draw.call(this, xy); }
}

/** setBeing completely overriden due to FOV */
Level.Cavern.prototype.setBeing = function(being, xy) {
	/* remove from old position, draw */
	if (being.getLevel() == this) {
		var oldXY = being.getXY();
		delete this._beings[oldXY];
		if (Game.level == this) { this.draw(oldXY); }
	}

	being.setPosition(xy, this); /* propagate position data to the entity itself */

	if (being == Game.player) { this._updateFOV(being); }

	/* set new position, draw */
	this._beings[xy] = being;
	if (Game.level == this) { this.draw(xy); }
}

Level.Cavern.prototype._drawWeak = function(xy, visual) {
	var fg = ROT.Color.interpolate([0, 0, 0], visual.fg, 0.5);
	var bg = this._getBackgroundColor(xy);
	Game.display.draw(xy.x, xy.y + Game.TEXT_HEIGHT, visual.ch, ROT.Color.toRGB(fg), ROT.Color.toRGB(bg));
}

Level.Cavern.prototype._updateFOV = function(being) {
	var oldFOV = this._fov;
	this._fov = being.computeFOV();
	for (var id in this._fov) {
		var xy = this._fov[id];
		this._memory[xy] = this._visualAt(xy);

		if (id in oldFOV) { /* was visible, ignore */
			delete oldFOV[id];
		} else { /* newly visible, draw */
			this.draw(xy);
		}
	}
	
	for (var id in oldFOV) {
		var xy = oldFOV[id];
		var visual = this._visualAt(xy);
		this._drawWeak(xy, visual);
	}
}

Level.Cavern.prototype._getBackgroundColor = function(xy) {
	var val = this._noise.get(xy.x/20, xy.y/20)/2 + 0.5;
	return ROT.Color.interpolate(this._colors[0], this._colors[1], val);
}

Level.Cavern.prototype._create = function() {
	Level.prototype._create.call(this);
	this._createColors();
}

Level.Cavern.prototype._createColors = function() {
	var stdDev = [0, 20, 20];
	var base = [
		[0, 0, 60],
		[0, 60, 40]
	];
	for (var i=0;i<base.length;i++) {
		var c = ROT.Color.randomize(base[i], stdDev);
		for (var j=0;j<3;j++) { c[j] = Math.min(c[j], 80); }
		this._colors.push(c);
	}
}

Level.Cavern.prototype._createWalls = function() {
	for (var i=0;i<this._size.x;i++) {
		this._cells[new XY(i, 0)] = Cell.wall;
		this._cells[new XY(i, this._size.y-1)] = Cell.wall;
	}

	for (var j=0;j<this._size.y;j++) {
		this._cells[new XY(0, j)] = Cell.wall;
		this._cells[new XY(this._size.x-1, j)] = Cell.wall;
	}

	var map = new ROT.Map.Cellular(this._size.x-2, this._size.y-2, {
		born: [4, 5, 6, 7, 8],
		survive: [3, 4, 5, 6, 7, 8]
	});
	map.randomize(0.4);

	for (var i=0; i<3; i++) { map.create(); }

	map.setOptions({
		born: [5, 6, 7, 8],
		survive: [4, 5, 6, 7, 8]
	});

	for (var i=0; i<2; i++) { map.create(); }

	var cells = this._cells;
	map.create(function(x, y, alive) {
		if (alive) { return; }
		var xy = new XY(x+1, y+1);
		cells[xy] = Cell.wall;
	});
}
