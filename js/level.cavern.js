Level.Cavern = function(overview, xy, questItem, danger) {
	this._colors = [];
	this._noise = new ROT.Noise.Simplex();
	this._memory = {};
	this._questItem = questItem;
	this._danger = danger;
	
	this._overview = {
		level: overview,
		xy: xy
	}
	
	this._fov = {};
	this._entrance = null;
	this._exit = null; /* not really an exit, just a location for the item */

	Level.call(this);
}
Level.Cavern.extend(Level);

/**
 * Staircase needs to change color
 */
Level.Cavern.prototype.getQuestItem = function() {
	return this._questItem;
}

Level.Cavern.prototype.drawMemory = function() {
	this._fov = {};
	for (var xy in this._memory) {
		this._drawWeak(XY.fromString(xy), this._memory[xy]);
	}
}

Level.Cavern.prototype.isVisible = function(xy) {
	return (xy in this._fov);
}

Level.Cavern.prototype.getEntrance = function() {
	return this._entrance;
}

Level.Cavern.prototype.draw = function(xy) {
	/* draw only when in player's FOV */
	if (xy in this._fov) { return Level.prototype.draw.call(this, xy); }
}

/** setBeing completely overriden due to FOV */
Level.Cavern.prototype.setBeing = function(being, xy) {
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
		this._memory[xy] = this._visualAt(xy, true);

		if (id in oldFOV) { /* was visible, ignore */
			delete oldFOV[id];
		} else { /* newly visible, draw */
			this.draw(xy);
		}
	}
	
	for (var id in oldFOV) {
		var xy = oldFOV[id];
		var visual = this._visualAt(xy, true);
		this._drawWeak(xy, visual);
	}
}

Level.Cavern.prototype._getBackgroundColor = function(xy) {
	var val = this._noise.get(xy.x/20, xy.y/20)/2 + 0.5;
	return ROT.Color.interpolate(this._colors[0], this._colors[1], val);
}

Level.Cavern.prototype._create = function() {
	this._createColors();
	Level.prototype._create.call(this);
}

Level.Cavern.prototype._createColors = function() {
	switch (this._danger) {
		case 1:
			var stdDev = [0, 0, 20];
			var base = [
				[0, 0, 40],
				[0, 0, 80]
			];
		break;

		case 2:
			var stdDev = [0, 20, 20];
			var base = [
				[0, 0, 60],
				[0, 60, 40]
			];
		break;

		case 3:
			var stdDev = [20, 10, 20];
			var base = [
				[0, 0, 60],
				[60, 0, 0]
			];
		break;
	}

	for (var i=0;i<base.length;i++) {
		var c = ROT.Color.randomize(base[i], stdDev);
		for (var j=0;j<3;j++) { c[j] = Math.min(c[j], 80); }
		this._colors.push(c);
	}
}

Level.Cavern.prototype._createWalls = function() {
	var limit = this._size.x * this._size.y * 0.333;
	do {
		this._cells = {};
		this._free = {};
		
		this._tryCreateWalls();
		this._createFree();
	} while (Object.keys(this._free).length < limit);
	
	var left = ROT.RNG.getUniform() > 0.5;
	var top = ROT.RNG.getUniform() > 0.5;

	this._entrance = this._createCorner(left, top);
	this._exit = this._createCorner(!left, !top);
	
	/* "safe zone" */
	var r = 3;
	for (var i=-r;i<=r;i++) {
		for (var j=-r;j<=r;j++) {
			delete this._free[new XY(this._entrance.x+i, this._entrance.y+j)];
		}
	}
	
	var staircase = new Cell.Staircase(0); /* danger 0 = up */
	staircase.setTarget(this._overview.level, this._overview.xy);
	this.setCell(staircase, this._entrance);
}

