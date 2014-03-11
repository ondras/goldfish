var Inventory = function(being) {
	this._promise = new Promise();
	this._being = being;
	this._offset = new XY();
}

Inventory.prototype.show = function() {
	Game.display.clear(); /* clear all */
	Game.status.update(); /* draw status */
	this._draw();

	window.addEventListener("keydown", this);
	window.addEventListener("keypress", this);

	return this._promise;
}

Inventory.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "keydown":
			if (e.keyCode == 27 || e.keyCode == ROT.VK_Z) { /* close */
				this._hide();
				this._promise.fulfill();
			}
		break;

		case "keypress":
			var code = e.charCode;
			var index = e.charCode - "1".charCodeAt(0);
			if (index < 0 || index >= 8) { return; }

			this._hide();

			var slot = this._being.getSlots()[index];
			new Inventory.Slot(slot, this._being.getItems()).show().then(this.show.bind(this));
		break;
	}
}

Inventory.prototype._hide = function() {
	window.removeEventListener("keydown", this);
	window.removeEventListener("keypress", this);
	Game.text.clear();
}

Inventory.prototype._draw = function() {
	Game.text.clear();
	Game.text.write("Press [%c{#fff}12345678%c{}] to select an item slot. Press %c{#fff}Escape%c{} or %c{#fff}Z%c{} to return back to game.");
	Game.text.flush();

	this._drawFish();
	this._drawLabels();
	this._drawSlots();
}

Inventory.prototype._drawFish = function() {
	var fish = Game.FISH.split("\n");
	var width = 0;
	var height = fish.length;
	fish.forEach(function(line) { width = Math.max(width, line.length); });

	this._offset.x = Math.round((Game.MAP_SIZE.x - width)/2);
	this._offset.y = Game.TEXT_HEIGHT + Math.round((Game.MAP_SIZE.y - height)/2);

	fish.forEach(function(line, index) {
		for (var i=0;i<line.length;i++) {
			var ch = line.charAt(i);
			if (ch.match(/\s/)) { continue; }
			Game.display.draw(this._offset.x + i, this._offset.y + index, ch);
		}
	}, this);
}

Inventory.prototype._drawLabels = function() {
	[
		new XY(28, 13),
		new XY(33, 13),
		new XY(28, 9),
		new XY(33, 9),
		new XY(52, 1),
		new XY(52, 3),
		new XY(45, 21),
		new XY(7, 12)
	].forEach(function(xy, index) {
		Game.display.draw(this._offset.x + xy.x, this._offset.y + xy.y, (index+1), "#fff");
	}, this);
}

Inventory.prototype._drawSlots = function() {
	this._being.getSlots().forEach(function(slot) {
		slot.draw(this._offset);
	}, this);
}
