/**
 * Not really an enemy.
 */
Being.Seahorse = function() {
	Being.call(this, {ch:"§", fg:[250, 250, 0], description:"seahorse"});
	/* FIXME faster? */
}
Being.Seahorse.extend(Being);

Being.Seahorse.CHATS = [
	"These waters are dangerous!",
	"Did you know? Jellyfish can harm all living creatures.",
	"Did you know? You will run out of oxygen if you spend too much time underwater."
	/* FIXME */
];

Being.Seahorse.prototype.act = function() {
	this._idle();
}

Being.Seahorse.prototype.chat = function(being) {
	Game.text.write("%The talk to %a.".format(being, this));
	Game.text.write('%It says: "%s"'.format(this, Being.Seahorse.CHATS.random()));
}

/**
 * Clusters. FIXME
 */
Being.Jellyfish = function() {
	Being.Enemy.call(this, {ch:"Ω", fg:[255, 105, 180], description:"jellyfish"});
	this._aggressive = true;
}
Being.Jellyfish.extend(Being.Enemy);

Being.Jellyfish.prototype.act = function() {
	var avail = [];
	ROT.DIRS[8].forEach(function(dir) {
		var xy = this._xy.plus(new XY(dir[0], dir[1]));
		var being = this._level.getBeingAt(xy);
		if (being && !(being instanceof Being.Jellyfish)) { avail.push(being); }
	}, this);

	if (avail.length) {
		this._attack(avail.random());
	} else {
		this._idle();
	}
}


/**
 * Agressive.
 */
Being.Piranha = function() {
	Being.Enemy.call(this, {ch:"p", fg:[200, 200, 200], description:"piranha"});
	this._aggressive = true;
}
Being.Piranha.extend(Being.Enemy);

/**
 * Agressive, but moves only close to walls
 */
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
