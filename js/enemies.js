/**
 * Not really an enemy.
 */
Being.Seahorse = function() {
	Being.call(this, {ch:"§", fg:[250, 250, 0], description:"seahorse"});
}
Being.Seahorse.extend(Being);

Being.Seahorse.prototype.act = function() {
	this._idle();
}


Being.Jellyfish = function() {
	Being.Enemy.call(this, {ch:"Ω", fg:[255, 105, 180], description:"jellyfish"});
}
Being.Jellyfish.extend(Being.Enemy);


Being.Crab = function() {
	Being.Enemy.call(this, {ch:"x", fg:[250, 50, 50], description:"crab"});
	this._aggressive = true;
}
Being.Crab.extend(Being.Enemy);


Being.Crab.prototype._getAvailableNeighbors = function() {
	var result = [];
	ROT.DIRS[8].forEach(function(dir) {
		var xy = new XY(this._xy.x + dir[0], this._xy.y + dir[1]);
		if (!this._hasWallNeighbor(xy)) { return; }
		if (this._level.blocks(xy) || this._level.getBeingAt(xy)) { return; }
		result.push(xy);
	}, this);
	return result;
}

Being.Crab.prototype._hasWallNeighbor = function(xy) {
	var result = false;
	ROT.DIRS[8].forEach(function(dir) {
		var xy2 = new XY(xy.x + dir[0], xy.y + dir[1]);
		var cell = this._level.getCellAt(xy2);
		if (cell == Cell.wall) { result = true; }
	}, this);
	return result;
}
