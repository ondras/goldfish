var Cell = function(visual, blocks) {
	Entity.call(this, visual);
	this._blocks = blocks;
}
Cell.extend(Entity);

Cell.prototype.enter = null;
Cell.prototype.activate = null;

Cell.prototype.blocks = function() {
	return this._blocks;
}

Cell.wall = new Cell({
	ch: "#",
	fg: [102, 102, 102],
	description: "solid rock"
}, true);

Cell.grass = new Cell({
	ch: "#",
	fg: [120, 150, 80],
	description: "grass"
}, true);

Cell.shore = new Cell({
	ch: ".",
	fg: [170, 136, 102],
	description: "shore"
}, true);

Cell.empty = new Cell({
	ch: ".",
	fg: [51, 51, 51]
}, false);

Cell.water = new Cell({
	ch: "≈",
	fg: [68, 68, 136]
}, false);
