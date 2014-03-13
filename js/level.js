var Level = function() {
	this._size = Game.MAP_SIZE;
	this._beings = {};
	this._items = {};
	this._cells = {};
	this._free = {};
	this._empty = Cell.empty;

	this._create();
}

Level.prototype.drawMemory = function() {
}

/** Eating a seaweed, visiting an O2 bubble */
Level.prototype.setCell = function(cell, xy) {
	if (cell) {
		this._cells[xy] = cell;
	} else {
		delete this._cells[xy];
	}
	this.draw(xy);
}

Level.prototype.activate = function() {
	for (var p in this._beings) {
		Game.scheduler.add(this._beings[p], true);
	}
	
	Game.display.clear();
	this.drawMemory();
	Game.status.update();
}

Level.prototype.deactivate = function() {
	Game.scheduler.clear();
}

Level.prototype.blocks = function(xy) {
	return (this._cells[xy] || this._empty).blocks();
}

Level.prototype.draw = function(xy) {
	var visual = this._visualAt(xy);
	var bg = this._getBackgroundColor(xy);
	Game.display.draw(xy.x, xy.y + Game.TEXT_HEIGHT, visual.ch, ROT.Color.toRGB(visual.fg), ROT.Color.toRGB(bg));
}

Level.prototype.getSize = function() {
	return this._size;
}

Level.prototype._visualAt = function(xy, excludeBeings) {
	var xys = xy.toString(); /* cache to optimize for speed */
	return ((!excludeBeings && this._beings[xys]) || this._items[xys] || this._cells[xys] || this._empty).getVisual();
}

Level.prototype.getBeingAt = function(xy) {
	return this._beings[xy] || null;
}

Level.prototype.getItemAt = function(xy) {
	return this._items[xy] || null;
}

Level.prototype.getCellAt = function(xy) {
	return this._cells[xy] || this._empty;
}

Level.prototype.setBeing = function(being, xy) {
	if (!being) { 
		delete this._beings[xy];
		if (Game.level == this) { this.draw(xy); }
		return;
	}

	/* remove from old position, draw */
	if (being.getLevel() == this) {
		var oldXY = being.getXY();
		delete this._beings[oldXY];
		if (Game.level == this) { this.draw(oldXY); }
	}

	var cell = this._cells[xy];
	if (cell && cell.enter) { cell.enter(being); }

	being.setPosition(xy, this); /* propagate position data to the entity itself */

	/* set new position, draw */
	this._beings[xy] = being;
	if (Game.level == this) { this.draw(xy); }
}

Level.prototype.setItem = function(item, xy) {
	delete this._items[xy];
	if (item) { this._items[xy] = item; }

	if (Game.level == this) { this.draw(xy); }
	return this;
}

Level.prototype._create = function() {
	this._createWalls();
	this._createItems();
	this._createBeings();
}

Level.prototype._createWalls = function() {}
Level.prototype._createItems = function() {}
Level.prototype._createBeings = function() {}

Level.prototype._createFree = function() {
	var free = this._free;
	var cells = this._cells;

	/* start at center */
	var center = new XY(Math.round(this._size.x/2), Math.round(this._size.y/2));
	var dirs = ROT.DIRS[8];
	var radius = 0;

	while (center in cells) { /* find a starting free place */
		radius++;
		dirs.forEach(function(dir) {
			var c2 = new XY(center.x + radius * dir[0], center.y + radius * dir[1]);
			if (!(c2 in cells)) { center = c2; }
		});
	}

	/* flood fill free cells */
	free[center] = center;
	var queue = [center];
	var process = function() {
		var xy = queue.shift();

		dirs.forEach(function(dir) {
			var xy2 = new XY(xy.x + dir[0], xy.y + dir[1]);
			if (xy2 in cells || xy2 in free) { return; }
			free[xy2] = xy2;
			queue.push(xy2);
		});
	}
	while (queue.length) { process();  }
}

Level.prototype._getBackgroundColor = function() {
}

Level.prototype._findFreeClosestTo = function(xy) {
	var best = null;
	var dist = Infinity;
	for (var id in this._free) {
		var d = this._free[id].dist8(xy);
		if (d < dist) {
			dist = d;
			best = this._free[id];
		}
	}
	
	return best;
}

Level.prototype._findFree = function() {
	return this._free[Object.keys(this._free).random()];
}

Level.prototype._findFreeNearWall = function() {
	var avail = [];
	for (var id in this._free) {
		var xy = this._free[id];
		for (var i=0;i<8;i++) {
			var dir = ROT.DIRS[8][i];
			var xy2 = xy.plus(new XY(dir[0], dir[1]));
			if (this._cells[xy2] == Cell.wall) { 
				avail.push(xy);
				break;
			}
		}
	}
	return avail;
}
