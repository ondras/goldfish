Item.Stat = function(name, type) { /* stat-improving items, can be put in slots */
	Item.call(this);
	
	this._name = name;
	this._type = type;
	this._stat = {
		name: "",
		value: 0
	}
	
	var def = Item.Stat.TYPES[this._type];
	this._visual.fg = def.color;
}
Item.Stat.extend(Item);

Item.Stat.prototype.setStat = function(stat, value) {
	this._stat.name = stat;
	this._stat.value = value;

	var def = Item.Stat.TYPES[this._type];
	this._visual.description = def.label + " " + this._name;
	if (this._stat.name) { this._visual.description += " of " + Stats[this._stat.name].label.toLowerCase(); }

	return this;
}

Item.Stat.prototype.setRandomStat = function() {
	var stat = Stats.avail.random();
	var values = Stats[stat].random[this._type];
	
	if (values instanceof Array) {
		var value = values[0] + Math.floor(ROT.RNG.getUniform() * (values[1]-values[0]+1));
	} else {
		var value = values;
	}

	this.setStat(stat, value);
	return this;
}

Item.Stat.prototype.getStatName = function() {
	return this._stat.name;
}

Item.Stat.prototype.getStatValue = function() {
	return this._stat.value;
}

Item.Stat.prototype._generateValue = function(type) {
	return 0;
}

Item.Stat.TYPES = [
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
];

Item.Fin = function(type) {
	Item.Stat.call(this, "fin", type);
	this.setRandomStat();
}
Item.Fin.extend(Item.Stat);

Item.Jaws = function(type) {
	Item.Stat.call(this, "jaws", type);
	this.setRandomStat();
}
Item.Jaws.extend(Item.Stat);

Item.Scale = function(type) {
	Item.Stat.call(this, "scale", type);
	this.setRandomStat();
}
Item.Scale.extend(Item.Stat);
