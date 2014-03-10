var Being = function(visual) {
	Entity.call(this, visual);

	this._stats = {};
	Stats.all.forEach(function(name) {
		this._stats[name] = Stats[name].def;
	}, this);
}
Being.extend(Entity);

Being.prototype.getStat = function(name) {
	return Math.max(0, this._stats[name]);
}

Being.prototype.setStat = function(name, value) {
	this._stats[name] = value;
	return this;
}

Being.prototype.adjustStat = function(name, diff) {
	/* cannot use this.getStat(), might be modified by items */
	this.setStat(name, this._stats[name] + diff);
	return this;
}

/**
 * Called by the Scheduler
 */
Being.prototype.getSpeed = function() {
	return this.getStat("speed");
}

Being.prototype.damage = function(damage) {
	this.adjustStat("hp", -damage);
	if (this.getStat("hp") <= 0) { this.die(); }
}

Being.prototype.act = function() {
	/* FIXME */
}

Being.prototype.die = function() {
	Game.scheduler.remove(this);
}

Being.prototype.setPosition = function(xy, level) {
	/* came to a currently active level; add self to the scheduler */
	if (level != this._level && level == Game.level) {
		Game.scheduler.add(this, true);
	}

	return Entity.prototype.setPosition.call(this, xy, level);
}
