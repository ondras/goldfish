Level.Overview = function() {
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

Level.Overview.prototype._getBackgroundColor = function(xy) {
	return [0, 0, 0];
}

Level.Overview.prototype._createBeings = function() {
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
		cells[xy] = Cell.wall;
	});
}
