var Being = function(visual) {
	Entity.call(this, visual);

	this._stats = {};
	Stats.all.forEach(function(name) {
		this._stats[name] = Stats[name].def;
	}, this);
}
Being.extend(Entity);

Being.prototype.getStat = function(name) {
	return this._stats[name];
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

/**
 * Called by the Engine
 */
Being.prototype.act = function() {
}

Being.prototype.die = function() {
	this._level.setBeing(null, this._xy);
	Game.scheduler.remove(this);
}

Being.prototype.setPosition = function(xy, level) {
	/* came to a currently active level; add self to the scheduler */
	if (level != this._level && level == Game.level) {
		Game.scheduler.add(this, true);
	}

	return Entity.prototype.setPosition.call(this, xy, level);
}

Being.prototype._attack = function(defender) {
	var attack = this.getStat("attack");
	var defense = defender.getStat("defense");

	var abonus = ROT.RNG.getNormal(0, Rules.COMBAT_STDDEV);
	var dbonus = ROT.RNG.getNormal(0, Rules.COMBAT_STDDEV);
	
	console.log("Attack:", attack, "+", abonus, "vs.", defense, "+", dbonus);

	attack += abonus;
	defense += dbonus;
	attack = Math.max(1, attack);
	defense = Math.max(1, defense);

	var damage = Math.ceil(attack/defense) - 1;
	
	this._describeAttack(defender, damage);
	
	if (damage) { defender.damage(damage); }
}

Being.prototype._describeAttack = function(defender, damage) {
	if (!this._level.isVisible(this._xy) || !this._level.isVisible(defender.getXY())) { return; }

	if (damage) {
		var amount = Math.max(defender.getStat("hp")-damage, 0) / defender.getStat("maxhp");
		if (!amount) { /* dead */
			var verb = ["kill", "destroy", "slaughter"].random();
			Game.text.write(("%The %{verb,kill} %the.").format(this, this, defender));
		} else { /* hit */
			var types = ["slightly", "moderately", "severly", "critically"].reverse();
			amount = Math.ceil(amount * types.length) - 1;
			Game.text.write(("%The %{verb,hit} %the and " + types[amount] +" %{verb,damage} %it.").format(this, this, defender, this, defender));
		} 
	} else {
		Game.text.write(("%The %{verb,miss} %the.").format(this, this, defender));
	}
}

Being.prototype._idle = function() {
	var xy = this._getAvailableNeighbors().random();
	if (xy) { this._level.setBeing(this, xy); }
}

Being.prototype._getAvailableNeighbors = function() {
	var result = [];
	ROT.DIRS[8].forEach(function(dir) {
		var xy = new XY(this._xy.x + dir[0], this._xy.y + dir[1]);
		if (this._level.blocks(xy) || this._level.getBeingAt(xy)) { return; }
		result.push(xy);
	}, this);
	return result;
}
