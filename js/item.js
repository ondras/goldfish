var Item = function() {
	Entity.call(this, {ch:"?", description:""});

	this._stats = {};
	Stats.all.forEach(function(name) {
		this._stats[name] = 0;
	}, this);
}
Item.extend(Entity);

Item.prototype.getStat = function(name) {
	return this._stats[name];
}

Item.TYPES = [
	{
		label: "common",
		color: [150, 150, 150]
	},

	{
		label: "bronze",
		color: [150, 50, 50]
	},

	{
		label: "silver",
		color: [180, 180, 250]
	},

	{
		label: "golden",
		color: Game.GOLD
	}

]