Being.Enemy = function(visual) {
	Being.call(this, visual);
	
	this._aggressive = false;
}
Being.Enemy.extend(Being);

Being.Enemy.prototype.damage = function(damage) {
	this._aggressive = true;
	return Being.prototype.damage.call(this, damage);
}

Being.Enemy.prototype.act = function() {
	var dist = this._xy.dist8(Game.player.getXY());
	
	if (this._aggressive && dist <= this.getStat("sight")) { /* get him */
		if (dist == 1) { /* can attack already */
			this._attack(Game.player);
		} else { /* move closer */
			this._getCloserTo(Game.player);
		}
	} else { /* do nothing */
		this._idle();
	}
}

Being.Enemy.prototype._getCloserTo = function(being) {
	var target = being.getXY();
	var avail = this._getAvailableNeighbors();
	if (!avail.length) { return; }
	avail.sort(function(a, b) {
		return a.dist8(target) - b.dist8(target);
	});
	var xy = avail[0];
	if (xy.dist8(target) > this._xy.dist8(target)) { return; } /* closest free worse than current */
	this._level.setBeing(this, xy);
}

Being.Enemy.prototype._idle = function() {
	var xy = this._getAvailableNeighbors().random();
	if (xy) { this._level.setBeing(this, xy); }
}

Being.Enemy.prototype._getAvailableNeighbors = function() {
	var result = [];
	ROT.DIRS[8].forEach(function(dir) {
		var xy = new XY(this._xy.x + dir[0], this._xy.y + dir[1]);
		if (!this._isAvailableNeighbor(xy)) { return; }
		result.push(xy);
	}, this);
	return result;
}

Being.Enemy.prototype._isAvailableNeighbor = function(xy) {
	return (!this._level.blocks(xy) && !this._level.getBeingAt(xy));
}

Being.Enemy.prototype._attack = function(being) {
	/* FIXME */
}
