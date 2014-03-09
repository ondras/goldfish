var Cell = function(visual, blocks) {
	Entity.call(this, visual);
	this._blocks = blocks;
}
Cell.extend(Entity);

Cell.prototype.enter = function(being) {
}

Cell.prototype.activate = function(being) {
}

Cell.prototype.blocks = function() {
	return this._blocks;
}

Cell.wall = new Cell({
	ch: "#",
	fg: [102, 102, 102]
}, true);

Cell.grass = new Cell({
	ch: "#",
	fg: [136, 170, 102]
}, true);

Cell.empty = new Cell({
	ch: ".",
	fg: [51, 51, 51]
}, false);

Cell.water = new Cell({
	ch: "≈",
	fg: [68, 68, 136]
});