Level.Cavern.prototype._tryCreateWalls = function() {
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

Level.Cavern.prototype._createCorner = function(left, top) {
	var corner = new XY();
	corner.x = left ? 0 : this._size.x-1;
	corner.y = top ? 0 : this._size.y-1;

	corner = this._findFreeClosestTo(corner);

	/* shift towards the center */
	corner.x += (left ? 1 : -1);
	corner.y += (top ? 1 : -1);

	delete this._cells[corner]; /* just in case it was not free */
	delete this._free[corner]; /* not free anymore :) */
	return corner;
}

Level.Cavern.prototype._createItems = function() {
	this._createSeaweed();

	var min = Rules.BUBBLE_COUNT[0];
	var max = Rules.BUBBLE_COUNT[1];
	var bubbles = min + Math.floor(ROT.RNG.getUniform() * (max-min+1));
	while (bubbles--) {
		var xy = this._findFree();
		delete this._free[xy];
		var bubble = new Cell.Bubble();
		bubble.setPosition(xy, this);
		this._cells[xy] = bubble;
	}

	this.setItem(this._questItem, this._exit);
}

Level.Cavern.prototype._createSeaweed = function() {
	for (var i=0;i<this._size.x;i++) {
		if (ROT.RNG.getUniform() > Rules.SEAWEED_CHANCE) { continue; }
		var dy = (ROT.RNG.getUniform() > 0.5 ? 1 : -1);
		var xy = new XY(i, Math.round(this._size.y/2));
		var lastFree = null;
		
		while (xy.y > 0 && xy.y < this._size.y) {
			xy.y += dy;
			if (xy in this._free) { lastFree = new XY(xy.x, xy.y); }
		}
		if (lastFree) { this._createSeaweedLine(lastFree, -dy); }
		
	}
}

Level.Cavern.prototype._createSeaweedLine = function(xy, dy) {
	var min = Rules.SEAWEED_LENGTH[0];
	var max = Rules.SEAWEED_LENGTH[1];
	var limit = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));

	while (xy in this._free && limit) {
		limit--;
		delete this._free[xy];
		
		var seaweed = new Cell.Seaweed();
		this._cells[xy] = seaweed;
		seaweed.setPosition(new XY(xy.x, xy.y), this);

		xy.y += dy;
	}
}

Level.Cavern.prototype._createBeings = function() {
	switch (this._danger) {
		case 1:
			this._createBoss(Being.Piranha);
			this._createJellyfish(1);
			this._createCrab(3);
			
			this._createBeing(Being.Snake, [1, 3]);
			this._createBeing(Being.Fish, [1, 3]);
		break;
		
		case 2:
			this._createBoss(Being.LargeSnake);
			this._createJellyfish(2);
			this._createCrab(5);

			this._createBeing(Being.Piranha, [1, 3]);
			this._createBeing(Being.Snake, [1, 3]);
			this._createBeing(Being.Fish, [1, 3]);
		break;
		
		case 3:
			this._createBoss(Being.Octopus);
			this._createJellyfish(3);
			this._createCrab(7);

			this._createBeing(Being.Piranha, [1, 3]);
			this._createBeing(Being.Snake, [1, 3]);
			this._createBeing(Being.LargeSnake, [1, 3]);
			this._createBeing(Being.Fish, [1, 3]);
		break;
	}
	
	this._createBeing(Being.Seahorse, 2);
	this._createStarfish(4);

	var itemMap = {
		"Scale": 3,
		"Fin": 2,
		"Jaws": 1
	}
	
	for (var p in this._beings) { 
		var being = this._beings[p];
		if (!(being instanceof Being.Enemy)) { return; }

		being.setDanger(this._danger);
		if (ROT.RNG.getUniform() > Rules.ITEM_CHANCE) { continue; }
		
		var itemLevel = (ROT.RNG.getUniform() > 0.5 ? this._danger : this._danger-1);
		var item = new Item[ROT.RNG.getWeightedValue(itemMap)](itemLevel);
		being.setItem(item);
	}
}

Level.Cavern.prototype._createBeing = function(ctor, count) {
	if (count instanceof Array) { count = count[0] + Math.floor(ROT.RNG.getUniform() * (count[1]-count[0]+1)); }
	
	while (count--) {
		var xy = this._findFree();
		delete this._free[xy];
		this.setBeing(new ctor(), xy);
	}
}

Level.Cavern.prototype._createJellyfish = function(clusterCount) {
	while (clusterCount--) {
		var center = this._findFree();
		for (var i=-1;i<=1;i++) {
			for (var j=-1;j<=1;j++) {
				var xy = new XY(center.x+i, center.y+j);
				if (!(xy in this._free)) { continue; }
				if (ROT.RNG.getUniform() > 0.5) { continue; }
				delete this._free[xy];
				this.setBeing(new Being.Jellyfish(), xy);
			}
		}
	}
}

Level.Cavern.prototype._createStarfish = function(count) {
	var avail = this._findFreeNearWall().randomize();
	while (count--) {
		var xy = avail.pop();
		delete this._free[xy];
		this.setBeing(new Being.Starfish(), xy);
	}
}

Level.Cavern.prototype._createCrab = function(count) {
	var avail = this._findFreeNearWall().randomize();
	while (count--) {
		var xy = avail.pop();
		delete this._free[xy];
		this.setBeing(new Being.Crab(), xy);
	}
}

Level.Cavern.prototype._createBoss = function(ctor) {
	var xy = this._findFreeClosestTo(this._exit);
	delete this._free[xy];
	this.setBeing(new ctor(), xy);
}
