Cell.Staircase = function(up) {
	Cell.call(this, {
		ch: up ? "<" : ">",
		fg: [100, 100, 200]
	}, false, "a tunnel leading "  + (up ? "to the surface" : "to unknown depths"));
	
	this._up = up;
	this._description 
	
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
