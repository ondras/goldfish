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
	fg: "#888"
}, true);

Cell.empty = new Cell({
	ch: ".",
	fg: "#888"
}, false);

Cell.water = new Cell({
	ch: "≈",
	fg: "#33c"
});
