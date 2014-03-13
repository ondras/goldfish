Being.Enemy = function(visual) {
	Being.call(this, visual);
	this._aggressive = false;
	this._item = null;
}
Being.Enemy.extend(Being);

Being.Enemy.prototype.setDanger = function(danger) {
	var factor = 1 + (danger-1)/5;
	for (var p in this._stats) {
		this._stats[p] = Math.round(this._stats[p] * factor);
	}
}

Being.Enemy.prototype.setItem = function(item) {
	this._item = item;
	return this;
}

Being.Enemy.prototype.die = function() {
	if (this._item && !this._level.getItemAt(this._xy)) { this._level.setItem(this._item, this._xy); }
	Being.prototype.die.call(this);
}

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
