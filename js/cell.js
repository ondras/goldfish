var Cell = function(visual, blocks, description) {
	Entity.call(this, visual);
	this._blocks = blocks;
	this._description = description;
}
Cell.extend(Entity);

Cell.prototype.enter = null;
Cell.prototype.activate = null;

Cell.prototype.describe = function() {
	return this._description;
}

Cell.prototype.blocks = function() {
	return this._blocks;
}

Cell.wall = new Cell({
	ch: "#",
	fg: [102, 102, 102]
}, true, "solid rock");

Cell.grass = new Cell({
	ch: "#",
	fg: [136, 170, 102]
}, true, "grass");

Cell.shore = new Cell({
	ch: ".",
	fg: [170, 136, 102]
}, true, "shore");

Cell.empty = new Cell({
	ch: ".",
	fg: [51, 51, 51]
}, false);
Cell.empty.describe = null;

Cell.water = new Cell({
	ch: "≈",
	fg: [68, 68, 136]
}, false);
Cell.water.describe = null;
