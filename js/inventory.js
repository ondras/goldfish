var Inventory = function(being) {
	this._promise = new Promise();
	this._being = being;
}

Inventory.prototype.show = function() {
	Game.display.clear(); /* clear all */
	Game.status.update(); /* draw status */
	this._draw();

	window.addEventListener("keydown", this);

	return this._promise;
}

Inventory.prototype.handleEvent = function(e) {
	if (e.keyCode == 27 || e.keyCode == ROT.VK_Z) { /* close */
		this._promise.fulfill();
		return;
	}

}

Inventory.prototype._draw = function() {

}