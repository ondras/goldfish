var Level = function() {
	this._size = Game.MAP_SIZE;
	this._beings = {};
	this._items = {};
	this._cells = {};
	this._empty = Cell.empty;

	this._create();
}

Level.prototype.activate = function() {
	for (var p in this._beings) {
		Game.scheduler.add(this._beings[p], true);
	}
}

Level.prototype.deactivate = function() {
	Game.scheduler.clear();
}

Level.prototype.draw = function(xy) {
	var entity = this._beings[xy] || this._items[xy] || this._cells[xy] || this._empty;
	var visual = entity.getVisual();
	var bg = this._getBackgroundColor(xy);
	Game.display.draw(xy.x, xy.y + Game.TEXT_HEIGHT, visual.ch, visual.fg, ROT.Color.toRGB(bg));
}

Level.prototype.getSize = function() {
	return this._size;
}

Level.prototype.setEntity = function(entity, xy) {
	/* FIXME remove from old position, draw */
	if (entity.getLevel() == this) {
		var oldXY = entity.getXY();
		delete this._beings[oldXY];
		if (Game.level == this) { this.draw(oldXY); }
	}

	entity.setPosition(xy, this); /* propagate position data to the entity itself */

	/* FIXME set new position, draw */
	this._beings[xy] = entity;
	if (Game.level == this) { 
		this.draw(xy); 
		Game.textBuffer.write("An entity moves to " + xy + ".");
	}
}

Level.prototype.getBeings = function() {
	return this._beings;
}

Level.prototype._create = function() {
	this._createWalls();
//	this._createFree();
	this._createBeings();
	this._createItems();
}

Level.prototype._createWalls = function() {}
Level.prototype._createBeings = function() {}
Level.prototype._createItems = function() {}

Level.prototype._createFree = function() {
	var free = this.free;
	var walls = this.walls;

	var center = new XY(Math.round(this.size.x/2), Math.round(this.size.y/2));
	if (center in walls) { delete walls[center]; }

	var dirs = ROT.DIRS[8];

	var scan = function(xy) {
		free[xy] = 1;
		dirs.forEach(function(dir) {
			var xy2 = new XY(xy.x + dir[0], xy.y + dir[1]);
			if (xy2 in walls || xy2 in free) { return; }
			scan(xy2);
		});
	}

	scan(center);
}

Level.prototype._getBackgroundColor = function() {
}
