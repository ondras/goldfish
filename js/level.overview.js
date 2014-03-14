Level.Overview = function() {
	this._fishers = [];
	this._noise = new ROT.Noise.Simplex();
	this._colors = [
		[30, 30, 200],
		[150, 150, 240]
	]

	Level.call(this);

	this._empty = Cell.water;
}
Level.Overview.extend(Level);

/** Overview has no memory, everything is visible */
Level.Overview.prototype.drawMemory = function() {
	var xy = new XY();
	for (var i=0;i<this._size.x;i++) {
		xy.x = i;
		for (var j=0;j<this._size.y;j++) {
			xy.y = j;
			this.draw(xy);
		}
	}
}

Level.Overview.prototype._visualAt = function(xy) {
	var visual = Level.prototype._visualAt.call(this, xy);
	if (visual == this._empty.getVisual()) {
		var val = this._noise.get(xy.x/20, xy.y/20)/2 + 0.5;
		visual.fg = ROT.Color.interpolate(this._colors[0], this._colors[1], val);
	}
	return visual;
}

Level.Overview.prototype.activate = function() {
	Level.prototype.activate.call(this);
	
	if (Progress.questsGenerated) {
		this._fishers.forEach(function(fisher) { fisher.generate(); });
	}
}

Level.Overview.prototype.getCenter = function() {
	return new XY(Math.round(this._size.x/2), Math.round(this._size.y/2));
}

Level.Overview.prototype.setBeing = function(being, xy) {
	Level.prototype.setBeing.call(this, being, xy);
	
	if (being == Game.player) {
		var cell = this._cells[xy];
		if (cell instanceof Cell.Rod && cell.isLast()) {
			var fisher = cell.getFisher();
			fisher.interact(being);
		}
	}
}

Level.Overview.prototype.pickStaircasePosition = function() {
	var xy = this.getCenter();

	if (Progress.questsGenerated > 0) {
		var avail = [];
		for (var id in this._free) {
			var dx = Math.abs(this._free[id].x - xy.x);
			var dy = Math.abs(this._free[id].y - xy.y);
			if (dx < this._size.x/4 && dy < this._size.y/4) { avail.push(this._free[id]); }
		}
		xy = avail.random();
	}
	
	delete this._free[xy];
	return xy;
}

Level.Overview.prototype._createBeings = function() {
	var cnt = Rules.QUESTS;
	var center = this.getCenter();
	var aspect = this._size.x/this._size.y;

	for (var i=0;i<cnt;i++) {
		var angle = (i+0.5) * 2*Math.PI/cnt;

		var exact = new XY(center.x, center.y);
		var xy = new XY(center.x, center.y);

		while (this._cells[xy] != Cell.grass) {
			exact.x += Math.cos(angle);
			exact.y += Math.sin(angle) / aspect;
			xy.x = Math.round(exact.x);
			xy.y = Math.round(exact.y);
		}
		
		var hue = angle/(2*Math.PI);
		var color = ROT.Color.hsl2rgb([hue, 1, 0.7]);
		this._createFisher(xy, color);
	}
}

Level.Overview.prototype._createFisher = function(xy, color) {
	var center = this.getCenter();
	var dx = center.x-xy.x;
	var dy = center.y-xy.y;
	var angle = Math.atan2(dy, dx).mod(2*Math.PI);
	var ratio = Math.abs(dx/dy) * this._size.y/this._size.x;
	
	var delta = new XY(1, 1);
	if (dx < 0) { delta.x *= -1; }
	if (dy < 0) { delta.y *= -1; }
	if (ratio > 2) { delta.y = 0; }
	if (ratio < 0.5) { delta.x = 0; }
	
	var fisher = new Being.Fisher(color, delta);
	this.setBeing(fisher, xy);
	this._fishers.push(fisher);
}

Level.Overview.prototype._createWalls = function() {
	var map = new ROT.Map.Cellular(this._size.x, this._size.y, {
		born: [4, 5, 6, 7, 8],
		survive: [3, 4, 5, 6, 7, 8]
	});

	var cx = this._size.x/2;
	var cy = this._size.y/2;
	for (var i=0;i<this._size.x;i++) {
		for (var j=0;j<this._size.y;j++) {
			var dx = Math.abs(i-cx)/cx;
			var dy = Math.abs(j-cy)/cy;
			var dist = Math.sqrt(dx*dx+dy*dy);
			if (dist < 0.5) { 
				map.set(i, j, 1); 
			} else if (dist > 0.85) {
				map.set(i, j, 0);
			} else {
				map.set(i, j, ROT.RNG.getUniform() > 0.5 ? 1 : 0);
			}
		}
	}

	for (var i=0; i<2; i++) { map.create(); }

	var cells = this._cells;
	map.create(function(x, y, alive) {
		if (alive) { return; }
		var xy = new XY(x, y);
		cells[xy] = Cell.grass;
	});

	this._createShore();
	this._createFree();
}

Level.Overview.prototype._createShore = function() {
	for (var id in this._cells) {
		var xy = XY.fromString(id);

		if (!xy.x || !xy.y || xy.x+1 == Game.MAP_SIZE.x || xy.y+1 == Game.MAP_SIZE.y) { continue; }

		var l = !(new XY(xy.x-1, xy.y) in this._cells);
		var r = !(new XY(xy.x+1, xy.y) in this._cells);
		var t = !(new XY(xy.x, xy.y-1) in this._cells);
		var b = !(new XY(xy.x, xy.y+1) in this._cells);
		if (l || r || t || b) { this._cells[id] = Cell.shore; }
	}
}

Level.Overview.prototype._getBackgroundColor = function(xy) {
	return [0, 0, 0];
}
