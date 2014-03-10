Cell.Staircase = function(up) {
	Cell.call(this, {
		ch: up ? "<" : ">",
		fg: [136, 136, 136]
	}, false);
	
	this._up = up;
	
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

Cell.Staircase.prototype.describe = function() {
	return "a tunnel leading "  + (this._up ? "to the surface" : "to unknown depths") + ".";
}
