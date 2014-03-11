Inventory.Slot = function(slot, being) {
	this._slot = slot;
	this._being = being;
	this._items = this._filterItems(this._being.getItems());
	this._promise = new Promise();
}

Inventory.Slot.prototype.show = function() {
	Game.display.clear(); /* clear all */
	Game.status.update(); /* draw status */
	this._draw();

	window.addEventListener("keydown", this);
	window.addEventListener("keypress", this);

	return this._promise;
}

Inventory.Slot.prototype._hide = function() {
	window.removeEventListener("keydown", this);
	window.removeEventListener("keypress", this);
	Game.text.clear();
	this._promise.fulfill();
}

Inventory.Slot.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "keydown":
			if (e.keyCode == 27 || e.keyCode == ROT.VK_Z) { /* close */
				this._hide();
			}
		break;

		case "keypress":
			var code = e.charCode;
			var index = e.charCode - "a".charCodeAt(0);
			if (index < 0 || index >= this._items.length) { return; }

			var item = this._items[index];
			this._slot.setItem(item);

			this._hide();
		break;
	}
}

Inventory.Slot.prototype._draw = function() {
	Game.text.clear();

	var letters = this._items.map(function(item, index) {
		return String.fromCharCode("A".charCodeAt(0) + index);
	}).join("");

	Game.text.write("Press [%c{#fff}" + letters + "%c{}] to select an item. Press %c{#fff}Escape%c{} or %c{#fff}Z%c{} to return back to the inventory.");
	Game.text.flush();

	this._items.forEach(this._drawItem, this);
}

Inventory.Slot.prototype._filterItems = function(items) {
	return items.filter(this._slot.accepts, this._slot);
}

Inventory.Slot.prototype._drawItem = function(item, index) {
	var letter = String.fromCharCode("A".charCodeAt(0) + index);
	var y = index + 3;
	var x = 10;
	var color = "#fff";

	if (this._isItemUsed(item)) {
		color = null;
		Game.display.drawText(x-7, y, "(used)");

	}

	Game.display.draw(x, y, letter, color);
	x += 2;
	Game.display.drawText(x, y, item.getVisual().description);
}

Inventory.Slot.prototype._isItemUsed = function(item) {
	return this._being.getSlots().some(function(slot) {
		return (slot.getItem() == item);
	});
}