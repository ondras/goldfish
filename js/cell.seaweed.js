Cell.Seaweed = function(xy) {
	Cell.call(this, {
		ch: ((xy.x+xy.y) % 2 ? "(" : ")"),
		fg: [40, 200, 40]
	}, false);
}
Cell.Seaweed.extend(Cell);

Cell.Seaweed.prototype.enter = function(being) {
	/* FIXME heal */
	/* FIXME message */
}

