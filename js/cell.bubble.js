Cell.Bubble = function() {
	Cell.call(this, {
		ch: "o",
		fg: [40, 40, 255],
		description: "air bubble"
	}, false);
}
Cell.Bubble.extend(Cell);

Cell.Bubble.prototype.enter = function(being) {
	var o2 = being.getStat("o2");
	var maxo2 = being.getStat("maxo2");
	
	if (o2 < maxo2) {
		being.adjustStat("o2", Math.min(Rules.BUBBLE_RESTORE, maxo2-o2));
		if (being == Game.player) { Game.text.write("You restore a bit of oxygen from this bubble."); }
		this._level.setCell(null, this._xy);
	}
}
