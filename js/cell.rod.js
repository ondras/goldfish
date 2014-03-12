Cell.Rod = function(fisher, visual) {
	Cell.call(this, visual, false);
	
	this._normalChar = visual.ch;
	this._last = false;
	this._fisher = fisher;
}
Cell.Rod.extend(Cell);

Cell.Rod.prototype.setLast = function(last) {
	this._last = last;
	if (this._last) {
		this._visual.ch = "¿";
	} else {
		this._visual.ch = this._normalChar;
	}
	
	return this;
}

Cell.Rod.prototype.isLast = function() {
	return this._last;
}

Cell.Rod.prototype.getFisher = function() {
	return this._fisher;
}
