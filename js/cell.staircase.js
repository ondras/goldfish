Cell.Staircase = function(danger) {
	var labels = ["the surface", "a shallow cavern", "a medium-depth cavern", "a deep and dangerous cavern"];
	var colors = [[100, 100, 250], [100, 250, 100], [250, 250, 100], [250, 100, 100]];

	Cell.call(this, {
		ch: danger ? ">" : "<",
		fg: colors[danger],
		description: "tunnel leading to "  + labels[danger]
	}, false);
	
	this._target = {
		level: null,
		xy: null
	};
}
Cell.Staircase.extend(Cell);

Cell.Staircase.prototype.setTarget = function(level, xy) {
	this._target.level = level;
	this._target.xy = xy;
}

Cell.Staircase.prototype.activate = function(being) {
	Progress.staircasesEntered++;
	if (!this._target.xy) { this._target.level(); } /* callback to generate the level */
	Game.switchLevel(this._target.level, this._target.xy);
}
