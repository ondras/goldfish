var Item = function() {
	Entity.call(this, {ch:"?"});

	this._stats = {};
	Stats.all.forEach(function(name) {
		this._stats[name] = 0;
	}, this);
}
Item.extend(Entity);

Item.prototype.getStat = function(name) {
	return this._stats[name];
}
