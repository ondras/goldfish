Cell.Staircase = function(up) {
	this._up = up;

	Cell.call(this, {
		ch: this._up ? "<" : ">",
		fg: [100, 100, 200],
		description: "a tunnel leading "  + (this._up ? "to the surface" : "to unknown depths")
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
	if (!this._target.xy) { this._target.level(); } /* callback to generate the level */
	
	Game.switchLevel(this._target.level, this._target.xy);
}
