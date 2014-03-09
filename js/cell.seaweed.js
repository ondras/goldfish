Cell.Seaweed = function(direction) {
	Cell.call(this, {
		ch: direction == 1 ? "(" : ")",
		fg: "#3f3"
	}, false);
}
Cell.Seaweed.extend(Cell);

Cell.Seaweed.prototype.enter = function(being) {
	/* FIXME heal */
	/* FIXME message */
}

