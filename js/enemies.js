Being.Jellyfish = function() {
	Being.Enemy.call(this, {ch:"Ω", fg:[255, 105, 180]});
}
Being.Jellyfish.extend(Being.Enemy);

Being.Seahorse = function() {
	Being.Enemy.call(this, {ch:"§", fg:[250, 250, 0]});
}
Being.Seahorse.extend(Being.Enemy);

Being.Crab = function() {
	Being.Enemy.call(this, {ch:"x", fg:[250, 50, 50]});
	this._aggressive = true;
}
Being.Crab.extend(Being.Enemy);

Being.Crab.prototype._isAvailableNeighbor = function(xy) {
	var wall = false;
	ROT.DIRS[8].forEach(function(dir) {
		var xy2 = new XY(xy.x + dir[0], xy.y + dir[1]);
		var cell = this._level.getCellAt(xy2);
		if (cell == Cell.wall) { wall = true; }
	}, this);
	
	if (!wall) { return false; }
	return Being.Enemy.prototype._isAvailableNeighbor.call(this, xy);
}
