Level.Cavern = function(size) {
	this._colors = [];
	this._noise = new ROT.Noise.Simplex();

	Level.call(this);
}
Level.Cavern.extend(Level);

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
		[0, 40, 40]
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
