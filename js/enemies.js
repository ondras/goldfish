/**
 * Not really an enemy.
 */
Being.Seahorse = function() {
	Being.call(this, {ch:"§", fg:[250, 250, 0], description:"seahorse"});
	this._stats.speed = Math.round(this._stats.speed * 1.5);
}
Being.Seahorse.extend(Being);

Being.Seahorse.CHATS = [
	"These waters are dangerous!",
	"Jellyfish can harm all living creatures.",
	"You will run out of oxygen if you spend too much time underwater.",
	"All wishes can be fulfilled.",
	"I like your scales!",
	"Deep waters can be more dangerous than shallow ones.",
	"You don't want to mess with an octopus.",
	"Did you know? Crabs cannot swim!",
	"After a tough fight, recover yourself by eating some seaweed!",
	"I want to be a goldfish when I grow up!",
	"I am one very happy seahorse!"
];

Being.Seahorse.prototype.act = function() {
	this._idle();
}

Being.Seahorse.prototype.chat = function(being) {
	Game.text.write("%The talk to %a.".format(being, this));
	Game.text.write('%It says: "%s"'.format(this, Being.Seahorse.CHATS.random()));
}

/**
 * Also not really an enemy.
 */
Being.Starfish = function() {
	var hue = ROT.RNG.getUniform();
	Being.Enemy.call(this, {ch:"*", fg:ROT.Color.hsl2rgb([hue, 1, 0.5]), description:"starfish"});
	this._stats.defense = 0;
}
Being.Starfish.extend(Being.Enemy);
Being.Starfish.prototype.act = function() {};

/**
 * Clusters.
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
 * Move to place with most Jellyfish neighbors
 */
Being.Jellyfish.prototype._idle = function() {
	var avail = this._getAvailableNeighbors();
	if (!avail.length) { return; }

	var candidates = [];
	var max = -1;
	
	for (var i=0;i<avail.length;i++) {
		var xy = avail[i];
		var count = this._jellyNeighborCount(xy);
		if (count > max) {
			max = count;
			candidates = [];
		}
		if (count == max) { candidates.push(xy); }
	}

	this._level.setBeing(this, candidates.random());
}

Being.Jellyfish.prototype._jellyNeighborCount = function(xy) {
	var count = 0;
	ROT.DIRS[8].forEach(function(dir) {
		var being = this._level.getBeingAt(new XY(xy.x + dir[0], xy.y + dir[1]));
		if (being && being instanceof Being.Jellyfish && being != this) { count++; }
	}, this);
	return count;
}

/**
 * Agressive, but moves only close to walls
 */
Being.Crab = function() {
	Being.Enemy.call(this, {ch:"x", fg:[250, 50, 50], description:"crab"});
	this._stats.defense += 1;
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

/**
 * Agressive.
 */
Being.Piranha = function() {
	Being.Enemy.call(this, {ch:"p", fg:[200, 200, 200], description:"piranha"});
	this._stats.defense;
	this._stats.attack += 1;
	this._stats.maxhp += 1;
	this._stats.hp = this._stats.maxhp;
	this._aggressive = true;
}
Being.Piranha.extend(Being.Enemy);

/**
 * Semi-aggresive.
 */
Being.Snake = function() {
	Being.Enemy.call(this, {ch:"s", fg:[50, 250, 50], description:"water snake"});
	this._stats.speed += 1;
	this._stats.defense += 1;
	this._stats.attack += 1;
	this._aggressive = (ROT.RNG.getUniform() > 0.5);
}
Being.Snake.extend(Being.Enemy);

/**
 * Aggresive.
 */
Being.LargeSnake = function() {
	Being.Enemy.call(this, {ch:"S", fg:[30, 200, 30], description:"large snake"});
	this._stats.speed += 1;
	this._stats.defense += 2;
	this._stats.attack += 2;
	this._stats.maxhp += 2;
	this._stats.hp = this._stats.maxhp;
	this._aggressive = true;
}
Being.LargeSnake.extend(Being.Enemy);

/**
 * Non-agressive.
 */
Being.Fish = function() {
	var hue = ROT.RNG.getUniform();
	Being.Enemy.call(this, {ch:"f", fg:ROT.Color.hsl2rgb([hue, 1, 0.5]), description:"rainbow fish"});
}
Being.Fish.extend(Being.Enemy);

/**
 * Agressive.
 */
Being.Octopus = function() {
	Being.Enemy.call(this, {ch:"O", fg:[200, 50, 200], description:"octopus"});
	this._stats.defense += 3;
	this._stats.attack += 3;
	this._stats.maxhp += 3;
	this._stats.hp = this._stats.maxhp;
	this._aggressive = true;
}
Being.Octopus.extend(Being.Enemy);
